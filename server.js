/*
 * server.js — backend ringan untuk portofolio
 *
 * Fungsi:
 *   1. Menyajikan file statis (web.html, mobile.html, css/, js/, img/)
 *   2. Menerima pesan dari form kontak  -> POST /api/contact
 *   3. Menyimpan pesan ke database SQLite -> db/portfolio.db
 *
 * Cara menjalankan (butuh Node.js >= 22.5):
 *   node server.js
 *   lalu buka http://localhost:3000        (web.html)
 *             http://localhost:3000/mobile.html (versi mobile)
 *
 * Catatan: TIDAK memakai paket npm apa pun. Semua modul di bawah ini
 * bawaan Node.js. Tidak ada API key / password yang disimpan di sini.
 * Halaman tetap bisa dibuka langsung tanpa server, tetapi saat itu
 * form kontak tidak dapat mengirim (dan aplikasi akan berpesan jujur).
 */
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DB_DIR = path.join(ROOT, 'db');
const DB_PATH = path.join(DB_DIR, 'portfolio.db');
const MAX_BODY_BYTES = 100 * 1024; // batasi ukuran pesan (100 KB)

/* ===== Database ===== */
fs.mkdirSync(DB_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT    NOT NULL,
        email      TEXT    NOT NULL,
        subject    TEXT,
        message    TEXT    NOT NULL,
        nda        INTEGER NOT NULL DEFAULT 0,
        created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    )
`);

const insertMessage = db.prepare(
    'INSERT INTO messages (name, email, subject, message, nda) VALUES (?, ?, ?, ?, ?)'
);

/* ===== Utilitas ===== */
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.md': 'text/markdown; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8'
};

function sendJson(res, statusCode, payload) {
    const body = JSON.stringify(payload);
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body),
        'Cache-Control': 'no-store'
    });
    res.end(body);
}

function sendText(res, statusCode, text) {
    res.writeHead(statusCode, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Length': Buffer.byteLength(text)
    });
    res.end(text);
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let size = 0;
        const chunks = [];
        req.on('data', (chunk) => {
            size += chunk.length;
            if (size > MAX_BODY_BYTES) {
                reject(new Error('PAYLOAD_TOO_LARGE'));
                req.destroy();
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        req.on('error', reject);
    });
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, maxLength) {
    return String(value == null ? '' : value).trim().slice(0, maxLength);
}

/* ===== Handler form kontak ===== */
async function handleContact(req, res) {
    let raw;
    try {
        raw = await readBody(req);
    } catch (error) {
        sendJson(res, 413, { ok: false, error: 'Pesan terlalu besar.' });
        return;
    }

    let data;
    try {
        data = JSON.parse(raw || '{}');
    } catch (error) {
        sendJson(res, 400, { ok: false, error: 'Format data tidak valid.' });
        return;
    }

    const name = clean(data.name, 200);
    const email = clean(data.email, 320);
    const subject = clean(data.subject, 300);
    const message = clean(data.message, 5000);
    const nda = data.nda ? 1 : 0;

    if (!name || !message || !EMAIL_PATTERN.test(email)) {
        sendJson(res, 400, {
            ok: false,
            error: 'Nama, pesan, dan email yang valid wajib diisi.'
        });
        return;
    }

    try {
        const result = insertMessage.run(name, email, subject, message, nda);
        console.log(
            '[' + new Date().toISOString() + '] pesan baru #' + result.lastInsertRowid +
            ' dari ' + email
        );
        sendJson(res, 201, { ok: true, id: Number(result.lastInsertRowid) });
    } catch (error) {
        console.error('Gagal menyimpan pesan:', error);
        sendJson(res, 500, { ok: false, error: 'Gagal menyimpan pesan.' });
    }
}

/* ===== Server ===== */
const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));

    if (url.pathname === '/api/contact') {
        if (req.method === 'POST') {
            handleContact(req, res).catch((error) => {
                console.error(error);
                sendJson(res, 500, { ok: false, error: 'Kesalahan server.' });
            });
        } else {
            res.writeHead(405, { Allow: 'POST' });
            res.end();
        }
        return;
    }

    // Tidak ada API lain yang diekspos (pesan pribadi tidak bisa diakses publik).
    if (url.pathname.startsWith('/api/')) {
        sendJson(res, 404, { ok: false, error: 'Endpoint tidak ditemukan.' });
        return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { Allow: 'GET, HEAD' });
        res.end();
        return;
    }

    // Routing sederhana: "/" -> web.html
    let relativePath = decodeURIComponent(url.pathname);
    if (relativePath === '/') {
        relativePath = '/web.html';
    }

    const filePath = path.normalize(path.join(ROOT, relativePath));

    // Cegah akses ke luar folder proyek & ke file database.
    if (!filePath.startsWith(ROOT) ||
        /\.(db|db-journal|db-wal|db-shm)$/i.test(filePath)) {
        sendText(res, 403, 'Forbidden');
        return;
    }

    fs.stat(filePath, (statError, stats) => {
        if (statError || !stats.isFile()) {
            sendText(res, 404, 'Not found');
            return;
        }

        const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()] ||
            'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Cache-Control': 'no-cache'
        });

        if (req.method === 'HEAD') {
            res.end();
            return;
        }

        const stream = fs.createReadStream(filePath);
        stream.on('error', () => res.end());
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log('Portofolio berjalan di http://localhost:' + PORT);
    console.log('  web.html    -> http://localhost:' + PORT + '/');
    console.log('  mobile.html -> http://localhost:' + PORT + '/mobile.html');
    console.log('  database    -> ' + DB_PATH);
    console.log('Tekan Ctrl+C untuk berhenti.');
});

function shutdown() {
    db.close();
    server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

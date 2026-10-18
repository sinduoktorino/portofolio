/*
 * scripts/lihat-pesan.js — menampilkan pesan form kontak yang tersimpan.
 *
 * Cara pakai (dari folder portofolio):
 *   node scripts/lihat-pesan.js
 *
 * Pesan disimpan di db/portfolio.db oleh server.js dan sengaja tidak
 * diekspos lewat API publik, jadi hanya bisa dibaca dari komputer ini.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, '..', 'db', 'portfolio.db');

if (!fs.existsSync(dbPath)) {
    console.log('Belum ada file database di: ' + dbPath);
    console.log('Jalankan dulu: node server.js  (database dibuat otomatis).');
    process.exit(0);
}

const db = new DatabaseSync(dbPath);

let rows = [];
try {
    rows = db.prepare(
        'SELECT id, name, email, subject, nda, created_at, message FROM messages ORDER BY id DESC'
    ).all();
} catch (error) {
    console.log('Tabel pesan belum ada (isi form kontak dulu lewat server).');
    db.close();
    process.exit(0);
}

if (rows.length === 0) {
    console.log('Belum ada pesan masuk.');
    db.close();
    process.exit(0);
}

console.log('Total pesan: ' + rows.length + '\n');

for (const row of rows) {
    console.log('-----------------------------------------------');
    console.log('#' + row.id + '  ' + row.created_at + (row.nda ? '  [NDA diminta]' : ''));
    console.log('Nama   : ' + row.name);
    console.log('Email  : ' + row.email);
    if (row.subject) {
        console.log('Subjek : ' + row.subject);
    }
    console.log('Pesan  :');
    console.log(row.message);
}

console.log('-----------------------------------------------');
db.close();

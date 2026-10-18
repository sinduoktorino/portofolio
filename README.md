# Portofolio — Mohamad Tohari Maolana

Situs portofolio statis (HTML + Tailwind CSS) dengan backend kecil berbasis
Node.js + SQLite untuk menerima pesan form kontak.

Versi ini adalah **kode baru** yang diberikan oleh pemilik; kodenya dipisah
menjadi file terpisah (HTML / CSS / JS) dan form kontaknya disambungkan ke
database. Kode asli sebelum dipisah disimpan sebagai cadangan.

---

## 1. Struktur file

```
portofolio/
├─ web.html               Halaman versi desktop / layar lebar
├─ mobile.html            Halaman versi mobile (ada menu drawer)
│
├─ css/
│  └─ style.css           CSS kustom (dipisah dari <style> inline)
│
├─ js/
│  ├─ tailwind-cdn.js     Salinan lokal Tailwind (409 KB) — halaman tetap tampil
│  │                      benar tanpa internet (font Google tetap daring)
│  ├─ tailwind.config.js  Konfigurasi Tailwind (dipisah dari <script> inline)
│  └─ main.js             Interaksi: menu drawer + kirim form kontak ke server
│
├─ server.js              Server statis + API penerima pesan (Node.js, tanpa npm)
├─ db/
│  └─ portfolio.db        Database SQLite (dibuat otomatis saat server jalan)
├─ scripts/
│  └─ lihat-pesan.js      Membaca pesan yang tersimpan (perintah: node scripts/lihat-pesan.js)
│
├─ web.backup.html         Cadangan kode asli web.html SEBELUM dipisah (jangan dihapus)
└─ mobile.backup.html      Cadangan kode asli mobile.html SEBELUM dipisah (jangan dihapus)
```

Catatan: folder `img/` berisi `sindu1.jpeg` + `sindu2.jpeg` (dipakai `web.html`
untuk dua foto portrait) dan `placeholder-foto.svg` (tidak dipakai). Seluruh
gambar di `web.html` kini lokal. `mobile.html` masih memakai 3 gambar dari
internet (`lh3.googleusercontent.com`), semuanya foto portrait (header, hero,
dan about); dua di antaranya sudah difilter hitam-putih oleh kode aslinya.

---

## 2. Cara menjalankan

```bash
cd portofolio
node server.js
```

lalu buka:

- `http://localhost:3000/` → `web.html` (desktop)
- `http://localhost:3000/mobile.html` → `mobile.html` (mobile)

Halaman juga bisa dibuka langsung dengan klik file (`file://...`), tetapi saat
itu **form kontak tidak akan terkirim** — dan halaman akan memberi tahu hal itu
dengan jujur. Backend bisa berhenti kapan saja; pesan yang sudah tersimpan tetap
ada di `db/portfolio.db`.

---

## 3. Apa yang dipisahkan, dan dari mana asalnya

Pemisahan file tidak mengubah nilai apa pun. (Warna kemudian diganti secara
terpisah atas permintaan pemilik — lihat bagian "Palet warna".)

| File | Isi | Asal sebelumnya |
| --- | --- | --- |
| `css/style.css` | `.material-symbols-outlined`, `.contour-silhouette` + `@keyframes morphBlob`, `.glass-lumina` (khusus web) serta `.contour-organic`, `.glass-card`, `.glass-card-interactive`, `.text-gradient-accent` (khusus mobile) | blok `<style>` inline di masing-masing HTML |
| `js/tailwind.config.js` | Konfigurasi tema (warna awal — diganti menjadi biru tua → ungu tua → krem, lihat poin 6; radius, spacing, fontFamily, fontSize) | `<script id="tailwind-config">` inline — isinya identik di kedua file, jadi dipakai bersama |
| `js/main.js` | Buka/tutup menu drawer (`drawer-toggle`, `drawer-close`, `drawer-backdrop`, `nav-drawer`, tombol Esc) + kirim form kontak ke `POST /api/contact` | script drawer inline di `mobile.html`; logika form ditulis untuk form yang ditambahkan |

Urutan pemuatan di `<head>` (penting):

1. `js/tailwind-cdn.js?plugins=forms,container-queries` — mesin Tailwind
   (salinan lokal, jadi tidak memerlukan internet)
2. `js/tailwind.config.js`
3. `css/style.css`

`js/main.js` dipanggil di akhir `<body>`.

---

## 4. Form kontak → database

Bagian `#contact` sekarang punya form (Nama*, Email*, Subjek, Pesan*) selain
tombol `mailto:` dan jadwal call yang sudah ada. Cara kerjanya:

1. `js/main.js` mengirim isi form sebagai JSON ke `POST /api/contact`.
2. `server.js` memvalidasi: nama dan pesan wajib isi, email harus berformat valid.
3. Pesan disimpan ke tabel `messages` di `db/portfolio.db`.
4. Jika server tidak jalan, pengguna diminta tahu pesannya **tidak** terkirim.

Struktur tabel `messages`:

| Kolom | Keterangan |
| --- | --- |
| `id` | Nomor urut otomatis |
| `name`, `email`, `message` | Wajib (validasi sisi server) |
| `subject` | Opsional |
| `nda` | Selalu `0` — form baru tidak punya kolom ini |
| `created_at` | Waktu simpan (UTC) |

Cara membaca pesan yang masuk:

```bash
node scripts/lihat-pesan.js
```

Tidak ada endpoint publik untuk membaca pesan — file `.db` juga diblokir dari
akses langsung lewat server.

---

## 5. Perbaikan yang dilakukan (sudah disetujui)

1. **Form kontak → SQLite** di bagian `#contact` kedua halaman (mengikuti gaya
   masing-masing halaman: kartu gradien untuk `web.html`, `glass-card` untuk
   `mobile.html`).
2. **Pemisahan file** HTML / CSS / JS seperti poin 3.
3. **Link font duplikat dihapus.** Kedua file memuat `Material Symbols Outlined`
   dua kali di `<head>`; sekarang hanya sekali. Tidak ada perubahan tampilan.
4. **Perbaikan jangkauan tautan anchor** di `web.html`: `css/style.css` memuat
   `html { scroll-padding-top: 5rem; }` karena header bersifat *sticky* setinggi
   `h-20` (5rem) dan tanpa ini section yang dituju (mis. `#about`) tertutup
   sebagian oleh header. `mobile.html` tidak terpengaruh karena sudah memakai
   `scroll-mt-24`.
5. **Tailwind dibuat lokal** (`js/tailwind-cdn.js`). Sebelumnya halaman mengambil
   mesin Tailwind dari `cdn.tailwindcss.com`. Bila file dibuka dengan klik dua
   kali (`file://`) dan unduhan itu terhalang (internet mati, ekstensi pemblokir,
   JavaScript dimatikan), seluruh tampilan hilang dan hanya tersisa teks tanpa
   gaya. Sekarang mesin Tailwind ada di dalam proyek, jadi halaman tetap tampil
   benar tanpa internet. Hanya font Google yang masih daring; bila offline, font
   jatuh ke font sistem (teks tetap terbaca).
6. **Palet warna diganti menjadi "biru tua → ungu tua → krem".** Warna merek
   teknologi dan elemen dekoratif (badge, gradien logo, warna kode) tetap/berwarna
   seperti aslinya. Rincian di bagian "Palet warna" (poin 6).
7. **Bagian Projects dibersihkan + Contact dipisahkan.** Karena pemilik belum
   punya proyek nyata, kartu studi kasus contoh (RAYYAN SOLEH NET, SaaS Analytics
   & Billing Platform, DevFlow), tombol filter ("All Work / Web Apps / UI Design"),
   tautan "View All Projects", dan label "3 Selected" dihapus dari kedua halaman,
   lalu diganti kotak catatan **"Projects coming soon"** yang jujur beserta tautan
   ke `#contact`. Markup lamanya masih utuh di `web.backup.html` dan
   `mobile.backup.html`, dan di dalam bagian Projects ditinggalkan komentar
   penanda "CATATAN PEMILIK".
   Sekaligus **bug struktur lama `web.html` diperbaiki**: ada komentar HTML yang
   tidak pernah ditutup (`<!--` tanpa `-->`) sehingga semua markup sesudahnya —
   termasuk `</section>` Projects — ikut terkomentari; akibatnya section
   `#contact` **tersarang di dalam** `#projects` dan lebarnya hanya 585px
   (seharusnya 1280px). Sekarang tiap section berdiri sendiri.
   Sebagai pemisah Projects ↔ Contact, section `#contact` diberi garis atas yang
   lebih jelas: `border-t border-outline-variant/40` (di `mobile.html` garis ini
   memang belum ada sama sekali, kini ditambahkan).

---

## 6. Palet warna (biru tua → ungu tua → krem)

Palet tema: **biru tua → ungu tua → krem / abu-abu lembut** (tema tetap gelap).
Seluruh warna lama (Material 3 ungu/lavender/cyan) sudah tidak dipakai lagi.

| Bagian | Nilai |
| --- | --- |
| Latar & surface (biru tua) | `surface-container-lowest` `#060a14`, `background`/`surface` `#0a1020`, kartu `#10162c` … `#262f57`, terang `#2d3662` |
| Isian & glow (ungu tua / biru) | `secondary-container` `#3a2564` (ungu), `tertiary-container` `#1f2a5c` (biru), `primary-container` `#c9b6f0` (violet lembut) |
| Teks (krem) | `on-surface` / `on-background` `#ece4d8`; teks redup `on-surface-variant` `#b1aec2` (abu-abu lembut) |
| Garis | `outline` `#6f7191`, `outline-variant` `#343b62` |
| Aksen tombol | `primary` `#f2e8d5` (krem) → `primary-container` `#c9b6f0` (violet); teks di atasnya `#241a38` |
| Gradien teks `.text-gradient-accent` | krem `#f2e8d5` → violet `#c9b6f0` → biru `#a6bdf0` |

**Warna merek teknologi tidak memakai token tema** — masing-masing memakai warna
aslinya kembali: Ionic `#00d8ff`, Laravel `#ff2d20`, Vue `#42b883`,
JavaScript `#f7df1e`, PHP `#777bb4`, Tailwind `#38bdf8`, Node `#68a063`,
PostgreSQL `#336791`, Docker `#2496ed`; ikon teknologi di `mobile.html` memakai
emerald/cyan/amber/rose seperti semula. Badge hijau "Available for work" juga
kembali hijau.

Hasil ukur di browser: latar `#0a1020`, teks `#ece4d8` (kontras `15,03:1`), teks
redup `#b1aec2` (`8,76:1`), tombol web `#c9b6f0` + teks `#241a38` (`8,9:1`),
tombol mobile gradien `#f2e8d5 → #c9b6f0`. Tidak ada sisa warna palet lama, tata
letak/ukuran/teks tidak berubah.

Catatan: kartu proyek sudah dihapus (lihat poin 7), jadi `web.html` tidak lagi
memuat gambar dari internet. Yang masih daring hanya 3 foto portrait di
`mobile.html`.

---

## 7. Item yang sengaja TIDAK diubah (perlu keputusan Anda)

- **Dua alamat email berbeda**: `web.html` memakai `mailto:tohari.dev@gmail.com`,
  sedangkan `mobile.html` memakai `mailto:contact@mohamadtohari.dev`.
  Form gagal di `js/main.js` sengaja tidak menyebut salah satunya agar tidak
  memilih yang keliru.
- **Tahun hak cipta beda**: footer `web.html` menulis © 2025, `mobile.html` © 2024.
- **Tautan generik** yang menunjuk ke domain utama, bukan akun asli:
  `https://github.com` (header dan footer), `https://instagram.com`,
  `https://linkedin.com`, `https://calendly.com` (web) dan `https://cal.com`
  (mobile).
- **Nama pemilik tidak konsisten antar halaman.** `mobile.html` masih menyebut
  "Mohamad Tohari Maolana" di 10 tempat (nama di header, hero, kalimat
  "My name is ...", serta hak cipta) dan memakai email
  `contact@mohamadtohari.dev`; `web.html` memakai "Mohamad Sindu Oktorino" dan
  `tohari.dev@gmail.com`. Perlu diputuskan nama mana yang benar sebelum
  diseragamkan.
- **Link nav selalu "Projects"** sebagai tautan aktif (underline) di kedua file.
- **Foto**: `web.html` memakai dua foto lokal (`img/sindu1.jpeg`,
  `img/sindu2.jpeg`) dan tidak lagi memuat gambar dari internet. `mobile.html`
  masih memakai 3 foto portrait dari `lh3.googleusercontent.com`.

---

## 8. Kembali ke versi sebelum dipisah

```bash
cd portofolio
copy web.backup.html web.html
copy mobile.backup.html mobile.html
```

(Project ini bukan repository git, jadi file cadangan di atas adalah satu-satunya
jalur kembali. Perhatikan: cara ini mengembalikan kode **asli sebelum dipisah**,
sehingga sekaligus membatalkan pemisahan file, form kontak, Tailwind lokal,
perubahan warna (biru tua → ungu tua → krem), catatan Projects, dan garis
pemisah Contact.)

---

## 9. Pemecahan masalah

**1. Halaman tampil tanpa gaya (teks polos, tanpa warna/tata letak)**

Penyebab tersering: file `js/tailwind-cdn.js` tidak ikut terbawa (mis. hanya
file HTML-nya yang dipindah/dikirim ke tempat lain). Pastikan strukturnya utuh:
HTML + folder `css/` + folder `js/` selalu menyatu dalam satu folder.

Catatan saat offline: tulisan, warna, dan tata letak tetap benar. `web.html`
seluruh gambarnya sudah lokal, jadi tampil utuh tanpa internet. `mobile.html`
masih mengambil 3 foto portrait dari internet (`lh3.googleusercontent.com`)
sehingga saat offline foto itu tidak tampil — bukan kerusakan, hanya perlu
internet atau gambarnya perlu disimpan lokal.

**2. Form kontak tidak mengirim / muncul peringatan "Could NOT reach the server"**

Itu memang perilakunya bila dibuka langsung dengan klik dua kali (`file://`).
Jalankan `node server.js` lalu buka `http://localhost:3000/`. Pesan hanya bisa
masuk lewat server.

**3. Membuka versi mobile dari HP**

`localhost` di HP menunjuk ke HP itu sendiri, bukan ke komputer. Gunakan alamat
IP komputer, misalnya `http://192.168.1.10:3000/mobile.html` (lihat IP Wi-Fi
komputer di pengaturan jaringan). Windows Firewall mungkin perlu diizinkan
untuk Node.js saat pertama kali dijalankan.

**4. Halaman tampak seperti versi lama**

Tekan Ctrl+Shift+R (muat ulang tanpa cache), lalu pastikan yang dibuka adalah
`web.html` / `mobile.html`, bukan `web.backup.html` atau `mobile.backup.html`.

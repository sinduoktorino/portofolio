/*
 * main.js — interaksi bersama untuk web.html & mobile.html
 * Tanpa library eksternal.
 *
 * Isi:
 *   1. Menu drawer navigasi (khusus mobile.html; di web.html bagian ini
 *      otomatis dilewati karena elemennya tidak ada).
 *   2. Pengiriman form kontak (#contactForm) ke backend Node (server.js)
 *      melalui POST /api/contact, lalu disimpan ke SQLite (db/portfolio.db).
 *
 * PENTING: bila server tidak berjalan (mis. halaman dibuka langsung lewat
 * file://), pesan TIDAK terkirim dan pengguna diberi tahu dengan jujur.
 */
(function () {
    'use strict';

    /* ===== 1. Navigasi drawer (mobile.html) =====
     * ID yang dipakai di markup:
     *   drawer-toggle    -> tombol hamburger
     *   drawer-close     -> tombol tutup di dalam panel
     *   drawer-backdrop  -> lapisan gelap di belakang panel
     *   nav-drawer       -> panel menu yang meluncur dari kanan
     */
    var toggleBtn = document.getElementById('drawer-toggle');
    var closeBtn = document.getElementById('drawer-close');
    var backdrop = document.getElementById('drawer-backdrop');
    var drawer = document.getElementById('nav-drawer');

    function openDrawer() {
        if (!backdrop || !drawer) return;
        backdrop.classList.remove('hidden');
        setTimeout(function () {
            backdrop.classList.remove('opacity-0');
            drawer.classList.remove('translate-x-full');
        }, 10);
        document.body.classList.add('overflow-hidden');
    }

    function closeDrawer() {
        if (!backdrop || !drawer) return;
        backdrop.classList.add('opacity-0');
        drawer.classList.add('translate-x-full');
        setTimeout(function () {
            backdrop.classList.add('hidden');
        }, 300);
        document.body.classList.remove('overflow-hidden');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    if (backdrop) {
        backdrop.addEventListener('click', function (event) {
            if (event.target === backdrop) closeDrawer();
        });
    }

    // Tutup drawer saat salah satu tautan navigasi di dalamnya diklik.
    if (drawer) {
        drawer.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeDrawer);
        });
    }

    // Tutup drawer dengan tombol Escape.
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeDrawer();
    });

    /* ===== 2. Form kontak -> database =====
     * Data dikirim sebagai JSON ke POST /api/contact dan disimpan ke SQLite
     * oleh server.js. Field yang dikirim mengikuti atribut "name" pada form:
     * name, email, subject, message.
     */
    var form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var payload = {};
            new FormData(form).forEach(function (value, key) {
                payload[key] = value;
            });

            var successMsg = form.getAttribute('data-success-message') ||
                'Message saved to the database. Thank you!';

            // Pesan jujur: tanpa server, pesan benar-benar tidak terkirim.
            var failMsg = form.getAttribute('data-fail-message') ||
                'Could NOT reach the server — your message was NOT sent.\n\n' +
                'Start the backend first (run: node server.js), or use the ' +
                'email button on this page.';

            var submitBtn = form.querySelector('[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(function (res) {
                    return res.json().then(function (body) {
                        if (!res.ok || !body || body.ok !== true) {
                            throw new Error(
                                (body && body.error) || ('HTTP ' + res.status)
                            );
                        }
                        return body;
                    });
                })
                .then(function () {
                    alert(successMsg);
                    form.reset();
                })
                .catch(function (error) {
                    alert(failMsg + (error && error.message ? '\n\n(' + error.message + ')' : ''));
                })
                .finally(function () {
                    if (submitBtn) submitBtn.disabled = false;
                });
        });
    }
})();

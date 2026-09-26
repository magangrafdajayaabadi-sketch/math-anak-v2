# Math Fun Quest — Game Matematika Anak (White-Label)

Game kuis matematika interaktif untuk anak SD usia 6–12 tahun, berbasis Modul
Matematika Anak. Soal **dibangkitkan acak setiap ronde** (bukan daftar soal
tetap), dan setiap jawaban disertai penjelasan "cara mengerjakan".

Proyek ini **100% static** (HTML + CSS + JS murni) — tanpa build step, tanpa
database, tanpa npm. Bisa di-deploy ke Vercel dalam hitungan menit dan mudah
di-white-label untuk dijual ulang.

> 📖 **[Baca PANDUAN.md](PANDUAN.md)** untuk panduan lengkap: deploy, cara main
> tiap mode, sistem skor, panel admin, dan batasan yang perlu diketahui sebelum
> dijual.

---

## Struktur Proyek

```
math-fun-quest/
├── index.html          → Halaman game (isi nama → level → fokus → game)
├── admin.html          → Panel admin (white-label & pengaturan)
├── config.js           → Konfigurasi default (EDIT FILE INI untuk branding permanen)
├── manifest.webmanifest→ Identitas aplikasi saat dipasang di HP/tablet (PWA)
├── sw.js               → Service worker (bisa dipasang + jalan offline)
├── logo.png            → Gambar sumber untuk ikon aplikasi
├── vercel.json         → Konfigurasi Vercel (clean URL + security headers)
├── assets/
│   ├── style.css       → Semua styling (warna via CSS variables)
│   ├── questions.js    → Mesin soal acak 4 level (62 generator soal)
│   ├── game.js         → Logika game, 3 mode main, skor, lencana, papan juara
│   ├── pwa.js          → Pendaftaran service worker + tombol "Pasang"
│   ├── admin.js        → Logika panel admin
│   └── icons/          → Ikon aplikasi hasil olahan logo.png (96–512px)
├── PANDUAN.md          → Panduan lengkap (deploy, cara main, admin)
└── README.md
```

---

## Deploy ke Vercel

Tidak ada build command dan tidak ada environment variable yang diperlukan.

```bash
# Vercel CLI
npm i -g vercel
vercel --prod
```

Atau lewat GitHub: **Add New → Project → Import**, Framework Preset **Other**,
Build Command & Output Directory dikosongkan.

**Sebelum deploy, ganti `adminPassword` di [config.js](config.js).**

Setelah live:

| URL | Isi |
|---|---|
| `/` | Game (untuk anak) |
| `/admin` | Panel admin |

Detail ketiga opsi deploy ada di [PANDUAN.md](PANDUAN.md#bagian-1--deploy-ke-vercel).

---

## Fitur

### Untuk anak

Aplikasi langsung membuka isian nama, lalu memandu 3 langkah: **pilih level → pilih fokus materi → pilih game**.

**3 mode permainan:**
- **Main Sendiri** — pilih level, lalu fokus materi, lalu kartu game (ada "Campur" di tiap tingkat). Pakai nyawa ❤️ — habis nyawa, ronde berakhir.
- **👥 Main Bareng** — 2–4 pemain bergiliran di satu perangkat, ada podium juara. Cocok untuk guru & seisi kelas.
- **🎯 Tantangan Teman** — buat kode, bagikan link. Teman di perangkat lain dapat **soal yang sama persis** (kode dipakai sebagai seed pengacak), lalu bandingkan skor.

**4 level, 62 jenis soal, 19 fokus materi:**

| Level | Nama | Usia | Fokus materi | Jumlah game |
|---|---|---|---|---|
| 1 | Basic Math | 6–7 th | Hitung Dasar · Kenal Bilangan · Pola & Bentuk · Sehari-hari · Soal Cerita | 16 |
| 2 | Daily Math | 8–9 th | Kali & Bagi · Waktu & Uang · Pengukuran · Kelipatan & Faktor · Pecahan & Bangun · Soal Cerita | 17 |
| 3 | Smart Math | 10–12 th | Pecahan & Desimal · Persen & Diskon · Operasi Bilangan · Geometri · Skala & Rasio · Data & Logika | 16 |
| 4 | Master Math | lanjut | Aljabar & Pola · Geometri Lanjut · Matematika Terapan · Data & Peluang | 13 |

**Lainnya:** penjelasan cara mengerjakan di tiap soal · bonus streak & bonus
kecepatan · bintang 1–5 · 5 lencana pencapaian · maskot yang bereaksi · confetti
· efek suara (bisa dimatikan) · papan juara top-10 · responsif di HP, tablet,
dan desktop.

### Bisa dipasang seperti aplikasi (PWA)

Setelah dibuka lewat HTTPS (mis. domain Vercel), aplikasi bisa **dipasang di HP,
tablet, dan desktop** — punya ikon sendiri di layar utama, terbuka layar penuh
tanpa alamat browser, dan **tetap bisa dimainkan tanpa internet**.

- **Android / Chrome / Edge** — tombol **⬇️ Pasang** muncul sendiri di header, atau lewat menu ⋮ → "Pasang aplikasi".
- **iPhone / iPad (Safari)** — tombol ⬇️ menampilkan petunjuk: Bagikan → "Tambahkan ke Layar Utama".
- Ikon aplikasi diambil dari `assets/icons/` (hasil olahan [logo.png](logo.png)), termasuk versi *maskable* untuk Android dan `apple-touch-icon` untuk iOS.
- Unduhan pertama yang disimpan untuk mode offline hanya ±240 KB.

### Untuk admin

Login dengan password → white-label (nama brand, tagline, logo, 4 warna tema,
footer, tombol WhatsApp) · pengaturan game (jumlah soal 5–20, level aktif, nama
level, on/off papan juara & suara) · kelola papan juara · ganti password ·
export/import konfigurasi JSON.

---

## White-Label

### Permanen — edit [config.js](config.js)

Untuk perubahan yang berlaku bagi **semua pengunjung**. Edit, lalu deploy ulang:

```js
appName: "Nama Brand Anda",
tagline: "Tagline brand Anda",
logoUrl: "https://domain.com/logo.png",   // atau "" untuk logo huruf otomatis
colorPrimary: "#5B4FD6",
colorAccent:  "#FFB627",
footerText: "© 2026 Brand Anda",
contactWa: "6281234567890",               // tanpa +
hearts: 3,
enabledLevels: [1, 2, 3, 4],
adminPassword: "GANTI-PASSWORD-INI"
```

### Cepat — lewat Panel Admin (`/admin`)

Pengaturan dari panel admin tersimpan di **localStorage browser**, jadi hanya
berlaku di browser tempat pengaturan dibuat — cocok untuk uji coba cepat, bukan
untuk perubahan permanen. Gunakan tab **Backup** untuk menyalin JSON-nya, lalu
tempel ke `config.js`.

---

## Catatan Keamanan (baca sebelum dijual)

- Login admin berjalan **di sisi browser**. Password ada di dalam file JavaScript
  yang bisa dibaca publik. Cukup untuk melindungi pengaturan tampilan game, tetapi
  **bukan** proteksi tingkat server. Jangan simpan data sensitif di aplikasi ini.
- Selalu ganti `adminPassword` di `config.js` sebelum deploy.
- Papan juara, bintang, lencana, dan pengaturan admin memakai localStorage —
  **tidak ada data yang dikirim ke server mana pun**. Konsekuensinya: papan juara
  tidak global (tiap perangkat punya papannya sendiri), dan menghapus data browser
  akan menghapus semua progres.

---

## Ide Pengembangan (untuk versi premium)

- **Papan juara global** — tambah backend ringan (Vercel KV / Upstash / Google
  Apps Script + Sheets). Fungsi `saveScore()` di `assets/game.js` sudah terisolasi
  dan tinggal ditukar dengan panggilan API.
- **Login admin sisi server** — pindahkan ke Vercel Serverless Function agar
  password tidak terekspos.
- **Laporan per topik untuk orang tua/guru** — field `topic` sudah ada di setiap soal.
- **Tambah bank soal** — tambahkan generator baru di array `L1`–`L4` pada
  `assets/questions.js`, daftarkan topiknya di `CATALOG` pada `assets/game.js`
  agar muncul sebagai kartu game, lalu masukkan ke salah satu kelompok di `FOCUS`
  agar bisa dijangkau dari langkah "Pilih Fokus Materi". Nama topik harus sama
  persis di ketiga tempat.
- **Mode ujian** dengan timer per soal.

---

Selamat berjualan! 🎉

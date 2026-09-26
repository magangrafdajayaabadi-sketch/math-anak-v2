# Panduan Lengkap — Math Fun Quest

Panduan ini mencakup tiga hal: **cara deploy ke Vercel**, **cara menggunakan game**, dan **cara mengelola / white-label lewat panel admin**.

Aplikasi ini 100% static (HTML + CSS + JavaScript murni). Tidak ada `package.json`, tidak ada build step, tidak ada database, tidak ada environment variable. Semua data (skor, pengaturan admin, nama pemain) disimpan di **localStorage browser masing-masing pemain**.

---

## Bagian 1 — Deploy ke Vercel

### Persiapan sebelum deploy (WAJIB)

Buka [config.js](config.js) dan ganti minimal dua hal ini:

```js
adminPassword: "admin123",   // ← GANTI. Ini password default yang diketahui publik.
footerText: "© 2026 Nama Brand Anda",
```

Password admin tersimpan di file JavaScript yang bisa dibaca siapa saja lewat "View Source". Ini cukup untuk mencegah orang iseng mengubah tampilan game, tapi **bukan keamanan tingkat server**. Jangan pernah menyimpan data sensitif di aplikasi ini.

### Opsi A — Vercel CLI (paling cepat)

```bash
npm i -g vercel
cd math-anak-main
vercel          # deploy preview, ikuti pertanyaannya
vercel --prod   # deploy ke domain produksi
```

Saat ditanya, jawab seperti ini:

| Pertanyaan Vercel | Jawaban |
|---|---|
| Set up and deploy? | `Y` |
| Which scope? | pilih akun Anda |
| Link to existing project? | `N` |
| Project name | bebas, mis. `math-fun-quest` |
| In which directory is your code located? | `./` |
| Want to modify settings? | `N` |

### Opsi B — Lewat GitHub (disarankan untuk update rutin)

1. Push folder ini ke sebuah repository GitHub.
2. Di Vercel: **Add New → Project → Import** repository tersebut.
3. Framework Preset: **Other**. Build Command dan Output Directory **dikosongkan saja**.
4. Klik **Deploy**.

Setelah ini, setiap `git push` ke branch utama otomatis men-deploy versi baru.

### Opsi C — Drag & drop (tanpa Git, tanpa terminal)

1. Buka [vercel.com](https://vercel.com), login.
2. **Add New → Project**, pilih opsi upload/deploy manual.
3. Drag & drop folder proyek ini.
4. **Deploy**.

Kekurangannya: setiap update harus drag & drop ulang.

### Yang dilakukan `vercel.json`

File [vercel.json](vercel.json) sudah disiapkan dan tidak perlu diubah:

- `cleanUrls: true` → `/admin` bekerja tanpa perlu menulis `/admin.html`.
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).

### Setelah deploy

| URL | Isi |
|---|---|
| `https://domain-anda.vercel.app/` | Game (untuk anak) |
| `https://domain-anda.vercel.app/admin` | Panel admin |

Untuk memasang domain sendiri: **Project → Settings → Domains → Add**, lalu arahkan DNS sesuai instruksi Vercel.

### Menjalankan di komputer sendiri dulu (opsional)

Jangan buka `index.html` lewat double-click (protokol `file://` bisa bermasalah). Jalankan server lokal:

```bash
npx serve .
# atau
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

---

## Bagian 2 — Cara Menggunakan Game

### Alur untuk pemain

1. **Tulis nama** → layar pertama saat aplikasi dibuka. Nama dipakai untuk papan juara dan tersimpan di browser.
2. **Pilih cara main** → tiga mode (lihat di bawah). Untuk main sendiri, lanjut ke langkah 3.
3. **Langkah 1 · Pilih Level** → Basic / Daily / Smart / Master sesuai usia.
4. **Langkah 2 · Pilih Fokus Materi** → kelompok materi di level itu (mis. "Waktu & Uang"), atau **🎲 Campur Semua** untuk langsung main dengan semua materi level tersebut.
5. **Langkah 3 · Pilih Game** → kartu per topik, atau **🎲 Campur** untuk mengacak topik dalam fokus itu saja.
6. **Jawab soal** → tiap jawaban langsung diberi umpan balik + **"Cara mengerjakan"**, baik saat benar maupun salah.
7. **Lihat hasil** → bintang 1–5, skor, streak terbaik, dan lencana baru bila terbuka.

Tombol 🏠 di kanan atas kembali ke beranda (akan minta konfirmasi bila ronde sedang berjalan — skor ronde tidak disimpan bila keluar). Tombol 🔊 menyalakan/mematikan efek suara.

### Tiga mode permainan

**1. Main Sendiri (solo)**
Ikuti tiga langkah: level → fokus materi → kartu game. Ada pilihan **🎲 Campur Semua** di langkah fokus (semua materi level itu) dan **🎲 Campur** di langkah game (acak dalam satu fokus saja), selain kartu per topik (mis. Pecahan, Uang, Aljabar). Mode ini memakai **nyawa** — 3 hati secara default; kalau habis, ronde langsung berakhir.

**2. 👥 Main Bareng (2–4 pemain, satu perangkat)**
Untuk guru di kelas atau anak bermain dengan saudara. Masukkan 2–4 nama, pilih level, lalu pemain **bergiliran di perangkat yang sama**. Ada layar serah-terima ("Giliran Budi!") di antara tiap soal, dan **podium juara** di akhir. Mode ini tidak memakai nyawa.

**3. 🎯 Tantangan Teman (beda perangkat, soal identik)**
Buat kode tantangan (mis. `2PZ7K`), bagikan kode atau linknya. Siapa pun yang memakai kode itu akan mendapat **soal yang sama persis** — karena kode dipakai sebagai *seed* untuk pengacak soal. Cocok untuk guru menantang seisi kelas lalu membandingkan skor secara adil.

- Angka pertama pada kode = levelnya (`2PZ7K` → Level 2).
- Link undangan berbentuk `https://domain-anda.vercel.app/?ch=2PZ7K` dan langsung membuka layar tantangan.
- Tantangan selalu **10 soal**, tetap, tidak terpengaruh setelan "jumlah soal per ronde" — supaya adil di semua perangkat.
- **Penting:** papan skor tantangan hanya berisi skor dari **perangkat itu sendiri**. Skor teman di HP lain tidak muncul di layar Anda. Bandingkan skor lewat tombol **📤 Bagikan skor** (WhatsApp / share sheet HP).

### Sistem skor

| Komponen | Nilai |
|---|---|
| Jawaban benar | +10 |
| Bonus streak | +1 per jawaban benar beruntun (maksimal +5) |
| Bonus kecepatan ⚡ | hingga +8, mengecil selama 8 detik pertama |

Bintang hasil ronde ditentukan dari persentase jawaban benar: 95%+ = ★★★★★, 80% = ★★★★, 60% = ★★★, 35% = ★★, di bawah itu ★.

Bintang di header (⭐ pojok kanan atas) adalah **total kumulatif** semua ronde solo & tantangan, tersimpan permanen di browser.

### Lima lencana

| Lencana | Cara membukanya |
|---|---|
| 🏆 Sempurna! | Semua jawaban benar dalam satu ronde |
| 🔥 Beruntun 5! | Benar 5 kali berturut-turut |
| ⚡ Si Kilat | Dapat bonus kecepatan 3 kali dalam satu ronde |
| 🛡️ Tanpa Luka | Selesaikan ronde tanpa kehilangan nyawa |
| 💯 Kolektor Bintang | Kumpulkan total 100 bintang |

### Materi soal (4 level, 62 jenis soal dalam 19 fokus materi)

| Level | Nama | Usia | Fokus materi (jumlah game) |
|---|---|---|---|
| 1 | Basic Math | 6–7 th | Hitung Dasar (5) · Kenal Bilangan (6) · Pola & Bentuk (2) · Sehari-hari (2) · Soal Cerita (1) |
| 2 | Daily Math | 8–9 th | Kali & Bagi (3) · Waktu & Uang (4) · Pengukuran (4) · Kelipatan & Faktor (3) · Pecahan & Bangun (2) · Soal Cerita (1) |
| 3 | Smart Math | 10–12 th | Pecahan & Desimal (2) · Persen & Diskon (2) · Operasi Bilangan (5) · Geometri (2) · Skala & Rasio (2) · Data & Logika (3) |
| 4 | Master Math | lanjut | Aljabar & Pola (3) · Geometri Lanjut (4) · Matematika Terapan (3) · Data & Peluang (3) |

Soal **dibangkitkan secara acak setiap ronde** oleh generator di [assets/questions.js](assets/questions.js) — bukan diambil dari daftar soal tetap. Artinya anak tidak bisa menghafal jawaban, dan game bisa dimainkan berulang kali.

### Memasang aplikasi di HP & tablet (PWA)

Aplikasi ini bisa dipasang seperti aplikasi biasa: punya ikon di layar utama, terbuka **layar penuh tanpa alamat browser**, dan **tetap bisa dimainkan tanpa internet** setelah sekali dibuka.

**Syarat:** dibuka lewat **HTTPS** (domain Vercel sudah otomatis HTTPS). Membuka file `index.html` langsung dari komputer (`file://`) tidak bisa dipasang.

| Perangkat | Cara memasang |
|---|---|
| Android (Chrome/Edge/Samsung Internet) | Ketuk tombol **⬇️ Pasang** di pojok kanan atas, atau menu ⋮ → **"Pasang aplikasi"** |
| iPhone & iPad (Safari) | Ketuk **Bagikan** (kotak dengan panah ke atas) → **"Tambahkan ke Layar Utama"** → **Tambah**. Tombol ⬇️ di aplikasi juga menampilkan petunjuk ini |
| Windows / macOS (Chrome/Edge) | Ikon **⊕ / monitor** di ujung kanan kolom alamat, atau tombol **⬇️ Pasang** di header |

**Mode offline:** berkas inti (±240 KB) disimpan saat pemasangan, jadi soal tetap muncul walau tidak ada sinyal. Papan juara dan bintang memang sudah tersimpan di perangkat masing-masing, jadi ikut jalan offline. Hanya **Tantangan Teman** yang butuh internet untuk membagikan kode/link.

**Mengganti ikon aplikasi.** Ikon diambil dari berkas di `assets/icons/`, bukan dari setelan logo di panel admin (setelan itu hanya mengubah logo kecil di header). Untuk mengganti: siapkan gambar persegi (minimal 512×512), lalu timpa berkas-berkas ini dengan ukuran yang sama persis:

| Berkas | Ukuran | Dipakai untuk |
|---|---|---|
| `icon-192.png`, `icon-512.png` | 192, 512 | Ikon umum Android & desktop |
| `icon-maskable-192.png`, `icon-maskable-512.png` | 192, 512 | Android (dipotong bulat — beri latar penuh, jangan transparan) |
| `apple-touch-icon.png` | 180 | iPhone & iPad (**jangan transparan**, nanti jadi hitam) |
| `favicon-32.png`, `icon-96.png` | 32, 96 | Ikon tab browser |

**Setelah memperbarui aplikasi (deploy versi baru):** naikkan angka `VERSI` di [sw.js](sw.js) (mis. `"mfq-v1"` → `"mfq-v2"`). Tanpa itu, perangkat yang sudah memasang aplikasi bisa tetap memakai berkas lama dari simpanan offline.

---

## Bagian 3 — Panel Admin & White-Label

### Masuk ke panel

Buka `https://domain-anda.vercel.app/admin`, masukkan password dari `adminPassword` di [config.js](config.js). Sesi login berlaku selama tab browser masih terbuka.

### Yang bisa diatur

- **Branding** — nama brand, tagline, URL logo, 4 warna tema (dengan pratinjau langsung), teks footer, tombol WhatsApp.
- **Pengaturan Game** — jumlah soal per ronde (5–20), jumlah nyawa (1–9), level yang aktif (1–4), nama tiap level, on/off papan juara, on/off suara.
- **Papan Juara** — lihat & hapus semua skor di browser ini.
- **Keamanan** — ganti password admin (minimal 6 karakter).
- **Backup** — export/import konfigurasi dalam bentuk JSON.

### ⚠️ Yang WAJIB dipahami: perubahan dari panel admin hanya berlaku di browser Anda sendiri

Panel admin menyimpan pengaturan ke `localStorage`, bukan ke server. Pengunjung lain tetap melihat nilai default dari `config.js`. Panel admin cocok untuk **uji coba cepat**, bukan untuk perubahan permanen.

Untuk membuat perubahan permanen bagi **semua pengunjung**:

1. Atur semuanya lewat panel admin sampai puas.
2. Buka tab **Backup** → **Salin ke clipboard**.
3. Tempel nilai-nilai tersebut ke `window.APP_CONFIG` di [config.js](config.js).
4. Deploy ulang (`vercel --prod`, atau `git push` bila pakai GitHub).

Kalau pengaturan di browser Anda terlanjur kacau, buka tab **Backup** → **"Kembalikan ke default config.js"** untuk menghapus semua override.

### Pengaturan yang hanya ada di `config.js`

Satu setelan tidak punya kolom di panel admin dan harus diubah lewat file:

```js
levelAges: { 4: "Tingkat lanjut" },   // keterangan usia tiap level
```

### Contoh white-label lengkap

```js
window.APP_CONFIG = {
  appName: "Bimbel Cerdas",
  tagline: "Matematika jadi mudah dan menyenangkan!",
  logoUrl: "https://bimbelcerdas.id/logo.png",
  colorPrimary: "#0F766E",
  colorAccent:  "#F59E0B",
  colorSuccess: "#1D9E75",
  colorDanger:  "#E24B4A",
  footerText: "© 2026 Bimbel Cerdas",
  contactWa: "6281234567890",
  contactLabel: "Daftar Les",
  questionsPerRound: 10,
  hearts: 3,
  enabledLevels: [1, 2, 3, 4],
  showLeaderboard: true,
  soundEnabled: true,
  levelNames: { 1: "Kelas 1-2", 2: "Kelas 3-4", 3: "Kelas 5-6", 4: "Olimpiade" },
  levelAges:  { 1: "Usia 6-7 tahun", 2: "Usia 8-9 tahun", 3: "Usia 10-12 tahun", 4: "Tingkat lanjut" },
  adminPassword: "PasswordRahasiaAnda123"
};
```

---

## Bagian 4 — Batasan yang Perlu Diketahui

Ini penting dipahami sebelum aplikasi dijual atau dipakai di sekolah:

- **Papan juara tidak global.** Skor tersimpan di localStorage tiap perangkat. Anak di HP A tidak akan melihat skor anak di HP B. Ini berlaku juga untuk papan skor mode Tantangan.
- **Login admin bersifat client-side.** Password ada di dalam file JavaScript yang bisa dibaca publik. Cukup untuk mencegah keisengan, bukan proteksi sesungguhnya.
- **Menghapus data browser = menghapus semua progres.** Bintang, lencana, papan juara, dan pengaturan admin akan hilang bila cache/localStorage dibersihkan.
- Tidak ada data apa pun yang dikirim ke server mana pun — dari sisi privasi anak, ini justru kelebihan.

### Ide pengembangan

- **Papan juara global** — tambahkan backend ringan (Vercel KV / Upstash / Google Sheets via Apps Script). Fungsi `saveScore()` di [assets/game.js:121](assets/game.js#L121) sudah terisolasi dan tinggal diganti dengan panggilan API.
- **Login admin di sisi server** — pindahkan ke Vercel Serverless Function agar password tidak terekspos.
- **Laporan per topik untuk guru/orang tua** — setiap soal sudah membawa field `topic`, tinggal diagregasi.
- **Menambah bank soal** — tiga langkah: (1) tambahkan fungsi generator baru ke array `L1`–`L4` di [assets/questions.js](assets/questions.js); (2) daftarkan topiknya di `CATALOG` pada [assets/game.js](assets/game.js) agar muncul sebagai kartu game; (3) masukkan nama topik itu ke salah satu kelompok `FOCUS` agar bisa dijangkau dari langkah "Pilih Fokus Materi". Nama topik harus **sama persis** di ketiga tempat.

---

## Ringkasan Cepat

```bash
# 1. Ganti adminPassword di config.js
# 2. Deploy
npm i -g vercel
vercel --prod

# 3. Buka https://domain-anda.vercel.app        → game
#    Buka https://domain-anda.vercel.app/admin  → panel admin
```

Tidak ada build command. Tidak ada environment variable. Selesai. 🎉

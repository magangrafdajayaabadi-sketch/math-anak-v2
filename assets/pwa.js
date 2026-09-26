/* Math Fun Quest — pemasangan aplikasi (PWA)
   1. Mendaftarkan service worker (offline + syarat "bisa dipasang").
   2. Menampilkan tombol "Pasang" di header saat browser menawarkan pemasangan.
   3. Di iPhone/iPad, memberi petunjuk manual lewat menu Bagikan. */
(function () {
  "use strict";

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () { /* abaikan */ });
    });
  }

  var btn = document.getElementById("btn-install");
  if (!btn) return;

  var prompt = null;
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  var terpasang = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
    navigator.standalone === true;   // sudah dibuka sebagai aplikasi terpasang

  function tampil(on) { btn.style.display = on ? "" : "none"; }

  // Android/desktop: browser memberi tahu bahwa aplikasi bisa dipasang.
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    prompt = e;
    if (!terpasang) tampil(true);
  });

  window.addEventListener("appinstalled", function () {
    prompt = null;
    tampil(false);
  });

  // iOS tidak punya beforeinstallprompt — tampilkan tombol petunjuk.
  if (iOS && !terpasang) tampil(true);

  btn.addEventListener("click", function () {
    if (prompt) {
      prompt.prompt();
      prompt.userChoice.then(function () { prompt = null; tampil(false); });
      return;
    }
    if (iOS) {
      window.alert("Cara memasang di iPhone/iPad:\n\n" +
        "1. Ketuk tombol Bagikan (kotak dengan panah ke atas) di bawah layar.\n" +
        "2. Pilih \"Tambahkan ke Layar Utama\".\n" +
        "3. Ketuk \"Tambah\".");
      return;
    }
    window.alert("Buka menu browser (⋮), lalu pilih \"Pasang aplikasi\" atau \"Tambahkan ke layar utama\".");
  });
})();

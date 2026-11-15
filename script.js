document.addEventListener('DOMContentLoaded', () => {
  const screenTyping  = document.getElementById('screenTyping');
  const screenLove    = document.getElementById('screenLove');
  const screenSlides  = document.getElementById('screenSlides');
  const screenMessage = document.getElementById('screenMessage');
  const screenThanks  = document.getElementById('screenThanks');
  const typedText     = document.getElementById('typedText');
  const loveRainBox   = document.getElementById('loveRain');
  const music         = document.getElementById('bgMusic');
  const messageInner  = document.querySelector('.message-inner');
  const messageText   = document.getElementById('messageText');
  const stickerStage  = document.getElementById('stickerStage');
  
  // Elemen overlay lama (kalau masih ada di HTML, kita sembunyikan)
  const overlay = document.getElementById('musicOverlay');
  if (overlay) overlay.style.display = 'none';

  // Bikin tombol musik baru secara otomatis lewat JS
  const musicBtn = document.createElement('button');
  musicBtn.id = 'musicBtn';
  musicBtn.innerHTML = '🎵';
  document.body.appendChild(musicBtn);

  /* ================= LOGIKA MUSIK ================= */
  let musicPlaying = false;

  function toggleMusic() {
    if (!music) return;
    if (musicPlaying) {
      music.pause();
      musicBtn.classList.remove('playing');
      musicBtn.innerHTML = '🎵';
    } else {
      music.play().then(() => {
        musicBtn.classList.add('playing');
        musicBtn.innerHTML = '⏸️';
      }).catch(err => console.warn('Gagal putar:', err));
    }
    musicPlaying = !musicPlaying;
  }

  // Klik tombol muter/nggak
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // biar gak bentrok sama klik layar
    toggleMusic();
  });

  /* ================= LAYAR 1: KETIKAN ================= */
  const TEXT = 'Untuk Orang yang ku cintai';
  function typeWriter(text, el, speed, callback) {
    let i = 0;
    el.textContent = '';
    const timer = setInterval(() => {
      el.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        if (callback) callback();
      }
    }, 110);
  }

  setTimeout(() => {
    typeWriter(TEXT, typedText, 110, () => {
      setTimeout(goToLoveScreen, 1300);
    });
  }, 400);

  function goToLoveScreen() {
    screenTyping.classList.remove('active');
    setTimeout(() => screenLove.classList.add('active'), 500);
  }

  /* ================= KLIK LOVE ================= */
  screenLove.addEventListener('click', handleLoveTap);
  screenLove.addEventListener('touchstart', handleLoveTap, { passive: true });

  function handleLoveTap(e) {
    if (e && e.preventDefault) e.preventDefault();
    
    // Paksa musik nyala kalau belum nyala
    if (music && music.paused) {
      music.play().then(() => {
        musicBtn.classList.add('playing');
        musicBtn.innerHTML = '⏸️';
        musicPlaying = true;
      }).catch(()=>{});
    }

    if (screenLove.dataset.tapped) return;
    screenLove.dataset.tapped = "true";

    startLoveRain();

    setTimeout(() => {
      screenLove.classList.remove('active');
      setTimeout(() => {
        screenSlides.classList.add('active');
        startSlideshow();
      }, 500);
    }, 1200);
  }

  /* ================= HUJAN LOVE ================= */
  const HEARTS = ['❤️','💖','💕','💗','💓','🩷','💘'];
  function startLoveRain() {
    if (!loveRainBox) return;
    for (let i = 0; i < 60; i++) {
      setTimeout(createHeart, i * 45);
    }
    setTimeout(() => { loveRainBox.innerHTML = ''; }, 7000);
  }
  function createHeart() {
    const h = document.createElement('div');
    h.className = 'rain-heart';
    h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = (16 + Math.random() * 20) + 'px';
    const dur = 2.5 + Math.random() * 2.5;
    h.style.animationDuration = dur + 's';
    loveRainBox.appendChild(h);
    setTimeout(() => h.remove(), dur * 1000 + 200);
  }

  /* ================= SLIDESHOW ================= */
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideTimer = null;

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function startSlideshow() {
    if (!slides.length) return;
    showSlide(0);
    currentSlide = 0;

    slideTimer = setInterval(() => {
      currentSlide++;
      if (currentSlide < slides.length) {
        showSlide(currentSlide);
      } else {
        clearInterval(slideTimer);
        setTimeout(showMessageScreen, 900);
      }
    }, 5000);
  }

  /* ================= LAYAR 4: PESAN SYUKUR ================= */
  const PESAN = `Aku nggak pernah nyangka bisa sedekat ini sama kamu.
Bersyukur banget bisa kenal dan dekat sama orang sebaik kamu.

Makasih ya, udah jadi alasan aku buat senyum tiap hari.
Aku cukup — cukup bahagia, cukup tenang, cukup semuanya, asal sama kamu. 🤍`;

  function showMessageScreen() {
    screenSlides.classList.remove('active');
    if (messageText) messageText.textContent = PESAN;

    setTimeout(() => {
      screenMessage.classList.add('active');
      if (messageInner) setTimeout(() => messageInner.classList.add('show'), 150);
      setTimeout(showThanksScreen, 6000);
    }, 600);
  }

  /* ================= LAYAR 5: TERIMA KASIH ================= */
  function showThanksScreen() {
    screenMessage.classList.remove('active');
    setTimeout(() => {
      screenThanks.classList.add('active');
      startStickers();
    }, 600);
  }

  /* ================= STIKER LUCU ================= */
  const CUTE_STICKERS = ['🐱','🐰','🐻','🐼','🐨','🦊','🐶','🐧','🐸','🐹'];

  function startStickers() {
    if (!stickerStage) return;
    for (let i = 0; i < 10; i++) createBouncySticker();
    let fallCount = 0;
    const fallInterval = setInterval(() => {
      createFallingSticker();
      fallCount++;
      if (fallCount > 40) clearInterval(fallInterval);
    }, 220);
  }

  function createBouncySticker() {
    const s = document.createElement('div');
    s.className = 'sticker';
    s.textContent = CUTE_STICKERS[Math.floor(Math.random() * CUTE_STICKERS.length)];
    s.style.left = (5 + Math.random() * 85) + 'vw';
    s.style.top  = (10 + Math.random() * 70) + 'vh';
    s.style.fontSize = (28 + Math.random() * 22) + 'px';
    s.style.animationDuration = (2.5 + Math.random() * 2) + 's';
    stickerStage.appendChild(s);
  }

  function createFallingSticker() {
    const s = document.createElement('div');
    s.className = 'sticker-fall';
    s.textContent = CUTE_STICKERS[Math.floor(Math.random() * CUTE_STICKERS.length)];
    s.style.left = Math.random() * 95 + 'vw';
    s.style.fontSize = (22 + Math.random() * 18) + 'px';
    const dur = 3 + Math.random() * 2.5;
    s.style.animationDuration = dur + 's';
    stickerStage.appendChild(s);
    setTimeout(() => s.remove(), dur * 1000 + 300);
  }

});
/* Won Apart - küçük yardımcı betik. Eski tarayıcılarda da çalışsın diye sade yazıldı. */
(function () {
  var WA = 'https://wa.me/905337040364?text=';

  // Menü düğmesi (telefon)
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.className.indexOf('open') === -1;
      nav.className = open ? 'nav open' : 'nav';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Tarih kutuları: geçmiş tarih seçilemesin
  function bugun() {
    var d = new Date();
    var m = d.getMonth() + 1, g = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (g < 10 ? '0' : '') + g;
  }
  function trTarih(iso) {
    var p = iso.split('-');
    return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : iso;
  }

  // Rezervasyon kutusu -> hazır WhatsApp mesajı
  var forms = document.querySelectorAll('.rez-form');
  for (var i = 0; i < forms.length; i++) {
    (function (f) {
      var gi = f.querySelector('[name=giris]');
      var ci = f.querySelector('[name=cikis]');
      var ki = f.querySelector('[name=kisi]');
      if (gi) gi.setAttribute('min', bugun());
      if (ci) ci.setAttribute('min', bugun());
      if (gi && ci) {
        gi.addEventListener('change', function () {
          if (gi.value) { ci.setAttribute('min', gi.value); if (ci.value && ci.value < gi.value) ci.value = ''; }
        });
      }
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var t = 'Merhaba, Won Apart için müsaitlik bilgisi almak istiyorum.';
        var parca = [];
        if (gi && gi.value) parca.push('Giriş: ' + trTarih(gi.value));
        if (ci && ci.value) parca.push('Çıkış: ' + trTarih(ci.value));
        if (ki && ki.value) parca.push('Kişi sayısı: ' + ki.value);
        if (parca.length) t += ' ' + parca.join(', ') + '.';
        olay('rezervasyon_formu');
        window.location.href = WA + encodeURIComponent(t);
      });
    })(forms[i]);
  }

  // Ölçüm: arama / WhatsApp tıklamaları (Google Analytics veya Ads eklenince burası dönüşüm olarak sayılır)
  function olay(ad) {
    try {
      if (window.gtag) window.gtag('event', ad);
      if (window.dataLayer) window.dataLayer.push({ event: ad });
    } catch (e) {}
  }
  var linkler = document.querySelectorAll('[data-olay]');
  for (var j = 0; j < linkler.length; j++) {
    linkler[j].addEventListener('click', function () { olay(this.getAttribute('data-olay')); });
  }
})();

/* Dönen banner */
(function () {
  var b = document.querySelector('.banner');
  if (!b) return;
  var slides = b.querySelectorAll('.slide');
  var dotsBox = b.querySelector('.dots');
  var idx = 0, timer = null, i;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dots = [];
  for (i = 0; i < slides.length; i++) {
    (function (n) {
      var d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', (n + 1) + '. duyuru');
      d.addEventListener('click', function () { go(n); restart(); });
      dotsBox.appendChild(d); dots.push(d);
    })(i);
  }
  function go(n) {
    idx = (n + slides.length) % slides.length;
    for (var k = 0; k < slides.length; k++) {
      slides[k].className = slides[k].className.replace(/\bon\b/g, '').replace(/\s+$/, '');
      dots[k].className = '';
    }
    slides[idx].className += ' on';
    dots[idx].className = 'on';
  }
  function restart() {
    if (timer) clearInterval(timer);
    if (!reduce) timer = setInterval(function () { go(idx + 1); }, 6500);
  }
  var prev = b.querySelector('.sl-prev'), next = b.querySelector('.sl-next');
  if (prev) prev.addEventListener('click', function () { go(idx - 1); restart(); });
  if (next) next.addEventListener('click', function () { go(idx + 1); restart(); });
  b.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
  b.addEventListener('mouseleave', restart);
  var x0 = null;
  b.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  b.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { go(idx + (dx < 0 ? 1 : -1)); restart(); }
    x0 = null;
  }, { passive: true });
  go(0); restart();
})();

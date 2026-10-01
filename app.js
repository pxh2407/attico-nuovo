/* =============================================================================
   ATTICO PANORAMICO — Funzionamento del sito

   1. Lingua (scelta automatica + pulsanti IT/EN/DE/FR)
   2. Intestazione, menu, barra di avanzamento
   3. Milazzo in tempo reale (ora, meteo, mare, tramonto)
   4. Galleria con filtri + visore a tutto schermo
   5. Mappa illustrata delle Isole Eolie
   6. Calendario disponibilità + messaggio WhatsApp precompilato
   7. Domande frequenti
   8. Animazioni allo scorrimento
   I testi sono tutti in testi.js
   ============================================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var LINGUE = ['it', 'en', 'de', 'fr'];
  var LOCALE = { it: 'it-IT', en: 'en-GB', de: 'de-DE', fr: 'fr-FR' };
  var FUSO = 'Europe/Rome';
  var lang = scegliLingua();

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function t(key) {
    var d = TESTI[lang] || TESTI.it;
    return (key in d) ? d[key] : TESTI.it[key];
  }
  function waLink(testo) {
    return 'https://wa.me/' + DATI.whatsapp + '?text=' + encodeURIComponent(testo);
  }

  /* =========================================================================
     1. LINGUA
     ========================================================================= */
  function scegliLingua() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q && LINGUE.indexOf(q) !== -1) return q;
    try {
      var s = localStorage.getItem('attico_lang');
      if (s && LINGUE.indexOf(s) !== -1) return s;
    } catch (e) { /* memoria del browser non disponibile */ }
    var pref = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'it'];
    for (var i = 0; i < pref.length; i++) {
      var c = String(pref[i] || '').slice(0, 2).toLowerCase();
      if (LINGUE.indexOf(c) !== -1) return c;
    }
    /* Ospite straniero con una lingua non prevista: meglio l'inglese */
    var primo = String(pref[0] || 'it').slice(0, 2).toLowerCase();
    return primo === 'it' ? 'it' : 'en';
  }

  function applicaLingua(l) {
    lang = l;
    document.documentElement.lang = l;
    document.title = t('meta_title');
    var md = $('meta[name="description"]');
    if (md) md.setAttribute('content', t('meta_desc'));

    $$('[data-i18n]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    $$('[data-i18n-alt]').forEach(function (el) { el.setAttribute('alt', t(el.getAttribute('data-i18n-alt'))); });
    $$('[data-i18n-title]').forEach(function (el) { el.setAttribute('title', t(el.getAttribute('data-i18n-title'))); });
    $$('[data-wa]').forEach(function (el) { el.href = waLink(t('msg_generic')); });

    $$('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === l;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    try { localStorage.setItem('attico_lang', l); } catch (e) { /* ignora */ }

    aggiornaBurger();
    disegnaGalleria();
    disegnaFaq();
    aggiornaLive();
    disegnaCalendario();
  }

  $$('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      applicaLingua(b.getAttribute('data-lang'));
      if (!menu.hidden) chiudiMenu();
    });
  });

  /* =========================================================================
     2. INTESTAZIONE, MENU, AVANZAMENTO
     ========================================================================= */
  var header = $('#header');
  var progress = $('#progress');
  var mobilebar = $('.mobilebar');
  var burger = $('#burger');
  var menu = $('#menu');

  function suScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-scrolled', y > 24);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    if (mobilebar) mobilebar.classList.toggle('is-on', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', suScroll, { passive: true });
  window.addEventListener('resize', suScroll);

  function aggiornaBurger() {
    var aperto = !menu.hidden;
    burger.setAttribute('aria-expanded', String(aperto));
    burger.setAttribute('aria-label', t(aperto ? 'menu_close' : 'menu_open'));
  }
  function apriMenu() {
    menu.hidden = false;
    document.body.classList.add('no-scroll');
    header.classList.add('is-scrolled');
    aggiornaBurger();
  }
  function chiudiMenu() {
    menu.hidden = true;
    document.body.classList.remove('no-scroll');
    aggiornaBurger();
    suScroll();
  }
  burger.addEventListener('click', function () { menu.hidden ? apriMenu() : chiudiMenu(); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', chiudiMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) chiudiMenu(); });

  /* Voce del menu evidenziata in base alla sezione visibile */
  var linkNav = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var ioNav = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        if (!v.isIntersecting) return;
        var id = '#' + v.target.id;
        linkNav.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { ioNav.observe(s); });
  }

  /* =========================================================================
     3. MILAZZO IN TEMPO REALE
     ========================================================================= */
  var meteo = { codice: null, temp: null, mare: null };

  /* Alba e tramonto (algoritmo astronomico standard, lo stesso di SunCalc) */
  function orariSole(data, lat, lon) {
    var rad = Math.PI / 180, giorno = 86400000, J1970 = 2440588, J2000 = 2451545, e = rad * 23.4397;
    var dGiorni = data.valueOf() / giorno - 0.5 + J1970 - J2000;
    var lw = rad * -lon, phi = rad * lat;
    var n = Math.round(dGiorni - 0.0009 - lw / (2 * Math.PI));
    var ds = 0.0009 + lw / (2 * Math.PI) + n;
    var M = rad * (357.5291 + 0.98560028 * ds);
    var C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    var L = M + C + rad * 102.9372 + Math.PI;
    var dec = Math.asin(Math.sin(e) * Math.sin(L));
    var Jnoon = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    var w = Math.acos((Math.sin(-0.833 * rad) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec)));
    var a = 0.0009 + (w + lw) / (2 * Math.PI) + n;
    var Jset = J2000 + a + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    function daJ(j) { return new Date((j + 0.5 - J1970) * giorno); }
    return { alba: daJ(Jnoon - (Jset - Jnoon)), tramonto: daJ(Jset) };
  }

  function ora(d) {
    return new Intl.DateTimeFormat(LOCALE[lang], { hour: '2-digit', minute: '2-digit', timeZone: FUSO }).format(d);
  }

  var ICONA_METEO = { w_clear: 'i-sun', w_partly: 'i-cloud-sun', w_cloudy: 'i-cloud', w_fog: 'i-fog', w_drizzle: 'i-rain', w_rain: 'i-rain', w_snow: 'i-snow', w_storm: 'i-storm' };
  function chiaveMeteo(c) {
    if (c === 0) return 'w_clear';
    if (c <= 2) return 'w_partly';
    if (c === 3) return 'w_cloudy';
    if (c === 45 || c === 48) return 'w_fog';
    if (c >= 51 && c <= 57) return 'w_drizzle';
    if ((c >= 61 && c <= 67) || (c >= 80 && c <= 82)) return 'w_rain';
    if ((c >= 71 && c <= 77) || c === 85 || c === 86) return 'w_snow';
    if (c >= 95) return 'w_storm';
    return 'w_partly';
  }

  function aggiornaLive() {
    var adesso = new Date();
    $('#liveTime').textContent = ora(adesso);

    var sole = orariSole(adesso, DATI.lat, DATI.lon);
    var tramonto = sole.tramonto, domani = false;
    if (adesso > tramonto) {
      tramonto = orariSole(new Date(adesso.getTime() + 86400000), DATI.lat, DATI.lon).tramonto;
      domani = true;
    }
    $('#liveSunsetLabel').textContent = t(domani ? 'live_sunset_tomorrow' : 'live_sunset');
    var html = ora(tramonto);
    if (!domani) {
      var min = Math.round((tramonto - adesso) / 60000);
      var h = Math.floor(min / 60), m = min % 60;
      html += ' <small>' + t('live_in') + ' ' + (h ? h + ' h ' : '') + m + ' min</small>';
    }
    $('#liveSunset').innerHTML = html;

    if (meteo.temp !== null) {
      var k = chiaveMeteo(meteo.codice);
      $('#liveWeather').innerHTML = Math.round(meteo.temp) + '°C <small>' + t(k) + '</small>';
      $('#liveWIcon use').setAttribute('href', '#' + ICONA_METEO[k]);
    }
    if (meteo.mare !== null) $('#liveSea').textContent = Math.round(meteo.mare) + '°C';
  }

  function caricaMeteo() {
    var base = 'latitude=' + DATI.lat + '&longitude=' + DATI.lon + '&timezone=Europe%2FRome';
    fetch('https://api.open-meteo.com/v1/forecast?' + base + '&current=temperature_2m,weather_code')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) { meteo.temp = d.current.temperature_2m; meteo.codice = d.current.weather_code; aggiornaLive(); })
      .catch(function () { /* resta il trattino */ });
    /* Punto di mare aperto nel golfo davanti a Milazzo */
    fetch('https://marine-api.open-meteo.com/v1/marine?latitude=38.24&longitude=15.20&timezone=Europe%2FRome&current=sea_surface_temperature')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) { if (d.current && d.current.sea_surface_temperature != null) { meteo.mare = d.current.sea_surface_temperature; aggiornaLive(); } })
      .catch(function () { /* resta il trattino */ });
  }
  setInterval(aggiornaLive, 30000);

  /* =========================================================================
     4. GALLERIA + VISORE
     ========================================================================= */
  var ggrid = $('#ggrid');
  var filtro = 'tutte';

  function disegnaGalleria() {
    ggrid.classList.toggle('is-filtered', filtro !== 'tutte');
    var html = '';
    FOTO.forEach(function (f, i) {
      if (filtro !== 'tutte' && f.cat !== filtro) return;
      var cap = f[lang] || f.it;
      html += '<button type="button" class="gitem' + (f.forma ? ' g--' + f.forma : '') + '" data-i="' + i + '" aria-label="' + t('gallery_open') + ': ' + cap.replace(/"/g, '&quot;') + '">' +
        '<img src="images/' + f.file + '" alt="' + cap.replace(/"/g, '&quot;') + '" width="960" height="800" loading="lazy" decoding="async">' +
        '<span class="gitem__cap">' + cap + '</span></button>';
    });
    ggrid.innerHTML = html;
    $$('.gitem', ggrid).forEach(function (b, k) { b.style.animationDelay = (k * 45) + 'ms'; });
  }

  $$('#filters .chip').forEach(function (c) {
    c.addEventListener('click', function () {
      filtro = c.getAttribute('data-filter');
      $$('#filters .chip').forEach(function (x) {
        var on = x === c;
        x.classList.toggle('is-on', on);
        x.setAttribute('aria-pressed', String(on));
      });
      disegnaGalleria();
    });
  });

  var lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbCount = $('#lbCount'), lbThumbs = $('#lbThumbs');
  var lbLista = [], lbPos = 0, lbRitorno = null;

  ggrid.addEventListener('click', function (e) {
    var b = e.target.closest('.gitem');
    if (!b) return;
    lbLista = $$('.gitem', ggrid).map(function (x) { return +x.getAttribute('data-i'); });
    lbRitorno = b;
    apriVisore(lbLista.indexOf(+b.getAttribute('data-i')));
  });

  function apriVisore(pos) {
    lbThumbs.innerHTML = lbLista.map(function (i, k) {
      return '<button type="button" data-k="' + k + '" aria-label="' + (k + 1) + '"><img src="images/' + FOTO[i].file + '" alt="" loading="lazy"></button>';
    }).join('');
    lb.hidden = false;
    document.body.classList.add('no-scroll');
    mostraFoto(pos);
    $('#lbClose').focus();
  }
  function mostraFoto(pos) {
    lbPos = (pos + lbLista.length) % lbLista.length;
    var f = FOTO[lbLista[lbPos]], cap = f[lang] || f.it;
    lbImg.src = 'images/' + f.file;
    lbImg.alt = cap;
    lbCap.textContent = cap;
    lbCount.textContent = (lbPos + 1) + ' / ' + lbLista.length;
    $$('button', lbThumbs).forEach(function (b, k) { b.classList.toggle('is-on', k === lbPos); });
    var att = $('.is-on', lbThumbs);
    if (att) att.scrollIntoView({ block: 'nearest', inline: 'center' });
    [1, -1].forEach(function (d) { new Image().src = 'images/' + FOTO[lbLista[(lbPos + d + lbLista.length) % lbLista.length]].file; });
  }
  function chiudiVisore() {
    lb.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lbRitorno) lbRitorno.focus();
  }
  $('#lbClose').addEventListener('click', chiudiVisore);
  $('#lbPrev').addEventListener('click', function () { mostraFoto(lbPos - 1); });
  $('#lbNext').addEventListener('click', function () { mostraFoto(lbPos + 1); });
  lbThumbs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) mostraFoto(+b.getAttribute('data-k')); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb__fig')) chiudiVisore(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') chiudiVisore();
    else if (e.key === 'ArrowRight') mostraFoto(lbPos + 1);
    else if (e.key === 'ArrowLeft') mostraFoto(lbPos - 1);
    else if (e.key === 'Tab') {
      var foc = $$('button', lb);
      var i = foc.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); foc[foc.length - 1].focus(); }
      else if (!e.shiftKey && i === foc.length - 1) { e.preventDefault(); foc[0].focus(); }
    }
  });
  var tx0 = null;
  lb.addEventListener('touchstart', function (e) { tx0 = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (tx0 === null) return;
    var dx = e.changedTouches[0].clientX - tx0;
    if (Math.abs(dx) > 45) mostraFoto(lbPos + (dx < 0 ? 1 : -1));
    tx0 = null;
  }, { passive: true });

  /* =========================================================================
     5. MAPPA ILLUSTRATA DELLE ISOLE EOLIE (posizioni geografiche reali)
     ========================================================================= */
  var SVGNS = 'http://www.w3.org/2000/svg';
  function proietta(lat, lon) { return [20 + (lon - 14.30) * 600, 20 + (38.84 - lat) * 766.7]; }
  var PX_KM = 766.7 / 111.2;

  function curvaLiscia(punti) {
    var d = 'M' + punti[0][0].toFixed(1) + ',' + punti[0][1].toFixed(1);
    for (var i = 0; i < punti.length - 1; i++) {
      var p0 = punti[i - 1] || punti[i], p1 = punti[i], p2 = punti[i + 1], p3 = punti[i + 2] || p2;
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      var c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ' C' + c1[0].toFixed(1) + ',' + c1[1].toFixed(1) + ' ' + c2[0].toFixed(1) + ',' + c2[1].toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
    }
    return d;
  }

  function el(tag, attr) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attr) n.setAttribute(k, attr[k]);
    return n;
  }

  function disegnaEolie() {
    /* Costa tirrenica della Sicilia, da Capo d'Orlando a Spadafora, con la penisola di Milazzo */
    var costa = [
      [38.080, 14.560], [38.125, 14.700], [38.163, 14.745], [38.150, 14.800], [38.152, 14.835],
      [38.170, 14.900], [38.177, 14.925], [38.163, 14.948], [38.148, 14.975], [38.145, 15.020],
      [38.150, 15.048], [38.135, 15.065], [38.140, 15.110], [38.160, 15.180], [38.192, 15.222],
      [38.212, 15.236], [38.240, 15.226], [38.258, 15.228], [38.271, 15.233], [38.262, 15.244],
      [38.243, 15.249], [38.222, 15.247], [38.214, 15.270], [38.220, 15.330], [38.226, 15.380], [38.236, 15.430]
    ].map(function (p) { return proietta(p[0], p[1]); });
    $('#eolieCoast').setAttribute('d', curvaLiscia(costa) + ' L700,620 L0,620 L0,' + costa[0][1].toFixed(1) + ' Z');

    var porto = proietta(38.221, 15.246);
    var gRotte = $('#eolieRoutes'), gIsole = $('#eolieIslands'), lista = $('#islandList');

    ISOLE.forEach(function (isola) {
      var c = proietta(isola.lat, isola.lon);
      var r = Math.sqrt(isola.kmq / Math.PI) * PX_KM;

      /* Rotta curva dal porto all'isola */
      var dx = c[0] - porto[0], dy = c[1] - porto[1], len = Math.sqrt(dx * dx + dy * dy);
      var mx = (porto[0] + c[0]) / 2 + (dy / len) * len * 0.16;
      var my = (porto[1] + c[1]) / 2 - (dx / len) * len * 0.16;
      var rotta = el('path', { d: 'M' + porto[0] + ',' + porto[1] + ' Q' + mx.toFixed(1) + ',' + my.toFixed(1) + ' ' + c[0].toFixed(1) + ',' + c[1].toFixed(1), 'class': 'route', 'data-n': isola.nome });
      gRotte.appendChild(rotta);

      var g = el('g', { 'class': 'isola', 'data-n': isola.nome, tabindex: '0', role: 'button', 'aria-label': isola.nome });
      g.appendChild(el('circle', { cx: c[0].toFixed(1), cy: c[1].toFixed(1), r: r.toFixed(1) }));
      if (isola.nome === 'Stromboli') {
        g.appendChild(el('path', { 'class': 'plume', d: 'M' + c[0] + ',' + (c[1] - r - 3) + ' c-6,-8 6,-12 0,-20 c-5,-7 5,-11 1,-18' }));
      }
      /* Stromboli è sul bordo destro: il nome va a sinistra */
      var aSinistra = isola.nome === 'Stromboli';
      var etichetta = el('text', { x: (aSinistra ? c[0] - r - 8 : c[0] + r + 8).toFixed(1), y: (c[1] + 5).toFixed(1), 'text-anchor': aSinistra ? 'end' : 'start' });
      etichetta.textContent = isola.nome;
      g.appendChild(etichetta);
      gIsole.appendChild(g);

      var li = document.createElement('li');
      li.innerHTML = '<button type="button" data-n="' + isola.nome + '">' + isola.nome + '</button>';
      lista.appendChild(li);
    });

    /* L'Attico a Milazzo */
    var casa = proietta(DATI.lat, DATI.lon), gCasa = $('#eolieHome');
    gCasa.appendChild(el('circle', { 'class': 'home-pulse', cx: casa[0], cy: casa[1], r: 7 }));
    gCasa.appendChild(el('circle', { 'class': 'home-dot', cx: casa[0], cy: casa[1], r: 6 }));
    var nome = el('text', { 'class': 'home-label', x: casa[0] - 16, y: casa[1] + 2, 'text-anchor': 'end' });
    nome.textContent = 'Milazzo';
    gCasa.appendChild(nome);

    /* Evidenziazione isola ↔ pulsante */
    var fissa = null;
    function evidenzia(n) {
      $$('[data-n]').forEach(function (x) { x.classList.toggle('is-hot', !!n && x.getAttribute('data-n') === n); });
    }
    function attiva(n, fisso) {
      if (fisso) fissa = (fissa === n ? null : n);
      evidenzia(fisso ? fissa : n);
    }
    $$('.isola, #islandList button').forEach(function (x) {
      var n = x.getAttribute('data-n');
      x.addEventListener('mouseenter', function () { attiva(n); });
      x.addEventListener('mouseleave', function () { evidenzia(fissa); });
      x.addEventListener('focus', function () { attiva(n); });
      x.addEventListener('blur', function () { evidenzia(fissa); });
      x.addEventListener('click', function () { attiva(n, true); });
      x.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); attiva(n, true); } });
    });
  }

  /* =========================================================================
     6. CALENDARIO DISPONIBILITÀ + WHATSAPP
     ========================================================================= */
  var cal = {
    eventi: [], stato: 'caricamento', aggiornato: null,
    vista: null, arrivo: null, partenza: null, sopra: null, ospiti: 2, avviso: false
  };
  var calBox = $('.cal'), calMonths = $('#calMonths');

  function oggiStr() {
    var p = new Intl.DateTimeFormat('en-CA', { timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    return p.slice(0, 10);
  }
  function strData(y, m, d) { return y + '-' + (m < 9 ? '0' : '') + (m + 1) + '-' + (d < 10 ? '0' : '') + d; }
  function piuGiorni(s, n) {
    var p = s.split('-'), d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + n));
    return strData(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }
  function utc(s) { var p = s.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function notti(a, b) { return Math.round((utc(b) - utc(a)) / 86400000); }
  function occupato(s) {
    for (var i = 0; i < cal.eventi.length; i++) if (s >= cal.eventi[i].start && s <= cal.eventi[i].end) return true;
    return false;
  }
  function nottiLibere(a, b) {
    for (var s = a; s < b; s = piuGiorni(s, 1)) if (occupato(s)) return false;
    return true;
  }
  function mesiVisibili() { return window.matchMedia('(max-width: 760px)').matches ? 1 : 2; }

  (function () { var o = oggiStr().split('-'); cal.vista = { y: +o[0], m: +o[1] - 1 }; })();

  function disegnaCalendario() {
    if (!calMonths) return;
    var oggi = oggiStr(), mesi = t('cal_months').split(','), giorni = t('cal_days').split(',');
    var html = '';
    for (var k = 0; k < mesiVisibili(); k++) {
      var y = cal.vista.y, m = cal.vista.m + k;
      if (m > 11) { m -= 12; y++; }
      var primo = new Date(Date.UTC(y, m, 1)).getUTCDay();
      var vuoti = (primo + 6) % 7, tot = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
      html += '<div class="month"><p class="month__title">' + mesi[m] + ' ' + y + '</p><div class="month__grid">';
      giorni.forEach(function (g) { html += '<span class="dow">' + g + '</span>'; });
      for (var v = 0; v < vuoti; v++) html += '<span class="d d--empty"></span>';
      for (var d = 1; d <= tot; d++) {
        var s = strData(y, m, d), cls = 'd', abil = true;
        var possibilePartenza = cal.arrivo && !cal.partenza && s > cal.arrivo && nottiLibere(cal.arrivo, s);
        if (s < oggi) { cls += ' d--past'; abil = false; }
        else if (occupato(s)) { cls += possibilePartenza ? ' d--busy d--co' : ' d--busy'; abil = possibilePartenza; }
        else cls += ' d--free';
        if (s === oggi) cls += ' d--today';
        if (s === cal.arrivo) cls += ' d--start';
        if (s === cal.partenza) cls += ' d--end';
        if (cal.arrivo && cal.partenza && s > cal.arrivo && s < cal.partenza) cls += ' d--range';
        else if (cal.arrivo && !cal.partenza && cal.sopra && s > cal.arrivo && s < cal.sopra && nottiLibere(cal.arrivo, cal.sopra)) cls += ' d--hover';
        html += '<button type="button" class="' + cls + '" data-d="' + s + '"' + (abil ? '' : ' disabled aria-disabled="true"') +
          ' aria-label="' + etichettaData(s, true) + '">' + d + '</button>';
      }
      html += '</div></div>';
    }
    calMonths.innerHTML = html;

    var o = oggiStr().split('-');
    $('#calPrev').disabled = (cal.vista.y === +o[0] && cal.vista.m === +o[1] - 1);
    calBox.classList.toggle('cal--nodata', cal.stato === 'errore');
    $$('.legend > span', calBox).forEach(function (s, i) { if (i < 2) s.classList.add('is-data'); });

    var st = $('#calStatus');
    if (cal.stato === 'caricamento') st.textContent = t('avail_loading');
    else if (cal.stato === 'errore') st.textContent = t('avail_error');
    else st.textContent = cal.aggiornato ? t('avail_updated') + ' ' +
      new Intl.DateTimeFormat(LOCALE[lang], { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: FUSO }).format(cal.aggiornato) : '';
    aggiornaBiglietto();
  }

  function etichettaData(s, conAnno) {
    var opz = { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' };
    if (conAnno) { opz.month = 'long'; opz.year = 'numeric'; opz.weekday = 'long'; }
    return new Intl.DateTimeFormat(LOCALE[lang], opz).format(utc(s));
  }

  function aggiornaBiglietto() {
    var hint = $('#ticketHint');
    hint.classList.toggle('is-warn', cal.avviso);
    if (cal.avviso) hint.textContent = t('avail_conflict');
    else if (!cal.arrivo) hint.textContent = t('avail_pick1');
    else if (!cal.partenza) hint.textContent = t('avail_pick2');
    else hint.textContent = t('avail_ready');

    $('#tIn').textContent = cal.arrivo ? etichettaData(cal.arrivo) : '—';
    $('#tOut').textContent = cal.partenza ? etichettaData(cal.partenza) : '—';
    var n = cal.arrivo && cal.partenza ? notti(cal.arrivo, cal.partenza) : 0;
    $('#tNights').textContent = n ? n + ' ' + t(n === 1 ? 'avail_night' : 'avail_nights') : '';
    $('#gNum').textContent = cal.ospiti;
    $('#gLess').disabled = cal.ospiti <= 1;
    $('#gMore').disabled = cal.ospiti >= DATI.ospitiMax;
    $('#tReset').hidden = !cal.arrivo;

    var msg = t('msg_generic');
    if (cal.arrivo && cal.partenza) {
      var lungo = function (s) { return new Intl.DateTimeFormat(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(utc(s)); };
      msg = t('msg_dates')
        .replace('{da}', lungo(cal.arrivo))
        .replace('{a}', lungo(cal.partenza))
        .replace('{notti}', n + ' ' + t(n === 1 ? 'avail_night' : 'avail_nights'))
        .replace('{ospiti}', cal.ospiti + ' ' + t(cal.ospiti === 1 ? 'msg_guest' : 'msg_guests'));
    }
    $('#tSend').href = waLink(msg);
  }

  calMonths.addEventListener('click', function (e) {
    var b = e.target.closest('.d');
    if (!b || b.disabled) return;
    var s = b.getAttribute('data-d');
    cal.avviso = false;
    if (!cal.arrivo || cal.partenza || s <= cal.arrivo) {
      if (occupato(s)) return;
      cal.arrivo = s; cal.partenza = null;
    } else if (nottiLibere(cal.arrivo, s)) {
      cal.partenza = s;
    } else {
      cal.avviso = true;
    }
    cal.sopra = null;
    disegnaCalendario();
    if (cal.avviso) { var x = $('[data-d="' + s + '"]', calMonths); if (x) x.classList.add('d--shake'); }
  });
  calMonths.addEventListener('mouseover', function (e) {
    var b = e.target.closest('.d');
    if (!b || !cal.arrivo || cal.partenza) return;
    var s = b.getAttribute('data-d');
    if (s === cal.sopra) return;
    cal.sopra = s;
    $$('.d', calMonths).forEach(function (x) {
      var ds = x.getAttribute('data-d');
      x.classList.toggle('d--hover', !!ds && ds > cal.arrivo && ds < s && nottiLibere(cal.arrivo, s));
    });
  });
  $('#calPrev').addEventListener('click', function () { cal.vista.m--; if (cal.vista.m < 0) { cal.vista.m = 11; cal.vista.y--; } disegnaCalendario(); });
  $('#calNext').addEventListener('click', function () { cal.vista.m++; if (cal.vista.m > 11) { cal.vista.m = 0; cal.vista.y++; } disegnaCalendario(); });
  $('#gLess').addEventListener('click', function () { if (cal.ospiti > 1) { cal.ospiti--; aggiornaBiglietto(); } });
  $('#gMore').addEventListener('click', function () { if (cal.ospiti < DATI.ospitiMax) { cal.ospiti++; aggiornaBiglietto(); } });
  $('#tReset').addEventListener('click', function () { cal.arrivo = cal.partenza = cal.sopra = null; cal.avviso = false; disegnaCalendario(); });

  var mqCal = window.matchMedia('(max-width: 760px)');
  if (mqCal.addEventListener) mqCal.addEventListener('change', disegnaCalendario);

  /* Le date occupate arrivano dallo stesso servizio del sito attuale (calendar-proxy.php) */
  function caricaCalendario() {
    var indirizzi = [];
    if (/^https?:$/.test(location.protocol)) indirizzi.push('calendar-proxy.php');
    indirizzi.push('https://www.atticopanoramico.it/calendar-proxy.php');
    (function prova(i) {
      if (i >= indirizzi.length) { cal.stato = 'errore'; disegnaCalendario(); return; }
      fetch(indirizzi[i] + '?_t=' + Date.now())
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (d) {
          cal.eventi = d.eventi || [];
          cal.aggiornato = d.aggiornato ? new Date(d.aggiornato) : null;
          cal.stato = 'ok';
          disegnaCalendario();
        })
        .catch(function () { prova(i + 1); });
    })(0);
  }

  /* =========================================================================
     7. DOMANDE FREQUENTI
     ========================================================================= */
  function disegnaFaq() {
    var box = $('#faqList');
    box.innerHTML = t('faq').map(function (q, i) {
      return '<details name="faq"' + (i === 0 ? ' open' : '') + '><summary>' + q[0] + '</summary><p>' + q[1] + '</p></details>';
    }).join('');
  }

  /* =========================================================================
     8. ANIMAZIONI ALLO SCORRIMENTO
     ========================================================================= */
  function avviaAnimazioni() {
    var bersagli = $$('.reveal, .walk');
    if (!('IntersectionObserver' in window)) { bersagli.forEach(function (x) { x.classList.add('in'); }); return; }

    $$('.cards').forEach(function (g) { $$('.card', g).forEach(function (c, i) { c.style.transitionDelay = (i % 3) * 90 + 'ms'; }); });
    $$('.quotes .quote').forEach(function (c, i) { c.style.transitionDelay = i * 90 + 'ms'; });

    var io = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        if (!v.isIntersecting) return;
        v.target.classList.add('in');
        io.unobserve(v.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    bersagli.forEach(function (x) { io.observe(x); });

    /* Numeri che contano da zero */
    var ioNum = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        if (!v.isIntersecting) return;
        ioNum.unobserve(v.target);
        var fine = +v.target.getAttribute('data-count'), suff = v.target.getAttribute('data-suffix') || '', t0 = null;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        (function passo(ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / 1400);
          v.target.textContent = Math.round(fine * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suff : '');
          if (p < 1) requestAnimationFrame(passo);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach(function (n) { ioNum.observe(n); });
  }

  /* =========================================================================
     AVVIO
     ========================================================================= */
  $('#year').textContent = new Date().getFullYear();
  disegnaEolie();
  applicaLingua(lang);
  avviaAnimazioni();
  suScroll();
  caricaMeteo();
  caricaCalendario();
})();

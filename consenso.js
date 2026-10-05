/* =============================================================================
   ATTICO PANORAMICO — Avviso cookie, statistiche (Google Analytics 4) e mappa

   - Google Analytics e la mappa di Google partono SOLO se l'ospite accetta.
   - Se rifiuta, il sito funziona lo stesso; la mappa si apre con un pulsante.
   - La scelta resta salvata nel browser per 6 mesi, poi l'avviso ricompare.
   - "Preferenze cookie" in fondo a ogni pagina (data-cookie-prefs) riapre l'avviso.
   - Fuori da www.atticopanoramico.it (prove sul PC) le statistiche non partono.
   ============================================================================= */
(function () {
  'use strict';

  var GA_ID = 'G-6SXN8DFRTE';
  var CHIAVE = 'attico_consenso';
  var DURATA = 182 * 24 * 3600 * 1000;   /* 6 mesi */
  var ONLINE = /(^|\.)atticopanoramico\.it$/.test(location.hostname);

  var TESTI = {
    it: { titolo: 'La tua privacy', testo: 'Usiamo i cookie di Google solo se accetti: servono a contare le visite (Google Analytics) e a mostrare la mappa. Se rifiuti, il sito funziona lo stesso.', si: 'Accetta', no: 'Rifiuta', info: 'Privacy e cookie', mappa: 'Mostra la mappa', nota: 'La mappa è di Google, che può usare i propri cookie.' },
    en: { titolo: 'Your privacy', testo: 'We use Google cookies only if you accept: they help us count visits (Google Analytics) and show the map. If you decline, the site works just the same.', si: 'Accept', no: 'Decline', info: 'Privacy & cookies', mappa: 'Show the map', nota: 'The map is provided by Google, which may set its own cookies.' },
    de: { titolo: 'Ihre Privatsphäre', testo: 'Wir verwenden Google-Cookies nur mit Ihrer Zustimmung: Sie helfen uns, Besuche zu zählen (Google Analytics), und zeigen die Karte an. Wenn Sie ablehnen, funktioniert die Website genauso.', si: 'Akzeptieren', no: 'Ablehnen', info: 'Datenschutz', mappa: 'Karte anzeigen', nota: 'Die Karte stammt von Google, das eigene Cookies setzen kann.' },
    fr: { titolo: 'Votre vie privée', testo: 'Nous utilisons les cookies de Google uniquement si vous acceptez : ils servent à compter les visites (Google Analytics) et à afficher la carte. Si vous refusez, le site fonctionne tout aussi bien.', si: 'Accepter', no: 'Refuser', info: 'Confidentialité', mappa: 'Afficher la carte', nota: 'La carte est fournie par Google, qui peut déposer ses propres cookies.' }
  };
  var lingua = (document.documentElement.lang || 'it').slice(0, 2);
  var T = TESTI[lingua] || TESTI.it;

  /* ---------- Scelta salvata ---------- */
  function scelta() {
    try {
      var o = JSON.parse(localStorage.getItem(CHIAVE));
      if (o && (o.v === 'si' || o.v === 'no') && Date.now() - o.t < DURATA) return o.v;
    } catch (e) { /* memoria del browser non disponibile */ }
    return null;
  }
  function salva(v) {
    try { localStorage.setItem(CHIAVE, JSON.stringify({ v: v, t: Date.now() })); } catch (e) { /* niente */ }
  }

  /* ---------- Google Analytics 4 (solo statistiche, niente pubblicità) ---------- */
  var statisticheAvviate = false;
  function avviaStatistiche() {
    if (statisticheAvviate) return;
    statisticheAvviate = true;
    window.atticoStatistiche = ONLINE ? 'avviate' : 'prova';   /* per i controlli */
    if (!ONLINE) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  /* Chi ritira il consenso: via i cookie di Analytics già salvati */
  function cancellaCookieAnalytics() {
    var dom = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var nome = c.split('=')[0].trim();
      if (!/^_ga/.test(nome)) return;
      ['', location.hostname, '.' + dom].forEach(function (d) {
        document.cookie = nome + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  /* ---------- Mappa di Google: si carica solo con il consenso o con un clic ---------- */
  function caricaMappa(f) {
    var src = f.getAttribute('data-src');
    if (!src) return;
    f.src = src;
    f.removeAttribute('data-src');
    var b = f.parentNode.querySelector('.mapframe__blocco');
    if (b) b.parentNode.removeChild(b);
  }
  function mappe() { return Array.prototype.slice.call(document.querySelectorAll('iframe[data-src]')); }
  function caricaMappe() { mappe().forEach(caricaMappa); }
  function bloccaMappe() {
    mappe().forEach(function (f) {
      if (f.parentNode.querySelector('.mapframe__blocco')) return;
      var b = document.createElement('div');
      b.className = 'mapframe__blocco';
      b.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-pin"/></svg>' +
        '<button type="button" class="btn btn--ink btn--sm">' + T.mappa + '</button><p>' + T.nota + '</p>';
      b.querySelector('button').addEventListener('click', function () { caricaMappa(f); });
      f.parentNode.appendChild(b);
    });
  }

  /* ---------- Avviso ---------- */
  var avviso = null;
  function linkPrivacy() {
    var a = document.querySelector('a[data-privacy]');
    return a ? a.getAttribute('href') : '/privacy/';
  }
  function mostraAvviso() {
    if (!avviso) {
      avviso = document.createElement('section');
      avviso.className = 'cookie';
      avviso.setAttribute('aria-labelledby', 'cookieTitolo');
      avviso.innerHTML = '<h2 class="cookie__titolo" id="cookieTitolo">' + T.titolo + '</h2>' +
        '<p>' + T.testo + ' <a href="' + linkPrivacy() + '">' + T.info + '</a></p>' +
        '<div class="cookie__btns"><button type="button" class="btn btn--sm" data-scelta="no">' + T.no + '</button>' +
        '<button type="button" class="btn btn--sm" data-scelta="si">' + T.si + '</button></div>';
      avviso.addEventListener('click', function (e) {
        var b = e.target.closest('[data-scelta]');
        if (b) decidi(b.getAttribute('data-scelta'));
      });
      document.body.insertBefore(avviso, document.body.firstChild);
    }
    avviso.hidden = false;
  }
  function decidi(v) {
    var prima = scelta();
    salva(v);
    if (avviso) avviso.hidden = true;
    if (v === 'si') { avviaStatistiche(); caricaMappe(); return; }
    cancellaCookieAnalytics();
    if (statisticheAvviate || prima === 'si') { location.reload(); return; }   /* Analytics già partito: si ricarica senza */
    bloccaMappe();
  }

  function avvia() {
    var v = scelta();
    if (v === 'si') { avviaStatistiche(); caricaMappe(); }
    else { bloccaMappe(); if (!v) mostraAvviso(); }
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-cookie-prefs]');
      if (!a) return;
      e.preventDefault();
      mostraAvviso();
      var primo = avviso.querySelector('button');
      if (primo) primo.focus();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia);
  else avvia();
})();

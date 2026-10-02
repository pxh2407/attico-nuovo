/* =============================================================================
   ATTICO PANORAMICO — Generatore delle pagine nelle 4 lingue

   Dal modello (modello.html) + testi (testi.js) + intestazioni Google (seo/xx.html)
   crea:  index.html (italiano), en/index.html, de/index.html, fr/index.html
   con i testi già scritti dentro, così Google li legge anche senza JavaScript.

   Uso (dalla cartella del sito):  node genera-pagine.js
   ============================================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DIR = __dirname;
const leggi = f => fs.readFileSync(path.join(DIR, f), 'utf8');

/* testi.js dichiara DATI, FOTO, ISOLE, TESTI: lo eseguo in un contesto a parte */
const ctx = {};
vm.createContext(ctx);
vm.runInContext(leggi('testi.js') + '\n;this.TESTI = TESTI;', ctx);
const TESTI = ctx.TESTI;

const LINGUE = [
  { l: 'it', base: '', file: 'index.html' },
  { l: 'en', base: '../', file: 'en/index.html' },
  { l: 'de', base: '../', file: 'de/index.html' },
  { l: 'fr', base: '../', file: 'fr/index.html' }
];

/* Solo nella pagina italiana (indirizzo principale): l'ospite straniero va subito
   alla pagina nella sua lingua. I motori di ricerca restano sulla pagina italiana. */
const REINDIRIZZA = `  <script>
  (function () {
    var L = ['it', 'en', 'de', 'fr'], l = null;
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (L.indexOf(q) !== -1) l = q;
      if (!l) { var s = localStorage.getItem('attico_lang'); if (L.indexOf(s) !== -1) l = s; }
    } catch (e) { /* memoria del browser non disponibile */ }
    if (!l) {
      if (navigator.webdriver || /bot|crawl|spider|slurp|google|bing|yandex|baidu|facebook|whatsapp|telegram|lighthouse|headless|preview/i.test(navigator.userAgent)) return;
      var p = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'it'];
      for (var i = 0; i < p.length && !l; i++) { var c = String(p[i] || '').slice(0, 2).toLowerCase(); if (L.indexOf(c) !== -1) l = c; }
      if (!l) l = 'en'; /* lingua non prevista: meglio l'inglese */
    }
    if (l !== 'it') location.replace(l + '/' + (location.protocol === 'file:' ? 'index.html' : '') + location.hash);
  })();
  </script>`;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function impostaAttributo(tag, nome, valore) {
  const re = new RegExp('\\s' + nome + '="[^"]*"');
  const nuovo = ' ' + nome + '="' + esc(valore) + '"';
  return re.test(tag) ? tag.replace(re, nuovo) : tag.replace(/\s*(\/?)>$/, nuovo + '$1>');
}

const modello = leggi('modello.html');
const totaleTesti = (modello.match(/\sdata-i18n="/g) || []).length;

for (const { l, base, file } of LINGUE) {
  const d = TESTI[l];
  const t = k => {
    const v = (k in d) ? d[k] : TESTI.it[k];
    if (v === undefined) throw new Error('Testo mancante: ' + k);
    return v;
  };

  let html = modello
    .replace('{{SEO}}', leggi('seo/' + l + '.html').replace(/\s+$/, ''))
    .replace('{{REINDIRIZZA}}', l === 'it' ? REINDIRIZZA : '')
    .replace(/\{\{BASE\}\}/g, base)
    .replace(/\{\{LANG\}\}/g, l)
    .replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<!-- Pagina creata da genera-pagine.js: per modificarla cambiare modello.html o testi.js -->');

  /* Testi degli elementi con data-i18n="chiave" */
  let riempiti = 0;
  html = html.replace(/<([a-z][a-z0-9]*)\b([^>]*\sdata-i18n="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g, (tutto, tag, attr, k, dentro) => {
    if (dentro.indexOf('<' + tag) !== -1) throw new Error('Elemento annidato non gestito: ' + k);
    riempiti++;
    return '<' + tag + attr + '>' + t(k) + '</' + tag + '>';
  });
  if (riempiti !== totaleTesti) throw new Error('Testi riempiti ' + riempiti + ' su ' + totaleTesti);

  /* Attributi tradotti: aria-label, alt, title */
  html = html.replace(/<[a-z][^>]*\sdata-i18n-(?:aria|alt|title)="[^>]*>/g, tag => {
    const prendi = n => (tag.match(new RegExp('\\sdata-i18n-' + n + '="([^"]+)"')) || [])[1];
    if (prendi('aria')) tag = impostaAttributo(tag, 'aria-label', t(prendi('aria')));
    if (prendi('alt')) tag = impostaAttributo(tag, 'alt', t(prendi('alt')));
    if (prendi('title')) tag = impostaAttributo(tag, 'title', t(prendi('title')));
    return tag;
  });

  /* Domande frequenti (stesso formato di disegnaFaq in app.js) */
  html = html.replace('<div class="faq__list reveal" id="faqList"></div>',
    '<div class="faq__list reveal" id="faqList">' +
    t('faq').map((q, i) => '<details name="faq"' + (i === 0 ? ' open' : '') + '><summary>' + q[0] + '</summary><p>' + q[1] + '</p></details>').join('') +
    '</div>');

  if (/\{\{[A-Z]+\}\}/.test(html)) throw new Error('Segnaposto rimasto in ' + file);

  fs.mkdirSync(path.dirname(path.join(DIR, file)), { recursive: true });
  fs.writeFileSync(path.join(DIR, file), html, 'utf8');
  console.log('Creata ' + file + ' (' + riempiti + ' testi, ' + Math.round(html.length / 1024) + ' KB)');
}

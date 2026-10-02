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
vm.runInContext(leggi('testi.js') + '\n;this.TESTI = TESTI; this.FOTO = FOTO;', ctx);
const TESTI = ctx.TESTI;
const FOTO = ctx.FOTO;
const SITO = 'https://www.atticopanoramico.it/';

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

  /* Galleria già scritta nella pagina, così Google vede tutte le foto (stesso HTML di voceGalleria in app.js) */
  const q = s => String(s).replace(/"/g, '&quot;');
  const voci = FOTO.map((f, i) => {
    const cap = f[l] || f.it;
    const largo = f.forma === 'grande' || f.forma === 'larga';
    const piccola = f.file.replace('960x800', '480x400'), media = f.file.replace('960x800', '720x600');
    return '<button type="button" class="gitem' + (f.forma ? ' g--' + f.forma : '') + '" data-i="' + i + '" aria-label="' + q(t('gallery_open') + ': ' + cap) + '">' +
      '<img src="' + base + 'images/' + f.file + '" srcset="' + base + 'images/' + piccola + ' 480w, ' + base + 'images/' + media + ' 720w, ' + base + 'images/' + f.file + ' 960w" ' +
      'sizes="' + (largo ? '(max-width: 760px) calc(100vw - 32px), 600px' : '(max-width: 760px) calc(50vw - 21px), (max-width: 980px) 50vw, 400px') + '" ' +
      'alt="' + q(cap + ' – ' + t('img_alt')) + '" width="960" height="800" loading="lazy" decoding="async">' +
      '<span class="gitem__cap">' + cap + '</span></button>';
  }).join('');
  if (html.indexOf('<div class="ggrid" id="ggrid"></div>') === -1) throw new Error('Galleria non trovata nel modello');
  html = html.replace('<div class="ggrid" id="ggrid"></div>', '<div class="ggrid" id="ggrid">' + voci + '</div>');

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

/* Mappa del sito per i motori di ricerca: le 4 pagine con i collegamenti tra lingue e tutte le foto */
const oggi = new Date().toISOString().slice(0, 10);
const indirizzo = l => SITO + (l === 'it' ? '' : l + '/');
const alternative = LINGUE.map(({ l }) => '    <xhtml:link rel="alternate" hreflang="' + l + '" href="' + indirizzo(l) + '"/>').join('\n') +
  '\n    <xhtml:link rel="alternate" hreflang="x-default" href="' + SITO + '"/>';
const immagini = FOTO.map(f => '    <image:image><image:loc>' + SITO + 'images/' + f.file + '</image:loc></image:image>').join('\n');
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<!-- Creata da genera-pagine.js -->\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n' +
  '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
  LINGUE.map(({ l }) => '  <url>\n    <loc>' + indirizzo(l) + '</loc>\n    <lastmod>' + oggi + '</lastmod>\n' + alternative + '\n' + immagini + '\n  </url>').join('\n') +
  '\n</urlset>\n';
fs.writeFileSync(path.join(DIR, 'sitemap.xml'), sitemap, 'utf8');
console.log('Creata sitemap.xml (' + LINGUE.length + ' pagine, ' + FOTO.length + ' foto ciascuna)');

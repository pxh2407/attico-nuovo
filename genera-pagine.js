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
vm.runInContext(leggi('guide.js') + '\n;this.GUIDE = GUIDE; this.GUIDE_UI = GUIDE_UI; this.GUIDE_ISOLE = GUIDE_ISOLE;', ctx);
vm.runInContext(leggi('privacy.js') + '\n;this.PRIVACY = PRIVACY;', ctx);
const TESTI = ctx.TESTI;
const FOTO = ctx.FOTO;
const GUIDE = ctx.GUIDE;
const PRIVACY = ctx.PRIVACY;
const SITO = 'https://www.atticopanoramico.it/';
const GUIDE_DATA = '2026-10-02';   /* data di pubblicazione/ultima revisione delle guide */

/* Collegamenti alle guide nella pagina principale di ogni lingua */
const linkGuide = (l, base) => GUIDE.map(g =>
  '<li><a href="' + base + g[l].slug + '"><svg class="ico" aria-hidden="true"><use href="#' + g.icona + '"/></svg><span>' + g[l].breve + '</span>' +
  '<svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></a></li>').join('');

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
    .replace('{{GUIDE_LINKS}}', linkGuide(l, base))
    .replace(/\{\{PRIVACY\}\}/g, base + PRIVACY[l].slug)
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

/* =============================================================================
   GUIDE DI VIAGGIO: 3 guide × 4 lingue, da modello-guida.html + guide.js
   ============================================================================= */
const indirizzo = l => SITO + (l === 'it' ? '' : l + '/');
const NOMI_LINGUA = { it: 'Italiano', en: 'English', de: 'Deutsch', fr: 'Français' };
const OG_LOCALE = { it: 'it_IT', en: 'en_GB', de: 'de_DE', fr: 'fr_FR' };
const LOCALE = { it: 'it-IT', en: 'en-GB', de: 'de-DE', fr: 'fr-FR' };
const CIRCA = { it: 'circa ', en: 'about ', de: 'ca. ', fr: 'env. ' };
const modelloGuida = leggi('modello-guida.html');
const versioneCss = (modello.match(/stile\.css\?v=(\d+)/) || [])[1];
const versioneConsenso = (modello.match(/consenso\.js\?v=(\d+)/) || [])[1];
/* Icone prese dal modello principale, solo quelle usate nelle guide */
const icona = id => {
  const m = modello.match(new RegExp('<symbol id="' + id + '"[\\s\\S]*?</symbol>'));
  if (!m) throw new Error('Icona non trovata: ' + id);
  return '    ' + m[0];
};
const ICONE = ['i-arrow', 'i-whatsapp'].concat(GUIDE.map(g => g.icona)).map(icona).join('\n');
const numero = (n, l) => String(n).replace('.', l === 'en' ? '.' : ',');
const jsonLd = o => '  <script type="application/ld+json">\n' + JSON.stringify(o, null, 2).replace(/^/gm, '  ') + '\n  </script>';
const pagineGuida = [];

for (const g of GUIDE) {
  for (const { l } of LINGUE) {
    const c = g[l], ui = ctx.GUIDE_UI[l], T = TESTI[l];
    const profondita = c.slug.split('/').filter(Boolean).length;
    const base = '../'.repeat(profondita);
    const url = SITO + c.slug;
    const home = base + (l === 'it' ? '' : l + '/');
    const fotoJpg = SITO + 'images/' + g.foto + '-scaled-960x800_c.jpg';

    const tabella = '<div class="guida__tabwrap"><table class="guida__tab">\n<thead><tr><th>' + ui.tab_isola + '</th><th>' + ui.tab_dist + '</th><th>' + ui.tab_sup + '</th></tr></thead>\n<tbody>\n' +
      ctx.GUIDE_ISOLE.map(([n, km, kmq]) => '<tr><td>' + n + '</td><td>' + CIRCA[l] + km + ' km</td><td>' + numero(kmq, l) + ' km²</td></tr>').join('\n') +
      '\n</tbody>\n</table></div>';
    let corpo = c.corpo.replace('{{TABELLA_ISOLE}}', tabella)
      .replace(/\{\{LINK:(\w+)\}\}/g, (m, id) => {
        const altra = GUIDE.find(x => x.id === id);
        if (!altra) throw new Error('Guida inesistente: ' + id);
        return base + altra[l].slug;
      });

    const faq = c.faq.map((q, i) => '<details name="faq"' + (i === 0 ? ' open' : '') + '><summary>' + q[0] + '</summary><p>' + q[1] + '</p></details>').join('');
    const hreflang = LINGUE.map(x => '  <link rel="alternate" hreflang="' + x.l + '" href="' + SITO + g[x.l].slug + '">').join('\n') +
      '\n  <link rel="alternate" hreflang="x-default" href="' + SITO + g.en.slug + '">';  /* ospiti quasi tutti stranieri: lingua di ripiego inglese */
    const corte = LINGUE.map(x => '<a href="' + base + g[x.l].slug + '" hreflang="' + x.l + '" lang="' + x.l + '"' + (x.l === l ? ' aria-current="page"' : '') + '>' + x.l.toUpperCase() + '</a>').join('');
    const lunghe = LINGUE.filter(x => x.l !== l).map(x => '<a href="' + base + g[x.l].slug + '" hreflang="' + x.l + '" lang="' + x.l + '">' + NOMI_LINGUA[x.l] + '</a>').join(' · ');
    const altre = GUIDE.filter(x => x !== g).map(x => '<li><a href="' + base + x[l].slug + '"><svg class="ico" aria-hidden="true"><use href="#' + x.icona + '"/></svg>' + x[l].breve + '</a></li>').join('');
    const tutte = GUIDE.map(x => '<li><a href="' + base + x[l].slug + '">' + x[l].breve + '</a></li>').join('');

    /* Dati strutturati: articolo, percorso (briciole) e domande frequenti */
    const ld = [
      { '@context': 'https://schema.org', '@type': 'Article', '@id': url + '#articolo',
        headline: c.h1, description: c.desc, inLanguage: LOCALE[l], image: [fotoJpg],
        datePublished: GUIDE_DATA, dateModified: GUIDE_DATA,
        author: { '@type': 'Organization', name: 'Attico Panoramico Milazzo', url: SITO },
        publisher: { '@type': 'Organization', name: 'Attico Panoramico Milazzo', url: SITO, logo: { '@type': 'ImageObject', url: SITO + 'images/Attico.jpg' } },
        mainEntityOfPage: url, isPartOf: { '@id': SITO + '#sito' }, mentions: { '@id': SITO + '#alloggio' } },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Attico Panoramico', item: indirizzo(l) },
        { '@type': 'ListItem', position: 2, name: c.breve, item: url } ] },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: c.faq.map(q => ({
        '@type': 'Question', name: q[0], acceptedAnswer: { '@type': 'Answer', text: q[1].replace(/<[^>]+>/g, '') } })) }
    ].map(jsonLd).join('\n');

    let html = modelloGuida
      .replace('{{HREFLANG}}', hreflang).replace('{{JSONLD}}', ld).replace('{{ICONE}}', ICONE)
      .replace('{{CORPO}}', corpo).replace('{{FAQ}}', faq).replace('{{ALTRE}}', altre).replace('{{TUTTE}}', tutte)
      .replace('{{LINGUE_CORTE}}', corte).replace('{{LINGUE_LUNGHE}}', lunghe)
      .replace(/\{\{TITLE\}\}/g, esc(c.title)).replace(/\{\{DESC\}\}/g, esc(c.desc)).replace(/\{\{URL\}\}/g, url)
      .replace(/\{\{H1\}\}/g, c.h1).replace(/\{\{BREVE\}\}/g, c.breve).replace(/\{\{EYEBROW\}\}/g, c.eyebrow)
      .replace(/\{\{LEAD\}\}/g, c.lead).replace(/\{\{ALT\}\}/g, esc(c.alt))
      .replace(/\{\{FOTO_JPG\}\}/g, fotoJpg).replace(/\{\{FOTO\}\}/g, g.foto).replace(/\{\{OG_LOCALE\}\}/g, OG_LOCALE[l])
      .replace(/\{\{V_CSS\}\}/g, versioneCss).replace(/\{\{V_CONSENSO\}\}/g, versioneConsenso).replace(/\{\{HOME\}\}/g, home).replace(/\{\{LANG\}\}/g, l)
      .replace(/\{\{PRIVACY\}\}/g, base + PRIVACY[l].slug)
      .replace(/\{\{UI:(\w+)\}\}/g, (m, k) => { if (!(k in ui)) throw new Error('UI mancante: ' + k); return ui[k]; })
      .replace(/\{\{T:(\w+)\}\}/g, (m, k) => { if (!(k in T)) throw new Error('Testo mancante: ' + k); return T[k]; })
      .replace(/\{\{BASE\}\}/g, base)
      .replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<!-- Pagina creata da genera-pagine.js: per modificarla cambiare guide.js o modello-guida.html -->');
    if (/\{\{[A-Z_:a-z]+\}\}/.test(html)) throw new Error('Segnaposto rimasto in ' + c.slug + ': ' + html.match(/\{\{[^}]+\}\}/)[0]);

    const file = c.slug + 'index.html';
    fs.mkdirSync(path.join(DIR, c.slug), { recursive: true });
    fs.writeFileSync(path.join(DIR, file), html, 'utf8');
    pagineGuida.push({ g, l });
    console.log('Creata ' + file + ' (' + Math.round(html.length / 1024) + ' KB)');
  }
}

/* =============================================================================
   PRIVACY E COOKIE: 4 pagine da modello-privacy.html + privacy.js
   (noindex e fuori dalla sitemap: servono agli ospiti, non alle ricerche)
   ============================================================================= */
const modelloPrivacy = leggi('modello-privacy.html');
const ICONE_PRIVACY = ['i-arrow', 'i-whatsapp'].map(icona).join('\n');
for (const { l } of LINGUE) {
  const p = PRIVACY[l], ui = ctx.GUIDE_UI[l], T = TESTI[l];
  const base = '../'.repeat(p.slug.split('/').filter(Boolean).length);
  const home = base + (l === 'it' ? '' : l + '/');
  const hreflang = LINGUE.map(x => '  <link rel="alternate" hreflang="' + x.l + '" href="' + SITO + PRIVACY[x.l].slug + '">').join('\n');
  const corte = LINGUE.map(x => '<a href="' + base + PRIVACY[x.l].slug + '" hreflang="' + x.l + '" lang="' + x.l + '"' + (x.l === l ? ' aria-current="page"' : '') + '>' + x.l.toUpperCase() + '</a>').join('');
  const lunghe = LINGUE.filter(x => x.l !== l).map(x => '<a href="' + base + PRIVACY[x.l].slug + '" hreflang="' + x.l + '" lang="' + x.l + '">' + NOMI_LINGUA[x.l] + '</a>').join(' · ');
  const tutte = GUIDE.map(x => '<li><a href="' + base + x[l].slug + '">' + x[l].breve + '</a></li>').join('');

  let html = modelloPrivacy
    .replace('{{HREFLANG}}', hreflang).replace('{{ICONE}}', ICONE_PRIVACY).replace('{{CORPO}}', () => p.corpo.trim())
    .replace('{{TUTTE}}', tutte).replace('{{LINGUE_CORTE}}', corte).replace('{{LINGUE_LUNGHE}}', lunghe)
    .replace(/\{\{TITLE\}\}/g, esc(p.title)).replace(/\{\{DESC\}\}/g, esc(p.desc)).replace(/\{\{URL\}\}/g, SITO + p.slug)
    .replace(/\{\{H1\}\}/g, p.h1).replace(/\{\{LEAD\}\}/g, p.lead).replace(/\{\{DATA\}\}/g, p.data).replace('{{ALTRE_LINGUE}}', p.lingue)
    .replace(/\{\{PRIVACY\}\}/g, base + p.slug)
    .replace(/\{\{V_CSS\}\}/g, versioneCss).replace(/\{\{V_CONSENSO\}\}/g, versioneConsenso)
    .replace(/\{\{HOME\}\}/g, home).replace(/\{\{LANG\}\}/g, l)
    .replace(/\{\{UI:(\w+)\}\}/g, (m, k) => { if (!(k in ui)) throw new Error('UI mancante: ' + k); return ui[k]; })
    .replace(/\{\{T:(\w+)\}\}/g, (m, k) => { if (!(k in T)) throw new Error('Testo mancante: ' + k); return T[k]; })
    .replace(/\{\{BASE\}\}/g, base)
    .replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<!-- Pagina creata da genera-pagine.js: per modificarla cambiare privacy.js o modello-privacy.html -->');
  if (/\{\{[A-Z_:a-z]+\}\}/.test(html)) throw new Error('Segnaposto rimasto in ' + p.slug + ': ' + html.match(/\{\{[^}]+\}\}/)[0]);

  fs.mkdirSync(path.join(DIR, p.slug), { recursive: true });
  fs.writeFileSync(path.join(DIR, p.slug + 'index.html'), html, 'utf8');
  console.log('Creata ' + p.slug + 'index.html (' + Math.round(html.length / 1024) + ' KB)');
}

/* Mappa del sito per i motori di ricerca: pagine principali e guide, con i collegamenti tra lingue e le foto */
const oggi = new Date().toISOString().slice(0, 10);
const alternative = LINGUE.map(({ l }) => '    <xhtml:link rel="alternate" hreflang="' + l + '" href="' + indirizzo(l) + '"/>').join('\n') +
  '\n    <xhtml:link rel="alternate" hreflang="x-default" href="' + indirizzo('en') + '"/>';
const immagini = FOTO.map(f => '    <image:image><image:loc>' + SITO + 'images/' + f.file + '</image:loc></image:image>').join('\n');
const urlGuide = pagineGuida.map(({ g, l }) =>
  '  <url>\n    <loc>' + SITO + g[l].slug + '</loc>\n    <lastmod>' + GUIDE_DATA + '</lastmod>\n' +
  LINGUE.map(x => '    <xhtml:link rel="alternate" hreflang="' + x.l + '" href="' + SITO + g[x.l].slug + '"/>').join('\n') +
  '\n    <xhtml:link rel="alternate" hreflang="x-default" href="' + SITO + g.en.slug + '"/>' +
  '\n    <image:image><image:loc>' + SITO + 'images/' + g.foto + '-scaled-960x800_c.webp</image:loc></image:image>\n  </url>').join('\n');
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<!-- Creata da genera-pagine.js -->\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n' +
  '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
  LINGUE.map(({ l }) => '  <url>\n    <loc>' + indirizzo(l) + '</loc>\n    <lastmod>' + oggi + '</lastmod>\n' + alternative + '\n' + immagini + '\n  </url>').join('\n') +
  '\n' + urlGuide + '\n</urlset>\n';
fs.writeFileSync(path.join(DIR, 'sitemap.xml'), sitemap, 'utf8');
console.log('Creata sitemap.xml (' + LINGUE.length + ' pagine principali + ' + pagineGuida.length + ' guide)');

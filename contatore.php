<?php
/* =============================================================================
   ATTICO PANORAMICO — Contatore visite senza cookie

   - Ogni pagina del sito, aprendosi, chiama questo file (da consenso.js).
   - Si salva SOLO: giorno, pagina, da dove arriva (Google, WhatsApp, ...) e
     se è un telefono o un computer. Niente IP, niente cookie, niente dati
     personali: per questo non serve il consenso.
   - I numeri stanno in contatore-dati.php: la prima riga "<?php exit; ?>"
     fa sì che, aperto dal browser, il file risulti vuoto (dati non leggibili).
   - Per vederli:  https://www.atticopanoramico.it/contatore.php?vedi=CHIAVE
     (la chiave è qui sotto; il link è anche in "Le Mie Applicazioni").
   ============================================================================= */

const CHIAVE = 'Wd7qK2pZx9';
const FILE = __DIR__ . '/contatore-dati.php';
const TESTA = "<?php exit; ?>\n";

function leggiDati($testo) {
  $dati = json_decode(substr((string) $testo, strlen(TESTA)), true);
  return is_array($dati) ? $dati : array();
}
const GIORNI_CONSERVATI = 400;

date_default_timezone_set('Europe/Rome');
header('X-Robots-Tag: noindex');
header('Cache-Control: no-store');

if (isset($_GET['vedi'])) {
  if ($_GET['vedi'] !== CHIAVE) { http_response_code(403); exit('Chiave non valida.'); }
  mostra();
  exit;
}

/* ---------- Registrazione di una pagina vista ---------- */
http_response_code(204);
$ua = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
if ($ua === '' || preg_match('/bot|crawl|spider|slurp|preview|headless|lighthouse|python|curl|wget/i', $ua)) exit;

$pagina = isset($_GET['p']) ? (string) $_GET['p'] : '/';
$pagina = substr(preg_replace('/[^a-z0-9\/\-]/i', '', $pagina), 0, 80);
if ($pagina === '' || $pagina[0] !== '/') $pagina = '/';

$fonte = fonte(isset($_GET['r']) ? (string) $_GET['r'] : '');
$disp = preg_match('/Mobi|Android|iPhone|iPad/i', $ua) ? 'telefono' : 'computer';
$giorno = date('Y-m-d');

$fp = fopen(FILE, 'c+');
if (!$fp) exit;
flock($fp, LOCK_EX);
$dati = leggiDati(stream_get_contents($fp));
if (!isset($dati[$giorno])) $dati[$giorno] = array('totale' => 0, 'pagine' => array(), 'fonti' => array(), 'dispositivi' => array());
$g =& $dati[$giorno];
$g['totale']++;
$g['pagine'][$pagina] = (isset($g['pagine'][$pagina]) ? $g['pagine'][$pagina] : 0) + 1;
if ($fonte !== '') $g['fonti'][$fonte] = (isset($g['fonti'][$fonte]) ? $g['fonti'][$fonte] : 0) + 1;
$g['dispositivi'][$disp] = (isset($g['dispositivi'][$disp]) ? $g['dispositivi'][$disp] : 0) + 1;
unset($g);
ksort($dati);
while (count($dati) > GIORNI_CONSERVATI) array_shift($dati);
ftruncate($fp, 0);
rewind($fp);
fwrite($fp, TESTA . json_encode($dati));
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);
exit;

/* Da dove arriva il visitatore (solo il nome del sito, non l'indirizzo completo).
   Il passaggio da una pagina all'altra del sito non è un arrivo: stringa vuota. */
function fonte($r) {
  $host = strtolower((string) parse_url($r, PHP_URL_HOST));
  if ($host === '') return 'Diretto o link in un messaggio';
  if (strpos($host, 'atticopanoramico.it') !== false) return '';
  $nomi = array(
    'google' => 'Google', 'bing' => 'Bing', 'duckduckgo' => 'DuckDuckGo', 'yahoo' => 'Yahoo',
    'whatsapp' => 'WhatsApp', 'facebook' => 'Facebook', 'instagram' => 'Instagram',
    'airbnb' => 'Airbnb', 'booking' => 'Booking', 'vrbo' => 'Vrbo',
    'pxh2407.github.io' => 'App per gli ospiti', 'chatgpt' => 'ChatGPT', 'openai' => 'ChatGPT'
  );
  foreach ($nomi as $parola => $nome) if (strpos($host, $parola) !== false) return $nome;
  return 'Altri siti';
}

/* ---------- Pagina con i numeri ---------- */
function somma($dati, $da) {
  $t = array('totale' => 0, 'pagine' => array(), 'fonti' => array(), 'dispositivi' => array());
  foreach ($dati as $giorno => $g) {
    if ($giorno < $da) continue;
    $t['totale'] += $g['totale'];
    foreach (array('pagine', 'fonti', 'dispositivi') as $k)
      foreach ($g[$k] as $nome => $n) $t[$k][$nome] = (isset($t[$k][$nome]) ? $t[$k][$nome] : 0) + $n;
  }
  foreach (array('pagine', 'fonti', 'dispositivi') as $k) arsort($t[$k]);
  return $t;
}
function h($s) { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }
function elenco($titolo, $voci) {
  if (!$voci) return '';
  $max = max($voci);
  $totale = array_sum($voci);
  $o = '<h2>' . h($titolo) . '</h2><div class="box">';
  foreach ($voci as $nome => $n) {
    $o .= '<div class="riga"><div class="top"><span>' . h($nome) . '</span><em>' . $n . ' · ' . round($n * 100 / max($totale, 1)) . '%</em></div>'
        . '<div class="barra"><i style="width:' . round($n * 100 / $max, 1) . '%"></i></div></div>';
  }
  return $o . '</div>';
}

function mostra() {
  $dati = is_file(FILE) ? leggiDati(file_get_contents(FILE)) : array();
  $oggi = date('Y-m-d');
  $periodi = array('7' => 'Ultimi 7 giorni', '30' => 'Ultimi 30 giorni', '365' => 'Ultimo anno');
  $scelto = isset($_GET['giorni']) && isset($periodi[$_GET['giorni']]) ? $_GET['giorni'] : '30';
  $da = date('Y-m-d', strtotime('-' . ($scelto - 1) . ' days'));
  $t = somma($dati, $da);
  $oggiN = isset($dati[$oggi]) ? $dati[$oggi]['totale'] : 0;
  $inizio = $dati ? array_keys($dati)[0] : null;

  $giorniGrafico = array();
  for ($i = 29; $i >= 0; $i--) { $d = date('Y-m-d', strtotime("-$i days")); $giorniGrafico[$d] = isset($dati[$d]) ? $dati[$d]['totale'] : 0; }
  $maxG = max(1, max($giorniGrafico));
  $colonne = '';
  foreach ($giorniGrafico as $d => $n)
    $colonne .= '<div class="col" title="' . date('d/m', strtotime($d)) . ': ' . $n . '"><i style="height:' . round($n * 100 / $maxG, 1) . '%"></i></div>';

  $nomiPagine = array('/' => 'Pagina principale (italiano)', '/en/' => 'Pagina principale (inglese)', '/de/' => 'Pagina principale (tedesco)', '/fr/' => 'Pagina principale (francese)');
  $pagine = array();
  foreach ($t['pagine'] as $p => $n) $pagine[isset($nomiPagine[$p]) ? $nomiPagine[$p] : $p] = $n;

  $menu = '';
  foreach ($periodi as $k => $v) $menu .= '<a href="?vedi=' . CHIAVE . '&amp;giorni=' . $k . '"' . ($k === $scelto ? ' class="on"' : '') . '>' . $v . '</a>';

  header('Content-Type: text/html; charset=UTF-8');
  echo '<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Visite del sito – Attico Panoramico</title><style>
:root{--bg:#f6f8fa;--card:#fff;--ink:#16242f;--muted:#5a6b78;--line:#dde4ea;--sea:#1b6f9a;--soft:#e3f0f7}
@media (prefers-color-scheme:dark){:root{--bg:#0f1820;--card:#16222c;--ink:#e6edf2;--muted:#9db0bd;--line:#26353f;--sea:#6cb8e0;--soft:#173244;color-scheme:dark}}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.5 "Segoe UI",system-ui,sans-serif;padding:28px max(16px,env(safe-area-inset-left)) 48px}
main{max-width:720px;margin:0 auto;display:grid;gap:18px}h1{margin:0;font-size:1.9rem}h2{margin:10px 0 0;font-size:1.25rem}p{margin:0}.muted{color:var(--muted)}
.menu{display:flex;flex-wrap:wrap;gap:8px}.menu a{padding:5px 12px;border-radius:999px;border:1px solid var(--line);color:var(--ink);text-decoration:none}.menu a.on{background:var(--sea);border-color:var(--sea);color:#fff}
.numeri{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}.num{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px}.num b{display:block;font-size:2.1rem;color:var(--sea);line-height:1.1}
.box{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px 18px;display:grid;gap:12px}.top{display:flex;justify-content:space-between;gap:10px}.top em{font-style:normal;color:var(--muted);white-space:nowrap}
.barra{height:9px;border-radius:5px;background:var(--soft);margin-top:4px}.barra i{display:block;height:100%;border-radius:5px;background:var(--sea)}
.bottone{font:inherit;padding:7px 14px;border-radius:8px;border:1px solid var(--sea);background:var(--card);color:var(--sea);cursor:pointer}
.grafico{display:flex;align-items:flex-end;gap:3px;height:120px}.col{flex:1;height:100%;display:flex;align-items:flex-end;background:var(--soft);border-radius:3px}.col i{display:block;width:100%;background:var(--sea);border-radius:3px}
</style></head><body><main>
<h1>Visite del sito</h1>
<p class="muted">Contatore senza cookie di www.atticopanoramico.it: conta ogni pagina aperta da una persona (i motori di ricerca sono esclusi). ' . ($inizio ? 'Conta dal ' . date('d/m/Y', strtotime($inizio)) . '.' : 'Ancora nessuna visita registrata.') . '</p>
<nav class="menu">' . $menu . '</nav>
<div class="numeri"><div class="num"><b>' . $oggiN . '</b>Pagine viste oggi</div><div class="num"><b>' . $t['totale'] . '</b>Pagine viste: ' . h(strtolower($periodi[$scelto])) . '</div></div>
<h2>Giorno per giorno (ultimi 30 giorni)</h2><div class="box"><div class="grafico">' . $colonne . '</div><p class="muted">Ogni colonna è un giorno; tieni il dito o il mouse su una colonna per vedere il numero.</p></div>'
  . elenco('Da dove arrivano (ingressi nel sito)', $t['fonti'])
  . elenco('Con cosa navigano (pagine viste)', $t['dispositivi'])
  . elenco('Pagine più viste', $pagine)
  . '<p class="muted">"Diretto o link in un messaggio" comprende chi scrive l\'indirizzo, usa un preferito o apre il link da WhatsApp sul telefono (spesso l\'app non dice da dove arriva).</p>
<h2>Le tue visite</h2><div class="box" id="io"><p id="ioTesto">Controllo questo dispositivo…</p><p><button type="button" id="ioBtn" class="bottone" hidden></button></p></div>
</main>
<script>
/* Questa pagina la apre solo il proprietario: il dispositivo viene segnato e da qui in poi
   le sue visite al sito non si contano (né qui né in Google Analytics). Si può annullare. */
(function () {
  var K = "attico_non_contare", t = document.getElementById("ioTesto"), b = document.getElementById("ioBtn");
  function stato() {
    var escluso = false;
    try { escluso = localStorage.getItem(K) === "1"; } catch (e) { t.textContent = "Questo browser non permette di ricordare la scelta: le tue visite da qui vengono contate."; return; }
    t.innerHTML = escluso ? "<strong>Le visite fatte da questo dispositivo non vengono contate</strong> (né qui né in Google Analytics). Apri questa pagina una volta anche dagli altri tuoi telefoni e computer." : "Le visite fatte da questo dispositivo vengono contate come quelle degli ospiti.";
    b.textContent = escluso ? "Conta di nuovo questo dispositivo" : "Non contare questo dispositivo";
    b.hidden = false;
  }
  try { if (sessionStorage.getItem(K + "_scelta") !== "1" && localStorage.getItem(K) === null) localStorage.setItem(K, "1"); } catch (e) {}
  b.addEventListener("click", function () {
    try {
      if (localStorage.getItem(K) === "1") localStorage.setItem(K, "0"); else localStorage.setItem(K, "1");
      sessionStorage.setItem(K + "_scelta", "1");
    } catch (e) {}
    stato();
  });
  stato();
})();
</script></body></html>';
}

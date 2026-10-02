/* =============================================================================
   ATTICO PANORAMICO — TESTI DELLE GUIDE DI VIAGGIO (IT / EN / DE / FR)

   Contenuti presi SOLO dalle informazioni già presenti nel sito (testi.js):
   niente orari, prezzi o compagnie di navigazione, che cambiano spesso.
   Le distanze delle isole sono calcolate in linea d'aria dal porto di Milazzo
   con le coordinate della mappa (ISOLE in testi.js) e arrotondate a 5 km.

   Per modificare una guida si cambia questo file, poi:  node genera-pagine.js
   ============================================================================= */

/* Testi comuni delle pagine guida */
var GUIDE_UI = {
  it: {
    skip: 'Salta al contenuto principale',
    briciole: 'Percorso',
    altre: 'Altre guide',
    lingue: 'Questa guida è disponibile anche in',
    faq: 'Domande frequenti',
    aggiornata: 'Aggiornata a ottobre 2026',
    cta_titolo: 'Dormire a Milazzo, nel centro storico',
    cta_testo: 'L\'Attico Panoramico: terrazza vista mare, garage privato incluso, fino a 8 ospiti, a 15 minuti a piedi dal porto per le Isole Eolie.',
    cta_date: 'Verifica le date',
    cta_wa: 'Scrivici su WhatsApp',
    torna: 'Scopri l\'Attico Panoramico',
    guide_titolo: 'Guide di viaggio',
    tab_isola: 'Isola', tab_dist: 'Distanza da Milazzo', tab_sup: 'Superficie'
  },
  en: {
    skip: 'Skip to main content',
    briciole: 'Breadcrumb',
    altre: 'More guides',
    lingue: 'This guide is also available in',
    faq: 'Frequently asked questions',
    aggiornata: 'Updated October 2026',
    cta_titolo: 'Stay in Milazzo\'s historic centre',
    cta_testo: 'The Attico Panoramico: sea-view terrace, private garage included, sleeps up to 8, a 15-minute walk from the port for the Aeolian Islands.',
    cta_date: 'Check dates',
    cta_wa: 'Write us on WhatsApp',
    torna: 'Discover the Attico Panoramico',
    guide_titolo: 'Travel guides',
    tab_isola: 'Island', tab_dist: 'Distance from Milazzo', tab_sup: 'Area'
  },
  de: {
    skip: 'Zum Hauptinhalt springen',
    briciole: 'Navigationspfad',
    altre: 'Weitere Reiseführer',
    lingue: 'Diesen Reiseführer gibt es auch auf',
    faq: 'Häufige Fragen',
    aggiornata: 'Aktualisiert im Oktober 2026',
    cta_titolo: 'Übernachten in der Altstadt von Milazzo',
    cta_testo: 'Das Attico Panoramico: Terrasse mit Meerblick, Privatgarage inklusive, bis zu 8 Gäste, 15 Gehminuten vom Hafen zu den Äolischen Inseln.',
    cta_date: 'Termine prüfen',
    cta_wa: 'Schreiben Sie uns auf WhatsApp',
    torna: 'Das Attico Panoramico entdecken',
    guide_titolo: 'Reiseführer',
    tab_isola: 'Insel', tab_dist: 'Entfernung ab Milazzo', tab_sup: 'Fläche'
  },
  fr: {
    skip: 'Aller au contenu principal',
    briciole: 'Fil d\'Ariane',
    altre: 'Autres guides',
    lingue: 'Ce guide existe aussi en',
    faq: 'Questions fréquentes',
    aggiornata: 'Mis à jour en octobre 2026',
    cta_titolo: 'Loger à Milazzo, dans le centre historique',
    cta_testo: 'L\'Attico Panoramico : terrasse vue mer, garage privé inclus, jusqu\'à 8 voyageurs, à 15 minutes à pied du port pour les îles Éoliennes.',
    cta_date: 'Vérifier les dates',
    cta_wa: 'Écrivez-nous sur WhatsApp',
    torna: 'Découvrir l\'Attico Panoramico',
    guide_titolo: 'Guides de voyage',
    tab_isola: 'Île', tab_dist: 'Distance de Milazzo', tab_sup: 'Superficie'
  }
};

/* Isole con distanza (km, in linea d'aria dal porto) e superficie (km²) — vedi intestazione */
var GUIDE_ISOLE = [
  ['Vulcano', 30, 21], ['Lipari', 40, 37.6], ['Salina', 50, 26.8], ['Panarea', 50, 3.4],
  ['Stromboli', 65, 12.6], ['Filicudi', 70, 9.5], ['Alicudi', 85, 5.2]
];

var GUIDE = [

/* =========================================================================
   1. ISOLE EOLIE DA MILAZZO
   ========================================================================= */
{
  id: 'eolie',
  foto: 'DSC5134',
  icona: 'i-ship',
  it: {
    slug: 'guida/isole-eolie-da-milazzo/',
    breve: 'Isole Eolie da Milazzo',
    title: 'Isole Eolie da Milazzo: guida al porto e alle 7 isole',
    desc: 'Partire da Milazzo per le Isole Eolie: il porto a 15 minuti a piedi dal centro storico, aliscafi e traghetti per tutte e 7 le isole, distanze e consigli.',
    eyebrow: 'Guida · Isole Eolie',
    h1: 'Isole Eolie da Milazzo',
    lead: 'Come partire dal porto di Milazzo verso Lipari, Vulcano, Salina, Stromboli, Panarea, Filicudi e Alicudi.',
    alt: 'La terrazza panoramica dell\'Attico Panoramico sul mare di Milazzo, da cui partono le navi per le Eolie',
    corpo: `
<h2>Milazzo, la porta delle Eolie</h2>
<p>Le sette Isole Eolie si raggiungono dal porto di Milazzo con <strong>aliscafi e traghetti</strong> che collegano tutte le isole: Lipari, Vulcano, Salina, Stromboli, Panarea, Filicudi e Alicudi. Per questo molti viaggiatori scelgono di dormire a Milazzo: la sera si torna in città, si cena nel centro storico e il giorno dopo si riparte verso un'altra isola.</p>

<h2>Dal centro storico al porto, a piedi</h2>
<p>Dall'Attico Panoramico, in Via Cristoforo Colombo 7, il porto dista <strong>15 minuti a piedi</strong>. Non serve prendere l'auto né cercare parcheggio vicino agli imbarchi: la macchina resta nel <strong>garage privato</strong> incluso nel soggiorno, con accesso tramite telecomando.</p>

<h2>Le sette isole in breve</h2>
<p>Le distanze sono indicative, in linea d'aria dal porto di Milazzo; la superficie aiuta a capire quanto è grande ogni isola.</p>
{{TABELLA_ISOLE}}
<ul>
  <li><strong>Vulcano</strong> e <strong>Lipari</strong> sono le più vicine a Milazzo: comode per una prima gita.</li>
  <li><strong>Lipari</strong> è la più grande delle sette.</li>
  <li><strong>Salina</strong> e <strong>Panarea</strong> si trovano a circa 50 km; Panarea è la più piccola.</li>
  <li><strong>Stromboli</strong>, <strong>Filicudi</strong> e <strong>Alicudi</strong> sono le più lontane.</li>
</ul>

<h2>Gite in giornata</h2>
<p>Da Milazzo le Eolie sono ideali per escursioni giornaliere: si parte la mattina e si rientra in serata. Le isole più vicine, come Vulcano e Lipari, lasciano più tempo da trascorrere a terra; per quelle più lontane conviene scegliere le corse del mattino.</p>
<p>Orari, durata della traversata e prezzi cambiano con la stagione: conviene verificarli in anticipo presso le compagnie di navigazione e acquistare il biglietto per tempo nei mesi estivi.</p>

<h2>Dopo la gita: la sera a Milazzo</h2>
<p>Al rientro, il centro storico è a due passi: l'<strong>isola pedonale</strong> è il cuore della vita serale, con ristoranti di pesce fresco, arancini e granite siciliane. E dalla terrazza panoramica dell'Attico si guarda il mare da cui si è appena tornati.</p>
<p>Per organizzare il resto del soggiorno: <a href="{{LINK:cosa}}">cosa vedere a Milazzo</a> e <a href="{{LINK:arrivo}}">come arrivare a Milazzo</a>.</p>`,
    faq: [
      ['Quanto dista il porto di Milazzo dal centro storico?', 'Dall\'Attico Panoramico, nel centro storico, il porto si raggiunge in circa 15 minuti a piedi.'],
      ['Si possono visitare le Eolie in giornata partendo da Milazzo?', 'Sì: aliscafi e traghetti collegano Milazzo a tutte e 7 le isole, ideali per escursioni giornaliere con partenza al mattino e rientro la sera.'],
      ['Dove lasciare l\'auto durante la gita alle Eolie?', 'Chi soggiorna all\'Attico Panoramico ha un garage privato incluso: l\'auto resta lì e al porto si va a piedi.'],
      ['Qual è l\'isola eolia più vicina a Milazzo?', 'Vulcano, a circa 30 km in linea d\'aria dal porto; poi Lipari, a circa 40 km.']
    ]
  },
  en: {
    slug: 'en/guide/aeolian-islands-from-milazzo/',
    breve: 'Aeolian Islands from Milazzo',
    title: 'Aeolian Islands from Milazzo: port and island guide',
    desc: 'From Milazzo to the Aeolian Islands: the port is a 15-minute walk from the old town, with hydrofoils and ferries to all 7 islands. Distances and tips.',
    eyebrow: 'Guide · Aeolian Islands',
    h1: 'The Aeolian Islands from Milazzo',
    lead: 'How to set off from the port of Milazzo to Lipari, Vulcano, Salina, Stromboli, Panarea, Filicudi and Alicudi.',
    alt: 'The panoramic terrace of the Attico Panoramico overlooking the sea of Milazzo, where boats leave for the Aeolian Islands',
    corpo: `
<h2>Milazzo, gateway to the Aeolian Islands</h2>
<p>The seven Aeolian Islands are reached from the port of Milazzo by <strong>hydrofoils and ferries</strong> serving every island: Lipari, Vulcano, Salina, Stromboli, Panarea, Filicudi and Alicudi. That is why many travellers choose to stay in Milazzo: in the evening you are back in town for dinner in the historic centre, and the next day you set off for another island.</p>

<h2>From the historic centre to the port on foot</h2>
<p>From the Attico Panoramico, at Via Cristoforo Colombo 7, the port is a <strong>15-minute walk</strong>. No need to drive or to hunt for a parking space near the ferry docks: your car stays in the <strong>private garage</strong> included in your stay, with remote-controlled access.</p>

<h2>The seven islands at a glance</h2>
<p>Distances are approximate, as the crow flies from the port of Milazzo; the area gives an idea of how big each island is.</p>
{{TABELLA_ISOLE}}
<ul>
  <li><strong>Vulcano</strong> and <strong>Lipari</strong> are the closest to Milazzo: ideal for a first trip.</li>
  <li><strong>Lipari</strong> is the largest of the seven.</li>
  <li><strong>Salina</strong> and <strong>Panarea</strong> lie about 50 km away; Panarea is the smallest.</li>
  <li><strong>Stromboli</strong>, <strong>Filicudi</strong> and <strong>Alicudi</strong> are the furthest.</li>
</ul>

<h2>Day trips</h2>
<p>From Milazzo the Aeolian Islands are perfect for day trips: leave in the morning and return in the evening. The nearest islands, such as Vulcano and Lipari, leave you more time ashore; for the furthest ones, the morning departures are the best choice.</p>
<p>Timetables, crossing times and fares change with the season: check them in advance with the ferry companies and buy your tickets early in the summer months.</p>

<h2>After the trip: evenings in Milazzo</h2>
<p>Back in town, the historic centre is just steps away: the <strong>pedestrian area</strong> is the heart of the nightlife, with restaurants serving fresh fish, arancini and Sicilian granita. And from the Attico's panoramic terrace you can gaze at the sea you have just crossed.</p>
<p>To plan the rest of your stay: <a href="{{LINK:cosa}}">things to do in Milazzo</a> and <a href="{{LINK:arrivo}}">how to get to Milazzo</a>.</p>`,
    faq: [
      ['How far is the port of Milazzo from the historic centre?', 'From the Attico Panoramico, in the historic centre, the port is about a 15-minute walk.'],
      ['Can you visit the Aeolian Islands on a day trip from Milazzo?', 'Yes: hydrofoils and ferries link Milazzo with all 7 islands, which are ideal for day trips, leaving in the morning and returning in the evening.'],
      ['Where can I leave my car during a trip to the Aeolian Islands?', 'Guests of the Attico Panoramico have a private garage included: the car stays there and you walk to the port.'],
      ['Which Aeolian island is closest to Milazzo?', 'Vulcano, about 30 km from the port as the crow flies, followed by Lipari, about 40 km away.']
    ]
  },
  de: {
    slug: 'de/reisefuehrer/aeolische-inseln-ab-milazzo/',
    breve: 'Äolische Inseln ab Milazzo',
    title: 'Äolische Inseln ab Milazzo: Hafen und Inseln im Überblick',
    desc: 'Von Milazzo zu den Äolischen Inseln: Hafen 15 Gehminuten von der Altstadt, Tragflügelboote und Fähren zu allen 7 Inseln. Entfernungen und Tipps.',
    eyebrow: 'Reiseführer · Äolische Inseln',
    h1: 'Die Äolischen Inseln ab Milazzo',
    lead: 'So starten Sie vom Hafen Milazzo nach Lipari, Vulcano, Salina, Stromboli, Panarea, Filicudi und Alicudi.',
    alt: 'Die Panoramaterrasse des Attico Panoramico mit Blick auf das Meer von Milazzo, von wo die Schiffe zu den Äolischen Inseln fahren',
    corpo: `
<h2>Milazzo, das Tor zu den Äolischen Inseln</h2>
<p>Die sieben Äolischen Inseln erreicht man vom Hafen Milazzo mit <strong>Tragflügelbooten und Fähren</strong>, die alle Inseln anfahren: Lipari, Vulcano, Salina, Stromboli, Panarea, Filicudi und Alicudi. Deshalb übernachten viele Reisende in Milazzo: Abends ist man zurück in der Stadt, isst in der Altstadt zu Abend und fährt am nächsten Tag zu einer anderen Insel.</p>

<h2>Von der Altstadt zu Fuß zum Hafen</h2>
<p>Vom Attico Panoramico in der Via Cristoforo Colombo 7 sind es <strong>15 Minuten zu Fuß</strong> bis zum Hafen. Sie brauchen weder das Auto noch einen Parkplatz an den Anlegestellen: Der Wagen bleibt in der im Aufenthalt inbegriffenen <strong>Privatgarage</strong> mit Fernbedienung.</p>

<h2>Die sieben Inseln im Überblick</h2>
<p>Die Entfernungen sind ungefähre Luftlinien ab dem Hafen Milazzo; die Fläche zeigt, wie groß jede Insel ist.</p>
{{TABELLA_ISOLE}}
<ul>
  <li><strong>Vulcano</strong> und <strong>Lipari</strong> liegen Milazzo am nächsten: ideal für einen ersten Ausflug.</li>
  <li><strong>Lipari</strong> ist die größte der sieben Inseln.</li>
  <li><strong>Salina</strong> und <strong>Panarea</strong> liegen etwa 50 km entfernt; Panarea ist die kleinste.</li>
  <li><strong>Stromboli</strong>, <strong>Filicudi</strong> und <strong>Alicudi</strong> sind am weitesten entfernt.</li>
</ul>

<h2>Tagesausflüge</h2>
<p>Von Milazzo aus eignen sich die Äolischen Inseln ideal für Tagesausflüge: morgens los, abends zurück. Die nächstgelegenen Inseln wie Vulcano und Lipari lassen mehr Zeit an Land; für die entfernteren Inseln wählt man am besten die Abfahrten am Morgen.</p>
<p>Fahrpläne, Überfahrtszeiten und Preise ändern sich je nach Saison: Prüfen Sie sie vorab bei den Reedereien und kaufen Sie Ihre Tickets in den Sommermonaten frühzeitig.</p>

<h2>Nach dem Ausflug: Abende in Milazzo</h2>
<p>Zurück in der Stadt ist die Altstadt nur wenige Schritte entfernt: Die <strong>Fußgängerzone</strong> ist das Herz des Abendlebens, mit Restaurants für frischen Fisch, Arancini und sizilianische Granita. Und von der Panoramaterrasse des Attico blicken Sie auf das Meer, über das Sie gerade zurückgekommen sind.</p>
<p>Für den Rest Ihres Aufenthalts: <a href="{{LINK:cosa}}">Sehenswürdigkeiten in Milazzo</a> und <a href="{{LINK:arrivo}}">Anreise nach Milazzo</a>.</p>`,
    faq: [
      ['Wie weit ist der Hafen von Milazzo von der Altstadt entfernt?', 'Vom Attico Panoramico in der Altstadt erreichen Sie den Hafen in etwa 15 Minuten zu Fuß.'],
      ['Kann man die Äolischen Inseln als Tagesausflug ab Milazzo besuchen?', 'Ja: Tragflügelboote und Fähren verbinden Milazzo mit allen 7 Inseln, die sich ideal für Tagesausflüge eignen – morgens hin, abends zurück.'],
      ['Wo lasse ich das Auto während des Ausflugs zu den Äolischen Inseln?', 'Gäste des Attico Panoramico haben eine Privatgarage inklusive: Das Auto bleibt dort, und zum Hafen geht man zu Fuß.'],
      ['Welche Äolische Insel liegt Milazzo am nächsten?', 'Vulcano, etwa 30 km Luftlinie vom Hafen, danach Lipari mit etwa 40 km.']
    ]
  },
  fr: {
    slug: 'fr/guide/iles-eoliennes-depuis-milazzo/',
    breve: 'Îles Éoliennes depuis Milazzo',
    title: 'Îles Éoliennes depuis Milazzo : le port et les 7 îles',
    desc: 'Les îles Éoliennes depuis Milazzo : port à 15 minutes à pied du centre historique, hydroglisseurs et ferries vers les 7 îles. Distances et conseils.',
    eyebrow: 'Guide · Îles Éoliennes',
    h1: 'Les îles Éoliennes depuis Milazzo',
    lead: 'Comment partir du port de Milazzo vers Lipari, Vulcano, Salina, Stromboli, Panarea, Filicudi et Alicudi.',
    alt: 'La terrasse panoramique de l\'Attico Panoramico face à la mer de Milazzo, d\'où partent les bateaux pour les îles Éoliennes',
    corpo: `
<h2>Milazzo, porte des îles Éoliennes</h2>
<p>On rejoint les sept îles Éoliennes depuis le port de Milazzo grâce aux <strong>hydroglisseurs et aux ferries</strong> qui desservent toutes les îles : Lipari, Vulcano, Salina, Stromboli, Panarea, Filicudi et Alicudi. C'est pourquoi beaucoup de voyageurs choisissent de loger à Milazzo : le soir, on revient en ville pour dîner dans le centre historique, et le lendemain on repart vers une autre île.</p>

<h2>Du centre historique au port, à pied</h2>
<p>Depuis l'Attico Panoramico, Via Cristoforo Colombo 7, le port est à <strong>15 minutes à pied</strong>. Inutile de prendre la voiture ou de chercher une place près des embarcadères : elle reste dans le <strong>garage privé</strong> inclus dans le séjour, avec accès par télécommande.</p>

<h2>Les sept îles en bref</h2>
<p>Les distances sont indicatives, à vol d'oiseau depuis le port de Milazzo ; la superficie donne une idée de la taille de chaque île.</p>
{{TABELLA_ISOLE}}
<ul>
  <li><strong>Vulcano</strong> et <strong>Lipari</strong> sont les plus proches de Milazzo : idéales pour une première excursion.</li>
  <li><strong>Lipari</strong> est la plus grande des sept.</li>
  <li><strong>Salina</strong> et <strong>Panarea</strong> se trouvent à environ 50 km ; Panarea est la plus petite.</li>
  <li><strong>Stromboli</strong>, <strong>Filicudi</strong> et <strong>Alicudi</strong> sont les plus éloignées.</li>
</ul>

<h2>Excursions à la journée</h2>
<p>Depuis Milazzo, les îles Éoliennes sont idéales pour des excursions à la journée : départ le matin, retour le soir. Les îles les plus proches, comme Vulcano et Lipari, laissent plus de temps à terre ; pour les plus éloignées, mieux vaut choisir les départs du matin.</p>
<p>Horaires, durée de la traversée et tarifs varient selon la saison : vérifiez-les à l'avance auprès des compagnies maritimes et achetez vos billets tôt en été.</p>

<h2>Après l'excursion : les soirées à Milazzo</h2>
<p>De retour en ville, le centre historique est à deux pas : la <strong>zone piétonne</strong> est le cœur de la vie nocturne, avec ses restaurants de poisson frais, ses arancini et ses granités siciliens. Et depuis la terrasse panoramique de l'Attico, vous contemplez la mer que vous venez de traverser.</p>
<p>Pour organiser la suite du séjour : <a href="{{LINK:cosa}}">que voir à Milazzo</a> et <a href="{{LINK:arrivo}}">comment venir à Milazzo</a>.</p>`,
    faq: [
      ['À quelle distance le port de Milazzo se trouve-t-il du centre historique ?', 'Depuis l\'Attico Panoramico, dans le centre historique, le port est à environ 15 minutes à pied.'],
      ['Peut-on visiter les îles Éoliennes à la journée depuis Milazzo ?', 'Oui : hydroglisseurs et ferries relient Milazzo aux 7 îles, idéales pour des excursions à la journée, avec départ le matin et retour le soir.'],
      ['Où laisser la voiture pendant l\'excursion aux îles Éoliennes ?', 'Les hôtes de l\'Attico Panoramico disposent d\'un garage privé inclus : la voiture y reste et l\'on va au port à pied.'],
      ['Quelle île éolienne est la plus proche de Milazzo ?', 'Vulcano, à environ 30 km à vol d\'oiseau du port, puis Lipari, à environ 40 km.']
    ]
  }
},

/* =========================================================================
   2. COSA VEDERE A MILAZZO
   ========================================================================= */
{
  id: 'cosa',
  foto: 'DSC5148',
  icona: 'i-castle',
  it: {
    slug: 'guida/cosa-vedere-a-milazzo/',
    breve: 'Cosa vedere a Milazzo',
    title: 'Cosa vedere a Milazzo: castello, Capo Milazzo e spiagge',
    desc: 'Cosa vedere a Milazzo: il Castello e la Cittadella, la Piscina di Venere a Capo Milazzo, le spiagge di Ponente e della Baia del Tono, storia e cucina.',
    eyebrow: 'Guida · Milazzo',
    h1: 'Cosa vedere a Milazzo',
    lead: 'Castello, Capo Milazzo, spiagge, storia e cucina: la città da scoprire oltre il porto per le Eolie.',
    alt: 'L\'angolo relax con sdraio sulla terrazza dell\'Attico Panoramico a Milazzo',
    corpo: `
<h2>Il Castello e la Cittadella</h2>
<p>È la <strong>cittadella fortificata più grande della Sicilia</strong>: oltre 7 ettari di storia. All'interno si visitano il <strong>Duomo Antico</strong> (1608) e il <strong>MuMa – Museo del Mare</strong>. Dall'Attico Panoramico si raggiunge in circa <strong>10 minuti a piedi</strong>.</p>

<h2>Capo Milazzo e la Piscina di Venere</h2>
<p>Capo Milazzo è un promontorio lungo circa 8 km che si allunga nel Mar Tirreno. Sulla sua punta estrema si trova la <strong>Piscina di Venere</strong>, una piscina naturale: uno dei luoghi più spettacolari della zona.</p>

<h2>Le spiagge</h2>
<p>La <strong>Spiaggia di Ponente</strong> è a 5 minuti a piedi dall'appartamento; anche la spiaggia di <strong>Croce di Mare</strong> si raggiunge in pochi minuti. Poco più lontano c'è la <strong>Baia del Tono</strong>.</p>

<h2>Storia e cultura</h2>
<p>Milazzo fu fondata dai Greci nel <strong>716 a.C.</strong> Nelle sue acque Roma ottenne la sua prima vittoria navale (260 a.C.) e qui, nel 1860, si combatté la battaglia di Garibaldi. Da visitare anche il <strong>Santuario di San Francesco di Paola</strong>, l'unico in Sicilia dedicato al santo.</p>

<h2>Cucina e serate</h2>
<p>A tavola: pesce fresco, arancini, granite siciliane e vini dell'Etna. Vicino all'Attico ci sono ristoranti come La Campagnola, Adagio-Adagio e Macchianera, e l'<strong>isola pedonale</strong> è il cuore della vita serale.</p>

<h2>Un itinerario a piedi dall'Attico</h2>
<ol>
  <li><strong>Mattina</strong>: il Castello e la Cittadella (10 minuti a piedi), con il Duomo Antico e il MuMa.</li>
  <li><strong>Pomeriggio</strong>: mare alla Spiaggia di Ponente (5 minuti a piedi).</li>
  <li><strong>Sera</strong>: passeggiata e cena nell'isola pedonale del centro storico.</li>
</ol>
<p>Con un giorno in più: Capo Milazzo e la Piscina di Venere, oppure una <a href="{{LINK:eolie}}">gita alle Isole Eolie</a> dal porto, a 15 minuti a piedi. Per il viaggio: <a href="{{LINK:arrivo}}">come arrivare a Milazzo</a>.</p>`,
    faq: [
      ['Cosa vedere a Milazzo in un giorno?', 'Il Castello e la Cittadella, una spiaggia come quella di Ponente e una passeggiata serale nell\'isola pedonale: dall\'Attico Panoramico sono tutti raggiungibili a piedi.'],
      ['Dove si trova la Piscina di Venere?', 'Sulla punta estrema di Capo Milazzo, il promontorio di circa 8 km che si allunga nel Mar Tirreno.'],
      ['Quanto dista la spiaggia dal centro di Milazzo?', 'Dall\'Attico Panoramico, nel centro storico, la Spiaggia di Ponente è a 5 minuti a piedi.']
    ]
  },
  en: {
    slug: 'en/guide/things-to-do-in-milazzo/',
    breve: 'Things to do in Milazzo',
    title: 'Things to do in Milazzo: castle, cape and beaches',
    desc: 'What to see in Milazzo, Sicily: the Castle and Citadel, the Venus Pool on Cape Milazzo, Ponente beach and Baia del Tono, history and local food.',
    eyebrow: 'Guide · Milazzo',
    h1: 'Things to do in Milazzo',
    lead: 'Castle, cape, beaches, history and food: the town to discover beyond the port for the Aeolian Islands.',
    alt: 'The relaxation corner with sun loungers on the terrace of the Attico Panoramico in Milazzo',
    corpo: `
<h2>The Castle and Citadel</h2>
<p>It is the <strong>largest fortified citadel in Sicily</strong>: more than 7 hectares of history. Inside you can visit the <strong>Ancient Cathedral</strong> (1608) and the <strong>MuMa – Sea Museum</strong>. From the Attico Panoramico it is about a <strong>10-minute walk</strong>.</p>

<h2>Cape Milazzo and the Venus Pool</h2>
<p>Cape Milazzo is a promontory about 8 km long reaching out into the Tyrrhenian Sea. At its very tip lies the <strong>Venus Pool</strong> (Piscina di Venere), a natural pool and one of the most spectacular spots in the area.</p>

<h2>Beaches</h2>
<p><strong>Ponente Beach</strong> is a 5-minute walk from the apartment, and <strong>Croce di Mare</strong> beach is also just a few minutes away. A little further on is <strong>Baia del Tono</strong>.</p>

<h2>History and culture</h2>
<p>Milazzo was founded by the Greeks in <strong>716 BC</strong>. Its waters saw Rome's first naval victory (260 BC), and in 1860 Garibaldi fought a battle here. Also worth a visit is the <strong>Sanctuary of San Francesco di Paola</strong>, the only one in Sicily dedicated to the saint.</p>

<h2>Food and evenings</h2>
<p>On the table: fresh fish, arancini, Sicilian granita and Etna wines. Near the Attico you will find restaurants such as La Campagnola, Adagio-Adagio and Macchianera, and the <strong>pedestrian area</strong> is the heart of the town's nightlife.</p>

<h2>A walking itinerary from the Attico</h2>
<ol>
  <li><strong>Morning</strong>: the Castle and Citadel (10 minutes on foot), with the Ancient Cathedral and the MuMa.</li>
  <li><strong>Afternoon</strong>: the sea at Ponente Beach (5 minutes on foot).</li>
  <li><strong>Evening</strong>: a stroll and dinner in the pedestrian area of the historic centre.</li>
</ol>
<p>With an extra day: Cape Milazzo and the Venus Pool, or a <a href="{{LINK:eolie}}">trip to the Aeolian Islands</a> from the port, a 15-minute walk away. For your journey: <a href="{{LINK:arrivo}}">how to get to Milazzo</a>.</p>`,
    faq: [
      ['What can you see in Milazzo in one day?', 'The Castle and Citadel, a beach such as Ponente and an evening stroll in the pedestrian area: from the Attico Panoramico they are all within walking distance.'],
      ['Where is the Venus Pool?', 'At the very tip of Cape Milazzo, the promontory about 8 km long reaching out into the Tyrrhenian Sea.'],
      ['How far is the beach from the centre of Milazzo?', 'From the Attico Panoramico, in the historic centre, Ponente Beach is a 5-minute walk.']
    ]
  },
  de: {
    slug: 'de/reisefuehrer/milazzo-sehenswuerdigkeiten/',
    breve: 'Sehenswürdigkeiten in Milazzo',
    title: 'Milazzo Sehenswürdigkeiten: Burg, Kap und Strände',
    desc: 'Was man in Milazzo sehen sollte: Burg und Zitadelle, der Venuspool am Kap Milazzo, die Strände Ponente und Baia del Tono, Geschichte und Küche.',
    eyebrow: 'Reiseführer · Milazzo',
    h1: 'Sehenswürdigkeiten in Milazzo',
    lead: 'Burg, Kap, Strände, Geschichte und Küche: die Stadt jenseits des Hafens zu den Äolischen Inseln.',
    alt: 'Die Relax-Ecke mit Liegestühlen auf der Terrasse des Attico Panoramico in Milazzo',
    corpo: `
<h2>Burg und Zitadelle</h2>
<p>Sie ist die <strong>größte befestigte Zitadelle Siziliens</strong>: mehr als 7 Hektar Geschichte. Im Inneren besichtigen Sie den <strong>Alten Dom</strong> (1608) und das <strong>MuMa – Meeresmuseum</strong>. Vom Attico Panoramico sind es etwa <strong>10 Minuten zu Fuß</strong>.</p>

<h2>Kap Milazzo und der Venuspool</h2>
<p>Das Kap Milazzo ist ein etwa 8 km langes Vorgebirge im Tyrrhenischen Meer. An seiner äußersten Spitze liegt der <strong>Venuspool</strong> (Piscina di Venere), ein natürliches Becken und einer der spektakulärsten Orte der Gegend.</p>

<h2>Strände</h2>
<p>Der <strong>Ponente-Strand</strong> liegt 5 Gehminuten von der Wohnung entfernt, auch der Strand <strong>Croce di Mare</strong> ist in wenigen Minuten erreichbar. Etwas weiter liegt die <strong>Baia del Tono</strong>.</p>

<h2>Geschichte und Kultur</h2>
<p>Milazzo wurde <strong>716 v. Chr.</strong> von den Griechen gegründet. Vor seiner Küste errang Rom seinen ersten Seesieg (260 v. Chr.), und 1860 kämpfte hier Garibaldi. Sehenswert ist auch das <strong>Heiligtum San Francesco di Paola</strong>, das einzige in Sizilien, das diesem Heiligen gewidmet ist.</p>

<h2>Küche und Abende</h2>
<p>Auf den Tisch kommen frischer Fisch, Arancini, sizilianische Granita und Ätna-Weine. In der Nähe des Attico finden Sie Restaurants wie La Campagnola, Adagio-Adagio und Macchianera, und die <strong>Fußgängerzone</strong> ist das Herz des Abendlebens.</p>

<h2>Ein Rundgang zu Fuß ab dem Attico</h2>
<ol>
  <li><strong>Vormittag</strong>: Burg und Zitadelle (10 Minuten zu Fuß) mit dem Alten Dom und dem MuMa.</li>
  <li><strong>Nachmittag</strong>: Baden am Ponente-Strand (5 Minuten zu Fuß).</li>
  <li><strong>Abend</strong>: Spaziergang und Abendessen in der Fußgängerzone der Altstadt.</li>
</ol>
<p>Mit einem zusätzlichen Tag: das Kap Milazzo und der Venuspool oder ein <a href="{{LINK:eolie}}">Ausflug zu den Äolischen Inseln</a> ab dem Hafen, 15 Minuten zu Fuß entfernt. Für die Reise: <a href="{{LINK:arrivo}}">Anreise nach Milazzo</a>.</p>`,
    faq: [
      ['Was kann man in Milazzo an einem Tag sehen?', 'Burg und Zitadelle, einen Strand wie Ponente und einen Abendspaziergang in der Fußgängerzone: Vom Attico Panoramico ist alles zu Fuß erreichbar.'],
      ['Wo liegt der Venuspool?', 'An der äußersten Spitze des Kap Milazzo, des etwa 8 km langen Vorgebirges im Tyrrhenischen Meer.'],
      ['Wie weit ist der Strand vom Zentrum Milazzos entfernt?', 'Vom Attico Panoramico in der Altstadt erreichen Sie den Ponente-Strand in 5 Minuten zu Fuß.']
    ]
  },
  fr: {
    slug: 'fr/guide/que-voir-a-milazzo/',
    breve: 'Que voir à Milazzo',
    title: 'Que voir à Milazzo : château, cap et plages',
    desc: 'Que voir à Milazzo : le château et la citadelle, la Piscine de Vénus au cap Milazzo, les plages de Ponente et de la Baia del Tono, histoire et cuisine.',
    eyebrow: 'Guide · Milazzo',
    h1: 'Que voir à Milazzo',
    lead: 'Château, cap, plages, histoire et cuisine : la ville à découvrir au-delà du port pour les îles Éoliennes.',
    alt: 'Le coin détente avec transats sur la terrasse de l\'Attico Panoramico à Milazzo',
    corpo: `
<h2>Le château et la citadelle</h2>
<p>C'est la <strong>plus grande citadelle fortifiée de Sicile</strong> : plus de 7 hectares d'histoire. À l'intérieur, on visite l'<strong>Ancienne Cathédrale</strong> (1608) et le <strong>MuMa – Musée de la Mer</strong>. Depuis l'Attico Panoramico, elle est à environ <strong>10 minutes à pied</strong>.</p>

<h2>Le cap Milazzo et la Piscine de Vénus</h2>
<p>Le cap Milazzo est un promontoire d'environ 8 km qui s'avance dans la mer Tyrrhénienne. À sa pointe extrême se trouve la <strong>Piscine de Vénus</strong> (Piscina di Venere), une piscine naturelle et l'un des lieux les plus spectaculaires de la région.</p>

<h2>Les plages</h2>
<p>La <strong>plage de Ponente</strong> est à 5 minutes à pied de l'appartement, et la plage de <strong>Croce di Mare</strong> n'est qu'à quelques minutes. Un peu plus loin se trouve la <strong>Baia del Tono</strong>.</p>

<h2>Histoire et culture</h2>
<p>Milazzo fut fondée par les Grecs en <strong>716 av. J.-C.</strong> Ses eaux virent la première victoire navale de Rome (260 av. J.-C.), et en 1860 Garibaldi y livra bataille. À voir aussi : le <strong>Sanctuaire de San Francesco di Paola</strong>, le seul en Sicile dédié à ce saint.</p>

<h2>Cuisine et soirées</h2>
<p>À table : poisson frais, arancini, granités siciliens et vins de l'Etna. Près de l'Attico, vous trouverez des restaurants comme La Campagnola, Adagio-Adagio et Macchianera, et la <strong>zone piétonne</strong> est le cœur de la vie nocturne.</p>

<h2>Un itinéraire à pied depuis l'Attico</h2>
<ol>
  <li><strong>Matin</strong> : le château et la citadelle (10 minutes à pied), avec l'Ancienne Cathédrale et le MuMa.</li>
  <li><strong>Après-midi</strong> : baignade à la plage de Ponente (5 minutes à pied).</li>
  <li><strong>Soir</strong> : promenade et dîner dans la zone piétonne du centre historique.</li>
</ol>
<p>Avec une journée de plus : le cap Milazzo et la Piscine de Vénus, ou une <a href="{{LINK:eolie}}">excursion aux îles Éoliennes</a> depuis le port, à 15 minutes à pied. Pour le voyage : <a href="{{LINK:arrivo}}">comment venir à Milazzo</a>.</p>`,
    faq: [
      ['Que voir à Milazzo en une journée ?', 'Le château et la citadelle, une plage comme celle de Ponente et une promenade du soir dans la zone piétonne : depuis l\'Attico Panoramico, tout se fait à pied.'],
      ['Où se trouve la Piscine de Vénus ?', 'À la pointe extrême du cap Milazzo, le promontoire d\'environ 8 km qui s\'avance dans la mer Tyrrhénienne.'],
      ['À quelle distance est la plage du centre de Milazzo ?', 'Depuis l\'Attico Panoramico, dans le centre historique, la plage de Ponente est à 5 minutes à pied.']
    ]
  }
},

/* =========================================================================
   3. COME ARRIVARE A MILAZZO
   ========================================================================= */
{
  id: 'arrivo',
  foto: 'DSC5102',
  icona: 'i-route',
  it: {
    slug: 'guida/come-arrivare-a-milazzo/',
    breve: 'Come arrivare a Milazzo',
    title: 'Come arrivare a Milazzo da Catania, Palermo e Messina',
    desc: 'Come arrivare a Milazzo: da Catania 1h40, da Palermo 2h15 e da Messina 35 minuti in auto, oppure in treno sulla linea Messina–Palermo. E dove parcheggiare.',
    eyebrow: 'Guida · Viaggio',
    h1: 'Come arrivare a Milazzo',
    lead: 'In aereo, in auto o in treno: tempi, strade e cosa sapere una volta arrivati nel centro storico.',
    alt: 'Il soggiorno con zona pranzo dell\'Attico Panoramico, casa vacanze nel centro storico di Milazzo',
    corpo: `
<h2>In aereo</h2>
<p>Gli aeroporti di riferimento sono due:</p>
<ul>
  <li><strong>Catania Fontanarossa (CTA)</strong>: circa 1 ora e 40 minuti in auto, con le autostrade A18 e A20.</li>
  <li><strong>Palermo Falcone-Borsellino (PMO)</strong>: circa 2 ore e 15 minuti in auto, con l'autostrada A20.</li>
</ul>

<h2>In auto</h2>
<p>Milazzo si raggiunge con l'autostrada A20. Da <strong>Messina</strong> servono circa 35 minuti.</p>

<h2>In treno</h2>
<p>Milazzo ha una stazione ferroviaria sulla linea <strong>Messina–Palermo</strong>.</p>

<h2>Una volta arrivati: parcheggio e distanze</h2>
<p>Chi soggiorna all'Attico Panoramico, in Via Cristoforo Colombo 7 nel centro storico, ha un <strong>garage privato incluso</strong> con accesso tramite telecomando e l'ascensore nel palazzo. A 200 metri c'è una stazione di ricarica per auto elettriche.</p>
<p>Dall'appartamento, a piedi:</p>
<ul>
  <li>Supermercato Conad: 300 metri</li>
  <li>Spiaggia di Ponente: 5 minuti</li>
  <li>Guardia medica 24 ore su 24: 5 minuti</li>
  <li>Castello e Cittadella: 10 minuti</li>
  <li>Porto per le Isole Eolie: 15 minuti</li>
</ul>
<p>Per organizzare l'arrivo potete contattarci direttamente per telefono o WhatsApp al <a href="tel:+393880775449">+39 388 077 5449</a>. E una volta qui: <a href="{{LINK:cosa}}">cosa vedere a Milazzo</a> e <a href="{{LINK:eolie}}">le Isole Eolie da Milazzo</a>.</p>`,
    faq: [
      ['Quanto dista Milazzo dagli aeroporti di Catania e Palermo?', 'In auto, circa 1 ora e 40 minuti da Catania Fontanarossa (CTA) e circa 2 ore e 15 minuti da Palermo (PMO).'],
      ['Si può arrivare a Milazzo in treno?', 'Sì, Milazzo ha una stazione ferroviaria sulla linea Messina–Palermo.'],
      ['Dove parcheggiare a Milazzo?', 'Chi soggiorna all\'Attico Panoramico ha un garage privato incluso, senza costi aggiuntivi, con accesso tramite telecomando.']
    ]
  },
  en: {
    slug: 'en/guide/how-to-get-to-milazzo/',
    breve: 'How to get to Milazzo',
    title: 'How to get to Milazzo from Catania, Palermo and Messina',
    desc: 'How to get to Milazzo, Sicily: 1h40 by car from Catania airport, 2h15 from Palermo, 35 minutes from Messina, or by train on the Messina–Palermo line.',
    eyebrow: 'Guide · Travel',
    h1: 'How to get to Milazzo',
    lead: 'By plane, car or train: travel times, roads and what to know once you reach the historic centre.',
    alt: 'The living room with dining area of the Attico Panoramico holiday apartment in the historic centre of Milazzo',
    corpo: `
<h2>By plane</h2>
<p>The two reference airports are:</p>
<ul>
  <li><strong>Catania Fontanarossa (CTA)</strong>: about 1 hour 40 minutes by car, via the A18 and A20 motorways.</li>
  <li><strong>Palermo Falcone-Borsellino (PMO)</strong>: about 2 hours 15 minutes by car, via the A20 motorway.</li>
</ul>

<h2>By car</h2>
<p>Milazzo is reached via the A20 motorway. From <strong>Messina</strong> it takes about 35 minutes.</p>

<h2>By train</h2>
<p>Milazzo has a railway station on the <strong>Messina–Palermo</strong> line.</p>

<h2>Once you arrive: parking and distances</h2>
<p>Guests of the Attico Panoramico, at Via Cristoforo Colombo 7 in the historic centre, have a <strong>private garage included</strong> with remote-controlled access, and a lift in the building. There is an electric-vehicle charging station 200 metres away.</p>
<p>On foot from the apartment:</p>
<ul>
  <li>Conad supermarket: 300 metres</li>
  <li>Ponente Beach: 5 minutes</li>
  <li>24/7 medical service (Guardia Medica): 5 minutes</li>
  <li>Castle and Citadel: 10 minutes</li>
  <li>Port for the Aeolian Islands: 15 minutes</li>
</ul>
<p>To arrange your arrival, contact us directly by phone or WhatsApp on <a href="tel:+393880775449">+39 388 077 5449</a>. And once you are here: <a href="{{LINK:cosa}}">things to do in Milazzo</a> and <a href="{{LINK:eolie}}">the Aeolian Islands from Milazzo</a>.</p>`,
    faq: [
      ['How far is Milazzo from Catania and Palermo airports?', 'By car, about 1 hour 40 minutes from Catania Fontanarossa (CTA) and about 2 hours 15 minutes from Palermo (PMO).'],
      ['Can you get to Milazzo by train?', 'Yes, Milazzo has a railway station on the Messina–Palermo line.'],
      ['Where can I park in Milazzo?', 'Guests of the Attico Panoramico have a private garage included at no extra cost, with remote-controlled access.']
    ]
  },
  de: {
    slug: 'de/reisefuehrer/anreise-nach-milazzo/',
    breve: 'Anreise nach Milazzo',
    title: 'Anreise nach Milazzo ab Catania, Palermo und Messina',
    desc: 'Anreise nach Milazzo, Sizilien: mit dem Auto 1 Std. 40 Min. ab Flughafen Catania, 2 Std. 15 Min. ab Palermo, 35 Min. ab Messina, oder mit der Bahn.',
    eyebrow: 'Reiseführer · Anreise',
    h1: 'Anreise nach Milazzo',
    lead: 'Mit dem Flugzeug, dem Auto oder der Bahn: Fahrzeiten, Strecken und was Sie bei der Ankunft in der Altstadt wissen sollten.',
    alt: 'Das Wohnzimmer mit Essbereich der Ferienwohnung Attico Panoramico in der Altstadt von Milazzo',
    corpo: `
<h2>Mit dem Flugzeug</h2>
<p>Als Flughäfen bieten sich an:</p>
<ul>
  <li><strong>Catania Fontanarossa (CTA)</strong>: etwa 1 Std. 40 Min. mit dem Auto über die Autobahnen A18 und A20.</li>
  <li><strong>Palermo Falcone-Borsellino (PMO)</strong>: etwa 2 Std. 15 Min. mit dem Auto über die Autobahn A20.</li>
</ul>

<h2>Mit dem Auto</h2>
<p>Milazzo erreichen Sie über die Autobahn A20. Ab <strong>Messina</strong> dauert die Fahrt etwa 35 Minuten.</p>

<h2>Mit der Bahn</h2>
<p>Milazzo hat einen Bahnhof an der Strecke <strong>Messina–Palermo</strong>.</p>

<h2>Nach der Ankunft: Parken und Entfernungen</h2>
<p>Gäste des Attico Panoramico in der Via Cristoforo Colombo 7 in der Altstadt haben eine <strong>Privatgarage inklusive</strong> mit Fernbedienung sowie einen Aufzug im Haus. 200 Meter entfernt gibt es eine Ladestation für Elektroautos.</p>
<p>Zu Fuß ab der Wohnung:</p>
<ul>
  <li>Supermarkt Conad: 300 Meter</li>
  <li>Ponente-Strand: 5 Minuten</li>
  <li>Ärztlicher Bereitschaftsdienst (Guardia Medica, rund um die Uhr): 5 Minuten</li>
  <li>Burg und Zitadelle: 10 Minuten</li>
  <li>Hafen zu den Äolischen Inseln: 15 Minuten</li>
</ul>
<p>Ihre Ankunft vereinbaren Sie direkt mit uns per Telefon oder WhatsApp unter <a href="tel:+393880775449">+39 388 077 5449</a>. Und vor Ort: <a href="{{LINK:cosa}}">Sehenswürdigkeiten in Milazzo</a> und <a href="{{LINK:eolie}}">die Äolischen Inseln ab Milazzo</a>.</p>`,
    faq: [
      ['Wie weit ist Milazzo von den Flughäfen Catania und Palermo entfernt?', 'Mit dem Auto etwa 1 Std. 40 Min. ab Catania Fontanarossa (CTA) und etwa 2 Std. 15 Min. ab Palermo (PMO).'],
      ['Kann man mit der Bahn nach Milazzo fahren?', 'Ja, Milazzo hat einen Bahnhof an der Strecke Messina–Palermo.'],
      ['Wo parkt man in Milazzo?', 'Gäste des Attico Panoramico haben eine Privatgarage ohne Aufpreis inklusive, mit Fernbedienung.']
    ]
  },
  fr: {
    slug: 'fr/guide/comment-venir-a-milazzo/',
    breve: 'Comment venir à Milazzo',
    title: 'Comment venir à Milazzo depuis Catane, Palerme et Messine',
    desc: 'Comment venir à Milazzo, en Sicile : 1 h 40 en voiture depuis l\'aéroport de Catane, 2 h 15 depuis Palerme, 35 minutes depuis Messine, ou en train.',
    eyebrow: 'Guide · Voyage',
    h1: 'Comment venir à Milazzo',
    lead: 'En avion, en voiture ou en train : temps de trajet, routes et ce qu\'il faut savoir une fois arrivé dans le centre historique.',
    alt: 'Le séjour avec coin repas de l\'appartement de vacances Attico Panoramico dans le centre historique de Milazzo',
    corpo: `
<h2>En avion</h2>
<p>Les deux aéroports de référence sont :</p>
<ul>
  <li><strong>Catane Fontanarossa (CTA)</strong> : environ 1 h 40 en voiture, par les autoroutes A18 et A20.</li>
  <li><strong>Palerme Falcone-Borsellino (PMO)</strong> : environ 2 h 15 en voiture, par l'autoroute A20.</li>
</ul>

<h2>En voiture</h2>
<p>On rejoint Milazzo par l'autoroute A20. Depuis <strong>Messine</strong>, il faut environ 35 minutes.</p>

<h2>En train</h2>
<p>Milazzo possède une gare sur la ligne <strong>Messine–Palerme</strong>.</p>

<h2>À l'arrivée : parking et distances</h2>
<p>Les hôtes de l'Attico Panoramico, Via Cristoforo Colombo 7 dans le centre historique, disposent d'un <strong>garage privé inclus</strong> avec accès par télécommande, et d'un ascenseur dans l'immeuble. Une borne de recharge pour voitures électriques se trouve à 200 mètres.</p>
<p>À pied depuis l'appartement :</p>
<ul>
  <li>Supermarché Conad : 300 mètres</li>
  <li>Plage de Ponente : 5 minutes</li>
  <li>Garde médicale 24h/24 : 5 minutes</li>
  <li>Château et citadelle : 10 minutes</li>
  <li>Port pour les îles Éoliennes : 15 minutes</li>
</ul>
<p>Pour organiser votre arrivée, contactez-nous directement par téléphone ou WhatsApp au <a href="tel:+393880775449">+39 388 077 5449</a>. Et une fois sur place : <a href="{{LINK:cosa}}">que voir à Milazzo</a> et <a href="{{LINK:eolie}}">les îles Éoliennes depuis Milazzo</a>.</p>`,
    faq: [
      ['À quelle distance Milazzo se trouve-t-elle des aéroports de Catane et de Palerme ?', 'En voiture, environ 1 h 40 depuis Catane Fontanarossa (CTA) et environ 2 h 15 depuis Palerme (PMO).'],
      ['Peut-on venir à Milazzo en train ?', 'Oui, Milazzo possède une gare sur la ligne Messine–Palerme.'],
      ['Où se garer à Milazzo ?', 'Les hôtes de l\'Attico Panoramico disposent d\'un garage privé inclus sans supplément, avec accès par télécommande.']
    ]
  }
}
];

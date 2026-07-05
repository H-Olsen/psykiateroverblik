const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteUrl = "https://h-olsen.github.io/psykiateroverblik";
const supportUrl = "https://buymeacoffee.com/psykiateroverblik";

const problemPages = [
  ["akut-krise", "Akut krise"],
  ["generelt-menneskeligt-sjaeleligt", "Generelt / menneskeligt / sjæleligt"],
  ["ensomhed", "Ensomhed"],
  ["vaeresteder-og-faellesskaber", "Væresteder og fællesskaber"],
  ["boern-og-unge", "Børn og unge"],
  ["studerende", "Studerende"],
  ["foraeldre-familie", "Forældre / familie"],
  ["arbejdsliv", "Arbejdsliv"],
  ["aeldre", "Ældre"],
  ["lgbt-koen-seksualitet", "LGBT+ / køn / seksualitet"],
  ["paaroerende-til-psykisk-syge", "Pårørende til psykisk syge"],
  ["vold-chikane-stalking-psykisk-vold", "Vold / chikane / stalking / psykisk vold"],
  ["maends-mentale-sundhed", "Mænds mentale sundhed"],
  ["misbrug", "Misbrug"],
  ["selvskade", "Selvskade"],
  ["patientstoette-og-rettigheder", "Patientstøtte og rettigheder"],
  ["foreninger-for-psykiske-sygdomme", "Foreninger for psykiske sygdomme"]
];

const regionPages = [
  ["region-hovedstaden", "Region Hovedstaden", "data/region-hovedstaden.json"],
  ["region-sjaelland", "Region Sjælland", "data/region-sjaelland.json"],
  ["region-syddanmark", "Region Syddanmark", "data/region-syddanmark.json"],
  ["region-midtjylland", "Region Midtjylland", "data/region-midtjylland.json"],
  ["region-nordjylland", "Region Nordjylland", "data/region-nordjylland.json"]
];

const kommunePages = [
  ["koebenhavn", "København"],
  ["frederiksberg", "Frederiksberg"],
  ["aarhus", "Aarhus"],
  ["odense", "Odense"],
  ["aalborg", "Aalborg"],
  ["anden-kommune", "Bor du i en anden kommune?"]
];

const informationPages = [
  ["offentlig-psykiater-ydernummer", "Offentlig psykiater/ydernummer"],
  ["behandlingsgaranti", "Behandlingsgaranti"],
  ["egen-laege-vs-praktiserende-psykiater", "Egen læge vs. praktiserende psykiater"],
  ["patientrettigheder", "Patientrettigheder"],
  ["de-store-hjaelpere", "De store hjælpere"],
  ["psykiatrifonden", "Psykiatrifonden"],
  ["livslinien", "Livslinien"]
];

const pageRoutes = [];

function depth(route) {
  return route ? route.split("/").length : 0;
}

function prefix(route) {
  return "../".repeat(depth(route));
}

function routeHref(fromRoute, toRoute) {
  return `${prefix(fromRoute)}${toRoute ? `${toRoute}/` : ""}`;
}

function assetHref(fromRoute, assetPath) {
  return `${prefix(fromRoute)}${assetPath}`;
}

function externalLink(url, label) {
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function link(fromRoute, toRoute, label, className = "") {
  const classAttr = className ? ` class="${className}"` : "";
  return `<a${classAttr} href="${routeHref(fromRoute, toRoute)}">${label}</a>`;
}

function card(fromRoute, title, text, toRoute, label = "Læs mere") {
  return `
    <article class="overview-card">
      <h2>${title}</h2>
      <p>${text}</p>
      ${link(fromRoute, toRoute, label)}
    </article>`;
}

function placeholder(title, text = "Denne side er under opbygning.") {
  return `<div class="placeholder-note"><p>${text}</p></div>`;
}

function nav(fromRoute) {
  return `
        <nav class="primary-nav" id="primary-navigation" aria-label="Primær navigation">
          <div class="nav-group">
            <a class="nav-parent" data-nav="forside" href="${routeHref(fromRoute, "")}">Forside</a>
          </div>
          <div class="nav-group">
            <a class="nav-parent" data-nav="find" href="${routeHref(fromRoute, "find-psykiater")}">Find psykiater</a>
            <div class="nav-dropdown">
              <a href="${routeHref(fromRoute, "voksen")}">Voksen</a>
              <a href="${routeHref(fromRoute, "voksen/offentlige-psykiatere")}">Offentlige psykiatere</a>
              <a href="${routeHref(fromRoute, "voksen/private-psykiatere")}">Private psykiatere</a>
              <a href="${routeHref(fromRoute, "boern-og-unge")}">Børn og unge</a>
              <a href="${routeHref(fromRoute, "boern-og-unge/offentlige-boerne-og-ungdomspsykiatere")}">Offentlige børne- og ungdomspsykiatere</a>
              <a href="${routeHref(fromRoute, "boern-og-unge/private-boerne-og-ungdomspsykiatere")}">Private børne- og ungdomspsykiatere</a>
            </div>
          </div>
          <div class="nav-group">
            <a class="nav-parent" data-nav="ressourcer" href="${routeHref(fromRoute, "ressourcer")}">Ressourcer</a>
            <div class="nav-dropdown">
              <a href="${routeHref(fromRoute, "ressourcer/regioner")}">Regioner</a>
              <a href="${routeHref(fromRoute, "ressourcer/kommuner")}">Kommuner</a>
              <a href="${routeHref(fromRoute, "ressourcer/andre-tilbudsydere")}">Andre tilbudsydere</a>
              <a href="${routeHref(fromRoute, "ressourcer/problemstillinger")}">Problemstillinger</a>
            </div>
          </div>
          <div class="nav-group">
            <a class="nav-parent" data-nav="information" href="${routeHref(fromRoute, "information")}">Information</a>
            <div class="nav-dropdown">
              <a href="${routeHref(fromRoute, "information/offentlig-psykiater-ydernummer")}">Offentlig psykiater/ydernummer</a>
              <a href="${routeHref(fromRoute, "information/behandlingsgaranti")}">Behandlingsgaranti</a>
              <a href="${routeHref(fromRoute, "information/patientrettigheder")}">Patientrettigheder</a>
              <a href="${routeHref(fromRoute, "information/de-store-hjaelpere")}">De store hjælpere</a>
            </div>
          </div>
          <div class="nav-group">
            <a class="nav-parent" data-nav="om" href="${routeHref(fromRoute, "om")}">Om</a>
            <div class="nav-dropdown">
              <a href="${routeHref(fromRoute, "om/motivation")}">Motivation</a>
              <a href="${routeHref(fromRoute, "om/disclaimer")}">Disclaimer</a>
              <a href="${routeHref(fromRoute, "om/kontakt")}">Kontakt</a>
              <a href="${routeHref(fromRoute, "om/privatlivspolitik")}">Privatlivspolitik</a>
              <a href="${routeHref(fromRoute, "om/stoet-siden")}">Støt siden</a>
            </div>
          </div>
          <div class="nav-group">
            <a class="nav-parent" data-nav="krise" href="${routeHref(fromRoute, "brug-for-hjaelp-nu")}">Brug for hjælp NU</a>
          </div>
        </nav>`;
}

function layout(page) {
  const fromRoute = page.route || "";
  const canonical = `${siteUrl}${fromRoute ? `/${fromRoute}/` : "/"}`;
  pageRoutes.push(fromRoute);

  return `<!doctype html>
<html lang="da">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${page.title} | Psykiater Overblik</title>
    <meta name="description" content="${page.description}">
    <meta property="og:title" content="${page.title} | Psykiater Overblik">
    <meta property="og:description" content="${page.description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${siteUrl}/assets/hero-psykiater-overblik.jpg">
    <link rel="canonical" href="${canonical}">
    <link rel="icon" href="data:,">
    <link rel="stylesheet" href="${assetHref(fromRoute, "css/style.css")}">
    <!-- Google AdSense placeholder:
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
    -->
    <script src="${assetHref(fromRoute, "js/app.js")}" defer></script>
  </head>
  <body>
    <a class="skip-link" href="#indhold">Spring til indhold</a>
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="${routeHref(fromRoute, "")}" aria-label="Psykiater Overblik forside">
          <span class="brand-mark" aria-hidden="true">PO</span>
          <span>Psykiater Overblik</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">
          <span class="nav-toggle-line"></span>
          <span class="visually-hidden">Åbn menu</span>
        </button>
${nav(fromRoute)}
      </div>
    </header>

${page.body}

    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <strong>Psykiater Overblik</strong>
          <p>Uafhængigt overblik over psykiatrisk hjælp, klinikker og ressourcer i Danmark.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="${routeHref(fromRoute, "om")}">Om</a>
          <a href="${routeHref(fromRoute, "om/kontakt")}">Kontakt</a>
          <a href="${routeHref(fromRoute, "om/disclaimer")}">Disclaimer</a>
          <a href="${routeHref(fromRoute, "om/privatlivspolitik")}">Privatlivspolitik</a>
          <a href="${routeHref(fromRoute, "brug-for-hjaelp-nu")}">Brug for hjælp NU</a>
          <a href="${supportUrl}" target="_blank" rel="noopener noreferrer">Støt siden</a>
        </nav>
      </div>
    </footer>
  </body>
</html>
`;
}

function pageHero(page, content) {
  return `
    <main id="indhold" class="page-main">
      <article class="content-article">
        <header class="page-hero">
          <div class="container narrow">
            <p class="eyebrow">${page.eyebrow}</p>
            <h1>${page.heading}</h1>
            <p>${page.intro}</p>
          </div>
        </header>
        <div class="container prose">
${content}
        </div>
      </article>
    </main>`;
}

function writePage(route, html) {
  const targetDir = route ? path.join(root, route) : root;
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, "index.html"), html);
}

function writeSimplePage(route, title, intro, content, eyebrow = title, description = intro) {
  writePage(route, layout({
    route,
    title,
    description,
    body: pageHero({ eyebrow, heading: title, intro }, content)
  }));
}

function cardGrid(fromRoute, items, wide = false) {
  return `<div class="overview-grid${wide ? " two-column" : ""}">
${items.map((item) => card(fromRoute, item[0], item[1], item[2], item[3] || "Åbn")).join("\n")}
</div>`;
}

function landingPage() {
  const route = "";
  const body = `
    <main id="indhold">
      <section class="hero">
        <div class="container hero-content">
          <p class="eyebrow">Komplet overblik</p>
          <h1>Find vej i psykiatrisk hjælp</h1>
          <p class="hero-copy">Find psykiater, akut hjælp, nyttige ressourcer og forklaringer om henvisning, ydernummer, rettigheder og ventetid.</p>
          <div class="hero-actions" aria-label="Vigtige indgange">
            ${link(route, "find-psykiater", "Find psykiater", "button button-primary")}
            ${link(route, "brug-for-hjaelp-nu", "Brug for hjælp NU", "button button-urgent")}
            ${link(route, "ressourcer", "Nyttige ressourcer", "button button-secondary")}
            ${link(route, "information", "Information", "button button-secondary")}
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Forside</p>
            <h2>Vælg den vej, der passer til din situation</h2>
            <p>Siden er bygget som et roligt overblik over offentlige og private indgange, akut hjælp, ressourcer og forklarende information.</p>
          </div>
          ${cardGrid(route, [
            ["Find psykiater", "Vælg voksen, børn og unge, offentlig eller privat psykiater.", "find-psykiater"],
            ["Brug for hjælp NU", "Akut side med 112, lægevagt, skadestue og telefonrådgivninger.", "brug-for-hjaelp-nu"],
            ["Nyttige ressourcer", "Find regionale, kommunale og tematiske ressourcer.", "ressourcer"],
            ["Information", "Læs om ydernummer, behandlingsgaranti, rettigheder og centrale hjælpere.", "information"]
          ])}
        </div>
      </section>
      <section class="section section-muted">
        <div class="container split-layout">
          <div>
            <h2>Et uafhængigt informationssite</h2>
            <p>Psykiater Overblik hjælper med struktur og overblik, men oplysninger kan ændre sig. Tjek altid klinikkers, regioners, kommuners og organisationers egne kilder.</p>
          </div>
          <aside class="disclaimer" aria-label="Vigtig information">
            <strong>Vigtig information</strong>
            <p>Siden erstatter ikke lægefaglig rådgivning. Ved akut fare for liv eller sikkerhed skal du ringe 112.</p>
          </aside>
        </div>
      </section>
    </main>`;

  writePage(route, layout({
    route,
    title: "Komplet overblik",
    description: "Find psykiater, akut hjælp, nyttige ressourcer og information om psykiatrisk hjælp i Danmark.",
    body
  }));
}

function privatePsychiatristsPage() {
  const route = "voksen/private-psykiatere";
  const content = `
          <div class="sortable-table-intro">
            <p>Private psykiatere kan have forskellige betalingsformer. Nogle arbejder via forsikringsselskabers interne behandlingsnetværk, andre tager imod selvbetalere. Tjek altid pris, ventetid og henvisningskrav direkte hos klinikken.</p>
            <p>Tabellen indlæses fra CSV-filen <strong>Tabel - Private Psykiatere - Sheet1.csv</strong>. Klik på en kolonneoverskrift for at sortere tabellen.</p>
          </div>
          <div class="page-actions">
            ${link(route, "ressourcer", "Se også ressourcer, du kan bruge i ventetiden", "button button-secondary")}
          </div>
          <div class="result-bar" aria-live="polite">
            <p id="private-result-count">Indlæser private psykiatere...</p>
          </div>
          <div class="table-wrap sortable-table-wrap" aria-label="Private psykiatere vist som sorterbar tabel">
            <table class="clinic-table sortable-table" id="private-psychiatrists-table" data-source="${assetHref(route, "Tabel - Private Psykiatere - Sheet1.csv")}">
              <caption class="visually-hidden">Private psykiatere i Danmark</caption>
              <thead>
                <tr>
                  <th><button type="button" data-sort-key="name" data-sort-type="text">Klinik/navn <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-sort-key="doctors" data-sort-type="text">Tilknyttede læger <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-sort-key="region" data-sort-type="text">Region <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-sort-key="city" data-sort-type="text">By <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-sort-key="postalCode" data-sort-type="number">Postnummer <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-sort-key="address" data-sort-type="text">Adresse <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-sort-key="phone" data-sort-type="text">Telefon <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-sort-key="email" data-sort-type="text">Email <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-sort-key="website" data-sort-type="text">Hjemmeside <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-sort-key="priceLink" data-sort-type="text">Priser <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-sort-key="acceptsSelfPayers" data-sort-type="status">Selvbetaler accepteres <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-sort-key="onlineNational" data-sort-type="status">Online/nationalt optag <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-sort-key="notes" data-sort-type="text">Noter <span class="sort-indicator" aria-hidden="true"></span></button></th>
                </tr>
              </thead>
              <tbody id="private-psychiatrists-body"></tbody>
            </table>
          </div>
          <p class="small-note">Oplysninger kan være ufuldstændige eller ændre sig. Kontakt klinikken direkte, før du booker eller træffer beslutninger.</p>`;

  writeSimplePage(
    route,
    "Private psykiatere",
    "Sorter en tabel over private psykiatere i Danmark. Klik på kolonneoverskrifterne for at sortere stigende eller faldende.",
    content,
    "Voksen",
    "Sorter private psykiatere efter klinik, region, by, postnummer, kontakt, priser, selvbetaler og online optag."
  );
}

function regionResourcePage(slug, regionName, dataFile) {
  const route = `ressourcer/regioner/${slug}`;
  const content = `
          <a class="back-link" href="${routeHref(route, "ressourcer/regioner")}">Tilbage til Regionernes tilbud</a>
          <aside class="crisis-box region-crisis-box">
            <strong>Akut hjælp</strong>
            <p>Ved akut livsfare eller akut fare for dig selv eller andre: Ring 112.</p>
            <p>Hvis du er i akut psykisk krise, skal du kontakte den relevante akutte indgang i din region. Tjek altid den officielle kilde, da adgang og åbningstider kan ændre sig.</p>
          </aside>
          <div class="region-resource-controls">
            <div class="field">
              <label for="region-resource-search">Søg i tilbud</label>
              <input id="region-resource-search" type="search" placeholder="Søg efter tilbud, adgang, note...">
            </div>
            <div class="field">
              <label for="region-problem-filter">Problemstilling</label>
              <select id="region-problem-filter"></select>
            </div>
          </div>
          <div class="result-bar" aria-live="polite">
            <p id="region-result-count">Indlæser tilbud...</p>
          </div>
          <div class="table-wrap" aria-label="Regionale tilbud vist som tabel">
            <table class="clinic-table sortable-table resource-table" id="region-resource-table" data-source="${assetHref(route, dataFile)}" data-region="${regionName}">
              <caption class="visually-hidden">Psykisk hjælp i ${regionName}</caption>
              <thead>
                <tr>
                  <th><button type="button" data-region-sort-key="problemstilling" data-sort-type="text">Problemstilling <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-region-sort-key="tilbud" data-sort-type="text">Tilbud <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-region-sort-key="adgang" data-sort-type="text">Telefon / adgang <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-region-sort-key="krav" data-sort-type="text">Krav / afgrænsning <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-region-sort-key="kilde" data-sort-type="text">Kilde <span class="sort-indicator" aria-hidden="true"></span></button></th>
                  <th><button type="button" data-region-sort-key="note" data-sort-type="text">Note <span class="sort-indicator" aria-hidden="true"></span></button></th>
                </tr>
              </thead>
              <tbody id="region-resource-body"></tbody>
            </table>
          </div>
          <aside class="disclaimer spaced">
            <strong>Disclaimer</strong>
            <p>Oplysninger kan ændre sig. Tjek altid den officielle kilde, især åbningstider, telefonnumre og adgangskrav. Siden er et uafhængigt informationssite og erstatter ikke akut hjælp, læge eller professionel rådgivning.</p>
          </aside>`;

  writeSimplePage(
    route,
    `Psykisk hjælp i ${regionName}`,
    "Her finder du regionale akuttilbud, rådgivninger og åbne hjælpetilbud til psykisk mistrivsel, krise, pårørende og psykiatrisk hjælp.",
    content,
    "Regionernes tilbud",
    `Find regionale akuttilbud, rådgivninger og åbne hjælpetilbud til psykisk mistrivsel og psykiatrisk hjælp i ${regionName}.`
  );
}

function buildPages() {
  landingPage();

  writeSimplePage("find-psykiater", "Find psykiater", "Vælg den indgang, der passer bedst: voksen, børn og unge, offentlig eller privat.", cardGrid("find-psykiater", [
    ["Voksen", "Oversigt over voksenpsykiatri med offentlige og private indgange.", "voksen"],
    ["Børn og unge", "Oversigt over børne- og ungdomspsykiatri.", "boern-og-unge"],
    ["Offentlig psykiater", "Vej til offentlige psykiatere med ydernummer via sundhed.dk.", "voksen/offentlige-psykiatere"],
    ["Privat psykiater", "Sorterbar tabel over private psykiatere.", "voksen/private-psykiatere"]
  ], true), "Find psykiater");

  writeSimplePage("voksen", "Voksen", "Oversigtsside for voksenpsykiatri.", cardGrid("voksen", [
    ["Offentlige psykiatere", "Find vej til offentlige psykiatere med ydernummer.", "voksen/offentlige-psykiatere"],
    ["Private psykiatere", "Se den sorterbare tabel over private psykiatere.", "voksen/private-psykiatere"]
  ], true), "Voksenpsykiatri");

  writeSimplePage("voksen/offentlige-psykiatere", "Offentlige psykiatere", "Offentlige psykiatere med ydernummer findes via sundhed.dk.", `
          <div class="resource-grid">
            <article class="resource-card">
              <h2>Find behandler på sundhed.dk</h2>
              <p>Gå til sundhed.dk’s egen oversigt over Danmarks speciallæger, der tilhører det offentlige. Under ‘behandlere’ kan du vælge ‘psykiater’ og sortere efter bl.a. afstand, ventetid og om klinikken har åbent for nye patienter.</p>
              ${externalLink("https://www.sundhed.dk/borger/guides/find-behandler/", "Åbn find behandler på sundhed.dk")}
            </article>
            <article class="resource-card">
              <h2>Flow</h2>
              <ul class="link-list">
                <li>Henvisning sker ofte fra fx egen læge.</li>
                <li>Offentlig psykiater betyder typisk psykiater med ydernummer.</li>
                <li>Ventetider kan variere.</li>
              </ul>
            </article>
          </div>
          <div class="page-actions">${link("voksen/offentlige-psykiatere", "ressourcer", "Se også ressourcer, du kan bruge i ventetiden", "button button-secondary")}</div>
          <aside class="disclaimer"><strong>Vigtig information</strong><p>Tjek altid sundhed.dk, egen læge eller den relevante klinik for aktuelle oplysninger.</p></aside>`, "Voksen");

  privatePsychiatristsPage();

  writeSimplePage("boern-og-unge", "Børn og unge", "Oversigtsside for børne- og ungdomspsykiatri.", cardGrid("boern-og-unge", [
    ["Nyttig info til forældre", "Samlet side til information, når den er klar.", "boern-og-unge/nyttig-info-til-foraeldre"],
    ["Offentlige børne- og ungdomspsykiatere", "Find vej via sundhed.dk og speciallæger med ydernummer.", "boern-og-unge/offentlige-boerne-og-ungdomspsykiatere"],
    ["Private børne- og ungdomspsykiatere", "Placeholder til kommende tabel.", "boern-og-unge/private-boerne-og-ungdomspsykiatere"]
  ], true), "Børne- og ungdomspsykiatri");

  writeSimplePage("boern-og-unge/nyttig-info-til-foraeldre", "Nyttig info til forældre", "Denne side samler senere relevant information til forældre.", placeholder("Nyttig info til forældre"), "Børn og unge");

  writeSimplePage("boern-og-unge/offentlige-boerne-og-ungdomspsykiatere", "Find Børne- og ungdomspsykiater", "Offentlige børne- og ungdomspsykiatere findes via sundhed.dk.", `
          <div class="resource-grid">
            <article class="resource-card">
              <h2>Find behandler på sundhed.dk</h2>
              <p>Under ‘behandlere’ kan du vælge ‘Børne- og ungdomspsykiater’ og sortere efter bl.a. afstand, ventetid og åbent for nye patienter.</p>
              ${externalLink("https://www.sundhed.dk/borger/guides/find-behandler/", "Åbn find behandler på sundhed.dk")}
            </article>
            <article class="resource-card">
              <h2>Flow</h2>
              <ul class="link-list">
                <li>Henvisning sker ofte fra fx egen læge.</li>
                <li>Offentlig børne- og ungdomspsykiater betyder speciallæge med ydernummer.</li>
                <li>Ventetider kan variere.</li>
              </ul>
            </article>
          </div>
          <div class="page-actions">${link("boern-og-unge/offentlige-boerne-og-ungdomspsykiatere", "ressourcer", "Se relevante ressourcer i ventetiden", "button button-secondary")}</div>`, "Børn og unge");

  writeSimplePage("boern-og-unge/private-boerne-og-ungdomspsykiatere", "Private børne- og ungdomspsykiatere", "Tabel med private børne- og ungdomspsykiatere kommer snart.", `
          ${placeholder("Private børne- og ungdomspsykiatere", "Tabel med private børne- og ungdomspsykiatere kommer snart.")}
          <aside class="disclaimer spaced"><strong>Betaling og adgang</strong><p>Private psykiatere kan have forskellige betalingsformer. Nogle arbejder via forsikringsselskabers interne behandlingsnetværk, andre tager imod selvbetalere. Tjek altid pris, ventetid og henvisningskrav direkte hos klinikken.</p></aside>`, "Børn og unge");

  writeSimplePage("ressourcer", "Ressourcer", "Find hjælp efter bopæl, region, kommune, tilbudsyder og problemstilling.", cardGrid("ressourcer", [
    ["Hvor bor du?", "Start med regionernes og kommunernes tilbud.", "ressourcer/regioner"],
    ["Regionernes tilbud", "Oversigt over regionale tilbud og akutindgange.", "ressourcer/regioner"],
    ["Kommunernes tilbud", "Placeholder til kommunale indgange.", "ressourcer/kommuner"],
    ["Andre tilbudsydere", "Åbne tilbud fra frivillige organisationer og landsdækkende aktører.", "ressourcer/andre-tilbudsydere"],
    ["Problemstillinger", "Ressourcer grupperet efter situation og målgruppe.", "ressourcer/problemstillinger"]
  ]), "Ressourcer");

  writeSimplePage("ressourcer/regioner", "Regionernes tilbud", "Vælg region for at se regionale tilbud til psykisk og psykiatrisk hjælp.", cardGrid("ressourcer/regioner", regionPages.map(([slug, name]) => [`Psykisk hjælp i ${name}`, "Regionale akuttilbud, rådgivninger og åbne hjælpetilbud.", `ressourcer/regioner/${slug}`, `Åbn ${name}`])), "Ressourcer");
  regionPages.forEach(([slug, name, dataFile]) => regionResourcePage(slug, name, dataFile));

  writeSimplePage("ressourcer/kommuner", "Kommunernes tilbud", "Kommunale tilbud kan handle om social støtte, rådgivning, væresteder og lokale indsatser.", cardGrid("ressourcer/kommuner", kommunePages.map(([slug, name]) => [name, "Denne kommuneside er under opbygning.", `ressourcer/kommuner/${slug}`])), "Ressourcer");
  kommunePages.forEach(([slug, name]) => writeSimplePage(`ressourcer/kommuner/${slug}`, name, "Kommuneside under opbygning.", placeholder(name), "Kommunernes tilbud"));

  writeSimplePage("ressourcer/andre-tilbudsydere", "Andre tilbudsydere", "Her samles åbne tilbud fra frivillige organisationer og andre landsdækkende aktører.", placeholder("Andre tilbudsydere", "Her samles åbne tilbud fra frivillige organisationer og andre landsdækkende aktører."), "Ressourcer");

  writeSimplePage("ressourcer/problemstillinger", "Problemstillinger", "Find kommende ressourcesider efter situation og målgruppe.", cardGrid("ressourcer/problemstillinger", problemPages.map(([slug, title]) => [title, "Denne side er under opbygning.", `ressourcer/problemstillinger/${slug}`])), "Ressourcer");
  problemPages.forEach(([slug, title]) => writeSimplePage(`ressourcer/problemstillinger/${slug}`, title, "Denne side er under opbygning.", placeholder(title), "Problemstillinger"));

  writeSimplePage("information", "Information", "Forklarende sider om systemet omkring psykiatri, rettigheder og centrale hjælpere.", cardGrid("information", informationPages.map(([slug, title]) => [title, "Denne informationsside er under opbygning.", `information/${slug}`])), "Information");
  informationPages.forEach(([slug, title]) => writeSimplePage(`information/${slug}`, title, "Denne side er under opbygning.", placeholder(title), "Information"));

  writeSimplePage("om", "Om", "Læs om motivation, disclaimer, kontakt og privatliv.", cardGrid("om", [
    ["Motivation", "Hvorfor siden findes.", "om/motivation"],
    ["Disclaimer", "Vigtige forbehold om information og akut hjælp.", "om/disclaimer"],
    ["Kontakt", "Kontaktinformation kommer senere.", "om/kontakt"],
    ["Privatlivspolitik", "Foreløbig privatlivstekst.", "om/privatlivspolitik"],
    ["Støt siden", "Støt arbejdet med Psykiater Overblik via Buy Me a Coffee.", "om/stoet-siden"]
  ], true), "Om");
  writeSimplePage("om/motivation", "Motivation", "Denne side er under opbygning.", placeholder("Motivation"), "Om");
  writeSimplePage("om/disclaimer", "Disclaimer", "Vigtige forbehold om Psykiater Overblik.", `
          <div class="disclaimer">
            <strong>Vigtig disclaimer</strong>
            <p>Siden er en privat informationsside. Siden erstatter ikke lægefaglig rådgivning. Ved akut fare skal man kontakte 112. Oplysninger kan ændre sig, og brugeren bør altid kontrollere information hos den relevante klinik, region, kommune eller organisation.</p>
          </div>`, "Om");
  writeSimplePage("om/kontakt", "Kontakt", "Kontaktinformation kommer senere.", placeholder("Kontakt", "Kontaktinformation kommer senere."), "Om");
  writeSimplePage("om/privatlivspolitik", "Privatlivspolitik", "Foreløbig privatlivspolitik for Psykiater Overblik.", `
          <div class="placeholder-note">
            <p>Siden indsamler ikke følsomme helbredsoplysninger via formularer. Hvis der senere tilføjes analytics, cookies eller reklamer, bør denne tekst gennemgås og opdateres, før løsningen offentliggøres bredt.</p>
          </div>`, "Om");
  writeSimplePage("om/stoet-siden", "Støt siden", "Psykiater Overblik er et uafhængigt informationssite. Du kan støtte arbejdet via Buy Me a Coffee.", `
          <div class="resource-card">
            <h2>Støt Psykiater Overblik</h2>
            <p>Hvis siden hjælper dig, kan du støtte det videre arbejde med vedligeholdelse, struktur og kvalitetssikring. Støtte er frivillig og giver ikke adgang til rådgivning eller prioriteret hjælp.</p>
            <a class="button button-primary" href="${supportUrl}" target="_blank" rel="noopener noreferrer">Støt via Buy Me a Coffee</a>
          </div>
          <aside class="disclaimer spaced">
            <strong>Vigtig information</strong>
            <p>Psykiater Overblik er et uafhængigt informationssite og erstatter ikke læge, akut hjælp eller professionel rådgivning.</p>
          </aside>`, "Om", "Støt Psykiater Overblik via Buy Me a Coffee.");

  writeSimplePage("brug-for-hjaelp-nu", "Brug for hjælp NU / krise", "Side til akutte situationer og hurtige indgange.", `
          <aside class="crisis-box">
            <strong>Akut fare</strong>
            <p>Ring 112 ved akut fare for liv eller sikkerhed.</p>
          </aside>
          <div class="resource-grid">
            <article class="resource-card">
              <h2>Lægevagt, 1813 eller skadestue</h2>
              <p>Kontakt lægevagt, 1813 eller skadestue afhængigt af region og situation. 1813 gælder Region Hovedstaden; andre regioner har egne lægevagtsordninger.</p>
            </article>
            <article class="resource-card">
              <h2>Telefonrådgivninger</h2>
              <p>Telefonrådgivninger kan bruges ved psykisk krise eller behov for nogen at tale med.</p>
            </article>
          </div>
          <div class="page-actions">
            ${link("brug-for-hjaelp-nu", "ressourcer/problemstillinger/akut-krise", "Gå til akut krise", "button button-primary")}
            ${link("brug-for-hjaelp-nu", "ressourcer", "Se ressourcesider", "button button-secondary")}
          </div>`, "Krisehjælp", "Akut side med 112, lægevagt, skadestue og telefonrådgivninger ved psykisk krise.");

  fs.writeFileSync(path.join(root, "404.html"), layout({
    route: "",
    title: "Siden blev ikke fundet",
    description: "Siden blev ikke fundet.",
    body: pageHero({
      eyebrow: "404",
      heading: "Siden blev ikke fundet",
      intro: "Linket findes ikke eller er blevet flyttet."
    }, `<div class="page-actions">${link("", "", "Gå til forsiden", "button button-primary")}</div>`)
  }));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageRoutes.map((route) => `  <url><loc>${siteUrl}${route ? `/${route}/` : "/"}</loc></url>`).join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);
}

buildPages();

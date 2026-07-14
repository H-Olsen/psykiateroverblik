const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteUrl = "https://h-olsen.github.io/psykiateroverblik";
const supportUrl = "https://buymeacoffee.com/psykiateroverblik";

const legacyFiles = [
  "adhd.html",
  "autisme.html",
  "boern-unge-psykiatere.html",
  "information.html",
  "klinikker.html",
  "kontakt.html",
  "krisehjaelp.html",
  "nyttige-links.html",
  "offentlige-klinikker.html",
  "offentlige-psykiatere-info.html",
  "om-os.html",
  "om-psykiatere.html",
  "private-psykiatere-info.html",
  "privatlivspolitik.html",
  "problemstillinger.html",
  "ressourcer-region-hovedstaden.html",
  "ressourcer-region-midtjylland.html",
  "ressourcer-region-nordjylland.html",
  "ressourcer-region-sjaelland.html",
  "ressourcer-region-syddanmark.html",
  "voksen.html"
];

const generatedDirs = [
  "boern-og-unge",
  "brug-for-hjaelp-nu",
  "brug-for-hjaelp-nu-i-krise",
  "find-psykiater",
  "information",
  "nyttige-links-og-tilbud",
  "om",
  "ressourcer",
  "voksen"
];

const regionPages = [
  ["region-hovedstaden", "Region Hovedstaden", "data/region-hovedstaden.json"],
  ["region-sjaelland", "Region Sjælland", "data/region-sjaelland.json"],
  ["region-syddanmark", "Region Syddanmark", "data/region-syddanmark.json"],
  ["region-midtjylland", "Region Midtjylland", "data/region-midtjylland.json"],
  ["region-nordjylland", "Region Nordjylland", "data/region-nordjylland.json"]
];

const situationPages = [
  ["akut-krise", "Akut krise", "Linket fører til siden Akut krise."],
  ["generelt-menneskeligt-sjaeleligt", "Generelt / menneskeligt / sjæleligt", "Plads til tre kontrollerede eksempler og neutrale links."],
  ["ensomhed", "Ensomhed", "Plads til Socialkompas-link og tre kontrollerede eksempler."],
  ["vaeresteder-og-faellesskaber", "Væresteder og fællesskaber", "Plads til Socialkompas-link og tre kontrollerede eksempler."],
  ["boern-unge-og-familie", "Børn, unge og familie", "Plads til links fra kombu.dk, Socialkompas og tre eksempler."],
  ["studerende", "Studerende", "Husk fx SU-kontoret, studievejledning, studenterrådgivning og universitetspræst."],
  ["aeldre", "Ældre", "Plads til Socialkompas, Ældre Sagen og to kontrollerede tilbud."],
  ["paaroerende-til-psykisk-syge", "Pårørende til psykisk syge", "Plads til fx Bedre Psykiatri og regionale pårørendetilbud."],
  ["maends-mentale-sundhed", "Mænds mentale sundhed", "Plads til Socialkompas-søgning og tre kontrollerede eksempler."],
  ["i-sorg", "I sorg", "Plads til Socialkompas-søgning, Sorgcentret og tre kontrollerede eksempler."],
  ["patientstoette-og-rettigheder", "Patientstøtte og rettigheder", "Husk regionens patienttelefon og officielle rettighedskilder."]
];

const informationPages = [
  ["offentlig-psykiater-ydernummer", "Offentlig psykiater/ydernummer"],
  ["behandlingsgaranti", "Behandlingsgaranti"],
  ["egen-laege-vs-praktiserende-psykiater", "Egen læge vs. praktiserende psykiater"],
  ["patientrettigheder", "Patientrettigheder"]
];

const pageRoutes = [];

function cleanupOldStructure() {
  legacyFiles.forEach((file) => {
    fs.rmSync(path.join(root, file), { force: true });
  });

  generatedDirs.forEach((dir) => {
    fs.rmSync(path.join(root, dir), { recursive: true, force: true });
  });
}

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

function card(fromRoute, title, text, toRoute, label = "Åbn") {
  return `
    <article class="overview-card">
      <h2>${title}</h2>
      <p>${text}</p>
      ${link(fromRoute, toRoute, label)}
    </article>`;
}

function cardGrid(fromRoute, items, wide = false) {
  return `<div class="overview-grid${wide ? " two-column" : ""}">
${items.map((item) => card(fromRoute, item[0], item[1], item[2], item[3] || "Åbn")).join("\n")}
</div>`;
}

function placeholder(title, text = "Denne side er under opbygning.") {
  return `<div class="placeholder-note"><h2>${title}</h2><p>${text}</p></div>`;
}

function detailList(items) {
  return `<ul class="link-list">
${items.map((item) => `<li>${item}</li>`).join("\n")}
</ul>`;
}

function nav(fromRoute) {
  return `
        <nav class="primary-nav" id="primary-navigation" aria-label="Primær navigation">
          <div class="nav-group">
            <a class="nav-parent" data-nav="forside" href="${routeHref(fromRoute, "")}">Forside</a>
          </div>
          <div class="nav-group">
            <a class="nav-parent nav-parent-dropdown" data-nav="find" href="${routeHref(fromRoute, "find-psykiater")}">Find psykiater</a>
            <div class="nav-dropdown">
              <div class="nav-subgroup">
                <a class="nav-subparent" href="${routeHref(fromRoute, "find-psykiater/voksenpsykiater")}">Voksenpsykiater</a>
                <div class="nav-submenu">
                  <a href="${routeHref(fromRoute, "find-psykiater/voksenpsykiater/offentlige-psykiatere")}">Offentlige psykiatere</a>
                  <a href="${routeHref(fromRoute, "find-psykiater/voksenpsykiater/private-psykiatere")}">Private psykiatere</a>
                </div>
              </div>
              <div class="nav-subgroup">
                <a class="nav-subparent" href="${routeHref(fromRoute, "find-psykiater/boerne-og-ungdomspsykiater")}">Børne- og ungdomspsykiater</a>
                <div class="nav-submenu">
                  <a href="${routeHref(fromRoute, "find-psykiater/boerne-og-ungdomspsykiater/er-du-foraelder")}">Er du forælder?</a>
                  <a href="${routeHref(fromRoute, "find-psykiater/boerne-og-ungdomspsykiater/offentlige-boerne-og-ungdomspsykiatere")}">Offentlige børn/unge</a>
                  <a href="${routeHref(fromRoute, "find-psykiater/boerne-og-ungdomspsykiater/private-boerne-og-ungdomspsykiatere")}">Private børn/unge</a>
                </div>
              </div>
            </div>
          </div>
          <div class="nav-group">
            <a class="nav-parent nav-parent-dropdown" data-nav="nyttige" href="${routeHref(fromRoute, "nyttige-links-og-tilbud")}">Nyttige links og tilbud</a>
            <div class="nav-dropdown">
              <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/akut-krise")}">Akut krise</a>
              <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/brug-for-et-menneske-at-tale-med-hurtigst-muligt")}">Tal med nogen</a>
              <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/gode-overblik")}">Gode overblik</a>
              <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/foreninger-for-psykiske-sygdomme")}">Foreninger</a>
              <div class="nav-subgroup">
                <a class="nav-subparent" href="${routeHref(fromRoute, "nyttige-links-og-tilbud/maaske-du-er-i-denne-situation")}">Måske du er i denne situation</a>
                <div class="nav-submenu nav-submenu-wide">
                  <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/maaske-du-er-i-denne-situation/akut-krise")}">Akut krise</a>
                  <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/maaske-du-er-i-denne-situation/generelt-menneskeligt-sjaeleligt")}">Generelt / sjæleligt</a>
                  <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/maaske-du-er-i-denne-situation/ensomhed")}">Ensomhed</a>
                  <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/maaske-du-er-i-denne-situation/studerende")}">Studerende</a>
                  <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/maaske-du-er-i-denne-situation/paaroerende-til-psykisk-syge")}">Pårørende</a>
                  <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/maaske-du-er-i-denne-situation/patientstoette-og-rettigheder")}">Patientstøtte</a>
                </div>
              </div>
              <div class="nav-subgroup">
                <a class="nav-subparent" href="${routeHref(fromRoute, "nyttige-links-og-tilbud/regionernes-psykiatriske-og-sociale-tilbud")}">Regionernes tilbud</a>
                <div class="nav-submenu">
                  <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/regionernes-psykiatriske-og-sociale-tilbud/region-hovedstaden")}">Region Hovedstaden</a>
                  <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/regionernes-psykiatriske-og-sociale-tilbud/region-sjaelland")}">Region Sjælland</a>
                  <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/regionernes-psykiatriske-og-sociale-tilbud/region-syddanmark")}">Region Syddanmark</a>
                  <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/regionernes-psykiatriske-og-sociale-tilbud/region-midtjylland")}">Region Midtjylland</a>
                  <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/regionernes-psykiatriske-og-sociale-tilbud/region-nordjylland")}">Region Nordjylland</a>
                </div>
              </div>
            </div>
          </div>
          <div class="nav-group">
            <a class="nav-parent nav-parent-dropdown" data-nav="information" href="${routeHref(fromRoute, "information")}">Information</a>
            <div class="nav-dropdown">
              <a href="${routeHref(fromRoute, "information/offentlig-psykiater-ydernummer")}">Offentlig psykiater/ydernummer</a>
              <a href="${routeHref(fromRoute, "information/behandlingsgaranti")}">Behandlingsgaranti</a>
              <a href="${routeHref(fromRoute, "information/egen-laege-vs-praktiserende-psykiater")}">Egen læge vs. psykiater</a>
              <a href="${routeHref(fromRoute, "information/patientrettigheder")}">Patientrettigheder</a>
            </div>
          </div>
          <div class="nav-group">
            <a class="nav-parent nav-parent-dropdown" data-nav="om" href="${routeHref(fromRoute, "om")}">Om</a>
            <div class="nav-dropdown">
              <a href="${routeHref(fromRoute, "om/motivation")}">Motivation</a>
              <a href="${routeHref(fromRoute, "om/disclaimer")}">Disclaimer</a>
              <a href="${routeHref(fromRoute, "om/kontakt")}">Kontakt</a>
              <a href="${routeHref(fromRoute, "om/privatlivspolitik")}">Privatlivspolitik</a>
            </div>
          </div>
          <div class="nav-group">
            <a class="nav-parent" data-nav="akut" href="${routeHref(fromRoute, "nyttige-links-og-tilbud/akut-krise")}">Akut krise</a>
          </div>
          <div class="nav-group">
            <a class="nav-parent" data-nav="menneske" href="${routeHref(fromRoute, "nyttige-links-og-tilbud/brug-for-et-menneske-at-tale-med-hurtigst-muligt")}">Tal med nogen</a>
          </div>
        </nav>`;
}

function layout(page) {
  const fromRoute = page.route || "";
  const canonical = `${siteUrl}${fromRoute ? `/${fromRoute}/` : "/"}`;

  if (page.includeInSitemap !== false && !pageRoutes.includes(fromRoute)) {
    pageRoutes.push(fromRoute);
  }

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
          <p>Uafhængigt overblik over psykiatrisk hjælp, klinikker og nyttige links i Danmark.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="${routeHref(fromRoute, "om")}">Om</a>
          <a href="${routeHref(fromRoute, "om/kontakt")}">Kontakt</a>
          <a href="${routeHref(fromRoute, "om/disclaimer")}">Disclaimer</a>
          <a href="${routeHref(fromRoute, "om/privatlivspolitik")}">Privatlivspolitik</a>
          <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/akut-krise")}">Akut krise</a>
          <a href="${routeHref(fromRoute, "nyttige-links-og-tilbud/brug-for-et-menneske-at-tale-med-hurtigst-muligt")}">Brug for et menneske at tale med hurtigst muligt?</a>
          <a href="${supportUrl}" target="_blank" rel="noopener noreferrer">Støt siden</a>
        </nav>
      </div>
    </footer>
  </body>
</html>
`;
}

function pageShell(page, content) {
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
    body: pageShell({ eyebrow, heading: title, intro }, content)
  }));
}

function landingPage() {
  const route = "";
  const body = `
    <main id="indhold">
      <section class="hero">
        <div class="container hero-content">
          <p class="eyebrow">Komplet overblik</p>
          <h1>Find vej i psykiatrisk hjælp</h1>
          <p class="hero-copy">Find psykiater, akut hjælp og nyttige links og tilbud samlet i én rolig struktur.</p>
          <div class="hero-actions" aria-label="Vigtige indgange">
            ${link(route, "find-psykiater", "Find psykiater", "button button-primary")}
            ${link(route, "nyttige-links-og-tilbud/akut-krise", "Akut krise", "button button-urgent")}
            ${link(route, "nyttige-links-og-tilbud/brug-for-et-menneske-at-tale-med-hurtigst-muligt", "Brug for et menneske at tale med hurtigst muligt?", "button button-secondary")}
            ${link(route, "nyttige-links-og-tilbud", "Nyttige links og tilbud", "button button-secondary")}
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Forside</p>
            <h2>Komplet overblik</h2>
            <p>Forsiden sender brugeren videre til de vigtigste spor: find psykiater, akut krise, telefonrådgivning og nyttige links og tilbud.</p>
          </div>
          ${cardGrid(route, [
            ["Find psykiater", "Voksen, børn/unge, offentlig eller privat.", "find-psykiater"],
            ["Akut krise", "Ring 112 ved umiddelbar fare, og find officielle akutte indgange i regionerne.", "nyttige-links-og-tilbud/akut-krise"],
            ["Brug for et menneske at tale med hurtigst muligt?", "Gratis og anonyme telefonrådgivninger, hvor nogen kan lytte.", "nyttige-links-og-tilbud/brug-for-et-menneske-at-tale-med-hurtigst-muligt"],
            ["Nyttige links og tilbud", "Fører dig til den samlede oversigt med akuthjælp, overblik, foreninger, situationer og regioner.", "nyttige-links-og-tilbud"]
          ])}
        </div>
      </section>
      <section class="section section-muted">
        <div class="container split-layout">
          <div>
            <h2>Et uafhængigt informationssite</h2>
            <p>Psykiater Overblik hjælper med struktur og overblik, men oplysninger kan ændre sig. Tjek altid klinikkers, regioners, myndigheders og organisationers egne kilder.</p>
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
    description: "Find psykiater, akut hjælp og nyttige links og tilbud om psykisk og psykiatrisk hjælp i Danmark.",
    body
  }));
}

function sundhedDkCard(typeLabel) {
  return `
          <div class="resource-card">
            <h2>Gå til sundhed.dk</h2>
            <p>Gå til sundhed.dk’s egen komplette oversigt over Danmarks speciallæger, der tilhører det offentlige, hvor du under ‘behandlere’ kan vælge ‘${typeLabel}’ og sortere efter bl.a. afstand, ventetid og om de har åbent for nye patienter.</p>
            ${externalLink("https://www.sundhed.dk/borger/guides/find-behandler/", "Åbn sundhed.dk’s find behandler")}
          </div>`;
}

function publicFlowList() {
  return detailList([
    "Henvisningen kommer ofte fra fx egen læge.",
    "En offentlig psykiater betyder typisk en praktiserende speciallæge med ydernummer.",
    "Ventetider og adgang kan variere, så tjek altid sundhed.dk og den konkrete behandler."
  ]);
}

function selfPayerInfo() {
  return `
          <aside class="disclaimer spaced">
            <strong>Forsikringers interne behandlingsnetværk vs. selvbetaler</strong>
            ${detailList([
              "Hvis du vil anvende din sundhedsforsikring, så kontakt forsikringsselskabet og hør, hvilke psykiatere der er i deres netværk.",
              "Hvis du er selvbetaler, kan du som udgangspunkt vælge frit, medmindre klinikken eksplicit skriver, at de ikke tager selvbetalere.",
              "Klinikker kan i perioder være travle eller lukke midlertidigt for nye selvbetalere."
            ])}
          </aside>`;
}

function privatePsychiatristsPage() {
  const route = "find-psykiater/voksenpsykiater/private-psykiatere";
  const content = `
          <div class="sortable-table-intro">
            <p>Tabellen indlæses fra CSV-filen <strong>Tabel - Private Psykiatere - Sheet1.csv</strong>. Klik på en kolonneoverskrift for at sortere tabellen.</p>
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
          ${selfPayerInfo()}
          <div class="page-actions">
            ${link(route, "nyttige-links-og-tilbud", "Se også nyttige links og tilbud, du kan udnytte i ventetiden", "button button-secondary")}
          </div>
          <p class="small-note">Oplysninger kan være ufuldstændige eller ændre sig. Kontakt klinikken direkte, før du booker eller træffer beslutninger.</p>`;

  writeSimplePage(
    route,
    "Private psykiatere",
    "Tabel og kort information om private psykiatere, selvbetalerforløb og forsikringsnetværk.",
    content,
    "Voksenpsykiater",
    "Sorter private psykiatere efter klinik, region, by, postnummer, kontakt, priser, selvbetaler og online optag."
  );
}

function publicAdultPage() {
  const route = "find-psykiater/voksenpsykiater/offentlige-psykiatere";
  writeSimplePage(route, "Offentlige psykiatere", "Find vej til offentlige psykiatere med ydernummer via sundhed.dk.", `
          ${sundhedDkCard("psykiater")}
          <div class="resource-card spaced">
            <h2>Lidt info om flowet i det offentlige</h2>
            ${publicFlowList()}
          </div>
          <div class="page-actions">
            ${link(route, "nyttige-links-og-tilbud", "Se også nyttige links og tilbud, du kan udnytte i ventetiden", "button button-secondary")}
          </div>
          <aside class="disclaimer"><strong>Vigtig information</strong><p>Tjek altid sundhed.dk, egen læge eller den relevante klinik for aktuelle oplysninger.</p></aside>`, "Voksenpsykiater");
}

function publicYouthPage() {
  const route = "find-psykiater/boerne-og-ungdomspsykiater/offentlige-boerne-og-ungdomspsykiatere";
  writeSimplePage(route, "Find Børne- og ungdomspsykiater", "Find vej til offentlige børne- og ungdomspsykiatere via sundhed.dk.", `
          ${sundhedDkCard("Børne- og ungdomspsykiater")}
          <div class="resource-card spaced">
            <h2>Lidt info om flowet i det offentlige</h2>
            ${publicFlowList()}
          </div>
          <div class="page-actions">
            ${link(route, "nyttige-links-og-tilbud", "Se også nyttige links og tilbud, du kan udnytte i ventetiden", "button button-secondary")}
          </div>
          <aside class="disclaimer"><strong>Vigtig information</strong><p>Tjek altid sundhed.dk, egen læge eller den relevante klinik for aktuelle oplysninger.</p></aside>`, "Børne- og ungdomspsykiater");
}

function privateYouthPage() {
  const route = "find-psykiater/boerne-og-ungdomspsykiater/private-boerne-og-ungdomspsykiatere";
  writeSimplePage(route, "Private børne- og ungdomspsykiatere", "Tabel med private børne- og ungdomspsykiatere kommer snart.", `
          ${placeholder("Tabel", "Indhold kommer snart.")}
          ${selfPayerInfo()}
          <div class="page-actions">
            ${link(route, "nyttige-links-og-tilbud", "Se også nyttige links og tilbud, du kan udnytte i ventetiden", "button button-secondary")}
          </div>`, "Børne- og ungdomspsykiater");
}

function regionResourcePage(slug, regionName, dataFile) {
  const route = `nyttige-links-og-tilbud/regionernes-psykiatriske-og-sociale-tilbud/${slug}`;
  const content = `
          <a class="back-link" href="${routeHref(route, "nyttige-links-og-tilbud/regionernes-psykiatriske-og-sociale-tilbud")}">Tilbage til regionernes tilbud</a>
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

function usefulLinksOverview() {
  const route = "nyttige-links-og-tilbud";
  writeSimplePage(route, "Nyttige links og tilbud", "Nyttige links og tilbud samlet efter akut hjælp, gode overblik, foreninger, situationer og regionernes tilbud.", cardGrid(route, [
    ["Akut krise", "Ring 112 ved umiddelbar fare, og find officiel akut hjælp i din region.", "nyttige-links-og-tilbud/akut-krise"],
    ["Brug for et menneske at tale med hurtigst muligt?", "Gratis og anonyme telefonrådgivninger, hvor nogen kan lytte.", "nyttige-links-og-tilbud/brug-for-et-menneske-at-tale-med-hurtigst-muligt"],
    ["Gode overblik", "Socialkompas, sundhed.dk, RådgivningsDanmark og kombu.dk.", "nyttige-links-og-tilbud/gode-overblik"],
    ["Foreninger for psykiske sygdomme", "Plads til Depressionsforeningen, Angstforeningen og andre foreninger.", "nyttige-links-og-tilbud/foreninger-for-psykiske-sygdomme"],
    ["Måske du er i denne situation", "Find links efter situation som ensomhed, sorg, studerende og pårørende.", "nyttige-links-og-tilbud/maaske-du-er-i-denne-situation"],
    ["Regionernes psykiatriske og sociale tilbud", "Regionale tilbud samlet i søgbare tabeller.", "nyttige-links-og-tilbud/regionernes-psykiatriske-og-sociale-tilbud"]
  ], true), "Nyttige links og tilbud");
}

function usefulOverviewsPage() {
  const route = "nyttige-links-og-tilbud/gode-overblik";
  writeSimplePage(route, "Gode overblik", "Generelle indgange til hjælp og overblik.", `
          <div class="resource-grid">
            <article class="resource-card">
              <h2>Socialkompas</h2>
              <p>Vejledning til hvordan man bruger Socialkompas.</p>
              ${externalLink("https://socialkompas.dk/", "Åbn socialkompas.dk")}
            </article>
            <article class="resource-card">
              <h2>Sundhedstilbud</h2>
              <p>Her er mange tilbud samlet udbudt af regionerne. Oversigten er ikke helt fyldestgørende, derfor har siden også en samlet underside med regionernes psykiatriske og sociale tilbud.</p>
              ${externalLink("https://www.sundhed.dk/sundhedsfaglig/opslag-og-vaerktoejer/sundhedstilbud/", "Åbn sundhed.dk sundhedstilbud")}
            </article>
            <article class="resource-card">
              <h2>RådgivningsDanmark</h2>
              <p>Vejledning til hjemmesiden.</p>
              ${externalLink("https://raadgivningsdanmark.dk/find-raadgivning/", "Find rådgivning")}
            </article>
            <article class="resource-card">
              <h2>Kombu</h2>
              <p>Vejledning til hjemmesiden.</p>
              ${externalLink("https://kombu.dk/hjaelp-tilbud/kommunale-regionale-nationale-tilbud", "Åbn kombu.dk")}
            </article>
          </div>
          <div class="page-actions">
            ${link(route, "nyttige-links-og-tilbud/regionernes-psykiatriske-og-sociale-tilbud", "Regionernes psykiatriske og sociale tilbud", "button button-secondary")}
          </div>`, "Nyttige links og tilbud");
}

function acuteResourcesPage() {
  const route = "nyttige-links-og-tilbud/akut-krise";
  writeSimplePage(route, "Akut krise", "Ring 112 ved umiddelbar fare, og find officiel akut hjælp i din region.", `
          <aside class="crisis-box">
            <strong>Ring 112 nu</strong>
            <p>Ring 112 nu, hvis du eller en anden er i umiddelbar fare, fx ved et igangværende selvmordsforsøg, konkrete planer om at gøre skade på sig selv eller andre, alvorlig forgiftning eller behov for akut ambulance eller politi.</p>
          </aside>
          <section class="resource-card spaced">
            <h2>Er du pårørende?</h2>
            <p>Du må gerne ringe på vegne af en person, du er bekymret for.</p>
          </section>
          <section class="resource-card spaced">
            <h2>Find den officielle akutte hjælp i din region</h2>
            <p>Vælg den region, du befinder dig i. Linket fører til regionens officielle vejledning med aktuelle telefonnumre, adresser og information om, hvor du skal henvende dig.</p>
            ${detailList([
              externalLink("https://www.regionh.dk/sundhed/akut/sider/default.aspx", "Region Hovedstaden"),
              externalLink("https://www.regionsjaelland.dk/sundhed/akuthjaelp", "Region Sjælland"),
              externalLink("https://regionsyddanmark.dk/patienter-og-parorende/akuthjaelp", "Region Syddanmark"),
              externalLink("https://www.sundhed.rm.dk/akuthjalp/", "Region Midtjylland"),
              externalLink("https://rn.dk/Sundhed/Akut-sygdom", "Region Nordjylland")
            ])}
            <p class="small-note">Oplysningerne på de regionale sider vedligeholdes af regionerne. Følg altid den officielle vejledning på den side, du åbner.</p>
          </section>
          <div class="page-actions">
            ${link(route, "nyttige-links-og-tilbud/brug-for-et-menneske-at-tale-med-hurtigst-muligt", "Brug for et menneske at tale med hurtigst muligt?", "button button-secondary")}
            ${link(route, "nyttige-links-og-tilbud/regionernes-psykiatriske-og-sociale-tilbud", "Regionernes psykiatriske og sociale tilbud", "button button-secondary")}
          </div>`, "Akut hjælp");
}

function talkSoonPage() {
  const route = "nyttige-links-og-tilbud/brug-for-et-menneske-at-tale-med-hurtigst-muligt";
  writeSimplePage(
    route,
    "Brug for et menneske at tale med hurtigst muligt?",
    "Gratis og anonyme telefonrådgivninger, hvor nogen kan lytte, når livet føles svært.",
    `
          <aside class="crisis-box">
            <strong>Ring 112 ved akut fare</strong>
            <p>Ring 112, hvis du eller en anden er i umiddelbar fare. Rådgivningerne nedenfor erstatter ikke akut lægehjælp eller psykiatrisk akutbehandling.</p>
          </aside>
          <p>Her finder du gratis og anonyme telefonrådgivninger, hvor nogen kan lytte, når livet føles svært.</p>
          <p>Her kan du tale med nogen, som er vant til at støtte mennesker i svære situationer.</p>
          <div class="resource-grid">
            <article class="resource-card">
              <h2>Psykiatrifonden</h2>
              <p>Erfarne rådgivere med faglig viden om psykiske problemer og kriser.</p>
              ${externalLink("https://psykiatrifonden.dk/hjaelp-raadgivning", "Åbn Psykiatrifonden")}
            </article>
            <article class="resource-card">
              <h2>SIND</h2>
              <p>Støtte og rådgivning til psykisk sårbare, mennesker med psykisk sygdom og pårørende.</p>
              ${externalLink("https://sind.dk/faa-hjaelp/sind-raadgivning", "Åbn SIND rådgivning")}
            </article>
            <article class="resource-card">
              <h2>Livslinien</h2>
              <p>Særligt relevant ved selvmordstanker og alvorlig livskrise.</p>
              ${externalLink("https://www.livslinien.dk/", "Åbn Livslinien")}
            </article>
            <article class="resource-card">
              <h2>Startlinjen</h2>
              <p>Anonym samtale om blandt andet ensomhed, angst, depression og svære livssituationer.</p>
              ${externalLink("https://startlinjen.dk/", "Åbn Startlinjen")}
            </article>
            <article class="resource-card">
              <h2>Sct. Nicolai Tjenesten</h2>
              <p>Medmenneskelig samtale om eksempelvis ensomhed, sorg og bekymringer.</p>
              ${externalLink("https://kirkenskorshaer.dk/sociale-tilbud/sct-nicolai-tjenesten/", "Åbn Sct. Nicolai Tjenesten")}
            </article>
          </div>
          <p class="small-note">Tjek altid åbningstider og kontaktmuligheder på rådgivningernes egne sider.</p>
          <div class="page-actions">
            ${link(route, "nyttige-links-og-tilbud/akut-krise", "Akut krise", "button button-urgent")}
          </div>`,
    "Telefonrådgivning"
  );
}

function associationsPage() {
  const route = "nyttige-links-og-tilbud/foreninger-for-psykiske-sygdomme";
  writeSimplePage(route, "Foreninger for psykiske sygdomme", "Plads til kontrollerede links til relevante foreninger.", `
          ${detailList([
            "Depressionsforeningen - indsæt kontrolleret link.",
            "Angstforeningen - indsæt kontrolleret link.",
            "Osv. - tilføj kun foreninger, hvor link og relevans er kontrolleret."
          ])}
          <p class="small-note">Undgå at kopiere foreningernes egne beskrivelser direkte. Skriv korte, neutrale beskrivelser og link til kilden.</p>`, "Nyttige links og tilbud");
}

function situationOverviewPage() {
  const route = "nyttige-links-og-tilbud/maaske-du-er-i-denne-situation";
  writeSimplePage(route, "Måske du er i denne situation", "Find links og tilbud efter situation.", cardGrid(route, situationPages.map(([slug, title, text]) => [
    title,
    text,
    `nyttige-links-og-tilbud/maaske-du-er-i-denne-situation/${slug}`
  ]), true), "Nyttige links og tilbud");

  situationPages.forEach(([slug, title, text]) => {
    const situationRoute = `nyttige-links-og-tilbud/maaske-du-er-i-denne-situation/${slug}`;
    const extra = slug === "akut-krise"
      ? `<div class="page-actions">${link(situationRoute, "nyttige-links-og-tilbud/akut-krise", "Akut krise", "button button-primary")}</div>`
      : "";
    writeSimplePage(situationRoute, title, text, `
          ${placeholder(title, text)}
          ${extra}
          <p class="small-note">Tilføj kun konkrete tilbud, når link, målgruppe og adgang er kontrolleret.</p>`, "Måske du er i denne situation");
  });
}

function regionalOverviewPage() {
  const route = "nyttige-links-og-tilbud/regionernes-psykiatriske-og-sociale-tilbud";
  writeSimplePage(route, "Regionernes psykiatriske og sociale tilbud", "Vælg region for at se regionale tilbud i søgbare tabeller.", `
          <p>Her ligger de eksisterende regionsdata samlet som undersider for hver region.</p>
          ${cardGrid(route, regionPages.map(([slug, name]) => [
            name,
            `Se psykiatriske og sociale tilbud i ${name}.`,
            `nyttige-links-og-tilbud/regionernes-psykiatriske-og-sociale-tilbud/${slug}`,
            `Åbn ${name}`
          ]), true)}`, "Nyttige links og tilbud");
  regionPages.forEach(([slug, name, dataFile]) => regionResourcePage(slug, name, dataFile));
}

function buildPages() {
  cleanupOldStructure();
  landingPage();

  writeSimplePage("find-psykiater", "Find psykiater", "Vælg mellem voksenpsykiater og børne- og ungdomspsykiater.", cardGrid("find-psykiater", [
    ["Voksenpsykiater", "Offentlig eller privat psykiater for voksne.", "find-psykiater/voksenpsykiater"],
    ["Børne- og ungdomspsykiater", "Offentlig eller privat børne- og ungdomspsykiater.", "find-psykiater/boerne-og-ungdomspsykiater"]
  ], true), "Find psykiater");

  writeSimplePage("find-psykiater/voksenpsykiater", "Voksenpsykiater", "Find offentlig eller privat psykiater for voksne.", cardGrid("find-psykiater/voksenpsykiater", [
    ["Offentlige psykiatere", "Henvisning, ydernummer og link til sundhed.dk.", "find-psykiater/voksenpsykiater/offentlige-psykiatere"],
    ["Private psykiatere", "Sorterbar tabel og information om selvbetaler og forsikring.", "find-psykiater/voksenpsykiater/private-psykiatere"]
  ], true), "Find psykiater");
  publicAdultPage();
  privatePsychiatristsPage();

  writeSimplePage("find-psykiater/boerne-og-ungdomspsykiater", "Børne- og ungdomspsykiater", "Find information og indgange for børn og unge.", cardGrid("find-psykiater/boerne-og-ungdomspsykiater", [
    ["Er du forælder?", "Denne side er under opbygning.", "find-psykiater/boerne-og-ungdomspsykiater/er-du-foraelder"],
    ["Offentlige børne- og ungdomspsykiatere", "Find vej via sundhed.dk.", "find-psykiater/boerne-og-ungdomspsykiater/offentlige-boerne-og-ungdomspsykiatere"],
    ["Private børne- og ungdomspsykiatere", "Tabel kommer senere.", "find-psykiater/boerne-og-ungdomspsykiater/private-boerne-og-ungdomspsykiatere"]
  ], true), "Find psykiater");
  writeSimplePage("find-psykiater/boerne-og-ungdomspsykiater/er-du-foraelder", "Er du forælder?", "Denne side er under opbygning.", placeholder("Er du forælder?"), "Børne- og ungdomspsykiater");
  publicYouthPage();
  privateYouthPage();

  usefulLinksOverview();
  acuteResourcesPage();
  talkSoonPage();
  usefulOverviewsPage();
  associationsPage();
  situationOverviewPage();
  regionalOverviewPage();

  writeSimplePage("information", "Information", "Forklarende sider om systemet omkring psykiatri, ydernummer, behandlingsgaranti og patientrettigheder.", cardGrid("information", informationPages.map(([slug, title]) => [
    title,
    "Denne informationsside er under opbygning.",
    `information/${slug}`
  ]), true), "Information");
  informationPages.forEach(([slug, title]) => {
    writeSimplePage(`information/${slug}`, title, "Denne side er under opbygning.", placeholder(title), "Information");
  });

  writeSimplePage("om", "Om", "Læs om motivation, disclaimer, kontakt og privatlivspolitik.", cardGrid("om", [
    ["Motivation", "Hvorfor siden findes.", "om/motivation"],
    ["Disclaimer", "Vigtige forbehold om information og akut hjælp.", "om/disclaimer"],
    ["Kontakt", "Kontaktinformation kommer senere.", "om/kontakt"],
    ["Privatlivspolitik", "Foreløbig privatlivstekst.", "om/privatlivspolitik"]
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
            <p>Siden indsamler ikke følsomme helbredsoplysninger via formularer. Links til eksterne tjenester, fx Buy Me a Coffee, kan være omfattet af tredjepartens egne vilkår og privatlivspolitik.</p>
          </div>`, "Om");

  fs.writeFileSync(path.join(root, "404.html"), layout({
    route: "",
    title: "Siden blev ikke fundet",
    description: "Siden blev ikke fundet.",
    includeInSitemap: false,
    body: pageShell({
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

  const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
  fs.writeFileSync(path.join(root, "robots.txt"), robots);
}

buildPages();

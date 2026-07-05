# Master Prompt: Recreate Psykiater Overblik From Scratch

You are Codex. Rebuild the entire project "Psykiater Overblik" from scratch in the current workspace.

Build a complete static Danish website that helps users find their way through psychiatric help options in Denmark. The finished product must be a calm, trustworthy, mobile-friendly, SEO-ready static site with no backend and no framework.

The project must be rebuildable by manually editing HTML, CSS, JavaScript, and JSON files. Do not use React, Next.js, Vue, Svelte, Tailwind, Bootstrap, a database, a CMS, or a build step.

## Project Vision

Psykiater Overblik is an independent Danish information website that gives users a structured overview of routes into psychiatric help.

The product must:

- Separate public and private psychiatry clearly.
- Provide searchable/filterable tables for public and private psychiatrist/clinic data.
- Provide a dedicated entry point for children and young people.
- Explain key concepts such as henvisning, ydernummer, behandlingsgaranti, patientrettigheder, self-payment, and insurance network issues.
- Provide clear crisis guidance for users who need help immediately.
- Provide a structured resource area by user situation/problem context.
- Make it easy for the owner to manually research and add data later through JSON files.

This is not a medical service, booking tool, referral system, diagnostic tool, treatment guide, public authority site, or complete clinic database. It is an independent overview and research aid.

All copy must be in Danish, except code comments/technical names where English is conventional.

## Target Users

Primary users:

- Adults in Denmark looking for psychiatric assessment, treatment, or clarification.
- Parents or guardians looking for psychiatry-related help for children or young people.
- People comparing public and private routes to psychiatric support.
- Users trying to understand terms such as henvisning, ydernummer, selvbetaler, and behandlingsgaranti.
- Users in a non-acute mental health situation who need a structured starting point.

Secondary users:

- Relatives and caregivers.
- Clinics or professionals who want to suggest corrections.
- Site owner/editor who will research and maintain JSON data manually.
- Future collaborators who may expand the data set and resources.

Safety rule:

- Users needing emergency intervention must be directed to 112, psychiatric emergency reception, skadestue, or regional urgent services.
- Never present the site as a substitute for medical advice.

## Functional Requirements

### Global Requirements

- Static website only.
- No backend.
- No database.
- No build process.
- All pages must load shared `css/style.css`.
- All pages must load shared `js/app.js`.
- All pages must use a shared top navigation structure.
- The site must work on GitHub Pages, Netlify, Cloudflare Pages, or any static host.
- The site must be usable without ads.
- Use semantic HTML.
- Use one clear H1 per page.
- Use Danish user-facing copy.
- Avoid false medical claims.
- Include disclaimers where relevant.
- External links must open in a new tab and use `rel="noopener noreferrer"`.

### Information Architecture

Implement this product structure:

- Forside
- Offentlige psykiatere
  - Tabel
  - Info
    - Henvisningen
    - Ydernummer
- Private psykiatere
  - Tabel
  - Info
    - Forsikringers interne behandlingsnetværk vs. selvbetaler
- Børne/unge psykiatere
  - Offentlige
  - Private
- Information
  - Offentlig psykiater/ydernummer
  - Behandlingsgaranti
  - Egen læge vs. praktiserende psykiater vs. psykiatrien vs. psykolog vs. terapeut
  - Patientrettigheder
  - De store hjælpere
    - Psykiatrifonden
    - Livslinien
- Brug for hjælp NU / i krise
  - 112, 1813, skadestue
  - Telefonrådgivninger
- Problemstillinger, nyttige links og ressourcer
  - Er du forælder?
  - Væresteder
  - Studerende
  - I arbejde (HR, sygemelding, fagforening)
  - Voksne
  - Ældre
  - LGBT
  - Ensom
  - Pårørende
  - Selvmordstruet/skadeforvoldende
  - Generelt
  - Fuldstændig liste
- Om
  - Motivation
  - Disclaimer
  - Kontakt

### Required Pages

Create these files:

- `index.html`
- `offentlige-klinikker.html`
- `offentlige-psykiatere-info.html`
- `klinikker.html`
- `private-psykiatere-info.html`
- `boern-unge-psykiatere.html`
- `information.html`
- `krisehjaelp.html`
- `problemstillinger.html`
- `om-os.html`
- `kontakt.html`
- `privatlivspolitik.html`
- `adhd.html`
- `autisme.html`
- `om-psykiatere.html`
- `nyttige-links.html`

The last four are legacy/support content pages. They may exist outside the primary navigation but must still be styled consistently and functional.

### `index.html`: Forside / Komplet overblik

The front page must:

- Use a hero section with a calm health-oriented background image.
- H1: `Find vej i psykiatrisk hjælp`
- Eyebrow: `Komplet overblik`
- Supporting copy explaining that users can find public/private psychiatrists, information, children/young people routes, resources, and crisis help.
- CTAs:
  - `Offentlige psykiatere` -> `offentlige-klinikker.html`
  - `Private psykiatere` -> `klinikker.html`
  - `Brug for hjælp NU / i krise` -> `krisehjaelp.html`
- Overview cards for:
  - Offentlige psykiatere
  - Private psykiatere
  - Børne/unge psykiatere
  - Information
  - Brug for hjælp NU / i krise
  - Problemstillinger og ressourcer
  - Om
- Include a visible disclaimer that the site is independent and does not replace medical advice.

### `offentlige-klinikker.html`: Public Data Table

Purpose:

- A searchable/filterable data table for public psychiatric offerings/psychiatrists.

Data source:

- `data/offentlige-klinikker.json`

Initial data:

- The file should be an empty JSON array: `[]`
- Do not invent public clinics.

Filters:

- Search
- Region
- City
- Akut hjælp
- Henvisning
- Voksne
- Børn/unge
- ADHD
- Autisme

Desktop columns:

- Tilbud
- Type
- Region
- By/område
- Adresse/område
- Hjemmeside
- Akut hjælp
- Henvisning
- Voksne
- Børn/unge
- ADHD
- Autisme
- Noter

Empty state:

- `Ingen offentlige tilbud matcher filtrene.`

Result counter:

- `Viser X offentlige tilbud`
- Singular should be `offentligt tilbud`.

### `offentlige-psykiatere-info.html`

Purpose:

- Explain public psychiatry concepts before using the public table.

Required sections:

- Henvisningen
- Ydernummer
- CTA to public table
- Disclaimer

### `klinikker.html`: Private Data Table

Purpose:

- A searchable/filterable data table for private psychiatrists/private psychiatric clinics.

Data source:

- `data/klinikker.json`

Initial data:

Use exactly one sample record:

```json
[
  {
    "navn": "Carelink Psykiatri",
    "afdelinger": "",
    "laeger": [
      "Annamaria Molnar",
      "Laura Aakjær Jensen",
      "Bettina Lodskou Pedersen"
    ],
    "region": "Sjælland",
    "by": "Kongens Lyngby",
    "byPostnr": "2800 Kongens Lyngby",
    "adresse": "Klampenborgvej 248, 1. sal. mf",
    "telefon": "",
    "email": "",
    "hjemmeside": "https://mensana.dk/",
    "priser": "https://mensana.dk/priser-betaling/",
    "nationaltOptag": true,
    "tagerPatienterOnline": true,
    "selvbetaler": true,
    "tagerIkkeEgenbetalere": false,
    "adhd": false,
    "autisme": false,
    "boernUnge": false
  }
]
```

Do not invent additional private clinics.

Filters:

- Search
- Region
- By/postnr
- Selvbetaler
- Online/nationalt optag
- ADHD-kompetencer
- Autisme-kompetencer
- Børn/unge

Desktop columns:

- Hjemmeside
- Klinikkens navn
- Link til priser
- Børn/unge
- Evt. afdelinger
- Tilknyttede læger
- Tlf
- Email
- By/postnr
- Adresse
- Tager patienter online
- Tager ikke egenbetalere

Empty state:

- `Ingen private klinikker matcher filtrene.`

Result counter:

- `Viser X private klinikker`
- Singular should be `privat klinik`.

### `private-psykiatere-info.html`

Purpose:

- Explain private psychiatrist concepts before using the private table.

Required sections:

- Selvbetaler
- Forsikringers interne behandlingsnetværk vs. selvbetaler
- CTA to private table
- Disclaimer

### `boern-unge-psykiatere.html`

Purpose:

- Dedicated entry point for children/young people.

Required content:

- H1 about public and private routes for children and young people.
- Card/link to public table filtered with `offentlige-klinikker.html?boernUnge=ja`
- Card/link to private table filtered with `klinikker.html?boernUnge=ja`
- Disclaimer about checking referral, consent, target group, and acute needs with relevant professionals.

### `information.html`

Purpose:

- Explain central psychiatry system concepts.

Required sections:

- Offentlig psykiater/ydernummer
- Behandlingsgaranti
- Egen læge vs. praktiserende psykiater
- Patientrettigheder
- De store hjælpere
  - Psykiatrifonden
  - Livslinien

Include an anchor navigation near the top.

### `krisehjaelp.html`

Purpose:

- Crisis help page with immediate safety guidance.

Required content:

- H1: `Søg akut hjælp med det samme ved fare`
- Very clear crisis box:
  - `Ved akut fare eller selvmordstanker: ring 112 eller kontakt psykiatrisk akutmodtagelse.`
- Sections:
  - 112, 1813 og skadestue
  - Telefonrådgivninger
- Include resource cards for:
  - Livslinien
  - Psykiatrifonden
  - Regional akut hjælp placeholder
- Make it clear the site is not an emergency service.

### `problemstillinger.html`

Purpose:

- Resource placeholder page organized by user situation.

Required cards/sections:

- Er du forælder?
- Væresteder
- Studerende
- I arbejde
- Voksne
- Ældre
- LGBT
- Ensom
- Pårørende
- Selvmordstruet/skadeforvoldende
- Generelt
- Fuldstændig liste

These can be placeholder cards for future curated links. Do not invent concrete resources beyond obvious major helpers already used elsewhere unless verified.

### `om-os.html`

Purpose:

- Explain independence, motivation, limitations, disclaimer, and contact.

Required sections:

- Motivation
- Uafhængighed
- Data kan ændre sig
- Disclaimer
- Kontakt

### `kontakt.html`

Purpose:

- Simple contact page.

Required content:

- Placeholder mail: `kontakt@example.com`
- Explain that clinics/professionals can suggest corrections.
- Explain that the site cannot provide acute advice, visitation, or treatment.

### `privatlivspolitik.html`

Purpose:

- Privacy policy page.

Required content:

- The site does not collect sensitive health information.
- Users should not send CPR, health details, or sensitive personal data by email.
- Contact emails are processed only to answer the request.
- Third-party ads may be used later.
- External links have their own privacy practices.

### Legacy/support pages

Create consistent pages:

- `adhd.html`: ADHD assessment overview and CTA to private table.
- `autisme.html`: autism assessment overview and CTA to private table.
- `om-psykiatere.html`: what a psychiatrist is; difference between psychiatrist, psychologist, and GP.
- `nyttige-links.html`: useful links and crisis disclaimer.

These pages should be styled consistently, but do not need to be primary navigation items or sitemap entries unless you choose to include them.

## Technical Requirements

Use only:

- HTML5
- CSS3
- Vanilla JavaScript
- JSON

Do not use:

- Backend
- Database
- Frameworks
- Build tools
- External UI libraries
- External fonts
- Package manager

Runtime behavior:

- Every HTML page references `css/style.css`.
- Every HTML page references `js/app.js`.
- Listing pages declare a form with `id="clinic-filters"`.
- `js/app.js` detects listing pages by presence of `#clinic-filters`.
- Listing pages configure the data source and labels through form `data-*` attributes:
  - `data-source`
  - `data-kind`
  - `data-singular`
  - `data-plural`
  - `data-empty`

JavaScript must:

- Initialize mobile navigation.
- Toggle nav open/closed.
- Set `aria-expanded` on the mobile menu button.
- Close mobile nav after a nav link click.
- Apply `aria-current="page"` to the active nav item.
- Map info/contact/privacy subpages to the correct active parent nav item.
- Treat `?boernUnge=ja` on public/private table pages as active under Børn/unge.
- Load data from JSON with `fetch`.
- Validate fetched JSON is an array.
- Populate region and city dropdowns from loaded data.
- Apply query parameters to filter controls.
- Search/filter records.
- Render desktop table rows.
- Render mobile cards.
- Render empty states.
- Render result counter.
- Render external links safely.
- Render missing fields as `Ikke oplyst`.

## Data Model Requirements

### Private JSON

File:

```text
data/klinikker.json
```

Top level must be an array.

Record shape:

```json
{
  "navn": "Carelink Psykiatri",
  "afdelinger": "",
  "laeger": ["Name One", "Name Two"],
  "region": "Sjælland",
  "by": "Kongens Lyngby",
  "byPostnr": "2800 Kongens Lyngby",
  "adresse": "Address",
  "telefon": "",
  "email": "",
  "hjemmeside": "https://example.com/",
  "priser": "https://example.com/priser/",
  "nationaltOptag": true,
  "tagerPatienterOnline": true,
  "selvbetaler": true,
  "tagerIkkeEgenbetalere": false,
  "adhd": false,
  "autisme": false,
  "boernUnge": false
}
```

### Public JSON

File:

```text
data/offentlige-klinikker.json
```

Top level must be an array. Initially use:

```json
[]
```

Expected future record shape:

```json
{
  "navn": "Navn på tilbud",
  "type": "Ambulatorium",
  "region": "Hovedstaden",
  "by": "København",
  "adresse": "Adresse eller område",
  "hjemmeside": "https://example.com",
  "akutmodtagelse": false,
  "henvisning": true,
  "voksne": true,
  "boernUnge": false,
  "adhd": null,
  "autisme": null,
  "noter": "Kort note"
}
```

Boolean display:

- `true` -> `Ja`
- `false` -> `Nej`
- `null`, undefined, empty -> `Ikke oplyst`

## Search and Filter Requirements

Search:

- Case-insensitive.
- Danish-locale lowercasing is acceptable.
- Search across relevant text fields:
  - `navn`
  - `type`
  - `afdelinger`
  - `region`
  - `by`
  - `byPostnr`
  - `postnummer`
  - `adresse`
  - `telefon`
  - `tlf`
  - `email`
  - `noter`
  - `laeger`

Dropdowns:

- Region options generated from data.
- City/private by-postcode options generated from data.
- Sorted using Danish locale.

Boolean filters:

- Empty value means all.
- `ja` means field must be `true`.
- `nej` means field must be `false`.
- Unknown/null fields should not match `ja` or `nej`.

Supported boolean filter keys:

- `selvbetaler`
- `tagerIkkeEgenbetalere`
- `nationaltOptag`
- `tagerPatienterOnline`
- `adhd`
- `autisme`
- `boernUnge`
- `akutmodtagelse`
- `henvisning`
- `voksne`

Reset:

- Include `Nulstil filtre` button.
- Reset all filters and search field.
- Return focus to search input.

## UX Requirements

Overall UX:

- Calm, clear, and credible.
- Must not feel like a marketing landing page.
- Must feel like a structured public-interest information tool.
- Keep action paths visible.
- Keep public/private choices distinct.
- Make crisis help visually distinct.
- Keep copy short and useful.
- Avoid decorative clutter.
- Use cards for repeated choices/resources.
- Use tables for dense desktop data.
- Use cards for mobile data.

Header:

- Sticky.
- Brand: `Psykiater Overblik`.
- Circular brand mark with `PO`.
- Desktop nav inline.
- Mobile nav hidden behind hamburger.

Hero:

- Use local image `assets/hero-psykiater-overblik.jpg`.
- If you need to recreate the asset, use a calm healthcare/consultation room image with no visible text, logos, pills, syringes, or identifiable people.
- Overlay should preserve text legibility.

Crisis UX:

- Crisis page must be visually urgent but not chaotic.
- Use red/danger styling only for crisis contexts.
- Crisis guidance must be above ordinary advice.

## UI Design System

Use CSS custom properties:

```css
:root {
  --bg: #f6fbfa;
  --surface: #ffffff;
  --surface-soft: #e9f6f3;
  --ink: #163238;
  --muted: #5c7378;
  --line: #d8e6e4;
  --blue: #1d6f95;
  --blue-dark: #14506d;
  --green: #2d8c7f;
  --green-dark: #1f6f66;
  --danger: #8b2635;
  --danger-soft: #fdecee;
  --shadow: 0 18px 45px rgba(20, 80, 109, 0.12);
  --radius: 8px;
  --max-width: 1180px;
}
```

Typography:

- Use system sans-serif:

```css
font-family: Arial, Helvetica, sans-serif;
```

- Base font size: `16px`.
- Body line-height: `1.6`.
- No negative letter spacing.
- Use responsive H1 sizing with `clamp`.
- Use smaller headings inside cards and panels.

Components to implement:

- `.container`
- `.container.narrow`
- `.skip-link`
- `.visually-hidden`
- `.site-header`
- `.header-inner`
- `.brand`
- `.brand-mark`
- `.primary-nav`
- `.nav-toggle`
- `.hero`
- `.hero-content`
- `.hero-actions`
- `.page-hero`
- `.button`
- `.button-primary`
- `.button-secondary`
- `.button-urgent`
- `.section`
- `.section-muted`
- `.overview-grid`
- `.overview-card`
- `.overview-card-urgent`
- `.feature-card`
- `.feature-icon`
- `.sublink-list`
- `.page-actions`
- `.anchor-nav`
- `.resource-grid`
- `.resource-card`
- `.filters`
- `.field`
- `.result-bar`
- `.table-wrap`
- `.clinic-table`
- `.clinic-cards`
- `.clinic-card`
- `.badge.yes`
- `.badge.no`
- `.badge.unknown`
- `.empty-state`
- `.small-note`
- `.crisis-box`
- `.disclaimer`
- `.site-footer`

## Mobile Responsiveness Requirements

Breakpoints:

- Below ~980px:
  - Collapse navigation behind hamburger.
- Below ~760px:
  - Tables hidden.
  - Mobile cards shown.
  - Filters become one column.
  - Overview/resource grids become one column.
  - Buttons stack vertically.
  - Footer becomes one column.
- Below ~480px:
  - Brand text may wrap.
  - Buttons full width.

Mobile listing behavior:

- Users must be able to search/filter clinics without horizontal scrolling.
- Card view is primary on mobile.
- Each card should show label/value pairs.

## Accessibility Requirements

Implement:

- Semantic HTML.
- Skip link: `Spring til indhold`.
- `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`.
- One H1 per page.
- Mobile nav button with:
  - `aria-expanded`
  - `aria-controls="primary-navigation"`
- `nav` with `aria-label="Primær navigation"`.
- Active nav with `aria-current="page"`.
- Result counter with `aria-live="polite"`.
- Filter form with `aria-label`.
- Explicit labels for all form controls.
- Tables with `thead`, `tbody`, `th`.
- Visible focus states.
- Strong contrast.
- External links with `rel="noopener noreferrer"`.
- Hidden helper class `.visually-hidden`.

Recommended:

- Add table captions if desired.
- Keep line lengths readable.
- Avoid using color alone to convey meaning.

## SEO Requirements

Every HTML page must include:

- Unique `<title>`.
- Unique `<meta name="description">`.
- Open Graph title.
- Open Graph description.
- Open Graph type.
- Open Graph URL.
- Open Graph image.
- Canonical link.
- Placeholder favicon:

```html
<link rel="icon" href="data:,">
```

Use placeholder domain:

```text
https://example.com
```

Create `robots.txt`:

```text
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

Create `sitemap.xml` containing primary pages:

- `/`
- `/offentlige-klinikker.html`
- `/offentlige-psykiatere-info.html`
- `/klinikker.html`
- `/private-psykiatere-info.html`
- `/boern-unge-psykiatere.html`
- `/information.html`
- `/krisehjaelp.html`
- `/problemstillinger.html`
- `/om-os.html`
- `/kontakt.html`
- `/privatlivspolitik.html`

SEO copy must avoid unsupported medical claims.

## AdSense Requirements

Prepare for Google AdSense but keep ads disabled.

In every HTML head include this commented placeholder:

```html
<!-- Google AdSense placeholder:
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
-->
```

Add commented ad slot placeholders in logical page positions.

Create `ads.txt`:

```text
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

The site must work fully without ads.

## Folder Structure

Create this structure:

```text
/
├── .gitignore
├── adhd.html
├── ads.txt
├── autisme.html
├── boern-unge-psykiatere.html
├── index.html
├── information.html
├── klinikker.html
├── kontakt.html
├── krisehjaelp.html
├── nyttige-links.html
├── offentlige-klinikker.html
├── offentlige-psykiatere-info.html
├── om-os.html
├── om-psykiatere.html
├── private-psykiatere-info.html
├── privatlivspolitik.html
├── problemstillinger.html
├── robots.txt
├── sitemap.xml
├── assets/
│   └── hero-psykiater-overblik.jpg
├── css/
│   └── style.css
├── data/
│   ├── klinikker.json
│   └── offentlige-klinikker.json
├── docs/
│   ├── PRD.md
│   └── master_prompt.md
└── js/
    └── app.js
```

If generating the hero image is not feasible, use a tasteful local placeholder image or a CSS background fallback, but the intended final site should have a real local image asset.

## Coding Standards

General:

- Keep files plain and static.
- No framework-specific syntax.
- No build artifacts.
- No minification required.
- Use readable, maintainable code.

HTML:

- Use semantic elements.
- Keep indentation consistent.
- Use Danish text.
- Include metadata on every page.
- Keep emergency disclaimers visible.
- Do not overstate data completeness.

CSS:

- Use CSS variables.
- Use reusable component classes.
- Keep cards at `8px` radius.
- Avoid one-note palettes.
- Avoid decorative clutter.
- Ensure text fits on mobile.
- Ensure hover/focus states.

JavaScript:

- Wrap in an IIFE.
- Use `"use strict"`.
- Use `DOMContentLoaded`.
- Avoid dependencies.
- Use safe DOM APIs (`textContent`, `createElement`).
- Do not inject JSON as raw HTML.
- Keep missing fields graceful.
- Keep data rendering configurable by page `data-*` attributes.

JSON:

- Top-level arrays only.
- Pretty-print JSON.
- Do not include fabricated clinics.
- Use booleans for known yes/no values.
- Use `null`, empty string, empty array, or omitted fields for unknown values.

## Git Requirements

Initialize Git if this is a new project:

```bash
git init -b main
```

Create `.gitignore`:

```text
.DS_Store
```

Recommended initial commit:

```bash
git add .
git commit -m "Initial static site"
```

Use this GitHub remote for the project when publishing:

```bash
git remote add origin https://github.com/H-Olsen/psykiateroverblik.git
git push -u origin main
```

Do not commit generated temporary files, OS metadata, or local server logs.

## Deployment Requirements

The site must deploy without a build command.

Supported deployment targets:

- GitHub Pages
- Netlify
- Cloudflare Pages
- Any static file host

GitHub Pages:

- Source: deploy from branch.
- Branch: `main`.
- Folder: `/root`.

Netlify:

- Build command: none.
- Publish directory: repository root.

Cloudflare Pages:

- Framework preset: none.
- Build command: none.
- Output directory: `/`.

Before production:

- Replace `https://example.com` in metadata, sitemap, and robots.
- Replace `kontakt@example.com`.
- Replace AdSense placeholder IDs only if ads are actually enabled.
- Add/verify clinic and resource data.
- Confirm crisis guidance and official links.

## Validation Checklist

Before finishing, verify:

- All required files exist.
- `data/klinikker.json` is valid JSON.
- `data/offentlige-klinikker.json` is valid JSON.
- `js/app.js` has valid syntax.
- `sitemap.xml` is valid XML.
- Home page displays overview cards.
- Public table loads empty JSON and shows empty state.
- Private table loads sample clinic and shows one result.
- Search works on private table.
- Boolean filters work.
- Reset filters works.
- `klinikker.html?boernUnge=ja` applies filter and highlights Børn/unge nav.
- Desktop table view is visible on desktop.
- Mobile card view is visible on mobile.
- Crisis page contains direct 112 guidance.
- External links open in new tab with safe rel attributes.
- Navigation works on desktop and mobile.
- No console errors in browser.

## Known Limitations To Preserve Unless Asked Otherwise

- Public data starts empty.
- Private data starts with one sample record only.
- Site owner must manually research and maintain data.
- No admin UI.
- No backend validation.
- No real AdSense publisher ID.
- Placeholder domain remains until deployment domain is known.
- Some resource areas are placeholders for future curated links.

Build the site completely, validate it locally, and leave clear final notes describing what was created and how to preview/deploy it.

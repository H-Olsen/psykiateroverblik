# Product Requirements Document: Psykiater Overblik

Last updated: 2026-07-02

## 1. Product Summary

Psykiater Overblik is a Danish static information website that helps users find their way through psychiatric help options in Denmark. The product separates public and private psychiatry, explains key system concepts, highlights urgent help paths, and provides structured placeholders for curated data about psychiatrists, clinics, and mental health resources.

The site is intentionally static, simple, fast, and trustworthy. It is designed so the site owner can manually research and maintain data in JSON files without needing a backend, database, CMS, or build pipeline.

The current product is not a medical service, booking tool, referral system, or official public authority resource. It is an independent overview and research aid.

## 2. Overall Purpose

The purpose is to give Danish users a calm, organized, and credible first overview of psychiatric help options:

- Search and filter private psychiatrists/private psychiatric clinics.
- Search and filter public psychiatric options once public data is added.
- Distinguish public, private, and children/young people pathways.
- Explain common terms such as referral, ydernummer, treatment guarantee, patient rights, and professional roles.
- Provide clear crisis guidance for users who need help immediately.
- Organize future resource links by life situation or problem context.

The product should reduce confusion, not replace professional judgement.

## 3. Target Users

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

Out-of-scope users:

- Users needing emergency intervention should be directed to 112, psychiatric emergency reception, skadestue, or regional urgent services.
- Users seeking diagnosis, treatment, or individualized medical advice.

## 4. Product Goals

Core goals:

- Make the difference between public and private psychiatry visible immediately.
- Give the user a "Komplet overblik" landing page with clear onward paths.
- Keep data editable through simple JSON files.
- Provide table and mobile-card views for clinic/psychiatrist data.
- Support search and filtering without a backend.
- Keep the interface calm, health-oriented, readable, and trustworthy.
- Make crisis help highly visible and impossible to confuse with ordinary content.
- Prepare for SEO and future AdSense without requiring ads to function.

Non-goals:

- No user accounts.
- No appointments or booking.
- No storage of user health information.
- No backend, database, API, admin panel, or CMS.
- No automatically scraped clinic data.
- No claims that clinic data is complete or medically verified.

## 5. Current Architecture

The project is a static website using:

- HTML files as individual pages.
- One shared CSS file for all styling.
- One shared JavaScript file for navigation behavior and data-driven tables.
- JSON files for public and private data.
- Static SEO files: `robots.txt`, `sitemap.xml`, `ads.txt`.
- Local image asset for the hero background.

There is no bundler, dependency manager, package file, transpilation, build command, or runtime backend.

Runtime model:

1. Browser loads an HTML page.
2. HTML references `css/style.css` and `js/app.js`.
3. On pages with `#clinic-filters`, JavaScript reads the form's `data-*` attributes.
4. JavaScript fetches the configured JSON file.
5. JavaScript populates region/city filters, applies URL query filters if present, renders a desktop table and mobile card list.
6. On every page, JavaScript handles mobile nav open/close and active nav highlighting.

## 6. File Structure

Current intended file structure:

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
│   └── PRD.md
└── js/
    └── app.js
```

Notes:

- `adhd.html`, `autisme.html`, `nyttige-links.html`, and `om-psykiatere.html` are older content pages that still exist. They are not currently primary top-navigation destinations and are not in the current `sitemap.xml`.
- `klinikker.html` is the private psychiatrist/private clinic table page.
- `offentlige-klinikker.html` is the public psychiatrist/public offering table page.
- `data/offentlige-klinikker.json` is intentionally empty until the owner researches and adds data.

## 7. Product Information Architecture

The desired site map follows the "Komplet overblik" structure:

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

## 8. Current Navigation

The top navigation is shared across pages and contains:

- Forside
- Offentlige psykiatere
- Private psykiatere
- Børn/unge
- Information
- Krisehjælp
- Ressourcer
- Om

Navigation behavior:

- Desktop: links are displayed inline in a sticky header.
- Mobile/tablet: hamburger button toggles the nav menu.
- Active nav state is applied by JavaScript using `aria-current="page"`.
- Parent mapping is used for related subpages:
  - `offentlige-psykiatere-info.html` highlights "Offentlige psykiatere".
  - `private-psykiatere-info.html` highlights "Private psykiatere".
  - `kontakt.html` and `privatlivspolitik.html` highlight "Om".
  - `klinikker.html?boernUnge=ja` and `offentlige-klinikker.html?boernUnge=ja` highlight "Børn/unge".

## 9. Page Requirements and Current Page Behavior

### `index.html`: Forside / Komplet overblik

Purpose:

- Introduce the product and route users into the correct pathway.

Current content:

- Hero with title "Find vej i psykiatrisk hjælp".
- CTAs:
  - Offentlige psykiatere
  - Private psykiatere
  - Brug for hjælp NU / i krise
- Overview card grid with seven major product areas:
  - Offentlige psykiatere
  - Private psykiatere
  - Børne/unge psykiatere
  - Information
  - Brug for hjælp NU / i krise
  - Problemstillinger og ressourcer
  - Om
- Disclaimer/independence messaging.

### `offentlige-klinikker.html`: Offentlige psykiatere table

Purpose:

- Data-driven table for public psychiatric offerings/psychiatrists.

Current state:

- Uses `data/offentlige-klinikker.json`.
- Data file is empty by design.
- Shows zero-state message: "Ingen offentlige tilbud matcher filtrene."

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

### `offentlige-psykiatere-info.html`: Public info page

Purpose:

- Explain public psychiatry concepts before using the table.

Sections:

- Henvisningen
- Ydernummer
- CTA to public table
- Disclaimer

### `klinikker.html`: Private psykiatere table

Purpose:

- Data-driven table for private psychiatrists/private psychiatric clinics.

Current data:

- Uses `data/klinikker.json`.
- Contains one example record, Carelink Psykiatri, extended with empty/template-friendly contact fields.

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

### `private-psykiatere-info.html`: Private info page

Purpose:

- Explain private psychiatrist concepts before using the private table.

Sections:

- Selvbetaler
- Forsikringers interne behandlingsnetværk vs. selvbetaler
- CTA to private table
- Disclaimer

### `boern-unge-psykiatere.html`: Children/young people pathway

Purpose:

- Dedicated entry point for public and private child/adolescent psychiatric options.

Current behavior:

- Provides two overview cards:
  - Offentlige tilbud -> `offentlige-klinikker.html?boernUnge=ja`
  - Private tilbud -> `klinikker.html?boernUnge=ja`
- Query filters are applied automatically by JavaScript.

### `information.html`: General information

Purpose:

- Explain common system terms and roles.

Sections:

- Offentlig psykiater/ydernummer
- Behandlingsgaranti
- Egen læge vs. praktiserende psykiater
- Patientrettigheder
- De store hjælpere
  - Psykiatrifonden
  - Livslinien

### `krisehjaelp.html`: Crisis help

Purpose:

- Provide urgent safety guidance separate from ordinary content.

Requirements:

- Use clear crisis messaging.
- Avoid ambiguity: if there is acute danger or suicidal thoughts, call 112 or contact psychiatric emergency care.
- Include 112, 1813, skadestue, psychiatric acute reception, and phone counseling sections.

Current content:

- Crisis hero.
- Red-toned crisis box.
- 112, 1813 and skadestue section.
- Telefonrådgivninger section with resource cards.

### `problemstillinger.html`: Resources by problem situation

Purpose:

- Organize future helpful links/resources by user situation.

Current cards:

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

Current state:

- Mostly placeholder copy.
- Intended for owner-curated resources later.

### `om-os.html`: About

Purpose:

- Explain motivation, independence, data limitations, disclaimer, and contact route.

Sections:

- Motivation
- Uafhængighed
- Data can change
- Disclaimer
- Kontakt

### `kontakt.html`: Contact

Purpose:

- Provide placeholder contact method.
- Explain how clinics can suggest corrections.

Current email:

- `kontakt@example.com`

### `privatlivspolitik.html`: Privacy policy

Purpose:

- Explain that the site does not collect sensitive health information.
- Mention possible future third-party ads.

### Legacy/support pages

The following pages exist but are not primary navigation destinations:

- `adhd.html`
- `autisme.html`
- `om-psykiatere.html`
- `nyttige-links.html`

They can either be reintegrated into the information/resource architecture or retired in a future cleanup.

## 10. Implemented Features

Product features:

- Static Danish health-information website.
- Landing page with full overview navigation.
- Separate public and private psychiatry pathways.
- Separate children/young people entry point.
- Dedicated crisis help page.
- General educational information pages.
- Resource placeholder page grouped by user situation.
- Contact, privacy, about, SEO, and AdSense preparation.

Data/table features:

- JSON-driven private table.
- JSON-driven public table.
- Desktop table view.
- Mobile card view.
- Free-text search.
- Region and city dropdown filters generated from data.
- Boolean filters with Ja/Nej/Alle semantics.
- Reset filters button.
- Result counter.
- Query parameter pre-filtering.
- Graceful empty state.
- Graceful missing field display.
- External links open in new tab with `rel="noopener noreferrer"`.

Navigation features:

- Sticky header.
- Mobile hamburger menu.
- Automatic active nav state.
- Parent active state for subpages.

SEO/monetization features:

- Unique titles and meta descriptions on pages.
- Open Graph tags.
- Canonical links.
- `robots.txt`.
- `sitemap.xml`.
- `ads.txt`.
- Commented AdSense script placeholder.
- Commented ad slot placeholders.

## 11. Data Model

All data is stored in JSON arrays.

### Private data: `data/klinikker.json`

Each private record should follow this shape:

```json
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
```

Private field semantics:

- `navn`: Clinic or psychiatrist name. Required for meaningful display.
- `afdelinger`: Department/branch info. Empty string allowed.
- `laeger`: Array of associated doctors. Empty array or missing value allowed.
- `region`: Danish region name.
- `by`: City.
- `byPostnr`: Combined city/postcode display value for the private table.
- `adresse`: Address.
- `telefon`: Phone number. Empty string allowed.
- `email`: Contact email. Empty string allowed.
- `hjemmeside`: Website URL.
- `priser`: Price/payment URL.
- `nationaltOptag`: Boolean or null/undefined.
- `tagerPatienterOnline`: Boolean alias for online/national intake. Used in the private table when present.
- `selvbetaler`: Boolean or null/undefined.
- `tagerIkkeEgenbetalere`: Boolean inverse of `selvbetaler`. Used in the private table when present.
- `adhd`: Boolean or null/undefined.
- `autisme`: Boolean or null/undefined.
- `boernUnge`: Boolean or null/undefined.

### Public data: `data/offentlige-klinikker.json`

Current file:

```json
[]
```

Expected public record shape:

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

Public field semantics:

- `navn`: Public offering/clinic/department name.
- `type`: Ambulatorium, akutmodtagelse, regionalt tilbud, etc.
- `region`: Danish region.
- `by`: City or area.
- `adresse`: Address or service area.
- `hjemmeside`: Official URL.
- `akutmodtagelse`: Boolean or null/undefined.
- `henvisning`: Boolean or null/undefined.
- `voksne`: Boolean or null/undefined.
- `boernUnge`: Boolean or null/undefined.
- `adhd`: Boolean or null/undefined.
- `autisme`: Boolean or null/undefined.
- `noter`: Short editorial note.

Boolean rendering:

- `true` -> "Ja"
- `false` -> "Nej"
- `null`, missing, empty -> "Ikke oplyst"

## 12. Search and Filter Functionality

Search/filter behavior is implemented in `js/app.js`.

### Initialization

Any page with a form `id="clinic-filters"` becomes a data-driven listing page.

The form must define:

- `data-source`: JSON path.
- `data-kind`: `private` or `public`.
- `data-singular`: singular result label.
- `data-plural`: plural result label.
- `data-empty`: empty state message.

### Data loading

- Uses `fetch(source, { cache: "no-store" })`.
- Validates that fetched JSON is an array.
- Falls back to a built-in private sample if private JSON cannot be fetched.
- Falls back to an empty public array if public JSON cannot be fetched.

### Search

Search is case-insensitive and Danish-locale lowercased.

Private searchable fields:

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

Public searchable fields are the same where applicable.

### Dropdown filters

Region and city/private by-postcode options are generated dynamically from the loaded data.

### Boolean filters

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

Filter semantics:

- Empty value means all records.
- `ja` means record value must be `true`.
- `nej` means record value must be `false`.
- Unknown/null values do not match `ja` or `nej`.

### Query parameters

URL query parameters are applied to matching form controls.

Example:

```text
klinikker.html?boernUnge=ja
offentlige-klinikker.html?boernUnge=ja
```

This supports deep links from the children/young people page.

## 13. UI Design Philosophy

The UI should feel:

- Calm.
- Health-oriented.
- Trustworthy.
- Practical.
- Easy to scan.
- Non-commercial even though ad placeholders exist.
- Suitable for users who may be stressed, tired, or looking for help on behalf of someone else.

Design principles:

- Put action paths before long explanations.
- Separate public/private choices visibly.
- Keep crisis help visually distinct.
- Use restrained cards for repeated choices/resources.
- Do not overwhelm users with decorative effects.
- Avoid making medical claims.
- Make disclaimers visible but not alarmist.
- Maintain strong readability and plain Danish.

## 14. Design System

### Color Palette

Defined in `:root` in `css/style.css`.

Core colors:

- `--bg: #f6fbfa` - very light green-tinted background.
- `--surface: #ffffff` - cards and panels.
- `--surface-soft: #e9f6f3` - active nav and soft highlights.
- `--ink: #163238` - primary text.
- `--muted: #5c7378` - secondary text.
- `--line: #d8e6e4` - borders.
- `--blue: #1d6f95` - brand gradient and accents.
- `--blue-dark: #14506d` - link/strong blue.
- `--green: #2d8c7f` - primary CTA.
- `--green-dark: #1f6f66` - CTA hover/accent.
- `--danger: #8b2635` - crisis/danger text.
- `--danger-soft: #fdecee` - crisis/danger background.

Usage:

- Blue/green colors carry the health/trust identity.
- White surfaces keep content legible.
- Red/danger colors are reserved for crisis/urgent contexts.

### Typography

Current type stack:

```css
font-family: Arial, Helvetica, sans-serif;
```

Text principles:

- Base font size: `16px`.
- Body line-height: `1.6`.
- No negative letter spacing.
- H1 uses responsive `clamp` sizing.
- Compact UI elements use smaller headings than hero content.
- Text must remain readable on mobile.

### Spacing and Layout

- Max content width: `1180px`.
- Standard container width: `min(100% - 32px, 1180px)`.
- Narrow article width: `min(100% - 32px, 820px)`.
- Section vertical padding: `64px`, reduced on mobile.
- Card radius: `8px`.
- Shadow: `0 18px 45px rgba(20, 80, 109, 0.12)`.

### Components

Primary reusable components:

- Sticky header.
- Brand mark.
- Primary navigation.
- Mobile nav toggle.
- Hero section.
- Page hero.
- Buttons:
  - `.button-primary`
  - `.button-secondary`
  - `.button-urgent`
- Overview cards.
- Feature cards.
- Resource cards.
- Clinic table.
- Mobile clinic cards.
- Badge pills:
  - `.badge.yes`
  - `.badge.no`
  - `.badge.unknown`
- Filter form.
- Result bar.
- Crisis box.
- Disclaimer box.
- Anchor nav.
- Footer.

## 15. Accessibility Requirements

Current accessibility features:

- Semantic HTML structure with `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`.
- Skip link: "Spring til indhold".
- Mobile nav button includes `aria-expanded` and `aria-controls`.
- Primary navigation has `aria-label`.
- Active navigation uses `aria-current="page"`.
- Result counter uses `aria-live="polite"`.
- Filter form has `aria-label`.
- Tables use `thead`, `tbody`, and `th`.
- External links include `rel="noopener noreferrer"`.
- Form labels are explicitly connected to inputs/selects.
- Focus states are visible.
- Color contrast is generally strong on light backgrounds.

Accessibility improvements to consider:

- Add a proper favicon and optional apple-touch icon.
- Consider table captions for public/private data tables.
- Add visible helper text for what "Ikke oplyst" means.
- Add `aria-label` or context to repeated "Hjemmeside" links if multiple rows exist.
- Improve keyboard focus management when mobile nav opens/closes.
- Add a "last updated" field per clinic/resource for data trust.

## 16. Mobile Responsiveness

Responsive behavior:

- At widths below `980px`, primary nav collapses into a hamburger menu.
- At widths below `760px`:
  - Tables are hidden.
  - Mobile card views are shown.
  - Filters become one column.
  - Overview/resource grids become one column.
  - Buttons stack vertically.
  - Footer becomes one column.
- At widths below `480px`, brand text wraps and buttons are full width.

Key product requirement:

Mobile users must be able to search and filter clinics without horizontal table scrolling. The mobile card view is the primary mobile listing experience.

## 17. SEO Strategy

Current SEO implementation:

- Unique `<title>` tags.
- Unique meta descriptions.
- Open Graph tags.
- Canonical links using placeholder domain `https://example.com`.
- `robots.txt` allows crawling and references sitemap.
- `sitemap.xml` contains current primary pages.
- Semantic heading structure with one primary H1 per page.
- Static HTML pages are crawlable without JavaScript for core content pages.

Current sitemap pages:

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

SEO requirements before production:

- Replace `https://example.com` with real production domain everywhere:
  - canonical links
  - OG URLs
  - OG images
  - sitemap
  - robots sitemap URL
- Decide whether legacy pages should be indexed or removed.
- Add real `lastmod` values if maintaining SEO seriously.
- Add structured data only if accurate and maintainable.
- Avoid medical claims that cannot be sourced.

## 18. Monetization and AdSense

Current AdSense preparation:

- Commented Google AdSense script placeholder in each HTML head.
- Placeholder publisher ID: `ca-pub-XXXXXXXXXXXXXXXX`.
- `ads.txt`:

```text
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

Current requirement:

- Site must function fully without ads.
- Ad blocks must stay commented until real publisher ID and policy review are ready.
- Ads should never interrupt crisis help or make crisis content feel commercial.

## 19. Technologies Used

Runtime technologies:

- HTML5
- CSS3
- Vanilla JavaScript
- JSON

Development/runtime assumptions:

- No backend.
- No framework.
- No package manager.
- No build process.
- No dependencies.
- Can be served by any static host.

Suggested local preview:

```bash
cd /Users/hogni/Documents/PsykListen
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## 20. Git Workflow

Current Git state:

- Local branch: `main`
- Remote: `origin`
- Remote URL: `https://github.com/H-Olsen/psykiateroverblik.git`
- Initial commit: `9064625 Initial static site`
- `.gitignore` excludes `.DS_Store`

Recommended workflow:

1. Make website edits locally.
2. Validate HTML behavior, JSON, JS, and sitemap.
3. Review changed files:

   ```bash
   git status
   git diff
   ```

4. Stage files:

   ```bash
   git add .
   ```

5. Commit with a product-oriented message:

   ```bash
   git commit -m "Add public psychiatry info page"
   ```

6. Push:

   ```bash
   git push
   ```

Commit naming guidance:

- Use imperative or concise descriptive messages.
- Examples:
  - `Add crisis help page`
  - `Update private clinic filters`
  - `Add public clinic data`
  - `Refresh sitemap`

## 21. Deployment

The site can be deployed to:

- GitHub Pages
- Netlify
- Cloudflare Pages
- Any static file server

No build command is required.

GitHub Pages setup:

1. Push repo to GitHub.
2. Go to repository settings.
3. Open Pages settings.
4. Source: deploy from branch.
5. Branch: `main`.
6. Folder: `/root`.
7. Save.

Netlify setup:

- Connect GitHub repo.
- Build command: none.
- Publish directory: repository root.

Cloudflare Pages setup:

- Connect GitHub repo.
- Framework preset: none.
- Build command: none.
- Output directory: `/`.

Production checklist:

- Replace placeholder domain.
- Replace placeholder email.
- Replace placeholder AdSense ID or keep ads disabled.
- Add real public/private data only after manual verification.
- Confirm all external links are correct.
- Confirm crisis wording remains prominent.

## 22. Coding Conventions

HTML:

- Use semantic elements.
- One H1 per page.
- Keep Danish UI copy.
- Include unique title and meta description per page.
- Include OG and canonical tags.
- Keep AdSense code commented until real activation.
- External links should use `target="_blank"` and `rel="noopener noreferrer"`.

CSS:

- Use CSS custom properties from `:root`.
- Keep card radius at `8px`.
- Prefer reusable component classes.
- Maintain responsive constraints.
- Avoid decorative clutter.
- Keep colors aligned with health/trust palette.
- Do not introduce frameworks.

JavaScript:

- Vanilla JavaScript only.
- Use `DOMContentLoaded`.
- Keep functions small and readable.
- Handle missing fields gracefully.
- Avoid dependencies.
- Use data attributes to configure table pages.
- Use `textContent` and DOM creation for dynamic content.
- Do not inject raw HTML from JSON.

JSON:

- Arrays only at top level.
- Use explicit booleans where known.
- Use `null`, empty string, empty array, or omit fields for unknown values.
- Do not invent clinic claims.
- Prefer official URLs.

## 23. Content Guidelines

Tone:

- Danish.
- Calm.
- Clear.
- Non-alarmist except crisis page, where urgent guidance must be direct.
- No false certainty.
- No diagnosis or treatment advice.

Medical safety:

- Always state that content is general information.
- Encourage checking official sources and clinic websites.
- For acute danger or suicidal thoughts, direct to 112 or psychiatric emergency help.
- Do not claim that a clinic treats ADHD/autism/children unless verified.
- Use "oplyst", "kan", "bør tjekkes" when describing uncertain data.

Data editorial rules:

- Do not add fabricated clinics.
- Do not infer services from vague website copy.
- Prefer official source links.
- Keep notes factual and short.
- Consider adding date of verification in future.

## 24. Known Limitations

Product/data limitations:

- Public data file is empty.
- Private data has only one example record.
- Site owner must manually research and maintain all clinic/resource data.
- No automatic validation of URLs or stale data.
- No date-of-last-verification field yet.
- No admin UI for editing data.
- No full resource link database yet.

Technical limitations:

- Static site only; no backend.
- JSON fetch may not work under some direct `file://` browser contexts; local HTTP server is preferred.
- Fallback private sample exists in JS if JSON cannot be loaded.
- No formal automated test suite.
- No HTML linter in the repo.
- No deployment config file.
- No generated favicon beyond a blank data favicon.

Content/IA limitations:

- Legacy pages (`adhd.html`, `autisme.html`, `nyttige-links.html`, `om-psykiatere.html`) still exist but are not part of the main navigation/sitemap.
- Some resource pages contain placeholders instead of curated links.
- Some crisis-region details are generic and should be region-specific later.
- `1813` is region-specific and should be explained carefully in production copy.

SEO limitations:

- Placeholder domain `https://example.com` remains.
- Placeholder AdSense publisher ID remains.
- Sitemap dates are static.
- OG image is generic.

Accessibility limitations:

- Repeated table links may need more descriptive accessible labels when data grows.
- Table captions could be added.
- Mobile menu focus trapping/return behavior could be improved.

## 25. Future Roadmap

### Phase 1: Data Completion

- Fill `data/offentlige-klinikker.json`.
- Expand `data/klinikker.json`.
- Add official source URLs and verification notes.
- Add optional `sidstKontrolleret` field.
- Add optional `forsikringNote` or `forsikring` fields for private data.

### Phase 2: Resource Expansion

- Replace placeholder text in `problemstillinger.html` with curated links.
- Add full resource list.
- Add regional crisis links.
- Add parent/student/work/pårørende-specific resources.

### Phase 3: Content Cleanup

- Decide whether to keep, merge, or remove:
  - `adhd.html`
  - `autisme.html`
  - `nyttige-links.html`
  - `om-psykiatere.html`
- If kept, add them to navigation/sitemap under Information or Ressourcer.

### Phase 4: Trust and Maintenance

- Add "last updated" date to site pages and data records.
- Add data methodology page.
- Add correction form flow or structured email template.
- Add source/reference fields per clinic.

### Phase 5: UX Improvements

- Add sorting for tables.
- Add "show only records with price link" filter.
- Add region landing sections.
- Add quick filter chips for common paths.
- Add print-friendly CSS for selected pages.

### Phase 6: SEO and Launch

- Replace placeholder domain.
- Add real favicon.
- Add social preview image.
- Submit sitemap.
- Configure GitHub Pages/Netlify/Cloudflare Pages.
- Decide whether to enable AdSense.

## 26. Acceptance Criteria for Rebuild

A rebuilt version is acceptable when:

- It is fully static and runs without backend services.
- It has the same primary navigation structure.
- It has separate public and private table pages.
- It uses JSON files for clinic/psychiatrist data.
- It supports search, region/city filters, boolean filters, reset, and result count.
- It shows desktop tables and mobile cards.
- It has a clear crisis page with 112 guidance.
- It includes information, children/young people, resources, about, contact, and privacy pages.
- It has a calm blue/green healthcare visual style.
- It has responsive layouts for mobile and desktop.
- It includes SEO metadata, sitemap, robots, and AdSense placeholders.
- It avoids false medical claims.
- It handles missing fields gracefully.
- It can be deployed to GitHub Pages, Netlify, or Cloudflare Pages without a build step.

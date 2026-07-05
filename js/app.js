(function () {
  "use strict";

  var fallbackPrivateClinics = [
    {
      navn: "Carelink Psykiatri",
      afdelinger: "",
      laeger: ["Annamaria Molnar", "Laura Aakjær Jensen", "Bettina Lodskou Pedersen"],
      region: "Sjælland",
      by: "Kongens Lyngby",
      byPostnr: "2800 Kongens Lyngby",
      adresse: "Klampenborgvej 248, 1. sal. mf",
      telefon: "",
      email: "",
      hjemmeside: "https://mensana.dk/",
      priser: "https://mensana.dk/priser-betaling/",
      nationaltOptag: true,
      tagerPatienterOnline: true,
      selvbetaler: true,
      tagerIkkeEgenbetalere: false,
      adhd: false,
      autisme: false,
      boernUnge: false
    }
  ];

  var fallbackPublicClinics = [];

  var psychiatristsData = [];

  var booleanFilters = [
    "selvbetaler",
    "tagerIkkeEgenbetalere",
    "nationaltOptag",
    "tagerPatienterOnline",
    "adhd",
    "autisme",
    "boernUnge",
    "akutmodtagelse",
    "henvisning",
    "voksne"
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initNavigation();
    initPrivatePsychiatristsTable();
    initRegionResourcesTable();
    initClinicOverview();
  });

  function initNavigation() {
    var button = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-navigation");

    if (!button || !nav) {
      return;
    }

    button.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        nav.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      }
    });

    markCurrentNavigation(nav);
  }

  function markCurrentNavigation(nav) {
    var currentPath = window.location.pathname.split("/").pop() || "index.html";
    var parentPathMap = {
      "offentlige-klinikker.html": "voksen.html",
      "offentlige-psykiatere-info.html": "voksen.html",
      "klinikker.html": "voksen.html",
      "private-psykiatere-info.html": "voksen.html",
      "ressourcer-region-hovedstaden.html": "problemstillinger.html",
      "ressourcer-region-sjaelland.html": "problemstillinger.html",
      "ressourcer-region-syddanmark.html": "problemstillinger.html",
      "ressourcer-region-midtjylland.html": "problemstillinger.html",
      "ressourcer-region-nordjylland.html": "problemstillinger.html",
      "kontakt.html": "om-os.html",
      "privatlivspolitik.html": "om-os.html"
    };
    var activePath = parentPathMap[currentPath] || currentPath;

    if (
      new URLSearchParams(window.location.search).get("boernUnge") === "ja" &&
      (currentPath === "klinikker.html" || currentPath === "offentlige-klinikker.html")
    ) {
      activePath = "boern-unge-psykiatere.html";
    }

    Array.prototype.forEach.call(nav.querySelectorAll("a[href]"), function (link) {
      if (link.getAttribute("href") === activePath) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function initClinicOverview() {
    var filters = document.getElementById("clinic-filters");
    var tableBody = document.getElementById("clinic-table-body");
    var cardList = document.getElementById("clinic-card-list");
    var resultCount = document.getElementById("result-count");
    var resetButton = document.getElementById("reset-filters");

    if (!filters || !tableBody || !cardList || !resultCount || !resetButton) {
      return;
    }

    var clinics = [];
    var source = filters.getAttribute("data-source") || "data/klinikker.json";
    var kind = filters.getAttribute("data-kind") || "private";
    var singular = filters.getAttribute("data-singular") || "klinik";
    var plural = filters.getAttribute("data-plural") || "klinikker";
    var emptyText = filters.getAttribute("data-empty") || "Ingen klinikker matcher filtrene.";

    loadClinics(source, kind).then(function (loadedClinics) {
      clinics = loadedClinics;
      populateSelect(document.getElementById("region"), uniqueValues(clinics, "region"), "Alle regioner");
      populateSelect(
        document.getElementById("city"),
        uniqueCityValues(clinics, kind),
        kind === "private" ? "Alle byer/postnumre" : "Alle byer"
      );
      applyQueryFilters(filters);
      render();
    });

    filters.addEventListener("input", render);
    filters.addEventListener("change", render);

    resetButton.addEventListener("click", function () {
      filters.reset();
      render();
      document.getElementById("search").focus();
    });

    function render() {
      var filteredClinics = filterClinics(clinics, filters);
      resultCount.textContent = "Viser " + filteredClinics.length + " " + (filteredClinics.length === 1 ? singular : plural);
      renderTable(filteredClinics, tableBody, kind, emptyText);
      renderCards(filteredClinics, cardList, kind, emptyText);
    }
  }

  function initPrivatePsychiatristsTable() {
    var table = document.getElementById("private-psychiatrists-table");
    var tableBody = document.getElementById("private-psychiatrists-body");
    var resultCount = document.getElementById("private-result-count");

    if (!table || !tableBody || !resultCount) {
      return;
    }

    var source = table.getAttribute("data-source") || "Tabel - Private Psykiatere - Sheet1.csv";
    var sortState = {
      key: "",
      direction: "asc",
      type: "text"
    };

    bindPrivateSortButtons(table, tableBody, resultCount, sortState);

    loadPrivatePsychiatrists(source)
      .then(function (rows) {
        psychiatristsData = rows;
        renderPrivatePsychiatrists(psychiatristsData, tableBody, resultCount, sortState);
      })
      .catch(function () {
        psychiatristsData = [];
        renderPrivatePsychiatrists(psychiatristsData, tableBody, resultCount, sortState);
      });
  }

  function bindPrivateSortButtons(table, tableBody, resultCount, sortState) {
    Array.prototype.forEach.call(table.querySelectorAll("button[data-sort-key]"), function (button) {
      button.addEventListener("click", function () {
        var key = button.getAttribute("data-sort-key") || "";
        var type = button.getAttribute("data-sort-type") || "text";

        if (sortState.key === key) {
          sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
        } else {
          sortState.key = key;
          sortState.direction = "asc";
        }

        sortState.type = type;
        renderPrivatePsychiatrists(psychiatristsData, tableBody, resultCount, sortState);
        updatePrivateSortIndicators(table, sortState);
      });
    });
  }

  function loadPrivatePsychiatrists(source) {
    return fetch(source, { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Kunne ikke hente CSV-filen.");
        }

        return response.text();
      })
      .then(function (text) {
        return parsePrivatePsychiatristsCsv(text);
      });
  }

  function parsePrivatePsychiatristsCsv(text) {
    var rows = parseCsvRows(text);
    var headerIndex = rows.findIndex(function (row) {
      return row.some(function (cell) {
        return normalizeHeader(cell) === "kliniknavn" || normalizeHeader(cell) === "name";
      });
    });

    if (headerIndex === -1) {
      return [];
    }

    var headers = rows[headerIndex].map(normalizeHeader);

    return rows.slice(headerIndex + 1)
      .map(function (row) {
        return mapPrivatePsychiatristRow(row, headers);
      })
      .filter(function (row) {
        return hasValue(row.name) || hasValue(row.website);
      });
  }

  function parseCsvRows(text) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;

    for (var index = 0; index < text.length; index += 1) {
      var character = text[index];
      var nextCharacter = text[index + 1];

      if (character === '"') {
        if (inQuotes && nextCharacter === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (character === "," && !inQuotes) {
        row.push(field);
        field = "";
      } else if ((character === "\n" || character === "\r") && !inQuotes) {
        if (character === "\r" && nextCharacter === "\n") {
          index += 1;
        }

        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += character;
      }
    }

    row.push(field);
    rows.push(row);

    return rows;
  }

  function mapPrivatePsychiatristRow(row, headers) {
    var inverseSelfPayerValue = getCsvValue(row, headers, [
      "hvorvidt de ikke tager imod egenbetalere",
      "tager ikke egenbetalere"
    ]);
    var directSelfPayerValue = getCsvValue(row, headers, [
      "selvbetaler accepteres",
      "acceptsSelfPayers",
      "selvbetaler"
    ]);

    return {
      name: getCsvValue(row, headers, ["kliniknavn", "klinikkens navn", "navn", "name"]),
      doctors: getCsvValue(row, headers, ["tilknyttede læger", "læger", "laeger", "doctors"]),
      region: getCsvValue(row, headers, ["region"]),
      city: getCsvValue(row, headers, ["by", "city"]),
      postalCode: getCsvValue(row, headers, ["postnr", "postnummer", "postalCode"]),
      address: getCsvValue(row, headers, ["adresse", "adresse på hver afdeling", "address"]),
      phone: getCsvValue(row, headers, ["tlf", "telefon", "phone"]),
      email: getCsvValue(row, headers, ["email", "mail", "mail/skriftlig kontakt"]),
      website: getCsvValue(row, headers, ["hjemmeside", "website"]),
      priceLink: getCsvValue(row, headers, ["link til priser", "priser", "prislink", "priceLink"]),
      acceptsSelfPayers: directSelfPayerValue ? normalizeStatus(directSelfPayerValue) : invertSelfPayerStatus(inverseSelfPayerValue),
      onlineNational: normalizeStatus(getCsvValue(row, headers, [
        "online/nationalt optag",
        "tager patienter online",
        "onlineNational"
      ])),
      notes: getCsvValue(row, headers, ["noter", "noget du evt. vil fremhæve", "notes"])
    };
  }

  function getCsvValue(row, headers, aliases) {
    for (var index = 0; index < aliases.length; index += 1) {
      var headerIndex = headers.indexOf(normalizeHeader(aliases[index]));

      if (headerIndex !== -1) {
        return cleanText(row[headerIndex], "");
      }
    }

    return "";
  }

  function renderPrivatePsychiatrists(rows, tableBody, resultCount, sortState) {
    var displayRows = sortPrivatePsychiatrists(rows, sortState);

    tableBody.replaceChildren();
    resultCount.textContent = "Viser " + displayRows.length + " private psykiatere";

    if (!displayRows.length) {
      var emptyRow = document.createElement("tr");
      var emptyCell = document.createElement("td");
      emptyCell.colSpan = 13;
      emptyCell.className = "empty-state";
      emptyCell.textContent = "Ingen private psykiatere er registreret endnu. Udfyld CSV-filen for at vise rækker her.";
      emptyRow.appendChild(emptyCell);
      tableBody.appendChild(emptyRow);
      return;
    }

    displayRows.forEach(function (psychiatrist) {
      var row = document.createElement("tr");

      appendPrivateTextCell(row, psychiatrist.name);
      appendPrivateTextCell(row, psychiatrist.doctors);
      appendPrivateTextCell(row, psychiatrist.region);
      appendPrivateTextCell(row, psychiatrist.city);
      appendPrivateTextCell(row, psychiatrist.postalCode);
      appendPrivateTextCell(row, psychiatrist.address);
      appendPrivatePhoneCell(row, psychiatrist.phone);
      appendPrivateEmailCell(row, psychiatrist.email);
      appendPrivateLinkCell(row, psychiatrist.website, "Hjemmeside");
      appendPrivateLinkCell(row, psychiatrist.priceLink, "Priser");
      appendPrivateStatusCell(row, psychiatrist.acceptsSelfPayers);
      appendPrivateStatusCell(row, psychiatrist.onlineNational);
      appendPrivateTextCell(row, psychiatrist.notes);

      tableBody.appendChild(row);
    });
  }

  function sortPrivatePsychiatrists(rows, sortState) {
    if (!sortState.key) {
      return rows.slice();
    }

    return rows.slice().sort(function (first, second) {
      var result = comparePrivateValues(
        first[sortState.key],
        second[sortState.key],
        sortState.type
      );

      return sortState.direction === "asc" ? result : result * -1;
    });
  }

  function comparePrivateValues(firstValue, secondValue, type) {
    var firstMissing = !hasValue(firstValue);
    var secondMissing = !hasValue(secondValue);

    if (firstMissing && secondMissing) {
      return 0;
    }

    if (firstMissing) {
      return 1;
    }

    if (secondMissing) {
      return -1;
    }

    if (type === "number") {
      return numberValue(firstValue) - numberValue(secondValue);
    }

    if (type === "status") {
      return statusValue(firstValue) - statusValue(secondValue);
    }

    return String(firstValue).trim().localeCompare(String(secondValue).trim(), "da", {
      numeric: true,
      sensitivity: "base"
    });
  }

  function updatePrivateSortIndicators(table, sortState) {
    Array.prototype.forEach.call(table.querySelectorAll("th"), function (heading) {
      var button = heading.querySelector("button[data-sort-key]");
      var indicator = heading.querySelector(".sort-indicator");

      if (!button || !indicator) {
        return;
      }

      if (button.getAttribute("data-sort-key") === sortState.key) {
        var isAscending = sortState.direction === "asc";
        indicator.textContent = isAscending ? "↑" : "↓";
        heading.setAttribute("aria-sort", isAscending ? "ascending" : "descending");
      } else {
        indicator.textContent = "";
        heading.removeAttribute("aria-sort");
      }
    });
  }

  function appendPrivateTextCell(row, value) {
    var cell = document.createElement("td");
    cell.textContent = displayText(value);
    row.appendChild(cell);
  }

  function appendPrivatePhoneCell(row, value) {
    var cell = document.createElement("td");
    cell.appendChild(createPrivatePhoneLink(value));
    row.appendChild(cell);
  }

  function appendPrivateEmailCell(row, value) {
    var cell = document.createElement("td");
    cell.appendChild(createPrivateEmailLink(value));
    row.appendChild(cell);
  }

  function appendPrivateLinkCell(row, value, label) {
    var cell = document.createElement("td");
    cell.appendChild(createPrivateLinkList(value, label));
    row.appendChild(cell);
  }

  function appendPrivateStatusCell(row, value) {
    var cell = document.createElement("td");
    cell.appendChild(createPrivateStatusBadge(value));
    row.appendChild(cell);
  }

  function createPrivatePhoneLink(value) {
    if (!hasValue(value)) {
      return document.createTextNode("Ukendt");
    }

    var phone = String(value).trim();
    var link = document.createElement("a");
    link.href = "tel:" + phone.replace(/[^\d+]/g, "");
    link.textContent = phone;
    return link;
  }

  function createPrivateEmailLink(value) {
    if (!hasValue(value)) {
      return document.createTextNode("Ukendt");
    }

    var emailText = String(value).trim();
    var email = findEmail(emailText);

    if (!email) {
      return document.createTextNode(emailText);
    }

    var link = document.createElement("a");
    link.href = "mailto:" + email;
    link.textContent = emailText;
    return link;
  }

  function createPrivateLinkList(value, label) {
    if (!hasValue(value)) {
      return document.createTextNode("Ukendt");
    }

    var fragment = document.createDocumentFragment();
    var parts = String(value).split(";").map(function (part) {
      return part.trim();
    }).filter(Boolean);

    parts.forEach(function (part, index) {
      if (index > 0) {
        fragment.appendChild(document.createTextNode("; "));
      }

      if (isUrl(part)) {
        var link = document.createElement("a");
        link.href = part;
        link.textContent = readableLinkText(part, label, parts.length, index);
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        fragment.appendChild(link);
      } else {
        fragment.appendChild(document.createTextNode(part));
      }
    });

    return fragment;
  }

  function createPrivateStatusBadge(value) {
    var status = normalizeStatus(value);
    var badge = document.createElement("span");
    badge.className = "badge";

    if (status === "Ja") {
      badge.classList.add("yes");
    } else if (status === "Nej") {
      badge.classList.add("no");
    } else {
      badge.classList.add("unknown");
    }

    badge.textContent = status;
    return badge;
  }

  function invertSelfPayerStatus(value) {
    var status = normalizeStatus(value);

    if (status === "Ja") {
      return "Nej";
    }

    if (status === "Nej") {
      return "Ja";
    }

    return "Ukendt";
  }

  function normalizeStatus(value) {
    var normalized = normalize(value);

    if (!normalized || normalized === "ukendt" || normalized === "uklart" || normalized === "manuel kontrol") {
      return "Ukendt";
    }

    if (normalized === "ja" || normalized === "yes" || normalized === "true") {
      return "Ja";
    }

    if (normalized === "nej" || normalized === "no" || normalized === "false") {
      return "Nej";
    }

    return "Ukendt";
  }

  function statusValue(value) {
    var status = normalizeStatus(value);

    if (status === "Ja") {
      return 1;
    }

    if (status === "Nej") {
      return 2;
    }

    return 3;
  }

  function numberValue(value) {
    var match = String(value).match(/\d+/);

    if (!match) {
      return Number.MAX_SAFE_INTEGER;
    }

    return Number(match[0]);
  }

  function displayText(value) {
    return hasValue(value) ? String(value).trim() : "Ukendt";
  }

  function readableLinkText(url, label, total, index) {
    if (total > 1) {
      return label + " " + (index + 1);
    }

    return String(url)
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .replace(/\/$/, "");
  }

  function isUrl(value) {
    return /^https?:\/\//i.test(String(value).trim());
  }

  function findEmail(value) {
    var match = String(value).match(/[^\s;,@]+@[^\s;,@]+\.[^\s;,@]+/);
    return match ? match[0] : "";
  }

  function normalizeHeader(value) {
    return String(value || "")
      .replace(/^\uFEFF/, "")
      .trim()
      .toLocaleLowerCase("da-DK");
  }

  function initRegionResourcesTable() {
    var table = document.getElementById("region-resource-table");
    var tableBody = document.getElementById("region-resource-body");
    var resultCount = document.getElementById("region-result-count");
    var searchInput = document.getElementById("region-resource-search");
    var problemFilter = document.getElementById("region-problem-filter");

    if (!table || !tableBody || !resultCount || !searchInput || !problemFilter) {
      return;
    }

    var source = table.getAttribute("data-source") || "";
    var regionName = table.getAttribute("data-region") || "regionen";
    var resources = [];
    var sortState = {
      key: "",
      direction: "asc",
      type: "text"
    };

    bindRegionSortButtons(table, function () {
      renderRegionResources(resources, tableBody, resultCount, searchInput, problemFilter, sortState, regionName);
      updateRegionSortIndicators(table, sortState);
    }, sortState);

    searchInput.addEventListener("input", function () {
      renderRegionResources(resources, tableBody, resultCount, searchInput, problemFilter, sortState, regionName);
    });

    problemFilter.addEventListener("change", function () {
      renderRegionResources(resources, tableBody, resultCount, searchInput, problemFilter, sortState, regionName);
    });

    loadRegionResources(source)
      .then(function (loadedResources) {
        resources = loadedResources;
        populateSelect(problemFilter, uniqueValues(resources, "problemstilling"), "Alle problemstillinger");
        renderRegionResources(resources, tableBody, resultCount, searchInput, problemFilter, sortState, regionName);
      })
      .catch(function () {
        resources = [];
        renderRegionResources(resources, tableBody, resultCount, searchInput, problemFilter, sortState, regionName);
      });
  }

  function loadRegionResources(source) {
    return fetch(source, { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Kunne ikke hente regionsdata.");
        }

        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) {
          throw new Error("Regionsdata skal være et array.");
        }

        return data;
      });
  }

  function bindRegionSortButtons(table, renderCallback, sortState) {
    Array.prototype.forEach.call(table.querySelectorAll("button[data-region-sort-key]"), function (button) {
      button.addEventListener("click", function () {
        var key = button.getAttribute("data-region-sort-key") || "";
        var type = button.getAttribute("data-sort-type") || "text";

        if (sortState.key === key) {
          sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
        } else {
          sortState.key = key;
          sortState.direction = "asc";
        }

        sortState.type = type;
        renderCallback();
      });
    });
  }

  function renderRegionResources(resources, tableBody, resultCount, searchInput, problemFilter, sortState, regionName) {
    var filteredResources = filterRegionResources(resources, searchInput.value, problemFilter.value);
    var displayResources = sortRegionResources(filteredResources, sortState);

    tableBody.replaceChildren();
    resultCount.textContent = "Viser " + displayResources.length + " tilbud i " + regionName;

    if (!displayResources.length) {
      var emptyRow = document.createElement("tr");
      var emptyCell = document.createElement("td");
      emptyCell.colSpan = 6;
      emptyCell.className = "empty-state";
      emptyCell.textContent = "Ingen regionale tilbud matcher søgningen.";
      emptyRow.appendChild(emptyCell);
      tableBody.appendChild(emptyRow);
      return;
    }

    displayResources.forEach(function (resource) {
      var row = document.createElement("tr");

      if (isUrgentResource(resource)) {
        row.className = "resource-row-urgent";
      }

      appendRegionTextCell(row, resource.problemstilling);
      appendRegionTextCell(row, resource.tilbud);
      appendRegionAccessCell(row, resource.adgang);
      appendRegionTextCell(row, resource.krav);
      appendRegionSourceCell(row, resource.kilde);
      appendRegionTextCell(row, resource.note);

      tableBody.appendChild(row);
    });
  }

  function filterRegionResources(resources, searchValue, problemValue) {
    var search = normalize(searchValue);
    var selectedProblem = normalize(problemValue);

    return resources.filter(function (resource) {
      if (selectedProblem && normalize(resource.problemstilling) !== selectedProblem) {
        return false;
      }

      if (!search) {
        return true;
      }

      return normalize([
        resource.problemstilling,
        resource.tilbud,
        resource.adgang,
        resource.krav,
        resource.kilde,
        resource.note
      ].join(" ")).indexOf(search) !== -1;
    });
  }

  function sortRegionResources(resources, sortState) {
    var sorted = resources.slice();

    if (!sortState.key) {
      return sorted.sort(compareUrgentFirst);
    }

    return sorted.sort(function (first, second) {
      var result = comparePrivateValues(first[sortState.key], second[sortState.key], sortState.type);
      return sortState.direction === "asc" ? result : result * -1;
    });
  }

  function compareUrgentFirst(first, second) {
    var firstUrgent = isUrgentResource(first);
    var secondUrgent = isUrgentResource(second);

    if (firstUrgent && !secondUrgent) {
      return -1;
    }

    if (!firstUrgent && secondUrgent) {
      return 1;
    }

    return comparePrivateValues(first.problemstilling, second.problemstilling, "text") ||
      comparePrivateValues(first.tilbud, second.tilbud, "text");
  }

  function updateRegionSortIndicators(table, sortState) {
    Array.prototype.forEach.call(table.querySelectorAll("th"), function (heading) {
      var button = heading.querySelector("button[data-region-sort-key]");
      var indicator = heading.querySelector(".sort-indicator");

      if (!button || !indicator) {
        return;
      }

      if (button.getAttribute("data-region-sort-key") === sortState.key) {
        var isAscending = sortState.direction === "asc";
        indicator.textContent = isAscending ? "↑" : "↓";
        heading.setAttribute("aria-sort", isAscending ? "ascending" : "descending");
      } else {
        indicator.textContent = "";
        heading.removeAttribute("aria-sort");
      }
    });
  }

  function appendRegionTextCell(row, value) {
    var cell = document.createElement("td");
    cell.textContent = hasValue(value) ? String(value).trim() : "Tjek kilde";
    row.appendChild(cell);
  }

  function appendRegionAccessCell(row, value) {
    var cell = document.createElement("td");
    cell.appendChild(createRegionAccessContent(value));
    row.appendChild(cell);
  }

  function appendRegionSourceCell(row, value) {
    var cell = document.createElement("td");

    if (isUrl(value)) {
      var link = document.createElement("a");
      link.href = String(value).trim();
      link.textContent = "Åbn kilde";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      cell.appendChild(link);
    } else {
      cell.textContent = "Tjek kilde";
    }

    row.appendChild(cell);
  }

  function createRegionAccessContent(value) {
    if (!hasValue(value)) {
      return document.createTextNode("Tjek kilde");
    }

    var text = String(value).trim();

    if (/^\+?[\d\s().-]+$/.test(text)) {
      var link = document.createElement("a");
      link.href = "tel:" + text.replace(/[^\d+]/g, "");
      link.textContent = text;
      return link;
    }

    return document.createTextNode(text);
  }

  function isUrgentResource(resource) {
    return normalize(resource.problemstilling).indexOf("akut") !== -1;
  }

  function applyQueryFilters(filters) {
    var params = new URLSearchParams(window.location.search);

    params.forEach(function (value, key) {
      var field = filters.elements[key];

      if (field) {
        field.value = value;
      }
    });
  }

  function loadClinics(source, kind) {
    return fetch(source, { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Kunne ikke hente datafilen.");
        }

        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) {
          throw new Error("Datafilen skal være et array.");
        }

        return data;
      })
      .catch(function () {
        return kind === "public" ? fallbackPublicClinics : fallbackPrivateClinics;
      });
  }

  function filterClinics(clinics, filters) {
    var formData = new FormData(filters);
    var search = normalize(formData.get("search"));
    var region = normalize(formData.get("region"));
    var city = normalize(formData.get("city"));

    return clinics.filter(function (clinic) {
      var haystack = normalize([
        clinic.navn,
        clinic.type,
        clinic.afdelinger,
        clinic.region,
        clinic.by,
        clinic.byPostnr,
        clinic.postnummer,
        clinic.adresse,
        clinic.telefon,
        clinic.tlf,
        clinic.email,
        clinic.noter,
        formatCityPostcode(clinic),
        Array.isArray(clinic.laeger) ? clinic.laeger.join(" ") : clinic.laeger
      ].join(" "));

      if (search && haystack.indexOf(search) === -1) {
        return false;
      }

      if (region && normalize(clinic.region) !== region) {
        return false;
      }

      if (city && normalize(formatCityPostcode(clinic)) !== city) {
        return false;
      }

      return booleanFilters.every(function (key) {
        return matchesBoolean(getBooleanValue(clinic, key), formData.get(key));
      });
    });
  }

  function matchesBoolean(value, filterValue) {
    if (!filterValue) {
      return true;
    }

    if (filterValue === "ja") {
      return value === true;
    }

    if (filterValue === "nej") {
      return value === false;
    }

    return true;
  }

  function getBooleanValue(clinic, key) {
    if (key === "selvbetaler") {
      if (typeof clinic.selvbetaler === "boolean") {
        return clinic.selvbetaler;
      }

      if (typeof clinic.tagerIkkeEgenbetalere === "boolean") {
        return !clinic.tagerIkkeEgenbetalere;
      }
    }

    if (key === "tagerIkkeEgenbetalere") {
      if (typeof clinic.tagerIkkeEgenbetalere === "boolean") {
        return clinic.tagerIkkeEgenbetalere;
      }

      if (typeof clinic.selvbetaler === "boolean") {
        return !clinic.selvbetaler;
      }
    }

    if (key === "nationaltOptag") {
      if (typeof clinic.nationaltOptag === "boolean") {
        return clinic.nationaltOptag;
      }

      if (typeof clinic.tagerPatienterOnline === "boolean") {
        return clinic.tagerPatienterOnline;
      }
    }

    if (key === "tagerPatienterOnline") {
      if (typeof clinic.tagerPatienterOnline === "boolean") {
        return clinic.tagerPatienterOnline;
      }

      if (typeof clinic.nationaltOptag === "boolean") {
        return clinic.nationaltOptag;
      }
    }

    return clinic[key];
  }

  function renderTable(clinics, tableBody, kind, emptyText) {
    tableBody.replaceChildren();

    if (!clinics.length) {
      var emptyRow = document.createElement("tr");
      var emptyCell = document.createElement("td");
      emptyCell.colSpan = kind === "public" ? 13 : 12;
      emptyCell.className = "empty-state";
      emptyCell.textContent = emptyText;
      emptyRow.appendChild(emptyCell);
      tableBody.appendChild(emptyRow);
      return;
    }

    clinics.forEach(function (clinic) {
      var row = document.createElement("tr");

      if (kind === "public") {
        appendTextCell(row, clinic.navn);
        appendTextCell(row, clinic.type);
        appendTextCell(row, clinic.region);
        appendTextCell(row, clinic.by);
        appendTextCell(row, clinic.adresse);
        appendLinkCell(row, clinic.hjemmeside, "Hjemmeside");
        appendBadgeCell(row, clinic.akutmodtagelse);
        appendBadgeCell(row, clinic.henvisning);
        appendBadgeCell(row, clinic.voksne);
        appendBadgeCell(row, clinic.boernUnge);
        appendBadgeCell(row, clinic.adhd);
        appendBadgeCell(row, clinic.autisme);
        appendTextCell(row, clinic.noter);
      } else {
        appendLinkCell(row, clinic.hjemmeside, "Hjemmeside");
        appendTextCell(row, clinic.navn);
        appendLinkCell(row, clinic.priser, "Priser");
        appendBadgeCell(row, clinic.boernUnge);
        appendTextCell(row, clinic.afdelinger);
        appendTextCell(row, formatDoctors(clinic.laeger));
        appendPhoneCell(row, clinic.telefon || clinic.tlf);
        appendEmailCell(row, clinic.email);
        appendTextCell(row, formatCityPostcode(clinic));
        appendTextCell(row, clinic.adresse);
        appendBadgeCell(row, getBooleanValue(clinic, "tagerPatienterOnline"));
        appendBadgeCell(row, getBooleanValue(clinic, "tagerIkkeEgenbetalere"));
      }

      tableBody.appendChild(row);
    });
  }

  function renderCards(clinics, cardList, kind, emptyText) {
    cardList.replaceChildren();

    if (!clinics.length) {
      var empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = emptyText;
      cardList.appendChild(empty);
      return;
    }

    clinics.forEach(function (clinic) {
      var card = document.createElement("article");
      card.className = "clinic-card";

      var title = document.createElement("h2");
      title.textContent = cleanText(clinic.navn);
      card.appendChild(title);

      var list = document.createElement("dl");

      if (kind === "public") {
        appendDefinition(list, "Type", cleanText(clinic.type));
        appendDefinition(list, "Region", cleanText(clinic.region));
        appendDefinition(list, "By/område", cleanText(clinic.by));
        appendDefinition(list, "Adresse/område", cleanText(clinic.adresse));
        appendDefinition(list, "Hjemmeside", createExternalLink(clinic.hjemmeside, "Åbn hjemmeside"));
        appendDefinition(list, "Akut hjælp", createBadge(clinic.akutmodtagelse));
        appendDefinition(list, "Henvisning", createBadge(clinic.henvisning));
        appendDefinition(list, "Voksne", createBadge(clinic.voksne));
        appendDefinition(list, "Børn/unge", createBadge(clinic.boernUnge));
        appendDefinition(list, "ADHD", createBadge(clinic.adhd));
        appendDefinition(list, "Autisme", createBadge(clinic.autisme));
        appendDefinition(list, "Noter", cleanText(clinic.noter));
      } else {
        appendDefinition(list, "Hjemmeside", createExternalLink(clinic.hjemmeside, "Åbn hjemmeside"));
        appendDefinition(list, "Link til priser", createExternalLink(clinic.priser, "Se priser"));
        appendDefinition(list, "Børn/unge", createBadge(clinic.boernUnge));
        appendDefinition(list, "Evt. afdelinger", cleanText(clinic.afdelinger));
        appendDefinition(list, "Tilknyttede læger", formatDoctors(clinic.laeger));
        appendDefinition(list, "Tlf", createPhoneLink(clinic.telefon || clinic.tlf));
        appendDefinition(list, "Email", createEmailLink(clinic.email));
        appendDefinition(list, "By/postnr", cleanText(formatCityPostcode(clinic)));
        appendDefinition(list, "Adresse", cleanText(clinic.adresse));
        appendDefinition(list, "Tager patienter online", createBadge(getBooleanValue(clinic, "tagerPatienterOnline")));
        appendDefinition(list, "Tager ikke egenbetalere", createBadge(getBooleanValue(clinic, "tagerIkkeEgenbetalere")));
      }

      card.appendChild(list);
      cardList.appendChild(card);
    });
  }

  function appendTextCell(row, value) {
    var cell = document.createElement("td");
    cell.textContent = cleanText(value);
    row.appendChild(cell);
  }

  function appendLinkCell(row, url, label) {
    var cell = document.createElement("td");
    cell.appendChild(createExternalLink(url, label));
    row.appendChild(cell);
  }

  function appendPhoneCell(row, value) {
    var cell = document.createElement("td");
    cell.appendChild(createPhoneLink(value));
    row.appendChild(cell);
  }

  function appendEmailCell(row, value) {
    var cell = document.createElement("td");
    cell.appendChild(createEmailLink(value));
    row.appendChild(cell);
  }

  function appendBadgeCell(row, value) {
    var cell = document.createElement("td");
    cell.appendChild(createBadge(value));
    row.appendChild(cell);
  }

  function appendDefinition(list, term, value) {
    var dt = document.createElement("dt");
    var dd = document.createElement("dd");

    dt.textContent = term;

    if (value instanceof Node) {
      dd.appendChild(value);
    } else {
      dd.textContent = value;
    }

    list.appendChild(dt);
    list.appendChild(dd);
  }

  function createBadge(value) {
    var badge = document.createElement("span");
    badge.className = "badge";

    if (value === true) {
      badge.classList.add("yes");
      badge.textContent = "Ja";
    } else if (value === false) {
      badge.classList.add("no");
      badge.textContent = "Nej";
    } else {
      badge.classList.add("unknown");
      badge.textContent = "Ikke oplyst";
    }

    return badge;
  }

  function createExternalLink(url, label) {
    if (!hasValue(url)) {
      return document.createTextNode("Ikke oplyst");
    }

    var link = document.createElement("a");
    link.href = String(url).trim();
    link.textContent = label;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }

  function createPhoneLink(value) {
    if (!hasValue(value)) {
      return document.createTextNode("Ikke oplyst");
    }

    var phone = String(value).trim();
    var link = document.createElement("a");
    link.href = "tel:" + phone.replace(/[^\d+]/g, "");
    link.textContent = phone;
    return link;
  }

  function createEmailLink(value) {
    if (!hasValue(value)) {
      return document.createTextNode("Ikke oplyst");
    }

    var email = String(value).trim();
    var link = document.createElement("a");
    link.href = "mailto:" + email;
    link.textContent = email;
    return link;
  }

  function populateSelect(select, values, defaultLabel) {
    if (!select) {
      return;
    }

    select.replaceChildren();

    var defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = defaultLabel;
    select.appendChild(defaultOption);

    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function uniqueValues(items, key) {
    return items
      .map(function (item) {
        return cleanText(item[key], "");
      })
      .filter(Boolean)
      .filter(function (value, index, array) {
        return array.indexOf(value) === index;
      })
      .sort(function (a, b) {
        return a.localeCompare(b, "da");
      });
  }

  function uniqueCityValues(items, kind) {
    if (kind !== "private") {
      return uniqueValues(items, "by");
    }

    return items
      .map(function (item) {
        return formatCityPostcode(item);
      })
      .filter(Boolean)
      .filter(function (value, index, array) {
        return array.indexOf(value) === index;
      })
      .sort(function (a, b) {
        return a.localeCompare(b, "da");
      });
  }

  function formatCityPostcode(clinic) {
    if (hasValue(clinic.byPostnr)) {
      return cleanText(clinic.byPostnr, "");
    }

    if (hasValue(clinic.postnummer) && hasValue(clinic.by)) {
      return cleanText(clinic.postnummer, "") + " " + cleanText(clinic.by, "");
    }

    return cleanText(clinic.by, "");
  }

  function formatDoctors(value) {
    if (Array.isArray(value)) {
      var names = value.map(function (name) {
        return cleanText(name, "");
      }).filter(Boolean);

      return names.length ? names.join(", ") : "Ikke oplyst";
    }

    return cleanText(value);
  }

  function cleanText(value, fallback) {
    var fallbackText = fallback === undefined ? "Ikke oplyst" : fallback;

    if (!hasValue(value)) {
      return fallbackText;
    }

    return String(value).trim();
  }

  function hasValue(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
  }

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLocaleLowerCase("da-DK");
  }
})();

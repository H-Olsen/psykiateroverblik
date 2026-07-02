(function () {
  "use strict";

  var fallbackPrivateClinics = [
    {
      navn: "Carelink Psykiatri",
      afdelinger: "",
      laeger: ["Annamaria Molnar", "Laura Aakjær Jensen", "Bettina Lodskou Pedersen"],
      region: "Sjælland",
      by: "Kongens Lyngby",
      adresse: "Klampenborgvej 248, 1. sal. mf",
      hjemmeside: "https://mensana.dk/",
      priser: "https://mensana.dk/priser-betaling/",
      nationaltOptag: true,
      selvbetaler: true,
      adhd: false,
      autisme: false,
      boernUnge: false
    }
  ];

  var fallbackPublicClinics = [];

  var booleanFilters = [
    "selvbetaler",
    "nationaltOptag",
    "adhd",
    "autisme",
    "boernUnge",
    "akutmodtagelse",
    "henvisning",
    "voksne"
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initNavigation();
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
      "offentlige-psykiatere-info.html": "offentlige-klinikker.html",
      "private-psykiatere-info.html": "klinikker.html",
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
      populateSelect(document.getElementById("city"), uniqueValues(clinics, "by"), "Alle byer");
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
        clinic.adresse,
        clinic.noter,
        Array.isArray(clinic.laeger) ? clinic.laeger.join(" ") : clinic.laeger
      ].join(" "));

      if (search && haystack.indexOf(search) === -1) {
        return false;
      }

      if (region && normalize(clinic.region) !== region) {
        return false;
      }

      if (city && normalize(clinic.by) !== city) {
        return false;
      }

      return booleanFilters.every(function (key) {
        return matchesBoolean(clinic[key], formData.get(key));
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

  function renderTable(clinics, tableBody, kind, emptyText) {
    tableBody.replaceChildren();

    if (!clinics.length) {
      var emptyRow = document.createElement("tr");
      var emptyCell = document.createElement("td");
      emptyCell.colSpan = kind === "public" ? 13 : 13;
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
        appendTextCell(row, clinic.navn);
        appendTextCell(row, clinic.afdelinger);
        appendTextCell(row, formatDoctors(clinic.laeger));
        appendTextCell(row, clinic.region);
        appendTextCell(row, clinic.by);
        appendTextCell(row, clinic.adresse);
        appendLinkCell(row, clinic.hjemmeside, "Hjemmeside");
        appendLinkCell(row, clinic.priser, "Priser");
        appendBadgeCell(row, clinic.nationaltOptag);
        appendBadgeCell(row, clinic.selvbetaler);
        appendBadgeCell(row, clinic.adhd);
        appendBadgeCell(row, clinic.autisme);
        appendBadgeCell(row, clinic.boernUnge);
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
        appendDefinition(list, "Afdelinger", cleanText(clinic.afdelinger));
        appendDefinition(list, "Læger", formatDoctors(clinic.laeger));
        appendDefinition(list, "Region", cleanText(clinic.region));
        appendDefinition(list, "By", cleanText(clinic.by));
        appendDefinition(list, "Adresse", cleanText(clinic.adresse));
        appendDefinition(list, "Hjemmeside", createExternalLink(clinic.hjemmeside, "Åbn hjemmeside"));
        appendDefinition(list, "Priser", createExternalLink(clinic.priser, "Se priser"));
        appendDefinition(list, "Online/nationalt", createBadge(clinic.nationaltOptag));
        appendDefinition(list, "Selvbetaler", createBadge(clinic.selvbetaler));
        appendDefinition(list, "ADHD", createBadge(clinic.adhd));
        appendDefinition(list, "Autisme", createBadge(clinic.autisme));
        appendDefinition(list, "Børn/unge", createBadge(clinic.boernUnge));
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

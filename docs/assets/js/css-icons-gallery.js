/* global Promise, Map */

(function () {
  var MIN_QUERY_LENGTH = 1;
  var iconSets = {
    regular: {
      suffix: "",
      url: "https://cdn.jsdelivr.net/npm/@trimble-oss/modus-icons-css@0.0.3/dist/modus-icons-regular.min.css",
    },
    fill: {
      suffix: "-fill",
      url: "https://cdn.jsdelivr.net/npm/@trimble-oss/modus-icons-css@0.0.3/dist/modus-icons-fill.min.css",
    },
    duotone: {
      suffix: "-duotone",
      url: "https://cdn.jsdelivr.net/npm/@trimble-oss/modus-icons-css@0.0.3/dist/modus-icons-duotone.min.css",
    },
  };

  /**
   * Map remote input to a fixed allowlist id (no dynamic property lookup on user strings).
   */
  function normalizeIconSetId(raw) {
    if (raw === "fill" || raw === "duotone") {
      return raw;
    }
    return "regular";
  }

  function getIconSetConfig(id) {
    switch (id) {
      case "fill":
        return iconSets.fill;
      case "duotone":
        return iconSets.duotone;
      case "regular":
      default:
        return iconSets.regular;
    }
  }

  var namesBySetCache = new Map();

  var state = {
    set: "regular",
    query: "",
  };

  var refs = {
    tabs: document.querySelectorAll("[data-icon-set]"),
    input: document.getElementById("css-icons-search"),
    count: document.getElementById("css-icons-count"),
    list: document.getElementById("css-icons-list"),
    loading: document.getElementById("css-icons-loading"),
  };

  var params = new URLSearchParams(window.location.search);
  state.set = normalizeIconSetId(params.get("set"));
  state.query = params.get("q") || "";

  function updateUrl() {
    var next = new URLSearchParams();
    if (state.query) {
      next.set("q", state.query);
    }
    if (state.set !== "regular") {
      next.set("set", state.set);
    }
    var query = next.toString();
    var url = window.location.pathname + (query ? "?" + query : "");
    window.history.replaceState({}, "", url);
  }

  function parseNamesFromCss(cssText, suffix) {
    var regex = /--modus-icon-([a-z0-9-]+):\s*url\(/g;
    var match;
    var names = [];
    var seen = {};

    while ((match = regex.exec(cssText)) !== null) {
      var name = match[1];
      if (suffix && name.slice(-suffix.length) === suffix) {
        name = name.slice(0, -suffix.length);
      }
      if (!seen[name]) {
        seen[name] = true;
        names.push(name);
      }
    }

    names.sort(function (a, b) {
      return a.localeCompare(b);
    });
    return names;
  }

  function loadSet(setId) {
    var id = normalizeIconSetId(setId);
    var cfg = getIconSetConfig(id);

    if (namesBySetCache.has(id)) {
      return Promise.resolve(namesBySetCache.get(id));
    }

    refs.loading.hidden = false;
    return fetch(cfg.url)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load " + id + " icon CSS.");
        }
        return response.text();
      })
      .then(function (cssText) {
        var names = parseNamesFromCss(cssText, cfg.suffix);
        namesBySetCache.set(id, names);
        refs.loading.hidden = true;
        return names;
      });
  }

  function renderTabs() {
    Array.prototype.forEach.call(refs.tabs, function (tab) {
      var isActive = tab.dataset.iconSet === state.set;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function renderPrompt() {
    refs.count.textContent = "Type 1 or more characters to search";
    refs.list.innerHTML = "";
  }

  function renderList(names) {
    if (state.query.length < MIN_QUERY_LENGTH) {
      renderPrompt();
      return;
    }

    var suffix = getIconSetConfig(state.set).suffix;
    var query = state.query.toLowerCase();
    var filtered = names.filter(function (name) {
      return name.indexOf(query) > -1;
    });
    refs.count.textContent = filtered.length.toLocaleString() + " icons";

    refs.list.innerHTML = filtered
      .map(function (name) {
        return (
          '<div class="col">' +
          '<div class="border rounded px-1 py-2 h-100 bg-body-tertiary">' +
          '<div class="d-flex justify-content-center mb-2">' +
          '<i class="modus-icon-' +
          name +
          suffix +
          '" aria-hidden="true"></i>' +
          "</div>" +
          '<code class="small d-block text-center text-break text-body text-justify">' +
          "modus-icon-" +
          name +
          suffix +
          "</code>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function render() {
    renderTabs();
    updateUrl();

    if (state.query.length < MIN_QUERY_LENGTH) {
      refs.loading.hidden = true;
      renderPrompt();
      return Promise.resolve();
    }

    return loadSet(state.set).then(function (names) {
      renderList(names);
    });
  }

  function handleRenderError(error) {
    refs.loading.hidden = true;
    refs.list.textContent = "";
    var col = document.createElement("div");
    col.className = "col-12";
    var alertEl = document.createElement("div");
    alertEl.className = "alert alert-danger mb-0";
    var msg =
      error && error.message != null ? String(error.message) : "Something went wrong.";
    alertEl.textContent = msg;
    col.appendChild(alertEl);
    refs.list.appendChild(col);
  }

  function bindEvents() {
    Array.prototype.forEach.call(refs.tabs, function (tab) {
      tab.addEventListener("click", function () {
        state.set = normalizeIconSetId(tab.dataset.iconSet);
        render().catch(handleRenderError);
      });
    });

    refs.input.addEventListener("input", function (event) {
      state.query = event.target.value.trim().toLowerCase();
      render().catch(handleRenderError);
    });
  }

  function init() {
    refs.input.value = state.query;
    bindEvents();
    render().catch(handleRenderError);
  }

  init();
})();

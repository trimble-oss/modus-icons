/* global Promise, Map, bootstrap */

(function () {
  /** Below this count, one innerHTML update is usually faster than chunked paint. */
  var CHUNKED_RENDER_THRESHOLD = 150;
  /** Icons appended per animation frame when list is large. */
  var CHUNK_SIZE = 80;
  /** Delay filter re-renders while typing to avoid rebuilding thousands of nodes per keystroke. */
  var FILTER_DEBOUNCE_MS = 120;

  var ICONS_CSS_VERSION = "0.9.0";
  var ICONS_CSS_BASE =
    "https://cdn.jsdelivr.net/npm/@trimble-oss/modus-icons-css@" +
    ICONS_CSS_VERSION +
    "/css/";

  var iconSets = {
    regular: {
      suffix: "",
      url: ICONS_CSS_BASE + "modus-icons-regular.min.css",
    },
    fill: {
      suffix: "-fill",
      url: ICONS_CSS_BASE + "modus-icons-fill.min.css",
    },
    duotone: {
      suffix: "-duotone",
      url: ICONS_CSS_BASE + "modus-icons-duotone.min.css",
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

  /** @type {Map<string, { names: string[], cssText: string }>} */
  var setDataCache = new Map();
  var renderGeneration = 0;
  var filterDebounceId = null;

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
    modalEl: document.getElementById("css-icon-detail-modal"),
    modalTitle: document.getElementById("css-icon-detail-modal-title"),
    modalBody: document.getElementById("css-icon-detail-modal-body"),
  };

  var params = new URLSearchParams(window.location.search);
  state.set = normalizeIconSetId(params.get("set"));
  state.query = params.get("q") || "";

  var detailModal = null;

  function getDetailModal() {
    if (!refs.modalEl || typeof bootstrap === "undefined" || !bootstrap.Modal) {
      return null;
    }
    if (!detailModal) {
      detailModal = new bootstrap.Modal(refs.modalEl);
    }
    return detailModal;
  }

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

  /**
   * Parse url("...") or url('...') after a CSS property value start; handles \\ and \" escapes.
   * @returns {{ value: string, endIndex: number } | null}
   */
  function parseCssUrlArgument(cssText, startIndex) {
    var i = startIndex;
    while (i < cssText.length && /\s/.test(cssText[i])) {
      i++;
    }
    if (cssText.slice(i, i + 4) !== "url(") {
      return null;
    }
    i += 4;
    while (i < cssText.length && /\s/.test(cssText[i])) {
      i++;
    }
    var quote = cssText[i];
    if (quote !== '"' && quote !== "'") {
      return null;
    }
    i++;
    var out = "";
    while (i < cssText.length) {
      var c = cssText[i];
      if (c === "\\" && i + 1 < cssText.length) {
        out += cssText[i + 1];
        i += 2;
        continue;
      }
      if (c === quote) {
        return { value: out, endIndex: i + 1 };
      }
      out += c;
      i++;
    }
    return null;
  }

  /**
   * Full declaration including optional trailing semicolon, e.g. --modus-icon-x: url("...");
   */
  function extractCssCustomPropertyDeclaration(cssText, varName) {
    var key = varName + ":";
    var idx = cssText.indexOf(key);
    if (idx === -1) {
      return null;
    }
    var afterKey = idx + key.length;
    var parsed = parseCssUrlArgument(cssText, afterKey);
    if (!parsed) {
      return null;
    }
    var j = parsed.endIndex;
    while (j < cssText.length && /\s/.test(cssText[j])) {
      j++;
    }
    if (cssText[j] !== ")") {
      return null;
    }
    j++;
    var decl = cssText.slice(idx, j);
    while (j < cssText.length && /\s/.test(cssText[j])) {
      j++;
    }
    if (cssText[j] === ";") {
      decl += ";";
    }
    return decl;
  }

  var DATA_URI_UTF8_PREFIX = "data:image/svg+xml;utf8,";

  function dataUriToSvgMarkup(dataUri) {
    if (!dataUri || dataUri.indexOf(DATA_URI_UTF8_PREFIX) !== 0) {
      return null;
    }
    var raw = dataUri.slice(DATA_URI_UTF8_PREFIX.length);
    try {
      return decodeURIComponent(raw);
    } catch (e) {
      return raw;
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function copyToClipboard(text, buttonEl) {
    function done(ok) {
      if (!buttonEl) {
        return;
      }
      var labelEl = buttonEl.querySelector(".css-icon-copy-label");
      var origAria = buttonEl.getAttribute("aria-label") || "Copy";
      var origTitle = buttonEl.getAttribute("title") || "";
      var next = ok ? "Copied" : "Copy failed";
      if (labelEl) {
        var orig = labelEl.textContent;
        labelEl.textContent = next;
        buttonEl.disabled = !ok;
        setTimeout(function () {
          labelEl.textContent = orig;
          buttonEl.disabled = false;
          buttonEl.setAttribute("aria-label", origAria);
        }, 2000);
        return;
      }
      buttonEl.setAttribute("aria-label", next);
      buttonEl.setAttribute("title", next);
      buttonEl.disabled = !ok;
      setTimeout(function () {
        buttonEl.setAttribute("aria-label", origAria);
        buttonEl.setAttribute("title", origTitle);
        buttonEl.disabled = false;
      }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          done(true);
        },
        function () {
          done(false);
        }
      );
      return;
    }

    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done(true);
    } catch (err) {
      done(false);
    }
    document.body.removeChild(ta);
  }

  function buildModalBody(options) {
    var className = options.className;
    var varSnippet = options.varSnippet;
    var svgMarkup = options.svgMarkup;
    var integrationHtml = '<i class="' + className + '"></i>';

    var safeClass = escapeHtml(className);
    var safeIntegration = escapeHtml(integrationHtml);
    var safeVar = escapeHtml(varSnippet);

    var downloadId = "css-icon-detail-download";
    var copyHtmlId = "css-icon-copy-html";
    var copyVarId = "css-icon-copy-var";
    var html =
      '<div class="d-flex flex-column align-items-center icon-demo border rounded p-3 mb-3" style="min-height: 160px !important;">' +
      '<div class="my-2 d-inline-flex align-items-center justify-content-center">' +
      '<i id="css-icon-detail-preview" class="' +
      safeClass +
      '" aria-hidden="true"></i>' +
      "</div>" +
      "</div>" +
      '<div class="d-grid gap-2 mb-4">' +
      '<a id="' +
      downloadId +
      '" class="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2" href="#" download="' +
      escapeHtml(className + ".svg") +
      '"><i class="modus-icon-download-simple" aria-hidden="true"></i>Download SVG</a>' +
      "</div>" +
      '<div class="mb-3">' +
      '<div class="d-flex align-items-center justify-content-between gap-2 mb-1">' +
      '<label class="form-label small mb-0 fw-semibold" for="css-icon-snippet-html">HTML</label>' +
      '<button type="button" class="btn btn-sm btn-icon-only btn-outline-secondary" id="' +
      copyHtmlId +
      '" aria-label="Copy HTML snippet" title="Copy"><i class="modus-icon-clipboard-text" aria-hidden="true"></i></button>' +
      "</div>" +
      '<pre class="form-control css-icon-snippet mb-0" id="css-icon-snippet-html"><code>' +
      safeIntegration +
      "</code></pre>" +
      "</div>" +
      '<div class="mb-0">' +
      '<div class="d-flex align-items-center justify-content-between gap-2 mb-1">' +
      '<label class="form-label small mb-0 fw-semibold" for="css-icon-snippet-var">CSS variable</label>' +
      '<button type="button" class="btn btn-sm btn-icon-only btn-outline-secondary" id="' +
      copyVarId +
      '" aria-label="Copy CSS variable" title="Copy"><i class="modus-icon-clipboard-text" aria-hidden="true"></i></button>' +
      "</div>" +
      '<pre class="form-control css-icon-snippet mb-0" id="css-icon-snippet-var"><code>' +
      safeVar +
      "</code></pre>" +
      "</div>";

    return {
      html: html,
      downloadId: downloadId,
      copyHtmlId: copyHtmlId,
      copyVarId: copyVarId,
      copyIntegration: integrationHtml,
      copyVarRaw: varSnippet,
      svgMarkup: svgMarkup,
      fileName: className + ".svg",
    };
  }

  function wireModalBody(root, payload) {
    var btnHtml = root.querySelector("#" + payload.copyHtmlId);
    var btnVar = root.querySelector("#" + payload.copyVarId);
    if (btnHtml) {
      btnHtml.addEventListener("click", function () {
        copyToClipboard(payload.copyIntegration, btnHtml);
      });
    }
    if (btnVar) {
      btnVar.addEventListener("click", function () {
        copyToClipboard(payload.copyVarRaw, btnVar);
      });
    }

    var a = document.getElementById(payload.downloadId);
    if (a && payload.svgMarkup) {
      var blob = new Blob([payload.svgMarkup], { type: "image/svg+xml;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      a.href = url;
      a.addEventListener(
        "click",
        function () {
          setTimeout(function () {
            URL.revokeObjectURL(url);
          }, 2500);
        },
        { once: true }
      );
    } else if (a) {
      a.classList.add("disabled");
      a.setAttribute("aria-disabled", "true");
    }
  }

  function openIconDetail(name, suffix) {
    var modal = getDetailModal();
    if (!modal || !refs.modalTitle || !refs.modalBody) {
      return;
    }

    var data = setDataCache.get(state.set);
    var cssText = data ? data.cssText : "";
    var className = "modus-icon-" + name + suffix;
    var varName = "--" + className;
    var decl = extractCssCustomPropertyDeclaration(cssText, varName);
    var varSnippet =
      decl ||
      "/* Could not read variable from cached CSS. Reload the page or check the network tab. */\n" +
      varName +
      ': url("…");';

    refs.modalTitle.textContent = className;

    var svgMarkup = null;
    if (decl) {
      var key = varName + ":";
      var keyIdx = cssText.indexOf(key);
      if (keyIdx !== -1) {
        var parsed = parseCssUrlArgument(cssText, keyIdx + key.length);
        if (parsed) {
          svgMarkup = dataUriToSvgMarkup(parsed.value);
        }
      }
    }

    var payload = buildModalBody({
      className: className,
      varSnippet: varSnippet,
      svgMarkup: svgMarkup,
    });
    refs.modalBody.innerHTML = payload.html;
    wireModalBody(refs.modalBody, payload);

    modal.show();
  }

  function loadSet(setId) {
    var id = normalizeIconSetId(setId);
    var cfg = getIconSetConfig(id);

    if (setDataCache.has(id)) {
      return Promise.resolve(setDataCache.get(id).names);
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
        setDataCache.set(id, { names: names, cssText: cssText });
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

  function iconCellHtml(name, suffix) {
    var className = "modus-icon-" + name + suffix;
    var label = "Open details for " + className;
    return (
      '<div class="col py-1">' +
      '<div class="border rounded px-1 py-2 h-100 bg-body-tertiary css-icons-card" role="button" tabindex="0" data-css-icon-name="' +
      name +
      '" data-css-icon-suffix="' +
      suffix +
      '" aria-label="' +
      escapeHtml(label) +
      '">' +
      '<div class="d-flex justify-content-center mb-2">' +
      '<i class="' +
      className +
      '" aria-hidden="true"></i>' +
      "</div>" +
      '<code class="small d-block text-center text-break text-body text-justify">' +
      className +
      "</code>" +
      "</div>" +
      "</div>"
    );
  }

  function renderList(names) {
    var gen = ++renderGeneration;
    var suffix = getIconSetConfig(state.set).suffix;
    var query = state.query.toLowerCase();
    var filtered = query
      ? names.filter(function (name) {
          return name.indexOf(query) > -1;
        })
      : names;

    var displayQuery = refs.input ? refs.input.value.trim() : state.query;
    if (!query) {
      refs.count.textContent = filtered.length.toLocaleString() + " icons";
    } else {
      refs.count.textContent =
        filtered.length.toLocaleString() +
        " of " +
        names.length.toLocaleString() +
        ' matching "' +
        displayQuery +
        '"';
    }

    if (filtered.length <= CHUNKED_RENDER_THRESHOLD) {
      refs.list.innerHTML = filtered
        .map(function (name) {
          return iconCellHtml(name, suffix);
        })
        .join("");
      return;
    }

    refs.list.innerHTML = "";
    var index = 0;

    function appendChunk() {
      if (gen !== renderGeneration) {
        return;
      }
      var end = Math.min(index + CHUNK_SIZE, filtered.length);
      var parts = [];
      for (; index < end; index++) {
        parts.push(iconCellHtml(filtered[index], suffix));
      }
      refs.list.insertAdjacentHTML("beforeend", parts.join(""));
      if (index < filtered.length) {
        requestAnimationFrame(appendChunk);
      }
    }

    requestAnimationFrame(appendChunk);
  }

  function render() {
    renderTabs();
    updateUrl();

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

  function onListClick(event) {
    var card = event.target.closest(".css-icons-card");
    if (!card || !refs.list.contains(card)) {
      return;
    }
    var iconName = card.getAttribute("data-css-icon-name");
    var iconSuffix = card.getAttribute("data-css-icon-suffix") || "";
    if (!iconName) {
      return;
    }
    openIconDetail(iconName, iconSuffix);
  }

  function onListKeydown(event) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    var card = event.target.closest(".css-icons-card");
    if (!card || !refs.list.contains(card) || event.target !== card) {
      return;
    }
    event.preventDefault();
    var iconName = card.getAttribute("data-css-icon-name");
    var iconSuffix = card.getAttribute("data-css-icon-suffix") || "";
    if (iconName) {
      openIconDetail(iconName, iconSuffix);
    }
  }

  function bindEvents() {
    Array.prototype.forEach.call(refs.tabs, function (tab) {
      tab.addEventListener("click", function () {
        if (filterDebounceId != null) {
          clearTimeout(filterDebounceId);
          filterDebounceId = null;
        }
        state.set = normalizeIconSetId(tab.dataset.iconSet);
        render().catch(handleRenderError);
      });
    });

    refs.input.addEventListener("input", function (event) {
      state.query = event.target.value.trim().toLowerCase();
      if (filterDebounceId != null) {
        clearTimeout(filterDebounceId);
      }
      filterDebounceId = setTimeout(function () {
        filterDebounceId = null;
        render().catch(handleRenderError);
      }, FILTER_DEBOUNCE_MS);
    });

    if (refs.list) {
      refs.list.addEventListener("click", onListClick);
      refs.list.addEventListener("keydown", onListKeydown);
    }
  }

  function init() {
    refs.input.value = state.query;
    bindEvents();
    render().catch(handleRenderError);
  }

  init();
})();

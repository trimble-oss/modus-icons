const fs = require('fs-extra');
const path = require('path');
const { loadConfig, optimize } = require('svgo');

const configName = 'build.config.json';
const rootDirectoryPath = path.normalize(path.join(__dirname, '..'));
const distRootPath = path.join(rootDirectoryPath, 'dist');

function normalizeConfig(config, rootDirectoryPath, distDirectoryPath) {
  const normalizedConfig = {};
  const svgDirectoryPath = path.join(rootDirectoryPath, 'icons');
  normalizedConfig.svgDirectoryPaths = config.svgs.map((svg) =>
    path.join(svgDirectoryPath, path.normalize(svg))
  );
  normalizedConfig.distDirectoryPath = path.join(
    distDirectoryPath,
    path.normalize(config.dist)
  );
  normalizedConfig.setName = config.dist;
  return normalizedConfig;
}

/**
 * Collect icon entries for a single config. When config has multiple svg dirs, later dirs override same basename.
 * Returns entries with iconId = basename only (per-set, so no collision).
 */
function collectIconEntriesForConfig(config, rootPath, distPath) {
  const byBasename = new Map();
  const normalized = normalizeConfig(config, rootPath, distPath);
  normalized.svgDirectoryPaths.forEach((dirPath) => {
    if (!fs.existsSync(dirPath)) return;
    fs.readdirSync(dirPath).forEach((name) => {
      if (!/\.svg$/i.test(name)) return;
      const filePath = path.join(dirPath, name);
      const basename = path.basename(name, '.svg').replace(/[\s-]+/g, '-');
      byBasename.set(basename, { iconId: basename, filePath });
    });
  });
  return Array.from(byBasename.values());
}

/**
 * Remove width, height, class and fill from SVG string to reduce CSS payload (viewBox keeps aspect ratio; default fill is black for mask).
 */
function stripSvgForCssVars(svgString) {
  return svgString
    .replace(/\s*width\s*=\s*["']24["']\s*/gi, ' ')
    .replace(/\s*height\s*=\s*["']24["']\s*/gi, ' ')
    .replace(/\s*class\s*=\s*["'][^"']*["']\s*/gi, ' ')
    .replace(/\s*fill\s*=\s*["']currentColor["']\s*/gi, ' ');
}

/**
 * Encode SVG string for use in CSS url("data:image/svg+xml;utf8,...")
 * Escapes characters that are special in CSS strings and normalizes for data URI.
 */
function encodeSvgForCss(svgString) {
  return svgString
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/"/g, "'")
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/#/g, '%23')
    .replace(/\s/g, '%20');
}

async function buildCssVarsForSet(config, version, svgoConfig, distPath) {
  const setName = config.dist;
  const iconPrefix = `${setName}-icon`;
  const entries = collectIconEntriesForConfig(config, rootDirectoryPath, distPath);
  if (entries.length === 0) return { setName, entryCount: 0 };

  const header = `/*!
 * Modus Icons v${version} (https://modus-icons.trimble.com/)
 * Copyright 2023-2026 Trimble Inc.
 * Licensed under MIT (https://github.com/trimble-oss/modus-icons/blob/main/LICENSE.md)
 */
`;

  const baseRules = `[class^="${iconPrefix}-"],
[class*=" ${iconPrefix}-"] {
  background-color: currentColor;
  display: inline-block;
  height: 1rem;
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: contain;
  width: 1rem;
}
`;

  const varLines = [];
  const classLines = [];
  const iconList = [];

  for (const { iconId, filePath } of entries) {
    const rawSvg = await fs.readFile(filePath, 'utf8');
    const { data: optimizedSvg } = optimize(rawSvg, {
      path: filePath,
      ...svgoConfig,
    });
    const svgStripped = stripSvgForCssVars(optimizedSvg);
    const encoded = encodeSvgForCss(svgStripped);
    const dataUri = `url("data:image/svg+xml;utf8,${encoded}")`;
    varLines.push(`  --${iconPrefix}-${iconId}: ${dataUri};`);
    classLines.push(
      `.${iconPrefix}-${iconId} {\n  mask-image: var(--${iconPrefix}-${iconId});\n}`
    );
    iconList.push(iconId);
  }

  const rootBlock = `:root {\n${varLines.join('\n')}\n}\n\n`;
  const classBlock = classLines.join('\n');
  const fullCss = header + rootBlock + baseRules + '\n' + classBlock;

  const setCssPath = path.join(distPath, setName, 'css');
  const cssBasename = `${setName}-icons`;
  await fs.ensureDir(setCssPath);

  await fs.writeFile(
    path.join(setCssPath, `${cssBasename}.css`),
    fullCss,
    'utf8'
  );

  const minRoot = ':root{' + varLines.join('') + '}';
  const minBase =
    '[class^="' + iconPrefix + '-"],[class*=" ' + iconPrefix + '-"]{background-color:currentColor;display:inline-block;height:1rem;mask-position:center;mask-repeat:no-repeat;mask-size:contain;width:1rem}';
  const minClasses = classLines
    .map((s) => s.replace(/\n\s*/g, '').replace(/\s+/g, ' '))
    .join('');
  const minified =
    header.trim() + '\n' + minRoot + '\n' + minBase + '\n' + minClasses;
  await fs.writeFile(
    path.join(setCssPath, `${cssBasename}.min.css`),
    minified,
    'utf8'
  );

  await writeGalleryHtml(setCssPath, iconList, version, setName, cssBasename, iconPrefix);
  return { setName, entryCount: entries.length };
}

async function writeGalleryHtml(cssDirPath, iconList, version, setName, cssBasename, iconPrefix) {
  const listItems = iconList
    .map(
      (id) => `    <li class="gallery-item" data-icon="${id}">
      <i class="${iconPrefix}-${id}" aria-hidden="true"></i>
      <code class="gallery-name">${iconPrefix}-${id}</code>
    </li>`
    )
    .join('\n');

  const displayName = setName.replace(/-/g, ' ');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>Modus Icons – ${displayName} (CSS Variables)</title>
  <script>
    (function() {
      var stored = localStorage.getItem('theme');
      var dark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    })();
  </script>
  <link rel="stylesheet" href="${cssBasename}.css">
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; margin: 0; padding: 1rem; background: #f5f5f5; color: #111; }
    [data-theme="dark"] body { background: #1a1a1a; color: #e5e5e5; }
    h1 { margin: 0 0 0.5rem; }
    .subtitle { color: #666; margin-bottom: 1.5rem; }
    [data-theme="dark"] .subtitle { color: #999; }
    .search-wrap { margin-bottom: 1rem; }
    .search-wrap input { width: 100%; max-width: 24rem; padding: 0.5rem 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 4px; background: #fff; color: #111; }
    [data-theme="dark"] .search-wrap input { border-color: #444; background: #2a2a2a; color: #e5e5e5; }
    [type="search"]::-webkit-search-cancel-button { cursor: pointer; filter: grayscale(1); }
    .gallery { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr)); gap: 1rem; }
    .gallery-item { display: flex; flex-direction: column; align-items: center; padding: 1rem; background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    [data-theme="dark"] .gallery-item { background: #2a2a2a; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
    .gallery-item [class^="${iconPrefix}-"] { width: 2rem; height: 2rem; }
    .gallery-name { font-size: 0.7rem; margin-top: 0.5rem; word-break: break-all; text-align: center; color: #333; }
    [data-theme="dark"] .gallery-name { color: #b0b0b0; }
    .gallery-item.hidden { display: none; }
    .theme-toggle { position: fixed; bottom: 1rem; right: 1rem; z-index: 10; width: 2.5rem; height: 2.5rem; padding: 0; font-size: 1.25rem; line-height: 1; border: 1px solid #ccc; border-radius: 50%; background: #fff; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
    .theme-toggle:hover { background: #f0f0f0; }
    [data-theme="dark"] .theme-toggle { border-color: #555; background: #2a2a2a; color: #f0c674; box-shadow: 0 2px 8px rgba(0,0,0,0.4); }
    [data-theme="dark"] .theme-toggle:hover { background: #333; color: #f5d076; }
    .theme-toggle .icon-sun { display: none; }
    .theme-toggle .icon-moon { display: inline; }
    [data-theme="dark"] .theme-toggle .icon-sun { display: inline; }
    [data-theme="dark"] .theme-toggle .icon-moon { display: none; }
  </style>
</head>
<body>
  <h1>Modus Icons – ${displayName}</h1>
  <p class="subtitle">v${version} · Use class <code>${iconPrefix}-&lt;name&gt;</code> or CSS var <code>--${iconPrefix}-&lt;name&gt;</code></p>
  <div class="search-wrap">
    <label for="filter">Filter by name:</label>
    <input type="search" id="filter" placeholder="e.g. add" autocomplete="off">
  </div>
  <main><ul class="gallery" id="gallery">${listItems}</ul></main>
  <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode"><span class="icon-moon" aria-hidden="true">&#127769;</span><span class="icon-sun" aria-hidden="true">&#9728;</span></button>
  <script>
    (function() {
      var filter = document.getElementById('filter');
      var items = document.querySelectorAll('.gallery-item');
      filter.addEventListener('input', function() {
        var q = (this.value || '').toLowerCase();
        items.forEach(function(el) {
          var name = (el.getAttribute('data-icon') || '').toLowerCase();
          el.classList.toggle('hidden', q && name.indexOf(q) === -1);
        });
      });
      var themeToggle = document.getElementById('theme-toggle');
      themeToggle.addEventListener('click', function() {
        var root = document.documentElement;
        var isDark = root.getAttribute('data-theme') === 'dark';
        root.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
      });
    })();
  </script>
</body>
</html>
`;
  await fs.writeFile(path.join(cssDirPath, 'index.html'), html, 'utf8');
}

async function buildCssVars() {
  console.log('Building CSS variables output...');
  const configs = fs.readJsonSync(path.join(__dirname, configName));
  const pkg = fs.readJsonSync(path.join(rootDirectoryPath, 'package.json'));
  const version = pkg.version;

  const svgoConfig = await loadConfig(
    path.join(__dirname, 'logic/svgo.config.js')
  );

  let totalIcons = 0;
  for (const config of configs) {
    const result = await buildCssVarsForSet(
      config,
      version,
      svgoConfig,
      distRootPath
    );
    if (result.entryCount > 0) {
      console.log(
        `    ${result.setName}: dist/${result.setName}/css/ (${result.entryCount} icons)`
      );
      totalIcons += result.entryCount;
    }
  }
  console.log(`    Total: ${totalIcons} icons across ${configs.length} sets`);
  return { totalIcons };
}

module.exports = buildCssVars;

if (require.main === module) {
  buildCssVars().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

#!/usr/bin/env node

'use strict';

const fs = require('fs-extra');
const path = require('path');
const picocolors = require('picocolors');

const VERBOSE = process.argv.includes('--verbose');

function capitalizeFirstLetter(string) {
  return string
    .split('-')
    .join(' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

async function writeContents(file, pagesDir) {
  const iconBasename = file.name;
  const iconTitle = capitalizeFirstLetter(iconBasename);
  const pageName = path.join(pagesDir, `${iconBasename}.md`);

  const pageTemplate = `---
title: ${iconTitle}
categories: ${file.categories.join(', ')}
tags: ${file.tags.join(', ')}
---
`;

  fs.writeFile(pageName, pageTemplate);
}

async function writeIndex(setName, pagesDir) {
  const indexTitle = capitalizeFirstLetter(setName);
  const pageName = path.join(pagesDir, `_index.md`);

  const pageTemplate = `---
title: "${indexTitle}"
layout: "home"
---
`;

  fs.writeFile(pageName, pageTemplate);
}

function buildPages(config) {
  (async () => {
    const setName = path.basename(config.distDirectoryPath);
    console.log(`Building ${setName} pages...`);
    console.log('_____________________________');

    try {
      const pagesDir = path.join(__dirname, '../docs/content', setName);
      await fs.mkdir(pagesDir, { recursive: true });
      await writeIndex(setName, pagesDir);
      const srcDirectoryPath = config.svgDirectoryPaths.find((dir) =>
        dir.includes(setName)
      );
      const files = fs.readJSONSync(
        path.join(srcDirectoryPath, 'metadata.json')
      );
      if (setName.startsWith('modus')) {
        const type = setName.split('-')[1];
        const materialFiles = fs.readJSONSync(
          path.join(srcDirectoryPath, '..', `material-${type}`, 'metadata.json')
        );
        files.push(...materialFiles);
      }

      await Promise.all(files.map((file) => writeContents(file, pagesDir)));
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();
}

module.exports = buildPages;

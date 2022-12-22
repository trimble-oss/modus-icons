#!/usr/bin/env node

'use strict';

const fs = require('fs').promises;
const path = require('path');
const picocolors = require('picocolors');

const VERBOSE = process.argv.includes('--verbose');

function capitalizeFirstLetter(string) {
  return (string.charAt(0).toUpperCase() + string.slice(1))
    .split('-')
    .join(' ');
}

async function main(file, pagesDir) {
  const iconBasename = path.basename(file, path.extname(file));
  const iconTitle = capitalizeFirstLetter(iconBasename);
  const pageName = path.join(pagesDir, `${iconBasename}.md`);

  const pageTemplate = `---
title: ${iconTitle}
categories:
tags:
---
`;

  try {
    await fs.access(pageName, fs.F_OK);

    if (VERBOSE) {
      console.log(
        `${picocolors.cyan(iconBasename)}: Page already exists; skipping`
      );
    }
  } catch {
    await fs.writeFile(pageName, pageTemplate);
    console.log(picocolors.green(`${iconBasename}: Page created`));
  }
}

function buildPages(config) {
  (async () => {
    const setName = path.basename(config.distDirectoryPath);
    console.log(`Building ${setName} pages...`);
    console.log('_____________________________');

    const dstDirectoryPathSvg = path.join(config.distDirectoryPath, 'svg');
    try {
      const pagesDir = path.join(__dirname, '../docs/content', setName);
      await fs.mkdir(pagesDir, { recursive: true });
      const files = await fs.readdir(dstDirectoryPathSvg);

      await Promise.all(files.map((file) => main(file, pagesDir)));
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();
}

module.exports = buildPages;

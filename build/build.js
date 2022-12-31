const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');

const buildMetadata = require('./build-metadata');
const buildIcons = require('./build-icons');
const buildPages = require('./build-pages');
const normalizeConfig = require('./logic/normalize-config');

const rootDirectoryPath = path.normalize(path.join(__dirname, '..'));
const distDirectoryPath = path.join(rootDirectoryPath, 'dist');
const pagesDirectoryPath = path.join(rootDirectoryPath, 'docs/content');

fs.removeSync(distDirectoryPath);
fs.ensureDirSync(distDirectoryPath);
fs.removeSync(pagesDirectoryPath);
fs.ensureDirSync(pagesDirectoryPath);

const configName = 'build.config.json';
const configs = fs.readJsonSync(path.join(__dirname, configName));
if (!_.isEmpty(configs)) {
  configs.forEach((config) => {
    (async () => {
      const normalizedConfig = normalizeConfig(
        config,
        rootDirectoryPath,
        distDirectoryPath
      );
      await buildMetadata(normalizedConfig);
      await buildIcons(normalizedConfig);
      await buildPages(normalizedConfig);
    })();
  });
} else {
  console.log(`Error! Couldn't read file: ${configName}`);
}

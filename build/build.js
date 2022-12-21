const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');

const buildFromConfig = require('./logic/build-from-config');
const normalizeConfig = require('./logic/normalize-config');

const rootDirectoryPath = path.normalize(path.join(__dirname, '..'));
const distDirectoryPath = path.join(rootDirectoryPath, 'dist');

fs.removeSync(distDirectoryPath);
fs.ensureDirSync(distDirectoryPath);

const configName = 'build.config.json';
const configs = fs.readJsonSync(path.join(__dirname, configName));
if (!_.isEmpty(configs)) {
  configs.forEach((config) =>
    buildFromConfig(
      normalizeConfig(config, rootDirectoryPath, distDirectoryPath)
    )
  );
} else {
  console.log(`Error! Couldn't read file: ${configName}`);
}

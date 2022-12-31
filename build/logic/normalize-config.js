const path = require('path');

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
  normalizedConfig.svgo = path.join(
    rootDirectoryPath,
    'node_modules',
    '.bin',
    'svgo'
  );
  normalizedConfig.fontsDirectoryPath = path.join(rootDirectoryPath, `fonts`);
  return normalizedConfig;
}

module.exports = normalizeConfig;

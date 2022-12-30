const fs = require('fs-extra');
const path = require('path');

async function buildMetadata(config) {
  await Promise.all(
    config.svgDirectoryPaths.map((srcDirectoryPath) => {
      console.log(
        `    Building metadata for ${path.basename(srcDirectoryPath)}...`
      );
      if (!fs.existsSync(srcDirectoryPath)) {
        console.log(`    ${srcDirectoryPath} does not exist!`);
        return;
      }
      let json = [];
      if (fs.existsSync(path.join(srcDirectoryPath, 'metadata.json'))) {
        json = JSON.parse(
          fs.readFileSync(path.join(srcDirectoryPath, 'metadata.json'))
        );
      }
      const files = fs.readdirSync(srcDirectoryPath);
      files.forEach((file) => {
        if (path.extname(file) !== '.svg') return;
        const basename = path.basename(file, path.extname(file));
        const icon = json.find((i) => i.name === basename);
        if (!icon) {
          json.push({
            name: basename,
            tags: [],
            categories: [],
          });
        }
      });
      fs.writeFileSync(
        path.join(srcDirectoryPath, 'metadata.json'),
        JSON.stringify(json, null, 2)
      );
    })
  );
}

module.exports = buildMetadata;

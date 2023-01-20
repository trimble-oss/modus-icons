const fs = require('fs-extra');
const path = require('path');

async function buildMetadata(config) {
  const allConfigIcons = [];
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
      if (fs.existsSync(path.join(srcDirectoryPath, '_metadata.json'))) {
        json = JSON.parse(
          fs.readFileSync(path.join(srcDirectoryPath, '_metadata.json'))
        );
      }
      const metadataDefaults = {
        name: (name) => name,
        tags: [],
        categories: [],
        class: (name) => `modus-${name}`,
        ligature: (name) => name.replace(/-/g, '_'),
      };
      const files = fs.readdirSync(srcDirectoryPath);
      files.forEach((file) => {
        if (path.extname(file) !== '.svg') return;
        const basename = path.basename(file, path.extname(file));
        const icon = json.find((i) => i.name === basename);
        if (!icon && !allConfigIcons.includes(basename)) {
          json.push({
            name: metadataDefaults.name(basename),
            tags: metadataDefaults.tags(basename),
            categories: metadataDefaults.categories(basename),
            class: metadataDefaults.class(basename),
            ligature: metadataDefaults.ligature(basename),
          });
        }
        if (icon) {
          Object.keys(metadataDefaults).forEach((key) => {
            if (!icon[key] && typeof metadataDefaults[key] === 'function') {
              icon[key] = metadataDefaults[key](basename);
            }
          });
        }
        // Remove duplicate icons
        if (icon && allConfigIcons.includes(basename)) {
          const index = json.indexOf(icon);
          json.splice(index, 1);
        } else {
          allConfigIcons.push(basename);
        }
      });
      fs.writeFileSync(
        path.join(srcDirectoryPath, '_metadata.json'),
        JSON.stringify(json, null, 2)
      );
    })
  );
}

module.exports = buildMetadata;

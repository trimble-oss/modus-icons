const fs = require('fs-extra');
const path = require('path');

async function buildMetadata(config) {
  const allConfigIcons = [];
  const siteData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '_site-data.json'))
  );
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
      };
      const files = fs.readdirSync(srcDirectoryPath);
      files.forEach((file) => {
        if (path.extname(file) !== '.svg') return;
        const basename = path.basename(file, path.extname(file));
        const icon = json.find((i) => i.name === basename);
        if (!icon && !allConfigIcons.includes(basename)) {
          json.push({
            name: metadataDefaults.name(basename),
            tags: metadataDefaults.tags,
            categories: metadataDefaults.categories,
          });
        }
        if (icon) {
          Object.keys(metadataDefaults).forEach((key) => {
            if (!icon[key]) {
              if (typeof metadataDefaults[key] === 'function') {
                icon[key] = metadataDefaults[key](basename);
              } else {
                icon[key] = metadataDefaults[key];
              }
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
      // remove icons that no longer exist
      json = json.filter((icon) => {
        return fs.existsSync(path.join(srcDirectoryPath, `${icon.name}.svg`));
      });
      // sort icons
      json = json.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      // write metadata
      fs.writeFileSync(
        path.join(srcDirectoryPath, '_metadata.json'),
        JSON.stringify(json, null, 2)
      );
      // update site-data.json
      const dirSetName = path.basename(srcDirectoryPath).includes('material')
        ? `modus-${path.basename(srcDirectoryPath).split('-')[1]}`
        : path.basename(srcDirectoryPath);
      if (siteData.find((s) => s.setName === dirSetName)) {
        json.forEach((i) => {
          const icon = siteData
            .find((s) => s.setName === dirSetName)
            .icons.find((icon) => icon.name === i.name);
          if (icon) {
            icon.tags = i.tags;
            icon.categories = i.categories;
            icon.deprecated = i.deprecated || false;
            icon.useInstead = i.useInstead || '';
          } else {
            siteData
              .find((s) => s.setName === dirSetName)
              .icons.push({
                name: i.name,
                displayName: i.name
                  .replace(/-/g, ' ')
                  .replace(
                    /\w\S*/g,
                    (txt) =>
                      txt.charAt(0).toUpperCase() +
                      txt.substring(1).toLowerCase()
                  ),
                tags: i.tags,
                categories: i.categories,
                deprecated: i.deprecated || false,
                useInstead: i.useInstead || '',
              });
          }
        });
      } else {
        siteData.push({
          setName: dirSetName,
          displayName: path
            .basename(srcDirectoryPath)
            .replace(/-/g, ' ')
            .replace(
              /\w\S*/g,
              (txt) =>
                txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
            ),
          type: dirSetName.includes('modus') ? 'modus' : 'sector',
          icons: json.map((i) => {
            return {
              name: i.name,
              displayName: i.name
                .replace(/-/g, ' ')
                .replace(
                  /\w\S*/g,
                  (txt) =>
                    txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
                ),
              tags: i.tags,
              categories: i.categories,
              deprecated: i.deprecated || false,
              useInstead: i.useInstead || '',
            };
          }),
        });
      }
      fs.writeJSONSync(path.join(__dirname, '_site-data.json'), siteData, {
        spaces: 2,
      });
      fs.writeFileSync(
        path.join('app-components', 'src', 'app', '_data', 'site-data.ts'),
        `export const siteData = ${JSON.stringify(siteData, null, 2)};`
      );
    })
  );
}

module.exports = buildMetadata;

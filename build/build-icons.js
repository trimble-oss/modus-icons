const fs = require('fs-extra');
const { execSync } = require('child_process');
const webfontsGenerator = require('../libs/webfonts-generator');
const process = require('process');
const { loadConfig, optimize } = require('svgo');
const svgexport = require('svgexport');
const path = require('path');
const SVGSpriter = require('svg-sprite');

const PNG = process.argv.includes('--png') || process.argv.includes('-p');
const VERBOSE =
  process.argv.includes('--verbose') || process.argv.includes('-v');

const spriteConfig = require('./logic/sprite-config');
const copySvgs = require('./logic/copy-svgs');

const handleError = (error) => {
  if (error) {
    console.log(`        Fail! ${error}`);
  }
};

async function processFile(filepath, config, outDir) {
  const basename = path.basename(filepath, '.svg');

  const originalSvg = await fs.readFile(filepath, 'utf8');
  const { data: optimizedSvg } = await optimize(originalSvg, {
    path: filepath,
    ...config,
  });

  // svgo will always add a final newline when in pretty mode
  const resultSvg = optimizedSvg.trim();

  if (resultSvg !== originalSvg) {
    await fs.writeFile(filepath, resultSvg, 'utf8');
  }

  if (VERBOSE) {
    console.log(`- ${basename}`);
  }
}

function buildIcons(config) {
  (async () => {
    const setName = path.basename(config.distDirectoryPath);
    console.log(`Building ${setName} icons...`);
    console.log('_____________________________');

    const dstDirectoryPathSvg = path.join(config.distDirectoryPath, 'svg');
    fs.ensureDirSync(dstDirectoryPathSvg);

    const svgFilePaths = [];
    await Promise.all(
      config.svgDirectoryPaths.map((srcDirectoryPath) => {
        console.log(
          `    Copying... ${path.basename(
            srcDirectoryPath
          )} => ${dstDirectoryPathSvg}`
        );
        svgFilePaths.push(...copySvgs(srcDirectoryPath, dstDirectoryPathSvg));
      })
    );

    console.log(`    Generating ${setName} SVGs...`);
    fs.ensureDirSync(dstDirectoryPathSvg);
    try {
      const files = svgFilePaths;
      const svgoConfig = await loadConfig(
        path.join(__dirname, 'logic/svgo.config.js')
      );

      await Promise.all(
        files.map((file) => processFile(file, svgoConfig, dstDirectoryPathSvg))
      );
    } catch (error) {
      console.error(error);
      process.exit(1);
    }

    console.log(`    Generating ${setName} fonts...`);
    const dstDirectoryPathFonts = path.join(
      `${config.distDirectoryPath}`,
      `fonts`
    );
    fs.ensureDirSync(dstDirectoryPathFonts);
    webfontsGenerator(
      {
        files: svgFilePaths.sort(),
        dest: dstDirectoryPathFonts,
        fontName: 'modus-icons',
        fontHeight: 1000,
        normalize: true,
        ligature: true,
        ligatureName: function (name) {
          const ligatureName = name.replace(/[\s-]/g, '_');
          return ligatureName;
        },
        types: ['woff', 'woff2'],
        html: true,
        verbose: true,
        htmlTemplate: path.join(config.fontsDirectoryPath, 'html.hbs'),
        cssTemplate: path.join(config.fontsDirectoryPath, 'css.hbs'),
        templateOptions: {
          classPrefix: 'modus-',
          baseSelector: '.modus-icons',
        },
      },
      handleError
    );

    console.log(`    Generating ${setName} sprites...`);
    const dstDirectoryPathSprites = path.join(
      `${config.distDirectoryPath}`,
      `sprites`
    );
    fs.ensureDirSync(dstDirectoryPathSprites);
    spriteConfig.mode.symbol.dest = `./dist/${setName}/sprites`;
    const spriter = new SVGSpriter(spriteConfig);
    svgFilePaths.forEach((svgpath) => {
      try {
        spriter.add(svgpath, '', fs.readFileSync(svgpath, 'utf-8'));
        // console.log(`        Sprite added: ${path.basename(svgpath)}`);
      } catch (error) {
        console.error(
          `        Sprite add error: ${error}: ${path.basename(svgpath)}`
        );
      }
    });

    try {
      console.log(`        Compiling ${setName} sprites...`);
      const { result, data } = await spriter.compileAsync();
      console.log(`        Writing ${setName} sprites...`);
      for (const mode in result) {
        for (const resource in result[mode]) {
          fs.mkdirSync(path.dirname(result[mode][resource].path), {
            recursive: true,
          });
          fs.writeFileSync(
            result[mode][resource].path,
            result[mode][resource].contents
          );
        }
      }
      console.log(`        ${setName} sprites compiled!`);
    } catch (error) {
      console.error(`        ${setName} sprites compile error: ${error}`);
    }

    if (PNG) {
      console.log(`    Generating PNGs...`);
      const dstDirectoryPathPng24 = path.join(
        config.distDirectoryPath,
        'png',
        '24'
      );
      fs.ensureDirSync(dstDirectoryPathPng24);

      const dstDirectoryPathPng48 = path.join(
        config.distDirectoryPath,
        'png',
        '48'
      );
      fs.ensureDirSync(dstDirectoryPathPng48);

      svgFilePaths.forEach((svgFilePath) => {
        const fileName = new RegExp(
          `\\${path.sep}([^\\${path.sep}]+)\\.svg$`
        ).exec(svgFilePath)[1];
        svgexport.render(
          {
            input: svgFilePath,
            output: path.join(dstDirectoryPathPng24, `${fileName}.png 24:`),
          },
          handleError
        );
        svgexport.render(
          {
            input: svgFilePath,
            output: path.join(dstDirectoryPathPng48, `${fileName}.png 48:`),
          },
          handleError
        );
      });
    }
  })();
}

module.exports = buildIcons;

const fs = require('fs-extra');
const path = require('path');

const isSvg = require('./is-svg');

function copySvgs(srcDirectoryPath, dstDirectoryPath) {
  const svgFilePaths = [];
  fs.readdirSync(srcDirectoryPath).forEach((srcName) => {
    if (!isSvg(srcName)) {
      console.log(`        Skipping "${srcName}", not SVG`);
      return;
    }

    const srcPath = path.join(srcDirectoryPath, srcName);
    const dstName = srcName.replace(/[\s-]/g, '_');
    const dstPath = path.join(dstDirectoryPath, dstName);
    if (fs.existsSync(dstPath)) {
      console.log(`        Skipping "${dstName}", already exists`);
      return;
    }

    fs.copySync(srcPath, dstPath);
    svgFilePaths.push(dstPath);
  });
  return svgFilePaths;
}

module.exports = copySvgs;

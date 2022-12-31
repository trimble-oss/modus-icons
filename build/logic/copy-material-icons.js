const fs = require('fs-extra');

function copyMaterialIcons() {
  const destFolderPath = './icons/material';
  // fs.removeSync(destFolderPath);
  fs.ensureDirSync(destFolderPath);
  fs.removeSync('./icons/material/*.svg');

  const iconList = fs.readJSONSync('./icons/material/material_icons.json');
  iconList.forEach((icon) => {
    const iconParse = icon.split('/');
    let iconName = iconParse[iconParse.length - 1];
    iconName = iconName.replace(/ic_|_24px|_48px/g, '');
    fs.copyFile(icon, `${destFolderPath}/${iconName}`, (err) => {
      if (err) throw err;
      console.log(`${iconName} was copied to: ${destFolderPath}`);
    });
  });
}

module.exports = copyMaterialIcons;

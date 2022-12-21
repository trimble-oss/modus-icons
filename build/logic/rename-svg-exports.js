const fs = require("pn/fs");
const path = require("path");

fs.readdir(path.join(__dirname, "../svg", "transportation"), (err, files) => {
  files.forEach((file) => {
    if (file.indexOf(".svg") > 0) {
      let newName = file;
      if (/^(modus-icons_)/g.test(file)) {
        newName = file.replace(/^(modus-icons_)/g, "");
        fs.rename(
          "svg/transportation/" + file,
          "svg/transportation/" + newName
        );
        console.log("renamed " + file + " to " + newName);
      }
    }
  });
});

const copyfiles = require('copyfiles');
const { version } = require('../package.json');

copyfiles(['dist/**/*.*', `dist/${version}`], { up: 1 }, (res) => {
    console.log(`copied dist/**/*.* -> dist/${version}`);
});

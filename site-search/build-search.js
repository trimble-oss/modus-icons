const fs = require('fs-extra');
const path = require('path');
const concat = require('concat');
const childProcess = require('child_process');

console.log('Building site-search...');
console.log('_____________________________');
console.log('Copying assets...');
fs.ensureDirSync('preview/assets');
fs.copySync('../dist', 'preview/assets', { overwrite: true });

console.log('Building search component...');
childProcess.execSync('ng build --prod --output-hashing=none', {
  stdio: 'inherit',
});

console.log('Copying search component...');
concat(
  [
    'dist/site-search/runtime.js',
    'dist/site-search/polyfills.js',
    'dist/site-search/main.js',
  ],
  'preview/site-search.js'
);
concat(
  [
    'dist/site-search/runtime.js',
    'dist/site-search/polyfills.js',
    'dist/site-search/main.js',
  ],
  '../docs/assets/js/site-search.js'
);

console.log('Finished building site-search.');

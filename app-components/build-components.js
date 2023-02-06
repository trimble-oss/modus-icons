const fs = require('fs-extra');
const path = require('path');
const concat = require('concat');
const childProcess = require('child_process');

console.log('Building App Components...');
console.log('_____________________________');
console.log('Copying assets...');
fs.ensureDirSync('preview/assets');
fs.copySync('../dist', 'preview/assets', { overwrite: true });

console.log('Building app-component.js...');
childProcess.execSync('npx ng build --prod --output-hashing=none', {
  stdio: 'inherit',
});

console.log('Copying app-component.js...');
concat(
  [
    'dist/app-components/runtime.js',
    'dist/app-components/polyfills.js',
    'dist/app-components/main.js',
  ],
  'preview/app-components.js'
);
concat(
  [
    'dist/app-components/runtime.js',
    'dist/app-components/polyfills.js',
    'dist/app-components/main.js',
  ],
  '../docs/assets/js/app-components.js'
);

console.log('_____________________________');
console.log('Finished building app-components.');

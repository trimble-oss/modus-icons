module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'auto',
  overrides: [
    {
      files: '*.js',
      options: {
        parser: 'babel',
      },
    },
    {
      files: '*.svg',
      options: {
        printWidth: 5000,
        bracketSpacing: false,
        bracketSameLine: true,
        parser: 'xml',
        xmlSelfClosingSpace: false,
        xmlWhitespaceSensitivity: 'ignore',
      },
    },
  ],
};

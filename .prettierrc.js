module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  bracketSameLine: true,
  endOfLine: 'auto',
  overrides: [
    {
      files: '*.js',
      options: {
        parser: 'babel',
        singleQuote: true,
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
    {
      files: '_metadata.json',
      options: {
        printWidth: 15
      },
    },
  ],
};

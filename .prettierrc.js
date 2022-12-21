module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "auto",
  overrides: [
    {
      files: "*.js",
      options: {
        parser: "babel",
      },
    },
    {
      files: "*.ts",
      options: {
        parser: "typescript",
      },
    },
    {
      files: "*.md",
      options: {
        parser: "markdown",
      },
    },
    {
      files: "*.json",
      options: {
        parser: "json",
      },
    },
    {
      files: ".prettierrc",
      options: {
        parser: "json",
      },
    },
    {
      files: ".stylelintrc",
      options: {
        parser: "json",
      },
    },
    {
      files: "*.less",
      options: {
        parser: "less",
      },
    },
    {
      files: "*.template.html",
      options: {
        parser: "angular",
      },
    },
  ],
};

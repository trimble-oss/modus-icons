module.exports = {
  ...require('@tmx/prettier-config'),
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'angular'
      }
    }
  ]
}

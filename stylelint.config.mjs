/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard-scss"],
  ignoreFiles: ["**/*.min.css", "**/dist/**", "**/font/**", "**/vendor/**", "**/_site/**", "_modus-bootstrap-dark.scss"],
  rules: {
    "alpha-value-notation": null,
    "color-function-alias-notation": null,
    "color-function-notation": null,
    "hue-degree-notation": null,
    "media-feature-range-notation": null,
    "no-descending-specificity": null,
    "no-empty-source": null,
    "no-invalid-position-at-import-rule": null,
    "rule-empty-line-before": null,
    "scss/comment-no-empty": null,
    "scss/dollar-variable-colon-space-after": null,
    "scss/no-global-function-names": null,
  },
};

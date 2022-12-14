# Modus Icons

Open source icon library for Modus with over 500 icons.

## Install

Modus Icons are packaged up and published to npm. We only include the processed SVGs in this package - it's up to you and your team to implement. [Read our docs](https://modus-icons.trimble.com/) for usage instructions.

```shell
npm i @trimble-oss/modus-icons
```

## Usage

Depending on your setup, you can include Modus Icons in a handful of ways.

- Copy-paste SVGs as embedded HTML
- Reference via `<img>` element
- Use the SVG sprite
- Include via CSS

[See the docs for more information.](https://modus-icons.trimble.com)

## Development

[![Build Status](https://github.com/trimblemaps/modus-icons/workflows/Tests/badge.svg)](https://github.com/trimblemaps/modus-icons/actions?workflow=Tests)

Clone the repo, install dependencies, and start the Hugo server locally.

```shell
git clone https://github.com/trimble-oss/modus-icons/
cd icons
npm i
npm start
```

Then open `http://localhost:4000` in your browser.

### npm scripts

Here are some key scripts you'll use during development. Be sure to look to our `package.json` for a complete list of scripts.

| Script       | Description                                                    |
| ------------ | -------------------------------------------------------------- |
| `start`      | Alias for running `docs-serve`                                 |
| `docs-serve` | Starts a local Hugo server                                     |
| `pages`      | Generates permalink pages for each icon with template Markdown |
| `icons`      | Processes and optimizes SVGs in `icons` directory              |

## Adding SVGs

See the CONTRIBUTING.md guide for details.

## Publishing

Documentation is published automatically when a new Git tag is published. See our [GitHub Actions](https://github.com/trimblemaps/modus-icons/tree/main/.github/workflows) and [`package.json`](https://github.com/trimblemaps/modus-icons/blob/main/package.json) for more information.

## License

MIT

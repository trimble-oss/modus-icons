# Contributing

## Development

To get started, clone the repo, install dependencies, and run the build script.

```shell
git clone https://github.com/trimble-oss/modus-icons/
cd modus-icons
npm i
npm run build
```

## Viewing the docs locally

The site is built with Hugo and you can run a local server with the following command.

```shell
npm run docs:serve
```

Then open `http://localhost:4000` in your browser. If you add or change any icons, you'll need to run `npm run build` again to generate the new or changed pages.

### npm scripts

Here are some key scripts you'll use during development. Be sure to look to our `package.json` for a complete list of scripts.

| Script       | Description                                                            |
| ------------ | ---------------------------------------------------------------------- |
| `build`      | Optimize SVGs, create icon fonts, SVG sprites and output to `dist` dir |
| `docs:serve` | Starts a local Hugo server                                             |
| `test`       | Run tests on HTML, CSS, JavaScript and more                            |

## Adding SVGs

New glyphs are designed on a 24x24px grid, then exported as flattened SVGs. Once a new SVG icon has been added to the `icons` directory, we use an npm script to:

1. Optimize our SVGs with SVGO.
2. Modify the SVGs source code, removing all attributes before setting new attributes and values in our preferred order.

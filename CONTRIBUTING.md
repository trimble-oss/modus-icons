# Contributing

## Development

To get started, clone the repo, install dependencies, and run the build script.

You must use Node v16 to build the project.

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

## Adding Icons (SVGs)

New glyphs are designed on a 24x24px grid, then exported as flattened SVGs. Once a new SVG icon has been added to the `icons` directory, we use an npm script to:

1. Optimize our SVGs with SVGO.
2. Modify the SVGs source code, removing all attributes before setting new attributes and values in our preferred order.

### SVG Filenames

- Must be lowercase.
- Use dashes to separate words.
- Use dashes instead of spaces.
- Do not use underscores.
- Avoid Using -Alt modifiers in names unless absolutely necessary. Instead, focus on unique features of an icon and be descriptive.
- For Solid/Outline icons, follow the naming convention outlined at: <https://blog.fontawesome.com/icon-naming-conventions/>

### SVGs

- Must be 24x24px. (the first line of the SVG should be `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">`)
- Must be flattened.
- Should not use any color other than `currentColor`.
- Should not use transforms as these often cause inconsistencies when building.
- Must not include any stroke attributes. (these will be removed by the build script)
- Should not use any ids, styles, filters or xlink attributes. (these will be removed by the build script)
- Should not include any bitmap images
- Before submitting, preview at small sizes (16px, 24px, 32px) to confirm clarity.

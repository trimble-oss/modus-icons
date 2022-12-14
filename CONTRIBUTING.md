# Contributing

New glyphs are designed on a 24x24px grid, then exported as flattened SVGs with `fill` (no stroke). Once a new SVG icon has been added to the `icons` directory, we use an npm script to:

1. Optimize our SVGs with SVGO.
2. Modify the SVGs source HTML, removing all attributes before setting new attributes and values in our preferred order.

Use `npm run icons` to run the script, run `npm run pages` to build permalink pages, complete those pages, and, finally, commit the results in a new branch for updating.

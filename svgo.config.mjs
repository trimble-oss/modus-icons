export default {
  js2svg: {
    indent: 2, // number
    pretty: true, // boolean
    eol: "lf",
  },
  plugins: [
    {
      name: "preset-default",
    },
    "cleanupListOfValues",
    "sortAttrs",
    {
      name: "removeAttrs",
      params: {
        attrs: ["clip-rule", "data-name", "id"],
      },
    },
    { name: "removeXlink" },
  ],
};

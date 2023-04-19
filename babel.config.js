module.exports = {
  presets: [
    ["@babel/preset-env", { "modules": false }],
  ],
  plugins: [
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-transform-spread",
    '@babel/plugin-transform-classes',
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ["transform-es2015-arrow-functions", {spec: true}]
  ],
};

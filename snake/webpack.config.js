const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/game.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: "./src",
    open: true,
  },
};

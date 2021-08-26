const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const sveltePreprocess = require("svelte-preprocess");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

module.exports = {
  target: "web", // hot module replacement breaks if using "browserlist" for some reason
  entry: {
    bundle: ["./src/main.ts"],
  },
  resolve: {
    alias: {
      svelte: path.dirname(require.resolve("svelte/package.json")),
    },
    extensions: [".mjs", ".js", ".ts", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
  },
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "[name]-[contenthash].js",
    chunkFilename: "[name]-[contenthash].[id].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        // Chain babel and ts loader so we get type errors
        use: ["babel-loader", "ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            compilerOptions: {
              dev: !prod,
            },
            emitCss: prod,
            hotReload: !prod,
            preprocess: sveltePreprocess({
              sourceMap: !prod,
              // This is the only way I managed to get svelte-preprocess to use babel.config.json
              // There's definitely a better way to do this.
              babel: require("./babel.config.json"),
              // svelte-loader won't raise type errors for svelte files sadly :(,
              // you can use 'npm run validate' or vscode to check for those
              typescript: true,
            }),
          },
        },
      },
      {
        test: /\.css$/,
        // Tailwindcss is loaded as a postcss plugin (see postcss.config.json)
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        // required to prevent errors from Svelte on Webpack 5+
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  mode,
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      filename: "index.html",
      template: "./src/template.html",
      favicon: "./src/assets/favicon.png",
    }),
    new MiniCssExtractPlugin({
      // Using a hash breaks hot reloading, so only add a hash in production
      // Seems like the hot reload server relies on the css file keeping the same name
      filename: prod ? "[name]-[contenthash].css" : "[name].css",
    }),
  ],
  devtool: prod ? false : "source-map",
  devServer: {
    hot: true,
  },
};

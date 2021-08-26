const path = require("path");
const preprocess = require("svelte-preprocess");
const { ESBuildPlugin } = require("esbuild-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { WebpackPluginServe } = require("webpack-plugin-serve");
const WebpackBar = require("webpackbar");
const DotenvPlugin = require("dotenv-webpack");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const rawTypescriptConfig = require("../tsconfig.json");

exports.devServer = () => ({
  watch: true,
  plugins: [
    new WebpackPluginServe({
      port: 5555,
      static: path.resolve(process.cwd(), "dist"),
      historyFallback: true,
    }),
  ],
});

exports.page = () => ({
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      filename: "index.html",
      template: "./src/template.html",
      favicon: "./src/assets/favicon.png",
    }),
  ],
});

exports.generateSourceMaps = ({ type }) => ({ devtool: type });

exports.loadImages = ({ limit } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|webp)$/,
        type: "asset",
        parser: { dataUrlCondition: { maxSize: limit } },
      },
    ],
  },
});

exports.optimize = () => ({
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "all",
    },
    // runtimeChunk: { name: "runtime" },
    minimizer: [
      `...`,
      new CssMinimizerPlugin({
        minimizerOptions: { discardComments: { removeAll: true } },
      }),
    ],
  },
});

exports.analyze = () => ({
  plugins: [
    new BundleAnalyzerPlugin({
      generateStatsFile: true,
    }),
  ],
});

exports.typescript = () => ({
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ }],
  },
});

exports.loadSvg = () => ({
  module: { rules: [{ test: /\.svg$/, type: "asset" }] },
});

exports.postcss = () => ({
  loader: "postcss-loader",
});

exports.extractCSS = (mode, { options = {}, loaders = [] } = {}) => {
  const prod = mode === "production";
  return {
    module: {
      rules: [
        {
          test: /\.(p?css)$/,
          use: [
            { loader: MiniCssExtractPlugin.loader, options },
            "css-loader",
          ].concat(loaders),
          sideEffects: true,
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Using a hash breaks hot reloading, so only add a hash in production
        // Seems like the hot reload server relies on the css file keeping the same name
        filename: prod ? "[name]-[contenthash].css" : "[name].css",
      }),
    ],
  };
};

exports.svelte = (mode) => {
  const prod = mode === "production";

  return {
    resolve: {
      alias: {
        svelte: path.dirname(require.resolve("svelte/package.json")),
      },
      extensions: [".mjs", ".js", ".svelte", ".ts"],
      mainFields: ["svelte", "browser", "module", "main"],
    },
    module: {
      rules: [
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
              preprocess: preprocess({
                postcss: true,
                typescript: true,
              }),
            },
          },
        },
        {
          test: /node_modules\/svelte\/.*\.mjs$/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
  };
};

exports.esbuild = () => {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "esbuild-loader",
          options: {
            target: rawTypescriptConfig.compilerOptions.target,
          },
        },
        {
          test: /\.ts$/,
          loader: "esbuild-loader",
          options: {
            loader: "ts",
            target: rawTypescriptConfig.compilerOptions.target,
          },
        },
      ],
    },
    plugins: [new ESBuildPlugin()],
  };
};

exports.useWebpackBar = () => ({
  plugins: [new WebpackBar()],
});

exports.useDotenv = () => ({
  plugins: [new DotenvPlugin()],
});

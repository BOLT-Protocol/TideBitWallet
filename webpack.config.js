const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const frontend = {
  mode: "development",
  entry: path.resolve(__dirname, "src/frontend/main.js"),
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "javascript/popup.js",
    chunkFilename: "[id].js",
  },
  devServer: {
    watchOptions: {
      poll: true,
    },
    contentBase: path.join(__dirname, "build/"),
    compress: true,
    port: 9000,
  },

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "image/[name].[ext]", // 修改生成路徑
              esModule: false,
              publicPath: "../",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[id].css",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: "cheap-module-source-map",
};

const background = {
  mode: "development",
  entry: path.resolve(__dirname, "src/background.js"),
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "background.js",
    chunkFilename: "[id].js",
  },
  devServer: {
    watchOptions: {
      poll: true,
    },
    contentBase: path.join(__dirname, "build/"),
    compress: true,
    port: 9000,
  },
  devtool: "cheap-module-source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      crypto: require.resolve("crypto-browserify"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "./dist")],
    }),
  ],
};

module.exports = [frontend, background];

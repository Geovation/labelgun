'use strict';

var webpack = require('webpack');

module.exports = function(env) {

  var plugins = [];
  var outputFile = "./lib/labelgun.js";

  if (env && env.minified) {
    outputFile = "./lib/labelgun.min.js";
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }));
  }

  var config = {
    context: __dirname,
    // entry is the "main" source file we want to include/import
    entry: "./src/labelgun.js",
    // output tells webpack where to put the bundle it creates
    output: {
      // in the case of a "plain global browser library", this
      // will be used as the reference to our module that is
      // hung off of the window object.
      library: "labelgun",
      // We want webpack to build a UMD wrapper for our module
      libraryTarget: "umd",
      // the destination file name
      filename: outputFile
    },
    plugins: plugins,
    // externals let you tell webpack about external dependencies
    // that shouldn't be resolved by webpack.
    externals: [
      {
          rbush: "rbush"
      }
    ],
    module: {
      rules: [{
          use : [
            {
              loader: "babel-loader",
              options: {
                compact: false, // because I want readable output,
                presets: ['es2015']
              }
            }
          ]

      }]
    }
  } // End of config

  return config;

}

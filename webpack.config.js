var webpack = require('webpack');
var minimize = process.argv.indexOf('--minimize') !== -1;
var plugins = [];
var outputFile = "./lib/labelgun.js";

if (minimize) {
  outputFile = "./lib/labelgun.min.js";
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
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
      loaders: [
         // babel loader, testing for files that have a .js extension
         // (except for files in our node_modules folder!).
         {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
               compact: false, // because I want readable output,
               presets: ['es2015']
            }
         }
      ]
   }
};

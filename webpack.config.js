"use strict";

/* global module, require, __dirname */

var path = require("path");

module.exports = {
	entry: {
		app: './src/my-dropdown.js',
	},

	output: {
  		path: path.resolve(__dirname, "dist"),
		publicPath: "/static/",
    	filename: "my-dropdown.min.js",
    	libraryTarget: "umd",
    	sourceMapFilename: "[file].map"
    },
    
	devtool: "#source-map",

	module:{
		loaders: [
			{
				test: /\.vue$/,
				exclude: /node_modules/,
				loader: 'vue'
			},

			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
		]
	},

	externals: {
		"jquery": {
			commonjs: "jquery",
			commonjs2: "jquery",
			amd: "jquery",
			root: "$",
		},

		"vue": {
			commonjs: "vue",
			commonjs2: "vue",
			amd: "vue",
			root: "Vue",
		}
	}
};
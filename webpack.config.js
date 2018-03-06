const path = require('path');
const webpack = require('webpack');
const ChunkStatsPlugin = require('./plugins/ChunkStatsPlugin');
const RuntimePublicPathPlugin = require('./plugins/RuntimePublicPathPlugin');
const ChunkManifestReplacePlugin = require('./plugins/ChunkManifestReplacePlugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isProd = process.env.npm_config_prod_mode || false;

let plugins = [
	new ChunkStatsPlugin(),
	new BundleAnalyzerPlugin({
		analyzerMode: 'static',
		openAnalyzer: false
	}),
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: isProd
				? JSON.stringify('production')
				: JSON.stringify('development')
		}
	})
];

plugins.concat([
	new RuntimePublicPathPlugin({
		publicPathCallback: 'window.setPublicPath'
	}),
	new ChunkManifestReplacePlugin({
		replacer: 'window.ClientFileStats'
	})
]);

module.exports = {
	entry: {
		main: './src'
	},
	devtool: 'source-map',
	output: {
		filename:
			'[name].js' /*isProd ? '[name].[chunkhash].js' : '[name].js'*/,
		path: path.join(__dirname, 'build'),
		chunkFilename:
			'[name].js' /*isProd ? '[name].[chunkhash].js' : '[name].js'*/,
		publicPath: '../build/'
	},
	mode: 'none',
	module: {
		rules: [
			{
				test: /.\js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['babel-preset-env', 'babel-preset-react'],
							cacheDirectory: true
						}
					}
				],
				exclude: /node_modules/
			}
		]
	},
	plugins: plugins,
	optimization: {
		minimize: JSON.parse(isProd),
		splitChunks: {
			cacheGroups: {
				default: false,
				'react.vendor': {
					chunks: 'all',
					minChunks: 1,
					test: module => {
						let { userRequest } = module;
						return (
							userRequest.indexOf(
								'node_modules' + path.sep + 'react'
							) >= 0
						);
					},
					name: 'react.vendor'
				},
				vendor: {
					chunks: 'all',
					minChunks: 1,
					test: module => {
						let { userRequest } = module;
						return (
							userRequest.indexOf('node_modules') >= 0 &&
							userRequest.indexOf(
								'node_modules' + path.sep + 'react'
							) === -1
						);
					},
					name: 'vendor'
				}
			}
		}
	}
};

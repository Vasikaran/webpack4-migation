const path = require('path');
const webpack = require('webpack');
const ChunkStatsPlugin = require('./plugins/ChunkStatsPlugin');
const RuntimePublicPathPlugin = require('./plugins/RuntimePublicPathPlugin');
const ChunkManifestReplacePlugin = require('./plugins/ChunkManifestReplacePlugin');
const OptimizeJSPlugin = require('./plugins/OptimizeJSPlugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const UnusedFilesShowPlugin = require('./plugins/UnusedFilesShowPlugin');

const isProd = process.env.npm_config_prod_mode || false;

let plugins = [
	new ChunkStatsPlugin(),
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: isProd
				? JSON.stringify('production')
				: JSON.stringify('development')
		}
	}),
	new UnusedFilesShowPlugin({
		usedFilesExcludes: ['node_modules'],
		origin: path.join(__dirname, 'src'),
		delete: false
	})
];
if (isProd) {
	plugins = plugins.concat([
		new RuntimePublicPathPlugin({
			publicPathCallback: 'window.setPublicPath'
		}),
		new ChunkManifestReplacePlugin({
			replacer: 'window.ClientFileStats'
		})
	]);
}

module.exports = {
	entry: {
		main: './src'
	},
	devtool: isProd ? 'hidden-source-map' : 'source-map',
	output: {
		filename: isProd ? 'js/[name].[chunkhash].js' : 'js/[name].js',
		path: path.join(__dirname, 'build'),
		chunkFilename: isProd ? 'js/[name].[chunkhash].js' : 'js/[name].js',
		publicPath: '../build/',
		sourceMapFilename: 'smap/[name].[chunkhash].map'
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
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
							localIdentName: '[name]__[local]__[hash:base64:5]'
						}
					}
				]
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
							userRequest &&
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
							userRequest &&
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

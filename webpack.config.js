const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env, argv) => {
	function isDev() {
		return argv.mode === 'development';
	}

	var config = {
		entry: {
			admin: './src/admin.js',
			editor: './src/editor.js',
			script: './src/script.js',
			'3d-viewer': './src/blocks/3d-viewer/script.js',
			'alert': './src/blocks/alert/script.js',
			'animated-text': './src/blocks/animated-text/script.js',
			'button-group': './src/blocks/button-group/script.js',
			'cards': './src/blocks/cards/script.js',
			'chart': './src/blocks/chart/script.js',
			'countdown': './src/blocks/countdown/script.js',
			'counters': './src/blocks/counters/script.js',
			'feature-boxes': './src/blocks/feature-boxes/script.js',
			'flip-boxes': './src/blocks/flip-boxes/script.js',
			'gif': './src/blocks/gif/script.js',
			'image-comparison': './src/blocks/image-comparison/script.js',
			'image-gallery': './src/blocks/image-gallery/script.js',
			'info-box': './src/blocks/info-box/script.js',
			'lottie-player': './src/blocks/lottie-player/script.js',
			'mailto': './src/blocks/mailto/script.js',
			'posts': './src/blocks/posts/script.js',
			'price-lists': './src/blocks/price-lists/script.js',
			'pricing-table': './src/blocks/pricing-table/script.js',
			'qr-code': './src/blocks/qr-code/script.js',
			'row': './src/blocks/row/script.js',
			'section-heading': './src/blocks/section-heading/script.js',
			'services': './src/blocks/services/script.js',
			'shape-divider': './src/blocks/shape-divider/script.js',
			'slider': './src/blocks/slider/script.js',
			'social-share': './src/blocks/social-share/script.js',
			'team-members': './src/blocks/team-members/script.js',
			'video': './src/blocks/video/script.js'
		},
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'dist')
		}, // Output

		optimization: {
			minimizer: [
				new TerserPlugin({
					extractComments: false
				}), // Minifying JS
				new CssMinimizerPlugin(), // Minifying css
			]
		}, // Optimization

		plugins: [
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: [
					'**/*',
					'!editor.asset.php',
					'!script.asset.php'
				]
			}), // Re generate 'dist' folder
			new MiniCssExtractPlugin({
				chunkFilename: '[id].css',
				filename: (chunkData) => {
					return chunkData.chunk.name === 'script' ? 'style.css' : '[name].css';
				}
			}), // Separate file for css
			new ESLintPlugin()
		], // Plugins

		devtool: isDev() ? 'cheap-module-source-map' : 'source-map', // Source map

		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-env',
								['@babel/preset-react', {
									// 'pragma': 'wp.element.createElement',
									// 'pragmaFrag': 'wp.element.Fragment',
									'development': isDev()
								}]
							]
						} // Options
					} // Use
				}, // JS rule

				{
					test: /\.(s[ac]|c)ss$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: [
										autoprefixer()
									]
								}
							}
						},
						'sass-loader'
					]
				}, // CSS rule

				{
					test: /\.(png|jpe?g|gif|svg)$/i,
					loader: 'file-loader',
					options: {
						name: '[path][name].[ext]',
					},
				} // File rule
			] // Rules
		}, // Module

		externals: {
			'@wordpress/blob': ['wp', 'blob'],
			'@wordpress/block-editor': ['wp', 'blockEditor'],
			'@wordpress/blocks': ['wp', 'blocks'],
			'@wordpress/components': ['wp', 'components'],
			'@wordpress/compose': ['wp', 'compose'],
			'@wordpress/data': ['wp', 'data'],
			'@wordpress/element': ['wp', 'element'],
			'@wordpress/html-entities': ['wp', 'htmlEntities'],
			'@wordpress/i18n': ['wp', 'i18n'],
			'@wordpress/rich-text': ['wp', 'richText'],
			'react': 'React',
			'react-dom': 'ReactDOM'
		} // Externals
	};
	return config;
}
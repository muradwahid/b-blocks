const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const removeBlocksFromBuild = require('./remove-block-in-build');

const plugins = defaultConfig.plugins.filter(p => {
	if (Object.values(p).length === 2 && Object.values(p)?.[1]['filename'] && Object.values(p)?.[1]['filename'] === '[name]-rtl.css') {
		return false;
	}
	return true;
}).map(p => {
	if (p.constructor?.name === 'MiniCssExtractPlugin') {
		p.options.ignoreOrder = true;
	}
	return p;
});

const defaultEntry = Object.fromEntries(
	Object.entries(defaultConfig.entry()).filter(([key, __]) => !key.includes('index'))
);

const entry = {
	...defaultEntry,
	index: './src/index.js',
	script: './src/script.js',
	'admin-dashboard': './src/admin/dashboard.js',
	'template-library': './src/backend/template-library.js',
	advanced: '../bpl-tools/Advanced/style.js',
	'cursor/cursor': './src/customCursor/customCursor.js',
	'cursor/settings': './src/customCursor/Settings.js',
	'b-blocks-ai/content-generate-ai': './src/backend/ContentGenerateApi/ContentGenerateApi.js'
};

module.exports = {
	...defaultConfig,
	entry,
	plugins: [
		...plugins,
		new ESLintPlugin(),
		{
			apply(compiler) {
				compiler.hooks.afterEmit.tap('RemoveBlocksFromBuild', removeBlocksFromBuild);
			}
		}
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				extractComments: false,
				parallel: true,
				terserOptions: {
					compress: { passes: 2 },
					mangle: { reserved: ['__', '_n', '_nx', '_x'] },
					format: {
						comments: /translators:/i,
						max_line_len: 8000,
					},
				},
			}),
		],
	},
};

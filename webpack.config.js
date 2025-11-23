const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const ESLintPlugin = require('eslint-webpack-plugin');

const plugins = defaultConfig.plugins.filter(p => {
	if (Object.values(p).length === 2 && Object.values(p)?.[1]['filename'] && Object.values(p)?.[1]['filename'] === '[name]-rtl.css') {
		return false;
	}
	return true;
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
	'b-blocks-ai/content-generate-ai':'./src/backend/ContentGenerateApi/ContentGenerateApi.js'
};

module.exports = {
	...defaultConfig,
	entry,
	plugins: [
		...plugins,
		new ESLintPlugin()
	],
	optimization: {}
};
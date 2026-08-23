const fs = require('fs');
const path = require('path');
const { removeBlocks } = require('./webpack-remove-block');

const buildDir = path.join(__dirname, 'build');

function removeBlocksFromBuild() {
	removeBlocks.forEach(blockName => {
		const blockDir = path.join(buildDir, blockName);

		if (fs.existsSync(blockDir)) {
			fs.rmSync(blockDir, { recursive: true, force: true });
			// console.log(`Removed build/${blockName}`);
		}
	});
}

module.exports = removeBlocksFromBuild;

if (require.main === module) {
	removeBlocksFromBuild();
}

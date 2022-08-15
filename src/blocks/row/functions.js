import { select, dispatch } from '@wordpress/data';
const { getBlocks, getBlockAttributes } = select('core/block-editor');
const { updateBlockAttributes } = dispatch('core/block-editor');
// const updateAttributes = (id, args) => dispatch('core/block-editor').updateBlockAttributes(id, args);

export const calcPercentage = (child, parent) => 100 * parseFloat(child / parent);
export const elWidth = el => parseInt(el?.clientWidth);
export const elHeight = el => parseInt(el?.clientHeight);
export const getInt = str => parseInt(str.match(/\d+/g)[0]);
export const twoFixed = val => parseFloat(val.toFixed(2));

export const updateChildWidth = (parentId, newDesktopWidth) => {
	getBlocks(parentId).forEach(block => {
		const clientId = block.clientId;
		const prevWidth = getBlockAttributes(clientId)?.width;

		updateBlockAttributes(clientId, { width: { ...prevWidth, desktop: newDesktopWidth } });
		const blockEl = document.querySelector(`#block-${clientId}`);
		if (blockEl) {
			blockEl.style.width = newDesktopWidth + '%';
		}
	});
}
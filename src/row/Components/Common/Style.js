import { getBackgroundCSS, getBorderCSS, getShadowCSS, getSpaceCSS } from '../../../../../bpl-tools/utils/getCSS';

import { rowPrefix } from '../../utils/data';

const Style = ({ attributes, id, isBackend = false }) => {
	const {columnGap, height, columnPositionY, columnPositionX, overflow, background, padding, border, shadow } = attributes;

	const rowSl = `#${id} .${rowPrefix}`;

	const blockListLayout = `${rowSl} >.block-editor-inner-blocks >.block-editor-block-list__layout`;

	const selector = isBackend ? blockListLayout : rowSl;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${selector}{
			gap: ${columnGap};
			overflow: ${overflow};
			${getBackgroundCSS(background)}
			padding: ${getSpaceCSS(padding)};
			${getBorderCSS(border)}
			box-shadow: ${getShadowCSS(shadow)};
		}
		${selector}{
			min-height: ${height};
			align-items: ${columnPositionY};
			justify-content: ${columnPositionX};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;
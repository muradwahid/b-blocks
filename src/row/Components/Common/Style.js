import { getBackgroundCSS, getBorderCSS, getShadowCSS, getSpaceCSS } from '../../../../../bpl-tools/utils/getCSS';

import { rowPrefix, colPrefix } from '../../utils/data';

const Style = ({ attributes, id, isBackend = false }) => {
	const { columnGap, height, columnPositionY, columnPositionX, overflow, background, padding, border, shadow } = attributes;

	const rowSl = `#${id} .${rowPrefix}`;

	const blockListLayout = `${rowSl} >.block-editor-inner-blocks >.block-editor-block-list__layout`;

	const selector = isBackend ? blockListLayout : rowSl;

	const innerCount = document.querySelector(selector)?.children?.length;
	const totalInnerBlocks = isBackend ? innerCount - 1 : innerCount;
	const totalGap = parseInt(columnGap) * (totalInnerBlocks - 1);
	const gapPerCol = totalGap / totalInnerBlocks;

	const colCls = '.wp-block-b-blocks-column:not(.wp-block)';
	const backBlockSl = `${blockListLayout} >.block-editor-block-list__block`;
	const frontColSl = `${rowSl} ${colCls}`;

	const childColumn = isBackend ? `${blockListLayout} ${colCls}` : `${frontColSl} .${colPrefix}`;
	const firstChildCol = isBackend ? `${backBlockSl}:first-child ${colCls}` : `${frontColSl}:first-child .${colPrefix}`;
	const lastChildCol = isBackend ? `${backBlockSl}:nth-last-child(2) ${colCls}` : `${frontColSl}:last-child .${colPrefix}`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${rowSl}{
			row-gap: ${columnGap};
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
		${childColumn}{
			margin: 0 calc( ${gapPerCol}px / 2 );
		}
		${firstChildCol}{
			margin: 0 ${gapPerCol}px 0 0;
		}
		${lastChildCol}{
			margin: 0 0 0 ${gapPerCol}px;
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;
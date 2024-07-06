import { getBackgroundCSS, getBorderCSS, getShadowCSS, getSpaceCSS } from '../../../../Components/utils/getCSS';

const Style = ({ attributes, clientId, isBackend = false }) => {
	const { columnGap, height, columnPositionY, columnPositionX, overflow, background, padding, border, shadow } = attributes;

	const blockListLayout = `#bBlocksRow-${clientId} .bBlocksRow >.block-editor-inner-blocks >.block-editor-block-list__layout`;
	const rowSelect = `#bBlocksRow-${clientId} .bBlocksRow`;

	const selector = isBackend ? blockListLayout : rowSelect;

	const innerCount = document.querySelector(selector)?.children?.length;
	const totalInnerBlocks = isBackend ? innerCount - 1 : innerCount;
	const totalGap = parseInt(columnGap) * (totalInnerBlocks - 1);
	const gapPerCol = totalGap / totalInnerBlocks;

	const childColumn = isBackend ? `${blockListLayout} .wp-block-b-blocks-column` : `${rowSelect} .wp-block-b-blocks-column .bBlocksColumn`;

	const firstChildCol = isBackend ? `${blockListLayout} .block-editor-block-list__block:first-child .wp-block-b-blocks-column` : `${rowSelect} .wp-block-b-blocks-column:first-child .bBlocksColumn`;
	const lastChildCol = isBackend ? `${blockListLayout} .block-editor-block-list__block:nth-last-child(2) .wp-block-b-blocks-column` : `${rowSelect} .wp-block-b-blocks-column:last-child .bBlocksColumn`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${rowSelect}{
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
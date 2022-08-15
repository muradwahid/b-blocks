const Style = ({ attributes, clientId, isBackend = false }) => {
	const { columnGap, height, verticalPosition, background, padding, border, shadow } = attributes;

	const blockListLayout = `#bBlocksRow-${clientId} .bBlocksRow >.block-editor-inner-blocks >.block-editor-block-list__layout`;
	const rowSelect = `#bBlocksRow-${clientId} .bBlocksRow`;

	const selector = isBackend ? blockListLayout : rowSelect;

	const childColumn = isBackend ? `${blockListLayout} .wp-block-b-blocks-column` : `${rowSelect} .wp-block-b-blocks-column`;

	const firstChildCol = isBackend ? `${blockListLayout} .block-editor-block-list__block:first-child .wp-block-b-blocks-column` : `${rowSelect} .wp-block-b-blocks-column:first-child`;
	const lastChildCol = isBackend ? `${blockListLayout} .block-editor-block-list__block:nth-last-child(2) .wp-block-b-blocks-column` : `${rowSelect} .wp-block-b-blocks-column:last-child`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${rowSelect}{
			${background?.styles || 'background-color: #f5f5f5;'}
			padding: ${padding?.styles || '50px 5px'};
			${border?.styles || ''}
			box-shadow: ${shadow?.styles || 'none'};
		}
		${selector}{
			min-height: ${height};
			align-items: ${verticalPosition};
		}
		${childColumn}{
			background-color: red;
			margin: 0 calc( ${columnGap} / 2 );
		}
		${firstChildCol}{
			margin-left: 0;
		}
		${lastChildCol}{
			margin-right: 0;
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;
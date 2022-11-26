const Style = ({ attributes, clientId, isBackend = false }) => {
	const { columnGap, height, columnPositionY, columnPositionX, overflow, background, padding, border, shadow } = attributes;

	const blockListLayout = `#bBlocksRow-${clientId} .bBlocksRow >.block-editor-inner-blocks >.block-editor-block-list__layout`;
	const rowSelect = `#bBlocksRow-${clientId} .bBlocksRow`;

	const selector = isBackend ? blockListLayout : rowSelect;

	const childColumn = isBackend ? `${blockListLayout} .wp-block-b-blocks-column` : `${rowSelect} .wp-block-b-blocks-column .bBlocksColumn`;

	// const firstChildCol = isBackend ? `${blockListLayout} .block-editor-block-list__block:first-child .wp-block-b-blocks-column` : `${rowSelect} .wp-block-b-blocks-column:first-child .bBlocksColumn`;
	// const lastChildCol = isBackend ? `${blockListLayout} .block-editor-block-list__block:nth-last-child(2) .wp-block-b-blocks-column` : `${rowSelect} .wp-block-b-blocks-column:last-child .bBlocksColumn`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${rowSelect}{
			row-gap: ${columnGap};
			overflow: ${overflow};
			${background?.styles || 'background-color: #f5f5f5;'}
			padding: ${padding?.styles || '50px 0px'};
			${border?.styles || ''}
			box-shadow: ${shadow?.styles || 'none'};
		}
		${selector}{
			min-height: ${height};
			align-items: ${columnPositionY};
			justify-content: ${columnPositionX};
		}
		${childColumn}{
			margin: 0 calc( ${columnGap} / 2 );
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;
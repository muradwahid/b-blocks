import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

const Style = ({ attributes, id }) => {
	const { content, styles, datatableStyles } = attributes;
	const { content: contentStyle, header, body, cells, footer } = styles;
	const { column, search, recordInfo, pageLength, pagination, buttons } = datatableStyles;


	const mainSl = `#${id}`;
	const containerSl = `${mainSl} .b-blocks-table-main-container`;
	const tHeadSl = `${containerSl} :where(.wp-block-b-blocks-table-head)`;
	const tBodySl = `${containerSl} .wp-block-b-blocks-table-body`;
	const tFooterSl = `${containerSl} :where(.wp-block-b-blocks-table-footer)`;
	const tRow = `${tBodySl} .wp-block-b-blocks-table-row`;
	const tCell = `${tRow} .wp-block-b-blocks-table-cell`;
	const tHeadCell = `${containerSl} :where(.b-blocks-table-head-cell)`;
	const tFooterCell = `${containerSl} :where(.b-blocks-table-footer-cell)`;

	//data table styles 
	const dtContainerSl = `${mainSl} .dt-container`;
	const dtRowSl = `${dtContainerSl} .dt-layout-row`;
	const dtCellSl = `${dtRowSl} .dt-layout-cell`;
	const dtSearchSl = `${dtCellSl} .dt-search`;
	const dtLengthSl = `${dtCellSl} .dt-length`;
	const dtInfoSl = `${dtCellSl} .dt-info`;
	const paginationBtnSl = `${dtCellSl}>.dt-paging>nav>.dt-paging-button`;
	const exportBtnSl = `${dtCellSl} .dt-buttons .dt-button`;

	const columnSl = `${containerSl}>colgroup>col`;

	return <style dangerouslySetInnerHTML={{
		__html: `

		${getTypoCSS('', cells.typography).googleFontLink}
		${getTypoCSS('', header.typography).googleFontLink}
		${getTypoCSS('', search.label.typo).googleFontLink}
		${getTypoCSS('', search.input.typo).googleFontLink}
		${getTypoCSS('', recordInfo.typo).googleFontLink}
		${getTypoCSS('', pageLength.typo).googleFontLink}
		${getTypoCSS('', pagination.typo).googleFontLink}
		${getTypoCSS('', buttons.typo).googleFontLink}

		${getTypoCSS(tCell, cells.typography).styles}
		${getTypoCSS(`${tHeadCell} .wp-block-paragraph`, header.typography).styles}
		${getTypoCSS(`${dtSearchSl}>label`, search.label.typo).styles}
		${getTypoCSS(`${dtSearchSl}>.dt-input`, search.input.typo).styles}
		${getTypoCSS(`${dtInfoSl}`, recordInfo.typo).styles}
		${getTypoCSS(`${dtLengthSl}>label`, pageLength.typo).styles}
		${getTypoCSS(`${paginationBtnSl}`, pagination.typo).styles}
		${getTypoCSS(`${exportBtnSl}`, buttons.typo).styles}

		${mainSl}{
			${isValidCSS('justify-content', contentStyle.align.desktop)}
		}

		${containerSl}{
			${isValidCSS('width', contentStyle.width.desktop)}
			${isValidCSS('border-radius', getBoxCSS(contentStyle.normal.radius.desktop))}
		}
			
		${containerSl}, ${containerSl} .wp-block-b-blocks-table-cell{
			border-collapse: ${content.cellBorderType};
			${content.cellBorderType === 'separate' ? 'border-spacing: 2px;' : ''}
			${getBorderBoxCSS(contentStyle.normal.border)}
		}

		${containerSl}:hover,
		${containerSl}:hover .wp-block-b-blocks-table-cell{
			${getBorderBoxCSS(contentStyle.hover.border)}
			border-collapse: ${content.cellBorderType};
			${content.cellBorderType === 'separate' ? 'border-spacing: 2px;' : ''}
		}

		${tHeadSl}>.wp-block-b-blocks-table-row {
			${getBackgroundCSS(header.normal.bg)}
			transition:all ${header.normal.transition}s ease-in-out;
		}
		${tHeadSl}>.wp-block-b-blocks-table-row:hover{
			${getBackgroundCSS(header.hover.bg)}
		}

		${tHeadCell}{
			${isValidCSS('color', header.normal.color)}
			${isValidCSS('padding', getBoxCSS(header.normal.padding.desktop))}
		}

		${tHeadCell}:hover{
			${isValidCSS('color', header.hover.color)}
			${isValidCSS('padding', getBoxCSS(header.hover.padding.desktop))}
		}

		${tBodySl}{
			${getBackgroundCSS(body.normal.bg)}
			transition:all ${body.normal.transition}s ease-in-out;
		}

		${tBodySl}:hover{
			${getBackgroundCSS(body.hover.bg)}
		}

		${tCell}{
			${getBorderBoxCSS(tCell.border)}
			${isValidCSS('padding', getBoxCSS(cells.desktop.padding))}
			${isValidCSS('border-radius', getBoxCSS(cells.desktop.radius))}
			transition: all ${cells.evenCell.normal.transition}s ease-in-out;
			
		}

		${tRow}:nth-of-type(even){
			${getBackgroundCSS(cells.evenCell.normal.bg)}
		}
		
		${tRow}:nth-of-type(even):hover{
			${getBackgroundCSS(cells.evenCell.hover.bg)}
		}

		${tRow}:nth-of-type(odd){
			${getBackgroundCSS(cells.oddCell.normal.bg)}
		}
		${tRow}:nth-of-type(odd):hover{
			${getBackgroundCSS(cells.oddCell.hover.bg)}
		}

		${tRow}:nth-of-type(even) .wp-block-b-blocks-table-cell{
			${isValidCSS('color', cells.evenCell.normal.color)}
		}
		
		${tRow}:nth-of-type(even):hover .wp-block-b-blocks-table-cell{
			${isValidCSS('color', cells.evenCell.hover.color)}
		}

		${tRow}:nth-of-type(odd) .wp-block-b-blocks-table-cell{
			${isValidCSS('color', cells.oddCell.normal.color)}
		}
		${tRow}:nth-of-type(odd):hover .wp-block-b-blocks-table-cell{
			${isValidCSS('color', cells.oddCell.hover.color)}
		}

		${tFooterSl}>.wp-block-b-blocks-table-row{
			${getBackgroundCSS(footer.normal.bg)}
		}
		${tFooterSl}>.wp-block-b-blocks-table-row:hover{
			${getBackgroundCSS(footer.hover.bg)}
		}
		${tFooterCell}{
			${isValidCSS('padding', getBoxCSS(footer.padding.desktop))}
			${isValidCSS('color', footer.normal.color)}
		}
		${tFooterCell}:hover{
			${isValidCSS('color', footer.hover.color)}
		}

		${dtSearchSl}>label{
			${isValidCSS('color', search.label.color)}
			${getBackgroundCSS(search.label.bg)}
			${isValidCSS('padding',getBoxCSS(search.label.desktop.padding))}
			${isValidCSS('margin',getBoxCSS(search.label.desktop.margin))}
		}

		${dtSearchSl}>.dt-input{
				${isValidCSS('padding', getBoxCSS(search.input.desktop.padding))}
				${isValidCSS('margin', getBoxCSS(search.input.desktop.margin))}
				${isValidCSS('color', search.input.normal.color)}
				${getBackgroundCSS(search.input.normal.bg)}
				${getBorderBoxCSS(search.input.normal.border)}
				${isValidCSS('border-radius', getBoxCSS(search.input.normal.radius))}
				transition: all ${search.input.normal.transition}s ease-in-out;
				
		}

		${dtSearchSl}>.dt-input:hover{
			${isValidCSS('color', search.input.hover.color)}
			${getBackgroundCSS(search.input.hover.bg)}
			${getBorderBoxCSS(search.input.hover.border)}
			${isValidCSS('border-radius', getBoxCSS(search.input.hover.radius))}
		}

		${dtSearchSl}>.dt-input:focus{
			${isValidCSS('color', search.input.focus.color)}
			${getBackgroundCSS(search.input.focus.bg)}
			${getBorderBoxCSS(search.input.focus.border)}
			${isValidCSS('border-radius', getBoxCSS(search.input.focus.radius))}
		}

		${dtInfoSl}{
			${isValidCSS('padding', getBoxCSS(recordInfo.desktop.padding))}
			${isValidCSS('margin', getBoxCSS(recordInfo.desktop.margin))}
			${isValidCSS('color', recordInfo.color)}
			${getBackgroundCSS(recordInfo.bg)}
		}

		${dtLengthSl}>label{
			${isValidCSS('color', pageLength.color)}
			${getBackgroundCSS(pageLength.bg)}
			${isValidCSS('padding',getBoxCSS(pageLength.desktop.padding))}
			${isValidCSS('margin',getBoxCSS(pageLength.desktop.margin))}
		}

		${paginationBtnSl}{
			${isValidCSS('padding', getBoxCSS(pagination.desktop.padding),true)}
			${isValidCSS('margin', getBoxCSS(pagination.desktop.margin),true)}
			${isValidCSS('color', pagination.normal.color,true)}
			${getBackgroundCSS(pagination.normal.bg)}
			${getBorderBoxCSS(pagination.normal.border)}
			${isValidCSS('border-radius', getBoxCSS(pagination.normal.radius))}
			transition: all ${pagination.normal.transition}s ease-in-out;
		}
		${paginationBtnSl}:hover{
			${isValidCSS('color', pagination.hover.color,true)}
			${getBackgroundCSS(pagination.hover.bg)}
			${getBorderBoxCSS(pagination.hover.border)}
			${isValidCSS('border-radius', getBoxCSS(pagination.hover.radius))}
		}
		${paginationBtnSl}.current{
			${isValidCSS('color', pagination.active.color,true)}
			${getBackgroundCSS(pagination.active.bg)}
			${getBorderBoxCSS(pagination.active.border)}
			${isValidCSS('border-radius', getBoxCSS(pagination.active.radius))}
		}

		${exportBtnSl}{
			${isValidCSS('padding', getBoxCSS(buttons.desktop.padding))}
			${isValidCSS('color', buttons.normal.color)}
			${getBackgroundCSS(buttons.normal.bg)}
			${getBorderBoxCSS(buttons.normal.border)}
			${isValidCSS('border-radius', getBoxCSS(buttons.normal.radius))}
			transition: all ${buttons.normal.transition}s ease-in-out;
		}
		${exportBtnSl}:hover{
			${isValidCSS('color', buttons.hover.color)}
			${getBackgroundCSS(buttons.hover.bg)}
			${getBorderBoxCSS(buttons.hover.border)}
			${isValidCSS('border-radius', getBoxCSS(buttons.hover.radius))}
		}

		${column.map((cl,idx) => `
			${columnSl}[data-dt-column="${idx}"]{
				${isValidCSS('color', cl.color)}
				${getBackgroundCSS(cl.bg)}
			}
		`).join('')}

	`}} />;
}
export default Style;
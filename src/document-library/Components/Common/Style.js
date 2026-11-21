import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';

const Style = ({ attributes, id, isBackend = false }) => {
	const { header = {}, layout = {}, container = {}, headerStyle = {}, toolbarStyle = {}, card = {}, row = {}, icon = {}, fileName = {}, size = {}, date = {}, description = {}, author = {}, fileType = {}, badges = {}, pagination = {}, downloadBtn = {}, viewBtn = {}, advanced } = attributes;

	const root = `#${id} .b-blocks-document-library`;
	const headerSl = `${root} .b-blocks-document-library-header`;
	const toolbarSl = `${root} .b-blocks-document-library-toolbar`;
	// The search field and the two selects share one look; focusSl is the field being typed in or chosen from.
	const fieldSl = `${toolbarSl} input, ${toolbarSl} select`;
	const focusSl = `${toolbarSl} input:focus, ${toolbarSl} select:focus`;
	const { field = {} } = toolbarStyle;
	const cardSl = `${root} .b-blocks-document-library-card`;
	const rowSl = `${root} .b-blocks-document-library-row`;
	// One part inside a card or a row. (`${cardSl}, ${rowSl} .part` would colour the whole card.)
	const itemPartSl = (part) => `${cardSl} ${part}, ${rowSl} ${part}`;
	const itemHoverSl = (part) => `${cardSl}:hover ${part}, ${rowSl}:hover ${part}`;
	const downloadSl = `${root} .b-blocks-document-library-btn.is-download`;
	const viewSl = `${root} .b-blocks-document-library-btn.is-view`;
	// Load More and the page numbers share one look; the current page number has its own.
	const pageSl = `${root} .b-blocks-document-library-more button, ${root} .b-blocks-document-library-pages button`;
	const pageHoverSl = `${root} .b-blocks-document-library-more button:hover, ${root} .b-blocks-document-library-pages button:hover`;
	const currentSl = `${root} .b-blocks-document-library-pages button.is-current`;

	// Text colour (Normal / Hover on the card or row) and typography of one text part.
	const textCSS = (cls, value) => `
		${itemPartSl(cls)}{ ${isValidCSS('color', value.normal?.color)} }
		${itemHoverSl(cls)}{ ${isValidCSS('color', value.hover?.color)} }
		${getTypoCSS(`${root} ${cls}`, value.typo)?.styles}
	`;

	// An empty BorderBoxControl value would print "border: 0px solid #000" over the default border.
	const borderCSS = (border) => [border, border?.top, border?.right, border?.bottom, border?.left].some((side) => side?.width || side?.color) ? getBorderBoxCSS(border) : '';

	// The View and Download buttons share one shape.
	const buttonCSS = (selector, btn) => `
		${selector}{
			${isValidCSS('color', btn.normal?.color?.text)}
			${getBackgroundCSS(btn.normal?.color?.bg, true, true, false)}
			${borderCSS(btn.normal?.border)}
		}
		${selector}:hover, ${selector}:focus-visible{
			${isValidCSS('color', btn.hover?.color?.text)}
			${getBackgroundCSS(btn.hover?.color?.bg, true, true, false)}
			${borderCSS(btn.hover?.border)}
		}
		${getTypoCSS(selector, btn.typo)?.styles}
	`;

	const deviceCSS = (device) => `
		${root}{ ${isValidCSS('padding', getBoxCSS(container[device]?.padding))} }
		${headerSl}{ ${isValidCSS('padding', getBoxCSS(headerStyle[device]?.padding))} }
		${toolbarSl}{
			${isValidCSS('padding', getBoxCSS(toolbarStyle[device]?.padding))}
			${isValidCSS('gap', toolbarStyle[device]?.gap)}
		}
		${fieldSl}, ${toolbarSl} .b-blocks-document-library-copy{ ${isValidCSS('height', field[device]?.height)} }
		${fieldSl}{
			${isValidCSS('border-radius', getBoxCSS(field.normal?.[device]?.radius))}
		}
		${focusSl}{ ${isValidCSS('border-radius', getBoxCSS(field.focus?.[device]?.radius))} }
		${toolbarSl} .b-blocks-document-library-search input{
			${isValidCSS('padding-top', field[device]?.padding?.top)}
			${isValidCSS('padding-bottom', field[device]?.padding?.bottom)}
			${isValidCSS('padding-inline-start', field[device]?.padding?.left ? `calc(${field[device].padding.left} + 26px)` : '')}
			${isValidCSS('padding-inline-end', field[device]?.padding?.right)}
		}
		${toolbarSl} select{
			${isValidCSS('padding-top', field[device]?.padding?.top)}
			${isValidCSS('padding-bottom', field[device]?.padding?.bottom)}
			${isValidCSS('padding-inline-start', field[device]?.padding?.left)}
			${isValidCSS('padding-inline-end', field[device]?.padding?.right ? `calc(${field[device].padding.right} + 18px)` : '')}
		}
		${root} .b-blocks-document-library-grid{
			${layout[device]?.columns ? `grid-template-columns: repeat(${parseInt(layout[device].columns, 10) || 1}, minmax(0, 1fr));` : ''}
			${isValidCSS('gap', layout[device]?.gap)}
		}
		${cardSl}{
			${isValidCSS('padding', getBoxCSS(card[device]?.padding))}
			${isValidCSS('border-radius', getBoxCSS(card[device]?.radius))}
		}
		${root} .b-blocks-document-library-list{ ${isValidCSS('border-radius', getBoxCSS(row[device]?.radius))} }
		${downloadSl}{
			${isValidCSS('padding', getBoxCSS(downloadBtn[device]?.padding))}
			${isValidCSS('border-radius', getBoxCSS(downloadBtn.normal?.[device]?.radius))}
		}
		${downloadSl}:hover, ${downloadSl}:focus-visible{ ${isValidCSS('border-radius', getBoxCSS(downloadBtn.hover?.[device]?.radius))} }
		${viewSl}{
			${isValidCSS('padding', getBoxCSS(viewBtn[device]?.padding))}
			${isValidCSS('border-radius', getBoxCSS(viewBtn.normal?.[device]?.radius))}
		}
		${viewSl}:hover, ${viewSl}:focus-visible{ ${isValidCSS('border-radius', getBoxCSS(viewBtn.hover?.[device]?.radius))} }
		${pageSl}{ ${isValidCSS('border-radius', getBoxCSS(pagination[device]?.radius))} }
		${root} .b-blocks-document-library-more button{ ${isValidCSS('padding', getBoxCSS(pagination[device]?.padding))} }
		${root} .b-blocks-document-library-more, ${root} .b-blocks-document-library-pages{ ${isValidCSS('margin', getBoxCSS(pagination[device]?.margin))} }
	`;

	// Row Background saved before it became a Background control (a plain colour) still shows, as a solid colour.
	return <style dangerouslySetInnerHTML={{
		__html: `
		${[headerStyle.title?.typo, headerStyle.description?.typo, field.typo, fileName.typo, size.typo, date.typo, description.typo, author.typo, fileType.typo, pagination.typo, downloadBtn.typo, viewBtn.typo].map((typo) => getTypoCSS('', typo)?.googleFontLink).join(' ')}

		${root}{ ${getBackgroundCSS(container.bg)} }

		${headerSl}{
			${getBackgroundCSS(headerStyle.bg)}
			${isValidCSS('text-align', header.align)}
		}
		${headerSl} .b-blocks-document-library-title{ ${isValidCSS('color', headerStyle.title?.color)} }
		${getTypoCSS(`${headerSl} .b-blocks-document-library-title`, headerStyle.title?.typo)?.styles}
		${headerSl} .b-blocks-document-library-subtitle{ ${isValidCSS('color', headerStyle.description?.color)} }
		${getTypoCSS(`${headerSl} .b-blocks-document-library-subtitle`, headerStyle.description?.typo)?.styles}

		${toolbarSl}{ ${getBackgroundCSS(toolbarStyle.bg)} }
		${fieldSl}{
			${0 < Number(field.transition) ? `transition: color ${Number(field.transition)}s ease, background ${Number(field.transition)}s ease, border-color ${Number(field.transition)}s ease, box-shadow ${Number(field.transition)}s ease, border-radius ${Number(field.transition)}s ease;` : ''}
			${isValidCSS('color', field.normal?.color)}
			${getBackgroundCSS(field.normal?.bg, true, true, false)}
			${borderCSS(field.normal?.border)}
		}
		${focusSl}{
			${isValidCSS('color', field.focus?.color)}
			${getBackgroundCSS(field.focus?.bg, true, true, false)}
			${isValidCSS('border-color', field.focus?.ring)}
			${isValidCSS('box-shadow', field.focus?.ring ? `0 0 0 1px ${field.focus.ring}` : '')}
			${borderCSS(field.focus?.border)}
		}
		${toolbarSl} input::placeholder{ ${isValidCSS('color', field.placeholder)} }
		${toolbarSl} .b-blocks-document-library-search svg{ ${isValidCSS('color', field.icon)} }
		${getTypoCSS(fieldSl, field.typo)?.styles}

		${cardSl}{
			${getBackgroundCSS(card.normal?.bg)}
			${borderCSS(card.normal?.border)}
			${isValidCSS('box-shadow', card.normal?.shadow?.length ? getMultiShadowCSS(card.normal.shadow) : '')}
		}
		${cardSl}:hover{
			${getBackgroundCSS(card.hover?.bg)}
			${borderCSS(card.hover?.border)}
			${isValidCSS('box-shadow', card.hover?.shadow?.length ? getMultiShadowCSS(card.hover.shadow) : '')}
		}

		${root} .b-blocks-document-library-list{
			${isValidCSS('border-color', row.divider)}
		}
		${rowSl}{ ${getBackgroundCSS('string' === typeof row.normal?.bg ? { type: 'solid', color: row.normal.bg } : row.normal?.bg, true, true, false)} ${isValidCSS('border-color', row.divider)} }
		${rowSl}:hover{ ${getBackgroundCSS('string' === typeof row.hover?.bg ? { type: 'solid', color: row.hover.bg } : row.hover?.bg, true, true, false)} }

		${root} .b-blocks-document-library-icon{ ${isValidCSS('color', icon.normal?.color)} }
		${root} .b-blocks-document-library-icon svg{ ${isValidCSS('width', icon.size)} ${isValidCSS('height', icon.size)} }
		${itemHoverSl('.b-blocks-document-library-icon')}{ ${isValidCSS('color', icon.hover?.color)} }

		${textCSS('.b-blocks-document-library-name', fileName)}
		${textCSS('.b-blocks-document-library-size', size)}
		${textCSS('.b-blocks-document-library-date', date)}
		${textCSS('.b-blocks-document-library-desc', description)}
		${textCSS('.b-blocks-document-library-author', author)}
		${textCSS('.b-blocks-document-library-type', fileType)}

		${root} .b-blocks-document-library-featured{ ${isValidCSS('color', badges.featured?.color)} ${getBackgroundCSS(badges.featured?.bg, true, true, false)} }
		${root} .b-blocks-document-library-new{ ${isValidCSS('color', badges.new?.color)} ${getBackgroundCSS(badges.new?.bg, true, true, false)} }

		${pageSl}{
			${isValidCSS('color', pagination.normal?.color)}
			${getBackgroundCSS(pagination.normal?.bg, true, true, false)}
			${borderCSS(pagination.normal?.border)}
		}
		${pageHoverSl}{
			${isValidCSS('color', pagination.hover?.color)}
			${getBackgroundCSS(pagination.hover?.bg, true, true, false)}
			${borderCSS(pagination.hover?.border)}
		}
		${currentSl}{
			${isValidCSS('color', pagination.active?.color)}
			${getBackgroundCSS(pagination.active?.bg, true, true, false)}
			${borderCSS(pagination.active?.border)}
		}
		${getTypoCSS(pageSl, pagination.typo)?.styles}

		${buttonCSS(downloadSl, downloadBtn)}
		${buttonCSS(viewSl, viewBtn)}

		${deviceCSS('desktop')}
		${tabBreakpoint}{ ${deviceCSS('tablet')} }
		${mobileBreakpoint}{ ${deviceCSS('mobile')} }

		${generateCSS(id, advanced, isBackend, false)}
		`.replace(/\s+/g, ' ')
	}} />;
};
export default Style;

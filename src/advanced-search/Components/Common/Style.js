import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';

const Style = ( { attributes, id, isBackend = false } ) => {
	const { search = {}, searchField = {}, field = {}, searchIcon = {}, closeIcon = {}, loader = {}, resultBox = {}, item = {}, thumb = {}, total = {}, notFound = {}, searchBtn = {}, viewAllBtn = {}, advanced } = attributes;

	const root = `#${ id } .b-blocks-advanced-search`;
	const fieldSl = `${ root } .b-blocks-advanced-search-field`;
	// The field's Hover look also shows while the visitor is typing in it.
	const fieldHoverSl = `${ fieldSl }:hover, ${ fieldSl }:focus-within`;
	// Focus (typing): written after Hover, so a Focus value wins while typing; an empty one leaves the Hover look.
	const fieldFocusSl = `${ fieldSl }:focus-within`;
	const inputSl = `${ fieldSl } .b-blocks-advanced-search-input`;
	// The filter dropdown takes the field's text style and colour (only printed when there is one).
	const filterSl = searchField.filter ? `, ${ fieldSl } .b-blocks-advanced-search-filter` : '';
	const boxSl = `${ root } .b-blocks-advanced-search-results`;
	const itemSl = `${ root } .b-blocks-advanced-search-item`;
	// A result highlighted with the arrow keys looks like a hovered one.
	const itemHoverSl = `${ itemSl }:hover, ${ itemSl }.is-active`;
	const btnSl = `${ root } .b-blocks-advanced-search-button`;
	const btnHoverSl = `${ btnSl }:hover, ${ btnSl }:focus-visible`;
	const viewSl = `${ root } .b-blocks-advanced-search-view-all`;
	const viewHoverSl = `${ viewSl }:hover, ${ viewSl }:focus-visible`;
	// Grouped results (Pro): the type headings ("Posts (8)") take the Meta Line style.
	const groupTitleSl = search.groupByType ? `, ${ root } .b-blocks-advanced-search-group-title` : '';

	// An empty Border control would print "border: 0px solid #000" over the stylesheet's border.
	const borderCSS = ( border ) => [ border, border?.top, border?.right, border?.bottom, border?.left ].some( ( side ) => side?.width || side?.color ) ? getBorderBoxCSS( border ) : '';
	const shadowCSS = ( shadow ) => isValidCSS( 'box-shadow', Array.isArray( shadow ) && shadow.length ? getMultiShadowCSS( shadow ) : '' );
	const bgCSS = ( bg ) => typeof bg === 'string' ? isValidCSS( 'background-color', bg ) : getBackgroundCSS( bg, true, true, false );

	const deviceCSS = ( device ) => `
		${ fieldSl }{
			${ isValidCSS( 'height', field[ device ]?.height ) }
			${ isValidCSS( 'padding', getBoxCSS( field[ device ]?.padding ) ) }
			${ isValidCSS( 'border-radius', getBoxCSS( field.normal?.[ device ]?.radius ) ) }
		}
		${ fieldHoverSl }{ ${ isValidCSS( 'border-radius', getBoxCSS( field.hover?.[ device ]?.radius ) ) } }
		${ fieldFocusSl }{ ${ isValidCSS( 'border-radius', getBoxCSS( field.focus?.[ device ]?.radius ) ) } }
		${ fieldSl } .b-blocks-advanced-search-icon svg{ ${ isValidCSS( 'width', searchIcon[ device ]?.size ) } ${ isValidCSS( 'height', searchIcon[ device ]?.size ) } }
		${ boxSl }{
			${ isValidCSS( 'width', resultBox[ device ]?.width ) }
			${ isValidCSS( 'padding', getBoxCSS( resultBox[ device ]?.padding ) ) }
			${ isValidCSS( 'margin', getBoxCSS( resultBox[ device ]?.margin ) ) }
			${ isValidCSS( 'border-radius', getBoxCSS( resultBox.normal?.[ device ]?.radius ) ) }
		}
		${ boxSl } .b-blocks-advanced-search-list{ ${ resultBox[ device ]?.maxHeight ? `${ isValidCSS( 'max-height', resultBox[ device ].maxHeight ) } overflow-y: auto;` : '' } }
		${ 1 < parseInt( resultBox[ device ]?.columns, 10 ) ? `${ boxSl } .b-blocks-advanced-search-list, ${ boxSl } .b-blocks-advanced-search-group-items{ display: grid; grid-template-columns: repeat(${ Math.min( 6, parseInt( resultBox[ device ].columns, 10 ) ) }, minmax(0, 1fr)); ${ isValidCSS( 'gap', resultBox[ device ]?.gap ) } }` : '' }
		${ 1 >= parseInt( resultBox[ device ]?.columns, 10 ) || ( 'mobile' === device && ! resultBox.mobile?.columns && ( 1 < parseInt( resultBox.desktop?.columns, 10 ) || 1 < parseInt( resultBox.tablet?.columns, 10 ) ) ) ? `${ boxSl } .b-blocks-advanced-search-list, ${ boxSl } .b-blocks-advanced-search-group-items{ display: block; }` : '' }
		${ boxSl }:hover{ ${ isValidCSS( 'border-radius', getBoxCSS( resultBox.hover?.[ device ]?.radius ) ) } }
		${ itemSl }{
			${ isValidCSS( 'padding', getBoxCSS( item[ device ]?.padding ) ) }
			${ isValidCSS( 'margin', getBoxCSS( item[ device ]?.margin ) ) }
			${ isValidCSS( 'border-radius', getBoxCSS( item.normal?.[ device ]?.radius ) ) }
		}
		${ itemHoverSl }{ ${ isValidCSS( 'border-radius', getBoxCSS( item.hover?.[ device ]?.radius ) ) } }
		${ itemSl } .b-blocks-advanced-search-thumb{
			${ isValidCSS( 'width', thumb[ device ]?.size ) }
			${ isValidCSS( 'height', thumb[ device ]?.size ) }
			${ isValidCSS( 'border-radius', getBoxCSS( thumb[ device ]?.radius ) ) }
		}
		${ btnSl }{
			${ isValidCSS( 'width', searchBtn[ device ]?.width ) }
			${ isValidCSS( 'height', searchBtn[ device ]?.height ) }
			${ isValidCSS( 'padding', getBoxCSS( searchBtn[ device ]?.padding ) ) }
			${ isValidCSS( 'border-radius', getBoxCSS( searchBtn.normal?.[ device ]?.radius ) ) }
		}
		${ btnHoverSl }{ ${ isValidCSS( 'border-radius', getBoxCSS( searchBtn.hover?.[ device ]?.radius ) ) } }
		${ viewSl }{
			${ isValidCSS( 'padding', getBoxCSS( viewAllBtn[ device ]?.padding ) ) }
			${ isValidCSS( 'border-radius', getBoxCSS( viewAllBtn.normal?.[ device ]?.radius ) ) }
		}
		${ viewHoverSl }{ ${ isValidCSS( 'border-radius', getBoxCSS( viewAllBtn.hover?.[ device ]?.radius ) ) } }
	`;

	return <style dangerouslySetInnerHTML={ {
		__html: `
		${ [ field.typo, item.titleTypo, item.contentTypo, item.metaTypo, total.typo, notFound.typo, searchBtn.typo, viewAllBtn.typo ].map( ( typo ) => getTypoCSS( '', typo )?.googleFontLink ).join( ' ' ) }

		${ fieldSl }{
			${ bgCSS( field.bg ) }
			${ borderCSS( field.normal?.border ) }
			${ shadowCSS( field.normal?.shadow ) }
		}
		${ fieldHoverSl }{
			${ borderCSS( field.hover?.border ) }
			${ shadowCSS( field.hover?.shadow ) }
		}
		${ inputSl }${ filterSl }{ ${ isValidCSS( 'color', field.normal?.color ) } }
		${ inputSl }::placeholder{ ${ isValidCSS( 'color', field.normal?.placeholder ) } }
		${ fieldSl }:hover .b-blocks-advanced-search-input, ${ fieldSl }:focus-within .b-blocks-advanced-search-input{ ${ isValidCSS( 'color', field.hover?.color ) } }
		${ fieldSl }:hover .b-blocks-advanced-search-input::placeholder, ${ fieldSl }:focus-within .b-blocks-advanced-search-input::placeholder{ ${ isValidCSS( 'color', field.hover?.placeholder ) } }
		${ fieldFocusSl }{
			${ borderCSS( field.focus?.border ) }
			${ shadowCSS( field.focus?.shadow ) }
		}
		${ fieldFocusSl } .b-blocks-advanced-search-input{ ${ isValidCSS( 'color', field.focus?.color ) } }
		${ fieldFocusSl } .b-blocks-advanced-search-input::placeholder{ ${ isValidCSS( 'color', field.focus?.placeholder ) } }
		${ getTypoCSS( `${ inputSl }${ filterSl }`, field.typo )?.styles }

		${ fieldSl } .b-blocks-advanced-search-icon{ ${ isValidCSS( 'color', searchIcon.color ) } }
		${ fieldSl } .b-blocks-advanced-search-clear{ ${ isValidCSS( 'color', closeIcon.color ) } ${ isValidCSS( 'background-color', closeIcon.bg ) } }
		${ fieldSl } .b-blocks-advanced-search-loader{ ${ isValidCSS( 'border-top-color', loader.color ) } }

		${ boxSl }{
			${ bgCSS( resultBox.bg ) }
			${ borderCSS( resultBox.normal?.border ) }
			${ shadowCSS( resultBox.normal?.shadow ) }
		}
		${ boxSl }:hover{
			${ borderCSS( resultBox.hover?.border ) }
			${ shadowCSS( resultBox.hover?.shadow ) }
		}

		${ itemSl }{
			${ bgCSS( item.normal?.bg ) }
			${ borderCSS( item.normal?.border ) }
			${ shadowCSS( item.normal?.shadow ) }
		}
		${ itemHoverSl }{
			${ bgCSS( item.hover?.bg ) }
			${ borderCSS( item.hover?.border ) }
			${ shadowCSS( item.hover?.shadow ) }
		}
		${ itemSl } .b-blocks-advanced-search-title{ ${ isValidCSS( 'color', item.normal?.title ) } }
		${ itemSl } .b-blocks-advanced-search-excerpt{ ${ isValidCSS( 'color', item.normal?.content ) } }
		${ itemSl }:hover .b-blocks-advanced-search-title, ${ itemSl }.is-active .b-blocks-advanced-search-title{ ${ isValidCSS( 'color', item.hover?.title ) } }
		${ itemSl }:hover .b-blocks-advanced-search-excerpt, ${ itemSl }.is-active .b-blocks-advanced-search-excerpt{ ${ isValidCSS( 'color', item.hover?.content ) } }
		${ getTypoCSS( `${ itemSl } .b-blocks-advanced-search-title`, item.titleTypo )?.styles }
		${ getTypoCSS( `${ itemSl } .b-blocks-advanced-search-excerpt`, item.contentTypo )?.styles }
		${ itemSl } .b-blocks-advanced-search-meta${ groupTitleSl }{ ${ isValidCSS( 'color', item.normal?.meta ) } }
		${ itemSl }:hover .b-blocks-advanced-search-meta, ${ itemSl }.is-active .b-blocks-advanced-search-meta{ ${ isValidCSS( 'color', item.hover?.meta ) } }
		${ getTypoCSS( `${ itemSl } .b-blocks-advanced-search-meta${ groupTitleSl }`, item.metaTypo )?.styles }
		${ 'right' === thumb.position ? `${ itemSl } a{ flex-direction: row-reverse; }` : '' }
		${ root } .b-blocks-advanced-search-footer{ ${ isValidCSS( 'justify-content', resultBox.footerAlign ) } }
		${ itemSl } mark{ ${ isValidCSS( 'color', item.highlight?.color ) } ${ isValidCSS( 'background-color', item.highlight?.bg ) } }

		${ root } .b-blocks-advanced-search-total{ ${ isValidCSS( 'color', total.color ) } }
		${ getTypoCSS( `${ root } .b-blocks-advanced-search-total`, total.typo )?.styles }

		${ root } .b-blocks-advanced-search-not-found, ${ root } .b-blocks-advanced-search-fallback-title{ ${ isValidCSS( 'color', notFound.color ) } ${ isValidCSS( 'text-align', notFound.align ) } }
		${ getTypoCSS( `${ root } .b-blocks-advanced-search-not-found, ${ root } .b-blocks-advanced-search-fallback-title`, notFound.typo )?.styles }

		${ btnSl }{
			${ isValidCSS( 'color', searchBtn.normal?.color ) }
			${ bgCSS( searchBtn.normal?.bg ) }
			${ borderCSS( searchBtn.normal?.border ) }
			${ shadowCSS( searchBtn.normal?.shadow ) }
		}
		${ btnHoverSl }{
			${ isValidCSS( 'color', searchBtn.hover?.color ) }
			${ bgCSS( searchBtn.hover?.bg ) }
			${ borderCSS( searchBtn.hover?.border ) }
			${ shadowCSS( searchBtn.hover?.shadow ) }
		}
		${ getTypoCSS( btnSl, searchBtn.typo )?.styles }

		${ viewSl }{
			${ isValidCSS( 'color', viewAllBtn.normal?.color ) }
			${ bgCSS( viewAllBtn.normal?.bg ) }
			${ borderCSS( viewAllBtn.normal?.border ) }
			${ shadowCSS( viewAllBtn.normal?.shadow ) }
		}
		${ viewHoverSl }{
			${ isValidCSS( 'color', viewAllBtn.hover?.color ) }
			${ bgCSS( viewAllBtn.hover?.bg ) }
			${ borderCSS( viewAllBtn.hover?.border ) }
			${ shadowCSS( viewAllBtn.hover?.shadow ) }
		}
		${ getTypoCSS( viewSl, viewAllBtn.typo )?.styles }

		${ deviceCSS( 'desktop' ) }
		${ tabBreakpoint }{ ${ deviceCSS( 'tablet' ) } }
		${ mobileBreakpoint }{ ${ deviceCSS( 'mobile' ) } }

		${ generateCSS( id, advanced, isBackend, false ) }
		`.replace( /\s+/g, ' ' )
	} } />;
};
export default Style;
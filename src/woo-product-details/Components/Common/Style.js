import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { isExist } from '../../../../../bpl-tools/utils/common';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { BOX } from '../../utils/functions';

const tidy = ( css ) => css.replace( /\s+/g, ' ' ).replace( /[^{};]+\{\s*\}/g, '' ).replace( /[^{};]+\{\s*\}/g, '' );

const dividerCSS = ( divider ) => {
	const { width, style, color } = divider || {};
	if ( ! width || ! style || 'none' === style ) return '';
	return `border-bottom: ${ width } ${ style } ${ color || 'currentColor' };`;
};

const SIDES = [ 'top', 'right', 'bottom', 'left' ];

const bySide = ( border ) => SIDES.some( ( side ) => border?.[ side ] ) ? border : Object.fromEntries( SIDES.map( ( side ) => [ side, border ] ) );

const overBorder = ( border, base ) => {
	if ( ! isExist( base ) ) return border;

	const over = bySide( border );
	const under = bySide( base );

	return Object.fromEntries( SIDES.map( ( side ) => [ side, {
		...under[ side ],
		...Object.fromEntries( Object.entries( over[ side ] || {} ).filter( ( [ , value ] ) => isExist( value ) ) )
	} ] ) );
};

const Style = ( { attributes, id, isBackend = false } ) => {

	const { advanced } = attributes;
	const tabTitle = attributes.tabTitle || {};
	const content = attributes.content || {};
	const tabNormal = tabTitle.normal || {};
	const tabHover = tabTitle.hover || {};
	const panelNormal = content.normal || {};
	const panelHover = content.hover || {};

	const mainSl = `#${ id }`;
	const blockSl = `${ mainSl } .${ BOX }`;
	const tablistSl = `${ blockSl }-tablist`;
	const tabSl = `${ blockSl } .${ BOX }-tab`;
	const tabHoverSl = `${ tabSl }:hover, ${ tabSl }:focus-visible`;
	const activeSl = `${ tabSl }.is-active`;
	const activeHoverSl = `${ activeSl }:hover, ${ activeSl }:focus-visible`;
	const panelSl = `${ blockSl } .${ BOX }-panel`;
	const panelHoverSl = `${ panelSl }:hover`;

	const panelText = [ '', ' th', ' td', ' label', ' p', ' li', ' h2', ' h3' ];
	const panelColorSl = panelText.map( ( inner ) => `${ panelSl }${ inner }` ).join( ', ' );
	const panelHoverColorSl = panelText.map( ( inner ) => `${ panelHoverSl }${ inner }` ).join( ', ' );

	const tabTypo = getTypoCSS( tabSl, tabTitle.typo );

	const panelTypo = getTypoCSS( panelSl, content.typo );

	const stateStyles = ( state, base ) => `
		${ isExist( state?.border ) ? getBorderBoxCSS( overBorder( state.border, base?.border ) ) : '' }
		${ isValidCSS( 'box-shadow', getMultiShadowCSS( Array.isArray( state?.shadow ) ? state.shadow : [] ) ) }
	`;

	const radius = ( state, device ) => isValidCSS( 'border-radius', getBoxCSS( state?.[ device ]?.radius ) );

	const deviceStyles = ( device ) => `
		${ tabSl }{
			${ isValidCSS( 'padding', getBoxCSS( tabTitle[ device ]?.padding ) ) }
			${ isValidCSS( 'margin', getBoxCSS( tabTitle[ device ]?.margin ) ) }
			${ radius( tabNormal, device ) }
		}
		${ tabHoverSl }{
			${ radius( tabHover, device ) }
		}
		${ panelSl }{
			${ isValidCSS( 'padding', getBoxCSS( content[ device ]?.padding ) ) }
			${ isValidCSS( 'margin', getBoxCSS( content[ device ]?.margin ) ) }
			${ radius( panelNormal, device ) }
		}
		${ panelHoverSl }{
			${ radius( panelHover, device ) }
		}
	`;

	const blockCSS = `
		${ tabTypo.googleFontLink }
		${ panelTypo.googleFontLink }

		${ tablistSl }{
			${ dividerCSS( tabTitle.divider ) }
		}

		${ tabSl }{
			${ isValidCSS( 'color', tabNormal.color?.text ) }
			${ getBackgroundCSS( tabNormal.color?.bg, true, true, false ) }
			${ stateStyles( tabNormal ) }
		}
		${ tabTypo.styles }
		${ tabHoverSl }{
			${ isValidCSS( 'color', tabHover.color?.text ) }
			${ getBackgroundCSS( tabHover.color?.bg, true, true, false ) }
			${ stateStyles( tabHover, tabNormal ) }
		}
		${ activeSl }{
			${ isValidCSS( 'color', tabNormal.color?.activeText ) }
			${ getBackgroundCSS( tabNormal.color?.activeBg, true, true, false ) }
		}
		${ activeHoverSl }{
			${ isValidCSS( 'color', tabHover.color?.activeText ) }
			${ getBackgroundCSS( tabHover.color?.activeBg, true, true, false ) }
		}

		${ panelColorSl }{
			${ isValidCSS( 'color', panelNormal.color?.text ) }
		}
		${ panelHoverColorSl }{
			${ isValidCSS( 'color', panelHover.color?.text ) }
		}
		${ panelTypo.styles }
		${ panelSl }{
			${ getBackgroundCSS( panelNormal.color?.bg, true, true, false ) }
			${ stateStyles( panelNormal ) }
		}
		${ panelHoverSl }{
			${ getBackgroundCSS( panelHover.color?.bg, true, true, false ) }
			${ stateStyles( panelHover, panelNormal ) }
		}

		${ deviceStyles( 'desktop' ) }
		${ tabBreakpoint }{
			${ deviceStyles( 'tablet' ) }
		}
		${ mobileBreakpoint }{
			${ deviceStyles( 'mobile' ) }
		}
	`;

	return <style dangerouslySetInnerHTML={ { __html: `${ tidy( blockCSS.replace( /</g, '' ) ) } ${ generateCSS( id, advanced, isBackend, false ) }` } } />;
};

export default Style;

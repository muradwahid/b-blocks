import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { ALIGNMENTS, BOX, DISPLAYS } from '../../utils/functions';

const DIRECTIONS = { inline: 'row', block: 'column', 'block-reverse': 'column-reverse', 'inline-reverse': 'row-reverse' };
const FLEX = { left: 'flex-start', center: 'center', right: 'flex-end' };
const MIRRORED = { left: 'flex-end', center: 'center', right: 'flex-start' };

const Style = ( { attributes, id, isBackend = false } ) => {
	const { layout = {}, link = {}, stars = {}, advanced } = attributes;

	const mainSl = `#${ id }`;
	const blockSl = `${ mainSl } .${ BOX }`;
	const starsSl = `${ blockSl } .${ BOX }-stars`;
	const starSl = `${ blockSl } .${ BOX }-star`;
	const fillSl = `${ blockSl } .${ BOX }-star-fill`;
	const countSl = `${ blockSl } .${ BOX }-count`;

	const display = DISPLAYS.includes( layout.display ) ? layout.display : 'inline';
	const alignment = ALIGNMENTS.includes( layout.alignment ) ? layout.alignment : 'left';
	const direction = DIRECTIONS[ display ];
	const isRow = direction.startsWith( 'row' );

	// Row: the physical left/center/right keyword after a flex-start/end fallback (reversed for row-reverse).
	// Column: align-items, mirrored on RTL pages where the cross axis starts at the right.
	const alignCSS = isRow
		? `justify-content: ${ ( 'row' === direction ? FLEX : MIRRORED )[ alignment ] }; justify-content: ${ alignment }; align-items: center;`
		: `justify-content: flex-start; align-items: ${ FLEX[ alignment ] };`;

	const linkTypo = getTypoCSS( countSl, link.typo );

	const deviceStyles = ( device ) => `
		${ blockSl }{
			${ isValidCSS( 'gap', layout.countGap?.[ device ] ) }
		}
		${ starsSl }{
			${ isValidCSS( 'gap', stars.gap?.[ device ] ) }
		}
		${ starSl }{
			${ isValidCSS( 'width', stars.size?.[ device ] ) }
			${ isValidCSS( 'height', stars.size?.[ device ] ) }
		}
	`;

	const blockCSS = `
		${ linkTypo.googleFontLink }
		${ blockSl }{
			flex-direction: ${ direction };
			${ alignCSS }
		}
		${ ! isRow ? `[dir="rtl"] ${ blockSl }{ align-items: ${ MIRRORED[ alignment ] }; }` : '' }
		${ starSl }{
			${ isValidCSS( 'color', stars.color ) }
		}
		${ fillSl }{
			${ isValidCSS( 'color', stars.ratedColor ) }
		}
		${ countSl }{
			text-align: ${ alignment };
			${ isValidCSS( 'color', link.color ) }
		}
		${ countSl }:is(a):hover, ${ countSl }:is(a):focus-visible{
			${ isValidCSS( 'color', link.hoverColor ) }
		}
		${ linkTypo.styles }

		${ deviceStyles( 'desktop' ) }
		${ tabBreakpoint }{
			${ deviceStyles( 'tablet' ) }
		}
		${ mobileBreakpoint }{
			${ deviceStyles( 'mobile' ) }
		}
	`.replace( /\s+/g, ' ' ).replace( /[^{};]+\{\s*\}/g, '' ).replace( /[^{};]+\{\s*\}/g, '' );

	return <style dangerouslySetInnerHTML={ { __html: `${ blockCSS } ${ generateCSS( id, advanced, isBackend, false ) }` } } />;
};

export default Style;

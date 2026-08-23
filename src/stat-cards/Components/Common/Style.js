import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

const num = ( v, fb ) => ( Number.isFinite( parseInt( v, 10 ) ) ? parseInt( v, 10 ) : fb );

// Background / border / border-radius / padding / margin shared by each element.
const boxStyleCSS = ( v = {} ) => `
	${ getBackgroundCSS( v.bg ) }
	${ getBorderBoxCSS( v.border ) }
	${ isValidCSS( 'border-radius', getBoxCSS( v.borderRadius ) ) }
	${ isValidCSS( 'padding', getBoxCSS( v.padding ) ) }
	${ isValidCSS( 'margin', getBoxCSS( v.margin ) ) }
`;

const Style = ( { attributes, id, isBackend = false } ) => {
	const { layout = {}, card = {}, number = {}, label = {}, description = {}, icon = {}, advanced } = attributes;

	const cols = layout.columns || {};
	const colGap = layout.columnGap || {};
	const rowGap = layout.rowGap || {};
	const align = [ 'left', 'center', 'right' ].includes( layout.align ) ? layout.align : 'center';
	const itemsAlign = 'left' === align ? 'flex-start' : ( 'right' === align ? 'flex-end' : 'center' );
	const cardStyle = card.style || 'flat';
	const hasBorder = 'outlined' === cardStyle || 'accent-top' === cardStyle;

	const cardPad = card.padding || {};
	const cardRadius = card.borderRadius || {};
	const cardMargin = card.margin || {};

	const numTypo = number.typography || {};
	const numTablet = numTypo.fontSize?.tablet;
	const numMobile = numTypo.fontSize?.mobile;

	const mainSl = `#${ id }`;
	const wrapperSl = `${ mainSl } .bBlocks-stat-cards-wrapper`;
	const gridSl = `${ wrapperSl } .bBlocks-stat-cards-grid`;
	const itemSl = `${ wrapperSl } .bBlocks-stat-cards-item`;
	const iconSl = `${ wrapperSl } .bBlocks-stat-cards-icon`;
	const numberSl = `${ wrapperSl } .bBlocks-stat-cards-number`;
	const labelSl = `${ wrapperSl } .bBlocks-stat-cards-label`;
	const descSl = `${ wrapperSl } .bBlocks-stat-cards-desc`;

	return <style
		dangerouslySetInnerHTML={ {
			__html: `
			${ getTypoCSS( '', numTypo ).googleFontLink }
			${ getTypoCSS( '', label.typography ).googleFontLink }
			${ getTypoCSS( '', description.typography ).googleFontLink }
			${ gridSl }{
				grid-template-columns: repeat(${ num( cols.desktop, 3 ) }, minmax(0, 1fr));
				column-gap: ${ colGap.desktop || '24px' };
				row-gap: ${ rowGap.desktop || '24px' };
			}
			${ itemSl }{
				align-items: ${ itemsAlign };
				text-align: ${ align };
				${ isValidCSS( 'padding', getBoxCSS( cardPad.desktop ) ) }
				${ isValidCSS( 'margin', getBoxCSS( cardMargin.desktop ) ) }
				${ isValidCSS( 'border-radius', getBoxCSS( cardRadius.desktop ) ) }
				${ getBackgroundCSS( card.bg ) }
				${ isValidCSS( 'box-shadow', getMultiShadowCSS( card.shadow ) ) }
				${ hasBorder ? getBorderBoxCSS( card.border ) : '' }
				${ 'accent-top' === cardStyle ? `border-top: ${ num( card.accentWidth, 4 ) }px solid ${ card.accentColor };` : '' }
			}
			${ iconSl }{
				${ isValidCSS( 'color', icon.color ) }
				font-size: ${ icon.size };
				${ boxStyleCSS( icon ) }
			}
			${ getTypoCSS( numberSl, numTypo ).styles }
			${ numberSl }{
				${ isValidCSS( 'color', number.color ) }
				justify-content: ${ itemsAlign };
				${ boxStyleCSS( number ) }
			}
			${ getTypoCSS( labelSl, label.typography ).styles }
			${ labelSl }{
				${ isValidCSS( 'color', label.color ) }
				${ boxStyleCSS( label ) }
			}
			${ getTypoCSS( descSl, description.typography ).styles }
			${ descSl }{
				${ isValidCSS( 'color', description.color ) }
				${ boxStyleCSS( description ) }
			}
			${ tabBreakpoint }{
				${ gridSl }{
					grid-template-columns: repeat(${ num( cols.tablet, 2 ) }, minmax(0, 1fr));
					column-gap: ${ colGap.tablet || colGap.desktop || '24px' };
					row-gap: ${ rowGap.tablet || rowGap.desktop || '24px' };
				}
				${ itemSl }{
					${ isValidCSS( 'padding', getBoxCSS( cardPad.tablet ) ) }
					${ isValidCSS( 'margin', getBoxCSS( cardMargin.tablet ) ) }
					${ isValidCSS( 'border-radius', getBoxCSS( cardRadius.tablet ) ) }
				}
				${ numTablet ? `${ numberSl }{ font-size: ${ numTablet }; }` : '' }
			}
			${ mobileBreakpoint }{
				${ gridSl }{
					grid-template-columns: repeat(${ num( cols.mobile, 1 ) }, minmax(0, 1fr));
					column-gap: ${ colGap.mobile || colGap.tablet || colGap.desktop || '24px' };
					row-gap: ${ rowGap.mobile || rowGap.tablet || rowGap.desktop || '24px' };
				}
				${ itemSl }{
					${ isValidCSS( 'padding', getBoxCSS( cardPad.mobile ) ) }
					${ isValidCSS( 'margin', getBoxCSS( cardMargin.mobile ) ) }
					${ isValidCSS( 'border-radius', getBoxCSS( cardRadius.mobile ) ) }
				}
				${ numMobile ? `${ numberSl }{ font-size: ${ numMobile }; }` : '' }
			}
			${ generateCSS( id, advanced, isBackend, false ) }
			`,
		} }
	/>;
};
export default Style;

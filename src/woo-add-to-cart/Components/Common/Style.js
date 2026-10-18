import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { isExist } from '../../../../../bpl-tools/utils/common';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { BOX, btnState } from '../../utils/functions';

const style = ( attributes, id, isBackend = false ) => {
	const { layout, button, quantity, stepper, variations, grouped, messages, viewCart, advanced } = attributes;
	const { normal, hover, added, icon } = button || {};
	const { label, select, clear, price: vPrice, table: vTable } = variations || {};
	const { table: gTable, name: gName, price: gPrice } = grouped || {};

	const mainSl = `#${ id }`;
	const blockSl = `${ mainSl } .${ BOX }`;

	const ownBtnSl = `${ blockSl } .${ BOX }-btn`;
	const wooBtnSl = `${ blockSl } .single_add_to_cart_button`;
	const btnSl = `${ ownBtnSl }, ${ wooBtnSl }`;
	const btnHoverSl = `${ ownBtnSl }:hover, ${ ownBtnSl }:focus-visible, ${ wooBtnSl }:hover, ${ wooBtnSl }:focus-visible`;
	const btnFocusSl = `${ ownBtnSl }:focus-visible, ${ wooBtnSl }:focus-visible`;

	const okBtnSl = `${ ownBtnSl }:not(.${ btnState( 'error' ) })`;
	const okWooBtnSl = `${ wooBtnSl }:not(.${ btnState( 'error' ) })`;
	const btnColorSl = `${ okBtnSl }, ${ okWooBtnSl }`;
	const btnHoverColorSl = `${ okBtnSl }:hover, ${ okBtnSl }:focus-visible, ${ okBtnSl }.${ btnState( 'added' ) }, ${ okWooBtnSl }:hover, ${ okWooBtnSl }:focus-visible, ${ okWooBtnSl }.${ btnState( 'added' ) }`;
	const btnAddedSl = `${ okBtnSl }.${ btnState( 'added' ) }, ${ okWooBtnSl }.${ btnState( 'added' ) }`;

	const iconSl = `${ blockSl } .${ BOX }-btn-icon`;
	const iconHoverSl = `${ ownBtnSl }:hover .${ BOX }-btn-icon, ${ ownBtnSl }:focus-visible .${ BOX }-btn-icon, ${ ownBtnSl }.${ btnState( 'added' ) } .${ BOX }-btn-icon, ${ wooBtnSl }:hover .${ BOX }-btn-icon, ${ wooBtnSl }:focus-visible .${ BOX }-btn-icon, ${ wooBtnSl }.${ btnState( 'added' ) } .${ BOX }-btn-icon`;

	const rowSl = `${ blockSl } .${ BOX }-inner, ${ blockSl } form.cart:not(.variations_form):not(.grouped_form), ${ blockSl } .woocommerce-variation-add-to-cart`;
	const groupedFormSl = `${ blockSl } form.grouped_form`;
	const btnWidthSl = `${ blockSl } .${ BOX }-inner > .${ BOX }-btn, ${ wooBtnSl }`;

	const qtyBoxSl = `${ blockSl } .${ BOX }-qty, ${ blockSl } .quantity .qty`;
	const qtyInputSl = `${ blockSl } .${ BOX }-qty-input`;
	const stepperInputSl = `${ blockSl } .${ BOX }-qty--stepper .${ BOX }-qty-input`;

	const qtyItemSl = `${ blockSl } .${ BOX }-inner > .${ BOX }-qty, ${ blockSl } .woocommerce-variation-add-to-cart .quantity`;
	const qtySl = `${ qtyInputSl }, ${ blockSl } .quantity .qty`;
	const qtyHoverSl = `${ qtyInputSl }:hover, ${ qtyInputSl }:focus, ${ blockSl } .quantity .qty:hover, ${ blockSl } .quantity .qty:focus`;
	const qtyFrameHoverSl = `${ blockSl } .${ BOX }-qty:hover, ${ blockSl } .${ BOX }-qty:focus-within, ${ blockSl } .quantity .qty:hover, ${ blockSl } .quantity .qty:focus`;
	const stepperSl = `${ blockSl } .${ BOX }-qty-btn`;
	const accentFocusSl = `${ stepperSl }:focus-visible, ${ qtyInputSl }:focus-visible, ${ blockSl } .quantity .qty:focus-visible, ${ blockSl } table.variations select:focus-visible`;

	// Variations.
	const vTableSl = `${ blockSl } table.variations`;
	const vCellSl = `${ vTableSl } th, ${ vTableSl } td`;
	const vLabelCellSl = `${ vTableSl } th.label`;
	const vLabelSl = `${ vLabelCellSl } label`;
	const selectSl = `${ vTableSl } select`;
	const selectHoverSl = `${ selectSl }:hover, ${ selectSl }:focus`;
	const clearSl = `${ blockSl } .reset_variations`;
	const priceSl = `${ blockSl } .woocommerce-variation-price .price`;

	// Grouped.
	const gTableSl = `${ blockSl } .group_table`;
	const gNameSl = `${ blockSl } .woocommerce-grouped-product-list-item__label a, ${ blockSl } .woocommerce-grouped-product-list-item__label label`;
	const gNameHoverSl = `${ blockSl } .woocommerce-grouped-product-list-item__label a:hover, ${ blockSl } .woocommerce-grouped-product-list-item__label a:focus-visible`;
	const gPriceSl = `${ blockSl } .woocommerce-grouped-product-list-item__price`;

	const stockSl = `${ blockSl } .stock`;
	const viewCartSl = `${ blockSl } .${ BOX }-view-cart`;

	const align = { left: 'flex-start', center: 'center', right: 'flex-end' }[ layout?.alignment ] || 'flex-start';

	const deviceStyles = ( device = 'desktop' ) => {
		const displayType = layout?.[ device ]?.displayType;
		const isStacked = [ 'stacked', 'stacked-reverse' ].includes( displayType );
		const isReverse = [ 'inline-reverse', 'stacked-reverse' ].includes( displayType );
		const switched = [ 'inline-reverse', 'stacked', 'stacked-reverse' ].includes( displayType ) || ( 'inline' === displayType && 'desktop' !== device );

		return `
			${ rowSl }{
				${ switched ? isValidCSS( 'flex-direction', isStacked ? 'column' : 'row' ) : '' }
				${ switched ? isValidCSS( 'align-items', isStacked ? align : 'center' ) : '' }
				${ isValidCSS( 'gap', layout?.[ device ]?.gap ) }
			}
			${ qtyItemSl }{
				${ switched ? isValidCSS( 'order', isReverse ? '2' : '0' ) : '' }
			}
			${ groupedFormSl }{
				${ isValidCSS( 'gap', layout?.[ device ]?.gap ) }
			}
			${ btnWidthSl }{
				${ switched ? isValidCSS( 'width', isStacked ? '100%' : 'auto' ) : '' }
			}
			${ btnSl }{
				${ isValidCSS( 'padding', getBoxCSS( button?.[ device ]?.padding ) ) }
				${ isValidCSS( 'border-radius', getBoxCSS( button?.[ device ]?.radius ) ) }
			}
			${ btnWidthSl }, ${ btnSl }{
				${ button?.[ device ]?.width ? `${ isValidCSS( 'width', button[ device ].width ) } flex: 0 0 auto; max-width: 100%;` : '' }
			}
			${ stepperSl }{
				${ isValidCSS( 'width', stepper?.[ device ]?.width ) }
				${ isValidCSS( 'min-width', stepper?.[ device ]?.width ) }
			}
			${ gTableSl } td{
				${ isValidCSS( 'padding', getBoxCSS( gTable?.[ device ]?.padding ) ) }
			}
			${ vTableSl }{
				${ isValidCSS( 'margin-bottom', vTable?.[ device ]?.bottomGap ) }
			}
			${ qtyBoxSl }{
				${ isValidCSS( 'border-radius', getBoxCSS( quantity?.[ device ]?.radius ) ) }
				${ isValidCSS( 'height', quantity?.[ device ]?.height ) }
			}
			${ qtySl }{
				${ isValidCSS( 'width', quantity?.[ device ]?.width ) }
				${ isValidCSS( 'min-width', quantity?.[ device ]?.width ) }
			}
			${ selectSl }{
				${ isValidCSS( 'border-radius', getBoxCSS( select?.[ device ]?.radius ) ) }
				${ isValidCSS( 'padding', getBoxCSS( select?.[ device ]?.padding ) ) }
				${ select?.[ device ]?.width ? `${ isValidCSS( 'width', select[ device ].width ) } min-width: 0;` : '' }
			}
			${ vCellSl }{
				${ vTable?.[ device ]?.rowGap ? `padding-top: calc(${ vTable[ device ].rowGap } / 2); padding-bottom: calc(${ vTable[ device ].rowGap } / 2);` : '' }
			}
			${ vLabelCellSl }{
				${ isValidCSS( 'width', vTable?.[ device ]?.labelWidth ) }
			}
			${ gTableSl }{
				${ gTable?.[ device ]?.rowGap ? isValidCSS( 'border-spacing', `0 ${ gTable[ device ].rowGap }` ) : '' }
			}
		`;
	};

	return `
		${ getTypoCSS( '', button?.typo )?.googleFontLink }
		${ getTypoCSS( '', quantity?.typo )?.googleFontLink }
		${ getTypoCSS( '', label?.typo )?.googleFontLink }
		${ getTypoCSS( '', select?.typo )?.googleFontLink }
		${ getTypoCSS( '', clear?.typo )?.googleFontLink }
		${ getTypoCSS( '', vPrice?.typo )?.googleFontLink }
		${ getTypoCSS( '', gName?.typo )?.googleFontLink }
		${ getTypoCSS( '', gPrice?.typo )?.googleFontLink }
		${ getTypoCSS( '', messages?.typo )?.googleFontLink }
		${ getTypoCSS( '', viewCart?.typo )?.googleFontLink }

		${ btnSl }{
			${ isExist( normal?.border ) ? getBorderBoxCSS( normal.border ) : '' }
			${ isValidCSS( 'box-shadow', getMultiShadowCSS( button?.shadow ) ) }
			${ isValidCSS( 'gap', icon?.gap ) }
		}
		${ iconSl } svg{
			${ isValidCSS( 'width', icon?.size ) }
			${ isValidCSS( 'height', icon?.size ) }
		}
		${ iconSl }{
			${ isValidCSS( 'color', icon?.color?.text ) }
		}
		${ iconHoverSl }{
			${ isValidCSS( 'color', icon?.hover?.color?.text ) }
		}
		${ btnColorSl }{
			${ isValidCSS( 'color', normal?.color?.text ) }
			${ getBackgroundCSS( normal?.bg ) }
		}
		${ btnHoverSl }{
			${ isExist( hover?.border ) ? getBorderBoxCSS( hover.border ) : '' }
		}
		${ btnHoverColorSl }{
			${ isValidCSS( 'color', hover?.color?.text ) }
			${ getBackgroundCSS( hover?.bg ) }
		}
		${ btnAddedSl }{
			${ isValidCSS( 'color', added?.color?.text ) }
			${ getBackgroundCSS( added?.bg ) }
		}
		${ btnFocusSl }{
			${ 'gradient' !== hover?.bg?.type && 'image' !== hover?.bg?.type ? isValidCSS( 'outline-color', hover?.bg?.color ) : '' }
		}
		${ accentFocusSl }{
			${ 'gradient' !== normal?.bg?.type && 'image' !== normal?.bg?.type ? isValidCSS( 'outline-color', normal?.bg?.color ) : '' }
		}

		${ deviceStyles( 'desktop' ) }

		${ tabBreakpoint }{
			${ deviceStyles( 'tablet' ) }
		}

		${ mobileBreakpoint }{
			${ deviceStyles( 'mobile' ) }
		}

		${ stepperSl }{
			${ isValidCSS( 'color', stepper?.color?.text ) }
			${ getBackgroundCSS( stepper?.bg ) }
		}
		${ stepperSl }:hover, ${ stepperSl }:focus-visible{
			${ isValidCSS( 'color', stepper?.hover?.color?.text ) }
			${ getBackgroundCSS( stepper?.hover?.bg ) }
			${ stepper?.hover?.color?.text || stepper?.hover?.bg?.color || 'gradient' === stepper?.hover?.bg?.type ? 'filter: none;' : '' }
		}
		${ qtyBoxSl }{
			${ isValidCSS( 'border-width', quantity?.border?.width ) }
			${ isValidCSS( 'border-style', quantity?.border?.style ) }
			${ isValidCSS( 'border-color', quantity?.border?.color ) }
		}
		${ stepperInputSl }{
			${ isValidCSS( 'border-inline-width', quantity?.border?.width ) }
			${ isValidCSS( 'border-inline-style', quantity?.border?.style ) }
			${ isValidCSS( 'border-inline-color', quantity?.border?.color ) }
		}
		${ qtySl }{
			${ isValidCSS( 'color', quantity?.color?.text || stepper?.color?.text ) }
			${ getBackgroundCSS( quantity?.bg ) }
		}
		${ qtyHoverSl }{
			${ isValidCSS( 'color', quantity?.hover?.color?.text ) }
			${ getBackgroundCSS( quantity?.hover?.bg ) }
		}
		${ qtyFrameHoverSl }{
			${ isValidCSS( 'border-width', quantity?.hover?.border?.width ) }
			${ isValidCSS( 'border-style', quantity?.hover?.border?.style ) }
			${ isValidCSS( 'border-color', quantity?.hover?.border?.color ) }
		}

		${ vLabelSl }{
			${ isValidCSS( 'color', label?.color?.text ) }
		}
		${ vLabelSl }:hover{
			${ isValidCSS( 'color', label?.hover?.color?.text ) }
		}
		${ selectSl }{
			${ isValidCSS( 'color', select?.color?.text ) }
			${ getBackgroundCSS( select?.bg ) }
			${ isValidCSS( 'border-width', select?.border?.width ) }
			${ isValidCSS( 'border-style', select?.border?.style ) }
			${ isValidCSS( 'border-color', select?.border?.color ) }
		}
		${ selectHoverSl }{
			${ isValidCSS( 'color', select?.hover?.color?.text ) }
			${ getBackgroundCSS( select?.hover?.bg ) }
			${ isValidCSS( 'border-width', select?.hover?.border?.width ) }
			${ isValidCSS( 'border-style', select?.hover?.border?.style ) }
			${ isValidCSS( 'border-color', select?.hover?.border?.color ) }
		}
		${ clearSl }{
			${ isValidCSS( 'color', clear?.color?.text ) }
		}
		${ clearSl }:hover, ${ clearSl }:focus-visible{
			${ isValidCSS( 'color', clear?.hover?.color?.text ) }
		}
		${ priceSl }, ${ priceSl } ins, ${ priceSl } .woocommerce-Price-amount{
			${ isValidCSS( 'color', vPrice?.color?.text ) }
		}

		${ gTableSl } td{
			${ isValidCSS( 'border-block-width', gTable?.border?.width ) }
			${ isValidCSS( 'border-block-style', gTable?.border?.style ) }
			${ isValidCSS( 'border-block-color', gTable?.border?.color ) }
			${ getBackgroundCSS( gTable?.bg ) }
		}
		${ gTableSl } td:first-child{
			${ isValidCSS( 'border-inline-start-width', gTable?.border?.width ) }
			${ isValidCSS( 'border-inline-start-style', gTable?.border?.style ) }
			${ isValidCSS( 'border-inline-start-color', gTable?.border?.color ) }
		}
		${ gTableSl } td:last-child{
			${ isValidCSS( 'border-inline-end-width', gTable?.border?.width ) }
			${ isValidCSS( 'border-inline-end-style', gTable?.border?.style ) }
			${ isValidCSS( 'border-inline-end-color', gTable?.border?.color ) }
		}
		${ gNameSl }{
			${ isValidCSS( 'color', gName?.color?.text ) }
		}
		${ gNameHoverSl }{
			${ isValidCSS( 'color', gName?.hover?.color?.text ) }
		}
		${ gPriceSl }{
			${ isValidCSS( 'color', gPrice?.color?.text ) }
		}

		${ stockSl }{
			${ isValidCSS( 'color', messages?.color?.text ) }
		}
		${ stockSl }.in-stock{
			${ isValidCSS( 'color', messages?.color?.inStock || messages?.color?.text ) }
		}
		${ stockSl }.out-of-stock, ${ stockSl }.available-on-backorder{
			${ isValidCSS( 'color', messages?.color?.outOfStock || messages?.color?.text ) }
		}

		${ viewCartSl }{
			${ isValidCSS( 'color', viewCart?.color?.text ) }
		}
		${ viewCartSl }:hover, ${ viewCartSl }:focus-visible{
			${ isValidCSS( 'color', viewCart?.hover?.color?.text ) }
		}

		${ getTypoCSS( btnSl, button?.typo )?.styles }
		${ getTypoCSS( qtySl, quantity?.typo )?.styles }
		${ getTypoCSS( vLabelSl, label?.typo )?.styles }
		${ getTypoCSS( selectSl, select?.typo )?.styles }
		${ getTypoCSS( clearSl, clear?.typo )?.styles }
		${ getTypoCSS( priceSl, vPrice?.typo )?.styles }
		${ getTypoCSS( gNameSl, gName?.typo )?.styles }
		${ getTypoCSS( gPriceSl, gPrice?.typo )?.styles }
		${ getTypoCSS( stockSl, messages?.typo )?.styles }
		${ getTypoCSS( viewCartSl, viewCart?.typo )?.styles }

		${ generateCSS( id, advanced, isBackend ) }
	`;
};

export default style;
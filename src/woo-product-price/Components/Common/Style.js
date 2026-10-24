import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBoxCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { ALIGNMENTS, BOX, DIRECTIONS, VERTICAL_ALIGNS, toBackground } from '../../utils/functions';

const Style = ( { attributes, id, isBackend = false } ) => {
	const { options, layout, regularPrice, salePrice, currency, prefixStyle, suffixStyle, savingsStyle, advanced } = attributes;

	const mainSl = `#${ id }`;
	const blockSl = `${ mainSl } .${ BOX }`;
	const priceSl = `${ blockSl } .${ BOX }-price`;
	const regularSl = `${ priceSl } del, ${ priceSl } > .woocommerce-Price-amount`;
	const loneSl = `${ priceSl }:not(:has(ins))`;
	const saleSl = `${ priceSl } ins`;
	const symbol = '.woocommerce-Price-currencySymbol';
	const symbolSl = `${ priceSl } ${ symbol }`;
	const regularSymbolSl = `${ priceSl } del ${ symbol }, ${ priceSl } > .woocommerce-Price-amount ${ symbol }`;
	const saleSymbolSl = `${ priceSl } ins ${ symbol }`;
	const prefixSl = `${ blockSl } .${ BOX }-prefix`;
	const suffixSl = `${ blockSl } .${ BOX }-suffix`;
	const iconSl = `${ prefixSl }--icon, ${ suffixSl }--icon`;
	const savingsSl = `${ blockSl } .${ BOX }-savings`;

	const valign = VERTICAL_ALIGNS.includes( currency?.align ) ? currency.align : 'baseline';
	const justify = { left: 'flex-start', center: 'center', right: 'flex-end' };
	const mirrored = { left: 'flex-end', center: 'center', right: 'flex-start' };

	const larger = { desktop: [ 'desktop' ], tablet: [ 'tablet', 'desktop' ], mobile: [ 'mobile', 'tablet', 'desktop' ] };
	const inherited = ( device, key, allowed, fallback ) => larger[ device ].map( ( d ) => layout?.[ d ]?.[ key ] ).find( ( value ) => allowed.includes( value ) ) || fallback;

	const regularTypo = getTypoCSS( regularSl, regularPrice?.typo );
	const loneTypo = getTypoCSS( loneSl, regularPrice?.typo );
	const saleTypo = getTypoCSS( saleSl, salePrice?.typo );
	const prefixTypo = getTypoCSS( prefixSl, prefixStyle?.typo );
	const suffixTypo = getTypoCSS( suffixSl, suffixStyle?.typo );
	const savingsTypo = getTypoCSS( savingsSl, savingsStyle?.typo );

	const boxStyles = ( sl, value, device ) => `
		${ sl }{
			${ isValidCSS( 'padding', getBoxCSS( value?.padding?.[ device ] ) ) }
			${ isValidCSS( 'border-radius', getBoxCSS( value?.radius?.[ device ] ) ) }
		}
	`;

	const deviceStyles = ( device ) => {
		const direction = inherited( device, 'direction', DIRECTIONS, 'row' );
		const alignment = inherited( device, 'alignment', ALIGNMENTS, 'left' );
		const stacked = 'column' === direction;

		return `
			${ blockSl }{
				flex-direction: ${ direction };
				${ stacked ? `justify-content: flex-start; align-items: ${ justify[ alignment ] };` : `justify-content: ${ justify[ alignment ] }; justify-content: ${ alignment }; align-items: center;` }
				${ isValidCSS( 'gap', layout?.[ device ]?.gap ) }
			}
			${ stacked ? `[dir="rtl"] ${ blockSl }{ align-items: ${ mirrored[ alignment ] }; }` : '' }
			${ iconSl }{
				align-self: ${ stacked ? 'auto' : 'center' };
			}
			${ priceSl }{
				${ isValidCSS( 'column-gap', layout?.[ device ]?.priceGap ) }
			}
			${ boxStyles( regularSl, regularPrice, device ) }
			${ boxStyles( saleSl, salePrice, device ) }
			${ boxStyles( prefixSl, prefixStyle, device ) }
			${ boxStyles( suffixSl, suffixStyle, device ) }
			${ boxStyles( savingsSl, savingsStyle, device ) }
		`;
	};

	const affixStyles = ( sl, value ) => `
		${ sl }{
			${ isValidCSS( 'color', value?.color ) }
			${ getBackgroundCSS( toBackground( value?.bg ), true, true, false ) || '' }
		}
		${ sl } svg{
			${ isValidCSS( 'width', value?.iconSize ) }
			${ isValidCSS( 'height', value?.iconSize ) }
		}
	`;

	const blockCSS = `
		${ [ regularTypo, saleTypo, prefixTypo, suffixTypo, savingsTypo ].map( ( typo ) => typo.googleFontLink ).join( '' ) }
		${ loneSl }{
			${ isValidCSS( 'color', regularPrice?.color ) }
		}
		${ loneTypo.styles }
		${ regularSl }{
			${ isValidCSS( 'color', regularPrice?.color ) }
			${ getBackgroundCSS( toBackground( regularPrice?.bg ), true, true, false ) || '' }
		}
		${ priceSl } del{
			${ isValidCSS( 'text-decoration-color', regularPrice?.strike?.color ) }
			${ isValidCSS( 'text-decoration-thickness', regularPrice?.strike?.thickness ) }
		}
		${ false === options?.showRegular ? `${ priceSl } del, ${ priceSl } del + .screen-reader-text{ display: none; }` : '' }
		${ regularTypo.styles }
		${ saleSl }{
			${ isValidCSS( 'color', salePrice?.color ) }
			${ getBackgroundCSS( toBackground( salePrice?.bg ), true, true, false ) || '' }
		}
		${ saleTypo.styles }

		${ symbolSl }{
			${ isValidCSS( 'color', currency?.color ) }
			${ isValidCSS( 'font-size', currency?.size ) }
			${ 'baseline' !== valign ? `vertical-align: ${ valign };` : '' }
		}
		${ regularSymbolSl }{
			${ isValidCSS( 'color', currency?.regular?.color ) }
			${ isValidCSS( 'font-size', currency?.regular?.size ) }
		}
		${ saleSymbolSl }{
			${ isValidCSS( 'color', currency?.sale?.color ) }
			${ isValidCSS( 'font-size', currency?.sale?.size ) }
		}

		${ affixStyles( prefixSl, prefixStyle ) }
		${ prefixTypo.styles }
		${ affixStyles( suffixSl, suffixStyle ) }
		${ suffixTypo.styles }
		${ affixStyles( savingsSl, savingsStyle ) }
		${ savingsTypo.styles }

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
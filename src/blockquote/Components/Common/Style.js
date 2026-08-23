import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { getBackgroundCSS, getBorderCSS, getBoxCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

const boxStyleCSS = ( v = {} ) => `
	${ getBackgroundCSS( v.bg ) }
	${ isValidCSS( 'padding', getBoxCSS( v.padding ) ) }
	${ isValidCSS( 'margin', getBoxCSS( v.margin ) ) }
	${ getBorderCSS( v.border ) }
	${ isValidCSS( 'border-radius', getBoxCSS( v.borderRadius ) ) }
`;

const Style = ( { attributes, id, isBackend = false } ) => {
	const { quote = {}, authorName = {}, authorRole = {}, avatar = {}, icon = {}, advanced } = attributes;

	const {
		color: quoteColor,
		bg: quoteBg = {},
		typography: quoteTypo = {},
		padding: quotePadding = {},
		margin: quoteMargin = {},
		border: quoteBorder = {},
		borderRadius: quoteRadius = {},
	} = quote;
	const { color: nameColor, typography: nameTypo = {} } = authorName;
	const { color: roleColor, typography: roleTypo = {} } = authorRole;
	const { size: avatarSize, shape: avatarShape } = avatar;
	const { color: iconColor, size: iconSize, align: iconAlign } = icon;

	// Avatar border-radius: circle = 50%, rounded = 12px, square = 0.
	const avatarRadius = 'circle' === avatarShape ? '50%' : ( 'rounded' === avatarShape ? '12px' : '0' );

	// Icon alignment maps to align-self within the flex-column figure.
	const iconAlignSelf = 'center' === iconAlign ? 'center' : ( 'right' === iconAlign ? 'flex-end' : 'flex-start' );

	const markSize = iconSize || '48px';

	const mainSl = `#${ id }`;
	const blockSl = `${ mainSl } .bBlocks-blockquote-wrapper`;
	const quoteSl = `${ blockSl } .bBlocks-blockquote-quote`;
	const avatarSl = `${ blockSl } .bBlocks-blockquote-avatar`;
	const authorSl = `${ blockSl } .bBlocks-blockquote-author`;
	const roleSl = `${ blockSl } .bBlocks-blockquote-role`;
	const iconSl = `${ blockSl } .bBlocks-blockquote-icon`;

	return <style
		dangerouslySetInnerHTML={ {
			__html: `
			${ getTypoCSS( '', quoteTypo ).googleFontLink }
			${ getTypoCSS( '', nameTypo ).googleFontLink }
			${ getTypoCSS( '', roleTypo ).googleFontLink }
			${ iconSl }{
				${ isValidCSS( 'width', markSize ) }
				${ isValidCSS( 'height', markSize ) }
				${ isValidCSS( 'color', iconColor ) }
				align-self: ${ iconAlignSelf };
				${ boxStyleCSS( icon ) }
			}
			${ getTypoCSS( quoteSl, quoteTypo ).styles }
			${ quoteSl }{
				${ isValidCSS( 'color', quoteColor ) }
				${ getBackgroundCSS( quoteBg ) }
				${ isValidCSS( 'padding', getBoxCSS( quotePadding ) ) }
				${ isValidCSS( 'margin', getBoxCSS( quoteMargin ) ) }
				${ getBorderCSS( quoteBorder ) }
				${ isValidCSS( 'border-radius', getBoxCSS( quoteRadius ) ) }
			}
			${ avatarSl }{
				${ isValidCSS( 'width', avatarSize ) }
				${ isValidCSS( 'height', avatarSize ) }
				${ isValidCSS( 'border-radius', avatarRadius ) }
				${ boxStyleCSS( avatar ) }
			}
			${ getTypoCSS( authorSl, nameTypo ).styles }
			${ authorSl }{
				${ isValidCSS( 'color', nameColor ) }
				${ boxStyleCSS( authorName ) }
			}
			${ getTypoCSS( roleSl, roleTypo ).styles }
			${ roleSl }{
				${ isValidCSS( 'color', roleColor ) }
				${ boxStyleCSS( authorRole ) }
			}
			${ generateCSS( id, advanced, isBackend, false ) }
			`,
		} }
	/>;
};
export default Style;

import { getBackgroundCSS, getBorderCSS, getIconCSS, getShadowCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { socials, alignment, background, size, padding, margin, border, shadow } = attributes;

	const mainSl = `#${id}`;
	const ssSl = `${mainSl} ul.${prefix}`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${mainSl}{
			text-align: ${alignment};
		}
		${ssSl} li.icon{
			font-size: ${size};
			${getBackgroundCSS(background)}
			width: calc( ${size} + ${padding} + ${padding} );
			height: calc( ${size} + ${padding} + ${padding} );
			margin: 0 calc( ${margin} / 2 );
			${getBorderCSS(border)}
			box-shadow: ${getShadowCSS(shadow) || 'none'};
		}
		${ssSl} li.icon img{
			width: ${size};
		}

		${socials?.map((item, index) => `
			${ssSl} li.icon-${index} i{
				${getIconCSS(item?.icon)}
				font-size: inherit;
			}`
		).join(' ')}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;
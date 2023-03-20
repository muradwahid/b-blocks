import { getBackgroundCSS, getBorderCSS, getIconCSS, getShadowCSS } from '../../../../Components/Helper/getCSS';

const Style = ({ attributes, clientId }) => {
	const { socials, alignment, background, size, padding, margin, border, shadow } = attributes;

	return <>
		<style dangerouslySetInnerHTML={{
			__html: `
			#bBlocksSocialShare-${clientId}{
				text-align: ${alignment};
			}
			#bBlocksSocialShare-${clientId} ul.bBlocksSocialShare li.icon{
				font-size: ${size};
				${getBackgroundCSS(background)}
				width: calc( ${size} + ${padding} + ${padding} );
				height: calc( ${size} + ${padding} + ${padding} );
				margin: 0 calc( ${margin} / 2 );
				${getBorderCSS(border)}
				box-shadow: ${getShadowCSS(shadow) || 'none'};
			}
			#bBlocksSocialShare-${clientId} ul.bBlocksSocialShare li.icon img{
				width: ${size};
			}
			`.replace(/\s+/g, ' ')
		}} />

		<style>
			{socials?.map((item, index) => `
				#bBlocksSocialShare-${clientId} ul.bBlocksSocialShare li.icon-${index} i{
					${getIconCSS(item?.icon)}
					font-size: inherit;
				}`.replace(/\s+/g, ' ')
			)}
		</style>
	</>
}
export default Style;
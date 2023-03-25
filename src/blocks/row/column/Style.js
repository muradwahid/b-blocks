import { getBackgroundCSS, getBorderCSS, getShadowCSS, getSpaceCSS } from '../../../../../Components/Helper/getCSS';

const Style = ({ attributes, clientId, isBackend }) => {
	const { width, overflow, background, padding, border, shadow } = attributes;

	const parentSelector = isBackend ? `#block-${clientId}` : `#bBlocksColumn-${clientId}`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${parentSelector}{
			width: ${width.mobile}%;
		}
		@media (min-width: 576px) {
			${parentSelector}{
				width: ${width.tablet}%;
			}
		}

		@media (min-width: 768px) {
			${parentSelector}{
				width: ${width.desktop}%;
			}
		}

		#bBlocksColumn-${clientId} .bBlocksColumn{
			overflow: ${overflow};
			${getBackgroundCSS(background)}
			padding: ${getSpaceCSS(padding)};
			${getBorderCSS(border)}
			box-shadow: ${getShadowCSS(shadow)};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;
import servicePattern from '../../../img/service-pattern.png';

const Style = ({ attributes, clientId, isBackend }) => {
	const { width, background, padding, border } = attributes;

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
			${background?.styles || 'background-color: #0000;'}
			padding: ${padding?.styles || '5px 10px'};
			${border?.styles || ''}
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;
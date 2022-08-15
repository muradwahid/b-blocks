const Style = ({ attributes, clientId, isBackend }) => {
	const { width, background, padding, border, shadow } = attributes;

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
			${background?.styles || 'background-color: #fff;'}
			padding: ${padding?.styles || '10px 10px'};
			${border?.styles || ''}
			box-shadow: ${shadow?.styles || 'none'};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;
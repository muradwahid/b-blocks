const Style = ({ attributes, clientId }) => {
	const { background, padding, border } = attributes;

	return <style dangerouslySetInnerHTML={{
		__html: `
		#bBlocksRow-${clientId} .bBlocksRow{
			${background?.styles || 'background-color: #0000;'}
			padding: ${padding?.styles || '15px 20px'};
			${border?.styles || ''}
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;
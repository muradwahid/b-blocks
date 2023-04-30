const Style = ({ attributes, clientId }) => {
	const { width, radius } = attributes;

	return <style dangerouslySetInnerHTML={{
		__html: `
		#bBlocksVideo-${clientId} .bBlocksVideo{
			width: ${'0px' === width || '0%' === width || '0em' === width ? '100%' : width};
			border-radius: ${radius};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;
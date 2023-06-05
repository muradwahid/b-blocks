const Style = ({ attributes, clientId }) => {
	const { alignment, width, height } = attributes;

	return <style dangerouslySetInnerHTML={{
		__html: `
		#bBlocks3DViewer-${clientId} .bBlocks3DViewer{
			text-align: ${alignment};
		}
		#bBlocks3DViewer-${clientId} .bBlocks3DViewer model-viewer{
			width: ${['0px', '0%', '0em'].includes(width) ? 'auto' : width};
			height: ${['0px', '0%', '0em'].includes(height) ? '350px' : height};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;
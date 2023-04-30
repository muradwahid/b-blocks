const Style = ({ attributes, clientId }) => {
	const { alignment, width, height } = attributes;

	return <style dangerouslySetInnerHTML={{
		__html: `
		#bBlocks3DViewer-${clientId} .bBlocks3DViewer{
			text-align: ${alignment};
		}
		#bBlocks3DViewer-${clientId} .bBlocks3DViewer model-viewer{
			width: ${'0px' === width || '0%' === width || '0em' === width ? 'auto' : width};
			height: ${'0px' === height || '0%' === height || '0em' === height ? '350px' : height};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;
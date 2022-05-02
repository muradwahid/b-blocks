const Style = ({ attributes, clientId }) => {
    const { background, width, height, alignment } = attributes;

    return <style dangerouslySetInnerHTML={{
        __html: `
        #bBlocksChart-${clientId}{
			text-align: ${alignment};
		}
		#bBlocksChart-${clientId} .bBlocksChart{
			height: ${height};
		}
		#bBlocksChart-${clientId} .bBlocksChart, #bBlocksChart-${clientId} .downloadArea{
			width: ${width};
		}
		#bBlocksChart-${clientId} .bBlocksChart canvas{
			${background?.styles || 'background-color: #0000;'};
		}
		`.replace(/\s+/g, ' ')
    }} />
}
export default Style;
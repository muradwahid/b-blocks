import { getBackgroundCSS } from '../../../../../../Components/utils/getCSS';

const Style = ({ attributes, clientId }) => {
	const { background, width, height, alignment } = attributes;

	const mainSl = `#bBlocksChart-${clientId}`;
	const chartSl = `${mainSl} .bBlocksChart`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${mainSl}{
			text-align: ${alignment};
		}
		${chartSl}{
			height: ${height};
		}
		${chartSl},
		${mainSl} .downloadArea{
			width: ${width};
		}
		${chartSl} canvas{
			${getBackgroundCSS(background)};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;
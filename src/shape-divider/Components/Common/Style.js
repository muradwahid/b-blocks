import { getBackgroundCSS, getBoxCSS } from '../../../../../Components/utils/getCSS';

const Style = ({ attributes, id }) => {
	const { shapeColor, shapePosition, shapeWidth, shapeHeight, padding, background, height } = attributes;

	const mainSl = `#${id}`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${mainSl}{
			min-height: ${height.desktop};
			${getBackgroundCSS(background)}
			padding: ${getBoxCSS(padding)};
		}

		${mainSl} svg{
			width: calc(${shapeWidth}% + 1.3px);
			height: ${shapeHeight.desktop};
			fill: ${shapeColor};
			top: ${'top' === shapePosition ? 0 : 'auto'};
			bottom: ${'bottom' === shapePosition ? 0 : 'auto'};
			transform: rotate(${'top' === shapePosition ? 0 : 180}deg);
		}
	`}} />;
}
export default Style;
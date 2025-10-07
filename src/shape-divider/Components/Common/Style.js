import { getBackgroundCSS, getBoxCSS } from '../../../../../bpl-tools/utils/getCSS';

const Style = ({ attributes, id }) => {
	const { shapeColor, shapePosition, shapeWidth, shapeHeight, isShapeSplite, padding, background, height } = attributes;

	const mainSl = `#${id}`;

	const rotate = 'top' === shapePosition ? 'rotate(0deg)' : 'rotate(180deg)';
	const scale = isShapeSplite ? 'scaleX(1)' : 'scaleX(-1)';

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
			transform: ${rotate+ ' ' + scale};
		}
	`}} />;
}
export default Style;
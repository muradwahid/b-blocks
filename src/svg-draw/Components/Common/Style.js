import generateCSS from "../../../../../bpl-tools/Advanced/generateCSS";
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getShadowCSS, isValidCSS } from "../../../../../bpl-tools/utils/getCSS";
const Style = ({ attributes, id, isBackend = false }) => {
  const { style, advanced } = attributes;
  const { height, width, align, margin, padding, background, border, borderRadius, colors } = style;
  const { normal, hover } = colors;

  const mainSl = `#${id}`;
  const blockSl = `${mainSl} .svdr-icon-draw-wrapper`;
  const svgWrapper = `${blockSl} .svdr-svg-wrapper`;
  const svgSl = `${svgWrapper} svg`;
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
        ${generateCSS(`${id} .svdr-icon-draw-wrapper`, advanced, isBackend)}
        ${blockSl}{
          ${isValidCSS("justify-content", align)}
        }
        ${svgWrapper}{
          ${isValidCSS("height", height)}
          ${isValidCSS("width", width)}
          ${isValidCSS("margin", getBoxCSS(margin))}
          ${isValidCSS("padding", getBoxCSS(padding))}
          ${getBackgroundCSS(background)}
          ${getBorderBoxCSS(border)}
          ${isValidCSS("border-radius", getBoxCSS(borderRadius))}
        }
        ${svgSl}{
          ${isValidCSS("fill", normal.fill)}
          ${isValidCSS("stroke", normal.strokeColor)}
          filter:drop-shadow(${getShadowCSS(normal.shadow, "text")});
          transition:${hover.transition}ms ease-in-out;
        }
        ${svgSl}:hover{
          ${isValidCSS("fill", hover.fill)}
          ${isValidCSS("stroke", hover.strokeColor)}
          filter:drop-shadow(${getShadowCSS(hover.shadow, "text")});
        }
	`,
      }}
    />
  );
};
export default Style;

import { getShadowCSS } from "../../../../../bpl-tools/utils/getCSS";
import { prefix } from '../../utils/data';

const Style = ({ attributes, id, extraCSS = '' }) => {
	const { wrapper, icon, animation } = attributes;
	const { size, color, shadow } = icon;
	const { width, height } = wrapper;
	const { duration, delay } = animation;

	const mainSl = `#${id} .${prefix}`;
	const svgSl = `${mainSl} svg`;

	return <style dangerouslySetInnerHTML={{
		__html: `
			${extraCSS}
			${mainSl}{
				width: ${!width || 0 === parseInt(width) ? 'auto' : width};
				height: ${!height || 0 === parseInt(height) ? 'auto' : height};
			}
			${svgSl}{
				fill: ${color};
				height: ${size};
				width: ${size};
				filter: drop-shadow(${getShadowCSS(shadow, 'text')});
			}

  ${mainSl}.bounce {
    animation: bounce ${duration}ms ease-in-out ${delay}ms infinite;
  }

  ${mainSl}.pulse {
    animation: pulse ${duration}ms ease-in-out ${delay}ms infinite;
  }

  ${mainSl}.spin {
    animation: spin ${duration}ms linear ${delay}ms infinite;
  }

  ${mainSl}.shake {
    animation: shake ${duration}ms ease-in-out ${delay}ms infinite;
  }

  ${mainSl}.wiggle {
    animation: wiggle ${duration}ms ease-in-out ${delay}ms infinite;
  }

  ${mainSl}.ping {
    animation: ping ${duration}ms cubic-bezier(0, 0, 0.2, 1) ${delay}ms infinite;
  }

  ${mainSl}.float {
    animation: float ${duration}ms ease-in-out ${delay}ms infinite;
  }
`.replace(/\s+/g, ' ')
	}} />;
}
export default Style;
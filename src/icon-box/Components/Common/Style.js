import { isExist } from '../../../../../bpl-tools/utils/common';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getShadowCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';
import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';

import { prefix } from '../../utils/data';

const Style = ({ attributes, id, isBackend= false }) => {
	const { wrapper, icon, animation, advanced } = attributes;
	const { size, color, shadow } = icon;
	const { width, height } = wrapper;
	const { duration, delay, type, iteration, iterationCount, hover } = animation;

	const mainSl = `#${id} .${prefix}`;
	const svgSl = `${mainSl} svg`;
	const animationFunc = (prefix, t, d, dl, i) => `${t} ${d}ms ${t == prefix + 'Spin' ? 'linear' : t === prefix + 'Ping' ? 'cubic-bezier(0, 0, 0.2, 1)' : 'ease-in-out'} ${dl}ms ${i};`;

	return <style dangerouslySetInnerHTML={{
		__html: `
			${mainSl}{
				width: ${!width || 0 === parseInt(width) ? 'auto' : width};
				height: ${!height || 0 === parseInt(height) ? 'auto' : height};
			}
			#${id}{
				${isValidCSS('justify-content', wrapper?.alignment?.desktop)}
			}
			${svgSl}{
				fill: ${color};
				height: ${size};
				width: ${size};
				filter: drop-shadow(${getShadowCSS(shadow, 'text')});
			}

			${mainSl}:hover svg {
				${isValidCSS('fill', icon?.hover?.color)}
				${isValidCSS('filter', isExist(icon?.hover?.shadow) ? `drop-shadow(${getShadowCSS(icon?.hover?.shadow, 'text')})` : '')}
			}

			${mainSl}.${type} {
				animation: ${animationFunc('n', type, duration, delay, iteration === 'number' ? iterationCount : iteration)}
			}
				
			${mainSl}.${hover?.type}:hover{
				animation: ${animationFunc('h', hover?.type, hover?.duration, hover?.delay, hover?.iteration === 'number' ? hover?.iterationCount : hover?.iteration)}
			}

			${tabBreakpoint}{
				#${id}{
					${isValidCSS('justify-content', wrapper?.alignment?.tablet)}
				}
			}

			${mobileBreakpoint}{
				#${id}{
					${isValidCSS('justify-content', wrapper?.alignment?.mobile)}
				}
			}
			${generateCSS(id, advanced, isBackend)}

`.replace(/\s+/g, ' ')
	}} />;
}
export default Style;
import { tabBreakpoint, mobileBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderCSS, getBoxCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

// Responsive resolver: desktop → tablet → mobile inheritance, tolerant of a
// legacy plain string value.
const at = (obj, d) => {
	if (typeof obj === 'string') return obj;
	return obj?.[d] || (d === 'mobile' ? (obj?.tablet || obj?.desktop) : obj?.desktop);
};

const Style = ({ attributes, id, isBackend = false }) => {
	const {
		trigger = {},
		drawer = {},
		overlay = {},
		transition = {},
	} = attributes;

	const mainSl = `#${id}`;
	const triggerSl = `${mainSl} .b-blocks-off-canvas-trigger`;
	const iconSl = `${mainSl} .b-blocks-off-canvas-icon`;
	// Frontend panel + editor preview share drawer styling (bg/padding/border).
	const panelSl = `${mainSl} .b-blocks-off-canvas-panel, ${mainSl} .b-blocks-off-canvas-editor-preview`;
	const overlaySl = `${mainSl} .b-blocks-off-canvas-overlay`;

	const iconStyle = trigger.iconStyle || {};

	const box = (prop, obj, d) => isValidCSS(prop, getBoxCSS(obj?.[d]));
	const overlayColor = overlay.show === false ? 'transparent' : (overlay.color || 'rgba(0,0,0,0.5)');

	// Per-device custom properties + panel/trigger box metrics.
	const vars = (d) => `
		${mainSl}{
			${isValidCSS('text-align', trigger.align)}
			--b-blocks-off-canvas-duration: ${parseInt(transition.duration, 10) || 0}ms;
			--b-blocks-off-canvas-easing: ${transition.easing || 'ease'};
			${isValidCSS('--b-blocks-off-canvas-width', at(drawer.width, d))}
		}
		${triggerSl}{
			${box('padding', trigger.normal?.padding, d)}
			${box('border-radius', trigger.normal?.borderRadius, d)}
		}
		${triggerSl}:hover{
			${box('padding', trigger.hover?.padding, d)}
			${box('border-radius', trigger.hover?.borderRadius, d)}
		}
		${iconSl}{
			${isValidCSS('width', at(iconStyle.size, d))}
			${isValidCSS('height', at(iconStyle.size, d))}
		}
		${panelSl}{
			${box('padding', drawer.padding, d)}
			${box('border-radius', drawer.borderRadius, d)}
			${at(drawer.height, d) ? `${isValidCSS('height', at(drawer.height, d))} bottom: auto;` : ''}
		}
	`;

	return <style
		dangerouslySetInnerHTML={{
			__html: `
			${getTypoCSS('', trigger.typo).googleFontLink}

			${mainSl}{
				--b-blocks-off-canvas-overlay: ${overlayColor};
			}

			${iconSl}{
				${isValidCSS('color', iconStyle.color)}
			}
			${iconSl} svg{
				${isValidCSS('fill', iconStyle.color)}
			}

			${triggerSl}{
				${isValidCSS('gap', iconStyle.gap)}
				${getBackgroundCSS(trigger.normal?.bg)}
				${isValidCSS('color', trigger.normal?.color)}
				${getBorderCSS(trigger.normal?.border)}
				transition: all ${parseInt(trigger.transition, 10) || 0}ms ease;
			}
			${triggerSl}:hover{
				${getBackgroundCSS(trigger.hover?.bg)}
				${isValidCSS('color', trigger.hover?.color)}
				${getBorderCSS(trigger.hover?.border)}
			}
			${getTypoCSS(triggerSl, trigger.typo).styles}

			${panelSl}{
				${getBackgroundCSS(drawer.bg)}
				${getBorderCSS(drawer.border)}
			}

			${overlaySl}.is-open{
				${isValidCSS('background-color', overlayColor)}
			}

			${isBackend ? `${mainSl} .b-blocks-off-canvas-editor-preview{ ${isValidCSS('width', at(drawer.width, 'desktop'))} max-width: 100%; }` : ''}

			${vars('desktop')}
			${tabBreakpoint}{ ${vars('tablet')} }
			${mobileBreakpoint}{ ${vars('mobile')} }

			@media (prefers-reduced-motion: reduce){ ${mainSl}{ --b-blocks-off-canvas-duration: 0ms; } }
			`,
		}}
	/>;
};
export default Style;

/**
 * Per-instance CSS for a Floating CTA block, scoped to the wrapper id.
 *
 * @param {Object} props
 * @param {Object} props.attributes Block attributes.
 * @param {string} props.id         Unique wrapper id.
 * @param {boolean} props.isBackend True when rendered inside the editor canvas.
 */
const Style = ( { attributes, id, isBackend = false } ) => {
	const {
		position,
		offsetX,
		offsetY,
		bgColor,
		textColor,
		hoverBgColor,
		hoverTextColor,
		fontSize,
		fontWeight,
		iconSize,
		iconGap,
		paddingV,
		paddingH,
		borderRadius,
		zIndex,
		animateDuration
	} = attributes;

	const sel = `#${ id }`;
	const wrap = `${ sel } .bb-fc-wrap`;
	const btn = `${ wrap } .bb-fc-btn`;

	// Resolve corner anchoring. In the editor the button is shown inline so it
	// does not float over the WP admin chrome.
	const isTop = position === 'top-left' || position === 'top-right';
	const isLeft = position === 'bottom-left' || position === 'top-left';

	const positionCSS = isBackend
		? ''
		: `
			position: fixed;
			${ isTop ? `top: ${ offsetY }px;` : `bottom: ${ offsetY }px;` }
			${ isLeft ? `left: ${ offsetX }px;` : `right: ${ offsetX }px;` }
			z-index: ${ zIndex };
		`;

	return (
		<style dangerouslySetInnerHTML={ { __html: `
			${ wrap } {
				${ positionCSS }
				display: inline-flex;
				align-items: center;
				--bb-fc-anim-duration: ${ animateDuration }ms;
			}

			${ btn } {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				gap: ${ iconGap }px;
				min-height: 44px;
				min-width: 44px;
				box-sizing: border-box;
				padding: ${ paddingV }px ${ paddingH }px;
				background-color: ${ bgColor };
				color: ${ textColor };
				font-size: ${ fontSize }px;
				font-weight: ${ fontWeight };
				line-height: 1.2;
				border: none;
				border-radius: ${ borderRadius }px;
				text-decoration: none;
				cursor: pointer;
				transition: background-color .2s ease, color .2s ease, transform .2s ease;
			}

			${ btn }:hover,
			${ btn }:focus-visible {
				background-color: ${ hoverBgColor };
				color: ${ hoverTextColor };
			}

			${ btn } .bb-fc-icon {
				font-size: ${ iconSize }px;
				line-height: 1;
			}

			${ wrap } .bb-fc-dismiss {
				position: absolute;
				top: -8px;
				${ isLeft ? 'right: -8px;' : 'left: -8px;' }
				width: 22px;
				height: 22px;
				padding: 0;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				background: #1e1e1e;
				color: #fff;
				border: 2px solid #fff;
				border-radius: 50%;
				font-size: 14px;
				line-height: 1;
				cursor: pointer;
				box-shadow: 0 1px 4px rgba(0,0,0,.25);
			}

			${ wrap } .bb-fc-dismiss:hover,
			${ wrap } .bb-fc-dismiss:focus-visible {
				background: #000;
			}
		`.replace( /\s+/g, ' ' ) } } />
	);
};

export default Style;

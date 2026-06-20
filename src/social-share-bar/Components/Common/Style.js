import { PLATFORMS } from './platforms';

/**
 * Helper: darken a hex color by a percentage. Returns the original value when
 * it is not a parseable 6-digit hex (e.g. var() tokens, named colors), in which
 * case CSS color-mix could be used but we fall back to the value itself.
 *
 * @param {string} hex     Hex color like #1877f2.
 * @param {number} percent Amount to darken, 0–100.
 * @return {string} Darkened hex or the original value.
 */
const darken = ( hex, percent ) => {
	const match = /^#([0-9a-fA-F]{6})$/.exec( ( hex || '' ).trim() );
	if ( ! match ) {
		return hex;
	}
	const num = parseInt( match[ 1 ], 16 );
	const amt = Math.round( 2.55 * percent );
	const r = Math.max( 0, ( num >> 16 ) - amt );
	const g = Math.max( 0, ( ( num >> 8 ) & 0xff ) - amt );
	const b = Math.max( 0, ( num & 0xff ) - amt );
	return '#' + ( 0x1000000 + r * 0x10000 + g * 0x100 + b ).toString( 16 ).slice( 1 );
};

/**
 * Per-instance CSS for a Social Share Bar, scoped to the wrapper id.
 *
 * @param {Object}  props
 * @param {Object}  props.attributes Block attributes.
 * @param {string}  props.id         Unique wrapper id.
 * @param {boolean} props.isBackend  True when rendered inside the editor canvas.
 */
const Style = ( { attributes, id, isBackend = false } ) => {
	const {
		side,
		offset,
		platforms,
		iconSize,
		buttonSize,
		buttonRadius,
		gap,
		backgroundColor,
		iconColor,
		hoverBackgroundColor,
		showLabels,
		labelSize,
		labelColor,
		zIndex,
		animationDuration
	} = attributes;

	const sel = `#${ id }`;

	const positionCSS = isBackend
		? ''
		: `
			position: fixed;
			top: 50%;
			${ side === 'right' ? 'right: 0;' : 'left: 0;' }
			transform: translateY(calc(-50% + ${ offset }px));
			z-index: ${ zIndex };
		`;

	// Per-platform brand background rules (used only when no global bg is set).
	const platformBg = ( platforms || [] )
		.map( ( key ) => {
			const meta = PLATFORMS[ key ];
			if ( ! meta ) {
				return '';
			}
			const base = backgroundColor || meta.color;
			const hover = hoverBackgroundColor || darken( base, 12 );
			return `
				${ sel } .bb-ssb-btn[data-bb-ssb-platform="${ key }"] {
					background-color: ${ base };
				}
				${ sel } .bb-ssb-btn[data-bb-ssb-platform="${ key }"]:hover,
				${ sel } .bb-ssb-btn[data-bb-ssb-platform="${ key }"]:focus-visible {
					background-color: ${ hover };
				}
			`;
		} )
		.join( ' ' );

	return (
		<style dangerouslySetInnerHTML={ { __html: `
			${ sel } {
				${ positionCSS }
				--bb-ssb-anim-duration: ${ animationDuration }ms;
			}

			${ sel } .bb-ssb-list {
				display: flex;
				flex-direction: column;
				gap: ${ gap }px;
				margin: 0;
				padding: 0;
				list-style: none;
			}

			${ sel } .bb-ssb-btn {
				display: inline-flex;
				align-items: center;
				justify-content: ${ showLabels ? 'flex-start' : 'center' };
				gap: 8px;
				box-sizing: border-box;
				min-width: ${ buttonSize }px;
				min-height: ${ buttonSize }px;
				width: ${ showLabels ? 'auto' : `${ buttonSize }px` };
				height: ${ buttonSize }px;
				padding: ${ showLabels ? `0 ${ Math.max( 10, gap + 6 ) }px` : '0' };
				border: none;
				border-radius: ${ buttonRadius }px;
				color: ${ iconColor };
				cursor: pointer;
				text-decoration: none;
				transition: background-color var(--bb-ssb-anim-duration, 300ms) ease, transform .15s ease;
			}

			${ sel } .bb-ssb-btn:hover {
				transform: translateX(${ side === 'right' ? '-2px' : '2px' });
			}

			${ sel } .bb-ssb-btn svg {
				width: ${ iconSize }px;
				height: ${ iconSize }px;
				fill: currentColor;
				flex-shrink: 0;
			}

			${ sel } .bb-ssb-label {
				font-size: ${ labelSize }px;
				line-height: 1;
				color: ${ labelColor };
				white-space: nowrap;
			}

			${ platformBg }
		`.replace( /\s+/g, ' ' ) } } />
	);
};

export default Style;

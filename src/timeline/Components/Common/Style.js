import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { clippedMarkerShapes, dashLineStyles, getRingCSS, markerShapeRadius, rotatedMarkerShapes } from '../../utils/options';
import { withTimelineDefaults } from '../../utils/functions';

/**
 * All user-configurable values for the Timeline are emitted here; style.scss
 * only carries the structural grid, the alternating side rules and the
 * connector geometry.
 *
 * A Timeline Item can re-colour itself, so anything an entry is allowed to
 * override is written at `#id .class` weight (one id, one class) and the
 * child emits its own rule at the same weight. The child's <style> always
 * comes later in the document, so it wins on source order.
 */
// The shape's radius, or nothing at all for `custom`, which is the value that
// hands the radius back to the per-device Border Radius control.
const getShapeCSS = ( shape ) => {
	const radius = markerShapeRadius[ shape ];

	const clip = clippedMarkerShapes.includes( shape )
		? 'clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);'
		: '';

	return `${ undefined === radius ? '' : `border-radius: ${ radius };` } ${ clip }`;
};

const Style = ( { attributes, id, isBackend = false } ) => {
	const { layout, connector, marker, card, date, advanced } = withTimelineDefaults( attributes );
	const { line, arrow } = connector;

	// A diamond is a rotated square, and the icon inside it is counter-rotated
	// by the same amount so it stays upright.
	const baseRotate = rotatedMarkerShapes[ marker.shape ] || 0;

	// A clipped shape cuts off anything painted outside the marker's box, so
	// the ring and the pulse are simply not available for one.
	const isClipped = clippedMarkerShapes.includes( marker.shape );

	// The halo takes its own background — a gradient is allowed, an image is
	// not, since it is scaled and faded rather than shown. Left empty it falls
	// back to the marker's own background, and past that to the marker's
	// colour in the stylesheet, so a pulse always has something to paint.
	const pulsePaint = getBackgroundCSS( marker.pulse?.bg, true, true, false ) || getBackgroundCSS( marker.normal.bg, true, true, false );

	const mainSl = `#${ id }`;
	const itemsSl = `${ mainSl } .b-blocks-timeline-items`;
	const itemSl = `${ mainSl } .b-blocks-timeline-item`;
	const contentSl = `${ mainSl } .b-blocks-timeline-content`;
	const cardSl = `${ mainSl } .b-blocks-timeline-card`;
	const markerSl = `${ mainSl } .b-blocks-timeline-marker`;
	const dateSl = `${ mainSl } .b-blocks-timeline-date`;

	// Some values are handed to style.scss as custom properties instead of
	// rules, because their effect depends on context this component cannot
	// express: the marker size also sets where the line starts and stops (and
	// on mobile, how far from the left it sits), the card background also
	// colours the arrow — on a different border edge per side — and the
	// marker gap is a column gap in a vertical timeline but a row gap in a
	// horizontal one, and a column gap again once mobile stacking kicks in.
	// The arrow's size, offset and colour go the same way: which border edge
	// and which axis they land on is decided by the direction and side rules.
	// Direction is per breakpoint and inherits upward, so which axis the line
	// runs along — and every value that lands on one edge or another because
	// of it — has to be answered per breakpoint too.
	const directionAt = ( device ) => (
		'desktop' === device
			? layout.desktop?.direction
			: 'tablet' === device
				? layout.tablet?.direction || layout.desktop?.direction
				: layout.mobile?.direction || layout.tablet?.direction || layout.desktop?.direction
	) || 'vertical';

	const isVerticalAt = ( device ) => 'horizontal' !== directionAt( device );

	// Tablet and mobile fall back to the wider breakpoint when left empty.
	// The line's measurements have to be resolved rather than skipped, because
	// the inactive border edge is zeroed at every breakpoint.
	// A breakpoint left empty inherits the one above it, so anything that has
	// to agree with a rendered value has to resolve the same way it does.
	const layoutValue = ( device, key ) => {
		if ( 'desktop' === device ) {
			return layout.desktop[ key ];
		}
		if ( 'tablet' === device ) {
			return layout.tablet[ key ] || layout.desktop[ key ];
		}
		return layout.mobile[ key ] || layout.tablet[ key ] || layout.desktop[ key ];
	};

	const lineValue = ( device, key ) => {
		if ( 'desktop' === device ) {
			return line.desktop[ key ];
		}
		if ( 'tablet' === device ) {
			return line.tablet[ key ] || line.desktop[ key ];
		}
		return line.mobile[ key ] || line.tablet[ key ] || line.desktop[ key ];
	};

	const isDashLine = dashLineStyles.includes( line.style );

	/**
	 * Dashes and dots are painted rather than bordered. A border's dash length
	 * is picked by the browser from the border width — at a 2px line that is a
	 * tight stipple that cannot be spaced out — so both are drawn as a mask
	 * over a filled bar, which puts the dash and the gap under the author's
	 * control.
	 *
	 * Masking rather than painting the gradient directly is what lets the
	 * progress fill reuse the pattern: the track and the fill are the same bar
	 * in two colours behind the same mask.
	 */
	const dashMask = ( device ) => {
		const vertical = isVerticalAt( device );
		const gap = lineValue( device, 'gap' ) || '6px';

		if ( 'dotted' === line.style ) {
			// One dot per tile, as wide as the line, spaced by the gap.
			const dot = lineValue( device, 'width' ) || '2px';

			return {
				image: 'radial-gradient(circle closest-side, #000 99%, transparent 100%)',
				size: vertical ? `${ dot } calc(${ dot } + ${ gap })` : `calc(${ dot } + ${ gap }) ${ dot }`,
				repeat: vertical ? 'repeat-y' : 'repeat-x'
			};
		}

		const dash = lineValue( device, 'dash' ) || '8px';
		const axis = vertical ? 'to bottom' : 'to right';

		return {
			image: `repeating-linear-gradient(${ axis }, #000 0 ${ dash }, transparent ${ dash } calc(${ dash } + ${ gap }))`,
			size: 'auto',
			repeat: 'repeat'
		};
	};

	const maskCSS = ( mask ) => `
			-webkit-mask-image: ${ mask.image };
			mask-image: ${ mask.image };
			-webkit-mask-size: ${ mask.size };
			mask-size: ${ mask.size };
			-webkit-mask-repeat: ${ mask.repeat };
			mask-repeat: ${ mask.repeat };
			-webkit-mask-position: center;
			mask-position: center;
	`;

	/**
	 * The pattern that shapes the line. It is applied to both the track and
	 * the progress fill, so turning Progress on gives a fill that follows
	 * whatever style the line is drawn in rather than a plain bar over it.
	 */
	const linePatternCSS = ( device ) => {
		// A solid line needs no mask at all; only dashes and dots do.
		return isDashLine ? maskCSS( dashMask( device ) ) : '';
	};

	/**
	 * Emit one declaration block per rung of the side ladder, so a value that
	 * lands on opposite edges for left and right entries can be written
	 * concretely instead of being passed through a custom property.
	 *
	 * The weights mirror style.scss: `:where()` keeps the alternate rung level
	 * with the explicit per-entry ones so a per-entry override still wins on
	 * source order.
	 *
	 * @param {string} descendant Selector below the entry.
	 * @param {string} left       Declarations for an entry on the near side.
	 * @param {string} right      Declarations for one on the far side.
	 * @return {string} CSS.
	 */
	// Each call sits inside its breakpoint's media query, so it keys off that
	// breakpoint's own side class — the same classes the stylesheet's ladder
	// uses. The per-entry pair stays last so one entry still outranks them.
	const perSide = ( device, descendant, left, right ) => `
		${ mainSl } .b-blocks-timeline-item ${ descendant }{ ${ left } }
		${ mainSl }.b-blocks-timeline-${ device }-right .b-blocks-timeline-item ${ descendant }{ ${ right } }
		${ mainSl }.b-blocks-timeline-${ device }-alternate .b-blocks-timeline-item:where(:nth-of-type(even)) ${ descendant }{ ${ right } }
		${ mainSl } .b-blocks-timeline-item.b-blocks-timeline-side-left ${ descendant }{ ${ left } }
		${ mainSl } .b-blocks-timeline-item.b-blocks-timeline-side-right ${ descendant }{ ${ right } }
	`;

	const responsive = ( device ) => {
		const vertical = isVerticalAt( device );
		const markerSize = marker[ device ].size;

		// A rotated square measures its diagonal, not its side, so a 34px
		// diamond would occupy 48px and push into the card beside it. Sizing
		// the box down by the diagonal makes the configured Size the shape's
		// visual extent, which is what it already means for every other shape.
		const markerBox = baseRotate && markerSize ? `calc(${ markerSize } / 1.4142)` : markerSize;
		const lineWidth = lineValue( device, 'width' );
		// The line stops at the centre of the first and last marker unless it
		// is set to run the full length.
		const half = markerSize ? `calc(${ markerSize } / 2)` : '17px';
		const full = 'full' === line.extent;
		// Where the line actually starts and stops is measured at runtime by
		// measureLine.js, because it depends on the entries' heights and on where
		// Arrow Alignment has put each marker. The value below is only the
		// fallback used before that measurement lands.
		const fallback = full ? '0px' : half;
		const start = `var(--bb-tl-line-start, ${ fallback })`;
		const end = `var(--bb-tl-line-end, ${ fallback })`;

		// Both axes, always. The direction can differ per breakpoint and the
		// wider one's rules sit outside every media query, so stating only the
		// axis in use leaves the other one's value behind — a vertical line
		// keeping the height a horizontal breakpoint gave it, and so on.
		const inset = vertical
			? `top: ${ start }; bottom: ${ end }; left: 50%; right: auto; transform: translateX(-50%);`
			: `left: ${ start }; right: ${ end }; top: var(--bb-tl-line-cross, 50%); bottom: auto; transform: translateY(-50%);`;

		// Values that land on opposite edges depending on which side an entry
		// sits — previously passed to the stylesheet as custom properties.
		const cardGap = layout[ device ].cardGap || '0px';
		const arrowSize = arrow[ device ].size || '14px';
		const arrowOffset = arrow[ device ].offset || '16px';
		const dateGap = date[ device ].gap || '16px';

		// The arrow is a flat triangle: it takes its own colour, or a solid
		// card background, and cannot take a gradient one.
		const cardSolid = 'solid' === ( card.normal.bg?.type || 'solid' ) ? card.normal.bg?.color : '';
		const arrowColour = arrow.color || cardSolid || '#efefef';

		// The card gives up the arrow's width so the arrow sits between it and
		// the marker rather than under it. No arrow, no gift.
		const room = false === arrow.show ? '0px' : arrowSize;
		const inline = ( a, b ) => ( vertical ? `padding-inline: ${ a } ${ b };` : `padding-block: ${ a } ${ b };` );


		const sideRules = `
			${ perSide(
		device,
		'.b-blocks-timeline-content',
		inline( '0', `calc(${ cardGap } + ${ room })` ),
		inline( `calc(${ cardGap } + ${ room })`, '0' )
	) }
			${ perSide( device, '.b-blocks-timeline-date', inline( dateGap, '0' ), inline( '0', dateGap ) ) }
		`;

		// Where the arrow sits along that edge, and the marker that follows it.
		const alignRules = ( align ) => {
			// Logical along a horizontal run, so start and end follow the
			// writing direction the entries themselves flow in.
			const offsetFrom = ( edge ) => ( vertical
				? ( 'start' === edge ? `top: ${ arrowOffset }; bottom: auto;` : `top: auto; bottom: ${ arrowOffset };` )
				: ( 'start' === edge ? `inset-inline-start: ${ arrowOffset }; inset-inline-end: auto;` : `inset-inline-start: auto; inset-inline-end: ${ arrowOffset };` ) );

			// The arrow is placed from the card's leading edge; the marker is
			// anchored to the column. Those are the same point only while the
			// card fills its column. Along a horizontal run a narrower card is
			// centred, putting its edge half the leftover space in — so the
			// marker has to travel that far too, or the two part company as
			// soon as Card Width is reduced. A vertical run needs no such
			// correction: the row is sized by the card, so it always starts
			// where the card does.
			const cardInset = `calc((100% - ${ layoutValue( device, 'cardWidth' ) || '100%' }) / 2)`;

			const shift = vertical
				? `calc(${ arrowOffset } + ${ arrowSize })`
				: `calc(${ cardInset } + ${ arrowOffset } + ${ arrowSize })`;
			const margin = ( a, b ) => ( vertical ? `margin-block: ${ a } ${ b };` : `margin-inline: ${ a } ${ b };` );

			if ( 'center' === align ) {
				return { arrow: '', anchor: `${ margin( '0', '0' ) }` };
			}

			return {
				arrow: `${ offsetFrom( align ) } transform: none;`,
				anchor: 'start' === align ? margin( shift, '0' ) : margin( '0', shift )
			};
		};

		const alignFor = ( selector, align ) => {
			const rules = alignRules( align );
			return `
				${ selector } .b-blocks-timeline-card::after{ ${ rules.arrow } }
				${ selector } .b-blocks-timeline-marker,
				${ selector } .b-blocks-timeline-date{ ${ rules.anchor } }
			`;
		};

		return `
		${ sideRules }
		${ cardSl }::after{
			${ isValidCSS( 'width', vertical ? arrowSize : `calc(${ arrowSize } * 2)` ) }
			${ isValidCSS( 'height', vertical ? `calc(${ arrowSize } * 2)` : arrowSize ) }
			${ isValidCSS( 'background', arrowColour ) }
		}
		${ alignFor( `${ mainSl } .b-blocks-timeline-item`, arrow.align || 'center' ) }
		${ [ 'start', 'center', 'end' ].map( ( a ) => alignFor( `${ mainSl } .b-blocks-timeline-item.b-blocks-timeline-item-arrow-${ a }`, a ) ).join( '' ) }

		${ itemsSl }{
			${ isValidCSS( vertical ? 'row-gap' : 'column-gap', layout[ device ].itemGap ) }
		}
		${ itemsSl }::before,
		${ itemsSl }::after{
			${ linePatternCSS( device ) }
		}
		${ itemsSl }::before{
			${ inset }
			${ getBackgroundCSS( line.bg ) }
			${ isValidCSS( 'width', vertical ? lineWidth : 'auto' ) }
			${ isValidCSS( 'height', vertical ? 'auto' : lineWidth ) }
		}
		${ itemsSl }::after{
			${ inset }
			${ getBackgroundCSS( line.activeBg ) }
			${ isValidCSS( 'width', vertical ? lineWidth : 'auto' ) }
			${ isValidCSS( 'height', vertical ? 'auto' : lineWidth ) }
		}
		${ itemSl }{
			${ isValidCSS( vertical ? 'column-gap' : 'row-gap', layout[ device ].markerGap ) }
		}
		${ contentSl }{

		}
		${ cardSl }{
			${ isValidCSS( 'width', layout[ device ].cardWidth ) }
			${ isValidCSS( 'padding', getBoxCSS( card[ device ].padding ) ) }
			${ isValidCSS( 'border-radius', getBoxCSS( card[ device ].radius ) ) }
		}
		${ markerSl }{
			${ isValidCSS( 'width', markerBox ) }
			${ isValidCSS( 'height', markerBox ) }
			${ isValidCSS( 'font-size', marker[ device ].iconSize ) }
			${ isValidCSS( 'border-radius', getBoxCSS( marker[ device ].radius ) ) }
		}

		`;
	};

	return <style
		dangerouslySetInnerHTML={ {
			__html: `
			${ getTypoCSS( '', date.typo ).googleFontLink }
			${ getTypoCSS( dateSl, date.typo ).styles }

			${ cardSl }{
				${ getBackgroundCSS( card.normal.bg ) }
				${ getBorderBoxCSS( card.normal.border ) }
				${ isValidCSS( 'box-shadow', getMultiShadowCSS( card.normal.shadow || [] ) ) }
			}
			${ cardSl }:hover{
				${ getBackgroundCSS( card.hover.bg ) }
				${ getBorderBoxCSS( card.hover.border ) }
			}
			${ markerSl }{
				${ getBackgroundCSS( marker.normal.bg ) }
				${ isValidCSS( 'color', marker.normal.color.icon ) }
				${ getBorderBoxCSS( marker.normal.border ) }
				${ getShapeCSS( marker.shape ) }
				${ isClipped ? '' : getRingCSS( marker.normal.ring ) }
				${ isValidCSS( 'box-shadow', getMultiShadowCSS( marker.normal.shadow || [] ) ) }
				${ baseRotate ? `rotate: ${ baseRotate }deg;` : '' }
				${ marker.transition ? `transition: background ${ marker.transition }ms ease, color ${ marker.transition }ms ease, border-color ${ marker.transition }ms ease, outline-color ${ marker.transition }ms ease, outline-offset ${ marker.transition }ms ease, box-shadow ${ marker.transition }ms ease;` : '' }
			}
			${ baseRotate ? `${ markerSl } svg{ rotate: -${ baseRotate }deg; }` : '' }
			${ markerSl }:hover{
				${ getBackgroundCSS( marker.hover.bg ) }
				${ isValidCSS( 'color', marker.hover.color.icon ) }
				${ getBorderBoxCSS( marker.hover.border ) }
				${ isClipped ? '' : getRingCSS( marker.hover.ring ) }
				${ isValidCSS( 'box-shadow', getMultiShadowCSS( marker.hover.shadow || [] ) ) }
			}
			${ marker.pulse?.show && ! isClipped ? `
				${ markerSl }::after{
					${ pulsePaint }
					animation-name: bb-tl-marker-pulse;
					${ isValidCSS( 'animation-duration', marker.pulse.speed ? `${ marker.pulse.speed }ms` : '' ) }
				}
			` : '' }
			${ dateSl }{
				${ isValidCSS( 'color', date.color ) }
			}

			${ responsive( 'desktop' ) }

			${ tabBreakpoint }{
				${ responsive( 'tablet' ) }
			}

			${ mobileBreakpoint }{
				${ responsive( 'mobile' ) }
			}

			${ generateCSS( id, advanced, isBackend, false ) }
			`
		} }
	/>;
};
export default Style;

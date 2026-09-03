import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { getBackgroundCSS, getMultiShadowCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { getRingCSS } from '../../../timeline/utils/options';
import { withItemDefaults } from '../../utils/functions';

/**
 * Per-entry overrides for a single Timeline Item.
 *
 * Only the properties an entry is allowed to re-colour are emitted, and every
 * one is skipped when left empty so the parent Timeline's value stands. The
 * selectors are deliberately the same weight as the parent's (`#id .class`):
 * this <style> is rendered inside the item, so it always comes later in the
 * document and wins on source order.
 */
const Style = ( { attributes, id, isBackend = false } ) => {
	const { item, advanced } = withItemDefaults( attributes );
	const { marker, pulse, card, date, arrow } = item;

	const mainSl = `#${ id }`;
	// Qualified with the entry class so these rules weigh the same as the
	// parent Timeline's side ladder; being rendered inside the entry, this
	// <style> comes later in the document and so wins the tie.
	const itemSl = `${ mainSl }.b-blocks-timeline-item`;
	const cardSl = `${ mainSl } .b-blocks-timeline-card`;
	const markerSl = `${ mainSl } .b-blocks-timeline-marker`;
	const dateSl = `${ mainSl } .b-blocks-timeline-date`;

	// The arrow takes its own background if this entry sets one, and otherwise
	// the entry's card background. Which way it points is decided by classes
	// the parent sets, but the paint is the same whichever side it lands on —
	// so one rule covers it.
	const arrowPaint = getBackgroundCSS( arrow.bg ) || getBackgroundCSS( card.normal.bg );

	// The pulse is the Timeline's setting unless this entry says otherwise.
	// Because the stylesheet holds the timing and the colour fallback, an
	// entry only has to state the part it is changing: naming the animation
	// switches it on, `none` switches it off, and a colour or a speed on
	// their own just adjust whatever the Timeline already decided.
	const pulseRules = [
		'on' === pulse.show ? 'animation-name: bb-tl-marker-pulse;' : '',
		'off' === pulse.show ? 'animation-name: none;' : '',
		'off' === pulse.show ? '' : getBackgroundCSS( pulse.bg, true, true, false ),
		'off' === pulse.show ? '' : isValidCSS( 'animation-duration', pulse.speed ? `${ pulse.speed }ms` : '' )
	].filter( Boolean ).join( ' ' );

	// generateCSS assumes a block wraps its content in one inner div and so
	// writes `#id>div`. An entry has no such wrapper — it is itself the grid,
	// and its four children are the cells — so that selector would style the
	// card, the marker and the date all at once. Pointing the generated rules
	// back at the entry is what makes Advanced mean the whole entry here, the
	// way it means the whole block everywhere else. The id is still passed
	// through unchanged so the animation hook keeps finding the element.
	const advSelector = isBackend ? `#${ id }>div>div:first-child` : `#${ id }>div`;
	const advancedCSS = generateCSS( id, advanced, isBackend, true ).split( advSelector ).join( `#${ id }` );

	return <style
		dangerouslySetInnerHTML={ {
			__html: `
			${ cardSl }{
				${ getBackgroundCSS( card.normal.bg ) }
			}
			${ itemSl } .b-blocks-timeline-card::after{
				${ arrowPaint }
			}
			${ markerSl }{
				${ getBackgroundCSS( marker.normal.bg ) }
				${ isValidCSS( 'color', marker.normal.color.icon ) }
				${ getRingCSS( marker.normal.ring ) }
				${ isValidCSS( 'box-shadow', getMultiShadowCSS( marker.normal.shadow || [] ) ) }
			}
			${ markerSl }:hover{
				${ getBackgroundCSS( marker.hover.bg ) }
				${ isValidCSS( 'color', marker.hover.color.icon ) }
				${ getRingCSS( marker.hover.ring ) }
				${ isValidCSS( 'box-shadow', getMultiShadowCSS( marker.hover.shadow || [] ) ) }
			}
			${ pulseRules ? `${ markerSl }::after{ ${ pulseRules } }` : '' }
			${ dateSl }{
				${ isValidCSS( 'color', date.color ) }
			}
			${ advancedCSS }
			`
		} }
	/>;
};
export default Style;

import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';

import { Background } from '../../../../../../../bpl-tools/Components';

import { clippedMarkerShapes } from '../../../../../timeline/utils/options';
import { timelineBlockName } from '../../../../utils/options';

/**
 * This entry's marker overrides. Only the pulse is here: everything else about
 * a marker — its shape, size and colours — is one setting for the whole
 * Timeline, and a per-entry copy of each would be a second place to look
 * without being a second thing to say.
 */
const Marker = ( { attributes, updateObj, clientId } ) => {
	const { item } = attributes;
	const { pulse } = item;

	// What the Timeline itself decided, so this panel can say what "Default"
	// currently means and hide controls the parent's shape rules out.
	const parentMarker = useSelect( ( select ) => {
		const { getBlockParentsByBlockName, getBlock } = select( 'core/block-editor' );
		const parents = getBlockParentsByBlockName( clientId, timelineBlockName );

		if ( ! parents?.length ) {
			return {};
		}

		// The closest parent is the last entry.
		return getBlock( parents[ parents.length - 1 ] )?.attributes?.marker || {};
	}, [ clientId ] );

	// A clipped shape cuts off anything drawn outside the marker's box, and
	// the halo is drawn outside it — so there is nothing to offer here.
	if ( clippedMarkerShapes.includes( parentMarker.shape ) ) {
		return null;
	}

	const inherited = parentMarker.pulse?.show
		? __( 'Default — on, from the Timeline', 'b-blocks' )
		: __( 'Default — off, from the Timeline', 'b-blocks' );

	const showOptions = [
		{ label: inherited, value: '' },
		{ label: __( 'On', 'b-blocks' ), value: 'on' },
		{ label: __( 'Off', 'b-blocks' ), value: 'off' }
	];

	// Whether this entry ends up pulsing, which is what decides if the colour
	// and speed below would have anything to act on.
	const pulses = '' === pulse.show ? !! parentMarker.pulse?.show : 'on' === pulse.show;

	return <PanelBody className='bPlPanelBody' initialOpen={ false } title={ __( 'Marker', 'b-blocks' ) }>
		<SelectControl
			label={ __( 'Pulse', 'b-blocks' ) }
			help={ __( 'A halo that spreads out from behind this entry’s marker.', 'b-blocks' ) }
			value={ pulse.show || '' }
			options={ showOptions }
			onChange={ ( value ) => updateObj( 'item', value, 'pulse', 'show' ) }
			__nextHasNoMarginBottom
			__next40pxDefaultSize
		/>

		{ pulses && <>
			<Background label={ __( 'Pulse Color:', 'b-blocks' ) } value={ pulse.bg } onChange={ ( value ) => updateObj( 'item', value, 'pulse', 'bg' ) } isImage={ false } />

			<RangeControl
				className='mt10'
				label={ __( 'Pulse Speed (ms)', 'b-blocks' ) }
				help={ __( 'Leave unset to follow the Timeline.', 'b-blocks' ) }
				value={ pulse.speed || undefined }
				onChange={ ( value ) => updateObj( 'item', value || '', 'pulse', 'speed' ) }
				min={ 600 }
				max={ 6000 }
				step={ 100 }
				allowReset
				__nextHasNoMarginBottom
				__next40pxDefaultSize
			/>
		</> }
	</PanelBody>;
};
export default Marker;

import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, SelectControl, ToggleControl } from '@wordpress/components';

import { Background } from '../../../../../../../bpl-tools/Components';

import { clippedMarkerShapes, markerShapeOptions } from '../../../../utils/options';


const Marker = ( { attributes, updateObj } ) => {
	const { marker } = attributes;

	const isClipped = clippedMarkerShapes.includes( marker.shape );

	return <PanelBody className='bPlPanelBody' initialOpen={ false } title={ __( 'Marker', 'b-blocks' ) }>
		<SelectControl
			label={ __( 'Shape', 'b-blocks' ) }
			labelPosition='edge'
			help={ isClipped
				? __( 'The hexagon is cut to shape, so it cannot carry a ring or a pulse.', 'b-blocks' )
				: __( 'Sets the corners. Border Radius in the Style tab takes them over as soon as you set one of them.', 'b-blocks' ) }
			value={ marker.shape }
			options={ markerShapeOptions }
			onChange={ ( value ) => updateObj( 'marker', value, 'shape' ) }
			__nextHasNoMarginBottom
			__next40pxDefaultSize
		/>

		{ ! isClipped && <>
			<ToggleControl
				className='mt20'
				label={ __( 'Pulse', 'b-blocks' ) }
				help={ __( 'A halo that spreads out from behind every marker. It follows the marker’s shape and stops for readers who ask for reduced motion.', 'b-blocks' ) }
				checked={ !! marker.pulse.show }
				onChange={ ( value ) => updateObj( 'marker', value, 'pulse', 'show' ) }
				__nextHasNoMarginBottom
			/>

			{ marker.pulse.show && <>
				<Background label={ __( 'Pulse Color:', 'b-blocks' ) } value={ marker.pulse.bg } onChange={ ( value ) => updateObj( 'marker', value, 'pulse', 'bg' ) } isImage={ false } />

				<RangeControl
					className='mt10'
					label={ __( 'Pulse Speed (ms)', 'b-blocks' ) }
					value={ marker.pulse.speed }
					onChange={ ( value ) => updateObj( 'marker', value, 'pulse', 'speed' ) }
					min={ 600 }
					max={ 6000 }
					step={ 100 }
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
			</> }
		</> }
	</PanelBody>;
};
export default Marker;

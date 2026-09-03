import { __ } from '@wordpress/i18n';
import { __experimentalBorderBoxControl as BorderBoxControl, Flex, PanelBody, RangeControl, SelectControl, TabPanel, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';

import { Background, BoxControl, ColorControl, Device, ShadowControl } from '../../../../../../../bpl-tools/Components';
import { emUnit, normalHoverTabs, perUnit, pxUnit } from '../../../../../../../bpl-tools/utils/options';

import { clippedMarkerShapes, ringStyleOptions } from '../../../../utils/options';

const MarkerStyle = ( { attributes, device, updateObj } ) => {
	const { marker } = attributes;

	// The hexagon is cut to shape, and a clip path takes the ring with it.
	const isClipped = clippedMarkerShapes.includes( marker.shape );

	return <PanelBody className='bPlPanelBody' initialOpen={ false } title={ __( 'Marker', 'b-blocks' ) }>
		<UnitControl label={ <Flex>{ __( 'Size', 'b-blocks' ) } <Device /></Flex> } labelPosition='edge' units={ [ pxUnit(), emUnit() ] } isUnitSelectTabbable value={ marker[ device ].size } onChange={ ( value ) => updateObj( 'marker', value, device, 'size' ) } />

		<UnitControl label={ <Flex>{ __( 'Icon Size', 'b-blocks' ) } <Device /></Flex> } labelPosition='edge' className='mt10' units={ [ pxUnit(), emUnit() ] } isUnitSelectTabbable value={ marker[ device ].iconSize } onChange={ ( value ) => updateObj( 'marker', value, device, 'iconSize' ) } />

		<BoxControl label={ <Flex>{ __( 'Border Radius', 'b-blocks' ) } <Device /></Flex> } className='mt10' values={ marker[ device ].radius } resetValues={ { top: '', right: '', bottom: '', left: '' } } units={ [ perUnit(), pxUnit(), emUnit() ] } onChange={ ( value ) => updateObj( 'marker', value, device, 'radius' ) } />

		<TabPanel className='bPlTabPanel small mt10' activeClass='activeTab' tabs={ normalHoverTabs }>
			{ ( { name } ) => <>
				<Background label={ __( 'Background:', 'b-blocks' ) } value={ marker[ name ].bg } onChange={ ( value ) => updateObj( 'marker', value, name, 'bg' ) } />

				<ColorControl label={ __( 'Icon Color', 'b-blocks' ) } value={ marker[ name ].color.icon } onChange={ ( value ) => updateObj( 'marker', value, name, 'color', 'icon' ) } />

				<BorderBoxControl label={ __( 'Border', 'b-blocks' ) } value={ marker[ name ].border } onChange={ ( value ) => updateObj( 'marker', value, name, 'border' ) } />

				{ ! isClipped && <>
					<UnitControl
						label={ __( 'Ring Width', 'b-blocks' ) }
						labelPosition='edge'
						className='mt10'
						units={ [ pxUnit(), emUnit() ] }
						isUnitSelectTabbable
						help={ 'normal' === name ? __( 'A halo drawn outside the border. It follows the marker’s shape, takes no space in the layout, and uses the icon colour unless you set one below.', 'b-blocks' ) : undefined }
						value={ marker[ name ].ring.width }
						onChange={ ( value ) => updateObj( 'marker', value, name, 'ring', 'width' ) }
					/>

					<SelectControl
						className='mt10'
						label={ __( 'Ring Style', 'b-blocks' ) }
						labelPosition='edge'
						value={ marker[ name ].ring.style || '' }
						options={ 'normal' === name ? ringStyleOptions : [ { label: __( 'Default', 'b-blocks' ), value: '' }, ...ringStyleOptions ] }
						onChange={ ( value ) => updateObj( 'marker', value, name, 'ring', 'style' ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>

					<UnitControl
						label={ __( 'Ring Offset', 'b-blocks' ) }
						labelPosition='edge'
						className='mt10'
						units={ [ pxUnit(), emUnit() ] }
						isUnitSelectTabbable
						help={ 'normal' === name ? __( 'Gap between the marker and its ring.', 'b-blocks' ) : undefined }
						value={ marker[ name ].ring.offset }
						onChange={ ( value ) => updateObj( 'marker', value, name, 'ring', 'offset' ) }
					/>

					<ColorControl label={ __( 'Ring Color', 'b-blocks' ) } value={ marker[ name ].ring.color } onChange={ ( value ) => updateObj( 'marker', value, name, 'ring', 'color' ) } />
				</> }

				<ShadowControl label={ __( 'Box Shadow', 'b-blocks' ) } value={ marker[ name ].shadow } onChange={ ( value ) => updateObj( 'marker', value, name, 'shadow' ) } />
			</> }
		</TabPanel>

		<RangeControl
			className='mt10'
			label={ __( 'Transition Speed (ms)', 'b-blocks' ) }
			help={ __( 'How long the marker takes to settle into its hover state.', 'b-blocks' ) }
			value={ marker.transition }
			onChange={ ( value ) => updateObj( 'marker', value, 'transition' ) }
			min={ 0 }
			max={ 1200 }
			step={ 50 }
			__nextHasNoMarginBottom
			__next40pxDefaultSize
		/>
	</PanelBody>;
};

export default withSelect( ( select ) => {
	const { getDeviceType } = select( 'core/editor' );

	return {
		device: getDeviceType()?.toLowerCase() || 'desktop'
	};
} )( MarkerStyle );

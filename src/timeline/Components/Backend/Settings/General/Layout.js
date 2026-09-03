import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';

import { Device } from '../../../../../../../bpl-tools/Components';
import { emUnit, perUnit, pxUnit } from '../../../../../../../bpl-tools/utils/options';

import { directionOptions } from '../../../../utils/options';

const Layout = ( { attributes, device, updateObj } ) => {
	const { layout } = attributes;

	const directionAt = ( at ) => (
		'desktop' === at
			? layout.desktop.direction
			: 'tablet' === at
				? layout.tablet.direction || layout.desktop.direction
				: layout.mobile.direction || layout.tablet.direction || layout.desktop.direction
	) || 'vertical';

	const isHorizontal = 'horizontal' === directionAt( device );

	const sideOptions = [
		...( 'desktop' === device ? [] : [ { label: __( 'Default', 'b-blocks' ), value: '' } ] ),
		{ label: __( 'Alternate', 'b-blocks' ), value: 'alternate' },
		{ label: isHorizontal ? __( 'Above', 'b-blocks' ) : __( 'Left', 'b-blocks' ), value: 'left' },
		{ label: isHorizontal ? __( 'Below', 'b-blocks' ) : __( 'Right', 'b-blocks' ), value: 'right' }
	];

	return <PanelBody className='bPlPanelBody' initialOpen={ true } title={ __( 'Layout', 'b-blocks' ) }>
		<ToggleGroupControl
			label={ <Flex>{ __( 'Direction', 'b-blocks' ) } <Device /></Flex> }
			help={ isHorizontal
				? __( 'Entries run left to right along a horizontal line. Set a narrower breakpoint to turn it upright on smaller screens.', 'b-blocks' )
				: __( 'Entries run top to bottom along a vertical line.', 'b-blocks' ) }
			value={ layout[ device ].direction || '' }
			onChange={ ( value ) => updateObj( 'layout', value, device, 'direction' ) }
			isBlock
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		>
			{ [
				...( 'desktop' === device ? [] : [ { label: __( 'Default', 'b-blocks' ), value: '' } ] ),
				...directionOptions
			].map( ( option ) => (
				<ToggleGroupControlOption key={ option.value } label={ option.label } value={ option.value } />
			) ) }
		</ToggleGroupControl>

		<ToggleGroupControl
			label={ <Flex>{ __( 'Side', 'b-blocks' ) } <Device /></Flex> }
			help={ __( 'Alternate places entries on opposite sides. Set a narrower breakpoint to change it there — one card per row on phones, say. Any single entry can override this from its own settings.', 'b-blocks' ) }
			value={ layout[ device ].side || '' }
			onChange={ ( value ) => updateObj( 'layout', value, device, 'side' ) }
			isBlock
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		>
			{ sideOptions.map( ( option ) => (
				<ToggleGroupControlOption key={ option.value } label={ option.label } value={ option.value } />
			) ) }
		</ToggleGroupControl>

		<UnitControl label={ <Flex>{ __( 'Gap Between Entries', 'b-blocks' ) } <Device /></Flex> } className='mt10' units={ [ pxUnit(), emUnit(), perUnit() ] } isUnitSelectTabbable value={ layout[ device ].itemGap } onChange={ ( value ) => updateObj( 'layout', value, device, 'itemGap' ) } />

		<UnitControl label={ <Flex>{ __( 'Card Width', 'b-blocks' ) } <Device /></Flex> } labelPosition='edge' className='mt10' units={ [ perUnit(), pxUnit(), emUnit() ] } isUnitSelectTabbable value={ layout[ device ].cardWidth } onChange={ ( value ) => updateObj( 'layout', value, device, 'cardWidth' ) } />

		<UnitControl label={ <Flex>{ __( 'Card Offset From Line', 'b-blocks' ) } <Device /></Flex> } className='mt10' units={ [ pxUnit(), emUnit(), perUnit() ] } isUnitSelectTabbable value={ layout[ device ].cardGap } onChange={ ( value ) => updateObj( 'layout', value, device, 'cardGap' ) } />

		<UnitControl label={ <Flex>{ __( 'Marker Spacing', 'b-blocks' ) } <Device /></Flex> } labelPosition='edge' className='mt10' units={ [ pxUnit(), emUnit() ] } isUnitSelectTabbable value={ layout[ device ].markerGap } onChange={ ( value ) => updateObj( 'layout', value, device, 'markerGap' ) } />

	</PanelBody>;
};

export default withSelect( ( select ) => {
	const { getDeviceType } = select( 'core/editor' );

	return {
		device: getDeviceType()?.toLowerCase() || 'desktop'
	};
} )( Layout );

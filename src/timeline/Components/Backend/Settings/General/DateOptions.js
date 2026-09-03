import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';

import { Device } from '../../../../../../../bpl-tools/Components';
import { emUnit, pxUnit } from '../../../../../../../bpl-tools/utils/options';

const DateOptions = ( { attributes, device, updateObj } ) => {
	const { date } = attributes;

	return <PanelBody className='bPlPanelBody' initialOpen={ false } title={ __( 'Date', 'b-blocks' ) }>
		<ToggleControl
			label={ __( 'Show Date', 'b-blocks' ) }
			checked={ !! date.show }
			onChange={ ( value ) => updateObj( 'date', value, 'show' ) }
			__nextHasNoMarginBottom
		/>

		{ date.show && <UnitControl label={ <Flex>{ __( 'Distance From Marker', 'b-blocks' ) } <Device /></Flex> } className='mt10' units={ [ pxUnit(), emUnit() ] } isUnitSelectTabbable value={ date[ device ].gap } onChange={ ( value ) => updateObj( 'date', value, device, 'gap' ) } /> }
	</PanelBody>;
};

export default withSelect( ( select ) => {
	const { getDeviceType } = select( 'core/editor' );

	return {
		device: getDeviceType()?.toLowerCase() || 'desktop'
	};
} )( DateOptions );

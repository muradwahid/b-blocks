import { __ } from '@wordpress/i18n';
import { Flex, PanelBody } from '@wordpress/components';
import { withSelect } from '@wordpress/data';

import { BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { emUnit, perUnit, pxUnit } from '../../../../../../../bpl-tools/utils/options';

const Card = ( { attributes, device, updateObj } ) => {
	const { card } = attributes;

	return <PanelBody className='bPlPanelBody' initialOpen={ false } title={ __( 'Card', 'b-blocks' ) }>
		<BoxControl label={ <Flex>{ __( 'Padding', 'b-blocks' ) } <Device /></Flex> } values={ card[ device ].padding } resetValues={ { top: '16px', right: '16px', bottom: '16px', left: '16px' } } units={ [ pxUnit(), emUnit(), perUnit() ] } onChange={ ( value ) => updateObj( 'card', value, device, 'padding' ) } />

		<BoxControl label={ <Flex>{ __( 'Border Radius', 'b-blocks' ) } <Device /></Flex> } className='mt10' values={ card[ device ].radius } resetValues={ { top: '4px', right: '4px', bottom: '4px', left: '4px' } } units={ [ pxUnit(), perUnit(), emUnit() ] } onChange={ ( value ) => updateObj( 'card', value, device, 'radius' ) } />

	</PanelBody>;
};

export default withSelect( ( select ) => {
	const { getDeviceType } = select( 'core/editor' );

	return {
		device: getDeviceType()?.toLowerCase() || 'desktop'
	};
} )( Card );

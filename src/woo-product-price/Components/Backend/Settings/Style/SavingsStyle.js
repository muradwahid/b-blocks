import { __ } from '@wordpress/i18n';
import { Flex, PanelBody } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Typography } from '../../../../../../../bpl-tools/Components';

import { toBackground } from '../../../../utils/functions';

import metadata from '../../../../block.json';

const defaults = metadata.attributes.savingsStyle.default;

const SavingsStyle = ( { attributes, updateObj, device } ) => {
	const { savingsStyle = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={ __( 'Savings', 'b-blocks' ) } initialOpen={ false }>
		<ColorControl label={ __( 'Color', 'b-blocks' ) } value={ savingsStyle.color } defaultColor={ defaults.color } onChange={ ( val ) => updateObj( 'savingsStyle', val, 'color' ) } />
		<Background className='mt20' label={ __( 'Background', 'b-blocks' ) } value={ toBackground( savingsStyle.bg ) } defaults={ defaults.bg } isImage={ false } onChange={ ( val ) => updateObj( 'savingsStyle', val, 'bg' ) } />

		<Typography className='mt20' label={ __( 'Typography', 'b-blocks' ) } value={ savingsStyle.typo || defaults.typo } defaults={ defaults.typo } onChange={ ( val ) => updateObj( 'savingsStyle', val, 'typo' ) } />

		<BoxControl className='mt20' label={ <Flex justify='flex-start'>{ __( 'Padding', 'b-blocks' ) }<Device /></Flex> } values={ savingsStyle.padding?.[ device ] } onChange={ ( val ) => updateObj( 'savingsStyle', val, 'padding', device ) } />
		<BoxControl className='mt20' label={ <Flex justify='flex-start'>{ __( 'Border Radius', 'b-blocks' ) }<Device /></Flex> } values={ savingsStyle.radius?.[ device ] } onChange={ ( val ) => updateObj( 'savingsStyle', val, 'radius', device ) } />
	</PanelBody>;
};

export default SavingsStyle;

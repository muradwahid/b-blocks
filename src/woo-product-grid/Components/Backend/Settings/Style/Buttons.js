import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { BoxControl, Background, ColorControl, Device, Typography } from '../../../../../../../bpl-tools/Components';
import { UNITS } from '../../../../utils/options';
import StatePanel from '../../Controls/StatePanel';
import { at } from '../../../../utils/functions';

const Buttons = ( { attributes, updateObj, device = 'desktop' } ) => {
	const { cart = {}, viewButton = {}, badge = {} } = attributes;

	return <>
		<StatePanel
			group='cart'
			withMargin
			value={ cart }
			title={ __( 'Cart Button', 'b-blocks' ) }
			updateObj={ updateObj }
			device={ device }
			defaultColors={ { normal: '#ffffff', hover: '#ffffff' } }
		/>

		<StatePanel
			group='viewButton'
			withMargin
			value={ viewButton }
			title={ __( 'View Button', 'b-blocks' ) }
			updateObj={ updateObj }
			device={ device }
			defaultColors={ { normal: '#070127', hover: '#ffffff' } }
		/>

		<PanelBody className='bPlPanelBody' title={ __( 'Sale Badge', 'b-blocks' ) } initialOpen={ false }>
			<Background label={ __( 'Background:', 'b-blocks' ) } value={ badge.bg } isImage={ false } onChange={ ( val ) => updateObj( 'badge', val, 'bg' ) } />

			<ColorControl label={ __( 'Text Color:', 'b-blocks' ) } value={ badge.color } defaultColor='#ffffff' onChange={ ( val ) => updateObj( 'badge', val, 'color' ) } />

			<Typography
				className='mt10'
				label={ __( 'Typography', 'b-blocks' ) }
				value={ badge.typo }
				onChange={ ( val ) => updateObj( 'badge', val, 'typo' ) }
			/>

			<BoxControl
				className='mt10'
				label={ <Flex>{ __( 'Padding', 'b-blocks' ) } <Device /></Flex> }
				values={ at( badge, device, 'padding' ) }
				onChange={(val) => updateObj('badge', val, device, 'padding')}
			/>

			<BoxControl
				className='mt10'
				label={ <Flex>{ __( 'Border Radius', 'b-blocks' ) } <Device /></Flex> }
				values={ at( badge, device, 'radius' ) }
				onChange={(val) => updateObj('badge', val, device, 'radius')}
			/>

			<UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={ <Flex>{ __( 'Offset', 'b-blocks' ) } <Device /></Flex> }
				labelPosition='edge'
				units={ UNITS }
				isUnitSelectTabbable
				help={ __( 'Distance from the top and side of the image.', 'b-blocks' ) }
				value={ at( badge, device, 'offset' ) }
				onChange={(val) => updateObj('badge', val || '', device, 'offset')}
			/>
		</PanelBody>
	</>;
};

export default Buttons;

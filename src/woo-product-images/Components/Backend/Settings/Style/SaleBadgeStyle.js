import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Typography } from '../../../../../../../bpl-tools/Components';

import metadata from '../../../../block.json';

// The defaults (block.json), for the resets.
const defaults = metadata.attributes.badge.default;

const SaleBadgeStyle = ( { attributes, updateObj, device } ) => {
	const { badge = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={ __( 'Sale Badge', 'b-blocks' ) } initialOpen={ false }>
		{ /* A badge saved before Typography has no `typo`: the control writes into its value, so it starts from the default. */ }
		<Typography label={ __( 'Typography', 'b-blocks' ) } value={ badge.typo || defaults.typo } defaults={ defaults.typo } onChange={ ( val ) => updateObj( 'badge', val, 'typo' ) } />

		<ColorControl className='mt20' label={ __( 'Text Color:', 'b-blocks' ) } value={ badge.color } defaultColor={ defaults.color } onChange={ ( val ) => updateObj( 'badge', val, 'color' ) } />
		<Background className='mt20' label={ __( 'Background', 'b-blocks' ) } value={ badge.bg } defaults={ defaults.bg } isImage={ false } onChange={ ( val ) => updateObj( 'badge', val, 'bg' ) } />

		<BorderBoxControl
			className='mt20'
			__next40pxDefaultSize
			label={ __( 'Border', 'b-blocks' ) }
			withSlider
			enableStyle
			value={ badge.border }
			onChange={ ( val ) => updateObj( 'badge', val || {}, 'border' ) }
		/>

		<div className='mt20'>
			<Flex className='mb5'><span className='bPlLabel'>{ __( 'Padding', 'b-blocks' ) }</span><Device /></Flex>
			<BoxControl values={ badge[ device ]?.padding } onChange={ ( val ) => updateObj( 'badge', val, device, 'padding' ) } />
		</div>

		<div className='mt20'>
			<Flex className='mb5'><span className='bPlLabel'>{ __( 'Border Radius', 'b-blocks' ) }</span><Device /></Flex>
			<BoxControl values={ badge[ device ]?.radius } onChange={ ( val ) => updateObj( 'badge', val, device, 'radius' ) } />
		</div>
	</PanelBody>;
};

export default SaleBadgeStyle;

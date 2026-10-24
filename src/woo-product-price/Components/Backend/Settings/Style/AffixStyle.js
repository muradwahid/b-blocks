import { __ } from '@wordpress/i18n';
import {
	Flex, PanelBody,
	__experimentalUnitControl as UnitControl
} from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Typography } from '../../../../../../../bpl-tools/Components';

import { toBackground } from '../../../../utils/functions';
import { UNITS } from '../../../../utils/options';

import metadata from '../../../../block.json';

const AffixStyle = ( { attributes, updateObj, which, device } ) => {
	const key = `${ which }Style`;
	const value = attributes[ key ] || {};
	const defaults = metadata.attributes[ key ].default;
	const isIcon = 'icon' === attributes[ which ]?.type;

	return <PanelBody className='bPlPanelBody' title={ 'prefix' === which ? __( 'Prefix', 'b-blocks' ) : __( 'Suffix', 'b-blocks' ) } initialOpen={ false }>
		<ColorControl label={ isIcon ? __( 'Icon Color', 'b-blocks' ) : __( 'Color', 'b-blocks' ) } value={ value.color } defaultColor={ defaults.color } onChange={ ( val ) => updateObj( key, val, 'color' ) } />

		<Background className='mt20' label={ __( 'Background', 'b-blocks' ) } value={ toBackground( value.bg ) } defaults={ defaults.bg } isImage={ false } onChange={ ( val ) => updateObj( key, val, 'bg' ) } />

		{ isIcon ? <UnitControl
			className='mt20'
			__next40pxDefaultSize
			label={ __( 'Icon Size', 'b-blocks' ) }
			labelPosition='edge'
			units={ UNITS }
			value={ value.iconSize || '' }
			onChange={ ( val ) => updateObj( key, val || '', 'iconSize' ) }
		/> : <Typography className='mt20' label={ __( 'Typography', 'b-blocks' ) } value={ value.typo || defaults.typo } defaults={ defaults.typo } onChange={ ( val ) => updateObj( key, val, 'typo' ) } /> }

		<BoxControl className='mt20' label={ <Flex justify='flex-start'>{ __( 'Padding', 'b-blocks' ) }<Device /></Flex> } values={ value.padding?.[ device ] } onChange={ ( val ) => updateObj( key, val, 'padding', device ) } />
		<BoxControl className='mt20' label={ <Flex justify='flex-start'>{ __( 'Border Radius', 'b-blocks' ) }<Device /></Flex> } values={ value.radius?.[ device ] } onChange={ ( val ) => updateObj( key, val, 'radius', device ) } />
	</PanelBody>;
};

export default AffixStyle;

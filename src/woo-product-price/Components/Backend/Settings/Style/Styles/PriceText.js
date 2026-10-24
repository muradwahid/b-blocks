import { __ } from '@wordpress/i18n';
import {
	Flex,
	__experimentalUnitControl as UnitControl
} from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Label, Typography } from '../../../../../../../../bpl-tools/Components';

import { toBackground } from '../../../../../utils/functions';
import { UNITS } from '../../../../../utils/options';

import metadata from '../../../../../block.json';

const PriceText = ( { attributes, updateObj, device, which } ) => {
	const value = attributes[ which ] || {};
	const defaults = metadata.attributes[ which ].default;
	const isRegular = 'regularPrice' === which;

	return <>

		<Label className={ `bBlocksWooPriceHeading ${ isRegular ? 'isFirst' : 'mt20' } mb5` }>{ isRegular ? __( 'Regular Price', 'b-blocks' ) : __( 'Sale Price', 'b-blocks' ) }</Label>
		<ColorControl label={ __( 'Color', 'b-blocks' ) } value={ value.color } defaultColor={ defaults.color } onChange={ ( val ) => updateObj( which, val, 'color' ) } />
		<Background className='mt20' label={ __( 'Background', 'b-blocks' ) } value={ toBackground( value.bg ) } defaults={ defaults.bg } isImage={ false } onChange={ ( val ) => updateObj( which, val, 'bg' ) } />
		<Typography className='mt20' label={ __( 'Typography', 'b-blocks' ) } value={ value.typo || defaults.typo } defaults={ defaults.typo } onChange={ ( val ) => updateObj( which, val, 'typo' ) } />

		{ isRegular && <>
			<ColorControl className='mt20' label={ __( 'Strikethrough Color', 'b-blocks' ) } value={ value.strike?.color } defaultColor={ value.strike?.color ? '__clear__' : undefined } onChange={ ( val ) => updateObj( which, '__clear__' === val ? '' : val, 'strike', 'color' ) } />
			<UnitControl className='mt20' __next40pxDefaultSize label={ __( 'Strikethrough Thickness', 'b-blocks' ) } labelPosition='edge' units={ UNITS } value={ value.strike?.thickness || '' } onChange={ ( val ) => updateObj( which, val || '', 'strike', 'thickness' ) } />
		</> }

		<BoxControl className='mt20' label={ <Flex justify='flex-start'>{ __( 'Padding', 'b-blocks' ) }<Device /></Flex> } values={ value.padding?.[ device ] } onChange={ ( val ) => updateObj( which, val, 'padding', device ) } />
		<BoxControl className='mt20' label={ <Flex justify='flex-start'>{ __( 'Border Radius', 'b-blocks' ) }<Device /></Flex> } values={ value.radius?.[ device ] } onChange={ ( val ) => updateObj( which, val, 'radius', device ) } />
	</>;
};

export default PriceText;

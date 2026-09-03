import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { ColorControl, Typography } from '../../../../../../../bpl-tools/Components';

const DateStyle = ( { attributes, updateObj } ) => {
	const { date } = attributes;

	if ( ! date.show ) {
		return null;
	}

	return <PanelBody className='bPlPanelBody' initialOpen={ false } title={ __( 'Date', 'b-blocks' ) }>
		<Typography label={ __( 'Typography', 'b-blocks' ) } value={ date.typo } onChange={ ( value ) => updateObj( 'date', value, 'typo' ) } />

		<ColorControl label={ __( 'Color', 'b-blocks' ) } value={ date.color } onChange={ ( value ) => updateObj( 'date', value, 'color' ) } />
	</PanelBody>;
};
export default DateStyle;

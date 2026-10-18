import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { ColorControl } from '../../../../../../../bpl-tools/Components';

import metadata from '../../../../block.json';

// The defaults (block.json), for the resets.
const defaults = metadata.attributes.lightbox.default;

const LightboxStyle = ( { attributes, updateObj } ) => {
	const { lightbox = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={ __( 'Lightbox', 'b-blocks' ) } initialOpen={ false }>
		<ColorControl label={ __( 'Overlay Color:', 'b-blocks' ) } value={ lightbox.overlay } defaultColor={ defaults.overlay } onChange={ ( val ) => updateObj( 'lightbox', val, 'overlay' ) } />
		<ColorControl className='mt20' label={ __( 'Icon & Text Color:', 'b-blocks' ) } value={ lightbox.color } defaultColor={ defaults.color } onChange={ ( val ) => updateObj( 'lightbox', val, 'color' ) } />
	</PanelBody>;
};

export default LightboxStyle;

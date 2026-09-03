import { __ } from '@wordpress/i18n';
import { __experimentalBorderBoxControl as BorderBoxControl, PanelBody, TabPanel } from '@wordpress/components';

import { Background, ShadowControl } from '../../../../../../../bpl-tools/Components';
import { normalHoverTabs } from '../../../../../../../bpl-tools/utils/options';

const CardStyle = ( { attributes, updateObj } ) => {
	const { card } = attributes;

	return <PanelBody className='bPlPanelBody' initialOpen={ false } title={ __( 'Card', 'b-blocks' ) }>
		<TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={ normalHoverTabs }>
			{ ( { name } ) => <>
				<Background label={ __( 'Background:', 'b-blocks' ) } value={ card[ name ].bg } onChange={ ( value ) => updateObj( 'card', value, name, 'bg' ) } />

				<BorderBoxControl label={ __( 'Border', 'b-blocks' ) } value={ card[ name ].border } onChange={ ( value ) => updateObj( 'card', value, name, 'border' ) } />

				{ 'normal' === name && <ShadowControl label={ __( 'Box Shadow', 'b-blocks' ) } value={ card.normal.shadow } onChange={ ( value ) => updateObj( 'card', value, 'normal', 'shadow' ) } /> }
			</> }
		</TabPanel>
	</PanelBody>;
};
export default CardStyle;

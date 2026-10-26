import { __ } from '@wordpress/i18n';
import { Notice, PanelBody, ToggleControl } from '@wordpress/components';

import { TABS } from '../../../../utils/functions';

const General = ( { attributes, updateObj } ) => {
	const { options = {} } = attributes;

	const setOption = ( key ) => ( val ) => updateObj( 'options', val, key );
	const noneOn = TABS.every((tab) => false === options[tab.option]);
	
	return <PanelBody className='bPlPanelBody' title={__('Settings', 'b-blocks')} initialOpen={true}>

		<ToggleControl
			__nextHasNoMarginBottom
			label={ __( 'Show Description Tab', 'b-blocks' ) }
			help={ __( 'Left out when the product has no description.', 'b-blocks' ) }
			checked={ false !== options.showDescription }
			onChange={ setOption( 'showDescription' ) }
		/>

		<ToggleControl
			__nextHasNoMarginBottom
			className='mt20'
			label={ __( 'Show Additional Info Tab', 'b-blocks' ) }
			help={ __( 'Left out when the product has no visible attributes, weight or dimensions.', 'b-blocks' ) }
			checked={ false !== options.showAdditional }
			onChange={ setOption( 'showAdditional' ) }
		/>

		<ToggleControl
			__nextHasNoMarginBottom
			className='mt20'
			label={ __( 'Show Reviews Tab', 'b-blocks' ) }
			help={ __( 'Left out when reviews are off, for the store or for this product.', 'b-blocks' ) }
			checked={ false !== options.showReviews }
			onChange={ setOption( 'showReviews' ) }
		/>

		{ noneOn && <Notice className='mt10' status='warning' isDismissible={ false }>
			{ __( 'Enable at least one tab.', 'b-blocks' ) }
		</Notice>}

	</PanelBody>;
};

export default General;
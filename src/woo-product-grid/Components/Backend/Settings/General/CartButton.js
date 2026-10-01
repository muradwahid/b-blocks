import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

import ButtonIcon from '../../Controls/ButtonIcon';

const CartButton = ( { attributes, updateObj, device = 'desktop' } ) => {
	const { elements = {}, cart = {} } = attributes;

	const fields = [
		[ 'simple', __( 'Simple Product', 'b-blocks' ) ],
		[ 'variable', __( 'Variable Product', 'b-blocks' ) ],
		[ 'grouped', __( 'Grouped Product', 'b-blocks' ) ],
		[ 'external', __( 'External Product', 'b-blocks' ) ],
		[ 'default', __( 'Default Product', 'b-blocks' ) ]
	];

	return <PanelBody className='bPlPanelBody' title={ __( 'Cart Button', 'b-blocks' ) } initialOpen={ false }>
		<ToggleControl
			label={ __( 'Show Cart Button', 'b-blocks' ) }
			checked={ !! elements.cart }
			onChange={ ( val ) => updateObj( 'elements', val, 'cart' ) }
		/>

		{ elements.cart && <>
			<ToggleControl
				className='mt10'
				label={ __( 'Use Custom Text', 'b-blocks' ) }
				checked={ !! cart.useCustomText }
				onChange={ ( val ) => updateObj( 'cart', val, 'useCustomText' ) }
				help={ cart.useCustomText
					? __( 'Overrides the WooCommerce label per product type.', 'b-blocks' )
					: __( 'Uses the label WooCommerce supplies for each product.', 'b-blocks' ) }
			/>

			{ cart.useCustomText && fields.map( ( [ key, label ] ) => <TextControl
				key={ key }
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ label }
				value={ cart[ key ] }
				onChange={ ( val ) => updateObj( 'cart', val, key ) }
			/> ) }

			<ButtonIcon group='cart' value={ cart } updateObj={ updateObj } device={ device } />
		</> }
	</PanelBody>;
};

export default CartButton;

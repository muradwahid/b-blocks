import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import {
	Flex, PanelBody, PanelRow, ComboboxControl, TextControl, ToggleControl,
	RangeControl, SelectControl, __experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption
} from '@wordpress/components';

import { Device, IconLibrary, Label } from '../../../../../../bpl-tools/Components';

import { MAX_QUANTITY, alignmentOptions, iconPositionOptions, previewTypeOptions, quantityPositionOptions, quantityStyleOptions } from '../../../utils/data';

const decode = ( html ) => {
	const area = document.createElement( 'textarea' );
	area.innerHTML = html;
	return area.value;
};

const Note = ( { children } ) => <p className='b-blocks-woo-add-to-cart-control-note'>{ children }</p>;

const General = ( { attributes, updateObj, device = 'desktop', previewType: type = 'simple', onPreviewType, isPicked } ) => {
	const { product = {}, content = {}, options = {}, layout = {}, button = {} } = attributes;
	const productId = parseInt( product.id, 10 ) || 0;
	const { buttonText, addedText, viewCartText } = content;
	const { showQuantity, quantity, quantityStyle, redirectToCart, viewCart } = options;
	const icon = button.icon || {};
	const { alignment, fullWidth } = layout;

	const [ productOptions, setProductOptions ] = useState( [] );
	const [ search, setSearch ] = useState( '' );
	const [ selectedProduct, setSelectedProduct ] = useState( null );
	const [ apiAvailable, setApiAvailable ] = useState( true );

	useEffect( () => {
		let cancelled = false;
		const timer = setTimeout( () => apiFetch( {
			path: addQueryArgs( '/wp/v2/product', {
				per_page: 20,
				search: search || undefined,
				_fields: 'id,title'
			} )
		} )
			.then( ( items ) => {
				if ( cancelled ) return;
				const opts = ( Array.isArray( items ) ? items : [] ).map( ( p ) => ( {
					value: String( p.id ),
					label: ( p.title && p.title.rendered ) ? decode( p.title.rendered ) : `#${ p.id }`
				} ) );
				setProductOptions( opts );
				setApiAvailable( true );
			} ).catch( ( error ) => {
				if ( ! cancelled && 'rest_no_route' === error?.code ) setApiAvailable( false );
			} ), search ? 300 : 0 );
		return () => {
			cancelled = true;
			clearTimeout( timer );
		};
	}, [ search ] );

	useEffect( () => {
		if ( ! productId ) {
			setSelectedProduct( null );
			return;
		}
		let cancelled = false;
		apiFetch( { path: `/wp/v2/product/${ productId }?_fields=id,title,featured_media` } )
			.then( ( p ) => {
				if ( cancelled || ! p ) return;
				const name = ( p.title && p.title.rendered ) ? decode( p.title.rendered ) : `#${ p.id }`;
				if ( p.featured_media ) {
					apiFetch( { path: `/wp/v2/media/${ p.featured_media }?_fields=source_url` } )
						.then( ( m ) => {
							if ( ! cancelled ) setSelectedProduct( { name, thumb: m?.source_url || '' } );
						} )
						.catch( () => { if ( ! cancelled ) setSelectedProduct( { name, thumb: '' } ); } );
				} else {
					setSelectedProduct( { name, thumb: '' } );
				}
			} )
			.catch( () => { if ( ! cancelled ) setSelectedProduct( null ); } );
		return () => { cancelled = true; };
	}, [ productId ] );

	const slot = layout[ device ] || {};
	const setContent = ( key ) => ( val ) => updateObj( 'content', val, key );
	const setOption = ( key ) => ( val ) => updateObj( 'options', val, key );

	const isSimple = 'simple' === type;
	const isExternal = 'external' === type;

	return <>
		<PanelBody className='bPlPanelBody' title={ __( 'Product', 'b-blocks' ) }>
			<SelectControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Choose Product Type (Only For Preview)', 'b-blocks' ) }
				help={ isPicked
					? __( 'Starts on the product’s own type (the one picked, or the one in this loop). Switch it to preview the other types; the page always shows the product as it really is.', 'b-blocks' )
					: __( 'The block takes its real product from the Single Product page, and renders it as whatever type it really is. This only changes the preview here in the editor.', 'b-blocks' ) }
				value={ type }
				options={ previewTypeOptions }
				onChange={ ( val ) => ( onPreviewType ? onPreviewType( val ) : updateObj( 'product', val, 'previewType' ) ) }
			/>

			<div className='mt20'>
				{ apiAvailable ? (
					<ComboboxControl
						label={ __( 'Product', 'b-blocks' ) }
						help={ __( 'Optional. Leave empty to use the product of the Single Product page; pick one to show this button anywhere.', 'b-blocks' ) }
						value={ productId ? String( productId ) : '' }
						options={ selectedProduct && productId && ! productOptions.some( ( o ) => o.value === String( productId ) )
							? [ { value: String( productId ), label: selectedProduct.name }, ...productOptions ]
							: productOptions }
						onFilterValueChange={ ( value ) => setSearch( value ) }
						onChange={ ( value ) => updateObj( 'product', parseInt( value, 10 ) || 0, 'id' ) }
						__nextHasNoMarginBottom
					/>
				) : (
					<TextControl
						type='number'
						label={ __( 'Product ID', 'b-blocks' ) }
						help={ __( 'Enter the WooCommerce product ID, or leave empty to use the product of the Single Product page.', 'b-blocks' ) }
						value={ productId || '' }
						onChange={ ( value ) => updateObj( 'product', parseInt( value, 10 ) || 0, 'id' ) }
						min={ 0 }
						__nextHasNoMarginBottom
					/>
				) }
			</div>

			{ selectedProduct && (
				<div className='b-blocks-woo-add-to-cart-product-preview'>
					{ selectedProduct.thumb && (
						<img src={ selectedProduct.thumb } alt='' />
					) }
					<span className='b-blocks-woo-add-to-cart-product-name'>{ selectedProduct.name }</span>
				</div>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Add to Cart', 'b-blocks' ) } initialOpen={ false }>
			{ isExternal ? <Note>{ __( 'External/Affiliate products have no quantity.', 'b-blocks' ) }</Note> : <>
				<ToggleControl
					label={ __( 'Show Quantity', 'b-blocks' ) }
					help={ __( 'Hidden automatically for products sold individually. When off, one of each is added (or the product’s minimum, if it has one).', 'b-blocks' ) }
					checked={ !! showQuantity }
					onChange={ setOption( 'showQuantity' ) }
				/>

				{ showQuantity && isSimple && <ToggleGroupControl
					className='mt10'
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					isBlock
					label={ __( 'Quantity Style', 'b-blocks' ) }
					help={ __( 'Stepper has − and + buttons; Input is a plain number box, as WooCommerce shows it.', 'b-blocks' ) }
					value={ quantityStyle || 'stepper' }
					onChange={ ( val ) => updateObj( 'options', val || 'stepper', 'quantityStyle' ) }
				>
					{ quantityStyleOptions.map( ( { label, value } ) => <ToggleGroupControlOption key={ value } label={ label } value={ value } /> ) }
				</ToggleGroupControl> }

				{ showQuantity && isSimple && (
					<RangeControl
						label={ __( 'Default Quantity', 'b-blocks' ) }
						help={ __( "Kept within the product's own minimum and maximum. 0 starts the quantity empty, so visitors choose one before adding.", 'b-blocks' ) }
						value={ quantity }
						onChange={ ( val ) => updateObj( 'options', val ?? 1, 'quantity' ) }
						min={ 0 }
						max={ MAX_QUANTITY }
						step={ 1 }
					/>
				) }
			</> }

			<TextControl
				className='mt20'
				label={ __( 'Button Text', 'b-blocks' ) }
				help={ isExternal
					? __( "External/Affiliate products use their own WooCommerce button text; this is used only when that is empty.", 'b-blocks' )
					: __( "Leave empty to use WooCommerce's own text.", 'b-blocks' ) }
				value={ buttonText }
				onChange={ setContent( 'buttonText' ) }
				__nextHasNoMarginBottom
			/>

			<div className='mt20'>
				<IconLibrary
					label={ __( 'Button Icon', 'b-blocks' ) }
					value={ icon.svg || '' }
					onChange={ ( val ) => updateObj( 'button', val || '', 'icon', 'svg' ) }
				/>
			</div>
			{ icon.svg && <ToggleGroupControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				isBlock
				label={ __( 'Icon Position', 'b-blocks' ) }
				value={ icon.position || 'before' }
				onChange={ ( val ) => updateObj( 'button', val || 'before', 'icon', 'position' ) }
			>
				{ iconPositionOptions.map( ( { label, value } ) => <ToggleGroupControlOption key={ value } label={ label } value={ value } /> ) }
			</ToggleGroupControl> }

			{ isExternal ? <Note>{ __( 'External/Affiliate products take the visitor to their own URL, so there is no success label, redirect or View Cart link.', 'b-blocks' ) }</Note> : <>
				<TextControl
					className='mt20'
					label={ __( 'Success Label', 'b-blocks' ) }
					help={ __( 'Shown on the button for a moment after adding.', 'b-blocks' ) }
					value={ addedText }
					onChange={ setContent( 'addedText' ) }
					__nextHasNoMarginBottom
				/>
				<ToggleControl
					className='mt20'
					label={ __( 'Redirect to Cart', 'b-blocks' ) }
					help={ __( 'Go to the cart page after adding, instead of staying on the page.', 'b-blocks' ) }
					checked={ !! redirectToCart }
					onChange={ setOption( 'redirectToCart' ) }
				/>
				{ ! redirectToCart && <>
					<ToggleControl
						className='mt10'
						label={ __( 'Show View Cart Link', 'b-blocks' ) }
						help={ __( 'A link to the cart appears beside the button after the first add.', 'b-blocks' ) }
						checked={ !! viewCart }
						onChange={ setOption( 'viewCart' ) }
					/>
					{ viewCart && <TextControl
						label={ __( 'View Cart Text', 'b-blocks' ) }
						value={ viewCartText }
						placeholder={ __( 'View cart', 'b-blocks' ) }
						onChange={ setContent( 'viewCartText' ) }
						__nextHasNoMarginBottom
					/> }
				</> }
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					label={ __( 'Alignment', 'b-blocks' ) }
					hideLabelFromVision
					value={ alignment }
					options={ alignmentOptions }
					onChange={ ( val ) => updateObj( 'layout', val, 'alignment' ) }
				/>
			</PanelRow>

			<Flex className='mt20 mb5'><span className='bPlLabel'>{ __( 'Quantity Position', 'b-blocks' ) }</span><Device /></Flex>
			<SelectControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Quantity Position', 'b-blocks' ) }
				hideLabelFromVision
				help={ {
					grouped: __( 'Grouped products keep each quantity in their table; Top and Bottom give the button a full-width line of its own.', 'b-blocks' ),
					external: __( 'External/Affiliate products have no quantity; Top and Bottom give the button a full-width line of its own.', 'b-blocks' )
				}[ type ] || __( 'Where the quantity sits by the button. Top and Bottom give the button a full-width line of its own.', 'b-blocks' ) }
				value={ slot.displayType || ( 'desktop' === device ? 'inline' : '' ) }
				options={ 'desktop' === device ? quantityPositionOptions : [ { label: __( 'Same as larger screens', 'b-blocks' ), value: '' }, ...quantityPositionOptions ] }
				onChange={ ( val ) => updateObj( 'layout', val, device, 'displayType' ) }
			/>
			<ToggleControl
				className='mt20'
				label={ __( 'Full Width', 'b-blocks' ) }
				checked={ !! fullWidth }
				onChange={ ( val ) => updateObj( 'layout', val, 'fullWidth' ) }
			/>
		</PanelBody>
	</>;
};

export default General;

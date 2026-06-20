import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody, PanelRow, ComboboxControl, TextControl, ToggleControl,
	RangeControl, SelectControl
} from '@wordpress/components';

import { Label, ColorControl } from '../../../../../bpl-tools/Components';

import { alignmentOptions, fontWeightOptions } from '../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		productId, buttonLabel, addedLabel, showQuantity, quantityDefault,
		redirectToCart, alignment, isFullWidth,
		btnColor, btnBG, btnHovColor, btnHovBG,
		fontSize, fontWeight, padding, borderRadius, borderWidth, borderColor,
		qtyBtnColor, qtyBtnBG, qtyInputBorderColor, qtyBorderRadius
	} = attributes;

	const [ productOptions, setProductOptions ] = useState( [] );
	const [ search, setSearch ] = useState( '' );
	const [ selectedProduct, setSelectedProduct ] = useState( null );
	const [ apiAvailable, setApiAvailable ] = useState( true );

	// Search products by title as the editor types.
	useEffect( () => {
		let cancelled = false;
		apiFetch( {
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
					label: ( p.title && p.title.rendered ) ? p.title.rendered : `#${ p.id }`
				} ) );
				setProductOptions( opts );
				setApiAvailable( true );
			} )
			.catch( () => {
				if ( ! cancelled ) setApiAvailable( false );
			} );
		return () => { cancelled = true; };
	}, [ search ] );

	// Resolve the selected product (name + thumbnail) for the preview.
	useEffect( () => {
		if ( ! productId ) {
			setSelectedProduct( null );
			return;
		}
		let cancelled = false;
		apiFetch( { path: `/wp/v2/product/${ productId }?_fields=id,title,featured_media` } )
			.then( ( p ) => {
				if ( cancelled || ! p ) return;
				const name = ( p.title && p.title.rendered ) ? p.title.rendered : `#${ p.id }`;
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

	const setFontSize = ( key, val ) => setAttributes( {
		fontSize: { ...fontSize, [ key ]: `${ val }px` }
	} );
	const setPadding = ( key, val ) => setAttributes( {
		padding: { ...padding, [ key ]: `${ val }px` }
	} );
	const pxNumber = ( val, fallback ) => {
		const n = parseInt( val, 10 );
		return Number.isNaN( n ) ? fallback : n;
	};

	return <InspectorControls>
		<PanelBody className='bPlPanelBody' title={ __( 'Product', 'b-blocks' ) }>
			{ apiAvailable ? (
				<ComboboxControl
					label={ __( 'Product', 'b-blocks' ) }
					help={ __( 'Search a WooCommerce product by name.', 'b-blocks' ) }
					value={ productId ? String( productId ) : '' }
					options={ productOptions }
					onFilterValueChange={ ( value ) => setSearch( value ) }
					onChange={ ( value ) => setAttributes( { productId: parseInt( value, 10 ) || 0 } ) }
					__nextHasNoMarginBottom
				/>
			) : (
				<TextControl
					type='number'
					label={ __( 'Product ID', 'b-blocks' ) }
					help={ __( 'Enter the WooCommerce product ID.', 'b-blocks' ) }
					value={ productId || '' }
					onChange={ ( value ) => setAttributes( { productId: parseInt( value, 10 ) || 0 } ) }
					min={ 0 }
					__nextHasNoMarginBottom
				/>
			) }

			{ selectedProduct && (
				<div className='bb-atc-product-preview'>
					{ selectedProduct.thumb && (
						<img src={ selectedProduct.thumb } alt='' />
					) }
					<span className='bb-atc-product-name'>{ selectedProduct.name }</span>
				</div>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) } initialOpen={ false }>
			<TextControl
				label={ __( 'Button Label', 'b-blocks' ) }
				value={ buttonLabel }
				onChange={ ( val ) => setAttributes( { buttonLabel: val } ) }
				__nextHasNoMarginBottom
			/>
			<TextControl
				label={ __( 'Success Label', 'b-blocks' ) }
				value={ addedLabel }
				onChange={ ( val ) => setAttributes( { addedLabel: val } ) }
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				className='mt20'
				label={ __( 'Show Quantity', 'b-blocks' ) }
				checked={ !! showQuantity }
				onChange={ ( val ) => setAttributes( { showQuantity: val } ) }
			/>
			{ showQuantity && (
				<RangeControl
					label={ __( 'Default Quantity', 'b-blocks' ) }
					value={ quantityDefault }
					onChange={ ( val ) => setAttributes( { quantityDefault: val } ) }
					min={ 1 }
					max={ 99 }
					step={ 1 }
				/>
			) }
			<ToggleControl
				label={ __( 'Redirect to Cart', 'b-blocks' ) }
				checked={ !! redirectToCart }
				onChange={ ( val ) => setAttributes( { redirectToCart: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ alignment }
					options={ alignmentOptions }
					onChange={ ( val ) => setAttributes( { alignment: val } ) }
				/>
			</PanelRow>
			<ToggleControl
				className='mt20'
				label={ __( 'Full Width', 'b-blocks' ) }
				checked={ !! isFullWidth }
				onChange={ ( val ) => setAttributes( { isFullWidth: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Typography', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Font Size — Desktop (px)', 'b-blocks' ) }
				value={ pxNumber( fontSize?.desktop, 16 ) }
				onChange={ ( val ) => setFontSize( 'desktop', val ) }
				min={ 10 }
				max={ 40 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Font Size — Tablet (px)', 'b-blocks' ) }
				value={ pxNumber( fontSize?.tablet, 15 ) }
				onChange={ ( val ) => setFontSize( 'tablet', val ) }
				min={ 10 }
				max={ 40 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Font Size — Mobile (px)', 'b-blocks' ) }
				value={ pxNumber( fontSize?.mobile, 14 ) }
				onChange={ ( val ) => setFontSize( 'mobile', val ) }
				min={ 10 }
				max={ 40 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ fontWeight }
					options={ fontWeightOptions }
					onChange={ ( val ) => setAttributes( { fontWeight: parseInt( val, 10 ) || 600 } ) }
				/>
			</PanelRow>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Button Style', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Padding — Vertical (px)', 'b-blocks' ) }
				value={ pxNumber( padding?.vertical, 12 ) }
				onChange={ ( val ) => setPadding( 'vertical', val ) }
				min={ 0 }
				max={ 60 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Padding — Horizontal (px)', 'b-blocks' ) }
				value={ pxNumber( padding?.horizontal, 24 ) }
				onChange={ ( val ) => setPadding( 'horizontal', val ) }
				min={ 0 }
				max={ 60 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Border Radius (px)', 'b-blocks' ) }
				value={ pxNumber( borderRadius, 6 ) }
				onChange={ ( val ) => setAttributes( { borderRadius: `${ val }px` } ) }
				min={ 0 }
				max={ 50 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Border Width (px)', 'b-blocks' ) }
				value={ pxNumber( borderWidth, 0 ) }
				onChange={ ( val ) => setAttributes( { borderWidth: `${ val }px` } ) }
				min={ 0 }
				max={ 8 }
				step={ 1 }
			/>
			<ColorControl
				label={ __( 'Border Color:', 'b-blocks' ) }
				value={ borderColor }
				onChange={ ( val ) => setAttributes( { borderColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Text Color:', 'b-blocks' ) }
				value={ btnColor }
				onChange={ ( val ) => setAttributes( { btnColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Background:', 'b-blocks' ) }
				value={ btnBG }
				onChange={ ( val ) => setAttributes( { btnBG: val } ) }
			/>
			<ColorControl
				label={ __( 'Hover Text Color:', 'b-blocks' ) }
				value={ btnHovColor }
				onChange={ ( val ) => setAttributes( { btnHovColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Hover Background:', 'b-blocks' ) }
				value={ btnHovBG }
				onChange={ ( val ) => setAttributes( { btnHovBG: val } ) }
			/>
		</PanelBody>

		{ showQuantity && (
			<PanelBody className='bPlPanelBody' title={ __( 'Quantity Style', 'b-blocks' ) } initialOpen={ false }>
				<ColorControl
					label={ __( 'Stepper Text Color:', 'b-blocks' ) }
					value={ qtyBtnColor }
					onChange={ ( val ) => setAttributes( { qtyBtnColor: val } ) }
				/>
				<ColorControl
					label={ __( 'Stepper Background:', 'b-blocks' ) }
					value={ qtyBtnBG }
					onChange={ ( val ) => setAttributes( { qtyBtnBG: val } ) }
				/>
				<ColorControl
					label={ __( 'Input Border Color:', 'b-blocks' ) }
					value={ qtyInputBorderColor }
					onChange={ ( val ) => setAttributes( { qtyInputBorderColor: val } ) }
				/>
				<RangeControl
					label={ __( 'Quantity Border Radius (px)', 'b-blocks' ) }
					value={ pxNumber( qtyBorderRadius, 4 ) }
					onChange={ ( val ) => setAttributes( { qtyBorderRadius: `${ val }px` } ) }
					min={ 0 }
					max={ 50 }
					step={ 1 }
				/>
			</PanelBody>
		) }
	</InspectorControls>;
};

export default Settings;

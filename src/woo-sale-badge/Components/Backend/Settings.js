import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import {
	badgeModeOptions, badgeShapeOptions, badgePositionOptions,
	fontWeightOptions, alignmentOptions
} from '../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		productId, showPrice, showBadge, badgeMode, saleLabelText, badgeShape,
		badgePosition, badgeBG, badgeTextColor, badgeFontSize, badgeFontWeight,
		badgePaddingVertical, badgePaddingHorizontal, salePriceColor,
		regularPriceColor, priceFontSize, priceFontWeight, priceGap,
		badgePriceGap, alignment, maxWidth, noProductMessage,
		hideBadgeWhenNotOnSale, hidePriceWhenNotOnSale
	} = attributes;

	const [ product, setProduct ] = useState( null );
	const [ fetchError, setFetchError ] = useState( false );

	// Resolve the selected product for an editor preview.
	useEffect( () => {
		const id = parseInt( productId, 10 ) || 0;
		if ( ! id ) {
			setProduct( null );
			setFetchError( false );
			return;
		}

		let active = true;
		apiFetch( { path: `/wc/store/v1/products/${ id }` } )
			.then( ( res ) => {
				if ( ! active ) return;
				setProduct( res );
				setFetchError( false );
			} )
			.catch( () => {
				if ( ! active ) return;
				setProduct( null );
				setFetchError( true );
			} );

		return () => { active = false; };
	}, [ productId ] );

	const setFontSize = ( key, val ) => setAttributes( {
		priceFontSize: { ...priceFontSize, [ key ]: `${ val }px` }
	} );
	const fontSizeNumber = ( val, fallback ) => {
		const n = parseInt( val, 10 );
		return Number.isNaN( n ) ? fallback : n;
	};

	const previewImage = product && product.images && product.images[ 0 ] ? product.images[ 0 ].src : '';

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Product', 'b-blocks' ) }>
			<TextControl
				label={ __( 'Product ID', 'b-blocks' ) }
				type='number'
				min={ 0 }
				value={ productId || 0 }
				onChange={ ( val ) => setAttributes( { productId: parseInt( val, 10 ) || 0 } ) }
				help={ __( 'Enter the numeric ID of the WooCommerce product.', 'b-blocks' ) }
				__nextHasNoMarginBottom
			/>

			{ product && (
				<div className='bb-wsb-product-preview'>
					{ previewImage && <img src={ previewImage } alt='' /> }
					<span className='bb-wsb-product-preview-name'>{ product.name }</span>
				</div>
			) }

			{ fetchError && !! productId && (
				<p className='bb-wsb-product-preview-error'>
					{ __( 'No product found for this ID.', 'b-blocks' ) }
				</p>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Display', 'b-blocks' ) }>
			<ToggleControl
				label={ __( 'Show price row', 'b-blocks' ) }
				checked={ !! showPrice }
				onChange={ ( val ) => setAttributes( { showPrice: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show sale badge', 'b-blocks' ) }
				checked={ !! showBadge }
				onChange={ ( val ) => setAttributes( { showBadge: val } ) }
			/>

			{ showBadge && (
				<ToggleControl
					label={ __( 'Hide badge when not on sale', 'b-blocks' ) }
					checked={ !! hideBadgeWhenNotOnSale }
					onChange={ ( val ) => setAttributes( { hideBadgeWhenNotOnSale: val } ) }
				/>
			) }

			<ToggleControl
				label={ __( 'Hide price strikethrough when not on sale', 'b-blocks' ) }
				help={ __( 'When off, the plain price still shows for non-sale products.', 'b-blocks' ) }
				checked={ !! hidePriceWhenNotOnSale }
				onChange={ ( val ) => setAttributes( { hidePriceWhenNotOnSale: val } ) }
			/>

			{ showBadge && <>
				<PanelRow>
					<Label className=''>{ __( 'Badge mode:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ badgeMode }
						options={ badgeModeOptions }
						onChange={ ( val ) => setAttributes( { badgeMode: val } ) }
					/>
				</PanelRow>

				{ 'sale_label' === badgeMode && (
					<TextControl
						label={ __( 'Custom label text', 'b-blocks' ) }
						value={ saleLabelText }
						onChange={ ( val ) => setAttributes( { saleLabelText: val } ) }
						__nextHasNoMarginBottom
					/>
				) }

				<PanelRow>
					<Label className=''>{ __( 'Badge position:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ badgePosition }
						options={ badgePositionOptions }
						onChange={ ( val ) => setAttributes( { badgePosition: val } ) }
					/>
				</PanelRow>
			</> }
		</PanelBody>

		{ showBadge && (
			<PanelBody className='bPlPanelBody' title={ __( 'Style — Badge', 'b-blocks' ) } initialOpen={ false }>
				<PanelRow>
					<Label className=''>{ __( 'Shape:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ badgeShape }
						options={ badgeShapeOptions }
						onChange={ ( val ) => setAttributes( { badgeShape: val } ) }
					/>
				</PanelRow>
				<ColorControl
					label={ __( 'Background:', 'b-blocks' ) }
					value={ badgeBG }
					onChange={ ( val ) => setAttributes( { badgeBG: val } ) }
				/>
				<ColorControl
					label={ __( 'Text Color:', 'b-blocks' ) }
					value={ badgeTextColor }
					onChange={ ( val ) => setAttributes( { badgeTextColor: val } ) }
				/>
				<RangeControl
					label={ __( 'Font Size (px)', 'b-blocks' ) }
					value={ badgeFontSize }
					onChange={ ( val ) => setAttributes( { badgeFontSize: val } ) }
					min={ 10 }
					max={ 32 }
					step={ 1 }
				/>
				<PanelRow>
					<Label className=''>{ __( 'Font Weight:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ badgeFontWeight }
						options={ fontWeightOptions }
						onChange={ ( val ) => setAttributes( { badgeFontWeight: parseInt( val, 10 ) || 700 } ) }
					/>
				</PanelRow>
				<RangeControl
					label={ __( 'Vertical Padding (px)', 'b-blocks' ) }
					value={ badgePaddingVertical }
					onChange={ ( val ) => setAttributes( { badgePaddingVertical: val } ) }
					min={ 0 }
					max={ 24 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Horizontal Padding (px)', 'b-blocks' ) }
					value={ badgePaddingHorizontal }
					onChange={ ( val ) => setAttributes( { badgePaddingHorizontal: val } ) }
					min={ 0 }
					max={ 32 }
					step={ 1 }
				/>
			</PanelBody>
		) }

		{ showPrice && (
			<PanelBody className='bPlPanelBody' title={ __( 'Style — Price', 'b-blocks' ) } initialOpen={ false }>
				<ColorControl
					label={ __( 'Sale Price Color:', 'b-blocks' ) }
					value={ salePriceColor }
					onChange={ ( val ) => setAttributes( { salePriceColor: val } ) }
				/>
				<ColorControl
					label={ __( 'Regular Price Color:', 'b-blocks' ) }
					value={ regularPriceColor }
					onChange={ ( val ) => setAttributes( { regularPriceColor: val } ) }
				/>
				<RangeControl
					label={ __( 'Font Size — Desktop (px)', 'b-blocks' ) }
					value={ fontSizeNumber( priceFontSize?.desktop, 20 ) }
					onChange={ ( val ) => setFontSize( 'desktop', val ) }
					min={ 10 }
					max={ 64 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Font Size — Tablet (px)', 'b-blocks' ) }
					value={ fontSizeNumber( priceFontSize?.tablet, 18 ) }
					onChange={ ( val ) => setFontSize( 'tablet', val ) }
					min={ 10 }
					max={ 64 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Font Size — Mobile (px)', 'b-blocks' ) }
					value={ fontSizeNumber( priceFontSize?.mobile, 16 ) }
					onChange={ ( val ) => setFontSize( 'mobile', val ) }
					min={ 10 }
					max={ 64 }
					step={ 1 }
				/>
				<PanelRow>
					<Label className=''>{ __( 'Sale Price Font Weight:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ priceFontWeight }
						options={ fontWeightOptions }
						onChange={ ( val ) => setAttributes( { priceFontWeight: parseInt( val, 10 ) || 700 } ) }
					/>
				</PanelRow>
				<RangeControl
					label={ __( 'Price pair gap (px)', 'b-blocks' ) }
					value={ priceGap }
					onChange={ ( val ) => setAttributes( { priceGap: val } ) }
					min={ 0 }
					max={ 32 }
					step={ 1 }
				/>
			</PanelBody>
		) }

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ alignment }
					options={ alignmentOptions }
					onChange={ ( val ) => setAttributes( { alignment: val } ) }
				/>
			</PanelRow>
			<RangeControl
				label={ __( 'Max width (px); 0 = auto', 'b-blocks' ) }
				value={ maxWidth }
				onChange={ ( val ) => setAttributes( { maxWidth: val } ) }
				min={ 0 }
				max={ 1200 }
				step={ 10 }
			/>
			{ showBadge && ( 'above' === badgePosition || 'below' === badgePosition ) && (
				<RangeControl
					label={ __( 'Gap between price and badge (px)', 'b-blocks' ) }
					value={ badgePriceGap }
					onChange={ ( val ) => setAttributes( { badgePriceGap: val } ) }
					min={ 0 }
					max={ 32 }
					step={ 1 }
				/>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Misc', 'b-blocks' ) } initialOpen={ false }>
			<TextControl
				label={ __( 'No Product Message', 'b-blocks' ) }
				value={ noProductMessage }
				onChange={ ( val ) => setAttributes( { noProductMessage: val } ) }
				__nextHasNoMarginBottom
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

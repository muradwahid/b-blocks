import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import {
	layoutOptions, imagePositionOptions, aspectRatioOptions, imageFitOptions,
	contentAlignOptions, verticalAlignOptions, blockAlignOptions
} from '../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		productId, layout, imagePosition, imageSplit, imageRatio, imageFit,
		imageBorderRadius, showImage, showBadge, saleBadgeLabel, showRating,
		showPrice, showShortDescription, showAddToCart, addToCartLabel,
		viewProductLabel, contentAlign, contentVerticalAlign, gap, maxWidth,
		blockAlign, blockPaddingVertical, blockPaddingHorizontal, blockBG,
		blockBorderRadius, titleColor, titleFontSize, titleFontWeight,
		priceColor, regularPriceColor, ratingColor, descriptionColor,
		descriptionFontSize, badgeBG, badgeTextColor, btnColor, btnBG,
		btnHovColor, btnHovBG, btnRadius, btnFontSize, btnFontWeight,
		btnPaddingVertical, btnPaddingHorizontal, mobileMirror, noProductMessage
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

	const setFontSize = ( attr, current, key, val ) => setAttributes( {
		[ attr ]: { ...current, [ key ]: `${ val }px` }
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
				help={ __( 'Enter the numeric ID of the WooCommerce product to feature.', 'b-blocks' ) }
				__nextHasNoMarginBottom
			/>

			{ product && (
				<div className='bb-wfp-product-preview'>
					{ previewImage && <img src={ previewImage } alt='' /> }
					<span className='bb-wfp-product-preview-name'>{ product.name }</span>
				</div>
			) }

			{ fetchError && !! productId && (
				<p className='bb-wfp-product-preview-error'>
					{ __( 'No product found for this ID.', 'b-blocks' ) }
				</p>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Layout:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ layout }
					options={ layoutOptions }
					onChange={ ( val ) => setAttributes( { layout: val } ) }
				/>
			</PanelRow>

			{ 'horizontal' === layout && <>
				<PanelRow>
					<Label className=''>{ __( 'Image Position:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ imagePosition }
						options={ imagePositionOptions }
						onChange={ ( val ) => setAttributes( { imagePosition: val } ) }
					/>
				</PanelRow>

				<RangeControl
					label={ __( 'Image Width (%)', 'b-blocks' ) }
					value={ imageSplit }
					onChange={ ( val ) => setAttributes( { imageSplit: val } ) }
					min={ 30 }
					max={ 70 }
					step={ 5 }
				/>

				<RangeControl
					label={ __( 'Column Gap (px)', 'b-blocks' ) }
					value={ gap }
					onChange={ ( val ) => setAttributes( { gap: val } ) }
					min={ 0 }
					max={ 80 }
					step={ 1 }
				/>

				<PanelRow>
					<Label className=''>{ __( 'Content Vertical Align:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ contentVerticalAlign }
						options={ verticalAlignOptions }
						onChange={ ( val ) => setAttributes( { contentVerticalAlign: val } ) }
					/>
				</PanelRow>

				<ToggleControl
					label={ __( 'Mobile: Image on Top', 'b-blocks' ) }
					checked={ !! mobileMirror }
					onChange={ ( val ) => setAttributes( { mobileMirror: val } ) }
				/>
			</> }

			<PanelRow>
				<Label className=''>{ __( 'Content Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ contentAlign }
					options={ contentAlignOptions }
					onChange={ ( val ) => setAttributes( { contentAlign: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Max Width (px, 0 = unlimited)', 'b-blocks' ) }
				value={ maxWidth }
				onChange={ ( val ) => setAttributes( { maxWidth: val } ) }
				min={ 0 }
				max={ 1600 }
				step={ 10 }
			/>

			{ maxWidth > 0 && (
				<PanelRow>
					<Label className=''>{ __( 'Block Alignment:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ blockAlign }
						options={ blockAlignOptions }
						onChange={ ( val ) => setAttributes( { blockAlign: val } ) }
					/>
				</PanelRow>
			) }

			<RangeControl
				label={ __( 'Padding Vertical (px)', 'b-blocks' ) }
				value={ blockPaddingVertical }
				onChange={ ( val ) => setAttributes( { blockPaddingVertical: val } ) }
				min={ 0 }
				max={ 120 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Padding Horizontal (px)', 'b-blocks' ) }
				value={ blockPaddingHorizontal }
				onChange={ ( val ) => setAttributes( { blockPaddingHorizontal: val } ) }
				min={ 0 }
				max={ 120 }
				step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Image', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Image', 'b-blocks' ) }
				checked={ !! showImage }
				onChange={ ( val ) => setAttributes( { showImage: val } ) }
			/>

			{ showImage && <>
				<PanelRow>
					<Label className=''>{ __( 'Aspect Ratio:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ imageRatio }
						options={ aspectRatioOptions }
						onChange={ ( val ) => setAttributes( { imageRatio: val } ) }
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{ __( 'Object Fit:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ imageFit }
						options={ imageFitOptions }
						onChange={ ( val ) => setAttributes( { imageFit: val } ) }
					/>
				</PanelRow>
				<RangeControl
					label={ __( 'Border Radius (px)', 'b-blocks' ) }
					value={ imageBorderRadius }
					onChange={ ( val ) => setAttributes( { imageBorderRadius: val } ) }
					min={ 0 }
					max={ 48 }
					step={ 1 }
				/>
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Elements', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Sale Badge', 'b-blocks' ) }
				checked={ !! showBadge }
				onChange={ ( val ) => setAttributes( { showBadge: val } ) }
			/>
			{ showBadge && (
				<TextControl
					label={ __( 'Sale Badge Label', 'b-blocks' ) }
					value={ saleBadgeLabel }
					onChange={ ( val ) => setAttributes( { saleBadgeLabel: val } ) }
					__nextHasNoMarginBottom
				/>
			) }

			<ToggleControl
				label={ __( 'Show Rating', 'b-blocks' ) }
				checked={ !! showRating }
				onChange={ ( val ) => setAttributes( { showRating: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show Price', 'b-blocks' ) }
				checked={ !! showPrice }
				onChange={ ( val ) => setAttributes( { showPrice: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show Short Description', 'b-blocks' ) }
				checked={ !! showShortDescription }
				onChange={ ( val ) => setAttributes( { showShortDescription: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show Add to Cart', 'b-blocks' ) }
				checked={ !! showAddToCart }
				onChange={ ( val ) => setAttributes( { showAddToCart: val } ) }
			/>
			{ showAddToCart && <>
				<TextControl
					label={ __( 'Add to Cart Label', 'b-blocks' ) }
					value={ addToCartLabel }
					onChange={ ( val ) => setAttributes( { addToCartLabel: val } ) }
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={ __( 'View Product Label', 'b-blocks' ) }
					value={ viewProductLabel }
					onChange={ ( val ) => setAttributes( { viewProductLabel: val } ) }
					help={ __( 'Used for variable/grouped products that link to the product page.', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style — Block', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Background Color:', 'b-blocks' ) }
				value={ blockBG }
				onChange={ ( val ) => setAttributes( { blockBG: val } ) }
			/>
			<RangeControl
				label={ __( 'Border Radius (px)', 'b-blocks' ) }
				value={ blockBorderRadius }
				onChange={ ( val ) => setAttributes( { blockBorderRadius: val } ) }
				min={ 0 }
				max={ 48 }
				step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style — Title', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Color:', 'b-blocks' ) }
				value={ titleColor }
				onChange={ ( val ) => setAttributes( { titleColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Font Size — Desktop (px)', 'b-blocks' ) }
				value={ fontSizeNumber( titleFontSize?.desktop, 28 ) }
				onChange={ ( val ) => setFontSize( 'titleFontSize', titleFontSize, 'desktop', val ) }
				min={ 12 }
				max={ 80 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Font Size — Tablet (px)', 'b-blocks' ) }
				value={ fontSizeNumber( titleFontSize?.tablet, 24 ) }
				onChange={ ( val ) => setFontSize( 'titleFontSize', titleFontSize, 'tablet', val ) }
				min={ 12 }
				max={ 72 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Font Size — Mobile (px)', 'b-blocks' ) }
				value={ fontSizeNumber( titleFontSize?.mobile, 20 ) }
				onChange={ ( val ) => setFontSize( 'titleFontSize', titleFontSize, 'mobile', val ) }
				min={ 12 }
				max={ 64 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Font Weight', 'b-blocks' ) }
				value={ titleFontWeight }
				onChange={ ( val ) => setAttributes( { titleFontWeight: val } ) }
				min={ 400 }
				max={ 900 }
				step={ 100 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style — Price', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Sale Price Color:', 'b-blocks' ) }
				value={ priceColor }
				onChange={ ( val ) => setAttributes( { priceColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Regular Price Color:', 'b-blocks' ) }
				value={ regularPriceColor }
				onChange={ ( val ) => setAttributes( { regularPriceColor: val } ) }
			/>
		</PanelBody>

		{ showRating && (
			<PanelBody className='bPlPanelBody' title={ __( 'Style — Rating', 'b-blocks' ) } initialOpen={ false }>
				<ColorControl
					label={ __( 'Star Color:', 'b-blocks' ) }
					value={ ratingColor }
					onChange={ ( val ) => setAttributes( { ratingColor: val } ) }
				/>
			</PanelBody>
		) }

		{ showShortDescription && (
			<PanelBody className='bPlPanelBody' title={ __( 'Style — Description', 'b-blocks' ) } initialOpen={ false }>
				<ColorControl
					label={ __( 'Color:', 'b-blocks' ) }
					value={ descriptionColor }
					onChange={ ( val ) => setAttributes( { descriptionColor: val } ) }
				/>
				<RangeControl
					label={ __( 'Font Size — Desktop (px)', 'b-blocks' ) }
					value={ fontSizeNumber( descriptionFontSize?.desktop, 15 ) }
					onChange={ ( val ) => setFontSize( 'descriptionFontSize', descriptionFontSize, 'desktop', val ) }
					min={ 10 }
					max={ 40 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Font Size — Tablet (px)', 'b-blocks' ) }
					value={ fontSizeNumber( descriptionFontSize?.tablet, 14 ) }
					onChange={ ( val ) => setFontSize( 'descriptionFontSize', descriptionFontSize, 'tablet', val ) }
					min={ 10 }
					max={ 36 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Font Size — Mobile (px)', 'b-blocks' ) }
					value={ fontSizeNumber( descriptionFontSize?.mobile, 14 ) }
					onChange={ ( val ) => setFontSize( 'descriptionFontSize', descriptionFontSize, 'mobile', val ) }
					min={ 10 }
					max={ 32 }
					step={ 1 }
				/>
			</PanelBody>
		) }

		{ showBadge && (
			<PanelBody className='bPlPanelBody' title={ __( 'Style — Badge', 'b-blocks' ) } initialOpen={ false }>
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
			</PanelBody>
		) }

		{ showAddToCart && (
			<PanelBody className='bPlPanelBody' title={ __( 'Style — Button', 'b-blocks' ) } initialOpen={ false }>
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
				<RangeControl
					label={ __( 'Border Radius (px)', 'b-blocks' ) }
					value={ btnRadius }
					onChange={ ( val ) => setAttributes( { btnRadius: val } ) }
					min={ 0 }
					max={ 48 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Font Size — Desktop (px)', 'b-blocks' ) }
					value={ fontSizeNumber( btnFontSize?.desktop, 16 ) }
					onChange={ ( val ) => setFontSize( 'btnFontSize', btnFontSize, 'desktop', val ) }
					min={ 10 }
					max={ 40 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Font Size — Tablet (px)', 'b-blocks' ) }
					value={ fontSizeNumber( btnFontSize?.tablet, 15 ) }
					onChange={ ( val ) => setFontSize( 'btnFontSize', btnFontSize, 'tablet', val ) }
					min={ 10 }
					max={ 36 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Font Size — Mobile (px)', 'b-blocks' ) }
					value={ fontSizeNumber( btnFontSize?.mobile, 14 ) }
					onChange={ ( val ) => setFontSize( 'btnFontSize', btnFontSize, 'mobile', val ) }
					min={ 10 }
					max={ 32 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Font Weight', 'b-blocks' ) }
					value={ btnFontWeight }
					onChange={ ( val ) => setAttributes( { btnFontWeight: val } ) }
					min={ 400 }
					max={ 900 }
					step={ 100 }
				/>
				<RangeControl
					label={ __( 'Padding Vertical (px)', 'b-blocks' ) }
					value={ btnPaddingVertical }
					onChange={ ( val ) => setAttributes( { btnPaddingVertical: val } ) }
					min={ 4 }
					max={ 40 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Padding Horizontal (px)', 'b-blocks' ) }
					value={ btnPaddingHorizontal }
					onChange={ ( val ) => setAttributes( { btnPaddingHorizontal: val } ) }
					min={ 8 }
					max={ 80 }
					step={ 1 }
				/>
			</PanelBody>
		) }

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

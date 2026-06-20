import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import {
	presetOptions, aspectRatioOptions, imageFitOptions,
	contentAlignOptions, cardShadowOptions
} from '../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		preset, productCount, categoryId,
		columns, columnGap, rowGap, contentAlign,
		showRankBadge, rankBadgeBG, rankBadgeColor,
		showImage, imageFit, imageRatio,
		showTitle, showPrice, showRating, showSaleBadge, saleBadgeLabel,
		showAddToCart, addToCartLabel,
		cardBG, cardPadding, cardBorderWidth, cardBorderColor, cardRadius, cardShadow,
		titleColor, titleFontSize, priceColor, regularPriceColor, ratingColor,
		badgeBG, badgeTextColor, btnColor, btnBG, btnHovColor, btnHovBG, btnRadius,
		noProductsMessage
	} = attributes;

	const [ categoryOptions, setCategoryOptions ] = useState( [
		{ value: '0', label: __( 'All Categories', 'b-blocks' ) }
	] );

	// Load WooCommerce product categories.
	useEffect( () => {
		apiFetch( { path: addQueryArgs( '/wp/v2/product_cat', { per_page: 100, _fields: 'id,name' } ) } )
			.then( ( terms ) => {
				const opts = ( Array.isArray( terms ) ? terms : [] ).map( ( t ) => ( { value: String( t.id ), label: t.name } ) );
				setCategoryOptions( [ { value: '0', label: __( 'All Categories', 'b-blocks' ) }, ...opts ] );
			} )
			.catch( () => setCategoryOptions( [ { value: '0', label: __( 'All Categories', 'b-blocks' ) } ] ) );
	}, [] );

	const setColumns = ( key, val ) => setAttributes( { columns: { ...columns, [ key ]: val } } );

	const setTitleFontSize = ( key, val ) => setAttributes( {
		titleFontSize: { ...titleFontSize, [ key ]: `${ val }px` }
	} );
	const fontSizeNumber = ( val, fallback ) => {
		const n = parseInt( val, 10 );
		return Number.isNaN( n ) ? fallback : n;
	};

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Query', 'b-blocks' ) }>
			<PanelRow>
				<Label className=''>{ __( 'Preset:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ preset }
					options={ presetOptions }
					onChange={ ( val ) => setAttributes( { preset: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Products to Show', 'b-blocks' ) }
				value={ productCount }
				onChange={ ( val ) => setAttributes( { productCount: val } ) }
				min={ 1 }
				max={ 24 }
				step={ 1 }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Narrow by Category:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ String( categoryId ) }
					options={ categoryOptions }
					onChange={ ( val ) => setAttributes( { categoryId: parseInt( val, 10 ) || 0 } ) }
				/>
			</PanelRow>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Columns — Desktop', 'b-blocks' ) }
				value={ columns?.desktop }
				onChange={ ( val ) => setColumns( 'desktop', val ) }
				min={ 1 }
				max={ 6 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Columns — Tablet', 'b-blocks' ) }
				value={ columns?.tablet }
				onChange={ ( val ) => setColumns( 'tablet', val ) }
				min={ 1 }
				max={ 4 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Columns — Mobile', 'b-blocks' ) }
				value={ columns?.mobile }
				onChange={ ( val ) => setColumns( 'mobile', val ) }
				min={ 1 }
				max={ 2 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Column Gap (px)', 'b-blocks' ) }
				value={ columnGap }
				onChange={ ( val ) => setAttributes( { columnGap: val } ) }
				min={ 0 }
				max={ 60 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Row Gap (px)', 'b-blocks' ) }
				value={ rowGap }
				onChange={ ( val ) => setAttributes( { rowGap: val } ) }
				min={ 0 }
				max={ 60 }
				step={ 1 }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Content Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ contentAlign }
					options={ contentAlignOptions }
					onChange={ ( val ) => setAttributes( { contentAlign: val } ) }
				/>
			</PanelRow>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Card Elements', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Image', 'b-blocks' ) }
				checked={ !! showImage }
				onChange={ ( val ) => setAttributes( { showImage: val } ) }
			/>

			{ showImage && <>
				<PanelRow>
					<Label className=''>{ __( 'Image Aspect Ratio:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ imageRatio }
						options={ aspectRatioOptions }
						onChange={ ( val ) => setAttributes( { imageRatio: val } ) }
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{ __( 'Image Fit:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ imageFit }
						options={ imageFitOptions }
						onChange={ ( val ) => setAttributes( { imageFit: val } ) }
					/>
				</PanelRow>
			</> }

			<ToggleControl
				label={ __( 'Show Rank Badge', 'b-blocks' ) }
				checked={ !! showRankBadge }
				onChange={ ( val ) => setAttributes( { showRankBadge: val } ) }
			/>

			<ToggleControl
				label={ __( 'Show Title', 'b-blocks' ) }
				checked={ !! showTitle }
				onChange={ ( val ) => setAttributes( { showTitle: val } ) }
			/>

			<ToggleControl
				label={ __( 'Show Price', 'b-blocks' ) }
				checked={ !! showPrice }
				onChange={ ( val ) => setAttributes( { showPrice: val } ) }
			/>

			<ToggleControl
				label={ __( 'Show Rating', 'b-blocks' ) }
				checked={ !! showRating }
				onChange={ ( val ) => setAttributes( { showRating: val } ) }
			/>

			<ToggleControl
				label={ __( 'Show Sale Badge', 'b-blocks' ) }
				checked={ !! showSaleBadge }
				onChange={ ( val ) => setAttributes( { showSaleBadge: val } ) }
			/>

			{ showSaleBadge && (
				<TextControl
					label={ __( 'Sale Badge Label', 'b-blocks' ) }
					value={ saleBadgeLabel }
					onChange={ ( val ) => setAttributes( { saleBadgeLabel: val } ) }
					__nextHasNoMarginBottom
				/>
			) }

			<ToggleControl
				label={ __( 'Show Add to Cart', 'b-blocks' ) }
				checked={ !! showAddToCart }
				onChange={ ( val ) => setAttributes( { showAddToCart: val } ) }
			/>

			{ showAddToCart && (
				<TextControl
					label={ __( 'Add to Cart Label', 'b-blocks' ) }
					value={ addToCartLabel }
					onChange={ ( val ) => setAttributes( { addToCartLabel: val } ) }
					__nextHasNoMarginBottom
				/>
			) }

			<TextControl
				label={ __( 'No Products Message', 'b-blocks' ) }
				value={ noProductsMessage }
				onChange={ ( val ) => setAttributes( { noProductsMessage: val } ) }
				__nextHasNoMarginBottom
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Card Background:', 'b-blocks' ) }
				value={ cardBG }
				onChange={ ( val ) => setAttributes( { cardBG: val } ) }
			/>

			<RangeControl
				label={ __( 'Card Padding (px)', 'b-blocks' ) }
				value={ cardPadding }
				onChange={ ( val ) => setAttributes( { cardPadding: val } ) }
				min={ 0 }
				max={ 48 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Card Border Width (px)', 'b-blocks' ) }
				value={ cardBorderWidth }
				onChange={ ( val ) => setAttributes( { cardBorderWidth: val } ) }
				min={ 0 }
				max={ 8 }
				step={ 1 }
			/>

			{ cardBorderWidth > 0 && (
				<ColorControl
					label={ __( 'Card Border Color:', 'b-blocks' ) }
					value={ cardBorderColor }
					onChange={ ( val ) => setAttributes( { cardBorderColor: val } ) }
				/>
			) }

			<RangeControl
				label={ __( 'Card Border Radius (px)', 'b-blocks' ) }
				value={ cardRadius }
				onChange={ ( val ) => setAttributes( { cardRadius: val } ) }
				min={ 0 }
				max={ 32 }
				step={ 1 }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Card Shadow:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ cardShadow }
					options={ cardShadowOptions }
					onChange={ ( val ) => setAttributes( { cardShadow: val } ) }
				/>
			</PanelRow>

			<ColorControl
				label={ __( 'Title Color:', 'b-blocks' ) }
				value={ titleColor }
				onChange={ ( val ) => setAttributes( { titleColor: val } ) }
			/>

			<RangeControl
				label={ __( 'Title Font Size — Desktop (px)', 'b-blocks' ) }
				value={ fontSizeNumber( titleFontSize?.desktop, 17 ) }
				onChange={ ( val ) => setTitleFontSize( 'desktop', val ) }
				min={ 10 }
				max={ 36 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Title Font Size — Tablet (px)', 'b-blocks' ) }
				value={ fontSizeNumber( titleFontSize?.tablet, 16 ) }
				onChange={ ( val ) => setTitleFontSize( 'tablet', val ) }
				min={ 10 }
				max={ 36 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Title Font Size — Mobile (px)', 'b-blocks' ) }
				value={ fontSizeNumber( titleFontSize?.mobile, 15 ) }
				onChange={ ( val ) => setTitleFontSize( 'mobile', val ) }
				min={ 10 }
				max={ 36 }
				step={ 1 }
			/>

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
			<ColorControl
				label={ __( 'Star Rating Color:', 'b-blocks' ) }
				value={ ratingColor }
				onChange={ ( val ) => setAttributes( { ratingColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Sale Badge Background:', 'b-blocks' ) }
				value={ badgeBG }
				onChange={ ( val ) => setAttributes( { badgeBG: val } ) }
			/>
			<ColorControl
				label={ __( 'Sale Badge Text Color:', 'b-blocks' ) }
				value={ badgeTextColor }
				onChange={ ( val ) => setAttributes( { badgeTextColor: val } ) }
			/>

			{ showRankBadge && <>
				<ColorControl
					label={ __( 'Rank Badge Background:', 'b-blocks' ) }
					value={ rankBadgeBG }
					onChange={ ( val ) => setAttributes( { rankBadgeBG: val } ) }
				/>
				<ColorControl
					label={ __( 'Rank Badge Text Color:', 'b-blocks' ) }
					value={ rankBadgeColor }
					onChange={ ( val ) => setAttributes( { rankBadgeColor: val } ) }
				/>
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Button', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Button Text Color:', 'b-blocks' ) }
				value={ btnColor }
				onChange={ ( val ) => setAttributes( { btnColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Button Background:', 'b-blocks' ) }
				value={ btnBG }
				onChange={ ( val ) => setAttributes( { btnBG: val } ) }
			/>
			<ColorControl
				label={ __( 'Button Hover Text Color:', 'b-blocks' ) }
				value={ btnHovColor }
				onChange={ ( val ) => setAttributes( { btnHovColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Button Hover Background:', 'b-blocks' ) }
				value={ btnHovBG }
				onChange={ ( val ) => setAttributes( { btnHovBG: val } ) }
			/>
			<RangeControl
				label={ __( 'Button Border Radius (px)', 'b-blocks' ) }
				value={ btnRadius }
				onChange={ ( val ) => setAttributes( { btnRadius: val } ) }
				min={ 0 }
				max={ 32 }
				step={ 1 }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

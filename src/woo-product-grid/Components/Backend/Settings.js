import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel, SelectTokenField } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import {
	orderByOptions, orderOptions, aspectRatioOptions, imageFitOptions,
	contentAlignOptions, cardShadowOptions
} from '../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		columns, columnGap, rowGap, productsPerPage, orderBy, order,
		productCategories, productTags, onSaleOnly, featuredOnly,
		showImage, imageFit, imageRatio,
		showTitle, showPrice, showRating, showSaleBadge, saleBadgeLabel,
		showAddToCart, addToCartLabel, contentAlign,
		cardBG, cardPadding, cardBorderWidth, cardBorderColor, cardRadius, cardShadow,
		titleColor, titleFontSize, priceColor, regularPriceColor, ratingColor,
		badgeBG, badgeTextColor, btnColor, btnBG, btnHovColor, btnHovBG, btnRadius,
		noProductsMessage
	} = attributes;

	const [ categoryOptions, setCategoryOptions ] = useState( [] );
	const [ tagOptions, setTagOptions ] = useState( [] );

	// Load WooCommerce product categories.
	useEffect( () => {
		apiFetch( { path: addQueryArgs( '/wp/v2/product_cat', { per_page: 100, _fields: 'id,name' } ) } )
			.then( ( terms ) => {
				const opts = ( Array.isArray( terms ) ? terms : [] ).map( ( t ) => ( { value: String( t.id ), label: t.name } ) );
				setCategoryOptions( opts );
			} )
			.catch( () => setCategoryOptions( [] ) );
	}, [] );

	// Load WooCommerce product tags.
	useEffect( () => {
		apiFetch( { path: addQueryArgs( '/wp/v2/product_tag', { per_page: 100, _fields: 'id,name' } ) } )
			.then( ( terms ) => {
				const opts = ( Array.isArray( terms ) ? terms : [] ).map( ( t ) => ( { value: String( t.id ), label: t.name } ) );
				setTagOptions( opts );
			} )
			.catch( () => setTagOptions( [] ) );
	}, [] );

	const setColumns = ( key, val ) => setAttributes( { columns: { ...columns, [ key ]: val } } );

	const setTitleFontSize = ( key, val ) => setAttributes( {
		titleFontSize: { ...titleFontSize, [ key ]: `${ val }px` }
	} );
	const fontSizeNumber = ( val, fallback ) => {
		const n = parseInt( val, 10 );
		return Number.isNaN( n ) ? fallback : n;
	};

	const toIds = ( arr ) => ( Array.isArray( arr ) ? arr.map( ( v ) => parseInt( v, 10 ) ).filter( ( n ) => ! Number.isNaN( n ) ) : [] );

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Query', 'b-blocks' ) }>
			<RangeControl
				label={ __( 'Products Per Page', 'b-blocks' ) }
				value={ productsPerPage }
				onChange={ ( val ) => setAttributes( { productsPerPage: val } ) }
				min={ 1 }
				max={ 48 }
				step={ 1 }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Order By:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ orderBy }
					options={ orderByOptions }
					onChange={ ( val ) => setAttributes( { orderBy: val } ) }
				/>
			</PanelRow>

			<PanelRow>
				<Label className=''>{ __( 'Order:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ order }
					options={ orderOptions }
					onChange={ ( val ) => setAttributes( { order: val } ) }
				/>
			</PanelRow>

			<Label className='mt20'>{ __( 'Filter by Category:', 'b-blocks' ) }</Label>
			<SelectTokenField
				multiple
				value={ ( productCategories || [] ).map( ( id ) => String( id ) ) }
				options={ categoryOptions }
				onChange={ ( val ) => setAttributes( { productCategories: toIds( val ) } ) }
			/>

			<Label className='mt20'>{ __( 'Filter by Tag:', 'b-blocks' ) }</Label>
			<SelectTokenField
				multiple
				value={ ( productTags || [] ).map( ( id ) => String( id ) ) }
				options={ tagOptions }
				onChange={ ( val ) => setAttributes( { productTags: toIds( val ) } ) }
			/>

			<ToggleControl
				className='mt20'
				label={ __( 'On Sale Only', 'b-blocks' ) }
				checked={ !! onSaleOnly }
				onChange={ ( val ) => setAttributes( { onSaleOnly: val } ) }
			/>

			<ToggleControl
				label={ __( 'Featured Only', 'b-blocks' ) }
				checked={ !! featuredOnly }
				onChange={ ( val ) => setAttributes( { featuredOnly: val } ) }
			/>
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
				max={ 6 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Columns — Mobile', 'b-blocks' ) }
				value={ columns?.mobile }
				onChange={ ( val ) => setColumns( 'mobile', val ) }
				min={ 1 }
				max={ 6 }
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
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Card Style', 'b-blocks' ) } initialOpen={ false }>
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
				label={ __( 'Border Width (px)', 'b-blocks' ) }
				value={ cardBorderWidth }
				onChange={ ( val ) => setAttributes( { cardBorderWidth: val } ) }
				min={ 0 }
				max={ 8 }
				step={ 1 }
			/>

			<ColorControl
				label={ __( 'Border Color:', 'b-blocks' ) }
				value={ cardBorderColor }
				onChange={ ( val ) => setAttributes( { cardBorderColor: val } ) }
			/>

			<RangeControl
				label={ __( 'Border Radius (px)', 'b-blocks' ) }
				value={ cardRadius }
				onChange={ ( val ) => setAttributes( { cardRadius: val } ) }
				min={ 0 }
				max={ 32 }
				step={ 1 }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Box Shadow:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ cardShadow }
					options={ cardShadowOptions }
					onChange={ ( val ) => setAttributes( { cardShadow: val } ) }
				/>
			</PanelRow>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Typography', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Title Font Size — Desktop (px)', 'b-blocks' ) }
				value={ fontSizeNumber( titleFontSize?.desktop, 17 ) }
				onChange={ ( val ) => setTitleFontSize( 'desktop', val ) }
				min={ 12 }
				max={ 40 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Title Font Size — Tablet (px)', 'b-blocks' ) }
				value={ fontSizeNumber( titleFontSize?.tablet, 16 ) }
				onChange={ ( val ) => setTitleFontSize( 'tablet', val ) }
				min={ 12 }
				max={ 36 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Title Font Size — Mobile (px)', 'b-blocks' ) }
				value={ fontSizeNumber( titleFontSize?.mobile, 15 ) }
				onChange={ ( val ) => setTitleFontSize( 'mobile', val ) }
				min={ 12 }
				max={ 32 }
				step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Colors', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Title Color:', 'b-blocks' ) }
				value={ titleColor }
				onChange={ ( val ) => setAttributes( { titleColor: val } ) }
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

		<PanelBody className='bPlPanelBody' title={ __( 'Misc', 'b-blocks' ) } initialOpen={ false }>
			<TextControl
				label={ __( 'No Products Message', 'b-blocks' ) }
				value={ noProductsMessage }
				onChange={ ( val ) => setAttributes( { noProductsMessage: val } ) }
				__nextHasNoMarginBottom
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

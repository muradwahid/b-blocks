import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel, SelectTokenField } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import {
	productTypeOptions, orderByOptions, orderOptions, aspectRatioOptions,
	contentAlignOptions, cardShadowOptions, titleWeightOptions
} from '../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		productsToShow, orderBy, order, productType,
		productCategories, productTags, excludeOutOfStock,
		slidesPerView, slideGap, isLoop, isAutoplay, autoplayDelay,
		autoplayPauseOnHover, transitionSpeed, isArrows, isDots,
		showImage, imageRatio, showTitle, showPrice, showRating,
		showSaleBadge, saleBadgeLabel, showAddToCart, addToCartLabel,
		contentAlign, cardBG, cardBorderWidth, cardBorderColor, cardRadius, cardShadow, cardPadding,
		titleColor, titleFontSize, titleFontWeight, priceColor, regularPriceColor, ratingColor,
		badgeBG, badgeTextColor,
		btnColor, btnBG, btnHoverColor, btnHoverBG, btnRadius,
		arrowColor, arrowBgColor, arrowBorderRadius, dotColor, dotInactiveColor,
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

	const setSlides = ( key, val ) => setAttributes( { slidesPerView: { ...slidesPerView, [ key ]: val } } );

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

		<PanelBody className='bPlPanelBody' title={ __( 'Query Settings', 'b-blocks' ) }>
			<PanelRow>
				<Label className=''>{ __( 'Product Type:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ productType }
					options={ productTypeOptions }
					onChange={ ( val ) => setAttributes( { productType: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Products to Show', 'b-blocks' ) }
				value={ productsToShow }
				onChange={ ( val ) => setAttributes( { productsToShow: val } ) }
				min={ 1 }
				max={ 24 }
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
				label={ __( 'Exclude Out of Stock', 'b-blocks' ) }
				checked={ !! excludeOutOfStock }
				onChange={ ( val ) => setAttributes( { excludeOutOfStock: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Carousel Settings', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Slides Per View — Desktop', 'b-blocks' ) }
				value={ slidesPerView?.desktop }
				onChange={ ( val ) => setSlides( 'desktop', val ) }
				min={ 1 }
				max={ 6 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Slides Per View — Tablet', 'b-blocks' ) }
				value={ slidesPerView?.tablet }
				onChange={ ( val ) => setSlides( 'tablet', val ) }
				min={ 1 }
				max={ 4 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Slides Per View — Mobile', 'b-blocks' ) }
				value={ slidesPerView?.mobile }
				onChange={ ( val ) => setSlides( 'mobile', val ) }
				min={ 1 }
				max={ 2 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Slide Gap (px)', 'b-blocks' ) }
				value={ slideGap }
				onChange={ ( val ) => setAttributes( { slideGap: val } ) }
				min={ 0 }
				max={ 60 }
				step={ 1 }
			/>

			<ToggleControl
				label={ __( 'Infinite Loop', 'b-blocks' ) }
				checked={ !! isLoop }
				onChange={ ( val ) => setAttributes( { isLoop: val } ) }
			/>

			<ToggleControl
				label={ __( 'Autoplay', 'b-blocks' ) }
				checked={ !! isAutoplay }
				onChange={ ( val ) => setAttributes( { isAutoplay: val } ) }
			/>

			{ isAutoplay && <>
				<RangeControl
					label={ __( 'Autoplay Delay (ms)', 'b-blocks' ) }
					value={ autoplayDelay }
					onChange={ ( val ) => setAttributes( { autoplayDelay: val } ) }
					min={ 1000 }
					max={ 10000 }
					step={ 500 }
				/>
				<ToggleControl
					label={ __( 'Pause on Hover', 'b-blocks' ) }
					checked={ !! autoplayPauseOnHover }
					onChange={ ( val ) => setAttributes( { autoplayPauseOnHover: val } ) }
				/>
			</> }

			<RangeControl
				label={ __( 'Transition Speed (ms)', 'b-blocks' ) }
				value={ transitionSpeed }
				onChange={ ( val ) => setAttributes( { transitionSpeed: val } ) }
				min={ 100 }
				max={ 2000 }
				step={ 50 }
			/>

			<ToggleControl
				label={ __( 'Show Arrows', 'b-blocks' ) }
				checked={ !! isArrows }
				onChange={ ( val ) => setAttributes( { isArrows: val } ) }
			/>

			<ToggleControl
				label={ __( 'Show Dots', 'b-blocks' ) }
				checked={ !! isDots }
				onChange={ ( val ) => setAttributes( { isDots: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Card Elements', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Image', 'b-blocks' ) }
				checked={ !! showImage }
				onChange={ ( val ) => setAttributes( { showImage: val } ) }
			/>

			{ showImage && (
				<PanelRow>
					<Label className=''>{ __( 'Image Aspect Ratio:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ imageRatio }
						options={ aspectRatioOptions }
						onChange={ ( val ) => setAttributes( { imageRatio: val } ) }
					/>
				</PanelRow>
			) }

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
			<PanelRow>
				<Label className=''>{ __( 'Content Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ contentAlign }
					options={ contentAlignOptions }
					onChange={ ( val ) => setAttributes( { contentAlign: val } ) }
				/>
			</PanelRow>

			<ColorControl
				label={ __( 'Card Background:', 'b-blocks' ) }
				value={ cardBG }
				onChange={ ( val ) => setAttributes( { cardBG: val } ) }
			/>

			<RangeControl
				label={ __( 'Border Width (px)', 'b-blocks' ) }
				value={ cardBorderWidth }
				onChange={ ( val ) => setAttributes( { cardBorderWidth: val } ) }
				min={ 0 }
				max={ 8 }
				step={ 1 }
			/>

			{ cardBorderWidth > 0 && (
				<ColorControl
					label={ __( 'Border Color:', 'b-blocks' ) }
					value={ cardBorderColor }
					onChange={ ( val ) => setAttributes( { cardBorderColor: val } ) }
				/>
			) }

			<RangeControl
				label={ __( 'Border Radius (px)', 'b-blocks' ) }
				value={ cardRadius }
				onChange={ ( val ) => setAttributes( { cardRadius: val } ) }
				min={ 0 }
				max={ 48 }
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

			<RangeControl
				label={ __( 'Card Padding (px)', 'b-blocks' ) }
				value={ cardPadding }
				onChange={ ( val ) => setAttributes( { cardPadding: val } ) }
				min={ 0 }
				max={ 48 }
				step={ 1 }
			/>

			<ColorControl
				label={ __( 'Title Color:', 'b-blocks' ) }
				value={ titleColor }
				onChange={ ( val ) => setAttributes( { titleColor: val } ) }
			/>

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

			<PanelRow>
				<Label className=''>{ __( 'Title Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ String( titleFontWeight ) }
					options={ titleWeightOptions.map( ( o ) => ( { label: o.label, value: String( o.value ) } ) ) }
					onChange={ ( val ) => setAttributes( { titleFontWeight: parseInt( val, 10 ) || 600 } ) }
				/>
			</PanelRow>

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
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Button Style', 'b-blocks' ) } initialOpen={ false }>
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
				value={ btnHoverColor }
				onChange={ ( val ) => setAttributes( { btnHoverColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Button Hover Background:', 'b-blocks' ) }
				value={ btnHoverBG }
				onChange={ ( val ) => setAttributes( { btnHoverBG: val } ) }
			/>
			<RangeControl
				label={ __( 'Button Border Radius (px)', 'b-blocks' ) }
				value={ btnRadius }
				onChange={ ( val ) => setAttributes( { btnRadius: val } ) }
				min={ 0 }
				max={ 48 }
				step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Navigation Style', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Arrow Color:', 'b-blocks' ) }
				value={ arrowColor }
				onChange={ ( val ) => setAttributes( { arrowColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Arrow Background:', 'b-blocks' ) }
				value={ arrowBgColor }
				onChange={ ( val ) => setAttributes( { arrowBgColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Arrow Border Radius (%)', 'b-blocks' ) }
				value={ arrowBorderRadius }
				onChange={ ( val ) => setAttributes( { arrowBorderRadius: val } ) }
				min={ 0 }
				max={ 50 }
				step={ 1 }
			/>
			<ColorControl
				label={ __( 'Active Dot Color:', 'b-blocks' ) }
				value={ dotColor }
				onChange={ ( val ) => setAttributes( { dotColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Inactive Dot Color:', 'b-blocks' ) }
				value={ dotInactiveColor }
				onChange={ ( val ) => setAttributes( { dotInactiveColor: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Fallback', 'b-blocks' ) } initialOpen={ false }>
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

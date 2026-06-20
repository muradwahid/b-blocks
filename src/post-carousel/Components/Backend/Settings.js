import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl, FormTokenField } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import { orderByOptions, orderOptions, aspectRatioOptions, titleTagOptions } from '../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		postType, postsPerPage, selectedCategories, selectedTags, postsOrderBy, postsOrder, isExcludeCurrent,
		slidesPerView, slideGap, isLoop, isAutoplay, autoplayDelay, autoplayPauseOnHover,
		transitionSpeed, isArrows, isDots,
		isFeaturedImage, imageAspectRatio, imageBorderRadius, isCategory, isTitle, titleTag, titleLines,
		isExcerpt, excerptLength, isMeta, isReadMore, readMoreLabel,
		cardBg, cardBorderRadius, cardBorderColor, cardBorderWidth, cardShadow,
		categoryBadgeBg, categoryBadgeColor, titleColor, titleFontSize, excerptColor, excerptFontSize,
		metaColor, metaFontSize, readMoreBg, readMoreColor, readMoreBorderRadius,
		arrowColor, arrowBgColor, arrowBorderRadius, dotColor, dotInactiveColor
	} = attributes;

	const [ postTypeOptions, setPostTypeOptions ] = useState( [
		{ label: __( 'Post', 'b-blocks' ), value: 'post' }
	] );
	const [ categories, setCategories ] = useState( [] );
	const [ tags, setTags ] = useState( [] );

	// Load public post types.
	useEffect( () => {
		apiFetch( { path: '/wp/v2/types' } ).then( ( types ) => {
			const opts = Object.values( types || {} )
				.filter( ( t ) => t.viewable && t.slug !== 'attachment' )
				.map( ( t ) => ( { label: t.name, value: t.slug } ) );
			if ( opts.length ) setPostTypeOptions( opts );
		} ).catch( () => {} );
	}, [] );

	// Load categories and tags for the token fields.
	useEffect( () => {
		apiFetch( { path: addQueryArgs( '/wp/v2/categories', { per_page: 100, _fields: 'id,name' } ) } )
			.then( ( terms ) => setCategories( Array.isArray( terms ) ? terms : [] ) )
			.catch( () => {} );
		apiFetch( { path: addQueryArgs( '/wp/v2/tags', { per_page: 100, _fields: 'id,name' } ) } )
			.then( ( terms ) => setTags( Array.isArray( terms ) ? terms : [] ) )
			.catch( () => {} );
	}, [] );

	const termsToTokens = ( ids, terms ) => ( ids || [] )
		.map( ( id ) => terms.find( ( t ) => t.id === id )?.name )
		.filter( Boolean );

	const tokensToIds = ( tokens, terms ) => ( tokens || [] )
		.map( ( name ) => terms.find( ( t ) => t.name === name )?.id )
		.filter( ( id ) => typeof id === 'number' );

	const setSlidesPerView = ( key, val ) => setAttributes( { slidesPerView: { ...slidesPerView, [ key ]: val } } );
	const setTitleFontSize = ( key, val ) => setAttributes( { titleFontSize: { ...titleFontSize, [ key ]: val } } );

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Query Settings', 'b-blocks' ) }>
			<PanelRow>
				<Label className=''>{ __( 'Post Type:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ postType }
					options={ postTypeOptions }
					onChange={ ( val ) => setAttributes( { postType: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Posts to Show', 'b-blocks' ) }
				value={ postsPerPage }
				onChange={ ( val ) => setAttributes( { postsPerPage: val } ) }
				min={ 2 }
				max={ 20 }
				step={ 1 }
			/>

			<FormTokenField
				label={ __( 'Filter by Categories (leave empty for all)', 'b-blocks' ) }
				value={ termsToTokens( selectedCategories, categories ) }
				suggestions={ categories.map( ( t ) => t.name ) }
				onChange={ ( tokens ) => setAttributes( { selectedCategories: tokensToIds( tokens, categories ) } ) }
				__experimentalExpandOnFocus
			/>

			<FormTokenField
				label={ __( 'Filter by Tags (leave empty for all)', 'b-blocks' ) }
				value={ termsToTokens( selectedTags, tags ) }
				suggestions={ tags.map( ( t ) => t.name ) }
				onChange={ ( tokens ) => setAttributes( { selectedTags: tokensToIds( tokens, tags ) } ) }
				__experimentalExpandOnFocus
			/>

			<PanelRow>
				<Label className=''>{ __( 'Order By:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ postsOrderBy }
					options={ orderByOptions }
					onChange={ ( val ) => setAttributes( { postsOrderBy: val } ) }
				/>
			</PanelRow>

			<PanelRow>
				<Label className=''>{ __( 'Order:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ postsOrder }
					options={ orderOptions }
					onChange={ ( val ) => setAttributes( { postsOrder: val } ) }
				/>
			</PanelRow>

			<ToggleControl
				label={ __( 'Exclude Current Post', 'b-blocks' ) }
				checked={ !! isExcludeCurrent }
				onChange={ ( val ) => setAttributes( { isExcludeCurrent: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Carousel Settings', 'b-blocks' ) }>
			<RangeControl
				label={ __( 'Slides per View — Desktop', 'b-blocks' ) }
				value={ slidesPerView?.desktop }
				onChange={ ( val ) => setSlidesPerView( 'desktop', val ) }
				min={ 1 }
				max={ 6 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Slides per View — Tablet', 'b-blocks' ) }
				value={ slidesPerView?.tablet }
				onChange={ ( val ) => setSlidesPerView( 'tablet', val ) }
				min={ 1 }
				max={ 4 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Slides per View — Mobile', 'b-blocks' ) }
				value={ slidesPerView?.mobile }
				onChange={ ( val ) => setSlidesPerView( 'mobile', val ) }
				min={ 1 }
				max={ 2 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Gap Between Slides (px)', 'b-blocks' ) }
				value={ slideGap }
				onChange={ ( val ) => setAttributes( { slideGap: val } ) }
				min={ 0 }
				max={ 80 }
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
					min={ 500 }
					max={ 8000 }
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
				max={ 1500 }
				step={ 100 }
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

		<PanelBody className='bPlPanelBody' title={ __( 'Card Content', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Featured Image', 'b-blocks' ) }
				checked={ !! isFeaturedImage }
				onChange={ ( val ) => setAttributes( { isFeaturedImage: val } ) }
			/>

			{ isFeaturedImage && <>
				<PanelRow>
					<Label className=''>{ __( 'Image Aspect Ratio:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ imageAspectRatio }
						options={ aspectRatioOptions }
						onChange={ ( val ) => setAttributes( { imageAspectRatio: val } ) }
					/>
				</PanelRow>
				<RangeControl
					label={ __( 'Image Border Radius (px)', 'b-blocks' ) }
					value={ imageBorderRadius }
					onChange={ ( val ) => setAttributes( { imageBorderRadius: val } ) }
					min={ 0 }
					max={ 32 }
					step={ 1 }
				/>
			</> }

			<ToggleControl
				label={ __( 'Show Category Badge', 'b-blocks' ) }
				checked={ !! isCategory }
				onChange={ ( val ) => setAttributes( { isCategory: val } ) }
			/>

			<ToggleControl
				label={ __( 'Show Title', 'b-blocks' ) }
				checked={ !! isTitle }
				onChange={ ( val ) => setAttributes( { isTitle: val } ) }
			/>

			{ isTitle && <>
				<PanelRow>
					<Label className=''>{ __( 'Title Tag:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ titleTag }
						options={ titleTagOptions }
						onChange={ ( val ) => setAttributes( { titleTag: val } ) }
					/>
				</PanelRow>
				<RangeControl
					label={ __( 'Title Max Lines (0 = unlimited)', 'b-blocks' ) }
					value={ titleLines }
					onChange={ ( val ) => setAttributes( { titleLines: val } ) }
					min={ 0 }
					max={ 4 }
					step={ 1 }
				/>
			</> }

			<ToggleControl
				label={ __( 'Show Excerpt', 'b-blocks' ) }
				checked={ !! isExcerpt }
				onChange={ ( val ) => setAttributes( { isExcerpt: val } ) }
			/>

			{ isExcerpt && (
				<RangeControl
					label={ __( 'Excerpt Length (words)', 'b-blocks' ) }
					value={ excerptLength }
					onChange={ ( val ) => setAttributes( { excerptLength: val } ) }
					min={ 5 }
					max={ 50 }
					step={ 1 }
				/>
			) }

			<ToggleControl
				label={ __( 'Show Author + Date', 'b-blocks' ) }
				checked={ !! isMeta }
				onChange={ ( val ) => setAttributes( { isMeta: val } ) }
			/>

			<ToggleControl
				label={ __( 'Show Read More Button', 'b-blocks' ) }
				checked={ !! isReadMore }
				onChange={ ( val ) => setAttributes( { isReadMore: val } ) }
			/>

			{ isReadMore && (
				<TextControl
					label={ __( 'Read More Label', 'b-blocks' ) }
					value={ readMoreLabel }
					onChange={ ( val ) => setAttributes( { readMoreLabel: val } ) }
					__nextHasNoMarginBottom
				/>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Card Style', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Card Background:', 'b-blocks' ) }
				value={ cardBg }
				onChange={ ( val ) => setAttributes( { cardBg: val } ) }
			/>
			<RangeControl
				label={ __( 'Card Border Radius (px)', 'b-blocks' ) }
				value={ cardBorderRadius }
				onChange={ ( val ) => setAttributes( { cardBorderRadius: val } ) }
				min={ 0 }
				max={ 32 }
				step={ 1 }
			/>
			<ColorControl
				label={ __( 'Card Border Color:', 'b-blocks' ) }
				value={ cardBorderColor }
				onChange={ ( val ) => setAttributes( { cardBorderColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Card Border Width (px)', 'b-blocks' ) }
				value={ cardBorderWidth }
				onChange={ ( val ) => setAttributes( { cardBorderWidth: val } ) }
				min={ 0 }
				max={ 4 }
				step={ 1 }
			/>
			<ToggleControl
				label={ __( 'Card Shadow', 'b-blocks' ) }
				checked={ !! cardShadow }
				onChange={ ( val ) => setAttributes( { cardShadow: val } ) }
			/>

			<ColorControl
				label={ __( 'Category Badge Background:', 'b-blocks' ) }
				value={ categoryBadgeBg }
				onChange={ ( val ) => setAttributes( { categoryBadgeBg: val } ) }
			/>
			<ColorControl
				label={ __( 'Category Badge Text:', 'b-blocks' ) }
				value={ categoryBadgeColor }
				onChange={ ( val ) => setAttributes( { categoryBadgeColor: val } ) }
			/>

			<ColorControl
				label={ __( 'Title Color:', 'b-blocks' ) }
				value={ titleColor }
				onChange={ ( val ) => setAttributes( { titleColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Title Font Size — Desktop (px)', 'b-blocks' ) }
				value={ titleFontSize?.desktop }
				onChange={ ( val ) => setTitleFontSize( 'desktop', val ) }
				min={ 12 }
				max={ 40 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Title Font Size — Tablet (px)', 'b-blocks' ) }
				value={ titleFontSize?.tablet }
				onChange={ ( val ) => setTitleFontSize( 'tablet', val ) }
				min={ 12 }
				max={ 40 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Title Font Size — Mobile (px)', 'b-blocks' ) }
				value={ titleFontSize?.mobile }
				onChange={ ( val ) => setTitleFontSize( 'mobile', val ) }
				min={ 12 }
				max={ 40 }
				step={ 1 }
			/>

			<ColorControl
				label={ __( 'Excerpt Color:', 'b-blocks' ) }
				value={ excerptColor }
				onChange={ ( val ) => setAttributes( { excerptColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Excerpt Font Size (px)', 'b-blocks' ) }
				value={ excerptFontSize }
				onChange={ ( val ) => setAttributes( { excerptFontSize: val } ) }
				min={ 11 }
				max={ 24 }
				step={ 1 }
			/>

			<ColorControl
				label={ __( 'Meta Color:', 'b-blocks' ) }
				value={ metaColor }
				onChange={ ( val ) => setAttributes( { metaColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Meta Font Size (px)', 'b-blocks' ) }
				value={ metaFontSize }
				onChange={ ( val ) => setAttributes( { metaFontSize: val } ) }
				min={ 10 }
				max={ 20 }
				step={ 1 }
			/>

			<ColorControl
				label={ __( 'Read More Background:', 'b-blocks' ) }
				value={ readMoreBg }
				onChange={ ( val ) => setAttributes( { readMoreBg: val } ) }
			/>
			<ColorControl
				label={ __( 'Read More Text:', 'b-blocks' ) }
				value={ readMoreColor }
				onChange={ ( val ) => setAttributes( { readMoreColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Read More Border Radius (px)', 'b-blocks' ) }
				value={ readMoreBorderRadius }
				onChange={ ( val ) => setAttributes( { readMoreBorderRadius: val } ) }
				min={ 0 }
				max={ 50 }
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
				label={ __( 'Arrow Button Border Radius (%)', 'b-blocks' ) }
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
	</InspectorControls>;
};

export default Settings;

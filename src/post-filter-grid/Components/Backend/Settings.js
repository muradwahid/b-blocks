import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import {
	orderByOptions, orderOptions, layoutOptions, cardStyleOptions,
	cardShadowOptions, aspectRatioOptions, titleTagOptions
} from '../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		postType, postsPerPage, defaultCategory, orderBy, order, excludeCurrentPost,
		showFilterBar, filterTaxonomy, showAllButton, allButtonLabel,
		layout, columns, columnGap, rowGap,
		cardStyle, cardRadius, cardBackground, cardBorderColor, cardShadow,
		showFeaturedImage, imageRatio, imageRadius,
		showCategory, showTitle, titleTag, titleLines,
		showExcerpt, excerptLength, showMeta, showAuthor, showDate,
		showReadMore, readMoreLabel, showLoadMore, loadMoreLabel, noPostsMessage,
		accentColor, accentTextColor, titleColor, excerptColor, metaColor, titleFontSize
	} = attributes;

	const [ postTypeOptions, setPostTypeOptions ] = useState( [
		{ label: __( 'Post', 'b-blocks' ), value: 'post' }
	] );
	const [ taxonomyOptions, setTaxonomyOptions ] = useState( [
		{ label: __( 'Categories', 'b-blocks' ), value: 'category' }
	] );
	const [ termOptions, setTermOptions ] = useState( [
		{ label: __( 'All', 'b-blocks' ), value: 0 }
	] );

	// Load public post types.
	useEffect( () => {
		apiFetch( { path: '/wp/v2/types' } ).then( ( types ) => {
			const opts = Object.values( types || {} )
				.filter( ( t ) => t.viewable && t.slug !== 'attachment' )
				.map( ( t ) => ( { label: t.name, value: t.slug } ) );
			if ( opts.length ) setPostTypeOptions( opts );
		} ).catch( () => {} );
	}, [] );

	// Load taxonomies registered for the chosen post type.
	useEffect( () => {
		apiFetch( { path: addQueryArgs( '/wp/v2/taxonomies', { type: postType } ) } )
			.then( ( taxes ) => {
				const opts = Object.values( taxes || {} )
					.filter( ( t ) => t.visibility?.publicly_queryable !== false )
					.map( ( t ) => ( { label: t.name, value: t.slug } ) );
				if ( opts.length ) setTaxonomyOptions( opts );
			} )
			.catch( () => {} );
	}, [ postType ] );

	// Load terms for the chosen filter taxonomy to populate the default-category select.
	useEffect( () => {
		apiFetch( { path: addQueryArgs( '/wp/v2/taxonomies/' + filterTaxonomy ) } )
			.then( ( tax ) => {
				const restBase = tax?.rest_base || filterTaxonomy;
				return apiFetch( { path: addQueryArgs( '/wp/v2/' + restBase, { per_page: 100, _fields: 'id,name' } ) } );
			} )
			.then( ( terms ) => {
				const opts = [ { label: __( 'All', 'b-blocks' ), value: 0 } ];
				( Array.isArray( terms ) ? terms : [] ).forEach( ( t ) => {
					opts.push( { label: t.name, value: t.id } );
				} );
				setTermOptions( opts );
			} )
			.catch( () => {
				setTermOptions( [ { label: __( 'All', 'b-blocks' ), value: 0 } ] );
			} );
	}, [ filterTaxonomy ] );

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
				<Label className=''>{ __( 'Post Type:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ postType }
					options={ postTypeOptions }
					onChange={ ( val ) => setAttributes( { postType: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Posts Per Page', 'b-blocks' ) }
				value={ postsPerPage }
				onChange={ ( val ) => setAttributes( { postsPerPage: val } ) }
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

			<PanelRow>
				<Label className=''>{ __( 'Default Category:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ defaultCategory }
					options={ termOptions }
					onChange={ ( val ) => setAttributes( { defaultCategory: parseInt( val, 10 ) || 0 } ) }
				/>
			</PanelRow>

			<ToggleControl
				label={ __( 'Exclude Current Post', 'b-blocks' ) }
				checked={ !! excludeCurrentPost }
				onChange={ ( val ) => setAttributes( { excludeCurrentPost: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Filter Bar', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Filter Bar', 'b-blocks' ) }
				checked={ !! showFilterBar }
				onChange={ ( val ) => setAttributes( { showFilterBar: val } ) }
			/>

			{ showFilterBar && <>
				<PanelRow>
					<Label className=''>{ __( 'Filter Taxonomy:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ filterTaxonomy }
						options={ taxonomyOptions }
						onChange={ ( val ) => setAttributes( { filterTaxonomy: val, defaultCategory: 0 } ) }
					/>
				</PanelRow>

				<ToggleControl
					label={ __( 'Show "All" Button', 'b-blocks' ) }
					checked={ !! showAllButton }
					onChange={ ( val ) => setAttributes( { showAllButton: val } ) }
				/>

				{ showAllButton && (
					<TextControl
						label={ __( '"All" Button Label', 'b-blocks' ) }
						value={ allButtonLabel }
						onChange={ ( val ) => setAttributes( { allButtonLabel: val } ) }
						__nextHasNoMarginBottom
					/>
				) }
			</> }
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
				max={ 80 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Row Gap (px)', 'b-blocks' ) }
				value={ rowGap }
				onChange={ ( val ) => setAttributes( { rowGap: val } ) }
				min={ 0 }
				max={ 80 }
				step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Card Style', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Card Style:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ cardStyle }
					options={ cardStyleOptions }
					onChange={ ( val ) => setAttributes( { cardStyle: val } ) }
				/>
			</PanelRow>

			<ColorControl
				label={ __( 'Card Background:', 'b-blocks' ) }
				value={ cardBackground }
				onChange={ ( val ) => setAttributes( { cardBackground: val } ) }
			/>

			{ 'boxed' === cardStyle && (
				<ColorControl
					label={ __( 'Border Color:', 'b-blocks' ) }
					value={ cardBorderColor }
					onChange={ ( val ) => setAttributes( { cardBorderColor: val } ) }
				/>
			) }

			<PanelRow>
				<Label className=''>{ __( 'Box Shadow:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ cardShadow }
					options={ cardShadowOptions }
					onChange={ ( val ) => setAttributes( { cardShadow: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Border Radius (px)', 'b-blocks' ) }
				value={ cardRadius }
				onChange={ ( val ) => setAttributes( { cardRadius: val } ) }
				min={ 0 }
				max={ 32 }
				step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Featured Image', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Featured Image', 'b-blocks' ) }
				checked={ !! showFeaturedImage }
				onChange={ ( val ) => setAttributes( { showFeaturedImage: val } ) }
			/>

			{ showFeaturedImage && <>
				<PanelRow>
					<Label className=''>{ __( 'Image Aspect Ratio:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ imageRatio }
						options={ aspectRatioOptions }
						onChange={ ( val ) => setAttributes( { imageRatio: val } ) }
					/>
				</PanelRow>
				<RangeControl
					label={ __( 'Image Border Radius (px)', 'b-blocks' ) }
					value={ imageRadius }
					onChange={ ( val ) => setAttributes( { imageRadius: val } ) }
					min={ 0 }
					max={ 32 }
					step={ 1 }
				/>
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Category Label', 'b-blocks' ) }
				checked={ !! showCategory }
				onChange={ ( val ) => setAttributes( { showCategory: val } ) }
			/>

			<ToggleControl
				label={ __( 'Show Title', 'b-blocks' ) }
				checked={ !! showTitle }
				onChange={ ( val ) => setAttributes( { showTitle: val } ) }
			/>

			{ showTitle && <>
				<PanelRow>
					<Label className=''>{ __( 'Title Tag:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ titleTag }
						options={ titleTagOptions }
						onChange={ ( val ) => setAttributes( { titleTag: val } ) }
					/>
				</PanelRow>
				<RangeControl
					label={ __( 'Title Lines Clamp (0 = unlimited)', 'b-blocks' ) }
					value={ titleLines }
					onChange={ ( val ) => setAttributes( { titleLines: val } ) }
					min={ 0 }
					max={ 4 }
					step={ 1 }
				/>
			</> }

			<ToggleControl
				label={ __( 'Show Excerpt', 'b-blocks' ) }
				checked={ !! showExcerpt }
				onChange={ ( val ) => setAttributes( { showExcerpt: val } ) }
			/>

			{ showExcerpt && (
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
				checked={ !! showMeta }
				onChange={ ( val ) => setAttributes( { showMeta: val } ) }
			/>

			{ showMeta && <>
				<ToggleControl
					label={ __( 'Show Author', 'b-blocks' ) }
					checked={ !! showAuthor }
					onChange={ ( val ) => setAttributes( { showAuthor: val } ) }
				/>
				<ToggleControl
					label={ __( 'Show Date', 'b-blocks' ) }
					checked={ !! showDate }
					onChange={ ( val ) => setAttributes( { showDate: val } ) }
				/>
			</> }

			<ToggleControl
				label={ __( 'Show Read More', 'b-blocks' ) }
				checked={ !! showReadMore }
				onChange={ ( val ) => setAttributes( { showReadMore: val } ) }
			/>

			{ showReadMore && (
				<TextControl
					label={ __( 'Read More Label', 'b-blocks' ) }
					value={ readMoreLabel }
					onChange={ ( val ) => setAttributes( { readMoreLabel: val } ) }
					__nextHasNoMarginBottom
				/>
			) }

			<TextControl
				label={ __( 'No Posts Message', 'b-blocks' ) }
				value={ noPostsMessage }
				onChange={ ( val ) => setAttributes( { noPostsMessage: val } ) }
				__nextHasNoMarginBottom
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Load More', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Enable Load More', 'b-blocks' ) }
				checked={ !! showLoadMore }
				onChange={ ( val ) => setAttributes( { showLoadMore: val } ) }
			/>

			{ showLoadMore && (
				<TextControl
					label={ __( 'Load More Label', 'b-blocks' ) }
					value={ loadMoreLabel }
					onChange={ ( val ) => setAttributes( { loadMoreLabel: val } ) }
					__nextHasNoMarginBottom
				/>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Colors', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Accent Color:', 'b-blocks' ) }
				value={ accentColor }
				onChange={ ( val ) => setAttributes( { accentColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Accent Text Color:', 'b-blocks' ) }
				value={ accentTextColor }
				onChange={ ( val ) => setAttributes( { accentTextColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Title Color:', 'b-blocks' ) }
				value={ titleColor }
				onChange={ ( val ) => setAttributes( { titleColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Excerpt Color:', 'b-blocks' ) }
				value={ excerptColor }
				onChange={ ( val ) => setAttributes( { excerptColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Meta Color:', 'b-blocks' ) }
				value={ metaColor }
				onChange={ ( val ) => setAttributes( { metaColor: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Typography', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Title Font Size — Desktop (px)', 'b-blocks' ) }
				value={ fontSizeNumber( titleFontSize?.desktop, 18 ) }
				onChange={ ( val ) => setTitleFontSize( 'desktop', val ) }
				min={ 12 }
				max={ 48 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Title Font Size — Tablet (px)', 'b-blocks' ) }
				value={ fontSizeNumber( titleFontSize?.tablet, 17 ) }
				onChange={ ( val ) => setTitleFontSize( 'tablet', val ) }
				min={ 12 }
				max={ 40 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Title Font Size — Mobile (px)', 'b-blocks' ) }
				value={ fontSizeNumber( titleFontSize?.mobile, 16 ) }
				onChange={ ( val ) => setTitleFontSize( 'mobile', val ) }
				min={ 12 }
				max={ 36 }
				step={ 1 }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

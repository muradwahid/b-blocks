import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl, Notice } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import {
	orderByOptions, orderOptions, cardStyleOptions, imageRatioOptions,
	imageSizeOptions, cardShadowOptions, fontWeightOptions, alignmentOptions
} from '../../utils/data';

const idListToString = ( arr ) => ( Array.isArray( arr ) ? arr.join( ', ' ) : '' );
const stringToIdList = ( str ) => String( str || '' )
	.split( ',' )
	.map( ( part ) => parseInt( part.trim(), 10 ) )
	.filter( ( n ) => Number.isInteger( n ) && n > 0 );

const Settings = ( { attributes, setAttributes } ) => {
	const {
		postType, postsPerPage, orderBy, order, categoryIds, tagIds, excludeIds,
		filterEnabled, filterLabel, filterBarAlignment, filterBarGap,
		filterActiveBg, filterActiveText, filterInactiveBg, filterInactiveText, filterPillRadius,
		loadMoreEnabled, loadMoreLabel, loadMoreStep, loadMoreBg, loadMoreText, loadMoreRadius,
		cardStyle, colsDesktop, colsTablet, colsMobile, gap, maxWidth, align,
		imageRatio, imageSize, showExcerpt, excerptLength, showDate, showAuthor,
		showCategory, showReadMore, readMoreLabel, noPostsText,
		cardBg, cardRadius, cardShadow, accentColor, overlayColor,
		titleColor, titleFontSize, titleFontWeight, metaColor, metaFontSize,
		excerptColor, excerptFontSize
	} = attributes;

	const [ postTypeOptions, setPostTypeOptions ] = useState( [
		{ label: __( 'Post', 'b-blocks' ), value: 'post' }
	] );

	const isTextOnly = 'text-only' === cardStyle;
	const isOverlay = 'image-overlay' === cardStyle;

	// Load public post types.
	useEffect( () => {
		apiFetch( { path: '/wp/v2/types' } ).then( ( types ) => {
			const opts = Object.values( types || {} )
				.filter( ( t ) => t.viewable && t.slug !== 'attachment' )
				.map( ( t ) => ( { label: t.name, value: t.slug } ) );
			if ( opts.length ) setPostTypeOptions( opts );
		} ).catch( () => {} );
	}, [] );

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

			<TextControl
				label={ __( 'Include Categories', 'b-blocks' ) }
				help={ __( 'Comma-separated category IDs. Leave blank for all.', 'b-blocks' ) }
				value={ idListToString( categoryIds ) }
				onChange={ ( val ) => setAttributes( { categoryIds: stringToIdList( val ) } ) }
				__nextHasNoMarginBottom
			/>

			<TextControl
				label={ __( 'Include Tags', 'b-blocks' ) }
				help={ __( 'Comma-separated tag IDs. Leave blank for all.', 'b-blocks' ) }
				value={ idListToString( tagIds ) }
				onChange={ ( val ) => setAttributes( { tagIds: stringToIdList( val ) } ) }
				__nextHasNoMarginBottom
			/>

			<TextControl
				label={ __( 'Exclude Post IDs', 'b-blocks' ) }
				help={ __( 'Comma-separated post IDs to exclude.', 'b-blocks' ) }
				value={ excludeIds }
				onChange={ ( val ) => setAttributes( { excludeIds: val } ) }
				__nextHasNoMarginBottom
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Filter Bar', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Enable Category Filter', 'b-blocks' ) }
				checked={ !! filterEnabled }
				onChange={ ( val ) => setAttributes( { filterEnabled: val } ) }
			/>

			{ filterEnabled && <>
				<TextControl
					label={ __( '"All" Label', 'b-blocks' ) }
					value={ filterLabel }
					onChange={ ( val ) => setAttributes( { filterLabel: val } ) }
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{ __( 'Bar Alignment:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ filterBarAlignment }
						options={ alignmentOptions }
						onChange={ ( val ) => setAttributes( { filterBarAlignment: val } ) }
					/>
				</PanelRow>

				<RangeControl
					label={ __( 'Gap Between Pills (px)', 'b-blocks' ) }
					value={ filterBarGap }
					onChange={ ( val ) => setAttributes( { filterBarGap: val } ) }
					min={ 0 }
					max={ 32 }
					step={ 1 }
				/>

				<ColorControl
					label={ __( 'Active Pill Background:', 'b-blocks' ) }
					value={ filterActiveBg }
					onChange={ ( val ) => setAttributes( { filterActiveBg: val } ) }
				/>
				<ColorControl
					label={ __( 'Active Pill Text:', 'b-blocks' ) }
					value={ filterActiveText }
					onChange={ ( val ) => setAttributes( { filterActiveText: val } ) }
				/>
				<ColorControl
					label={ __( 'Inactive Pill Background:', 'b-blocks' ) }
					value={ filterInactiveBg }
					onChange={ ( val ) => setAttributes( { filterInactiveBg: val } ) }
				/>
				<ColorControl
					label={ __( 'Inactive Pill Text:', 'b-blocks' ) }
					value={ filterInactiveText }
					onChange={ ( val ) => setAttributes( { filterInactiveText: val } ) }
				/>

				<RangeControl
					label={ __( 'Pill Border Radius (px)', 'b-blocks' ) }
					value={ filterPillRadius }
					onChange={ ( val ) => setAttributes( { filterPillRadius: val } ) }
					min={ 0 }
					max={ 9999 }
					step={ 1 }
				/>
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Card Style:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ cardStyle }
					options={ cardStyleOptions }
					onChange={ ( val ) => setAttributes( { cardStyle: val } ) }
				/>
			</PanelRow>

			{ isTextOnly && (
				<Notice status='info' isDismissible={ false }>
					{ __( 'Text Only cards hide the featured image and its controls.', 'b-blocks' ) }
				</Notice>
			) }

			<RangeControl
				label={ __( 'Columns — Desktop', 'b-blocks' ) }
				value={ colsDesktop }
				onChange={ ( val ) => setAttributes( { colsDesktop: val } ) }
				min={ 1 }
				max={ 5 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Columns — Tablet', 'b-blocks' ) }
				value={ colsTablet }
				onChange={ ( val ) => setAttributes( { colsTablet: val } ) }
				min={ 1 }
				max={ 4 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Columns — Mobile', 'b-blocks' ) }
				value={ colsMobile }
				onChange={ ( val ) => setAttributes( { colsMobile: val } ) }
				min={ 1 }
				max={ 2 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Gap (px)', 'b-blocks' ) }
				value={ gap }
				onChange={ ( val ) => setAttributes( { gap: val } ) }
				min={ 0 }
				max={ 80 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Max Width (px, 0 = full)', 'b-blocks' ) }
				value={ maxWidth }
				onChange={ ( val ) => setAttributes( { maxWidth: val } ) }
				min={ 0 }
				max={ 1600 }
				step={ 10 }
			/>

			{ maxWidth > 0 && (
				<PanelRow>
					<Label className=''>{ __( 'Alignment:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ align }
						options={ alignmentOptions }
						onChange={ ( val ) => setAttributes( { align: val } ) }
					/>
				</PanelRow>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Card Content', 'b-blocks' ) } initialOpen={ false }>
			{ ! isTextOnly && <>
				<PanelRow>
					<Label className=''>{ __( 'Image Ratio:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ imageRatio }
						options={ imageRatioOptions }
						onChange={ ( val ) => setAttributes( { imageRatio: val } ) }
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{ __( 'Image Size:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ imageSize }
						options={ imageSizeOptions }
						onChange={ ( val ) => setAttributes( { imageSize: val } ) }
					/>
				</PanelRow>
			</> }

			<ToggleControl
				label={ __( 'Show Excerpt', 'b-blocks' ) }
				checked={ !! showExcerpt }
				onChange={ ( val ) => setAttributes( { showExcerpt: val } ) }
			/>

			{ showExcerpt && (
				<RangeControl
					label={ __( 'Excerpt Word Count', 'b-blocks' ) }
					value={ excerptLength }
					onChange={ ( val ) => setAttributes( { excerptLength: val } ) }
					min={ 5 }
					max={ 60 }
					step={ 1 }
				/>
			) }

			<ToggleControl
				label={ __( 'Show Date', 'b-blocks' ) }
				checked={ !! showDate }
				onChange={ ( val ) => setAttributes( { showDate: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show Author', 'b-blocks' ) }
				checked={ !! showAuthor }
				onChange={ ( val ) => setAttributes( { showAuthor: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show Category Badge', 'b-blocks' ) }
				checked={ !! showCategory }
				onChange={ ( val ) => setAttributes( { showCategory: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show Read More', 'b-blocks' ) }
				checked={ !! showReadMore }
				onChange={ ( val ) => setAttributes( { showReadMore: val } ) }
			/>

			{ showReadMore && ! isOverlay && (
				<TextControl
					label={ __( 'Read More Label', 'b-blocks' ) }
					value={ readMoreLabel }
					onChange={ ( val ) => setAttributes( { readMoreLabel: val } ) }
					__nextHasNoMarginBottom
				/>
			) }

			<TextControl
				label={ __( 'No Posts Message', 'b-blocks' ) }
				value={ noPostsText }
				onChange={ ( val ) => setAttributes( { noPostsText: val } ) }
				__nextHasNoMarginBottom
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Accent Color:', 'b-blocks' ) }
				value={ accentColor }
				onChange={ ( val ) => setAttributes( { accentColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Card Background:', 'b-blocks' ) }
				value={ cardBg }
				onChange={ ( val ) => setAttributes( { cardBg: val } ) }
			/>

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

			{ isOverlay && (
				<ColorControl
					label={ __( 'Image Overlay Color:', 'b-blocks' ) }
					value={ overlayColor }
					onChange={ ( val ) => setAttributes( { overlayColor: val } ) }
				/>
			) }

			<ColorControl
				label={ __( 'Title Color:', 'b-blocks' ) }
				value={ titleColor }
				onChange={ ( val ) => setAttributes( { titleColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Title Font Size (px)', 'b-blocks' ) }
				value={ titleFontSize }
				onChange={ ( val ) => setAttributes( { titleFontSize: val } ) }
				min={ 12 }
				max={ 40 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Title Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ titleFontWeight }
					options={ fontWeightOptions }
					onChange={ ( val ) => setAttributes( { titleFontWeight: val } ) }
				/>
			</PanelRow>

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
				label={ __( 'Excerpt Color:', 'b-blocks' ) }
				value={ excerptColor }
				onChange={ ( val ) => setAttributes( { excerptColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Excerpt Font Size (px)', 'b-blocks' ) }
				value={ excerptFontSize }
				onChange={ ( val ) => setAttributes( { excerptFontSize: val } ) }
				min={ 10 }
				max={ 22 }
				step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Load More', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Enable Load More', 'b-blocks' ) }
				checked={ !! loadMoreEnabled }
				onChange={ ( val ) => setAttributes( { loadMoreEnabled: val } ) }
			/>

			{ loadMoreEnabled && <>
				<TextControl
					label={ __( 'Load More Label', 'b-blocks' ) }
					value={ loadMoreLabel }
					onChange={ ( val ) => setAttributes( { loadMoreLabel: val } ) }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Posts Per Click', 'b-blocks' ) }
					value={ loadMoreStep }
					onChange={ ( val ) => setAttributes( { loadMoreStep: val } ) }
					min={ 1 }
					max={ 24 }
					step={ 1 }
				/>
				<ColorControl
					label={ __( 'Button Background:', 'b-blocks' ) }
					value={ loadMoreBg }
					onChange={ ( val ) => setAttributes( { loadMoreBg: val } ) }
				/>
				<ColorControl
					label={ __( 'Button Text:', 'b-blocks' ) }
					value={ loadMoreText }
					onChange={ ( val ) => setAttributes( { loadMoreText: val } ) }
				/>
				<RangeControl
					label={ __( 'Button Border Radius (px)', 'b-blocks' ) }
					value={ loadMoreRadius }
					onChange={ ( val ) => setAttributes( { loadMoreRadius: val } ) }
					min={ 0 }
					max={ 50 }
					step={ 1 }
				/>
			</> }
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

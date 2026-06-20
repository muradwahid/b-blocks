import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl, FormTokenField } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import {
	orderByOptions, orderOptions, imageSizeOptions, aspectRatioOptions,
	layoutOptions, dateFormatOptions, titleWeightOptions
} from '../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		postCount, postType, categoryIds, tagIds, orderBy, order,
		showFeaturedImage, imageSize, imageAspectRatio,
		showExcerpt, excerptLength, showReadMore, readMoreLabel,
		showDate, dateFormat, showCategory, showAuthor, noPostsMessage,
		layout, maxWidth, cardPadding, cardBorderRadius, cardShadow,
		lineColor, lineWidth, dotSize, dotColor,
		dateBadgeBg, dateBadgeColor, cardBg, titleColor, metaColor, excerptColor,
		titleSize, titleWeight, metaSize, excerptSize
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

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Query Settings', 'b-blocks' ) }>
			<RangeControl
				label={ __( 'Post Count', 'b-blocks' ) }
				value={ postCount }
				onChange={ ( val ) => setAttributes( { postCount: val } ) }
				min={ 1 }
				max={ 20 }
				step={ 1 }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Post Type:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ postType }
					options={ postTypeOptions }
					onChange={ ( val ) => setAttributes( { postType: val } ) }
				/>
			</PanelRow>

			<FormTokenField
				label={ __( 'Categories (leave empty for all)', 'b-blocks' ) }
				value={ termsToTokens( categoryIds, categories ) }
				suggestions={ categories.map( ( t ) => t.name ) }
				onChange={ ( tokens ) => setAttributes( { categoryIds: tokensToIds( tokens, categories ) } ) }
				__experimentalExpandOnFocus
			/>

			<FormTokenField
				label={ __( 'Tags (leave empty for all)', 'b-blocks' ) }
				value={ termsToTokens( tagIds, tags ) }
				suggestions={ tags.map( ( t ) => t.name ) }
				onChange={ ( tokens ) => setAttributes( { tagIds: tokensToIds( tokens, tags ) } ) }
				__experimentalExpandOnFocus
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
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Content Options', 'b-blocks' ) }>
			<ToggleControl
				label={ __( 'Show Featured Image', 'b-blocks' ) }
				checked={ !! showFeaturedImage }
				onChange={ ( val ) => setAttributes( { showFeaturedImage: val } ) }
			/>

			{ showFeaturedImage && <>
				<PanelRow>
					<Label className=''>{ __( 'Image Size:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ imageSize }
						options={ imageSizeOptions }
						onChange={ ( val ) => setAttributes( { imageSize: val } ) }
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{ __( 'Image Aspect Ratio:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ imageAspectRatio }
						options={ aspectRatioOptions }
						onChange={ ( val ) => setAttributes( { imageAspectRatio: val } ) }
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
					label={ __( 'Excerpt Length (words)', 'b-blocks' ) }
					value={ excerptLength }
					onChange={ ( val ) => setAttributes( { excerptLength: val } ) }
					min={ 10 }
					max={ 60 }
					step={ 1 }
				/>
			) }

			<ToggleControl
				label={ __( 'Show Read More Link', 'b-blocks' ) }
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

			<ToggleControl
				label={ __( 'Show Date', 'b-blocks' ) }
				checked={ !! showDate }
				onChange={ ( val ) => setAttributes( { showDate: val } ) }
			/>

			{ showDate && (
				<PanelRow>
					<Label className=''>{ __( 'Date Format:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ dateFormat }
						options={ dateFormatOptions }
						onChange={ ( val ) => setAttributes( { dateFormat: val } ) }
					/>
				</PanelRow>
			) }

			<ToggleControl
				label={ __( 'Show Category', 'b-blocks' ) }
				checked={ !! showCategory }
				onChange={ ( val ) => setAttributes( { showCategory: val } ) }
			/>

			<ToggleControl
				label={ __( 'Show Author', 'b-blocks' ) }
				checked={ !! showAuthor }
				onChange={ ( val ) => setAttributes( { showAuthor: val } ) }
			/>

			<TextControl
				label={ __( '“No Posts” Message', 'b-blocks' ) }
				value={ noPostsMessage }
				onChange={ ( val ) => setAttributes( { noPostsMessage: val } ) }
				__nextHasNoMarginBottom
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) }>
			<PanelRow>
				<Label className=''>{ __( 'Timeline Layout:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ layout }
					options={ layoutOptions }
					onChange={ ( val ) => setAttributes( { layout: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Max Width (px)', 'b-blocks' ) }
				value={ maxWidth }
				onChange={ ( val ) => setAttributes( { maxWidth: val } ) }
				min={ 400 }
				max={ 1400 }
				step={ 10 }
			/>

			<RangeControl
				label={ __( 'Card Padding (px)', 'b-blocks' ) }
				value={ cardPadding }
				onChange={ ( val ) => setAttributes( { cardPadding: val } ) }
				min={ 8 }
				max={ 64 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Card Border Radius (px)', 'b-blocks' ) }
				value={ cardBorderRadius }
				onChange={ ( val ) => setAttributes( { cardBorderRadius: val } ) }
				min={ 0 }
				max={ 32 }
				step={ 1 }
			/>

			<ToggleControl
				label={ __( 'Card Shadow', 'b-blocks' ) }
				checked={ !! cardShadow }
				onChange={ ( val ) => setAttributes( { cardShadow: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Spine & Dot', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Line Color:', 'b-blocks' ) }
				value={ lineColor }
				onChange={ ( val ) => setAttributes( { lineColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Line Width (px)', 'b-blocks' ) }
				value={ lineWidth }
				onChange={ ( val ) => setAttributes( { lineWidth: val } ) }
				min={ 1 }
				max={ 8 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Dot Size (px)', 'b-blocks' ) }
				value={ dotSize }
				onChange={ ( val ) => setAttributes( { dotSize: val } ) }
				min={ 8 }
				max={ 32 }
				step={ 1 }
			/>
			<ColorControl
				label={ __( 'Dot Color:', 'b-blocks' ) }
				value={ dotColor }
				onChange={ ( val ) => setAttributes( { dotColor: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Colors', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Date Badge Background:', 'b-blocks' ) }
				value={ dateBadgeBg }
				onChange={ ( val ) => setAttributes( { dateBadgeBg: val } ) }
			/>
			<ColorControl
				label={ __( 'Date Badge Text:', 'b-blocks' ) }
				value={ dateBadgeColor }
				onChange={ ( val ) => setAttributes( { dateBadgeColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Card Background:', 'b-blocks' ) }
				value={ cardBg }
				onChange={ ( val ) => setAttributes( { cardBg: val } ) }
			/>
			<ColorControl
				label={ __( 'Title Color:', 'b-blocks' ) }
				value={ titleColor }
				onChange={ ( val ) => setAttributes( { titleColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Meta Color:', 'b-blocks' ) }
				value={ metaColor }
				onChange={ ( val ) => setAttributes( { metaColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Excerpt Color:', 'b-blocks' ) }
				value={ excerptColor }
				onChange={ ( val ) => setAttributes( { excerptColor: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Typography', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Title Font Size (px)', 'b-blocks' ) }
				value={ titleSize }
				onChange={ ( val ) => setAttributes( { titleSize: val } ) }
				min={ 12 }
				max={ 40 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Title Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ titleWeight }
					options={ titleWeightOptions }
					onChange={ ( val ) => setAttributes( { titleWeight: val } ) }
				/>
			</PanelRow>
			<RangeControl
				label={ __( 'Meta Font Size (px)', 'b-blocks' ) }
				value={ metaSize }
				onChange={ ( val ) => setAttributes( { metaSize: val } ) }
				min={ 10 }
				max={ 20 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Excerpt Font Size (px)', 'b-blocks' ) }
				value={ excerptSize }
				onChange={ ( val ) => setAttributes( { excerptSize: val } ) }
				min={ 12 }
				max={ 20 }
				step={ 1 }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

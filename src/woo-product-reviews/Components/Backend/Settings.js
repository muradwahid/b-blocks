import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import { orderByOptions, blockAlignOptions } from '../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		productId, reviewCount, orderBy, showSummary, showAvatar, showDate,
		showVerifiedBadge, noReviewsMessage, noProductMessage, avatarSize,
		ratingColor, ratingEmptyColor, summaryBG, summaryTextColor,
		summaryAccentColor, reviewBG, reviewTextColor, reviewNameColor,
		reviewMetaColor, cardBorderWidth, cardBorderColor, cardRadius,
		cardPadding, cardGap, verifiedBadgeBG, verifiedBadgeColor, maxWidth,
		blockAlign, nameFontSize, bodyFontSize, metaFontSize, summaryRatingFontSize
	} = attributes;

	const [ product, setProduct ] = useState( null );
	const [ fetchError, setFetchError ] = useState( false );

	// Resolve the selected product for an editor preview chip.
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

	const responsiveFontControls = ( attr, current, defaults ) => <>
		<RangeControl
			label={ __( 'Font Size — Desktop (px)', 'b-blocks' ) }
			value={ fontSizeNumber( current?.desktop, defaults.desktop ) }
			onChange={ ( val ) => setFontSize( attr, current, 'desktop', val ) }
			min={ 10 }
			max={ 80 }
			step={ 1 }
		/>
		<RangeControl
			label={ __( 'Font Size — Tablet (px)', 'b-blocks' ) }
			value={ fontSizeNumber( current?.tablet, defaults.tablet ) }
			onChange={ ( val ) => setFontSize( attr, current, 'tablet', val ) }
			min={ 10 }
			max={ 72 }
			step={ 1 }
		/>
		<RangeControl
			label={ __( 'Font Size — Mobile (px)', 'b-blocks' ) }
			value={ fontSizeNumber( current?.mobile, defaults.mobile ) }
			onChange={ ( val ) => setFontSize( attr, current, 'mobile', val ) }
			min={ 10 }
			max={ 64 }
			step={ 1 }
		/>
	</>;

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Product', 'b-blocks' ) }>
			<TextControl
				label={ __( 'Product ID', 'b-blocks' ) }
				type='number'
				min={ 0 }
				value={ productId || 0 }
				onChange={ ( val ) => setAttributes( { productId: parseInt( val, 10 ) || 0 } ) }
				help={ __( 'Enter the numeric ID of the WooCommerce product whose reviews you want to show.', 'b-blocks' ) }
				__nextHasNoMarginBottom
			/>

			{ product && (
				<div className='bb-wpr-product-preview'>
					{ previewImage && <img src={ previewImage } alt='' /> }
					<span className='bb-wpr-product-preview-name'>{ product.name }</span>
				</div>
			) }

			{ fetchError && !! productId && (
				<p className='bb-wpr-product-preview-error'>
					{ __( 'No product found for this ID.', 'b-blocks' ) }
				</p>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Reviews', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Number of Reviews', 'b-blocks' ) }
				value={ reviewCount }
				onChange={ ( val ) => setAttributes( { reviewCount: val } ) }
				min={ 1 }
				max={ 50 }
				step={ 1 }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Sort Order:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ orderBy }
					options={ orderByOptions }
					onChange={ ( val ) => setAttributes( { orderBy: val } ) }
				/>
			</PanelRow>

			<ToggleControl
				label={ __( 'Show Summary Bar', 'b-blocks' ) }
				checked={ !! showSummary }
				onChange={ ( val ) => setAttributes( { showSummary: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show Avatars', 'b-blocks' ) }
				checked={ !! showAvatar }
				onChange={ ( val ) => setAttributes( { showAvatar: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show Review Date', 'b-blocks' ) }
				checked={ !! showDate }
				onChange={ ( val ) => setAttributes( { showDate: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show "Verified Owner" Badge', 'b-blocks' ) }
				checked={ !! showVerifiedBadge }
				onChange={ ( val ) => setAttributes( { showVerifiedBadge: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Max Width (px, 0 = full width)', 'b-blocks' ) }
				value={ maxWidth }
				onChange={ ( val ) => setAttributes( { maxWidth: val } ) }
				min={ 0 }
				max={ 1600 }
				step={ 8 }
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

			{ showAvatar && (
				<RangeControl
					label={ __( 'Avatar Size (px)', 'b-blocks' ) }
					value={ avatarSize }
					onChange={ ( val ) => setAttributes( { avatarSize: val } ) }
					min={ 24 }
					max={ 96 }
					step={ 4 }
				/>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Colors', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Star Color (filled):', 'b-blocks' ) }
				value={ ratingColor }
				onChange={ ( val ) => setAttributes( { ratingColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Star Color (empty):', 'b-blocks' ) }
				value={ ratingEmptyColor }
				onChange={ ( val ) => setAttributes( { ratingEmptyColor: val } ) }
			/>
			{ showSummary && <>
				<ColorControl
					label={ __( 'Summary Background:', 'b-blocks' ) }
					value={ summaryBG }
					onChange={ ( val ) => setAttributes( { summaryBG: val } ) }
				/>
				<ColorControl
					label={ __( 'Summary Text Color:', 'b-blocks' ) }
					value={ summaryTextColor }
					onChange={ ( val ) => setAttributes( { summaryTextColor: val } ) }
				/>
				<ColorControl
					label={ __( 'Summary Accent:', 'b-blocks' ) }
					value={ summaryAccentColor }
					onChange={ ( val ) => setAttributes( { summaryAccentColor: val } ) }
				/>
			</> }
			<ColorControl
				label={ __( 'Review Card Background:', 'b-blocks' ) }
				value={ reviewBG }
				onChange={ ( val ) => setAttributes( { reviewBG: val } ) }
			/>
			<ColorControl
				label={ __( 'Review Text Color:', 'b-blocks' ) }
				value={ reviewTextColor }
				onChange={ ( val ) => setAttributes( { reviewTextColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Reviewer Name Color:', 'b-blocks' ) }
				value={ reviewNameColor }
				onChange={ ( val ) => setAttributes( { reviewNameColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Meta / Date Color:', 'b-blocks' ) }
				value={ reviewMetaColor }
				onChange={ ( val ) => setAttributes( { reviewMetaColor: val } ) }
			/>
			{ showVerifiedBadge && <>
				<ColorControl
					label={ __( 'Verified Badge Background:', 'b-blocks' ) }
					value={ verifiedBadgeBG }
					onChange={ ( val ) => setAttributes( { verifiedBadgeBG: val } ) }
				/>
				<ColorControl
					label={ __( 'Verified Badge Text Color:', 'b-blocks' ) }
					value={ verifiedBadgeColor }
					onChange={ ( val ) => setAttributes( { verifiedBadgeColor: val } ) }
				/>
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Card Style', 'b-blocks' ) } initialOpen={ false }>
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
				step={ 2 }
			/>
			<RangeControl
				label={ __( 'Padding (px)', 'b-blocks' ) }
				value={ cardPadding }
				onChange={ ( val ) => setAttributes( { cardPadding: val } ) }
				min={ 8 }
				max={ 64 }
				step={ 4 }
			/>
			<RangeControl
				label={ __( 'Gap Between Cards (px)', 'b-blocks' ) }
				value={ cardGap }
				onChange={ ( val ) => setAttributes( { cardGap: val } ) }
				min={ 0 }
				max={ 64 }
				step={ 4 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Typography', 'b-blocks' ) } initialOpen={ false }>
			<Label className=''>{ __( 'Reviewer Name', 'b-blocks' ) }</Label>
			{ responsiveFontControls( 'nameFontSize', nameFontSize, { desktop: 15, tablet: 14, mobile: 14 } ) }
			<Label className=''>{ __( 'Review Body', 'b-blocks' ) }</Label>
			{ responsiveFontControls( 'bodyFontSize', bodyFontSize, { desktop: 15, tablet: 14, mobile: 14 } ) }
			<Label className=''>{ __( 'Date / Meta', 'b-blocks' ) }</Label>
			{ responsiveFontControls( 'metaFontSize', metaFontSize, { desktop: 13, tablet: 12, mobile: 12 } ) }
			{ showSummary && <>
				<Label className=''>{ __( 'Summary Rating Numeral', 'b-blocks' ) }</Label>
				{ responsiveFontControls( 'summaryRatingFontSize', summaryRatingFontSize, { desktop: 48, tablet: 40, mobile: 36 } ) }
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Messages', 'b-blocks' ) } initialOpen={ false }>
			<TextControl
				label={ __( 'No Reviews Message', 'b-blocks' ) }
				value={ noReviewsMessage }
				onChange={ ( val ) => setAttributes( { noReviewsMessage: val } ) }
				__nextHasNoMarginBottom
			/>
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

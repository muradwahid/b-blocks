import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl, Notice } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import {
	orderByOptions, orderOptions, layoutOptions, cardStyleOptions, imageRatioOptions,
	imageSizeOptions, hoverEffectOptions, shadowOptions, alignmentOptions, nameWeightOptions
} from '../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		taxonomy, orderby, order, number, hideEmpty, includeIds, excludeIds,
		layout, columnsDesktop, columnsTablet, columnsMobile, columnGap, rowGap, maxWidth, alignment,
		cardStyle, imageRatio, imageSize, fallbackColor, overlayColor,
		showCount, countLabel, showDescription, descriptionLength, openInNewTab,
		cardBg, cardRadius, cardPaddingV, cardPaddingH, shadowPreset, borderWidth, borderColor,
		hoverEffect, hoverDuration,
		accentColor, nameColor, nameFontSize, nameFontWeight,
		countColor, countBg, countFontSize, descColor, descFontSize
	} = attributes;

	const [ taxonomyOptions, setTaxonomyOptions ] = useState( [
		{ label: __( 'Categories', 'b-blocks' ), value: 'category' },
		{ label: __( 'Tags', 'b-blocks' ), value: 'post_tag' }
	] );

	// Load public taxonomies for the selector.
	useEffect( () => {
		apiFetch( { path: '/wp/v2/taxonomies' } ).then( ( taxonomies ) => {
			const opts = Object.values( taxonomies || {} )
				.filter( ( t ) => t.visibility?.publicly_queryable !== false )
				.map( ( t ) => ( { label: t.name, value: t.slug } ) );
			if ( opts.length ) {
				setTaxonomyOptions( opts );
			}
		} ).catch( () => {} );
	}, [] );

	// Migrate legacy single-string taxonomy to an array.
	useEffect( () => {
		if ( ! Array.isArray( taxonomy ) ) {
			setAttributes( { taxonomy: taxonomy ? [ taxonomy ] : [ 'category' ] } );
		}
	}, [] );

	const showAll = 0 === number;

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Query Settings', 'b-blocks' ) }>
			<PanelRow>
				<Label className=''>{ __( 'Taxonomy:', 'b-blocks' ) }</Label>
				<SelectControl
					multiple
					value={ Array.isArray( taxonomy ) ? taxonomy : [ taxonomy ] }
					options={ taxonomyOptions }
					onChange={ ( val ) => setAttributes( { taxonomy: Array.isArray( val ) ? val : [ val ] } ) }
				/>
			</PanelRow>

			<PanelRow>
				<Label className=''>{ __( 'Order By:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ orderby }
					options={ orderByOptions }
					onChange={ ( val ) => setAttributes( { orderby: val } ) }
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

			<ToggleControl
				label={ __( 'Show all terms', 'b-blocks' ) }
				checked={ showAll }
				onChange={ ( val ) => setAttributes( { number: val ? 0 : 6 } ) }
			/>

			{ ! showAll && (
				<RangeControl
					label={ __( 'Number of Terms', 'b-blocks' ) }
					value={ number }
					onChange={ ( val ) => setAttributes( { number: val } ) }
					min={ 1 }
					max={ 48 }
					step={ 1 }
				/>
			) }

			<ToggleControl
				label={ __( 'Hide Empty Terms', 'b-blocks' ) }
				checked={ hideEmpty }
				onChange={ ( val ) => setAttributes( { hideEmpty: val } ) }
			/>

			<TextControl
				label={ __( 'Include term IDs (comma-separated, leave blank for all)', 'b-blocks' ) }
				value={ includeIds }
				onChange={ ( val ) => setAttributes( { includeIds: val } ) }
				placeholder='e.g. 3, 7, 12'
			/>

			<TextControl
				label={ __( 'Exclude term IDs (comma-separated)', 'b-blocks' ) }
				value={ excludeIds }
				onChange={ ( val ) => setAttributes( { excludeIds: val } ) }
				placeholder='e.g. 1'
			/>
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
				value={ columnsDesktop }
				onChange={ ( val ) => setAttributes( { columnsDesktop: val } ) }
				min={ 1 }
				max={ 6 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Columns — Tablet', 'b-blocks' ) }
				value={ columnsTablet }
				onChange={ ( val ) => setAttributes( { columnsTablet: val } ) }
				min={ 1 }
				max={ 4 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Columns — Mobile', 'b-blocks' ) }
				value={ columnsMobile }
				onChange={ ( val ) => setAttributes( { columnsMobile: val } ) }
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
			<RangeControl
				label={ __( 'Max Width (px, 0 = full width)', 'b-blocks' ) }
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
						value={ alignment }
						options={ alignmentOptions }
						onChange={ ( val ) => setAttributes( { alignment: val } ) }
					/>
				</PanelRow>
			) }
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

			{ 'overlay' === cardStyle && (
				<Notice status='info' isDismissible={ false }>
					{ __( 'For readable name text, keep the overlay color dark enough (WCAG AA needs 4.5:1 contrast against the term image).', 'b-blocks' ) }
				</Notice>
			) }

			{ 'plain' !== cardStyle && (
				<>
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
				</>
			) }

			<PanelRow>
				<Label className=''>{ __( 'Hover Effect:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ hoverEffect }
					options={ hoverEffectOptions }
					onChange={ ( val ) => setAttributes( { hoverEffect: val } ) }
				/>
			</PanelRow>

			{ 'none' !== hoverEffect && (
				<RangeControl
					label={ __( 'Hover Duration (ms)', 'b-blocks' ) }
					value={ hoverDuration }
					onChange={ ( val ) => setAttributes( { hoverDuration: val } ) }
					min={ 0 }
					max={ 800 }
					step={ 10 }
				/>
			) }

			{ 'overlay' !== cardStyle && (
				<ColorControl
					label={ __( 'Card Background:', 'b-blocks' ) }
					value={ cardBg }
					onChange={ ( val ) => setAttributes( { cardBg: val } ) }
				/>
			) }

			{ 'plain' !== cardStyle && (
				<ColorControl
					label={ __( 'Fallback Color (no image):', 'b-blocks' ) }
					value={ fallbackColor }
					onChange={ ( val ) => setAttributes( { fallbackColor: val } ) }
				/>
			) }

			{ 'overlay' === cardStyle && (
				<ColorControl
					label={ __( 'Overlay Color:', 'b-blocks' ) }
					value={ overlayColor }
					onChange={ ( val ) => setAttributes( { overlayColor: val } ) }
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
			<RangeControl
				label={ __( 'Vertical Padding (px)', 'b-blocks' ) }
				value={ cardPaddingV }
				onChange={ ( val ) => setAttributes( { cardPaddingV: val } ) }
				min={ 0 }
				max={ 64 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Horizontal Padding (px)', 'b-blocks' ) }
				value={ cardPaddingH }
				onChange={ ( val ) => setAttributes( { cardPaddingH: val } ) }
				min={ 0 }
				max={ 64 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Shadow:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ shadowPreset }
					options={ shadowOptions }
					onChange={ ( val ) => setAttributes( { shadowPreset: val } ) }
				/>
			</PanelRow>
			<RangeControl
				label={ __( 'Border Width (px)', 'b-blocks' ) }
				value={ borderWidth }
				onChange={ ( val ) => setAttributes( { borderWidth: val } ) }
				min={ 0 }
				max={ 8 }
				step={ 1 }
			/>
			{ borderWidth > 0 && (
				<ColorControl
					label={ __( 'Border Color:', 'b-blocks' ) }
					value={ borderColor }
					onChange={ ( val ) => setAttributes( { borderColor: val } ) }
				/>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Post Count', 'b-blocks' ) }
				checked={ showCount }
				onChange={ ( val ) => setAttributes( { showCount: val } ) }
			/>
			{ showCount && (
				<TextControl
					label={ __( 'Count Label (e.g. "posts", blank hides it)', 'b-blocks' ) }
					value={ countLabel }
					onChange={ ( val ) => setAttributes( { countLabel: val } ) }
				/>
			) }

			<ToggleControl
				label={ __( 'Show Description', 'b-blocks' ) }
				checked={ showDescription }
				onChange={ ( val ) => setAttributes( { showDescription: val } ) }
			/>
			{ showDescription && (
				<RangeControl
					label={ __( 'Description Max Length (chars, 0 = no limit)', 'b-blocks' ) }
					value={ descriptionLength }
					onChange={ ( val ) => setAttributes( { descriptionLength: val } ) }
					min={ 0 }
					max={ 200 }
					step={ 1 }
				/>
			) }

			<ToggleControl
				label={ __( 'Open Links in New Tab', 'b-blocks' ) }
				checked={ openInNewTab }
				onChange={ ( val ) => setAttributes( { openInNewTab: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Typography & Color', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Accent Color:', 'b-blocks' ) }
				value={ accentColor }
				onChange={ ( val ) => setAttributes( { accentColor: val } ) }
			/>

			<RangeControl
				label={ __( 'Term Name — Font Size (px)', 'b-blocks' ) }
				value={ nameFontSize }
				onChange={ ( val ) => setAttributes( { nameFontSize: val } ) }
				min={ 10 }
				max={ 48 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Term Name — Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ nameFontWeight }
					options={ nameWeightOptions }
					onChange={ ( val ) => setAttributes( { nameFontWeight: val } ) }
				/>
			</PanelRow>
			<ColorControl
				label={ __( 'Term Name — Color:', 'b-blocks' ) }
				value={ nameColor }
				onChange={ ( val ) => setAttributes( { nameColor: val } ) }
			/>

			<ColorControl
				label={ __( 'Count Badge — Text Color:', 'b-blocks' ) }
				value={ countColor }
				onChange={ ( val ) => setAttributes( { countColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Count Badge — Background:', 'b-blocks' ) }
				value={ countBg }
				onChange={ ( val ) => setAttributes( { countBg: val } ) }
			/>
			<RangeControl
				label={ __( 'Count Badge — Font Size (px)', 'b-blocks' ) }
				value={ countFontSize }
				onChange={ ( val ) => setAttributes( { countFontSize: val } ) }
				min={ 10 }
				max={ 20 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Description — Font Size (px)', 'b-blocks' ) }
				value={ descFontSize }
				onChange={ ( val ) => setAttributes( { descFontSize: val } ) }
				min={ 10 }
				max={ 24 }
				step={ 1 }
			/>
			<ColorControl
				label={ __( 'Description — Color:', 'b-blocks' ) }
				value={ descColor }
				onChange={ ( val ) => setAttributes( { descColor: val } ) }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

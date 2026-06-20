import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl, Notice } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import {
	orderByOptions, orderOptions, cardStyleOptions, imageRatioOptions,
	imageSizeOptions, hoverEffectOptions, shadowOptions, alignmentOptions, nameWeightOptions
} from '../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		orderby, order, number, hideEmpty, topLevelOnly, includeIds, excludeIds,
		columnsDesktop, columnsTablet, columnsMobile, columnGap, rowGap, maxWidth, alignment,
		cardStyle, imageRatio, imageSize, fallbackColor, fallbackIconClass, overlayColor,
		showCount, countLabel, showCta, ctaLabel, openInNewTab, noWooMessage, noTermsMessage,
		cardBg, cardRadius, cardPaddingV, cardPaddingH, shadowPreset, borderWidth, borderColor,
		hoverEffect, hoverDuration,
		accentColor, nameColor, nameFontSize, nameFontWeight,
		countColor, countBg, countFontSize, ctaColor, ctaFontSize
	} = attributes;

	const showAll = 0 === number;
	const hasInclude = includeIds && includeIds.trim() !== '';

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Query', 'b-blocks' ) }>
			<ToggleControl
				label={ __( 'Show all categories', 'b-blocks' ) }
				checked={ showAll }
				onChange={ ( val ) => setAttributes( { number: val ? 0 : 8 } ) }
			/>

			{ ! showAll && (
				<RangeControl
					label={ __( 'Number of categories', 'b-blocks' ) }
					value={ number }
					onChange={ ( val ) => setAttributes( { number: val } ) }
					min={ 1 }
					max={ 48 }
					step={ 1 }
				/>
			) }

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
				label={ __( 'Top-level only', 'b-blocks' ) }
				help={ __( 'Show only root-level product categories.', 'b-blocks' ) }
				checked={ topLevelOnly }
				onChange={ ( val ) => setAttributes( { topLevelOnly: val } ) }
			/>

			<ToggleControl
				label={ __( 'Hide empty', 'b-blocks' ) }
				help={ __( 'Exclude categories with zero products.', 'b-blocks' ) }
				checked={ hideEmpty }
				onChange={ ( val ) => setAttributes( { hideEmpty: val } ) }
			/>

			<TextControl
				label={ __( 'Include term IDs (overrides filters when set)', 'b-blocks' ) }
				value={ includeIds }
				onChange={ ( val ) => setAttributes( { includeIds: val } ) }
				placeholder='1, 5, 12'
			/>

			<TextControl
				label={ __( 'Exclude term IDs', 'b-blocks' ) }
				value={ excludeIds }
				onChange={ ( val ) => setAttributes( { excludeIds: val } ) }
				placeholder='3, 7'
			/>

			{ hasInclude && (
				<Notice status='info' isDismissible={ false }>
					{ __( 'Include IDs are set, so the Top-level only filter is ignored.', 'b-blocks' ) }
				</Notice>
			) }
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

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show product count', 'b-blocks' ) }
				checked={ showCount }
				onChange={ ( val ) => setAttributes( { showCount: val } ) }
			/>
			{ showCount && (
				<TextControl
					label={ __( 'Count label (e.g. "Products", blank = number only)', 'b-blocks' ) }
					value={ countLabel }
					onChange={ ( val ) => setAttributes( { countLabel: val } ) }
					placeholder={ __( 'Products', 'b-blocks' ) }
				/>
			) }

			<ToggleControl
				label={ __( 'Show CTA label', 'b-blocks' ) }
				checked={ showCta }
				onChange={ ( val ) => setAttributes( { showCta: val } ) }
			/>
			{ showCta && (
				<TextControl
					label={ __( 'CTA label text', 'b-blocks' ) }
					value={ ctaLabel }
					onChange={ ( val ) => setAttributes( { ctaLabel: val } ) }
					placeholder={ __( 'Shop Now', 'b-blocks' ) }
				/>
			) }

			<ToggleControl
				label={ __( 'Open links in new tab', 'b-blocks' ) }
				checked={ openInNewTab }
				onChange={ ( val ) => setAttributes( { openInNewTab: val } ) }
			/>

			<TextControl
				label={ __( 'No WooCommerce message', 'b-blocks' ) }
				value={ noWooMessage }
				onChange={ ( val ) => setAttributes( { noWooMessage: val } ) }
			/>
			<TextControl
				label={ __( 'No categories message', 'b-blocks' ) }
				value={ noTermsMessage }
				onChange={ ( val ) => setAttributes( { noTermsMessage: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Card Style', 'b-blocks' ) } initialOpen={ false }>
			{ 'overlay' === cardStyle && (
				<Notice status='info' isDismissible={ false }>
					{ __( 'For readable text, keep the overlay color dark enough (WCAG AA needs 4.5:1 contrast against the category image).', 'b-blocks' ) }
				</Notice>
			) }

			{ 'overlay' !== cardStyle && (
				<ColorControl
					label={ __( 'Card Background:', 'b-blocks' ) }
					value={ cardBg }
					onChange={ ( val ) => setAttributes( { cardBg: val } ) }
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

			{ 'plain' !== cardStyle && (
				<>
					<ColorControl
						label={ __( 'Fallback Color (no thumbnail):', 'b-blocks' ) }
						value={ fallbackColor }
						onChange={ ( val ) => setAttributes( { fallbackColor: val } ) }
					/>
					<TextControl
						label={ __( 'Fallback Icon (Font Awesome class)', 'b-blocks' ) }
						value={ fallbackIconClass }
						onChange={ ( val ) => setAttributes( { fallbackIconClass: val } ) }
						placeholder='fa-solid fa-tag'
					/>
				</>
			) }

			{ 'overlay' === cardStyle && (
				<ColorControl
					label={ __( 'Overlay Color:', 'b-blocks' ) }
					value={ overlayColor }
					onChange={ ( val ) => setAttributes( { overlayColor: val } ) }
				/>
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
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Typography & Colors', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Accent Color:', 'b-blocks' ) }
				value={ accentColor }
				onChange={ ( val ) => setAttributes( { accentColor: val } ) }
			/>

			<ColorControl
				label={ __( 'Category Name — Color:', 'b-blocks' ) }
				value={ nameColor }
				onChange={ ( val ) => setAttributes( { nameColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Category Name — Font Size (px)', 'b-blocks' ) }
				value={ nameFontSize }
				onChange={ ( val ) => setAttributes( { nameFontSize: val } ) }
				min={ 10 }
				max={ 48 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Category Name — Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ nameFontWeight }
					options={ nameWeightOptions }
					onChange={ ( val ) => setAttributes( { nameFontWeight: val } ) }
				/>
			</PanelRow>

			{ showCount && (
				<>
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
				</>
			) }

			{ showCta && (
				<>
					<ColorControl
						label={ __( 'CTA — Color:', 'b-blocks' ) }
						value={ ctaColor }
						onChange={ ( val ) => setAttributes( { ctaColor: val } ) }
					/>
					<RangeControl
						label={ __( 'CTA — Font Size (px)', 'b-blocks' ) }
						value={ ctaFontSize }
						onChange={ ( val ) => setAttributes( { ctaFontSize: val } ) }
						min={ 10 }
						max={ 20 }
						step={ 1 }
					/>
				</>
			) }
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

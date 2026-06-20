import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';

const categoryDepthOptions = [
	{ label: __( 'Top-level only', 'b-blocks' ), value: 0 },
	{ label: __( 'Include subcategories', 'b-blocks' ), value: 1 }
];

const layoutOptions = [
	{ label: __( 'Vertical (sidebar)', 'b-blocks' ), value: 'vertical' },
	{ label: __( 'Horizontal (inline)', 'b-blocks' ), value: 'horizontal' }
];

const headingTagOptions = [
	{ label: 'H2', value: 'h2' },
	{ label: 'H3', value: 'h3' },
	{ label: 'H4', value: 'h4' }
];

const Settings = ( { attributes, setAttributes } ) => {
	const {
		showCategoryFilter, categoryDepth, showPriceFilter, priceMin, priceMax,
		showRatingFilter, showOnSaleFilter, showSortControl,
		filterLayout, showApplyButton, applyButtonLabel, clearButtonLabel, filterHeadingTag,
		accentColor, backgroundColor, borderColor, borderWidth, borderRadius, padding,
		textColor, headingColor, headingFontSize, labelFontSize,
		applyBtnColor, applyBtnBG, applyBtnRadius
	} = attributes;

	// Font-size attributes are emitted as "<n>px" strings; surface the numeric part.
	const headingPx = parseInt( headingFontSize, 10 ) || 14;
	const labelPx = parseInt( labelFontSize, 10 ) || 14;

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Filter Sections', 'b-blocks' ) }>
			<ToggleControl
				label={ __( 'Show Category Filter', 'b-blocks' ) }
				checked={ showCategoryFilter }
				onChange={ ( val ) => setAttributes( { showCategoryFilter: val } ) }
			/>

			{ showCategoryFilter && (
				<PanelRow>
					<Label className=''>{ __( 'Category Depth:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ categoryDepth }
						options={ categoryDepthOptions }
						onChange={ ( val ) => setAttributes( { categoryDepth: parseInt( val, 10 ) } ) }
					/>
				</PanelRow>
			) }

			<ToggleControl
				label={ __( 'Show Price Range', 'b-blocks' ) }
				checked={ showPriceFilter }
				onChange={ ( val ) => setAttributes( { showPriceFilter: val } ) }
			/>

			{ showPriceFilter && (
				<>
					<RangeControl
						label={ __( 'Price Slider Min', 'b-blocks' ) }
						value={ priceMin }
						onChange={ ( val ) => setAttributes( { priceMin: val } ) }
						min={ 0 }
						max={ 5000 }
						step={ 10 }
					/>
					<RangeControl
						label={ __( 'Price Slider Max', 'b-blocks' ) }
						value={ priceMax }
						onChange={ ( val ) => setAttributes( { priceMax: val } ) }
						min={ 0 }
						max={ 5000 }
						step={ 10 }
					/>
				</>
			) }

			<ToggleControl
				label={ __( 'Show Rating Filter', 'b-blocks' ) }
				checked={ showRatingFilter }
				onChange={ ( val ) => setAttributes( { showRatingFilter: val } ) }
			/>

			<ToggleControl
				label={ __( 'Show "On Sale" Checkbox', 'b-blocks' ) }
				checked={ showOnSaleFilter }
				onChange={ ( val ) => setAttributes( { showOnSaleFilter: val } ) }
			/>

			<ToggleControl
				label={ __( 'Show Sort By', 'b-blocks' ) }
				checked={ showSortControl }
				onChange={ ( val ) => setAttributes( { showSortControl: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) }>
			<PanelRow>
				<Label className=''>{ __( 'Filter Layout:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ filterLayout }
					options={ layoutOptions }
					onChange={ ( val ) => setAttributes( { filterLayout: val } ) }
				/>
			</PanelRow>

			<ToggleControl
				label={ __( 'Show Apply Button', 'b-blocks' ) }
				help={ __( 'When off, filters auto-submit on change (with JavaScript).', 'b-blocks' ) }
				checked={ showApplyButton }
				onChange={ ( val ) => setAttributes( { showApplyButton: val } ) }
			/>

			{ showApplyButton && (
				<TextControl
					label={ __( 'Apply Button Label', 'b-blocks' ) }
					value={ applyButtonLabel }
					onChange={ ( val ) => setAttributes( { applyButtonLabel: val } ) }
				/>
			) }

			<TextControl
				label={ __( 'Clear Button Label', 'b-blocks' ) }
				value={ clearButtonLabel }
				onChange={ ( val ) => setAttributes( { clearButtonLabel: val } ) }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Section Heading Tag:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ filterHeadingTag }
					options={ headingTagOptions }
					onChange={ ( val ) => setAttributes( { filterHeadingTag: val } ) }
				/>
			</PanelRow>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Accent Color:', 'b-blocks' ) }
				value={ accentColor }
				onChange={ ( val ) => setAttributes( { accentColor: val } ) }
			/>

			<ColorControl
				label={ __( 'Background Color:', 'b-blocks' ) }
				value={ backgroundColor }
				onChange={ ( val ) => setAttributes( { backgroundColor: val } ) }
			/>

			<ColorControl
				label={ __( 'Border Color:', 'b-blocks' ) }
				value={ borderColor }
				onChange={ ( val ) => setAttributes( { borderColor: val } ) }
			/>

			<RangeControl
				label={ __( 'Border Width (px)', 'b-blocks' ) }
				value={ borderWidth }
				onChange={ ( val ) => setAttributes( { borderWidth: val } ) }
				min={ 0 }
				max={ 8 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Border Radius (px)', 'b-blocks' ) }
				value={ borderRadius }
				onChange={ ( val ) => setAttributes( { borderRadius: val } ) }
				min={ 0 }
				max={ 32 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Padding (px)', 'b-blocks' ) }
				value={ padding }
				onChange={ ( val ) => setAttributes( { padding: val } ) }
				min={ 0 }
				max={ 60 }
				step={ 1 }
			/>

			<ColorControl
				label={ __( 'Text Color:', 'b-blocks' ) }
				value={ textColor }
				onChange={ ( val ) => setAttributes( { textColor: val } ) }
			/>

			<ColorControl
				label={ __( 'Heading Color:', 'b-blocks' ) }
				value={ headingColor }
				onChange={ ( val ) => setAttributes( { headingColor: val } ) }
			/>

			<RangeControl
				label={ __( 'Heading Font Size (px)', 'b-blocks' ) }
				value={ headingPx }
				onChange={ ( val ) => setAttributes( { headingFontSize: `${ val }px` } ) }
				min={ 10 }
				max={ 24 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Label Font Size (px)', 'b-blocks' ) }
				value={ labelPx }
				onChange={ ( val ) => setAttributes( { labelFontSize: `${ val }px` } ) }
				min={ 10 }
				max={ 20 }
				step={ 1 }
			/>
		</PanelBody>

		{ showApplyButton && (
			<PanelBody className='bPlPanelBody' title={ __( 'Apply Button Style', 'b-blocks' ) } initialOpen={ false }>
				<ColorControl
					label={ __( 'Button Text Color:', 'b-blocks' ) }
					value={ applyBtnColor }
					onChange={ ( val ) => setAttributes( { applyBtnColor: val } ) }
				/>

				<ColorControl
					label={ __( 'Button Background:', 'b-blocks' ) }
					value={ applyBtnBG }
					onChange={ ( val ) => setAttributes( { applyBtnBG: val } ) }
				/>

				<RangeControl
					label={ __( 'Button Border Radius (px)', 'b-blocks' ) }
					value={ applyBtnRadius }
					onChange={ ( val ) => setAttributes( { applyBtnRadius: val } ) }
					min={ 0 }
					max={ 32 }
					step={ 1 }
				/>
			</PanelBody>
		) }
	</InspectorControls>;
};

export default Settings;

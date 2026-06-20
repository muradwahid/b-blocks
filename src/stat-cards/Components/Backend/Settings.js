import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import {
	cardStyleOptions, alignOptions, shadowOptions,
	numberWeightOptions, labelWeightOptions
} from '../../utils/data';
import ItemsRepeater from './ItemsRepeater';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		items, columnsDesktop, columnsTablet, columnsMobile, columnGap, rowGap,
		maxWidth, blockAlign, cardStyle, alignment,
		cardBackground, cardBorder, borderWidth, accentColor, accentWidth,
		borderRadius, cardPaddingV, cardPaddingH, shadowPreset,
		showIcon, showDescription, showTrend, iconSize,
		numberSizeDesktop, numberSizeTablet, numberSizeMobile, numberWeight,
		labelSize, labelWeight, descriptionSize,
		numberColor, labelColor, descriptionColor, iconColor
	} = attributes;

	const showBorderControls = cardStyle === 'outlined' || cardStyle === 'accent-top';

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) }>
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
				max={ 6 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Columns — Mobile', 'b-blocks' ) }
				value={ columnsMobile }
				onChange={ ( val ) => setAttributes( { columnsMobile: val } ) }
				min={ 1 }
				max={ 6 }
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
				label={ __( 'Max Width (px)', 'b-blocks' ) }
				value={ maxWidth }
				onChange={ ( val ) => setAttributes( { maxWidth: val } ) }
				min={ 0 }
				max={ 1600 }
				step={ 10 }
				help={ __( '0 = full container width.', 'b-blocks' ) }
			/>
			{ maxWidth > 0 && (
				<PanelRow>
					<Label className=''>{ __( 'Block Alignment:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ blockAlign }
						options={ alignOptions }
						onChange={ ( val ) => setAttributes( { blockAlign: val } ) }
					/>
				</PanelRow>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Cards', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Card Style:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ cardStyle }
					options={ cardStyleOptions }
					onChange={ ( val ) => setAttributes( { cardStyle: val } ) }
				/>
			</PanelRow>
			<PanelRow>
				<Label className=''>{ __( 'Card Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ alignment }
					options={ alignOptions }
					onChange={ ( val ) => setAttributes( { alignment: val } ) }
				/>
			</PanelRow>
			<ColorControl
				label={ __( 'Card Background:', 'b-blocks' ) }
				value={ cardBackground }
				onChange={ ( val ) => setAttributes( { cardBackground: val } ) }
			/>
			{ showBorderControls && (
				<ColorControl
					label={ __( 'Border Color:', 'b-blocks' ) }
					value={ cardBorder }
					onChange={ ( val ) => setAttributes( { cardBorder: val } ) }
				/>
			) }
			<RangeControl
				label={ __( 'Border Width (px)', 'b-blocks' ) }
				value={ borderWidth }
				onChange={ ( val ) => setAttributes( { borderWidth: val } ) }
				min={ 0 }
				max={ 8 }
				step={ 1 }
			/>
			<ColorControl
				label={ __( 'Accent Color:', 'b-blocks' ) }
				value={ accentColor }
				onChange={ ( val ) => setAttributes( { accentColor: val } ) }
			/>
			{ cardStyle === 'accent-top' && (
				<RangeControl
					label={ __( 'Accent Line Height (px)', 'b-blocks' ) }
					value={ accentWidth }
					onChange={ ( val ) => setAttributes( { accentWidth: val } ) }
					min={ 2 }
					max={ 12 }
					step={ 1 }
				/>
			) }
			<RangeControl
				label={ __( 'Border Radius (px)', 'b-blocks' ) }
				value={ borderRadius }
				onChange={ ( val ) => setAttributes( { borderRadius: val } ) }
				min={ 0 }
				max={ 48 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Padding — Vertical (px)', 'b-blocks' ) }
				value={ cardPaddingV }
				onChange={ ( val ) => setAttributes( { cardPaddingV: val } ) }
				min={ 8 }
				max={ 96 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Padding — Horizontal (px)', 'b-blocks' ) }
				value={ cardPaddingH }
				onChange={ ( val ) => setAttributes( { cardPaddingH: val } ) }
				min={ 8 }
				max={ 96 }
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
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Icon', 'b-blocks' ) }
				checked={ !! showIcon }
				onChange={ ( val ) => setAttributes( { showIcon: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show Description', 'b-blocks' ) }
				checked={ !! showDescription }
				onChange={ ( val ) => setAttributes( { showDescription: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show Trend Badge', 'b-blocks' ) }
				checked={ !! showTrend }
				onChange={ ( val ) => setAttributes( { showTrend: val } ) }
			/>
			<ItemsRepeater
				value={ items }
				onChange={ ( val ) => setAttributes( { items: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Typography', 'b-blocks' ) } initialOpen={ false }>
			{ showIcon && (
				<RangeControl
					label={ __( 'Icon Size (px)', 'b-blocks' ) }
					value={ iconSize }
					onChange={ ( val ) => setAttributes( { iconSize: val } ) }
					min={ 12 }
					max={ 64 }
					step={ 1 }
				/>
			) }
			<RangeControl
				label={ __( 'Number Size — Desktop (px)', 'b-blocks' ) }
				value={ numberSizeDesktop }
				onChange={ ( val ) => setAttributes( { numberSizeDesktop: val } ) }
				min={ 16 }
				max={ 96 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Number Size — Tablet (px)', 'b-blocks' ) }
				value={ numberSizeTablet }
				onChange={ ( val ) => setAttributes( { numberSizeTablet: val } ) }
				min={ 16 }
				max={ 96 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Number Size — Mobile (px)', 'b-blocks' ) }
				value={ numberSizeMobile }
				onChange={ ( val ) => setAttributes( { numberSizeMobile: val } ) }
				min={ 16 }
				max={ 96 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Number Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ numberWeight }
					options={ numberWeightOptions }
					onChange={ ( val ) => setAttributes( { numberWeight: val } ) }
				/>
			</PanelRow>
			<RangeControl
				label={ __( 'Label Size (px)', 'b-blocks' ) }
				value={ labelSize }
				onChange={ ( val ) => setAttributes( { labelSize: val } ) }
				min={ 10 }
				max={ 28 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Label Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ labelWeight }
					options={ labelWeightOptions }
					onChange={ ( val ) => setAttributes( { labelWeight: val } ) }
				/>
			</PanelRow>
			{ showDescription && (
				<RangeControl
					label={ __( 'Description Size (px)', 'b-blocks' ) }
					value={ descriptionSize }
					onChange={ ( val ) => setAttributes( { descriptionSize: val } ) }
					min={ 10 }
					max={ 20 }
					step={ 1 }
				/>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Colors', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Number Color:', 'b-blocks' ) }
				value={ numberColor }
				onChange={ ( val ) => setAttributes( { numberColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Label Color:', 'b-blocks' ) }
				value={ labelColor }
				onChange={ ( val ) => setAttributes( { labelColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Description Color:', 'b-blocks' ) }
				value={ descriptionColor }
				onChange={ ( val ) => setAttributes( { descriptionColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Icon Color:', 'b-blocks' ) }
				value={ iconColor }
				onChange={ ( val ) => setAttributes( { iconColor: val } ) }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

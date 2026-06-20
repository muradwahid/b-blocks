import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import {
	styleOptions, alignOptions, textAlignOptions, avatarShapeOptions,
	shadowOptions, fontWeightOptions
} from '../../utils/data';
import ItemsRepeater from './ItemsRepeater';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		items, style, columnsDesktop, columnsTablet, columnsMobile, gap, maxWidth, alignment, textAlign,
		showAvatar, avatarSize, avatarShape, showRating, ratingColor, starSize,
		quoteIconVisible, quoteIconColor, quoteIconSize,
		cardBackground, cardBorderRadius, cardPaddingV, cardPaddingH, cardShadow,
		accentColor, quoteColor, quoteFontSize, quoteFontWeight,
		nameColor, nameFontSize, nameFontWeight, metaColor, metaFontSize,
		borderColor, borderWidth
	} = attributes;

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) }>
			<PanelRow>
				<Label className=''>{ __( 'Style:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ style }
					options={ styleOptions }
					onChange={ ( val ) => setAttributes( { style: val } ) }
				/>
			</PanelRow>
			<RangeControl
				label={ __( 'Columns — Desktop', 'b-blocks' ) }
				value={ columnsDesktop }
				onChange={ ( val ) => setAttributes( { columnsDesktop: val } ) }
				min={ 1 }
				max={ 4 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Columns — Tablet', 'b-blocks' ) }
				value={ columnsTablet }
				onChange={ ( val ) => setAttributes( { columnsTablet: val } ) }
				min={ 1 }
				max={ 3 }
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
				label={ __( 'Gap (px)', 'b-blocks' ) }
				value={ gap }
				onChange={ ( val ) => setAttributes( { gap: val } ) }
				min={ 8 }
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
			<PanelRow>
				<Label className=''>{ __( 'Grid Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ alignment }
					options={ alignOptions }
					onChange={ ( val ) => setAttributes( { alignment: val } ) }
				/>
			</PanelRow>
			<PanelRow>
				<Label className=''>{ __( 'Content Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ textAlign }
					options={ textAlignOptions }
					onChange={ ( val ) => setAttributes( { textAlign: val } ) }
				/>
			</PanelRow>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Testimonials', 'b-blocks' ) }>
			<ItemsRepeater
				value={ items }
				onChange={ ( val ) => setAttributes( { items: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Avatar & Rating', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Avatar', 'b-blocks' ) }
				checked={ !! showAvatar }
				onChange={ ( val ) => setAttributes( { showAvatar: val } ) }
			/>
			{ showAvatar && <>
				<RangeControl
					label={ __( 'Avatar Size (px)', 'b-blocks' ) }
					value={ avatarSize }
					onChange={ ( val ) => setAttributes( { avatarSize: val } ) }
					min={ 32 }
					max={ 96 }
					step={ 1 }
				/>
				<PanelRow>
					<Label className=''>{ __( 'Avatar Shape:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ avatarShape }
						options={ avatarShapeOptions }
						onChange={ ( val ) => setAttributes( { avatarShape: val } ) }
					/>
				</PanelRow>
			</> }

			<ToggleControl
				label={ __( 'Show Rating', 'b-blocks' ) }
				checked={ !! showRating }
				onChange={ ( val ) => setAttributes( { showRating: val } ) }
			/>
			{ showRating && <>
				<RangeControl
					label={ __( 'Star Size (px)', 'b-blocks' ) }
					value={ starSize }
					onChange={ ( val ) => setAttributes( { starSize: val } ) }
					min={ 10 }
					max={ 28 }
					step={ 1 }
				/>
				<ColorControl
					label={ __( 'Rating Color:', 'b-blocks' ) }
					value={ ratingColor }
					onChange={ ( val ) => setAttributes( { ratingColor: val } ) }
				/>
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Card Style', 'b-blocks' ) } initialOpen={ false }>
			{ style === 'card' && (
				<ColorControl
					label={ __( 'Card Background:', 'b-blocks' ) }
					value={ cardBackground }
					onChange={ ( val ) => setAttributes( { cardBackground: val } ) }
				/>
			) }
			<RangeControl
				label={ __( 'Card Border Radius (px)', 'b-blocks' ) }
				value={ cardBorderRadius }
				onChange={ ( val ) => setAttributes( { cardBorderRadius: val } ) }
				min={ 0 }
				max={ 48 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Card Padding — Vertical (px)', 'b-blocks' ) }
				value={ cardPaddingV }
				onChange={ ( val ) => setAttributes( { cardPaddingV: val } ) }
				min={ 8 }
				max={ 64 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Card Padding — Horizontal (px)', 'b-blocks' ) }
				value={ cardPaddingH }
				onChange={ ( val ) => setAttributes( { cardPaddingH: val } ) }
				min={ 8 }
				max={ 64 }
				step={ 1 }
			/>
			{ style === 'card' && (
				<PanelRow>
					<Label className=''>{ __( 'Shadow:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ cardShadow }
						options={ shadowOptions }
						onChange={ ( val ) => setAttributes( { cardShadow: val } ) }
					/>
				</PanelRow>
			) }
			<RangeControl
				label={ __( 'Border Width (px)', 'b-blocks' ) }
				value={ borderWidth }
				onChange={ ( val ) => setAttributes( { borderWidth: val } ) }
				min={ 0 }
				max={ 4 }
				step={ 1 }
			/>
			{ borderWidth > 0 && (
				<ColorControl
					label={ __( 'Border Color:', 'b-blocks' ) }
					value={ borderColor }
					onChange={ ( val ) => setAttributes( { borderColor: val } ) }
				/>
			) }
			{ style === 'minimal' && (
				<ToggleControl
					label={ __( 'Show Quote Icon', 'b-blocks' ) }
					checked={ !! quoteIconVisible }
					onChange={ ( val ) => setAttributes( { quoteIconVisible: val } ) }
				/>
			) }
			{ style === 'minimal' && quoteIconVisible && <>
				<RangeControl
					label={ __( 'Quote Icon Size (px)', 'b-blocks' ) }
					value={ quoteIconSize }
					onChange={ ( val ) => setAttributes( { quoteIconSize: val } ) }
					min={ 16 }
					max={ 72 }
					step={ 1 }
				/>
				<ColorControl
					label={ __( 'Quote Icon Color:', 'b-blocks' ) }
					value={ quoteIconColor }
					onChange={ ( val ) => setAttributes( { quoteIconColor: val } ) }
				/>
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Typography', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Accent Color:', 'b-blocks' ) }
				value={ accentColor }
				onChange={ ( val ) => setAttributes( { accentColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Quote Color:', 'b-blocks' ) }
				value={ quoteColor }
				onChange={ ( val ) => setAttributes( { quoteColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Quote Font Size (px)', 'b-blocks' ) }
				value={ quoteFontSize }
				onChange={ ( val ) => setAttributes( { quoteFontSize: val } ) }
				min={ 12 }
				max={ 28 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Quote Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ quoteFontWeight }
					options={ fontWeightOptions }
					onChange={ ( val ) => setAttributes( { quoteFontWeight: val } ) }
				/>
			</PanelRow>
			<ColorControl
				label={ __( 'Name Color:', 'b-blocks' ) }
				value={ nameColor }
				onChange={ ( val ) => setAttributes( { nameColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Name Font Size (px)', 'b-blocks' ) }
				value={ nameFontSize }
				onChange={ ( val ) => setAttributes( { nameFontSize: val } ) }
				min={ 10 }
				max={ 24 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Name Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ nameFontWeight }
					options={ fontWeightOptions }
					onChange={ ( val ) => setAttributes( { nameFontWeight: val } ) }
				/>
			</PanelRow>
			<ColorControl
				label={ __( 'Meta (Role / Company) Color:', 'b-blocks' ) }
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
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

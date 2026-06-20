import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import { directionOptions, weightOptions } from '../../utils/data';
import ItemsRepeater from './ItemsRepeater';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		items, labelText, labelFontSize, labelFontWeight, labelColor,
		direction, speed, gap, duplicateCount, pauseOnHover, fadeEdges, fadeWidth,
		stripPaddingTop, stripPaddingBottom, backgroundColor, borderRadius,
		imageHeight, imageGrayscale, imageGrayscaleHover,
		textFontSize, textFontWeight, textColor,
		badgeBackground, badgeBorderRadius, badgePaddingV, badgePaddingH,
		separatorIcon, separatorColor, separatorSize
	} = attributes;

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) }>
			<ItemsRepeater
				value={ items }
				onChange={ ( val ) => setAttributes( { items: val } ) }
			/>

			<TextControl
				label={ __( 'Static label (optional)', 'b-blocks' ) }
				value={ labelText }
				onChange={ ( val ) => setAttributes( { labelText: val } ) }
				placeholder={ __( 'Trusted by:', 'b-blocks' ) }
				help={ __( 'Shown to the left of the scrolling track.', 'b-blocks' ) }
				__nextHasNoMarginBottom
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Direction:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ direction }
					options={ directionOptions }
					onChange={ ( val ) => setAttributes( { direction: val } ) }
				/>
			</PanelRow>
			<RangeControl
				label={ __( 'Speed (px/s)', 'b-blocks' ) }
				value={ speed }
				onChange={ ( val ) => setAttributes( { speed: val } ) }
				min={ 20 }
				max={ 200 }
				step={ 5 }
				help={ __( 'Higher = faster.', 'b-blocks' ) }
			/>
			<RangeControl
				label={ __( 'Item gap (px)', 'b-blocks' ) }
				value={ gap }
				onChange={ ( val ) => setAttributes( { gap: val } ) }
				min={ 0 }
				max={ 120 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Duplicate count', 'b-blocks' ) }
				value={ duplicateCount }
				onChange={ ( val ) => setAttributes( { duplicateCount: val } ) }
				min={ 2 }
				max={ 4 }
				step={ 1 }
				help={ __( 'How many times the item set repeats for a seamless loop. Raise this if the strip looks sparse.', 'b-blocks' ) }
			/>
			<ToggleControl
				label={ __( 'Pause on hover / focus', 'b-blocks' ) }
				checked={ !! pauseOnHover }
				onChange={ ( val ) => setAttributes( { pauseOnHover: val } ) }
			/>
			<ToggleControl
				label={ __( 'Fade edges', 'b-blocks' ) }
				checked={ !! fadeEdges }
				onChange={ ( val ) => setAttributes( { fadeEdges: val } ) }
			/>
			{ fadeEdges && (
				<RangeControl
					label={ __( 'Fade width (px)', 'b-blocks' ) }
					value={ fadeWidth }
					onChange={ ( val ) => setAttributes( { fadeWidth: val } ) }
					min={ 20 }
					max={ 200 }
					step={ 1 }
				/>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style — Strip', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Background Color:', 'b-blocks' ) }
				value={ backgroundColor }
				onChange={ ( val ) => setAttributes( { backgroundColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Border Radius (px)', 'b-blocks' ) }
				value={ borderRadius }
				onChange={ ( val ) => setAttributes( { borderRadius: val } ) }
				min={ 0 }
				max={ 48 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Padding Top (px)', 'b-blocks' ) }
				value={ stripPaddingTop }
				onChange={ ( val ) => setAttributes( { stripPaddingTop: val } ) }
				min={ 0 }
				max={ 96 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Padding Bottom (px)', 'b-blocks' ) }
				value={ stripPaddingBottom }
				onChange={ ( val ) => setAttributes( { stripPaddingBottom: val } ) }
				min={ 0 }
				max={ 96 }
				step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style — Logos', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Image Height (px)', 'b-blocks' ) }
				value={ imageHeight }
				onChange={ ( val ) => setAttributes( { imageHeight: val } ) }
				min={ 16 }
				max={ 200 }
				step={ 1 }
			/>
			<ToggleControl
				label={ __( 'Grayscale by default', 'b-blocks' ) }
				checked={ !! imageGrayscale }
				onChange={ ( val ) => setAttributes( { imageGrayscale: val } ) }
			/>
			{ imageGrayscale && (
				<ToggleControl
					label={ __( 'Remove grayscale on hover', 'b-blocks' ) }
					checked={ !! imageGrayscaleHover }
					onChange={ ( val ) => setAttributes( { imageGrayscaleHover: val } ) }
				/>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style — Text badges', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Font Size (px)', 'b-blocks' ) }
				value={ textFontSize }
				onChange={ ( val ) => setAttributes( { textFontSize: val } ) }
				min={ 10 }
				max={ 48 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ textFontWeight }
					options={ weightOptions }
					onChange={ ( val ) => setAttributes( { textFontWeight: val } ) }
				/>
			</PanelRow>
			<ColorControl
				label={ __( 'Text Color:', 'b-blocks' ) }
				value={ textColor }
				onChange={ ( val ) => setAttributes( { textColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Badge Background:', 'b-blocks' ) }
				value={ badgeBackground }
				onChange={ ( val ) => setAttributes( { badgeBackground: val } ) }
			/>
			<RangeControl
				label={ __( 'Badge Border Radius (px)', 'b-blocks' ) }
				value={ badgeBorderRadius }
				onChange={ ( val ) => setAttributes( { badgeBorderRadius: val } ) }
				min={ 0 }
				max={ 50 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Badge Vertical Padding (px)', 'b-blocks' ) }
				value={ badgePaddingV }
				onChange={ ( val ) => setAttributes( { badgePaddingV: val } ) }
				min={ 0 }
				max={ 32 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Badge Horizontal Padding (px)', 'b-blocks' ) }
				value={ badgePaddingH }
				onChange={ ( val ) => setAttributes( { badgePaddingH: val } ) }
				min={ 0 }
				max={ 64 }
				step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style — Separator', 'b-blocks' ) } initialOpen={ false }>
			<TextControl
				label={ __( 'Separator icon (Font Awesome class)', 'b-blocks' ) }
				value={ separatorIcon }
				onChange={ ( val ) => setAttributes( { separatorIcon: val } ) }
				placeholder='fa-solid fa-circle'
				help={ __( 'Leave blank for no separator between items.', 'b-blocks' ) }
				__nextHasNoMarginBottom
			/>
			{ '' !== ( separatorIcon || '' ).trim() && <>
				<ColorControl
					label={ __( 'Separator Color:', 'b-blocks' ) }
					value={ separatorColor }
					onChange={ ( val ) => setAttributes( { separatorColor: val } ) }
				/>
				<RangeControl
					label={ __( 'Separator Size (px)', 'b-blocks' ) }
					value={ separatorSize }
					onChange={ ( val ) => setAttributes( { separatorSize: val } ) }
					min={ 4 }
					max={ 24 }
					step={ 1 }
				/>
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style — Label', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Label Font Size (px)', 'b-blocks' ) }
				value={ labelFontSize }
				onChange={ ( val ) => setAttributes( { labelFontSize: val } ) }
				min={ 10 }
				max={ 24 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Label Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ labelFontWeight }
					options={ weightOptions }
					onChange={ ( val ) => setAttributes( { labelFontWeight: val } ) }
				/>
			</PanelRow>
			<ColorControl
				label={ __( 'Label Color:', 'b-blocks' ) }
				value={ labelColor }
				onChange={ ( val ) => setAttributes( { labelColor: val } ) }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

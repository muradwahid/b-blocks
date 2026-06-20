import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import {
	layoutOptions, thumbnailSizeOptions, arrowIconOptions, titleTagOptions,
	alignmentOptions, blockAlignOptions, shadowOptions, weightOptions
} from '../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		layout, showPrev, showNext, gap, maxWidth, blockAlign, alignment,
		showThumbnail, thumbnailSize, thumbnailHeight, overlayColor, overlayOpacity,
		showLabel, prevLabel, nextLabel, showCategory, showDate, titleTag, titleLines,
		sameCategory, noPostsText, showArrowIcon, arrowIcon,
		cardBg, cardBorderColor, cardBorderWidth, cardRadius, cardPaddingV, cardPaddingH, cardShadow,
		labelSize, labelWeight, labelColor, titleSize, titleWeight, titleColor,
		metaSize, metaColor, accentColor,
		hoverBg, hoverTitleColor, transitionDuration
	} = attributes;

	const isCard = 'card' === layout;

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) }>
			<PanelRow>
				<Label className=''>{ __( 'Style:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ layout }
					options={ layoutOptions }
					onChange={ ( val ) => setAttributes( { layout: val } ) }
				/>
			</PanelRow>

			<ToggleControl
				label={ __( 'Show Previous tile', 'b-blocks' ) }
				checked={ showPrev }
				onChange={ ( val ) => setAttributes( { showPrev: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show Next tile', 'b-blocks' ) }
				checked={ showNext }
				onChange={ ( val ) => setAttributes( { showNext: val } ) }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Vertical alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ alignment }
					options={ alignmentOptions }
					onChange={ ( val ) => setAttributes( { alignment: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Gap between tiles (px)', 'b-blocks' ) }
				value={ gap }
				onChange={ ( val ) => setAttributes( { gap: val } ) }
				min={ 0 }
				max={ 80 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Max width (px, 0 = full width)', 'b-blocks' ) }
				value={ maxWidth }
				onChange={ ( val ) => setAttributes( { maxWidth: val } ) }
				min={ 0 }
				max={ 1400 }
				step={ 10 }
			/>

			{ maxWidth > 0 && (
				<PanelRow>
					<Label className=''>{ __( 'Block alignment:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ blockAlign }
						options={ blockAlignOptions }
						onChange={ ( val ) => setAttributes( { blockAlign: val } ) }
					/>
				</PanelRow>
			) }
		</PanelBody>

		{ isCard && (
			<PanelBody className='bPlPanelBody' title={ __( 'Thumbnail', 'b-blocks' ) } initialOpen={ false }>
				<ToggleControl
					label={ __( 'Show thumbnail', 'b-blocks' ) }
					checked={ showThumbnail }
					onChange={ ( val ) => setAttributes( { showThumbnail: val } ) }
				/>

				{ showThumbnail && <>
					<PanelRow>
						<Label className=''>{ __( 'Thumbnail size:', 'b-blocks' ) }</Label>
						<SelectControl
							value={ thumbnailSize }
							options={ thumbnailSizeOptions }
							onChange={ ( val ) => setAttributes( { thumbnailSize: val } ) }
						/>
					</PanelRow>
					<RangeControl
						label={ __( 'Thumbnail height (px)', 'b-blocks' ) }
						value={ thumbnailHeight }
						onChange={ ( val ) => setAttributes( { thumbnailHeight: val } ) }
						min={ 40 }
						max={ 400 }
						step={ 4 }
					/>
					<ColorControl
						label={ __( 'Thumbnail overlay color:', 'b-blocks' ) }
						value={ overlayColor }
						onChange={ ( val ) => setAttributes( { overlayColor: val } ) }
					/>
					<RangeControl
						label={ __( 'Thumbnail overlay opacity', 'b-blocks' ) }
						value={ overlayOpacity }
						onChange={ ( val ) => setAttributes( { overlayOpacity: val } ) }
						min={ 0 }
						max={ 100 }
						step={ 1 }
					/>
				</> }
			</PanelBody>
		) }

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show eyebrow label', 'b-blocks' ) }
				checked={ showLabel }
				onChange={ ( val ) => setAttributes( { showLabel: val } ) }
			/>

			{ showLabel && <>
				<TextControl
					label={ __( 'Previous label text', 'b-blocks' ) }
					value={ prevLabel }
					onChange={ ( val ) => setAttributes( { prevLabel: val } ) }
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={ __( 'Next label text', 'b-blocks' ) }
					value={ nextLabel }
					onChange={ ( val ) => setAttributes( { nextLabel: val } ) }
					__nextHasNoMarginBottom
				/>
			</> }

			<ToggleControl
				label={ __( 'Show category', 'b-blocks' ) }
				checked={ showCategory }
				onChange={ ( val ) => setAttributes( { showCategory: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show date', 'b-blocks' ) }
				checked={ showDate }
				onChange={ ( val ) => setAttributes( { showDate: val } ) }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Title HTML tag:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ titleTag }
					options={ titleTagOptions }
					onChange={ ( val ) => setAttributes( { titleTag: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Title max lines (0 = unclamped)', 'b-blocks' ) }
				value={ titleLines }
				onChange={ ( val ) => setAttributes( { titleLines: val } ) }
				min={ 0 }
				max={ 4 }
				step={ 1 }
			/>

			<ToggleControl
				label={ __( 'Restrict to same category', 'b-blocks' ) }
				checked={ sameCategory }
				onChange={ ( val ) => setAttributes( { sameCategory: val } ) }
			/>

			<TextControl
				label={ __( 'Text when no post', 'b-blocks' ) }
				help={ __( 'Leave blank to hide the tile when there is no adjacent post.', 'b-blocks' ) }
				value={ noPostsText }
				onChange={ ( val ) => setAttributes( { noPostsText: val } ) }
				__nextHasNoMarginBottom
			/>

			<ToggleControl
				label={ __( 'Show arrow icon', 'b-blocks' ) }
				checked={ showArrowIcon }
				onChange={ ( val ) => setAttributes( { showArrowIcon: val } ) }
			/>

			{ showArrowIcon && (
				<PanelRow>
					<Label className=''>{ __( 'Arrow icon style:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ arrowIcon }
						options={ arrowIconOptions }
						onChange={ ( val ) => setAttributes( { arrowIcon: val } ) }
					/>
				</PanelRow>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Card Style', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Card background:', 'b-blocks' ) }
				value={ cardBg }
				onChange={ ( val ) => setAttributes( { cardBg: val } ) }
			/>
			<ColorControl
				label={ __( 'Card border color:', 'b-blocks' ) }
				value={ cardBorderColor }
				onChange={ ( val ) => setAttributes( { cardBorderColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Card border width (px)', 'b-blocks' ) }
				value={ cardBorderWidth }
				onChange={ ( val ) => setAttributes( { cardBorderWidth: val } ) }
				min={ 0 }
				max={ 8 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Card border radius (px)', 'b-blocks' ) }
				value={ cardRadius }
				onChange={ ( val ) => setAttributes( { cardRadius: val } ) }
				min={ 0 }
				max={ 48 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Vertical padding (px)', 'b-blocks' ) }
				value={ cardPaddingV }
				onChange={ ( val ) => setAttributes( { cardPaddingV: val } ) }
				min={ 0 }
				max={ 64 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Horizontal padding (px)', 'b-blocks' ) }
				value={ cardPaddingH }
				onChange={ ( val ) => setAttributes( { cardPaddingH: val } ) }
				min={ 0 }
				max={ 80 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Shadow preset:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ cardShadow }
					options={ shadowOptions }
					onChange={ ( val ) => setAttributes( { cardShadow: val } ) }
				/>
			</PanelRow>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Typography', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Label font size (px)', 'b-blocks' ) }
				value={ labelSize }
				onChange={ ( val ) => setAttributes( { labelSize: val } ) }
				min={ 10 }
				max={ 24 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Label font weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ labelWeight }
					options={ weightOptions }
					onChange={ ( val ) => setAttributes( { labelWeight: val } ) }
				/>
			</PanelRow>
			<ColorControl
				label={ __( 'Label color:', 'b-blocks' ) }
				value={ labelColor }
				onChange={ ( val ) => setAttributes( { labelColor: val } ) }
			/>

			<RangeControl
				label={ __( 'Title font size (px)', 'b-blocks' ) }
				value={ titleSize }
				onChange={ ( val ) => setAttributes( { titleSize: val } ) }
				min={ 12 }
				max={ 36 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Title font weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ titleWeight }
					options={ weightOptions }
					onChange={ ( val ) => setAttributes( { titleWeight: val } ) }
				/>
			</PanelRow>
			<ColorControl
				label={ __( 'Title color:', 'b-blocks' ) }
				value={ titleColor }
				onChange={ ( val ) => setAttributes( { titleColor: val } ) }
			/>

			<RangeControl
				label={ __( 'Meta (category/date) font size (px)', 'b-blocks' ) }
				value={ metaSize }
				onChange={ ( val ) => setAttributes( { metaSize: val } ) }
				min={ 10 }
				max={ 20 }
				step={ 1 }
			/>
			<ColorControl
				label={ __( 'Meta color:', 'b-blocks' ) }
				value={ metaColor }
				onChange={ ( val ) => setAttributes( { metaColor: val } ) }
			/>

			<ColorControl
				label={ __( 'Accent color (arrow + hover):', 'b-blocks' ) }
				value={ accentColor }
				onChange={ ( val ) => setAttributes( { accentColor: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Hover Effects', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Hover card background:', 'b-blocks' ) }
				value={ hoverBg }
				onChange={ ( val ) => setAttributes( { hoverBg: val } ) }
			/>
			<ColorControl
				label={ __( 'Hover title color:', 'b-blocks' ) }
				value={ hoverTitleColor }
				onChange={ ( val ) => setAttributes( { hoverTitleColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Transition duration (ms)', 'b-blocks' ) }
				value={ transitionDuration }
				onChange={ ( val ) => setAttributes( { transitionDuration: val } ) }
				min={ 0 }
				max={ 600 }
				step={ 10 }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

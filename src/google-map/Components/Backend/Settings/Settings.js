import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	TextareaControl,
	ToggleControl,
	RangeControl,
	Notice
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../utils/data';
import {
	aspectRatioOptions,
	alignmentOptions,
	extractEmbedSrc,
	isValidEmbedUrl,
	EMBED_URL_PLACEHOLDER
} from '../../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		embedUrl,
		mapHeight,
		mapHeightTablet,
		mapHeightMobile,
		useAspectRatio,
		aspectRatio,
		mapAlign,
		caption,
		captionAlign,
		borderRadius,
		boxShadow,
		maxWidth,
		captionColor,
		captionFontSize
	} = attributes;

	// Accept either the full <iframe ...> HTML or just the src URL.
	const handleEmbedChange = ( raw ) => {
		const parsed = extractEmbedSrc( raw );
		setAttributes( { embedUrl: parsed } );
	};

	const showInvalidNotice = embedUrl && ! isValidEmbedUrl( embedUrl );

	return (
		<InspectorControls>
			<HelpPanel slug={ pluginSlug } />

			<PanelBody className='bPlPanelBody' title={ __( 'Map Source', 'b-blocks' ) } initialOpen={ true }>
				<TextareaControl
					label={ __( 'Google Maps Embed', 'b-blocks' ) }
					value={ embedUrl || '' }
					onChange={ handleEmbedChange }
					placeholder={ EMBED_URL_PLACEHOLDER }
					help={ __(
						'In Google Maps, click Share → Embed a map → Copy HTML. Paste the full iframe code OR just the src URL — we will extract it for you.',
						'b-blocks'
					) }
					rows={ 4 }
					__nextHasNoMarginBottom
				/>

				{ showInvalidNotice && (
					<Notice status='warning' isDismissible={ false }>
						{ __(
							'This does not look like a Google Maps embed URL. Only https://www.google.com/maps/embed URLs are allowed.',
							'b-blocks'
						) }
					</Notice>
				) }
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Size & Layout', 'b-blocks' ) }
				initialOpen={ false }
			>
				<ToggleControl
					label={ __( 'Use Aspect Ratio', 'b-blocks' ) }
					checked={ !! useAspectRatio }
					onChange={ ( val ) => setAttributes( { useAspectRatio: val } ) }
					help={ __(
						'When on, the map sizes itself by a fixed aspect ratio (fluid). When off, fixed pixel heights are used per breakpoint.',
						'b-blocks'
					) }
				/>

				{ useAspectRatio ? (
					<PanelRow>
						<Label className=''>{ __( 'Aspect Ratio:', 'b-blocks' ) }</Label>
						<SelectControl
							value={ aspectRatio || '16/9' }
							options={ aspectRatioOptions }
							onChange={ ( val ) => setAttributes( { aspectRatio: val } ) }
						/>
					</PanelRow>
				) : (
					<>
						<RangeControl
							label={ __( 'Height – Desktop (px)', 'b-blocks' ) }
							value={ parseInt( mapHeight, 10 ) || 450 }
							onChange={ ( val ) => setAttributes( { mapHeight: parseInt( val, 10 ) || 450 } ) }
							min={ 100 }
							max={ 900 }
							step={ 10 }
							__nextHasNoMarginBottom
						/>
						<RangeControl
							label={ __( 'Height – Tablet (px)', 'b-blocks' ) }
							value={ parseInt( mapHeightTablet, 10 ) || 350 }
							onChange={ ( val ) => setAttributes( { mapHeightTablet: parseInt( val, 10 ) || 350 } ) }
							min={ 100 }
							max={ 900 }
							step={ 10 }
							__nextHasNoMarginBottom
						/>
						<RangeControl
							label={ __( 'Height – Mobile (px)', 'b-blocks' ) }
							value={ parseInt( mapHeightMobile, 10 ) || 250 }
							onChange={ ( val ) => setAttributes( { mapHeightMobile: parseInt( val, 10 ) || 250 } ) }
							min={ 100 }
							max={ 900 }
							step={ 10 }
							__nextHasNoMarginBottom
						/>
					</>
				) }

				<TextControl
					label={ __( 'Max Width', 'b-blocks' ) }
					value={ maxWidth || '' }
					onChange={ ( val ) => setAttributes( { maxWidth: val } ) }
					placeholder='800px'
					help={ __( 'Any CSS width value (e.g. 800px, 100%, 50rem). Leave empty for no limit.', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{ __( 'Map Alignment:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ mapAlign || 'center' }
						options={ alignmentOptions }
						onChange={ ( val ) => setAttributes( { mapAlign: val } ) }
					/>
				</PanelRow>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'Style', 'b-blocks' ) } initialOpen={ false }>
				<RangeControl
					label={ __( 'Border Radius (px)', 'b-blocks' ) }
					value={ parseInt( borderRadius, 10 ) || 0 }
					onChange={ ( val ) => setAttributes( { borderRadius: parseInt( val, 10 ) || 0 } ) }
					min={ 0 }
					max={ 40 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={ __( 'Box Shadow', 'b-blocks' ) }
					checked={ !! boxShadow }
					onChange={ ( val ) => setAttributes( { boxShadow: val } ) }
					help={ __( 'Apply a subtle drop shadow to the map wrapper.', 'b-blocks' ) }
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'Caption', 'b-blocks' ) } initialOpen={ false }>
				<TextControl
					label={ __( 'Caption Text', 'b-blocks' ) }
					value={ caption || '' }
					onChange={ ( val ) => setAttributes( { caption: val } ) }
					placeholder={ __( 'e.g. 123 Main St, Anytown', 'b-blocks' ) }
					help={ __( 'Optional. Shown below the map and used in the iframe accessibility title.', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{ __( 'Caption Alignment:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ captionAlign || 'center' }
						options={ alignmentOptions }
						onChange={ ( val ) => setAttributes( { captionAlign: val } ) }
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Caption Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ captionColor || '' }
						onChange={ ( val ) => setAttributes( { captionColor: val } ) }
						defaultColor=''
					/>
				</PanelRow>

				<RangeControl
					label={ __( 'Caption Font Size (px)', 'b-blocks' ) }
					value={ parseInt( captionFontSize, 10 ) || 14 }
					onChange={ ( val ) => setAttributes( { captionFontSize: parseInt( val, 10 ) || 14 } ) }
					min={ 10 }
					max={ 32 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;

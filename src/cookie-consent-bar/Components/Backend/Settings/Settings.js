import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, TextareaControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../utils/data';
import { positionOptions, layoutOptions, alignmentOptions, fontWeightOptions } from '../../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		position, message, acceptLabel, declineLabel, showDecline,
		cookieName, cookieDays, maxWidth, alignment, layout,
		barBg, barText, barPaddingV, barPaddingH, fontSize, fontWeight,
		acceptBg, acceptText, acceptHoverBg, acceptHoverText,
		declineBg, declineText, declineHoverBg, declineHoverText,
		btnFontSize, btnFontWeight, btnPaddingV, btnPaddingH, btnRadius, btnGap,
		zIndex, animationDuration
	} = attributes;

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) }>
			<PanelRow>
				<Label className=''>{ __( 'Position:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ position }
					options={ positionOptions }
					onChange={ ( val ) => setAttributes( { position: val } ) }
				/>
			</PanelRow>

			<PanelRow>
				<Label className=''>{ __( 'Bar Layout:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ layout }
					options={ layoutOptions }
					onChange={ ( val ) => setAttributes( { layout: val } ) }
				/>
			</PanelRow>

			<PanelRow>
				<Label className=''>{ __( 'Content Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ alignment }
					options={ alignmentOptions }
					onChange={ ( val ) => setAttributes( { alignment: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Max width (0 = full bar)', 'b-blocks' ) }
				value={ maxWidth }
				onChange={ ( val ) => setAttributes( { maxWidth: val } ) }
				min={ 0 }
				max={ 1600 }
				step={ 10 }
				help={ __( 'Limits the inner content width. The bar background always spans full width.', 'b-blocks' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) } initialOpen={ false }>
			<TextareaControl
				label={ __( 'Message', 'b-blocks' ) }
				value={ message }
				onChange={ ( val ) => setAttributes( { message: val } ) }
				help={ __( 'You can also edit the message directly on the canvas with bold, italic, and links.', 'b-blocks' ) }
			/>

			<TextControl
				label={ __( 'Accept Button Label', 'b-blocks' ) }
				value={ acceptLabel }
				onChange={ ( val ) => setAttributes( { acceptLabel: val } ) }
				placeholder={ __( 'Accept', 'b-blocks' ) }
			/>

			<ToggleControl
				label={ __( 'Show Decline Button', 'b-blocks' ) }
				checked={ !! showDecline }
				onChange={ ( val ) => setAttributes( { showDecline: val } ) }
			/>

			{ showDecline && (
				<TextControl
					label={ __( 'Decline Button Label', 'b-blocks' ) }
					value={ declineLabel }
					onChange={ ( val ) => setAttributes( { declineLabel: val } ) }
					placeholder={ __( 'Decline', 'b-blocks' ) }
				/>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Cookie Settings', 'b-blocks' ) } initialOpen={ false }>
			<TextControl
				label={ __( 'Cookie Name', 'b-blocks' ) }
				value={ cookieName }
				onChange={ ( val ) => setAttributes( { cookieName: val } ) }
				placeholder='bb_cookie_consent'
				help={ __( 'Letters, numbers, hyphen and underscore only. Namespace multiple instances.', 'b-blocks' ) }
			/>

			<RangeControl
				label={ __( 'Cookie Lifetime (days)', 'b-blocks' ) }
				value={ cookieDays }
				onChange={ ( val ) => setAttributes( { cookieDays: val } ) }
				min={ 1 }
				max={ 3650 }
				step={ 1 }
			/>

			<p style={ { fontSize: '12px', color: '#666' } }>
				{ __( "This bar records the visitor's choice as a cookie. It does not block third-party scripts, so it is not by itself full GDPR compliance.", 'b-blocks' ) }
			</p>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Bar Style', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Background Color:', 'b-blocks' ) }
				value={ barBg }
				onChange={ ( val ) => setAttributes( { barBg: val } ) }
				defaultColor='#1a1a1a'
			/>

			<ColorControl
				label={ __( 'Text & Link Color:', 'b-blocks' ) }
				value={ barText }
				onChange={ ( val ) => setAttributes( { barText: val } ) }
				defaultColor='#ffffff'
			/>

			<RangeControl
				label={ __( 'Vertical Padding (px)', 'b-blocks' ) }
				value={ barPaddingV }
				onChange={ ( val ) => setAttributes( { barPaddingV: val } ) }
				min={ 4 }
				max={ 80 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Horizontal Padding (px)', 'b-blocks' ) }
				value={ barPaddingH }
				onChange={ ( val ) => setAttributes( { barPaddingH: val } ) }
				min={ 4 }
				max={ 120 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Message Font Size (px)', 'b-blocks' ) }
				value={ fontSize }
				onChange={ ( val ) => setAttributes( { fontSize: val } ) }
				min={ 10 }
				max={ 28 }
				step={ 1 }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Message Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ fontWeight }
					options={ fontWeightOptions }
					onChange={ ( val ) => setAttributes( { fontWeight: val } ) }
				/>
			</PanelRow>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Button Style', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Accept Background:', 'b-blocks' ) }
				value={ acceptBg }
				onChange={ ( val ) => setAttributes( { acceptBg: val } ) }
				defaultColor='#ffffff'
			/>

			<ColorControl
				label={ __( 'Accept Text:', 'b-blocks' ) }
				value={ acceptText }
				onChange={ ( val ) => setAttributes( { acceptText: val } ) }
				defaultColor='#1a1a1a'
			/>

			<ColorControl
				label={ __( 'Accept Hover Background:', 'b-blocks' ) }
				value={ acceptHoverBg }
				onChange={ ( val ) => setAttributes( { acceptHoverBg: val } ) }
				defaultColor='#e6e6e6'
			/>

			<ColorControl
				label={ __( 'Accept Hover Text:', 'b-blocks' ) }
				value={ acceptHoverText }
				onChange={ ( val ) => setAttributes( { acceptHoverText: val } ) }
				defaultColor='#1a1a1a'
			/>

			{ showDecline && <>
				<ColorControl
					label={ __( 'Decline Background:', 'b-blocks' ) }
					value={ declineBg }
					onChange={ ( val ) => setAttributes( { declineBg: val } ) }
					defaultColor='transparent'
				/>

				<ColorControl
					label={ __( 'Decline Text:', 'b-blocks' ) }
					value={ declineText }
					onChange={ ( val ) => setAttributes( { declineText: val } ) }
					defaultColor='#ffffff'
				/>

				<ColorControl
					label={ __( 'Decline Hover Background:', 'b-blocks' ) }
					value={ declineHoverBg }
					onChange={ ( val ) => setAttributes( { declineHoverBg: val } ) }
					defaultColor='rgba(255,255,255,0.1)'
				/>

				<ColorControl
					label={ __( 'Decline Hover Text:', 'b-blocks' ) }
					value={ declineHoverText }
					onChange={ ( val ) => setAttributes( { declineHoverText: val } ) }
					defaultColor='#ffffff'
				/>
			</> }

			<RangeControl
				label={ __( 'Button Font Size (px)', 'b-blocks' ) }
				value={ btnFontSize }
				onChange={ ( val ) => setAttributes( { btnFontSize: val } ) }
				min={ 10 }
				max={ 24 }
				step={ 1 }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Button Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ btnFontWeight }
					options={ fontWeightOptions }
					onChange={ ( val ) => setAttributes( { btnFontWeight: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Vertical Padding (px)', 'b-blocks' ) }
				value={ btnPaddingV }
				onChange={ ( val ) => setAttributes( { btnPaddingV: val } ) }
				min={ 2 }
				max={ 40 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Horizontal Padding (px)', 'b-blocks' ) }
				value={ btnPaddingH }
				onChange={ ( val ) => setAttributes( { btnPaddingH: val } ) }
				min={ 4 }
				max={ 80 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Border Radius (px)', 'b-blocks' ) }
				value={ btnRadius }
				onChange={ ( val ) => setAttributes( { btnRadius: val } ) }
				min={ 0 }
				max={ 9999 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Gap Between Buttons (px)', 'b-blocks' ) }
				value={ btnGap }
				onChange={ ( val ) => setAttributes( { btnGap: val } ) }
				min={ 0 }
				max={ 48 }
				step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Advanced', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Z-Index', 'b-blocks' ) }
				value={ zIndex }
				onChange={ ( val ) => setAttributes( { zIndex: val } ) }
				min={ 1 }
				max={ 99999 }
				step={ 1 }
				help={ __( 'Raise if the bar appears behind other fixed elements.', 'b-blocks' ) }
			/>

			<RangeControl
				label={ __( 'Animation Duration (ms)', 'b-blocks' ) }
				value={ animationDuration }
				onChange={ ( val ) => setAttributes( { animationDuration: val } ) }
				min={ 0 }
				max={ 800 }
				step={ 10 }
				help={ __( 'Slide-in/out speed. 0 = instant. Disabled when the visitor prefers reduced motion.', 'b-blocks' ) }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

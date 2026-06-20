import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../utils/data';
import { triggerTypeOptions, headlineTagOptions, headlineWeightOptions, animationOptions } from '../../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		triggerType, triggerDelay, triggerScrollPct, suppressDays, overlayCloseOnClick,
		headlineTag, showNameField, namePlaceholder, emailPlaceholder,
		ctaLabel, dismissLabel, successMessage, adminEmail,
		maxWidth, bgColor, textColor, accentColor, accentTextColor, overlayColor,
		borderRadius, padding, inputBorderColor, inputBorderRadius,
		headlineFontSize, headlineFontWeight, subtextFontSize, showCloseButton,
		openAnimation, animationDuration
	} = attributes;

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Trigger', 'b-blocks' ) }>
			<PanelRow>
				<Label className=''>{ __( 'Trigger Type:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ triggerType }
					options={ triggerTypeOptions }
					onChange={ ( val ) => setAttributes( { triggerType: val } ) }
				/>
			</PanelRow>

			{ 'time' === triggerType && (
				<RangeControl
					label={ __( 'Time Delay (seconds)', 'b-blocks' ) }
					value={ triggerDelay }
					onChange={ ( val ) => setAttributes( { triggerDelay: val } ) }
					min={ 1 }
					max={ 60 }
					step={ 1 }
				/>
			) }

			{ 'scroll' === triggerType && (
				<RangeControl
					label={ __( 'Scroll Depth (%)', 'b-blocks' ) }
					value={ triggerScrollPct }
					onChange={ ( val ) => setAttributes( { triggerScrollPct: val } ) }
					min={ 10 }
					max={ 100 }
					step={ 5 }
				/>
			) }

			{ 'exit' === triggerType && (
				<p style={ { fontSize: '12px', color: '#666', margin: '0 0 12px' } }>
					{ __( 'Fires when the cursor leaves the top of the viewport. On touch devices it falls back to a 10-second delay.', 'b-blocks' ) }
				</p>
			) }

			<RangeControl
				label={ __( 'Suppress for (days)', 'b-blocks' ) }
				value={ suppressDays }
				onChange={ ( val ) => setAttributes( { suppressDays: val } ) }
				min={ 0 }
				max={ 365 }
				step={ 1 }
				help={ __( 'After dismiss or submit, the popup stays hidden for this many days (per browser). 0 = always show.', 'b-blocks' ) }
			/>

			<ToggleControl
				label={ __( 'Close on backdrop click', 'b-blocks' ) }
				checked={ !! overlayCloseOnClick }
				onChange={ ( val ) => setAttributes( { overlayCloseOnClick: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Headline Tag:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ headlineTag }
					options={ headlineTagOptions }
					onChange={ ( val ) => setAttributes( { headlineTag: val } ) }
				/>
			</PanelRow>

			<ToggleControl
				label={ __( 'Show Name Field', 'b-blocks' ) }
				checked={ !! showNameField }
				onChange={ ( val ) => setAttributes( { showNameField: val } ) }
			/>

			{ showNameField && (
				<TextControl
					label={ __( 'Name Placeholder', 'b-blocks' ) }
					value={ namePlaceholder }
					onChange={ ( val ) => setAttributes( { namePlaceholder: val } ) }
					placeholder={ __( 'Your name', 'b-blocks' ) }
				/>
			) }

			<TextControl
				label={ __( 'Email Placeholder', 'b-blocks' ) }
				value={ emailPlaceholder }
				onChange={ ( val ) => setAttributes( { emailPlaceholder: val } ) }
				placeholder={ __( 'Your email address', 'b-blocks' ) }
			/>

			<TextControl
				label={ __( 'CTA Button Label', 'b-blocks' ) }
				value={ ctaLabel }
				onChange={ ( val ) => setAttributes( { ctaLabel: val } ) }
				placeholder={ __( 'Subscribe', 'b-blocks' ) }
			/>

			<TextControl
				label={ __( 'Dismiss Link Text', 'b-blocks' ) }
				value={ dismissLabel }
				onChange={ ( val ) => setAttributes( { dismissLabel: val } ) }
				help={ __( 'Leave empty to hide the dismiss link.', 'b-blocks' ) }
			/>

			<TextControl
				label={ __( 'Success Message', 'b-blocks' ) }
				value={ successMessage }
				onChange={ ( val ) => setAttributes( { successMessage: val } ) }
				placeholder={ __( "Thanks! You're on the list.", 'b-blocks' ) }
			/>

			<TextControl
				type='email'
				label={ __( 'Lead Notification Email', 'b-blocks' ) }
				value={ adminEmail }
				onChange={ ( val ) => setAttributes( { adminEmail: val } ) }
				placeholder={ __( 'Site admin email', 'b-blocks' ) }
				help={ __( 'Leads are emailed here. Leave empty to use the site admin email. This recipient is resolved server-side and never accepted from the browser.', 'b-blocks' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style', 'b-blocks' ) }>
			<RangeControl
				label={ __( 'Max Width (px)', 'b-blocks' ) }
				value={ maxWidth }
				onChange={ ( val ) => setAttributes( { maxWidth: val } ) }
				min={ 320 }
				max={ 800 }
				step={ 10 }
			/>

			<ColorControl
				label={ __( 'Card Background:', 'b-blocks' ) }
				value={ bgColor }
				onChange={ ( val ) => setAttributes( { bgColor: val } ) }
				defaultColor='#ffffff'
			/>

			<ColorControl
				label={ __( 'Text Color:', 'b-blocks' ) }
				value={ textColor }
				onChange={ ( val ) => setAttributes( { textColor: val } ) }
				defaultColor='#1a1a1a'
			/>

			<ColorControl
				label={ __( 'Accent Color:', 'b-blocks' ) }
				value={ accentColor }
				onChange={ ( val ) => setAttributes( { accentColor: val } ) }
				defaultColor='#146EF5'
			/>

			<ColorControl
				label={ __( 'Accent Text Color:', 'b-blocks' ) }
				value={ accentTextColor }
				onChange={ ( val ) => setAttributes( { accentTextColor: val } ) }
				defaultColor='#ffffff'
			/>

			<ColorControl
				label={ __( 'Overlay Color:', 'b-blocks' ) }
				value={ overlayColor }
				onChange={ ( val ) => setAttributes( { overlayColor: val } ) }
				defaultColor='rgba(0,0,0,0.6)'
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
				min={ 12 }
				max={ 80 }
				step={ 1 }
			/>

			<ColorControl
				label={ __( 'Input Border Color:', 'b-blocks' ) }
				value={ inputBorderColor }
				onChange={ ( val ) => setAttributes( { inputBorderColor: val } ) }
				defaultColor='#dddddd'
			/>

			<RangeControl
				label={ __( 'Input Border Radius (px)', 'b-blocks' ) }
				value={ inputBorderRadius }
				onChange={ ( val ) => setAttributes( { inputBorderRadius: val } ) }
				min={ 0 }
				max={ 24 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Headline Font Size (px)', 'b-blocks' ) }
				value={ headlineFontSize }
				onChange={ ( val ) => setAttributes( { headlineFontSize: val } ) }
				min={ 14 }
				max={ 48 }
				step={ 1 }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Headline Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ headlineFontWeight }
					options={ headlineWeightOptions }
					onChange={ ( val ) => setAttributes( { headlineFontWeight: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Subtext Font Size (px)', 'b-blocks' ) }
				value={ subtextFontSize }
				onChange={ ( val ) => setAttributes( { subtextFontSize: val } ) }
				min={ 12 }
				max={ 24 }
				step={ 1 }
			/>

			<ToggleControl
				label={ __( 'Show Close Button', 'b-blocks' ) }
				checked={ !! showCloseButton }
				onChange={ ( val ) => setAttributes( { showCloseButton: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Animation', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Open Animation:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ openAnimation }
					options={ animationOptions }
					onChange={ ( val ) => setAttributes( { openAnimation: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Animation Duration (ms)', 'b-blocks' ) }
				value={ animationDuration }
				onChange={ ( val ) => setAttributes( { animationDuration: val } ) }
				min={ 100 }
				max={ 600 }
				step={ 10 }
				help={ __( 'Disabled when the visitor prefers reduced motion.', 'b-blocks' ) }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

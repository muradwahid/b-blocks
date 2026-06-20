import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../utils/data';
import { headlineTagOptions, layoutOptions, onExpireOptions, fontWeightOptions } from '../../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		headlineTag, subText, destDate,
		showDays, showHours, showMinutes, showSeconds,
		daysLabel, hoursLabel, minutesLabel, secondsLabel,
		showButton, buttonLabel, buttonUrl, buttonNewTab,
		layout, contentMaxWidth, paddingV, paddingH,
		backgroundColor, textColor, fontSize, fontWeight,
		timerDigitColor, timerLabelColor, timerSeparatorColor, timerDigitSize, timerLabelSize,
		buttonBg, buttonTextColor, buttonHoverBg, buttonHoverTextColor,
		buttonBorderRadius, buttonPaddingV, buttonPaddingH,
		onExpire, expiredMessage, zIndex
	} = attributes;

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) }>
			<p style={ { fontSize: '12px', color: '#666', marginTop: 0 } }>
				{ __( 'Edit the headline directly in the strip on the canvas. Supports bold, italic, and links.', 'b-blocks' ) }
			</p>

			<PanelRow>
				<Label className=''>{ __( 'Headline Tag:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ headlineTag }
					options={ headlineTagOptions }
					onChange={ ( val ) => setAttributes( { headlineTag: val } ) }
				/>
			</PanelRow>

			<TextControl
				label={ __( 'Subtext (optional)', 'b-blocks' ) }
				value={ subText }
				onChange={ ( val ) => setAttributes( { subText: val } ) }
				placeholder={ __( 'Up to 50% off everything', 'b-blocks' ) }
			/>

			<ToggleControl
				label={ __( 'Show Button', 'b-blocks' ) }
				checked={ !! showButton }
				onChange={ ( val ) => setAttributes( { showButton: val } ) }
			/>

			{ showButton && <>
				<TextControl
					label={ __( 'Button Label', 'b-blocks' ) }
					value={ buttonLabel }
					onChange={ ( val ) => setAttributes( { buttonLabel: val } ) }
					placeholder={ __( 'Shop Now', 'b-blocks' ) }
				/>

				<TextControl
					label={ __( 'Button URL', 'b-blocks' ) }
					type='url'
					value={ buttonUrl }
					onChange={ ( val ) => setAttributes( { buttonUrl: val } ) }
					placeholder='https://example.com/'
				/>

				<ToggleControl
					label={ __( 'Open in new tab', 'b-blocks' ) }
					checked={ !! buttonNewTab }
					onChange={ ( val ) => setAttributes( { buttonNewTab: val } ) }
				/>
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Countdown Timer', 'b-blocks' ) } initialOpen={ false }>
			<TextControl
				label={ __( 'End Date / Time', 'b-blocks' ) }
				type='datetime-local'
				value={ destDate }
				onChange={ ( val ) => setAttributes( { destDate: val } ) }
				help={ __( 'Leave empty to keep the timer at 00. Uses the visitor’s local time.', 'b-blocks' ) }
			/>

			<ToggleControl
				label={ __( 'Show Days', 'b-blocks' ) }
				checked={ !! showDays }
				onChange={ ( val ) => setAttributes( { showDays: val } ) }
			/>
			{ showDays && (
				<TextControl
					label={ __( 'Days Label', 'b-blocks' ) }
					value={ daysLabel }
					onChange={ ( val ) => setAttributes( { daysLabel: val } ) }
				/>
			) }

			<ToggleControl
				label={ __( 'Show Hours', 'b-blocks' ) }
				checked={ !! showHours }
				onChange={ ( val ) => setAttributes( { showHours: val } ) }
			/>
			{ showHours && (
				<TextControl
					label={ __( 'Hours Label', 'b-blocks' ) }
					value={ hoursLabel }
					onChange={ ( val ) => setAttributes( { hoursLabel: val } ) }
				/>
			) }

			<ToggleControl
				label={ __( 'Show Minutes', 'b-blocks' ) }
				checked={ !! showMinutes }
				onChange={ ( val ) => setAttributes( { showMinutes: val } ) }
			/>
			{ showMinutes && (
				<TextControl
					label={ __( 'Minutes Label', 'b-blocks' ) }
					value={ minutesLabel }
					onChange={ ( val ) => setAttributes( { minutesLabel: val } ) }
				/>
			) }

			<ToggleControl
				label={ __( 'Show Seconds', 'b-blocks' ) }
				checked={ !! showSeconds }
				onChange={ ( val ) => setAttributes( { showSeconds: val } ) }
			/>
			{ showSeconds && (
				<TextControl
					label={ __( 'Seconds Label', 'b-blocks' ) }
					value={ secondsLabel }
					onChange={ ( val ) => setAttributes( { secondsLabel: val } ) }
				/>
			) }

			<PanelRow>
				<Label className=''>{ __( 'On Expire:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ onExpire }
					options={ onExpireOptions }
					onChange={ ( val ) => setAttributes( { onExpire: val } ) }
				/>
			</PanelRow>

			{ 'message' === onExpire && (
				<TextControl
					label={ __( 'Expired Message', 'b-blocks' ) }
					value={ expiredMessage }
					onChange={ ( val ) => setAttributes( { expiredMessage: val } ) }
					placeholder={ __( 'This offer has ended.', 'b-blocks' ) }
				/>
			) }
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
				label={ __( 'Content Max Width (px)', 'b-blocks' ) }
				value={ contentMaxWidth }
				onChange={ ( val ) => setAttributes( { contentMaxWidth: val } ) }
				min={ 400 }
				max={ 1800 }
				step={ 20 }
				help={ __( 'The inner content wrapper width. The strip background always spans full width.', 'b-blocks' ) }
			/>

			<RangeControl
				label={ __( 'Vertical Padding (px)', 'b-blocks' ) }
				value={ paddingV }
				onChange={ ( val ) => setAttributes( { paddingV: val } ) }
				min={ 0 }
				max={ 96 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Horizontal Padding (px)', 'b-blocks' ) }
				value={ paddingH }
				onChange={ ( val ) => setAttributes( { paddingH: val } ) }
				min={ 0 }
				max={ 120 }
				step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Background Color:', 'b-blocks' ) }
				value={ backgroundColor }
				onChange={ ( val ) => setAttributes( { backgroundColor: val } ) }
				defaultColor='#1a1a2e'
			/>

			<ColorControl
				label={ __( 'Text Color:', 'b-blocks' ) }
				value={ textColor }
				onChange={ ( val ) => setAttributes( { textColor: val } ) }
				defaultColor='#ffffff'
			/>

			<RangeControl
				label={ __( 'Headline Font Size (px)', 'b-blocks' ) }
				value={ fontSize }
				onChange={ ( val ) => setAttributes( { fontSize: val } ) }
				min={ 12 }
				max={ 48 }
				step={ 1 }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Headline Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ fontWeight }
					options={ fontWeightOptions }
					onChange={ ( val ) => setAttributes( { fontWeight: val } ) }
				/>
			</PanelRow>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Timer Style', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Digit Color:', 'b-blocks' ) }
				value={ timerDigitColor }
				onChange={ ( val ) => setAttributes( { timerDigitColor: val } ) }
				defaultColor='#ffffff'
			/>

			<ColorControl
				label={ __( 'Label Color:', 'b-blocks' ) }
				value={ timerLabelColor }
				onChange={ ( val ) => setAttributes( { timerLabelColor: val } ) }
				defaultColor='#cccccc'
			/>

			<ColorControl
				label={ __( 'Separator Color:', 'b-blocks' ) }
				value={ timerSeparatorColor }
				onChange={ ( val ) => setAttributes( { timerSeparatorColor: val } ) }
				defaultColor='#ffffff'
			/>

			<RangeControl
				label={ __( 'Digit Font Size (px)', 'b-blocks' ) }
				value={ timerDigitSize }
				onChange={ ( val ) => setAttributes( { timerDigitSize: val } ) }
				min={ 16 }
				max={ 64 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Label Font Size (px)', 'b-blocks' ) }
				value={ timerLabelSize }
				onChange={ ( val ) => setAttributes( { timerLabelSize: val } ) }
				min={ 8 }
				max={ 24 }
				step={ 1 }
			/>
		</PanelBody>

		{ showButton && (
			<PanelBody className='bPlPanelBody' title={ __( 'Button Style', 'b-blocks' ) } initialOpen={ false }>
				<ColorControl
					label={ __( 'Background Color:', 'b-blocks' ) }
					value={ buttonBg }
					onChange={ ( val ) => setAttributes( { buttonBg: val } ) }
					defaultColor='#e63946'
				/>

				<ColorControl
					label={ __( 'Text Color:', 'b-blocks' ) }
					value={ buttonTextColor }
					onChange={ ( val ) => setAttributes( { buttonTextColor: val } ) }
					defaultColor='#ffffff'
				/>

				<ColorControl
					label={ __( 'Hover Background:', 'b-blocks' ) }
					value={ buttonHoverBg }
					onChange={ ( val ) => setAttributes( { buttonHoverBg: val } ) }
					defaultColor='#c1121f'
				/>

				<ColorControl
					label={ __( 'Hover Text Color:', 'b-blocks' ) }
					value={ buttonHoverTextColor }
					onChange={ ( val ) => setAttributes( { buttonHoverTextColor: val } ) }
					defaultColor='#ffffff'
				/>

				<RangeControl
					label={ __( 'Border Radius (px)', 'b-blocks' ) }
					value={ buttonBorderRadius }
					onChange={ ( val ) => setAttributes( { buttonBorderRadius: val } ) }
					min={ 0 }
					max={ 9999 }
					step={ 1 }
				/>

				<RangeControl
					label={ __( 'Vertical Padding (px)', 'b-blocks' ) }
					value={ buttonPaddingV }
					onChange={ ( val ) => setAttributes( { buttonPaddingV: val } ) }
					min={ 0 }
					max={ 48 }
					step={ 1 }
				/>

				<RangeControl
					label={ __( 'Horizontal Padding (px)', 'b-blocks' ) }
					value={ buttonPaddingH }
					onChange={ ( val ) => setAttributes( { buttonPaddingH: val } ) }
					min={ 0 }
					max={ 80 }
					step={ 1 }
				/>
			</PanelBody>
		) }

		<PanelBody className='bPlPanelBody' title={ __( 'Advanced', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Z-Index', 'b-blocks' ) }
				value={ zIndex }
				onChange={ ( val ) => setAttributes( { zIndex: val } ) }
				min={ 1 }
				max={ 9999 }
				step={ 1 }
				help={ __( 'Raise if the strip appears behind other positioned elements.', 'b-blocks' ) }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../utils/data';
import { buttonAlignOptions } from '../../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		previewHeight, showMoreText, showLessText, showToggle,
		fadeHeight, fadeColor, buttonAlign,
		buttonBgColor, buttonTextColor, buttonBorderRadius,
		buttonPaddingV, buttonPaddingH, buttonFontSize,
		animationDuration, persistState
	} = attributes;

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) }>
			<TextControl
				label={ __( 'Show More Label', 'b-blocks' ) }
				value={ showMoreText }
				onChange={ ( val ) => setAttributes( { showMoreText: val } ) }
				placeholder={ __( 'Show More', 'b-blocks' ) }
			/>

			<TextControl
				label={ __( 'Show Less Label', 'b-blocks' ) }
				value={ showLessText }
				onChange={ ( val ) => setAttributes( { showLessText: val } ) }
				placeholder={ __( 'Show Less', 'b-blocks' ) }
			/>

			<ToggleControl
				label={ __( 'Show collapse button after expanding', 'b-blocks' ) }
				checked={ !! showToggle }
				onChange={ ( val ) => setAttributes( { showToggle: val } ) }
				help={ __( 'When disabled, visitors can expand once and the content stays open.', 'b-blocks' ) }
			/>

			<ToggleControl
				label={ __( 'Remember state for the visitor', 'b-blocks' ) }
				checked={ !! persistState }
				onChange={ ( val ) => setAttributes( { persistState: val } ) }
				help={ __( 'Saves the open / closed state in sessionStorage so it persists across page navigation in the same tab.', 'b-blocks' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Collapsed Preview Height (px)', 'b-blocks' ) }
				value={ previewHeight }
				onChange={ ( val ) => setAttributes( { previewHeight: val } ) }
				min={ 50 }
				max={ 600 }
				step={ 10 }
				help={ __( 'How much of the content stays visible before the Show More button.', 'b-blocks' ) }
			/>

			<RangeControl
				label={ __( 'Fade Overlay Height (px)', 'b-blocks' ) }
				value={ fadeHeight }
				onChange={ ( val ) => setAttributes( { fadeHeight: val } ) }
				min={ 0 }
				max={ 200 }
				step={ 10 }
				help={ __( 'Set to 0 to hide the fade overlay entirely.', 'b-blocks' ) }
			/>

			<ColorControl
				label={ __( 'Fade Color:', 'b-blocks' ) }
				value={ fadeColor }
				onChange={ ( val ) => setAttributes( { fadeColor: val } ) }
				defaultColor='#ffffff'
			/>
			<p className='components-base-control__help' style={ { marginTop: '-8px' } }>
				{ __( 'Match your page background color so the fade blends seamlessly.', 'b-blocks' ) }
			</p>

			<PanelRow>
				<Label className=''>{ __( 'Button Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ buttonAlign }
					options={ buttonAlignOptions }
					onChange={ ( val ) => setAttributes( { buttonAlign: val } ) }
				/>
			</PanelRow>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Button Style', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Background Color:', 'b-blocks' ) }
				value={ buttonBgColor }
				onChange={ ( val ) => setAttributes( { buttonBgColor: val } ) }
				defaultColor='#0073aa'
			/>

			<ColorControl
				label={ __( 'Text Color:', 'b-blocks' ) }
				value={ buttonTextColor }
				onChange={ ( val ) => setAttributes( { buttonTextColor: val } ) }
				defaultColor='#ffffff'
			/>

			<RangeControl
				label={ __( 'Border Radius (px)', 'b-blocks' ) }
				value={ buttonBorderRadius }
				onChange={ ( val ) => setAttributes( { buttonBorderRadius: val } ) }
				min={ 0 }
				max={ 50 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Vertical Padding (px)', 'b-blocks' ) }
				value={ buttonPaddingV }
				onChange={ ( val ) => setAttributes( { buttonPaddingV: val } ) }
				min={ 4 }
				max={ 40 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Horizontal Padding (px)', 'b-blocks' ) }
				value={ buttonPaddingH }
				onChange={ ( val ) => setAttributes( { buttonPaddingH: val } ) }
				min={ 8 }
				max={ 80 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Font Size (px)', 'b-blocks' ) }
				value={ buttonFontSize }
				onChange={ ( val ) => setAttributes( { buttonFontSize: val } ) }
				min={ 10 }
				max={ 28 }
				step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Behavior', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Animation Duration (ms)', 'b-blocks' ) }
				value={ animationDuration }
				onChange={ ( val ) => setAttributes( { animationDuration: val } ) }
				min={ 0 }
				max={ 1000 }
				step={ 50 }
				help={ __( 'Set to 0 to snap instantly. The animation is also disabled automatically when the visitor has prefers-reduced-motion enabled.', 'b-blocks' ) }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

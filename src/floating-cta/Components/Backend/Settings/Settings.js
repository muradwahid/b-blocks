import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
	RangeControl,
	ColorPalette,
	BaseControl
} from '@wordpress/components';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		label,
		url,
		newTab,
		iconClass,
		iconSize,
		iconGap,
		fontSize,
		fontWeight,
		ariaLabel,
		position,
		offsetX,
		offsetY,
		paddingV,
		paddingH,
		borderRadius,
		zIndex,
		bgColor,
		textColor,
		hoverBgColor,
		hoverTextColor,
		shadow,
		scrollTrigger,
		showDismiss,
		animateIn,
		animateDuration
	} = attributes;

	const hasLabel = !! label;
	const hasIcon = !! iconClass;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Link', 'b-blocks' ) } initialOpen={ true }>
				<TextControl
					label={ __( 'URL', 'b-blocks' ) }
					type="url"
					value={ url }
					onChange={ ( value ) => setAttributes( { url: value } ) }
					placeholder="https://"
					help={ __( 'Use tel: or https://wa.me/ for call and chat links.', 'b-blocks' ) }
				/>
				<ToggleControl
					label={ __( 'Open in new tab', 'b-blocks' ) }
					checked={ newTab }
					onChange={ ( value ) => setAttributes( { newTab: value } ) }
				/>
			</PanelBody>

			<PanelBody title={ __( 'Content', 'b-blocks' ) } initialOpen={ false }>
				<TextControl
					label={ __( 'Label', 'b-blocks' ) }
					value={ label }
					onChange={ ( value ) => setAttributes( { label: value } ) }
					help={ __( 'Leave blank for icon-only mode.', 'b-blocks' ) }
				/>
				<TextControl
					label={ __( 'Icon class', 'b-blocks' ) }
					value={ iconClass }
					onChange={ ( value ) => setAttributes( { iconClass: value } ) }
					help={ __( 'Font Awesome class, e.g. fas fa-phone. Leave blank to hide.', 'b-blocks' ) }
				/>
				<RangeControl
					label={ __( 'Icon size (px)', 'b-blocks' ) }
					value={ iconSize }
					onChange={ ( value ) => setAttributes( { iconSize: value } ) }
					min={ 10 }
					max={ 48 }
				/>
				<RangeControl
					label={ __( 'Icon gap (px)', 'b-blocks' ) }
					value={ iconGap }
					onChange={ ( value ) => setAttributes( { iconGap: value } ) }
					min={ 0 }
					max={ 24 }
					disabled={ ! hasLabel || ! hasIcon }
				/>
				<RangeControl
					label={ __( 'Font size (px)', 'b-blocks' ) }
					value={ fontSize }
					onChange={ ( value ) => setAttributes( { fontSize: value } ) }
					min={ 10 }
					max={ 28 }
					disabled={ ! hasLabel }
				/>
				<SelectControl
					label={ __( 'Font weight', 'b-blocks' ) }
					value={ fontWeight }
					options={ [
						{ label: __( 'Normal (400)', 'b-blocks' ), value: '400' },
						{ label: __( 'Medium (500)', 'b-blocks' ), value: '500' },
						{ label: __( 'Semi Bold (600)', 'b-blocks' ), value: '600' },
						{ label: __( 'Bold (700)', 'b-blocks' ), value: '700' }
					] }
					onChange={ ( value ) => setAttributes( { fontWeight: value } ) }
					disabled={ ! hasLabel }
				/>
				<TextControl
					label={ __( 'Accessible label override', 'b-blocks' ) }
					value={ ariaLabel }
					onChange={ ( value ) => setAttributes( { ariaLabel: value } ) }
					help={ __( 'Required if the button is icon-only.', 'b-blocks' ) }
				/>
			</PanelBody>

			<PanelBody title={ __( 'Position & Spacing', 'b-blocks' ) } initialOpen={ false }>
				<SelectControl
					label={ __( 'Corner', 'b-blocks' ) }
					value={ position }
					options={ [
						{ label: __( 'Bottom Right', 'b-blocks' ), value: 'bottom-right' },
						{ label: __( 'Bottom Left', 'b-blocks' ), value: 'bottom-left' },
						{ label: __( 'Top Right', 'b-blocks' ), value: 'top-right' },
						{ label: __( 'Top Left', 'b-blocks' ), value: 'top-left' }
					] }
					onChange={ ( value ) => setAttributes( { position: value } ) }
				/>
				<RangeControl
					label={ __( 'Horizontal offset (px)', 'b-blocks' ) }
					value={ offsetX }
					onChange={ ( value ) => setAttributes( { offsetX: value } ) }
					min={ 8 }
					max={ 120 }
				/>
				<RangeControl
					label={ __( 'Vertical offset (px)', 'b-blocks' ) }
					value={ offsetY }
					onChange={ ( value ) => setAttributes( { offsetY: value } ) }
					min={ 8 }
					max={ 120 }
				/>
				<RangeControl
					label={ __( 'Padding (vertical, px)', 'b-blocks' ) }
					value={ paddingV }
					onChange={ ( value ) => setAttributes( { paddingV: value } ) }
					min={ 4 }
					max={ 48 }
				/>
				<RangeControl
					label={ __( 'Padding (horizontal, px)', 'b-blocks' ) }
					value={ paddingH }
					onChange={ ( value ) => setAttributes( { paddingH: value } ) }
					min={ 8 }
					max={ 80 }
				/>
				<RangeControl
					label={ __( 'Border radius (px)', 'b-blocks' ) }
					value={ borderRadius }
					onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
					min={ 0 }
					max={ 9999 }
					help={ __( 'Set to 9999 for pill shape.', 'b-blocks' ) }
				/>
				<RangeControl
					label={ __( 'Z-index', 'b-blocks' ) }
					value={ zIndex }
					onChange={ ( value ) => setAttributes( { zIndex: value } ) }
					min={ 1 }
					max={ 99999 }
				/>
			</PanelBody>

			<PanelBody title={ __( 'Colors', 'b-blocks' ) } initialOpen={ false }>
				<BaseControl label={ __( 'Background', 'b-blocks' ) }>
					<ColorPalette
						value={ bgColor }
						onChange={ ( value ) => setAttributes( { bgColor: value || '' } ) }
					/>
				</BaseControl>
				<BaseControl label={ __( 'Text / Icon', 'b-blocks' ) }>
					<ColorPalette
						value={ textColor }
						onChange={ ( value ) => setAttributes( { textColor: value || '' } ) }
					/>
				</BaseControl>
				<BaseControl label={ __( 'Hover background', 'b-blocks' ) }>
					<ColorPalette
						value={ hoverBgColor }
						onChange={ ( value ) => setAttributes( { hoverBgColor: value || '' } ) }
					/>
				</BaseControl>
				<BaseControl label={ __( 'Hover text / icon', 'b-blocks' ) }>
					<ColorPalette
						value={ hoverTextColor }
						onChange={ ( value ) => setAttributes( { hoverTextColor: value || '' } ) }
					/>
				</BaseControl>
				<ToggleControl
					label={ __( 'Box shadow', 'b-blocks' ) }
					checked={ shadow }
					onChange={ ( value ) => setAttributes( { shadow: value } ) }
				/>
			</PanelBody>

			<PanelBody title={ __( 'Behavior', 'b-blocks' ) } initialOpen={ false }>
				<RangeControl
					label={ __( 'Scroll trigger (px)', 'b-blocks' ) }
					value={ scrollTrigger }
					onChange={ ( value ) => setAttributes( { scrollTrigger: value } ) }
					min={ 0 }
					max={ 2000 }
					help={ __( '0 = always visible.', 'b-blocks' ) }
				/>
				<ToggleControl
					label={ __( 'Show dismiss button', 'b-blocks' ) }
					checked={ showDismiss }
					onChange={ ( value ) => setAttributes( { showDismiss: value } ) }
				/>
				<SelectControl
					label={ __( 'Entry animation', 'b-blocks' ) }
					value={ animateIn }
					options={ [
						{ label: __( 'Fade', 'b-blocks' ), value: 'fade' },
						{ label: __( 'Slide', 'b-blocks' ), value: 'slide' },
						{ label: __( 'None', 'b-blocks' ), value: 'none' }
					] }
					onChange={ ( value ) => setAttributes( { animateIn: value } ) }
				/>
				<RangeControl
					label={ __( 'Animation duration (ms)', 'b-blocks' ) }
					value={ animateDuration }
					onChange={ ( value ) => setAttributes( { animateDuration: value } ) }
					min={ 0 }
					max={ 800 }
					disabled={ animateIn === 'none' }
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;

import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

const TYPE_OPTIONS = [
	{ label: __( 'Note (blue)', 'b-blocks' ), value: 'note' },
	{ label: __( 'Tip (green)', 'b-blocks' ), value: 'tip' },
	{ label: __( 'Warning (amber)', 'b-blocks' ), value: 'warning' },
	{ label: __( 'Danger (red)', 'b-blocks' ), value: 'danger' },
	{ label: __( 'Success (emerald)', 'b-blocks' ), value: 'success' }
];

const LAYOUT_OPTIONS = [
	{ label: __( 'Accent Bar — left border + tinted background', 'b-blocks' ), value: 'accent-bar' },
	{ label: __( 'Filled — solid colored background', 'b-blocks' ), value: 'filled' },
	{ label: __( 'Outlined — transparent with 1px border', 'b-blocks' ), value: 'outlined' }
];

const ALIGN_OPTIONS = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

const TITLE_TAG_OPTIONS = [
	{ label: __( 'H2', 'b-blocks' ), value: 'h2' },
	{ label: __( 'H3', 'b-blocks' ), value: 'h3' },
	{ label: __( 'H4 (default)', 'b-blocks' ), value: 'h4' },
	{ label: __( 'H5', 'b-blocks' ), value: 'h5' },
	{ label: __( 'H6', 'b-blocks' ), value: 'h6' },
	{ label: __( 'Paragraph (no heading)', 'b-blocks' ), value: 'p' }
];

const FONT_WEIGHT_OPTIONS = [
	{ label: __( '300 — Light', 'b-blocks' ), value: '300' },
	{ label: __( '400 — Normal', 'b-blocks' ), value: '400' },
	{ label: __( '500 — Medium', 'b-blocks' ), value: '500' },
	{ label: __( '600 — Semi-bold', 'b-blocks' ), value: '600' },
	{ label: __( '700 — Bold', 'b-blocks' ), value: '700' },
	{ label: __( '800 — Extra-bold', 'b-blocks' ), value: '800' }
];

const Settings = ( { attributes, setAttributes, typePresets, onTypeChange } ) => {
	const {
		calloutType,
		layout,
		titleTag,
		showTitle,
		showIcon,
		iconClass,
		iconSize,
		alignment,
		accentColor,
		backgroundColor,
		titleColor,
		bodyColor,
		iconColor,
		accentBarWidth,
		borderRadius,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		titleFontSize,
		titleFontWeight,
		bodyFontSize
	} = attributes;

	const safeType = ( typePresets && typePresets[ calloutType ] ) ? calloutType : 'note';
	const preset = typePresets[ safeType ];

	const isAccentBar = ( layout || 'accent-bar' ) === 'accent-bar';

	const resetColorsToType = () => {
		setAttributes( {
			accentColor: '',
			backgroundColor: '',
			titleColor: '',
			bodyColor: '',
			iconColor: ''
		} );
	};

	const resetIconToType = () => {
		setAttributes( { iconClass: preset.icon } );
	};

	return (
		<InspectorControls>
			<HelpPanel slug={ pluginSlug } />

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Callout Type', 'b-blocks' ) }
				initialOpen={ true }
			>
				<SelectControl
					label={ __( 'Type', 'b-blocks' ) }
					value={ safeType }
					options={ TYPE_OPTIONS }
					onChange={ ( val ) => onTypeChange( val ) }
					help={ __( 'Switching type updates the default icon and colors. Any per-instance overrides you set in the Style panel are kept.', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={ __( 'Layout', 'b-blocks' ) }
					value={ layout || 'accent-bar' }
					options={ LAYOUT_OPTIONS }
					onChange={ ( val ) => setAttributes( { layout: val } ) }
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={ __( 'Alignment', 'b-blocks' ) }
					value={ alignment || 'left' }
					options={ ALIGN_OPTIONS }
					onChange={ ( val ) => setAttributes( { alignment: val } ) }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Title & Icon', 'b-blocks' ) }
				initialOpen={ true }
			>
				<ToggleControl
					label={ __( 'Show Title', 'b-blocks' ) }
					checked={ !! showTitle }
					onChange={ ( val ) => setAttributes( { showTitle: val } ) }
				/>

				{ showTitle && (
					<>
						<SelectControl
							label={ __( 'Title Tag', 'b-blocks' ) }
							value={ titleTag || 'h4' }
							options={ TITLE_TAG_OPTIONS }
							onChange={ ( val ) => setAttributes( { titleTag: val } ) }
							help={ __( 'Use a heading tag for proper document outline. Switch to Paragraph if the callout sits inside another heading section.', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<RangeControl
							label={ __( 'Title Font Size (px)', 'b-blocks' ) }
							value={ titleFontSize ?? 15 }
							onChange={ ( val ) => setAttributes( { titleFontSize: val } ) }
							min={ 10 }
							max={ 48 }
							step={ 1 }
							__nextHasNoMarginBottom
						/>

						<SelectControl
							label={ __( 'Title Font Weight', 'b-blocks' ) }
							value={ titleFontWeight || '600' }
							options={ FONT_WEIGHT_OPTIONS }
							onChange={ ( val ) => setAttributes( { titleFontWeight: val } ) }
							__nextHasNoMarginBottom
						/>
					</>
				) }

				<ToggleControl
					label={ __( 'Show Icon', 'b-blocks' ) }
					checked={ !! showIcon }
					onChange={ ( val ) => setAttributes( { showIcon: val } ) }
				/>

				{ showIcon && (
					<>
						<TextControl
							label={ __( 'Icon Class (Font Awesome)', 'b-blocks' ) }
							value={ iconClass || '' }
							onChange={ ( val ) => setAttributes( { iconClass: val } ) }
							placeholder={ preset.icon }
							help={ __( 'Any Font Awesome 6 class string, e.g. fa-solid fa-lightbulb.', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<Button
							variant='link'
							onClick={ resetIconToType }
							style={ { marginTop: 4, marginBottom: 12 } }
						>
							{ __( 'Reset icon to type default', 'b-blocks' ) }
						</Button>

						<RangeControl
							label={ __( 'Icon Size (px)', 'b-blocks' ) }
							value={ iconSize ?? 20 }
							onChange={ ( val ) => setAttributes( { iconSize: val } ) }
							min={ 12 }
							max={ 64 }
							step={ 1 }
							__nextHasNoMarginBottom
						/>
					</>
				) }

				<RangeControl
					label={ __( 'Body Font Size (px)', 'b-blocks' ) }
					value={ bodyFontSize ?? 15 }
					onChange={ ( val ) => setAttributes( { bodyFontSize: val } ) }
					min={ 10 }
					max={ 36 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Style', 'b-blocks' ) }
				initialOpen={ false }
			>
				<p style={ { margin: '0 0 12px', fontSize: 11, color: '#777' } }>
					{ __( 'Leave a color blank to inherit the type default. Color contrast is not validated automatically — keep title ≥ 3:1 and body ≥ 4.5:1 against the background for WCAG AA.', 'b-blocks' ) }
				</p>

				<PanelRow>
					<Label className=''>{ __( 'Accent / Border:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ accentColor || '' }
						onChange={ ( val ) => setAttributes( { accentColor: val || '' } ) }
						defaultColor={ preset.accent }
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Background:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ backgroundColor || '' }
						onChange={ ( val ) => setAttributes( { backgroundColor: val || '' } ) }
						defaultColor={ preset.bg }
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Title Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ titleColor || '' }
						onChange={ ( val ) => setAttributes( { titleColor: val || '' } ) }
						defaultColor={ preset.title }
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Body Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ bodyColor || '' }
						onChange={ ( val ) => setAttributes( { bodyColor: val || '' } ) }
						defaultColor={ preset.body }
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Icon Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ iconColor || '' }
						onChange={ ( val ) => setAttributes( { iconColor: val || '' } ) }
						defaultColor={ preset.accent }
					/>
				</PanelRow>

				<Button
					variant='link'
					isDestructive
					onClick={ resetColorsToType }
					style={ { marginTop: 4, marginBottom: 12 } }
				>
					{ __( 'Reset all colors to type defaults', 'b-blocks' ) }
				</Button>

				{ isAccentBar && (
					<RangeControl
						label={ __( 'Accent Bar Width (px)', 'b-blocks' ) }
						value={ accentBarWidth ?? 4 }
						onChange={ ( val ) => setAttributes( { accentBarWidth: val } ) }
						min={ 1 }
						max={ 16 }
						step={ 1 }
						__nextHasNoMarginBottom
					/>
				) }

				<RangeControl
					label={ __( 'Border Radius (px)', 'b-blocks' ) }
					value={ borderRadius ?? 6 }
					onChange={ ( val ) => setAttributes( { borderRadius: val } ) }
					min={ 0 }
					max={ 32 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Spacing', 'b-blocks' ) }
				initialOpen={ false }
			>
				<RangeControl
					label={ __( 'Padding Top (px)', 'b-blocks' ) }
					value={ paddingTop ?? 16 }
					onChange={ ( val ) => setAttributes( { paddingTop: val } ) }
					min={ 0 }
					max={ 96 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Padding Right (px)', 'b-blocks' ) }
					value={ paddingRight ?? 20 }
					onChange={ ( val ) => setAttributes( { paddingRight: val } ) }
					min={ 0 }
					max={ 96 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Padding Bottom (px)', 'b-blocks' ) }
					value={ paddingBottom ?? 16 }
					onChange={ ( val ) => setAttributes( { paddingBottom: val } ) }
					min={ 0 }
					max={ 96 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Padding Left (px)', 'b-blocks' ) }
					value={ paddingLeft ?? 20 }
					onChange={ ( val ) => setAttributes( { paddingLeft: val } ) }
					min={ 0 }
					max={ 96 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;

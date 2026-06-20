import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	TextControl
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

const TYPE_OPTIONS = [
	{ label: __( 'Plain Line', 'b-blocks' ), value: 'line' },
	{ label: __( 'Line with Icon', 'b-blocks' ), value: 'icon' },
	{ label: __( 'Line with Text Label', 'b-blocks' ), value: 'text' }
];

const LINE_STYLE_OPTIONS = [
	{ label: __( 'Solid', 'b-blocks' ), value: 'solid' },
	{ label: __( 'Dashed', 'b-blocks' ), value: 'dashed' },
	{ label: __( 'Dotted', 'b-blocks' ), value: 'dotted' },
	{ label: __( 'Double', 'b-blocks' ), value: 'double' }
];

const ALIGN_OPTIONS = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

const FONT_WEIGHT_OPTIONS = [
	{ label: __( '400 — Normal', 'b-blocks' ), value: '400' },
	{ label: __( '500 — Medium', 'b-blocks' ), value: '500' },
	{ label: __( '600 — Semi-bold', 'b-blocks' ), value: '600' },
	{ label: __( '700 — Bold', 'b-blocks' ), value: '700' }
];

const TEXT_TRANSFORM_OPTIONS = [
	{ label: __( 'None', 'b-blocks' ), value: 'none' },
	{ label: __( 'UPPERCASE', 'b-blocks' ), value: 'uppercase' },
	{ label: __( 'Capitalize', 'b-blocks' ), value: 'capitalize' },
	{ label: __( 'lowercase', 'b-blocks' ), value: 'lowercase' }
];

const Settings = ( { attributes, setAttributes } ) => {
	const {
		type,
		lineStyle,
		lineColor,
		lineWidth,
		width,
		alignment,
		marginTop,
		marginBottom,
		iconClass,
		iconSize,
		iconColor,
		iconBgColor,
		iconPadding,
		iconBorderRadius,
		text,
		textColor,
		textBgColor,
		textFontSize,
		textFontWeight,
		textTransform,
		textPadding
	} = attributes;

	const isIcon = ( type || 'line' ) === 'icon';
	const isText = ( type || 'line' ) === 'text';

	return (
		<InspectorControls>
			<HelpPanel slug={ pluginSlug } />

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Divider', 'b-blocks' ) }
				initialOpen={ true }
			>
				<SelectControl
					label={ __( 'Type', 'b-blocks' ) }
					value={ type || 'line' }
					options={ TYPE_OPTIONS }
					onChange={ ( val ) => setAttributes( { type: val } ) }
					help={ __( 'Pick the divider variant. Icon and Text place a centered element between two line segments.', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={ __( 'Alignment', 'b-blocks' ) }
					value={ alignment || 'center' }
					options={ ALIGN_OPTIONS }
					onChange={ ( val ) => setAttributes( { alignment: val } ) }
					help={ __( 'Horizontal placement of the divider inside its container. Only visible when Width is less than 100%.', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Line Style', 'b-blocks' ) }
				initialOpen={ true }
			>
				<SelectControl
					label={ __( 'Line Style', 'b-blocks' ) }
					value={ lineStyle || 'solid' }
					options={ LINE_STYLE_OPTIONS }
					onChange={ ( val ) => setAttributes( { lineStyle: val } ) }
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{ __( 'Line Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ lineColor || '#cccccc' }
						onChange={ ( val ) => setAttributes( { lineColor: val || '#cccccc' } ) }
						defaultColor={ '#cccccc' }
					/>
				</PanelRow>

				<RangeControl
					label={ __( 'Line Thickness (px)', 'b-blocks' ) }
					value={ lineWidth ?? 2 }
					onChange={ ( val ) => setAttributes( { lineWidth: val } ) }
					min={ 1 }
					max={ 12 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={ __( 'Divider Width (%)', 'b-blocks' ) }
					value={ width ?? 100 }
					onChange={ ( val ) => setAttributes( { width: val } ) }
					min={ 10 }
					max={ 100 }
					step={ 1 }
					help={ __( 'Max-width of the divider as a percentage of its container.', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			{ isIcon && (
				<PanelBody
					className='bPlPanelBody'
					title={ __( 'Icon', 'b-blocks' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Icon Class (Font Awesome)', 'b-blocks' ) }
						value={ iconClass || '' }
						onChange={ ( val ) => setAttributes( { iconClass: val } ) }
						placeholder={ __( 'fa-solid fa-star', 'b-blocks' ) }
						help={ __( 'Any Font Awesome 6 class string, e.g. fa-solid fa-star, fa-solid fa-gem.', 'b-blocks' ) }
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={ __( 'Icon Size (px)', 'b-blocks' ) }
						value={ iconSize ?? 16 }
						onChange={ ( val ) => setAttributes( { iconSize: val } ) }
						min={ 8 }
						max={ 64 }
						step={ 1 }
						__nextHasNoMarginBottom
					/>

					<PanelRow>
						<Label className=''>{ __( 'Icon Color:', 'b-blocks' ) }</Label>
						<ColorControl
							value={ iconColor || '' }
							onChange={ ( val ) => setAttributes( { iconColor: val || '' } ) }
							defaultColor={ lineColor || '#cccccc' }
						/>
					</PanelRow>

					<PanelRow>
						<Label className=''>{ __( 'Icon Background:', 'b-blocks' ) }</Label>
						<ColorControl
							value={ iconBgColor || '' }
							onChange={ ( val ) => setAttributes( { iconBgColor: val || '' } ) }
							defaultColor={ '' }
						/>
					</PanelRow>

					<RangeControl
						label={ __( 'Icon Padding (px)', 'b-blocks' ) }
						value={ iconPadding ?? 8 }
						onChange={ ( val ) => setAttributes( { iconPadding: val } ) }
						min={ 0 }
						max={ 32 }
						step={ 1 }
						help={ __( 'Space between the icon glyph and the badge background. Set 0 for no badge.', 'b-blocks' ) }
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={ __( 'Icon Border Radius (px)', 'b-blocks' ) }
						value={ iconBorderRadius ?? 50 }
						onChange={ ( val ) => setAttributes( { iconBorderRadius: val } ) }
						min={ 0 }
						max={ 50 }
						step={ 1 }
						help={ __( '50 px = pill / circle. 0 = square.', 'b-blocks' ) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			) }

			{ isText && (
				<PanelBody
					className='bPlPanelBody'
					title={ __( 'Text Label', 'b-blocks' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Label Text', 'b-blocks' ) }
						value={ text || '' }
						onChange={ ( val ) => setAttributes( { text: ( val || '' ).slice( 0, 40 ) } ) }
						placeholder={ __( 'OR', 'b-blocks' ) }
						help={ __( 'Short text shown centered on the line (max 40 chars). You can also edit it inline in the canvas.', 'b-blocks' ) }
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={ __( 'Font Size (px)', 'b-blocks' ) }
						value={ textFontSize ?? 14 }
						onChange={ ( val ) => setAttributes( { textFontSize: val } ) }
						min={ 10 }
						max={ 36 }
						step={ 1 }
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={ __( 'Font Weight', 'b-blocks' ) }
						value={ textFontWeight || '600' }
						options={ FONT_WEIGHT_OPTIONS }
						onChange={ ( val ) => setAttributes( { textFontWeight: val } ) }
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={ __( 'Text Transform', 'b-blocks' ) }
						value={ textTransform || 'none' }
						options={ TEXT_TRANSFORM_OPTIONS }
						onChange={ ( val ) => setAttributes( { textTransform: val } ) }
						__nextHasNoMarginBottom
					/>

					<PanelRow>
						<Label className=''>{ __( 'Text Color:', 'b-blocks' ) }</Label>
						<ColorControl
							value={ textColor || '' }
							onChange={ ( val ) => setAttributes( { textColor: val || '' } ) }
							defaultColor={ lineColor || '#cccccc' }
						/>
					</PanelRow>

					<PanelRow>
						<Label className=''>{ __( 'Text Background:', 'b-blocks' ) }</Label>
						<ColorControl
							value={ textBgColor || '' }
							onChange={ ( val ) => setAttributes( { textBgColor: val || '' } ) }
							defaultColor={ '' }
						/>
					</PanelRow>

					<RangeControl
						label={ __( 'Horizontal Padding (px)', 'b-blocks' ) }
						value={ textPadding ?? 12 }
						onChange={ ( val ) => setAttributes( { textPadding: val } ) }
						min={ 0 }
						max={ 48 }
						step={ 1 }
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			) }

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Spacing', 'b-blocks' ) }
				initialOpen={ false }
			>
				<RangeControl
					label={ __( 'Space Above (px)', 'b-blocks' ) }
					value={ marginTop ?? 24 }
					onChange={ ( val ) => setAttributes( { marginTop: val } ) }
					min={ 0 }
					max={ 200 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={ __( 'Space Below (px)', 'b-blocks' ) }
					value={ marginBottom ?? 24 }
					onChange={ ( val ) => setAttributes( { marginBottom: val } ) }
					min={ 0 }
					max={ 200 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;

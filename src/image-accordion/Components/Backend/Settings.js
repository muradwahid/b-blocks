import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import {
	pluginSlug, triggerOptions, orientationOptions, overlayPositionOptions,
	titleTagOptions, titleWeightOptions, alignOptions
} from '../../utils/data';
import PanelsRepeater from './PanelsRepeater';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		panels, trigger, orientation, minHeight, collapsedWidth, activeIndex,
		animationDuration, overlayColor, overlayPosition,
		showTitle, showDescription, showButton,
		titleTag, titleColor, titleFontSize = {}, titleFontWeight,
		descColor, descFontSize = {},
		btnLabel, btnBg, btnColor, btnBgHover, btnColorHover,
		btnPaddingV, btnPaddingH, btnRadius, btnFontSize,
		gapBetweenPanels, borderRadius, mobileBreakpoint, maxWidth, alignment
	} = attributes;

	const panelCount = Array.isArray( panels ) ? panels.length : 0;

	const setTitleSize = ( key, val ) => setAttributes( { titleFontSize: { ...titleFontSize, [ key ]: `${ val }px` } } );
	const setDescSize = ( key, val ) => setAttributes( { descFontSize: { ...descFontSize, [ key ]: `${ val }px` } } );
	const num = ( val, fallback ) => {
		const n = parseInt( val, 10 );
		return Number.isNaN( n ) ? fallback : n;
	};

	const activeOptions = [
		{ label: __( 'None (all collapsed)', 'b-blocks' ), value: '-1' },
		...Array.from( { length: panelCount }, ( _, i ) => ( {
			/* translators: %d: panel number */
			label: `${ __( 'Panel', 'b-blocks' ) } ${ i + 1 }`,
			value: String( i )
		} ) )
	];

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) }>
			<PanelRow>
				<Label className=''>{ __( 'Trigger:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ trigger }
					options={ triggerOptions }
					onChange={ ( val ) => setAttributes( { trigger: val } ) }
				/>
			</PanelRow>
			<PanelRow>
				<Label className=''>{ __( 'Orientation:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ orientation }
					options={ orientationOptions }
					onChange={ ( val ) => setAttributes( { orientation: val } ) }
				/>
			</PanelRow>
			<RangeControl
				label={ __( 'Strip Height (px)', 'b-blocks' ) }
				value={ minHeight }
				onChange={ ( val ) => setAttributes( { minHeight: val } ) }
				min={ 200 }
				max={ 900 }
				step={ 10 }
			/>
			{ orientation === 'horizontal' && (
				<RangeControl
					label={ __( 'Collapsed Panel Width (px)', 'b-blocks' ) }
					value={ collapsedWidth }
					onChange={ ( val ) => setAttributes( { collapsedWidth: val } ) }
					min={ 40 }
					max={ 200 }
					step={ 4 }
				/>
			) }
			<PanelRow>
				<Label className=''>{ __( 'Default Open Panel:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ String( activeIndex ) }
					options={ activeOptions }
					onChange={ ( val ) => setAttributes( { activeIndex: num( val, 0 ) } ) }
				/>
			</PanelRow>
			<RangeControl
				label={ __( 'Gap Between Panels (px)', 'b-blocks' ) }
				value={ gapBetweenPanels }
				onChange={ ( val ) => setAttributes( { gapBetweenPanels: val } ) }
				min={ 0 }
				max={ 24 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Block Border Radius (px)', 'b-blocks' ) }
				value={ borderRadius }
				onChange={ ( val ) => setAttributes( { borderRadius: val } ) }
				min={ 0 }
				max={ 32 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Block Max Width (px)', 'b-blocks' ) }
				value={ maxWidth }
				onChange={ ( val ) => setAttributes( { maxWidth: val } ) }
				min={ 0 }
				max={ 1600 }
				step={ 10 }
				help={ __( '0 = full container width.', 'b-blocks' ) }
			/>
			{ maxWidth > 0 && (
				<PanelRow>
					<Label className=''>{ __( 'Block Alignment:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ alignment }
						options={ alignOptions }
						onChange={ ( val ) => setAttributes( { alignment: val } ) }
					/>
				</PanelRow>
			) }
			<RangeControl
				label={ __( 'Mobile Breakpoint (px)', 'b-blocks' ) }
				value={ mobileBreakpoint }
				onChange={ ( val ) => setAttributes( { mobileBreakpoint: val } ) }
				min={ 480 }
				max={ 1024 }
				step={ 1 }
				help={ __( 'Below this width, panels stack vertically and toggle on tap.', 'b-blocks' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Manage Panels', 'b-blocks' ) }>
			<PanelsRepeater
				value={ panels }
				onChange={ ( val ) => setAttributes( { panels: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Overlay Position:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ overlayPosition }
					options={ overlayPositionOptions }
					onChange={ ( val ) => setAttributes( { overlayPosition: val } ) }
				/>
			</PanelRow>
			<ColorControl
				label={ __( 'Overlay Color:', 'b-blocks' ) }
				value={ overlayColor }
				onChange={ ( val ) => setAttributes( { overlayColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Animation Duration (ms)', 'b-blocks' ) }
				value={ animationDuration }
				onChange={ ( val ) => setAttributes( { animationDuration: val } ) }
				min={ 150 }
				max={ 1000 }
				step={ 50 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Title', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Title', 'b-blocks' ) }
				checked={ !! showTitle }
				onChange={ ( val ) => setAttributes( { showTitle: val } ) }
			/>
			{ showTitle && <>
				<PanelRow>
					<Label className=''>{ __( 'Heading Tag:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ titleTag }
						options={ titleTagOptions }
						onChange={ ( val ) => setAttributes( { titleTag: val } ) }
					/>
				</PanelRow>
				<ColorControl
					label={ __( 'Title Color:', 'b-blocks' ) }
					value={ titleColor }
					onChange={ ( val ) => setAttributes( { titleColor: val } ) }
				/>
				<RangeControl
					label={ __( 'Title Size — Desktop (px)', 'b-blocks' ) }
					value={ num( titleFontSize.desktop, 22 ) }
					onChange={ ( val ) => setTitleSize( 'desktop', val ) }
					min={ 12 }
					max={ 48 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Title Size — Tablet (px)', 'b-blocks' ) }
					value={ num( titleFontSize.tablet, 18 ) }
					onChange={ ( val ) => setTitleSize( 'tablet', val ) }
					min={ 12 }
					max={ 40 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Title Size — Mobile (px)', 'b-blocks' ) }
					value={ num( titleFontSize.mobile, 16 ) }
					onChange={ ( val ) => setTitleSize( 'mobile', val ) }
					min={ 12 }
					max={ 32 }
					step={ 1 }
				/>
				<PanelRow>
					<Label className=''>{ __( 'Title Font Weight:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ titleFontWeight }
						options={ titleWeightOptions }
						onChange={ ( val ) => setAttributes( { titleFontWeight: val } ) }
					/>
				</PanelRow>
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Description', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Description', 'b-blocks' ) }
				checked={ !! showDescription }
				onChange={ ( val ) => setAttributes( { showDescription: val } ) }
			/>
			{ showDescription && <>
				<ColorControl
					label={ __( 'Description Color:', 'b-blocks' ) }
					value={ descColor }
					onChange={ ( val ) => setAttributes( { descColor: val } ) }
				/>
				<RangeControl
					label={ __( 'Description Size — Desktop (px)', 'b-blocks' ) }
					value={ num( descFontSize.desktop, 15 ) }
					onChange={ ( val ) => setDescSize( 'desktop', val ) }
					min={ 10 }
					max={ 28 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Description Size — Tablet (px)', 'b-blocks' ) }
					value={ num( descFontSize.tablet, 14 ) }
					onChange={ ( val ) => setDescSize( 'tablet', val ) }
					min={ 10 }
					max={ 24 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Description Size — Mobile (px)', 'b-blocks' ) }
					value={ num( descFontSize.mobile, 14 ) }
					onChange={ ( val ) => setDescSize( 'mobile', val ) }
					min={ 10 }
					max={ 20 }
					step={ 1 }
				/>
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Button', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Button', 'b-blocks' ) }
				checked={ !! showButton }
				onChange={ ( val ) => setAttributes( { showButton: val } ) }
			/>
			{ showButton && <>
				<TextControl
					label={ __( 'Default Button Label', 'b-blocks' ) }
					value={ btnLabel }
					onChange={ ( val ) => setAttributes( { btnLabel: val } ) }
					placeholder={ __( 'Learn More', 'b-blocks' ) }
					help={ __( 'Used when a panel has no per-panel label.', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>
				<ColorControl
					label={ __( 'Button Background:', 'b-blocks' ) }
					value={ btnBg }
					onChange={ ( val ) => setAttributes( { btnBg: val } ) }
				/>
				<ColorControl
					label={ __( 'Button Text:', 'b-blocks' ) }
					value={ btnColor }
					onChange={ ( val ) => setAttributes( { btnColor: val } ) }
				/>
				<ColorControl
					label={ __( 'Button Background (hover):', 'b-blocks' ) }
					value={ btnBgHover }
					onChange={ ( val ) => setAttributes( { btnBgHover: val } ) }
				/>
				<ColorControl
					label={ __( 'Button Text (hover):', 'b-blocks' ) }
					value={ btnColorHover }
					onChange={ ( val ) => setAttributes( { btnColorHover: val } ) }
				/>
				<RangeControl
					label={ __( 'Vertical Padding (px)', 'b-blocks' ) }
					value={ btnPaddingV }
					onChange={ ( val ) => setAttributes( { btnPaddingV: val } ) }
					min={ 4 }
					max={ 24 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Horizontal Padding (px)', 'b-blocks' ) }
					value={ btnPaddingH }
					onChange={ ( val ) => setAttributes( { btnPaddingH: val } ) }
					min={ 8 }
					max={ 48 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Border Radius (px)', 'b-blocks' ) }
					value={ btnRadius }
					onChange={ ( val ) => setAttributes( { btnRadius: val } ) }
					min={ 0 }
					max={ 32 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Font Size (px)', 'b-blocks' ) }
					value={ btnFontSize }
					onChange={ ( val ) => setAttributes( { btnFontSize: val } ) }
					min={ 12 }
					max={ 24 }
					step={ 1 }
				/>
			</> }
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

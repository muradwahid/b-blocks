import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import { alignOptions, labelWeightOptions, filterDefaultOptions, hoverEffectOptions } from '../../utils/data';
import LogosRepeater from './LogosRepeater';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		label, showLabel, labelAlign, labelColor, labelSize, labelWeight, labelGap,
		items, columns, columnGap, rowGap, cellAlign, maxWidth,
		logoMaxHeight, logoMaxWidth, logoPadding,
		cellBackground, cellBorderRadius, cellBorderWidth, cellBorderColor,
		filterDefault, hoverEffect, transitionDuration,
		blockBackground, blockPaddingTop, blockPaddingBottom
	} = attributes;

	const cols = columns || {};
	const setColumns = ( key, val ) => setAttributes( { columns: { ...cols, [ key ]: val } } );

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Label', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Label', 'b-blocks' ) }
				checked={ !! showLabel }
				onChange={ ( val ) => setAttributes( { showLabel: val } ) }
			/>

			{ showLabel && <>
				<TextControl
					label={ __( 'Label Text', 'b-blocks' ) }
					value={ label }
					onChange={ ( val ) => setAttributes( { label: val } ) }
					placeholder={ __( 'Trusted by 200+ companies', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{ __( 'Label Alignment:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ labelAlign }
						options={ alignOptions }
						onChange={ ( val ) => setAttributes( { labelAlign: val } ) }
					/>
				</PanelRow>

				<ColorControl
					label={ __( 'Label Color:', 'b-blocks' ) }
					value={ labelColor }
					onChange={ ( val ) => setAttributes( { labelColor: val } ) }
				/>

				<RangeControl
					label={ __( 'Label Font Size (px)', 'b-blocks' ) }
					value={ labelSize }
					onChange={ ( val ) => setAttributes( { labelSize: val } ) }
					min={ 10 }
					max={ 32 }
					step={ 1 }
				/>

				<PanelRow>
					<Label className=''>{ __( 'Label Font Weight:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ labelWeight }
						options={ labelWeightOptions }
						onChange={ ( val ) => setAttributes( { labelWeight: val } ) }
					/>
				</PanelRow>

				<RangeControl
					label={ __( 'Label-to-Grid Gap (px)', 'b-blocks' ) }
					value={ labelGap }
					onChange={ ( val ) => setAttributes( { labelGap: val } ) }
					min={ 0 }
					max={ 64 }
					step={ 1 }
				/>
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) }>
			<RangeControl
				label={ __( 'Columns — Desktop', 'b-blocks' ) }
				value={ cols.desktop }
				onChange={ ( val ) => setColumns( 'desktop', val ) }
				min={ 1 }
				max={ 8 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Columns — Tablet', 'b-blocks' ) }
				value={ cols.tablet }
				onChange={ ( val ) => setColumns( 'tablet', val ) }
				min={ 1 }
				max={ 6 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Columns — Mobile', 'b-blocks' ) }
				value={ cols.mobile }
				onChange={ ( val ) => setColumns( 'mobile', val ) }
				min={ 1 }
				max={ 4 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Column Gap (px)', 'b-blocks' ) }
				value={ columnGap }
				onChange={ ( val ) => setAttributes( { columnGap: val } ) }
				min={ 0 }
				max={ 80 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Row Gap (px)', 'b-blocks' ) }
				value={ rowGap }
				onChange={ ( val ) => setAttributes( { rowGap: val } ) }
				min={ 0 }
				max={ 80 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Cell Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ cellAlign }
					options={ alignOptions }
					onChange={ ( val ) => setAttributes( { cellAlign: val } ) }
				/>
			</PanelRow>
			<RangeControl
				label={ __( 'Block Max Width (px)', 'b-blocks' ) }
				value={ maxWidth }
				onChange={ ( val ) => setAttributes( { maxWidth: val } ) }
				min={ 0 }
				max={ 1600 }
				step={ 10 }
				help={ __( '0 = full container width.', 'b-blocks' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Logos', 'b-blocks' ) }>
			<LogosRepeater
				value={ items }
				onChange={ ( val ) => setAttributes( { items: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Logo Max Height (px)', 'b-blocks' ) }
				value={ logoMaxHeight }
				onChange={ ( val ) => setAttributes( { logoMaxHeight: val } ) }
				min={ 20 }
				max={ 200 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Logo Max Width (px)', 'b-blocks' ) }
				value={ logoMaxWidth }
				onChange={ ( val ) => setAttributes( { logoMaxWidth: val } ) }
				min={ 40 }
				max={ 400 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Logo Cell Padding (px)', 'b-blocks' ) }
				value={ logoPadding }
				onChange={ ( val ) => setAttributes( { logoPadding: val } ) }
				min={ 0 }
				max={ 48 }
				step={ 1 }
			/>
			<ColorControl
				label={ __( 'Cell Background:', 'b-blocks' ) }
				value={ cellBackground }
				onChange={ ( val ) => setAttributes( { cellBackground: val } ) }
			/>
			<RangeControl
				label={ __( 'Cell Border Radius (px)', 'b-blocks' ) }
				value={ cellBorderRadius }
				onChange={ ( val ) => setAttributes( { cellBorderRadius: val } ) }
				min={ 0 }
				max={ 48 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Cell Border Width (px)', 'b-blocks' ) }
				value={ cellBorderWidth }
				onChange={ ( val ) => setAttributes( { cellBorderWidth: val } ) }
				min={ 0 }
				max={ 4 }
				step={ 1 }
			/>
			{ cellBorderWidth > 0 && (
				<ColorControl
					label={ __( 'Cell Border Color:', 'b-blocks' ) }
					value={ cellBorderColor }
					onChange={ ( val ) => setAttributes( { cellBorderColor: val } ) }
				/>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Hover Effect', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Default Logo Filter:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ filterDefault }
					options={ filterDefaultOptions }
					onChange={ ( val ) => setAttributes( { filterDefault: val } ) }
				/>
			</PanelRow>
			<PanelRow>
				<Label className=''>{ __( 'Hover Effect:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ hoverEffect }
					options={ hoverEffectOptions }
					onChange={ ( val ) => setAttributes( { hoverEffect: val } ) }
				/>
			</PanelRow>
			<RangeControl
				label={ __( 'Transition Duration (ms)', 'b-blocks' ) }
				value={ transitionDuration }
				onChange={ ( val ) => setAttributes( { transitionDuration: val } ) }
				min={ 0 }
				max={ 800 }
				step={ 10 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Spacing & Background', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Block Background Color:', 'b-blocks' ) }
				value={ blockBackground }
				onChange={ ( val ) => setAttributes( { blockBackground: val } ) }
			/>
			<RangeControl
				label={ __( 'Padding Top (px)', 'b-blocks' ) }
				value={ blockPaddingTop }
				onChange={ ( val ) => setAttributes( { blockPaddingTop: val } ) }
				min={ 0 }
				max={ 120 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Padding Bottom (px)', 'b-blocks' ) }
				value={ blockPaddingBottom }
				onChange={ ( val ) => setAttributes( { blockPaddingBottom: val } ) }
				min={ 0 }
				max={ 120 }
				step={ 1 }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

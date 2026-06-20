import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, ToggleControl, RangeControl, TextControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import {
	nodeShapeOptions, labelPositionOptions, alignOptions, shadowOptions,
	dateTagOptions, titleTagOptions, titleWeightOptions, mobileStackOrderOptions
} from '../../utils/data';
import ItemsRepeater from './ItemsRepeater';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		items, nodeShape, labelPosition, gap, cardMaxWidth, mobileBreakpoint, mobileStackOrder,
		nodeSize, nodeColor, nodeIconColor, showNodeNumbers,
		lineColor, lineHeight,
		cardBackground, cardShadow, cardBorderRadius, cardPaddingV, cardPaddingH, alignment,
		titleTag, titleFontSize, titleFontWeight, titleColor,
		dateTag, dateFontSize, dateColor,
		descFontSize, descColor,
		ariaLabel
	} = attributes;

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) }>
			<ItemsRepeater
				value={ items }
				onChange={ ( val ) => setAttributes( { items: val } ) }
				showNodeNumbers={ !! showNodeNumbers }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Node Shape:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ nodeShape }
					options={ nodeShapeOptions }
					onChange={ ( val ) => setAttributes( { nodeShape: val } ) }
				/>
			</PanelRow>
			<PanelRow>
				<Label className=''>{ __( 'Label Position:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ labelPosition }
					options={ labelPositionOptions }
					onChange={ ( val ) => setAttributes( { labelPosition: val } ) }
				/>
			</PanelRow>
			<RangeControl
				label={ __( 'Gap Between Milestones (px)', 'b-blocks' ) }
				value={ gap }
				onChange={ ( val ) => setAttributes( { gap: val } ) }
				min={ 16 }
				max={ 120 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Card Max Width (px)', 'b-blocks' ) }
				value={ cardMaxWidth }
				onChange={ ( val ) => setAttributes( { cardMaxWidth: val } ) }
				min={ 120 }
				max={ 400 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Mobile Breakpoint (px)', 'b-blocks' ) }
				value={ mobileBreakpoint }
				onChange={ ( val ) => setAttributes( { mobileBreakpoint: val } ) }
				min={ 320 }
				max={ 768 }
				step={ 1 }
				help={ __( 'Below this width the timeline stacks vertically.', 'b-blocks' ) }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Mobile Stack Order:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ mobileStackOrder }
					options={ mobileStackOrderOptions }
					onChange={ ( val ) => setAttributes( { mobileStackOrder: val } ) }
				/>
			</PanelRow>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Node Style', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Node Size (px)', 'b-blocks' ) }
				value={ nodeSize }
				onChange={ ( val ) => setAttributes( { nodeSize: val } ) }
				min={ 24 }
				max={ 80 }
				step={ 1 }
			/>
			<ColorControl
				label={ __( 'Node Color:', 'b-blocks' ) }
				value={ nodeColor }
				onChange={ ( val ) => setAttributes( { nodeColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Node Icon / Text Color:', 'b-blocks' ) }
				value={ nodeIconColor }
				onChange={ ( val ) => setAttributes( { nodeIconColor: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show Numbers Instead of Icons', 'b-blocks' ) }
				checked={ !! showNodeNumbers }
				onChange={ ( val ) => setAttributes( { showNodeNumbers: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Connector Line', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Line Color:', 'b-blocks' ) }
				value={ lineColor }
				onChange={ ( val ) => setAttributes( { lineColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Line Height (px)', 'b-blocks' ) }
				value={ lineHeight }
				onChange={ ( val ) => setAttributes( { lineHeight: val } ) }
				min={ 1 }
				max={ 8 }
				step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Card Style', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Card Background:', 'b-blocks' ) }
				value={ cardBackground }
				onChange={ ( val ) => setAttributes( { cardBackground: val } ) }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Shadow:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ cardShadow }
					options={ shadowOptions }
					onChange={ ( val ) => setAttributes( { cardShadow: val } ) }
				/>
			</PanelRow>
			<RangeControl
				label={ __( 'Border Radius (px)', 'b-blocks' ) }
				value={ cardBorderRadius }
				onChange={ ( val ) => setAttributes( { cardBorderRadius: val } ) }
				min={ 0 }
				max={ 32 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Padding — Vertical (px)', 'b-blocks' ) }
				value={ cardPaddingV }
				onChange={ ( val ) => setAttributes( { cardPaddingV: val } ) }
				min={ 4 }
				max={ 48 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Padding — Horizontal (px)', 'b-blocks' ) }
				value={ cardPaddingH }
				onChange={ ( val ) => setAttributes( { cardPaddingH: val } ) }
				min={ 4 }
				max={ 48 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Content Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ alignment }
					options={ alignOptions }
					onChange={ ( val ) => setAttributes( { alignment: val } ) }
				/>
			</PanelRow>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Typography', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Title Tag:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ titleTag }
					options={ titleTagOptions }
					onChange={ ( val ) => setAttributes( { titleTag: val } ) }
				/>
			</PanelRow>
			<RangeControl
				label={ __( 'Title Font Size (px)', 'b-blocks' ) }
				value={ titleFontSize }
				onChange={ ( val ) => setAttributes( { titleFontSize: val } ) }
				min={ 12 }
				max={ 36 }
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
			<ColorControl
				label={ __( 'Title Color:', 'b-blocks' ) }
				value={ titleColor }
				onChange={ ( val ) => setAttributes( { titleColor: val } ) }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Date Tag:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ dateTag }
					options={ dateTagOptions }
					onChange={ ( val ) => setAttributes( { dateTag: val } ) }
				/>
			</PanelRow>
			<RangeControl
				label={ __( 'Date Font Size (px)', 'b-blocks' ) }
				value={ dateFontSize }
				onChange={ ( val ) => setAttributes( { dateFontSize: val } ) }
				min={ 10 }
				max={ 24 }
				step={ 1 }
			/>
			<ColorControl
				label={ __( 'Date Color:', 'b-blocks' ) }
				value={ dateColor }
				onChange={ ( val ) => setAttributes( { dateColor: val } ) }
			/>
			<RangeControl
				label={ __( 'Description Font Size (px)', 'b-blocks' ) }
				value={ descFontSize }
				onChange={ ( val ) => setAttributes( { descFontSize: val } ) }
				min={ 10 }
				max={ 24 }
				step={ 1 }
			/>
			<ColorControl
				label={ __( 'Description Color:', 'b-blocks' ) }
				value={ descColor }
				onChange={ ( val ) => setAttributes( { descColor: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Accessibility', 'b-blocks' ) } initialOpen={ false }>
			<TextControl
				label={ __( 'List Aria Label', 'b-blocks' ) }
				value={ ariaLabel }
				onChange={ ( val ) => setAttributes( { ariaLabel: val } ) }
				help={ __( 'Describes the milestone list to screen readers.', 'b-blocks' ) }
				__nextHasNoMarginBottom
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

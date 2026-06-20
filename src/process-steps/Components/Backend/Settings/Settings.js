import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

import StepsRepeater from '../StepsRepeater';

const TITLE_TAG_OPTIONS = [
	{ label: 'H2', value: 'h2' },
	{ label: 'H3', value: 'h3' },
	{ label: 'H4', value: 'h4' },
	{ label: __('Paragraph', 'b-blocks'), value: 'p' },
];

const LAYOUT_OPTIONS = [
	{ label: __('Horizontal', 'b-blocks'), value: 'horizontal' },
	{ label: __('Vertical', 'b-blocks'), value: 'vertical' },
];

const THEME_OPTIONS = [
	{ label: __('Classic — clean cards, blue accent', 'b-blocks'), value: 'classic' },
	{ label: __('Modern — gradient badges, soft shadow', 'b-blocks'), value: 'modern' },
	{ label: __('Minimal — borderless, dotted connectors', 'b-blocks'), value: 'minimal' },
	{ label: __('Bold — high-contrast dark badges', 'b-blocks'), value: 'bold' },
];

const BADGE_TYPE_OPTIONS = [
	{ label: __('Number', 'b-blocks'), value: 'number' },
	{ label: __('Icon', 'b-blocks'), value: 'icon' },
];

const CONNECTOR_STYLE_OPTIONS = [
	{ label: __('Solid', 'b-blocks'), value: 'solid' },
	{ label: __('Dashed', 'b-blocks'), value: 'dashed' },
	{ label: __('Dotted', 'b-blocks'), value: 'dotted' },
];

const parsePx = (value, fallback) => {
	const v = (value == null ? '' : value).toString().trim();
	if (!v) return fallback;
	const m = v.match(/^(-?\d+(?:\.\d+)?)/);
	return m ? parseFloat(m[1]) : fallback;
};

const Settings = ({ attributes, setAttributes }) => {
	const {
		layout,
		theme,
		alignment,
		steps,
		showConnector,
		connectorColor,
		connectorWidth,
		connectorStyle,
		badgeType,
		badgeSize,
		badgeBg,
		badgeColor,
		badgeFontSize,
		badgeBorderRadius,
		titleTag,
		titleColor,
		titleFontSize = {},
		descColor,
		descFontSize = {},
		cardBg,
		cardPadding = {},
		cardBorderRadius,
		gap = {},
		columnCount = {},
	} = attributes;

	const updateResponsive = (attrKey, breakpoint, value, unit = 'px') => {
		const current = attributes[attrKey] || {};
		const next = { ...current };
		next[breakpoint] = value === '' || value == null ? '' : `${value}${unit}`;
		setAttributes({ [attrKey]: next });
	};

	const updateCardPadding = (side, value) => {
		const next = { ...(cardPadding || {}) };
		next[side] = value === '' || value == null ? '0px' : `${value}px`;
		setAttributes({ cardPadding: next });
	};

	const updateColumnCount = (breakpoint, value) => {
		const next = { ...(columnCount || {}) };
		next[breakpoint] = parseInt(value, 10) || 1;
		setAttributes({ columnCount: next });
	};

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={alignment}
					onChange={(val) => setAttributes({ alignment: val || 'center' })}
				/>
			</BlockControls>

			<InspectorControls>
				<HelpPanel slug={pluginSlug} />

				<PanelBody
					className='bPlPanelBody'
					title={__('Layout', 'b-blocks')}
					initialOpen={true}
				>
					<SelectControl
						label={__('Layout', 'b-blocks')}
						value={layout || 'horizontal'}
						options={LAYOUT_OPTIONS}
						onChange={(val) => setAttributes({ layout: val })}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Theme', 'b-blocks')}
						value={theme || 'classic'}
						options={THEME_OPTIONS}
						onChange={(val) => setAttributes({ theme: val })}
						help={__('Sets the overall color & feel. Badge / connector / card controls below still apply.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Text alignment', 'b-blocks')}
						value={alignment || 'center'}
						options={[
							{ label: __('Left', 'b-blocks'), value: 'left' },
							{ label: __('Center', 'b-blocks'), value: 'center' },
							{ label: __('Right', 'b-blocks'), value: 'right' },
						]}
						onChange={(val) => setAttributes({ alignment: val })}
						__nextHasNoMarginBottom
					/>

					{layout !== 'vertical' && (
						<>
							<Label>{__('Columns (desktop)', 'b-blocks')}</Label>
							<RangeControl
								value={parseInt(columnCount?.desktop, 10) || 3}
								onChange={(val) => updateColumnCount('desktop', val)}
								min={1}
								max={6}
								step={1}
								__nextHasNoMarginBottom
							/>
							<Label>{__('Columns (tablet)', 'b-blocks')}</Label>
							<RangeControl
								value={parseInt(columnCount?.tablet, 10) || 2}
								onChange={(val) => updateColumnCount('tablet', val)}
								min={1}
								max={6}
								step={1}
								__nextHasNoMarginBottom
							/>
							<Label>{__('Columns (mobile)', 'b-blocks')}</Label>
							<RangeControl
								value={parseInt(columnCount?.mobile, 10) || 1}
								onChange={(val) => updateColumnCount('mobile', val)}
								min={1}
								max={6}
								step={1}
								__nextHasNoMarginBottom
							/>
						</>
					)}

					<Label>{__('Gap (desktop)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(gap?.desktop, 32)}
						onChange={(val) => updateResponsive('gap', 'desktop', val)}
						min={0}
						max={128}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Gap (tablet)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(gap?.tablet, 24)}
						onChange={(val) => updateResponsive('gap', 'tablet', val)}
						min={0}
						max={128}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Gap (mobile)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(gap?.mobile, 16)}
						onChange={(val) => updateResponsive('gap', 'mobile', val)}
						min={0}
						max={128}
						step={1}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Steps', 'b-blocks')}
					initialOpen={true}
				>
					<Label>{__('Steps', 'b-blocks')}</Label>
					<StepsRepeater
						value={steps || []}
						onChange={(val) => setAttributes({ steps: val })}
						badgeType={badgeType || 'number'}
					/>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Badge', 'b-blocks')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Badge type', 'b-blocks')}
						value={badgeType || 'number'}
						options={BADGE_TYPE_OPTIONS}
						onChange={(val) => setAttributes({ badgeType: val })}
						help={badgeType === 'icon'
							? __('Add a Font Awesome class on each step in the Steps panel above.', 'b-blocks')
							: __('Numbers are auto-incremented starting at 1.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Badge size (px)', 'b-blocks')}
						value={parseInt(badgeSize, 10) || 56}
						onChange={(val) => setAttributes({ badgeSize: val })}
						min={32}
						max={120}
						step={1}
						__nextHasNoMarginBottom
					/>

					<PanelRow>
						<Label className=''>{__('Badge background:', 'b-blocks')}</Label>
						<ColorControl
							value={badgeBg || '#2563EB'}
							onChange={(val) => setAttributes({ badgeBg: val })}
							defaultColor='#2563EB'
						/>
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Badge text/icon color:', 'b-blocks')}</Label>
						<ColorControl
							value={badgeColor || '#FFFFFF'}
							onChange={(val) => setAttributes({ badgeColor: val })}
							defaultColor='#FFFFFF'
						/>
					</PanelRow>

					{badgeType !== 'icon' && (
						<RangeControl
							label={__('Badge font size (px)', 'b-blocks')}
							value={parseInt(badgeFontSize, 10) || 20}
							onChange={(val) => setAttributes({ badgeFontSize: val })}
							min={12}
							max={48}
							step={1}
							__nextHasNoMarginBottom
						/>
					)}

					<RangeControl
						label={__('Badge border radius (%)', 'b-blocks')}
						value={parseInt(badgeBorderRadius, 10) >= 0 ? parseInt(badgeBorderRadius, 10) : 50}
						onChange={(val) => setAttributes({ badgeBorderRadius: val })}
						min={0}
						max={50}
						step={1}
						help={__('0% = square, 50% = circle.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Connector', 'b-blocks')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Show connector line', 'b-blocks')}
						checked={!!showConnector}
						onChange={(val) => setAttributes({ showConnector: val })}
					/>

					{showConnector && (
						<>
							<PanelRow>
								<Label className=''>{__('Connector color:', 'b-blocks')}</Label>
								<ColorControl
									value={connectorColor || '#CBD5E1'}
									onChange={(val) => setAttributes({ connectorColor: val })}
									defaultColor='#CBD5E1'
								/>
							</PanelRow>

							<RangeControl
								label={__('Connector width (px)', 'b-blocks')}
								value={parseInt(connectorWidth, 10) || 2}
								onChange={(val) => setAttributes({ connectorWidth: val })}
								min={1}
								max={8}
								step={1}
								__nextHasNoMarginBottom
							/>

							<SelectControl
								label={__('Connector style', 'b-blocks')}
								value={connectorStyle || 'solid'}
								options={CONNECTOR_STYLE_OPTIONS}
								onChange={(val) => setAttributes({ connectorStyle: val })}
								__nextHasNoMarginBottom
							/>
						</>
					)}
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Title & Description', 'b-blocks')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Heading tag', 'b-blocks')}
						value={titleTag || 'h3'}
						options={TITLE_TAG_OPTIONS}
						onChange={(val) => setAttributes({ titleTag: val })}
						help={__('Use H3 for pages that already have an H2 section heading.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<PanelRow>
						<Label className=''>{__('Title color:', 'b-blocks')}</Label>
						<ColorControl
							value={titleColor || ''}
							onChange={(val) => setAttributes({ titleColor: val || '' })}
							defaultColor=''
						/>
					</PanelRow>

					<Label>{__('Title font size, desktop (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(titleFontSize?.desktop, 18)}
						onChange={(val) => updateResponsive('titleFontSize', 'desktop', val)}
						min={12}
						max={48}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Title font size, tablet (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(titleFontSize?.tablet, parsePx(titleFontSize?.desktop, 18))}
						onChange={(val) => updateResponsive('titleFontSize', 'tablet', val)}
						min={12}
						max={48}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Title font size, mobile (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(titleFontSize?.mobile, parsePx(titleFontSize?.tablet, parsePx(titleFontSize?.desktop, 18)))}
						onChange={(val) => updateResponsive('titleFontSize', 'mobile', val)}
						min={12}
						max={48}
						step={1}
						__nextHasNoMarginBottom
					/>

					<PanelRow>
						<Label className=''>{__('Description color:', 'b-blocks')}</Label>
						<ColorControl
							value={descColor || ''}
							onChange={(val) => setAttributes({ descColor: val || '' })}
							defaultColor=''
						/>
					</PanelRow>

					<Label>{__('Description font size, desktop (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(descFontSize?.desktop, 15)}
						onChange={(val) => updateResponsive('descFontSize', 'desktop', val)}
						min={12}
						max={36}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Description font size, tablet (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(descFontSize?.tablet, parsePx(descFontSize?.desktop, 15))}
						onChange={(val) => updateResponsive('descFontSize', 'tablet', val)}
						min={12}
						max={36}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Description font size, mobile (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(descFontSize?.mobile, parsePx(descFontSize?.tablet, parsePx(descFontSize?.desktop, 15)))}
						onChange={(val) => updateResponsive('descFontSize', 'mobile', val)}
						min={12}
						max={36}
						step={1}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					className='bPlPanelBody'
					title={__('Card Style', 'b-blocks')}
					initialOpen={false}
				>
					<PanelRow>
						<Label className=''>{__('Card background:', 'b-blocks')}</Label>
						<ColorControl
							value={cardBg || ''}
							onChange={(val) => setAttributes({ cardBg: val || '' })}
							defaultColor=''
						/>
					</PanelRow>

					<Label>{__('Padding top (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(cardPadding?.top, 16)}
						onChange={(val) => updateCardPadding('top', val)}
						min={0}
						max={64}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Padding right (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(cardPadding?.right, 16)}
						onChange={(val) => updateCardPadding('right', val)}
						min={0}
						max={64}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Padding bottom (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(cardPadding?.bottom, 16)}
						onChange={(val) => updateCardPadding('bottom', val)}
						min={0}
						max={64}
						step={1}
						__nextHasNoMarginBottom
					/>
					<Label>{__('Padding left (px)', 'b-blocks')}</Label>
					<RangeControl
						value={parsePx(cardPadding?.left, 16)}
						onChange={(val) => updateCardPadding('left', val)}
						min={0}
						max={64}
						step={1}
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Card border radius (px)', 'b-blocks')}
						value={parseInt(cardBorderRadius, 10) >= 0 ? parseInt(cardBorderRadius, 10) : 8}
						onChange={(val) => setAttributes({ cardBorderRadius: val })}
						min={0}
						max={48}
						step={1}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export default Settings;

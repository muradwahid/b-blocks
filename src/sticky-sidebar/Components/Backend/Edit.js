import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ColorPalette,
} from '@wordpress/components';

import { buildStickyCss } from '../Common/style';

const SPLIT_OPTIONS = [
	{ label: '25 / 75', value: '25/75' },
	{ label: '30 / 70', value: '30/70' },
	{ label: '35 / 65', value: '35/65' },
	{ label: '40 / 60', value: '40/60' },
	{ label: '50 / 50', value: '50/50' },
];

const MAIN_TEMPLATE = [
	[
		'core/group',
		{ metadata: { name: __('Main Content', 'b-blocks') } },
		[
			['core/heading', { level: 2, placeholder: __('Main content heading…', 'b-blocks') }],
			['core/paragraph', { placeholder: __('Add your long-form content here…', 'b-blocks') }],
		],
	],
	[
		'core/group',
		{ metadata: { name: __('Sidebar', 'b-blocks') } },
		[
			['core/heading', { level: 3, placeholder: __('Sidebar title…', 'b-blocks') }],
			['core/paragraph', { placeholder: __('Add a table of contents, summary, or CTA…', 'b-blocks') }],
		],
	],
];

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		sidebarSide,
		splitRatio,
		stickyTop,
		stickyMaxHeight,
		gap,
		mobileStackOrder,
		mobileBreakpoint,
		maxWidth,
		align,
		mainBg,
		sidebarBg,
		mainPaddingV,
		mainPaddingH,
		sidebarPaddingV,
		sidebarPaddingH,
		sidebarBorderRadius,
		sidebarBorderWidth,
		sidebarBorderColor,
	} = attributes;

	const blockProps = useBlockProps({ className: 'bb-ss' });
	const instanceId = blockProps.id || `bb-ss-${clientId}`;

	const css = buildStickyCss(instanceId, attributes, true);

	// Source order = main first, sidebar second. The InnerBlocks template
	// provides two group slots; the first is the main column, the second the
	// sidebar. Visual placement is handled purely by CSS `order`.
	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Layout', 'b-blocks')} initialOpen={true}>
					<SelectControl
						label={__('Sidebar Side', 'b-blocks')}
						help={__('Which column is the sticky sidebar.', 'b-blocks')}
						value={sidebarSide}
						options={[
							{ label: __('Left', 'b-blocks'), value: 'left' },
							{ label: __('Right', 'b-blocks'), value: 'right' },
						]}
						onChange={(val) => setAttributes({ sidebarSide: val })}
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={__('Split Ratio', 'b-blocks')}
						help={__('Sidebar / main column widths.', 'b-blocks')}
						value={splitRatio}
						options={SPLIT_OPTIONS}
						onChange={(val) => setAttributes({ splitRatio: val })}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Gap Between Columns (px)', 'b-blocks')}
						value={gap}
						onChange={(val) => setAttributes({ gap: val ?? 0 })}
						min={0}
						max={120}
						step={4}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Max Width (px)', 'b-blocks')}
						help={maxWidth > 0 ? undefined : __('Full container width.', 'b-blocks')}
						value={maxWidth}
						onChange={(val) => setAttributes({ maxWidth: val ?? 0 })}
						min={0}
						max={1600}
						step={10}
						__nextHasNoMarginBottom
					/>
					{maxWidth > 0 && (
						<SelectControl
							label={__('Wrapper Alignment', 'b-blocks')}
							value={align}
							options={[
								{ label: __('Left', 'b-blocks'), value: 'left' },
								{ label: __('Center', 'b-blocks'), value: 'center' },
								{ label: __('Right', 'b-blocks'), value: 'right' },
							]}
							onChange={(val) => setAttributes({ align: val })}
							__nextHasNoMarginBottom
						/>
					)}
					<SelectControl
						label={__('Mobile Stack Order', 'b-blocks')}
						value={mobileStackOrder}
						options={[
							{ label: __('Main content first', 'b-blocks'), value: 'main-first' },
							{ label: __('Sidebar first', 'b-blocks'), value: 'sidebar-first' },
						]}
						onChange={(val) => setAttributes({ mobileStackOrder: val })}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Mobile Breakpoint (px)', 'b-blocks')}
						help={__('Columns stack below this viewport width.', 'b-blocks')}
						value={mobileBreakpoint}
						onChange={(val) => setAttributes({ mobileBreakpoint: val ?? 767 })}
						min={480}
						max={1024}
						step={1}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={__('Sticky Behavior', 'b-blocks')} initialOpen={false}>
					<RangeControl
						label={__('Top Offset (px)', 'b-blocks')}
						help={__('Distance from top of viewport when stuck. Increase to clear a fixed header or admin bar.', 'b-blocks')}
						value={stickyTop}
						onChange={(val) => setAttributes({ stickyTop: val ?? 32 })}
						min={0}
						max={200}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Max Height — Sidebar (px)', 'b-blocks')}
						help={__('When the sticky sidebar is taller than this, it scrolls internally. 0 = no limit.', 'b-blocks')}
						value={stickyMaxHeight}
						onChange={(val) => setAttributes({ stickyMaxHeight: val ?? 0 })}
						min={0}
						max={1200}
						step={10}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={__('Sidebar Styling', 'b-blocks')} initialOpen={false}>
					<p style={{ margin: '0 0 4px', fontWeight: 600 }}>{__('Background Color', 'b-blocks')}</p>
					<ColorPalette
						value={sidebarBg}
						onChange={(val) => setAttributes({ sidebarBg: val || '' })}
					/>
					<RangeControl
						label={__('Vertical Padding (px)', 'b-blocks')}
						value={sidebarPaddingV}
						onChange={(val) => setAttributes({ sidebarPaddingV: val ?? 0 })}
						min={0}
						max={96}
						step={4}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Horizontal Padding (px)', 'b-blocks')}
						value={sidebarPaddingH}
						onChange={(val) => setAttributes({ sidebarPaddingH: val ?? 0 })}
						min={0}
						max={96}
						step={4}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Border Width (px)', 'b-blocks')}
						value={sidebarBorderWidth}
						onChange={(val) => setAttributes({ sidebarBorderWidth: val ?? 0 })}
						min={0}
						max={8}
						step={1}
						__nextHasNoMarginBottom
					/>
					{sidebarBorderWidth > 0 && (
						<>
							<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>{__('Border Color', 'b-blocks')}</p>
							<ColorPalette
								value={sidebarBorderColor}
								onChange={(val) => setAttributes({ sidebarBorderColor: val || '' })}
							/>
						</>
					)}
					<RangeControl
						label={__('Border Radius (px)', 'b-blocks')}
						value={sidebarBorderRadius}
						onChange={(val) => setAttributes({ sidebarBorderRadius: val ?? 0 })}
						min={0}
						max={48}
						step={2}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={__('Main Column Styling', 'b-blocks')} initialOpen={false}>
					<p style={{ margin: '0 0 4px', fontWeight: 600 }}>{__('Background Color', 'b-blocks')}</p>
					<ColorPalette
						value={mainBg}
						onChange={(val) => setAttributes({ mainBg: val || '' })}
					/>
					<RangeControl
						label={__('Vertical Padding (px)', 'b-blocks')}
						value={mainPaddingV}
						onChange={(val) => setAttributes({ mainPaddingV: val ?? 0 })}
						min={0}
						max={96}
						step={4}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Horizontal Padding (px)', 'b-blocks')}
						value={mainPaddingH}
						onChange={(val) => setAttributes({ mainPaddingH: val ?? 0 })}
						min={0}
						max={96}
						step={4}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<style>{css}</style>
				<div className='bb-ss-grid'>
					<InnerBlocks
						template={MAIN_TEMPLATE}
						templateLock='all'
						renderAppender={false}
					/>
				</div>
			</div>
		</>
	);
};

export default Edit;

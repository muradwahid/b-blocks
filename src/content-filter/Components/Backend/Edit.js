import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	SelectControl,
	RangeControl,
	Button,
	ColorPalette,
	BaseControl,
} from '@wordpress/components';
import { useMemo } from '@wordpress/element';

/**
 * Slugify a label for use in data attributes. Mirrors the server-side
 * slugify so editor preview and frontend stay aligned.
 */
const slugifyLabel = (label) => {
	if (!label) return '';
	return String(label)
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '') || 'cat';
};

const ALLOWED_BLOCKS = ['b-blocks/content-filter-item'];

const TEMPLATE = [
	[
		'b-blocks/content-filter-item',
		{ category: 'web-design' },
		[
			['core/heading', { level: 3, content: __('Project One', 'b-blocks') }],
			['core/paragraph', { content: __('Web design project example.', 'b-blocks') }],
		],
	],
	[
		'b-blocks/content-filter-item',
		{ category: 'photography' },
		[
			['core/heading', { level: 3, content: __('Project Two', 'b-blocks') }],
			['core/paragraph', { content: __('Photography project example.', 'b-blocks') }],
		],
	],
	[
		'b-blocks/content-filter-item',
		{ category: 'branding' },
		[
			['core/heading', { level: 3, content: __('Project Three', 'b-blocks') }],
			['core/paragraph', { content: __('Branding project example.', 'b-blocks') }],
		],
	],
];

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		categories = [],
		showAllButton,
		allLabel,
		defaultFilter,
		filterLayout,
		buttonAlign,
		gridMinColWidth,
		gridGap,
		animationDuration,
		buttonBg,
		buttonText,
		activeBg,
		activeText,
		buttonBorderRadius,
		buttonPaddingV,
		buttonPaddingH,
		buttonFontSize,
		buttonFontWeight,
		buttonGap,
		buttonBarMarginBottom,
	} = attributes;

	// Build the sanitized {label, slug} list for the visible button bar.
	const resolvedCategories = useMemo(() => {
		const seen = new Set();
		const out = [];
		(categories || []).forEach((raw) => {
			const label = String(raw || '').trim();
			if (!label) return;
			const slug = slugifyLabel(label);
			if (seen.has(slug)) return;
			seen.add(slug);
			out.push({ label, slug });
		});
		return out;
	}, [categories]);

	const defaultOptions = useMemo(() => {
		const opts = [];
		if (showAllButton) {
			opts.push({ label: allLabel || __('All', 'b-blocks'), value: 'all' });
		}
		resolvedCategories.forEach((c) => opts.push({ label: c.label, value: c.slug }));
		if (opts.length === 0) {
			opts.push({ label: __('All', 'b-blocks'), value: 'all' });
		}
		return opts;
	}, [resolvedCategories, showAllButton, allLabel]);

	const wrapperStyle = {
		'--bb-cf-button-bg': buttonBg || '#f0f0f0',
		'--bb-cf-button-text': buttonText || '#333333',
		'--bb-cf-active-bg': activeBg || '#0073aa',
		'--bb-cf-active-text': activeText || '#ffffff',
		'--bb-cf-button-radius': `${parseInt(buttonBorderRadius, 10) || 0}px`,
		'--bb-cf-button-padding-v': `${parseInt(buttonPaddingV, 10) || 0}px`,
		'--bb-cf-button-padding-h': `${parseInt(buttonPaddingH, 10) || 0}px`,
		'--bb-cf-button-font-size': `${parseInt(buttonFontSize, 10) || 14}px`,
		'--bb-cf-button-font-weight': buttonFontWeight || '500',
		'--bb-cf-button-gap': `${parseInt(buttonGap, 10) || 0}px`,
		'--bb-cf-bar-margin-bottom': `${parseInt(buttonBarMarginBottom, 10) || 0}px`,
		'--bb-cf-grid-gap': `${parseInt(gridGap, 10) || 0}px`,
		'--bb-cf-grid-min-col': `${parseInt(gridMinColWidth, 10) || 280}px`,
		'--bb-cf-animation-duration': `${parseInt(animationDuration, 10) || 0}ms`,
	};

	const wrapperClasses = [
		'bb-cf-wrapper',
		`bb-cf-layout--${filterLayout || 'horizontal'}`,
		`bb-cf-align--${buttonAlign || 'left'}`,
	].join(' ');

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: wrapperStyle,
	});

	const updateCategory = (index, value) => {
		const next = [...(categories || [])];
		next[index] = value;
		setAttributes({ categories: next });
	};

	const removeCategory = (index) => {
		const next = [...(categories || [])];
		next.splice(index, 1);
		setAttributes({ categories: next });
	};

	const addCategory = () => {
		const next = [...(categories || []), ''];
		setAttributes({ categories: next });
	};

	const moveCategory = (index, dir) => {
		const next = [...(categories || [])];
		const target = index + dir;
		if (target < 0 || target >= next.length) return;
		const tmp = next[index];
		next[index] = next[target];
		next[target] = tmp;
		setAttributes({ categories: next });
	};

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={buttonAlign}
					onChange={(val) => setAttributes({ buttonAlign: val || 'left' })}
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Filter Bar', 'b-blocks')} initialOpen={true}>
					<BaseControl
						label={__('Categories', 'b-blocks')}
						help={__('Add one entry per category. Items are tagged by these labels (slugified for matching).', 'b-blocks')}
						__nextHasNoMarginBottom
					>
						<div className='bb-cf-cats-editor'>
							{(categories || []).map((cat, idx) => (
								<div key={idx} className='bb-cf-cat-row' style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'flex-end' }}>
									<TextControl
										value={cat || ''}
										onChange={(val) => updateCategory(idx, val)}
										placeholder={__('Category label', 'b-blocks')}
										__nextHasNoMarginBottom
										__next40pxDefaultSize
									/>
									<Button
										isSmall
										variant='secondary'
										onClick={() => moveCategory(idx, -1)}
										disabled={idx === 0}
										label={__('Move up', 'b-blocks')}
									>
										{'↑'}
									</Button>
									<Button
										isSmall
										variant='secondary'
										onClick={() => moveCategory(idx, 1)}
										disabled={idx === (categories || []).length - 1}
										label={__('Move down', 'b-blocks')}
									>
										{'↓'}
									</Button>
									<Button
										isSmall
										isDestructive
										variant='secondary'
										onClick={() => removeCategory(idx)}
										label={__('Remove category', 'b-blocks')}
									>
										{'×'}
									</Button>
								</div>
							))}
							<Button
								variant='secondary'
								onClick={addCategory}
								style={{ marginTop: 4 }}
							>
								{__('Add Category', 'b-blocks')}
							</Button>
						</div>
					</BaseControl>

					<ToggleControl
						label={__('Show "All" button', 'b-blocks')}
						checked={!!showAllButton}
						onChange={(val) => setAttributes({ showAllButton: val })}
						__nextHasNoMarginBottom
					/>

					{showAllButton && (
						<TextControl
							label={__('"All" button label', 'b-blocks')}
							value={allLabel || ''}
							onChange={(val) => setAttributes({ allLabel: val })}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					)}

					<SelectControl
						label={__('Default active filter', 'b-blocks')}
						value={defaultFilter || 'all'}
						options={defaultOptions}
						onChange={(val) => setAttributes({ defaultFilter: val })}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>

					<SelectControl
						label={__('Button bar orientation', 'b-blocks')}
						value={filterLayout || 'horizontal'}
						options={[
							{ label: __('Horizontal', 'b-blocks'), value: 'horizontal' },
							{ label: __('Vertical', 'b-blocks'), value: 'vertical' },
						]}
						onChange={(val) => setAttributes({ filterLayout: val })}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>

					<SelectControl
						label={__('Button alignment', 'b-blocks')}
						value={buttonAlign || 'left'}
						options={[
							{ label: __('Left', 'b-blocks'), value: 'left' },
							{ label: __('Center', 'b-blocks'), value: 'center' },
							{ label: __('Right', 'b-blocks'), value: 'right' },
						]}
						onChange={(val) => setAttributes({ buttonAlign: val })}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>

					<RangeControl
						label={__('Gap between buttons (px)', 'b-blocks')}
						value={buttonGap}
						onChange={(val) => setAttributes({ buttonGap: val })}
						min={0}
						max={32}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>

					<RangeControl
						label={__('Space below filter bar (px)', 'b-blocks')}
						value={buttonBarMarginBottom}
						onChange={(val) => setAttributes({ buttonBarMarginBottom: val })}
						min={0}
						max={96}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>

				<PanelBody title={__('Grid Layout', 'b-blocks')} initialOpen={false}>
					<RangeControl
						label={__('Minimum item width (px)', 'b-blocks')}
						help={__('Items auto-fit into columns based on this minimum width.', 'b-blocks')}
						value={gridMinColWidth}
						onChange={(val) => setAttributes({ gridMinColWidth: val })}
						min={120}
						max={600}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<RangeControl
						label={__('Gap between items (px)', 'b-blocks')}
						value={gridGap}
						onChange={(val) => setAttributes({ gridGap: val })}
						min={0}
						max={80}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>

				<PanelBody title={__('Button Style', 'b-blocks')} initialOpen={false}>
					<RangeControl
						label={__('Font size (px)', 'b-blocks')}
						value={buttonFontSize}
						onChange={(val) => setAttributes({ buttonFontSize: val })}
						min={10}
						max={24}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label={__('Font weight', 'b-blocks')}
						value={buttonFontWeight}
						options={[
							{ label: __('Regular (400)', 'b-blocks'), value: '400' },
							{ label: __('Medium (500)', 'b-blocks'), value: '500' },
							{ label: __('Semibold (600)', 'b-blocks'), value: '600' },
							{ label: __('Bold (700)', 'b-blocks'), value: '700' },
						]}
						onChange={(val) => setAttributes({ buttonFontWeight: val })}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<RangeControl
						label={__('Vertical padding (px)', 'b-blocks')}
						value={buttonPaddingV}
						onChange={(val) => setAttributes({ buttonPaddingV: val })}
						min={0}
						max={64}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<RangeControl
						label={__('Horizontal padding (px)', 'b-blocks')}
						value={buttonPaddingH}
						onChange={(val) => setAttributes({ buttonPaddingH: val })}
						min={0}
						max={96}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<RangeControl
						label={__('Border radius (px)', 'b-blocks')}
						value={buttonBorderRadius}
						onChange={(val) => setAttributes({ buttonBorderRadius: val })}
						min={0}
						max={50}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>

					<BaseControl
						label={__('Inactive button background', 'b-blocks')}
						__nextHasNoMarginBottom
					>
						<ColorPalette
							value={buttonBg}
							onChange={(val) => setAttributes({ buttonBg: val || '' })}
						/>
					</BaseControl>
					<BaseControl
						label={__('Inactive button text', 'b-blocks')}
						__nextHasNoMarginBottom
					>
						<ColorPalette
							value={buttonText}
							onChange={(val) => setAttributes({ buttonText: val || '' })}
						/>
					</BaseControl>
					<BaseControl
						label={__('Active button background', 'b-blocks')}
						__nextHasNoMarginBottom
					>
						<ColorPalette
							value={activeBg}
							onChange={(val) => setAttributes({ activeBg: val || '' })}
						/>
					</BaseControl>
					<BaseControl
						label={__('Active button text', 'b-blocks')}
						__nextHasNoMarginBottom
					>
						<ColorPalette
							value={activeText}
							onChange={(val) => setAttributes({ activeText: val || '' })}
						/>
					</BaseControl>
				</PanelBody>

				<PanelBody title={__('Animation', 'b-blocks')} initialOpen={false}>
					<RangeControl
						label={__('Transition duration (ms)', 'b-blocks')}
						help={__('Set to 0 to disable the show/hide animation.', 'b-blocks')}
						value={animationDuration}
						onChange={(val) => setAttributes({ animationDuration: val })}
						min={0}
						max={1200}
						step={50}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{(showAllButton || resolvedCategories.length > 0) && (
					<div className='bb-cf-bar' role='toolbar' aria-label={__('Filter content', 'b-blocks')}>
						{showAllButton && (
							<button
								type='button'
								className={`bb-cf-btn${(defaultFilter || 'all') === 'all' ? ' is-active' : ''}`}
								aria-pressed={(defaultFilter || 'all') === 'all'}
								onClick={(e) => e.preventDefault()}
							>
								{allLabel || __('All', 'b-blocks')}
							</button>
						)}
						{resolvedCategories.map((c) => (
							<button
								type='button'
								key={c.slug}
								className={`bb-cf-btn${defaultFilter === c.slug ? ' is-active' : ''}`}
								aria-pressed={defaultFilter === c.slug}
								onClick={(e) => e.preventDefault()}
							>
								{c.label}
							</button>
						))}
					</div>
				)}

				<div className='bb-cf-grid'>
					<InnerBlocks
						allowedBlocks={ALLOWED_BLOCKS}
						template={TEMPLATE}
						orientation='horizontal'
						renderAppender={InnerBlocks.ButtonBlockAppender}
					/>
				</div>
			</div>
		</>
	);
};

export default Edit;

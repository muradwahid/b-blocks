import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	TextControl,
	ToggleControl,
	ColorPalette,
	ToolbarGroup,
	ToolbarButton,
	Button,
} from '@wordpress/components';

const newKey = () => Math.random().toString(36).slice(2);

// Mirror render.php's sanitize_html_class: lowercase-friendly token, strip
// anything that is not [A-Za-z0-9_-]. We keep case but drop invalid chars.
const sanitizeAnchor = (value) => (value || '').replace(/[^A-Za-z0-9_-]/g, '');

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		links,
		sticky,
		showAfterPx,
		scrollOffset,
		activeColor,
		activeBgColor,
		linkColor,
		linkHoverColor,
		barBg,
		barBorderColor,
		barBorderWidth,
		fontSize,
		fontWeight,
		linkPaddingX,
		linkPaddingY,
		indicatorStyle,
		barPaddingX,
		alignment,
		zIndex,
		barLabel,
	} = attributes;

	const blockProps = useBlockProps({ className: 'bb-an' });

	const justify =
		alignment === 'left'
			? 'flex-start'
			: alignment === 'right'
			? 'flex-end'
			: 'center';

	const updateLink = (index, patch) => {
		const next = links.map((link, i) => (i === index ? { ...link, ...patch } : link));
		setAttributes({ links: next });
	};

	const addLink = () => {
		if (links.length >= 12) {
			return;
		}
		setAttributes({
			links: [
				...links,
				{ _key: newKey(), label: __('New Link', 'b-blocks'), anchor: '' },
			],
		});
	};

	const removeLink = (index) => {
		setAttributes({ links: links.filter((_, i) => i !== index) });
	};

	const moveLink = (index, dir) => {
		const target = index + dir;
		if (target < 0 || target >= links.length) {
			return;
		}
		const next = links.slice();
		[next[index], next[target]] = [next[target], next[index]];
		setAttributes({ links: next });
	};

	const activeIndicatorStyle = (isActive) => {
		if (!isActive) {
			return {};
		}
		if (indicatorStyle === 'underline') {
			return { color: activeColor, borderBottomColor: activeColor };
		}
		if (indicatorStyle === 'pill') {
			return {
				color: activeColor,
				background: activeBgColor || 'rgba(37,99,235,0.12)',
			};
		}
		return { color: activeColor };
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon='editor-alignleft'
						label={__('Align links left', 'b-blocks')}
						isPressed={alignment === 'left'}
						onClick={() => setAttributes({ alignment: 'left' })}
					/>
					<ToolbarButton
						icon='editor-aligncenter'
						label={__('Align links center', 'b-blocks')}
						isPressed={alignment === 'center'}
						onClick={() => setAttributes({ alignment: 'center' })}
					/>
					<ToolbarButton
						icon='editor-alignright'
						label={__('Align links right', 'b-blocks')}
						isPressed={alignment === 'right'}
						onClick={() => setAttributes({ alignment: 'right' })}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Links', 'b-blocks')} initialOpen={true}>
					{links.map((link, index) => (
						<div className='bb-an-link-card' key={link._key || index}>
							<div className='bb-an-link-card-head'>
								<span>
									{__('Link', 'b-blocks')} {index + 1}
								</span>
								<span style={{ display: 'flex', gap: 4 }}>
									<Button
										icon='arrow-up-alt2'
										label={__('Move up', 'b-blocks')}
										size='small'
										disabled={index === 0}
										onClick={() => moveLink(index, -1)}
									/>
									<Button
										icon='arrow-down-alt2'
										label={__('Move down', 'b-blocks')}
										size='small'
										disabled={index === links.length - 1}
										onClick={() => moveLink(index, 1)}
									/>
								</span>
							</div>

							<TextControl
								label={__('Label', 'b-blocks')}
								value={link.label}
								onChange={(val) => updateLink(index, { label: val })}
								__nextHasNoMarginBottom
							/>
							<TextControl
								label={__('Target Anchor ID', 'b-blocks')}
								placeholder='overview'
								value={link.anchor}
								onChange={(val) =>
									updateLink(index, { anchor: sanitizeAnchor(val) })
								}
								__nextHasNoMarginBottom
							/>

							<Button
								isDestructive
								variant='tertiary'
								size='small'
								onClick={() => removeLink(index)}
								disabled={links.length <= 1}
								style={{ marginTop: 8 }}
							>
								{__('Remove Link', 'b-blocks')}
							</Button>
						</div>
					))}

					<Button
						variant='secondary'
						onClick={addLink}
						disabled={links.length >= 12}
					>
						{__('Add Link', 'b-blocks')}
					</Button>
					{links.length >= 12 && (
						<p className='bb-an-help' style={{ marginTop: 8 }}>
							{__('Maximum of 12 links reached.', 'b-blocks')}
						</p>
					)}
					<p className='bb-an-help' style={{ marginTop: 8 }}>
						{__(
							'Set a matching HTML Anchor on each target block via its Advanced settings panel.',
							'b-blocks'
						)}
					</p>
				</PanelBody>

				<PanelBody title={__('Layout & Position', 'b-blocks')} initialOpen={false}>
					<ToggleControl
						label={__('Sticky', 'b-blocks')}
						help={__('Stick the bar to the top of the viewport on scroll.', 'b-blocks')}
						checked={sticky}
						onChange={(val) => setAttributes({ sticky: val })}
						__nextHasNoMarginBottom
					/>
					{sticky && (
						<RangeControl
							label={__('Show After Scroll (px)', 'b-blocks')}
							help={__('Reveal the bar only after scrolling this far. 0 = always visible.', 'b-blocks')}
							value={showAfterPx}
							onChange={(val) => setAttributes({ showAfterPx: val ?? 0 })}
							min={0}
							max={800}
							step={10}
							__nextHasNoMarginBottom
						/>
					)}
					<RangeControl
						label={__('Scroll Offset (px)', 'b-blocks')}
						help={__('Pixels subtracted from the scroll target so the heading clears the bar.', 'b-blocks')}
						value={scrollOffset}
						onChange={(val) => setAttributes({ scrollOffset: val ?? 72 })}
						min={0}
						max={200}
						step={2}
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={__('Link Alignment', 'b-blocks')}
						value={alignment}
						options={[
							{ label: __('Left', 'b-blocks'), value: 'left' },
							{ label: __('Center', 'b-blocks'), value: 'center' },
							{ label: __('Right', 'b-blocks'), value: 'right' },
						]}
						onChange={(val) => setAttributes({ alignment: val })}
						__nextHasNoMarginBottom
					/>
					<TextControl
						label={__('Z-index', 'b-blocks')}
						type='number'
						value={zIndex}
						onChange={(val) =>
							setAttributes({ zIndex: parseInt(val, 10) || 0 })
						}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={__('Bar Style', 'b-blocks')} initialOpen={false}>
					<p style={{ margin: '0 0 4px', fontWeight: 600 }}>
						{__('Bar Background', 'b-blocks')}
					</p>
					<ColorPalette
						value={barBg}
						onChange={(val) => setAttributes({ barBg: val || '' })}
					/>
					<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>
						{__('Bottom Border Color', 'b-blocks')}
					</p>
					<ColorPalette
						value={barBorderColor}
						onChange={(val) => setAttributes({ barBorderColor: val || '' })}
					/>
					<RangeControl
						label={__('Bottom Border Width (px)', 'b-blocks')}
						value={barBorderWidth}
						onChange={(val) => setAttributes({ barBorderWidth: val ?? 1 })}
						min={0}
						max={8}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Bar Horizontal Padding (px)', 'b-blocks')}
						value={barPaddingX}
						onChange={(val) => setAttributes({ barPaddingX: val ?? 16 })}
						min={0}
						max={64}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={__('Link Style', 'b-blocks')} initialOpen={false}>
					<RangeControl
						label={__('Font Size (px)', 'b-blocks')}
						value={fontSize}
						onChange={(val) => setAttributes({ fontSize: val ?? 14 })}
						min={12}
						max={24}
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={__('Font Weight', 'b-blocks')}
						value={fontWeight}
						options={[
							{ label: '400', value: '400' },
							{ label: '500', value: '500' },
							{ label: '600', value: '600' },
							{ label: '700', value: '700' },
						]}
						onChange={(val) => setAttributes({ fontWeight: val })}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Link Padding Horizontal (px)', 'b-blocks')}
						value={linkPaddingX}
						onChange={(val) => setAttributes({ linkPaddingX: val ?? 16 })}
						min={8}
						max={48}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Link Padding Vertical (px)', 'b-blocks')}
						value={linkPaddingY}
						onChange={(val) => setAttributes({ linkPaddingY: val ?? 10 })}
						min={4}
						max={24}
						__nextHasNoMarginBottom
					/>
					<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>
						{__('Link Color', 'b-blocks')}
					</p>
					<ColorPalette
						value={linkColor}
						onChange={(val) => setAttributes({ linkColor: val || '' })}
					/>
					<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>
						{__('Link Hover Color', 'b-blocks')}
					</p>
					<ColorPalette
						value={linkHoverColor}
						onChange={(val) => setAttributes({ linkHoverColor: val || '' })}
					/>
				</PanelBody>

				<PanelBody title={__('Active State', 'b-blocks')} initialOpen={false}>
					<SelectControl
						label={__('Indicator Style', 'b-blocks')}
						value={indicatorStyle}
						options={[
							{ label: __('Underline', 'b-blocks'), value: 'underline' },
							{ label: __('Pill', 'b-blocks'), value: 'pill' },
							{ label: __('None', 'b-blocks'), value: 'none' },
						]}
						onChange={(val) => setAttributes({ indicatorStyle: val })}
						__nextHasNoMarginBottom
					/>
					<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>
						{__('Active Text Color', 'b-blocks')}
					</p>
					<ColorPalette
						value={activeColor}
						onChange={(val) => setAttributes({ activeColor: val || '' })}
					/>
					{indicatorStyle === 'pill' && (
						<>
							<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>
								{__('Active Background Color', 'b-blocks')}
							</p>
							<ColorPalette
								value={activeBgColor}
								onChange={(val) => setAttributes({ activeBgColor: val || '' })}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Accessibility', 'b-blocks')} initialOpen={false}>
					<TextControl
						label={__('Navigation Label', 'b-blocks')}
						help={__('Accessible label for the <nav> landmark. Falls back to "Page sections".', 'b-blocks')}
						placeholder={__('Page sections', 'b-blocks')}
						value={barLabel}
						onChange={(val) => setAttributes({ barLabel: val })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div
				{...blockProps}
				style={{
					...blockProps.style,
					background: barBg || undefined,
					borderBottom:
						barBorderWidth > 0
							? `${barBorderWidth}px solid ${barBorderColor || '#e5e7eb'}`
							: undefined,
				}}
			>
				<ul
					className='bb-an-list'
					style={{ justifyContent: justify, padding: `0 ${barPaddingX}px` }}
				>
					{links.map((link, index) => {
						const isActive = index === 0;
						return (
							<li className='bb-an-item' key={link._key || index}>
								<a
									className={`bb-an-link${isActive ? ' is-active' : ''}`}
									href={link.anchor ? `#${link.anchor}` : undefined}
									onClick={(e) => e.preventDefault()}
									style={{
										fontSize: `${fontSize}px`,
										fontWeight,
										color: linkColor || undefined,
										padding: `${linkPaddingY}px ${linkPaddingX}px`,
										borderRadius: 6,
										...activeIndicatorStyle(isActive),
									}}
								>
									{link.label || __('(no label)', 'b-blocks')}
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		</>
	);
};

export default Edit;

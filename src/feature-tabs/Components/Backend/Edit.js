import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	BlockControls,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	TextControl,
	ColorPalette,
	ToolbarGroup,
	ToolbarButton,
	Button,
} from '@wordpress/components';

const SPLIT_OPTIONS = [
	{ label: '30 / 70', value: '30-70' },
	{ label: '40 / 60', value: '40-60' },
	{ label: '50 / 50', value: '50-50' },
];

const ratioToPercents = (ratio) => {
	const map = {
		'30-70': [30, 70],
		'40-60': [40, 60],
		'50-50': [50, 50],
	};
	return map[ratio] || map['40-60'];
};

const newKey = () => Math.random().toString(36).slice(2);

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		tabs,
		layout,
		activeTab,
		accentColor,
		tabBg,
		activeBg,
		imageBg,
		tabGap,
		tabPaddingV,
		tabPaddingH,
		tabMinHeight,
		imageRadius,
		imageFit,
		iconSize,
		titleSize,
		titleWeight,
		descSize,
		titleColor,
		descColor,
		splitRatio,
		accentBarWidth,
		transitionDuration,
		mobileBreakpoint,
	} = attributes;

	const blockProps = useBlockProps({ className: 'bb-ft' });
	const isReverse = layout === 'tabs-right';
	const [tabPct, imgPct] = ratioToPercents(splitRatio);

	const safeActive = Math.max(0, Math.min(activeTab, tabs.length - 1));
	const current = tabs[safeActive] || tabs[0] || {};

	const accentVal = accentColor || '#2563eb';

	const updateTab = (index, patch) => {
		const next = tabs.map((tab, i) => (i === index ? { ...tab, ...patch } : tab));
		setAttributes({ tabs: next });
	};

	const addTab = () => {
		if (tabs.length >= 10) {
			return;
		}
		setAttributes({
			tabs: [
				...tabs,
				{
					_key: newKey(),
					iconClass: 'fa-solid fa-star',
					title: __('New Feature', 'b-blocks'),
					description: '',
					imageId: 0,
					imageUrl: '',
					imageAlt: '',
				},
			],
		});
	};

	const removeTab = (index) => {
		const next = tabs.filter((_, i) => i !== index);
		const nextActive = Math.max(0, Math.min(activeTab, next.length - 1));
		setAttributes({ tabs: next, activeTab: nextActive });
	};

	const moveTab = (index, dir) => {
		const target = index + dir;
		if (target < 0 || target >= tabs.length) {
			return;
		}
		const next = tabs.slice();
		[next[index], next[target]] = [next[target], next[index]];
		setAttributes({ tabs: next });
	};

	const setTabImage = (index, media) => {
		if (!media) {
			return;
		}
		updateTab(index, {
			imageId: media.id || 0,
			imageUrl: media.url || '',
			imageAlt: tabs[index].imageAlt || media.alt || '',
		});
	};

	const sanitizeIconInput = (value) =>
		(value || '').replace(/[^a-zA-Z0-9 -]/g, '');

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon='align-pull-left'
						label={__('Tabs on left', 'b-blocks')}
						isPressed={layout === 'tabs-left'}
						onClick={() => setAttributes({ layout: 'tabs-left' })}
					/>
					<ToolbarButton
						icon='align-pull-right'
						label={__('Tabs on right', 'b-blocks')}
						isPressed={layout === 'tabs-right'}
						onClick={() => setAttributes({ layout: 'tabs-right' })}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Feature Tabs', 'b-blocks')} initialOpen={true}>
					{tabs.map((tab, index) => (
						<div className='bb-ft-tab-card' key={tab._key || index}>
							<div className='bb-ft-tab-card-head'>
								<span>
									{__('Tab', 'b-blocks')} {index + 1}
								</span>
								<span style={{ display: 'flex', gap: 4 }}>
									<Button
										icon='arrow-up-alt2'
										label={__('Move up', 'b-blocks')}
										size='small'
										disabled={index === 0}
										onClick={() => moveTab(index, -1)}
									/>
									<Button
										icon='arrow-down-alt2'
										label={__('Move down', 'b-blocks')}
										size='small'
										disabled={index === tabs.length - 1}
										onClick={() => moveTab(index, 1)}
									/>
								</span>
							</div>

							<TextControl
								label={__('Icon Class', 'b-blocks')}
								placeholder='fa-solid fa-bolt'
								value={tab.iconClass}
								onChange={(val) =>
									updateTab(index, { iconClass: sanitizeIconInput(val) })
								}
								__nextHasNoMarginBottom
							/>
							<p className='bb-ft-icon-help'>
								{__('Font Awesome class, e.g. fa-solid fa-bolt.', 'b-blocks')}
							</p>

							<TextControl
								label={__('Title', 'b-blocks')}
								value={tab.title}
								onChange={(val) => updateTab(index, { title: val })}
								__nextHasNoMarginBottom
							/>
							<TextControl
								label={__('Description', 'b-blocks')}
								value={tab.description}
								onChange={(val) => updateTab(index, { description: val })}
								__nextHasNoMarginBottom
							/>

							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={['image']}
									value={tab.imageId || undefined}
									onSelect={(media) => setTabImage(index, media)}
									render={({ open }) => (
										<div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '8px 0' }}>
											<Button variant='secondary' size='small' onClick={open} icon='format-image'>
												{tab.imageUrl
													? __('Replace Image', 'b-blocks')
													: __('Select Image', 'b-blocks')}
											</Button>
											{tab.imageUrl && (
												<Button
													variant='tertiary'
													size='small'
													isDestructive
													onClick={() =>
														updateTab(index, { imageId: 0, imageUrl: '', imageAlt: '' })
													}
												>
													{__('Remove', 'b-blocks')}
												</Button>
											)}
										</div>
									)}
								/>
							</MediaUploadCheck>

							{tab.imageUrl && (
								<>
									<img className='bb-ft-tab-thumb' src={tab.imageUrl} alt='' />
									<TextControl
										label={__('Image Alt Text', 'b-blocks')}
										help={__('Leave blank for decorative images.', 'b-blocks')}
										value={tab.imageAlt}
										onChange={(val) => updateTab(index, { imageAlt: val })}
										__nextHasNoMarginBottom
									/>
								</>
							)}

							<Button
								isDestructive
								variant='tertiary'
								size='small'
								onClick={() => removeTab(index)}
								disabled={tabs.length <= 1}
								style={{ marginTop: 8 }}
							>
								{__('Remove Tab', 'b-blocks')}
							</Button>
						</div>
					))}

					<Button
						variant='secondary'
						onClick={addTab}
						disabled={tabs.length >= 10}
					>
						{__('Add Tab', 'b-blocks')}
					</Button>
					{tabs.length >= 10 && (
						<p className='bb-ft-icon-help' style={{ marginTop: 8 }}>
							{__('Maximum of 10 tabs reached.', 'b-blocks')}
						</p>
					)}
				</PanelBody>

				<PanelBody title={__('Layout', 'b-blocks')} initialOpen={false}>
					<SelectControl
						label={__('Tab List Side', 'b-blocks')}
						value={layout}
						options={[
							{ label: __('Tabs Left', 'b-blocks'), value: 'tabs-left' },
							{ label: __('Tabs Right', 'b-blocks'), value: 'tabs-right' },
						]}
						onChange={(val) => setAttributes({ layout: val })}
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={__('Split Ratio', 'b-blocks')}
						help={__('Tab panel / image panel widths.', 'b-blocks')}
						value={splitRatio}
						options={SPLIT_OPTIONS}
						onChange={(val) => setAttributes({ splitRatio: val })}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Min Image Panel Height (px)', 'b-blocks')}
						value={tabMinHeight}
						onChange={(val) => setAttributes({ tabMinHeight: val ?? 320 })}
						min={200}
						max={800}
						step={10}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Mobile Breakpoint (px)', 'b-blocks')}
						help={__('Below this width the block becomes an accordion.', 'b-blocks')}
						value={mobileBreakpoint}
						onChange={(val) => setAttributes({ mobileBreakpoint: val ?? 640 })}
						min={320}
						max={900}
						step={10}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Default Active Tab (0-based)', 'b-blocks')}
						value={activeTab}
						onChange={(val) => setAttributes({ activeTab: val ?? 0 })}
						min={0}
						max={Math.max(0, tabs.length - 1)}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={__('Style', 'b-blocks')} initialOpen={false}>
					<p style={{ margin: '0 0 4px', fontWeight: 600 }}>
						{__('Accent / Active Indicator Color', 'b-blocks')}
					</p>
					<ColorPalette
						value={accentColor}
						onChange={(val) => setAttributes({ accentColor: val || '' })}
					/>
					<RangeControl
						label={__('Accent Bar Width (px)', 'b-blocks')}
						value={accentBarWidth}
						onChange={(val) => setAttributes({ accentBarWidth: val ?? 3 })}
						min={0}
						max={8}
						__nextHasNoMarginBottom
					/>
					<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>
						{__('Tab List Background', 'b-blocks')}
					</p>
					<ColorPalette
						value={tabBg}
						onChange={(val) => setAttributes({ tabBg: val || '' })}
					/>
					<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>
						{__('Active Tab Background', 'b-blocks')}
					</p>
					<ColorPalette
						value={activeBg}
						onChange={(val) => setAttributes({ activeBg: val || '' })}
					/>
					<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>
						{__('Image Panel Background', 'b-blocks')}
					</p>
					<ColorPalette
						value={imageBg}
						onChange={(val) => setAttributes({ imageBg: val || '' })}
					/>
					<RangeControl
						label={__('Tab Vertical Padding (px)', 'b-blocks')}
						value={tabPaddingV}
						onChange={(val) => setAttributes({ tabPaddingV: val ?? 16 })}
						min={8}
						max={48}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Tab Horizontal Padding (px)', 'b-blocks')}
						value={tabPaddingH}
						onChange={(val) => setAttributes({ tabPaddingH: val ?? 20 })}
						min={8}
						max={64}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Gap Between Tabs (px)', 'b-blocks')}
						value={tabGap}
						onChange={(val) => setAttributes({ tabGap: val ?? 8 })}
						min={0}
						max={32}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={__('Image Style', 'b-blocks')} initialOpen={false}>
					<RangeControl
						label={__('Image Border Radius (px)', 'b-blocks')}
						value={imageRadius}
						onChange={(val) => setAttributes({ imageRadius: val ?? 8 })}
						min={0}
						max={32}
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={__('Object Fit', 'b-blocks')}
						value={imageFit}
						options={[
							{ label: __('Contain', 'b-blocks'), value: 'contain' },
							{ label: __('Cover', 'b-blocks'), value: 'cover' },
						]}
						onChange={(val) => setAttributes({ imageFit: val })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={__('Typography', 'b-blocks')} initialOpen={false}>
					<RangeControl
						label={__('Icon Size (px)', 'b-blocks')}
						value={iconSize}
						onChange={(val) => setAttributes({ iconSize: val ?? 20 })}
						min={12}
						max={48}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Title Font Size (px)', 'b-blocks')}
						value={titleSize}
						onChange={(val) => setAttributes({ titleSize: val ?? 16 })}
						min={12}
						max={32}
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={__('Title Font Weight', 'b-blocks')}
						value={titleWeight}
						options={[
							{ label: '400', value: '400' },
							{ label: '500', value: '500' },
							{ label: '600', value: '600' },
							{ label: '700', value: '700' },
						]}
						onChange={(val) => setAttributes({ titleWeight: val })}
						__nextHasNoMarginBottom
					/>
					<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>
						{__('Title Color', 'b-blocks')}
					</p>
					<ColorPalette
						value={titleColor}
						onChange={(val) => setAttributes({ titleColor: val || '' })}
					/>
					<RangeControl
						label={__('Description Font Size (px)', 'b-blocks')}
						value={descSize}
						onChange={(val) => setAttributes({ descSize: val ?? 13 })}
						min={10}
						max={24}
						__nextHasNoMarginBottom
					/>
					<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>
						{__('Description Color', 'b-blocks')}
					</p>
					<ColorPalette
						value={descColor}
						onChange={(val) => setAttributes({ descColor: val || '' })}
					/>
				</PanelBody>

				<PanelBody title={__('Animation', 'b-blocks')} initialOpen={false}>
					<RangeControl
						label={__('Image Cross-fade Duration (ms)', 'b-blocks')}
						value={transitionDuration}
						onChange={(val) => setAttributes({ transitionDuration: val ?? 300 })}
						min={0}
						max={800}
						step={10}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className={`bb-ft-inner${isReverse ? ' is-reverse' : ''}`}>
					<div
						className='bb-ft-tablist'
						style={{
							flex: `0 0 ${tabPct}%`,
							maxWidth: `${tabPct}%`,
							gap: `${tabGap}px`,
							...(tabBg ? { background: tabBg, borderRadius: 8, padding: 8 } : {}),
						}}
					>
						{tabs.map((tab, index) => {
							const on = index === safeActive;
							return (
								<button
									type='button'
									key={tab._key || index}
									className={`bb-ft-tab${on ? ' is-active' : ''}`}
									onClick={() => setAttributes({ activeTab: index })}
									style={{
										padding: `${tabPaddingV}px ${tabPaddingH}px`,
										position: 'relative',
										...(on && activeBg ? { background: activeBg } : {}),
									}}
								>
									{on && accentBarWidth > 0 && (
										<span
											aria-hidden='true'
											style={{
												position: 'absolute',
												left: 0,
												top: 8,
												bottom: 8,
												width: accentBarWidth,
												borderRadius: accentBarWidth,
												background: accentVal,
											}}
										/>
									)}
									{tab.iconClass && (
										<span
											className='bb-ft-tab-icon'
											aria-hidden='true'
											style={{ fontSize: iconSize, color: accentColor || undefined, lineHeight: 1 }}
										>
											<i className={tab.iconClass} />
										</span>
									)}
									<span className='bb-ft-tab-body'>
										{tab.title && (
											<span
												className='bb-ft-tab-title'
												style={{
													fontSize: titleSize,
													fontWeight: titleWeight,
													color: titleColor || undefined,
												}}
											>
												{tab.title}
											</span>
										)}
										{tab.description && (
											<span
												className='bb-ft-tab-desc'
												style={{ fontSize: descSize, color: descColor || undefined }}
											>
												{tab.description}
											</span>
										)}
									</span>
								</button>
							);
						})}
					</div>

					<div
						className='bb-ft-stage'
						style={{
							flex: `0 0 ${imgPct}%`,
							maxWidth: `${imgPct}%`,
							minHeight: tabMinHeight,
							borderRadius: imageRadius,
							...(imageBg ? { background: imageBg } : {}),
						}}
					>
						{current && current.imageUrl ? (
							<img
								className='bb-ft-panel-img'
								src={current.imageUrl}
								alt={current.imageAlt || ''}
								style={{
									width: '100%',
									height: '100%',
									maxHeight: tabMinHeight,
									objectFit: imageFit,
									borderRadius: imageRadius,
								}}
							/>
						) : (
							<span className='bb-ft-panel-empty'>
								{__('Select an image for this tab in the sidebar.', 'b-blocks')}
							</span>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Edit;

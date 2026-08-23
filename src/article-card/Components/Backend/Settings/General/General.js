import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl, TextControl, ToggleControl, Flex, __experimentalUnitControl as UnitControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';

import { Label, ColorControl, MediaArea, IconLibrary, Device } from '../../../../../../../bpl-tools/Components';

const Arrow = (props) => (
	<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='currentColor' {...props}>
		<path d='M4 11h12.17l-3.58-3.59L14 6l6 6-6 6-1.41-1.41L16.17 13H4z' />
	</svg>
);

const at = (obj, d) => {
	if (typeof obj === 'string') return obj;
	return obj?.[d] || (d === 'mobile' ? (obj?.tablet || obj?.desktop) : obj?.desktop);
};

const General = ({ attributes, setAttributes, updateObj, device = 'desktop' }) => {
	const { layout = {}, image = {}, content = {}, link = {}, colors = {} } = attributes;

	const { type: layoutType = {}, alignment } = layout;
	const normAlign = typeof alignment === 'string' ? { desktop: alignment, tablet: '', mobile: '' } : (alignment || {});
	const { id: imageId = {}, url: imageUrl = {}, alt: imageAlt = '', objectFit = {}, objectPosition = {}, filter: imageFilter = {}, position: imagePosition = {}, splitRatio = {}, splitLeft = {}, splitRight = {} } = image;
	const deviceFilter = imageFilter[device] || {};
	const { badge: badgeText, headingTag, meta, metaIcon } = content;
	const { url: linkUrl, target: linkTarget, ctaLabel, ctaStyle, cardLinkMode } = link;
	const { meta: metaColor } = colors;

	const isHorizontal = at(layoutType, device) === 'horizontal';
	const deviceSplit = at(splitRatio, device);
	const hasImage = !!at(imageUrl, device);

	return <>
		<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>

			<Label className='flex1'><Flex justify='flex-start' gap={2}>{__('Layout', 'b-blocks')} <Device /></Flex></Label>
			<ToggleGroupControl
				className='flex1'
				isBlock
				isDeselectable
				value={layoutType[device] || ''}
				onChange={(val) => {
					// Keep this device's image position on the axis that matches the new layout.
					const horizontal = ['left', 'right'];
					const vertical = ['top', 'bottom'];
					const curPos = imagePosition[device] || '';
					let pos = curPos;
					if (val === 'horizontal' && !horizontal.includes(curPos)) pos = 'left';
					if (val === 'vertical' && !vertical.includes(curPos)) pos = 'top';
					setAttributes({
						layout: { ...layout, type: { ...layoutType, [device]: val || '' } },
						image: { ...image, position: { ...imagePosition, [device]: pos } },
					});
				}}
			>
				<ToggleGroupControlOption label={__('Horizontal', 'b-blocks')} value='horizontal' />
				<ToggleGroupControlOption label={__('Vertical', 'b-blocks')} value='vertical' />
			</ToggleGroupControl>

			<Flex align='center' className='mt10'>
				<Label className='flex1'><Flex justify='flex-start' gap={0}>{__('Image Position', 'b-blocks')} <Device /></Flex></Label>
				{isHorizontal ? (
					<ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={imagePosition[device] || ''} onChange={(val) => updateObj('image', val, 'position', device)}>
						<ToggleGroupControlOptionIcon label={__('Left', 'b-blocks')} value='left' icon={<Arrow style={{ rotate: '180deg' }} />} />
						<ToggleGroupControlOptionIcon label={__('Right', 'b-blocks')} value='right' icon={<Arrow />} />
					</ToggleGroupControl>
				) : (
					<ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={imagePosition[device] || ''} onChange={(val) => updateObj('image', val, 'position', device)}>
						<ToggleGroupControlOptionIcon label={__('Top', 'b-blocks')} value='top' icon={<Arrow style={{ rotate: '-90deg' }} />} />
						<ToggleGroupControlOptionIcon label={__('Bottom', 'b-blocks')} value='bottom' icon={<Arrow style={{ rotate: '90deg' }} />} />
					</ToggleGroupControl>
				)}
			</Flex>

			{isHorizontal && (
				<>
					<SelectControl
						className='mt10'
						label={<Flex justify='flex-start'>{__('Image Split Ratio', 'b-blocks')} <Device /></Flex>}
						value={deviceSplit || ''}
						options={[
							{ label: '30 / 70', value: '30' },
							{ label: '40 / 60', value: '40' },
							{ label: '50 / 50', value: '50' },
							{ label: __('Custom', 'b-blocks'), value: 'custom' },
						]}
						onChange={(val) => {
							if (val === 'custom') {
								updateObj('image', val, 'splitRatio', device);
							} else {
								setAttributes({
									image: {
										...image,
										splitRatio: { ...splitRatio, [device]: val },
										splitLeft: { ...splitLeft, [device]: `${val}%` },
										splitRight: { ...splitRight, [device]: `${100 - parseInt(val, 10)}%` },
									},
								});
							}
						}}
						__nextHasNoMarginBottom
					/>

					{deviceSplit === 'custom' && (
						<Flex className='mt10'>
							<UnitControl
								label={__('Left', 'b-blocks')}
								className='flex1'
								value={splitLeft[device]}
								onChange={(val) => updateObj('image', val, 'splitLeft', device)}
							/>

							<UnitControl
								label={__('Right', 'b-blocks')}
								className='flex1'
								value={splitRight[device]}
								onChange={(val) => updateObj('image', val, 'splitRight', device)}
							/>
						</Flex>
					)}
				</>
			)}


			<Flex align='center' className='mt10'>
				<Label className='flex1'><Flex justify='flex-start' gap={0}>{__('Alignment', 'b-blocks')} <Device /></Flex></Label>
				<ToggleGroupControl
					className='flex1'
					size='small'
					style={{ padding: '2px' }}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					isBlock
					isDeselectable
					value={normAlign[device] || ''}
					onChange={(val) => {
						const currentAlign = typeof alignment === 'string' ? { desktop: alignment, tablet: '', mobile: '' } : { ...alignment };
						currentAlign[device] = val;
						updateObj('layout', currentAlign, 'alignment');
					}}
				>
					<ToggleGroupControlOptionIcon label={__('Left', 'b-blocks')} value='left' icon='editor-alignleft' />
					<ToggleGroupControlOptionIcon label={__('Center', 'b-blocks')} value='center' icon='editor-aligncenter' />
					<ToggleGroupControlOptionIcon label={__('Right', 'b-blocks')} value='right' icon='editor-alignright' />
				</ToggleGroupControl>
			</Flex>

			<ToggleControl
				className='mt10'
				label={__('Wrap entire card in link', 'b-blocks')}
				help={__('The whole card becomes a single link (no separate CTA button).', 'b-blocks')}
				checked={!!cardLinkMode}
				onChange={(val) => updateObj('link', val, 'cardLinkMode')}
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Image', 'b-blocks')} initialOpen={false}>
			<Label><Flex justify='flex-start'>{__('Image:', 'b-blocks')} <Device /></Flex></Label>
			<MediaArea
				label={imageUrl[device] ? __('Replace Image', 'b-blocks') : __('Select Image', 'b-blocks')}
				value={{ id: imageId[device], url: imageUrl[device], alt: imageAlt }}
				types={['image']}
				height='100%'
				width='100%'
				onChange={(media) =>
					setAttributes({
						image: {
							...image,
							id: { ...imageId, [device]: media?.id || 0 },
							url: { ...imageUrl, [device]: media?.url || '' },
							alt: media?.alt || imageAlt || '',
						},
					})
				}
			/>

			{device !== 'desktop' && <p style={{ margin: '6px 0 0', fontSize: 11, color: '#777' }}>{__('Leave empty to reuse the Desktop image on this device.', 'b-blocks')}</p>}

			<TextControl
				className='mt10'
				label={__('Alt Text', 'b-blocks')}
				value={imageAlt || ''}
				onChange={(val) => updateObj('image', val, 'alt')}
				help={__('Describes the image; leave empty for a decorative image.', 'b-blocks')}
				__nextHasNoMarginBottom
			/>

			{hasImage && (
				<>
					<SelectControl
						className='mt10'
						label={<Flex justify='flex-start'>{__('Object Fit', 'b-blocks')} <Device /></Flex>}
						value={objectFit[device] || ''}
						options={[
							{ label: __('Default', 'b-blocks'), value: '' },
							{ label: __('Cover', 'b-blocks'), value: 'cover' },
							{ label: __('Contain', 'b-blocks'), value: 'contain' },
							{ label: __('Fill', 'b-blocks'), value: 'fill' },
							{ label: __('None', 'b-blocks'), value: 'none' },
							{ label: __('Scale Down', 'b-blocks'), value: 'scale-down' },
						]}
						onChange={(val) => updateObj('image', val, 'objectFit', device)}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						className='mt10'
						label={<Flex justify='flex-start'>{__('Object Position', 'b-blocks')} <Device /></Flex>}
						value={objectPosition[device] || ''}
						options={[
							{ label: __('Default', 'b-blocks'), value: '' },
							{ label: __('Center', 'b-blocks'), value: 'center' },
							{ label: __('Top', 'b-blocks'), value: 'top' },
							{ label: __('Bottom', 'b-blocks'), value: 'bottom' },
							{ label: __('Left', 'b-blocks'), value: 'left' },
							{ label: __('Right', 'b-blocks'), value: 'right' },
							{ label: __('Top Left', 'b-blocks'), value: 'top left' },
							{ label: __('Top Right', 'b-blocks'), value: 'top right' },
							{ label: __('Bottom Left', 'b-blocks'), value: 'bottom left' },
							{ label: __('Bottom Right', 'b-blocks'), value: 'bottom right' },
						]}
						onChange={(val) => updateObj('image', val, 'objectPosition', device)}
						__nextHasNoMarginBottom
					/>

					<Label className='mt20'><Flex justify='flex-start'>{__('Filter', 'b-blocks')} <Device /></Flex></Label>
					<RangeControl label={__('Blur (px)', 'b-blocks')} value={deviceFilter.blur ?? 0} onChange={(val) => updateObj('image', val, 'filter', device, 'blur')} min={0} max={20} step={0.5} />
					<RangeControl label={__('Brightness (%)', 'b-blocks')} value={deviceFilter.brightness ?? 100} onChange={(val) => updateObj('image', val, 'filter', device, 'brightness')} min={0} max={200} />
					<RangeControl label={__('Contrast (%)', 'b-blocks')} value={deviceFilter.contrast ?? 100} onChange={(val) => updateObj('image', val, 'filter', device, 'contrast')} min={0} max={200} />
					<RangeControl label={__('Saturation (%)', 'b-blocks')} value={deviceFilter.saturate ?? 100} onChange={(val) => updateObj('image', val, 'filter', device, 'saturate')} min={0} max={200} />
					<RangeControl label={__('Grayscale (%)', 'b-blocks')} value={deviceFilter.grayscale ?? 0} onChange={(val) => updateObj('image', val, 'filter', device, 'grayscale')} min={0} max={100} />
				</>
			)}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={false}>
			<TextControl
				label={__('Badge Text', 'b-blocks')}
				value={badgeText || ''}
				onChange={(val) => updateObj('content', val, 'badge')}
				placeholder={__('e.g. Read Also', 'b-blocks')}
				help={__('Empty hides the badge.', 'b-blocks')}
				__nextHasNoMarginBottom
			/>

			<SelectControl
				className='mt20'
				label={__('Heading Tag', 'b-blocks')}
				labelPosition='edge'
				value={headingTag}
				options={[
					{ label: 'H2', value: 'h2' },
					{ label: 'H3', value: 'h3' },
					{ label: 'H4', value: 'h4' },
					{ label: __('Paragraph', 'b-blocks'), value: 'p' },
				]}
				onChange={(val) => updateObj('content', val, 'headingTag')}
				__nextHasNoMarginBottom
			/>

			<TextControl
				className='mt10'
				label={__('Meta Line', 'b-blocks')}
				value={meta || ''}
				onChange={(val) => updateObj('content', val, 'meta')}
				placeholder={__('e.g. 5 min read', 'b-blocks')}
				help={__('Empty hides the meta line.', 'b-blocks')}
				__nextHasNoMarginBottom
			/>

			<IconLibrary
				className='mt10'
				label={__('Meta Icon', 'b-blocks')}
				value={metaIcon}
				onChange={(val) => updateObj('content', val, 'metaIcon')}
			/>

			<ColorControl className='mt10' label={__('Meta Color:', 'b-blocks')} value={metaColor || '#6b7280'} onChange={(val) => updateObj('colors', val, 'meta')} defaultColor='#6b7280' />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Link & CTA', 'b-blocks')} initialOpen={false}>
			<TextControl
				label={__('Link URL', 'b-blocks')}
				value={linkUrl || ''}
				onChange={(val) => updateObj('link', val, 'url')}
				type='url'
				placeholder='https://'
				__nextHasNoMarginBottom
			/>

			<ToggleControl
				className='mt10'
				label={__('Open in new tab', 'b-blocks')}
				checked={!!linkTarget}
				onChange={(val) => updateObj('link', val, 'target')}
			/>

			{!cardLinkMode && (
				<>
					<TextControl
						className='mt10'
						label={__('CTA Label', 'b-blocks')}
						value={ctaLabel || ''}
						onChange={(val) => updateObj('link', val, 'ctaLabel')}
						placeholder={__('Read More', 'b-blocks')}
						help={__('Empty hides the CTA.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
					<Flex className='mt10'>
						<Label className='flex2'>{__('CTA Style', 'b-blocks')}</Label>
						<SelectControl
							className='flex1'
							value={ctaStyle}
							options={[
								{ label: __('Button', 'b-blocks'), value: 'button' },
								{ label: __('Arrow Link', 'b-blocks'), value: 'link' }
							]}
							onChange={(val) => updateObj('link', val, 'ctaStyle')}
							__nextHasNoMarginBottom
						/>
					</Flex>
				</>
			)}
		</PanelBody>
	</>;
};
export default General;

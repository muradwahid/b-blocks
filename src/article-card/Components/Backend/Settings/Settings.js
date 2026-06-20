import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	RangeControl,
	TextControl,
	ToggleControl,
	Button,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';
import { fontWeightOptions } from '../../../utils/data';

const Settings = ({ attributes, setAttributes }) => {
	const {
		layout,
		imagePosition,
		imageId,
		imageUrl,
		imageAlt,
		imageRatio,
		badge,
		badgeBg,
		badgeColor,
		headingTag,
		meta,
		metaIcon,
		linkUrl,
		linkTarget,
		ctaLabel,
		ctaStyle,
		cardLinkMode,
		maxWidth,
		alignment,
		imageSplitRatio,
		cardBg,
		headingColor,
		textColor,
		metaColor,
		ctaBg,
		ctaColor,
		ctaHoverBg,
		ctaHoverColor,
		borderWidth,
		borderColor,
		borderRadius,
		shadow,
		paddingV,
		paddingH,
		headingSizeDesktop,
		headingSizeTablet,
		headingSizeMobile,
		headingWeight,
		excerptSizeDesktop,
		excerptSizeMobile,
		excerptWeight,
		ctaFontSize,
		ctaWeight,
		ctaPaddingV,
		ctaPaddingH,
		ctaBorderRadius,
		mobileStack,
		mobileImagePosition,
	} = attributes;

	const isHorizontal = layout === 'horizontal';
	const isButton = ctaStyle === 'button';

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>
				<SelectControl
					label={__('Layout', 'b-blocks')}
					value={layout}
					options={[
						{ label: __('Horizontal (image side)', 'b-blocks'), value: 'horizontal' },
						{ label: __('Vertical (image top)', 'b-blocks'), value: 'vertical' },
					]}
					onChange={(val) => setAttributes({ layout: val })}
					__nextHasNoMarginBottom
				/>

				{isHorizontal && (
					<>
						<SelectControl
							label={__('Image Position', 'b-blocks')}
							value={imagePosition}
							options={[
								{ label: __('Left', 'b-blocks'), value: 'left' },
								{ label: __('Right', 'b-blocks'), value: 'right' },
							]}
							onChange={(val) => setAttributes({ imagePosition: val })}
							__nextHasNoMarginBottom
						/>

						<SelectControl
							label={__('Image Split Ratio', 'b-blocks')}
							value={imageSplitRatio}
							options={[
								{ label: '30 / 70', value: '30' },
								{ label: '40 / 60', value: '40' },
								{ label: '50 / 50', value: '50' },
							]}
							onChange={(val) => setAttributes({ imageSplitRatio: val })}
							__nextHasNoMarginBottom
						/>
					</>
				)}

				<SelectControl
					label={__('Image Aspect Ratio', 'b-blocks')}
					value={imageRatio}
					options={[
						{ label: '16:9', value: '16/9' },
						{ label: '4:3', value: '4/3' },
						{ label: '1:1', value: '1/1' },
						{ label: '3:4', value: '3/4' },
					]}
					onChange={(val) => setAttributes({ imageRatio: val })}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Alignment', 'b-blocks')}
					value={alignment}
					options={[
						{ label: __('Left', 'b-blocks'), value: 'left' },
						{ label: __('Center', 'b-blocks'), value: 'center' },
						{ label: __('Right', 'b-blocks'), value: 'right' },
					]}
					onChange={(val) => setAttributes({ alignment: val })}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Max Width', 'b-blocks')}
					value={maxWidth}
					onChange={(val) => setAttributes({ maxWidth: val })}
					min={0}
					max={1600}
					step={10}
					help={maxWidth === 0 ? __('Full container width', 'b-blocks') : `${maxWidth}px`}
				/>

				<ToggleControl
					className='mt20'
					label={__('Wrap entire card in link', 'b-blocks')}
					help={__('The whole card becomes a single link (no separate CTA button).', 'b-blocks')}
					checked={!!cardLinkMode}
					onChange={(val) => setAttributes({ cardLinkMode: val })}
				/>

				{isHorizontal && (
					<>
						<ToggleControl
							label={__('Stack vertically on mobile', 'b-blocks')}
							checked={!!mobileStack}
							onChange={(val) => setAttributes({ mobileStack: val })}
						/>

						{mobileStack && (
							<SelectControl
								label={__('Mobile image position', 'b-blocks')}
								value={mobileImagePosition}
								options={[
									{ label: __('Top', 'b-blocks'), value: 'top' },
									{ label: __('Hidden', 'b-blocks'), value: 'hidden' },
								]}
								onChange={(val) => setAttributes({ mobileImagePosition: val })}
								__nextHasNoMarginBottom
							/>
						)}
					</>
				)}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Image', 'b-blocks')} initialOpen={false}>
				{imageUrl && (
					<div style={{ marginBottom: 8 }}>
						<img
							src={imageUrl}
							alt=''
							style={{ width: '100%', height: 'auto', borderRadius: 8, display: 'block' }}
						/>
					</div>
				)}
				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={['image']}
							value={imageId || 0}
							onSelect={(media) =>
								setAttributes({
									imageId: media?.id || 0,
									imageUrl: media?.url || '',
									imageAlt: media?.alt || imageAlt || '',
								})
							}
							render={({ open }) => (
								<Button variant='secondary' onClick={open}>
									{imageUrl ? __('Replace Image', 'b-blocks') : __('Select Image', 'b-blocks')}
								</Button>
							)}
						/>
					</MediaUploadCheck>
					{imageUrl && (
						<Button
							variant='link'
							isDestructive
							onClick={() => setAttributes({ imageId: 0, imageUrl: '' })}
						>
							{__('Remove', 'b-blocks')}
						</Button>
					)}
				</div>

				<TextControl
					label={__('Alt Text', 'b-blocks')}
					value={imageAlt || ''}
					onChange={(val) => setAttributes({ imageAlt: val })}
					help={__('Leave empty to use the media library alt, or empty for a decorative image.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={false}>
				<TextControl
					label={__('Badge Text', 'b-blocks')}
					value={badge || ''}
					onChange={(val) => setAttributes({ badge: val })}
					placeholder={__('e.g. Read Also', 'b-blocks')}
					help={__('Empty hides the badge.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label>{__('Badge Background:', 'b-blocks')}</Label>
					<ColorControl
						value={badgeBg || '#2563eb'}
						onChange={(val) => setAttributes({ badgeBg: val })}
						defaultColor='#2563eb'
					/>
				</PanelRow>

				<PanelRow>
					<Label>{__('Badge Text Color:', 'b-blocks')}</Label>
					<ColorControl
						value={badgeColor || '#ffffff'}
						onChange={(val) => setAttributes({ badgeColor: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<SelectControl
					className='mt20'
					label={__('Heading Tag', 'b-blocks')}
					value={headingTag}
					options={[
						{ label: 'H2', value: 'h2' },
						{ label: 'H3', value: 'h3' },
						{ label: 'H4', value: 'h4' },
						{ label: __('Paragraph', 'b-blocks'), value: 'p' },
					]}
					onChange={(val) => setAttributes({ headingTag: val })}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Meta Line', 'b-blocks')}
					value={meta || ''}
					onChange={(val) => setAttributes({ meta: val })}
					placeholder={__('e.g. 5 min read', 'b-blocks')}
					help={__('Empty hides the meta line.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Meta Icon Class', 'b-blocks')}
					value={metaIcon || ''}
					onChange={(val) => setAttributes({ metaIcon: val })}
					placeholder='fa-solid fa-clock'
					help={__('Optional Font Awesome class.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label>{__('Meta Color:', 'b-blocks')}</Label>
					<ColorControl
						value={metaColor || '#6b7280'}
						onChange={(val) => setAttributes({ metaColor: val })}
						defaultColor='#6b7280'
					/>
				</PanelRow>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Link & CTA', 'b-blocks')} initialOpen={false}>
				<TextControl
					label={__('Link URL', 'b-blocks')}
					value={linkUrl || ''}
					onChange={(val) => setAttributes({ linkUrl: val })}
					type='url'
					placeholder='https://'
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					className='mt10'
					label={__('Open in new tab', 'b-blocks')}
					checked={!!linkTarget}
					onChange={(val) => setAttributes({ linkTarget: val })}
				/>

				{!cardLinkMode && (
					<>
						<TextControl
							label={__('CTA Label', 'b-blocks')}
							value={ctaLabel || ''}
							onChange={(val) => setAttributes({ ctaLabel: val })}
							placeholder={__('Read More', 'b-blocks')}
							help={__('Empty hides the CTA.', 'b-blocks')}
							__nextHasNoMarginBottom
						/>

						<SelectControl
							label={__('CTA Style', 'b-blocks')}
							value={ctaStyle}
							options={[
								{ label: __('Button', 'b-blocks'), value: 'button' },
								{ label: __('Arrow Link', 'b-blocks'), value: 'link' },
							]}
							onChange={(val) => setAttributes({ ctaStyle: val })}
							__nextHasNoMarginBottom
						/>
					</>
				)}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Card Style', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Label>{__('Card Background:', 'b-blocks')}</Label>
					<ColorControl
						value={cardBg || '#ffffff'}
						onChange={(val) => setAttributes({ cardBg: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<PanelRow>
					<Label>{__('Heading Color:', 'b-blocks')}</Label>
					<ColorControl
						value={headingColor || '#111827'}
						onChange={(val) => setAttributes({ headingColor: val })}
						defaultColor='#111827'
					/>
				</PanelRow>

				<PanelRow>
					<Label>{__('Text Color:', 'b-blocks')}</Label>
					<ColorControl
						value={textColor || '#374151'}
						onChange={(val) => setAttributes({ textColor: val })}
						defaultColor='#374151'
					/>
				</PanelRow>

				<PanelRow>
					<Label>{__('Border Color:', 'b-blocks')}</Label>
					<ColorControl
						value={borderColor || '#e5e7eb'}
						onChange={(val) => setAttributes({ borderColor: val })}
						defaultColor='#e5e7eb'
					/>
				</PanelRow>

				<RangeControl
					className='mt10'
					label={__('Border Width', 'b-blocks')}
					value={borderWidth}
					onChange={(val) => setAttributes({ borderWidth: val })}
					min={0}
					max={8}
				/>

				<RangeControl
					label={__('Border Radius', 'b-blocks')}
					value={borderRadius}
					onChange={(val) => setAttributes({ borderRadius: val })}
					min={0}
					max={48}
				/>

				<SelectControl
					label={__('Shadow', 'b-blocks')}
					value={shadow}
					options={[
						{ label: __('None', 'b-blocks'), value: 'none' },
						{ label: __('Small', 'b-blocks'), value: 'sm' },
						{ label: __('Medium', 'b-blocks'), value: 'md' },
						{ label: __('Large', 'b-blocks'), value: 'lg' },
					]}
					onChange={(val) => setAttributes({ shadow: val })}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Content Padding — Vertical', 'b-blocks')}
					value={paddingV}
					onChange={(val) => setAttributes({ paddingV: val })}
					min={0}
					max={80}
				/>

				<RangeControl
					label={__('Content Padding — Horizontal', 'b-blocks')}
					value={paddingH}
					onChange={(val) => setAttributes({ paddingH: val })}
					min={0}
					max={80}
				/>
			</PanelBody>

			{!cardLinkMode && isButton && (
				<PanelBody className='bPlPanelBody' title={__('CTA Button Style', 'b-blocks')} initialOpen={false}>
					<PanelRow>
						<Label>{__('Button Background:', 'b-blocks')}</Label>
						<ColorControl
							value={ctaBg || '#2563eb'}
							onChange={(val) => setAttributes({ ctaBg: val })}
							defaultColor='#2563eb'
						/>
					</PanelRow>

					<PanelRow>
						<Label>{__('Button Text Color:', 'b-blocks')}</Label>
						<ColorControl
							value={ctaColor || '#ffffff'}
							onChange={(val) => setAttributes({ ctaColor: val })}
							defaultColor='#ffffff'
						/>
					</PanelRow>

					<PanelRow>
						<Label>{__('Hover Background:', 'b-blocks')}</Label>
						<ColorControl
							value={ctaHoverBg || '#1d4ed8'}
							onChange={(val) => setAttributes({ ctaHoverBg: val })}
							defaultColor='#1d4ed8'
						/>
					</PanelRow>

					<PanelRow>
						<Label>{__('Hover Text Color:', 'b-blocks')}</Label>
						<ColorControl
							value={ctaHoverColor || '#ffffff'}
							onChange={(val) => setAttributes({ ctaHoverColor: val })}
							defaultColor='#ffffff'
						/>
					</PanelRow>

					<RangeControl
						className='mt10'
						label={__('Button Padding — Vertical', 'b-blocks')}
						value={ctaPaddingV}
						onChange={(val) => setAttributes({ ctaPaddingV: val })}
						min={0}
						max={48}
					/>

					<RangeControl
						label={__('Button Padding — Horizontal', 'b-blocks')}
						value={ctaPaddingH}
						onChange={(val) => setAttributes({ ctaPaddingH: val })}
						min={0}
						max={80}
					/>

					<RangeControl
						label={__('Button Border Radius', 'b-blocks')}
						value={ctaBorderRadius}
						onChange={(val) => setAttributes({ ctaBorderRadius: val })}
						min={0}
						max={48}
					/>
				</PanelBody>
			)}

			<PanelBody className='bPlPanelBody' title={__('Typography', 'b-blocks')} initialOpen={false}>
				<Label>{__('Heading', 'b-blocks')}</Label>
				<RangeControl
					label={__('Font Size — Desktop', 'b-blocks')}
					value={headingSizeDesktop}
					onChange={(val) => setAttributes({ headingSizeDesktop: val })}
					min={12}
					max={48}
				/>
				<RangeControl
					label={__('Font Size — Tablet', 'b-blocks')}
					value={headingSizeTablet}
					onChange={(val) => setAttributes({ headingSizeTablet: val })}
					min={12}
					max={48}
				/>
				<RangeControl
					label={__('Font Size — Mobile', 'b-blocks')}
					value={headingSizeMobile}
					onChange={(val) => setAttributes({ headingSizeMobile: val })}
					min={12}
					max={48}
				/>
				<SelectControl
					label={__('Weight', 'b-blocks')}
					value={headingWeight}
					options={fontWeightOptions}
					onChange={(val) => setAttributes({ headingWeight: val })}
					__nextHasNoMarginBottom
				/>

				<Label className='mt20'>{__('Excerpt', 'b-blocks')}</Label>
				<RangeControl
					label={__('Font Size — Desktop', 'b-blocks')}
					value={excerptSizeDesktop}
					onChange={(val) => setAttributes({ excerptSizeDesktop: val })}
					min={10}
					max={28}
				/>
				<RangeControl
					label={__('Font Size — Mobile', 'b-blocks')}
					value={excerptSizeMobile}
					onChange={(val) => setAttributes({ excerptSizeMobile: val })}
					min={10}
					max={28}
				/>
				<SelectControl
					label={__('Weight', 'b-blocks')}
					value={excerptWeight}
					options={fontWeightOptions}
					onChange={(val) => setAttributes({ excerptWeight: val })}
					__nextHasNoMarginBottom
				/>

				{!cardLinkMode && ctaLabel && (
					<>
						<Label className='mt20'>{__('CTA', 'b-blocks')}</Label>
						<RangeControl
							label={__('Font Size', 'b-blocks')}
							value={ctaFontSize}
							onChange={(val) => setAttributes({ ctaFontSize: val })}
							min={10}
							max={24}
						/>
						<SelectControl
							label={__('Weight', 'b-blocks')}
							value={ctaWeight}
							options={fontWeightOptions}
							onChange={(val) => setAttributes({ ctaWeight: val })}
							__nextHasNoMarginBottom
						/>
					</>
				)}
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;

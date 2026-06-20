import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	ToggleControl,
	TextControl,
	Button,
	ButtonGroup,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

const MIN_HEIGHT_OPTIONS = [
	{ label: __('Full viewport (100vh)', 'b-blocks'), value: '100vh' },
	{ label: __('Almost full (90vh)', 'b-blocks'), value: '90vh' },
	{ label: __('Three-quarter (75vh)', 'b-blocks'), value: '75vh' },
	{ label: __('Default (60vh)', 'b-blocks'), value: '60vh' },
	{ label: __('Half viewport (50vh)', 'b-blocks'), value: '50vh' },
	{ label: __('Auto (fits content)', 'b-blocks'), value: 'auto' },
];

const ALIGN_OPTIONS = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' },
];

const VALIGN_OPTIONS = [
	{ label: __('Top', 'b-blocks'), value: 'top' },
	{ label: __('Middle', 'b-blocks'), value: 'middle' },
	{ label: __('Bottom', 'b-blocks'), value: 'bottom' },
];

const BG_TYPE_OPTIONS = [
	{ label: __('Solid color', 'b-blocks'), value: 'color' },
	{ label: __('Gradient', 'b-blocks'), value: 'gradient' },
	{ label: __('Image', 'b-blocks'), value: 'image' },
	{ label: __('Video (MP4)', 'b-blocks'), value: 'video' },
];

const BG_POSITION_OPTIONS = [
	{ label: __('Center center', 'b-blocks'), value: 'center center' },
	{ label: __('Top center', 'b-blocks'), value: 'top center' },
	{ label: __('Bottom center', 'b-blocks'), value: 'bottom center' },
	{ label: __('Center left', 'b-blocks'), value: 'center left' },
	{ label: __('Center right', 'b-blocks'), value: 'center right' },
	{ label: __('Top left', 'b-blocks'), value: 'top left' },
	{ label: __('Top right', 'b-blocks'), value: 'top right' },
	{ label: __('Bottom left', 'b-blocks'), value: 'bottom left' },
	{ label: __('Bottom right', 'b-blocks'), value: 'bottom right' },
];

const BG_SIZE_OPTIONS = [
	{ label: __('Cover', 'b-blocks'), value: 'cover' },
	{ label: __('Contain', 'b-blocks'), value: 'contain' },
	{ label: __('Auto (natural)', 'b-blocks'), value: 'auto' },
];

const HEADING_TAG_OPTIONS = [
	{ label: 'H1', value: 'h1' },
	{ label: 'H2', value: 'h2' },
	{ label: 'H3', value: 'h3' },
];

const HEADING_WEIGHT_OPTIONS = [
	{ label: __('Regular (400)', 'b-blocks'), value: '400' },
	{ label: __('Medium (500)', 'b-blocks'), value: '500' },
	{ label: __('Semibold (600)', 'b-blocks'), value: '600' },
	{ label: __('Bold (700)', 'b-blocks'), value: '700' },
	{ label: __('Extra bold (800)', 'b-blocks'), value: '800' },
	{ label: __('Black (900)', 'b-blocks'), value: '900' },
];

const BTN_WEIGHT_OPTIONS = [
	{ label: __('Regular (400)', 'b-blocks'), value: '400' },
	{ label: __('Medium (500)', 'b-blocks'), value: '500' },
	{ label: __('Semibold (600)', 'b-blocks'), value: '600' },
	{ label: __('Bold (700)', 'b-blocks'), value: '700' },
];

const EYEBROW_WEIGHT_OPTIONS = [
	{ label: __('Regular (400)', 'b-blocks'), value: '400' },
	{ label: __('Medium (500)', 'b-blocks'), value: '500' },
	{ label: __('Semibold (600)', 'b-blocks'), value: '600' },
	{ label: __('Bold (700)', 'b-blocks'), value: '700' },
	{ label: __('Extra bold (800)', 'b-blocks'), value: '800' },
];

const SECONDARY_VARIANT_OPTIONS = [
	{ label: __('Outline', 'b-blocks'), value: 'outline' },
	{ label: __('Ghost (text only)', 'b-blocks'), value: 'ghost' },
	{ label: __('Solid', 'b-blocks'), value: 'solid' },
];

const Settings = ({ attributes, setAttributes }) => {
	const {
		minHeight,
		contentAlign,
		verticalAlign,
		contentMaxWidth,
		paddingTop,
		paddingBottom,
		paddingTopMobile,
		paddingBottomMobile,
		bgType,
		bgColor,
		bgGradientFrom,
		bgGradientTo,
		bgGradientAngle,
		bgImageId,
		bgImageUrl,
		bgImagePosition,
		bgImageSize,
		bgVideoId,
		bgVideoUrl,
		bgVideoPosterId,
		bgVideoPosterUrl,
		overlayColor,
		overlayOpacity,
		showEyebrow,
		eyebrowText,
		eyebrowColor,
		eyebrowBgColor,
		eyebrowFontSize,
		eyebrowFontWeight,
		eyebrowLetterSpacing,
		headingTag,
		headingFontSize,
		headingFontSizeTablet,
		headingFontSizeMobile,
		headingFontWeight,
		headingColor,
		headingLineHeight,
		showSubHeading,
		subHeadingFontSize,
		subHeadingFontSizeMobile,
		subHeadingColor,
		subHeadingMaxWidth,
		showPrimaryBtn,
		primaryBtnText,
		primaryBtnUrl,
		primaryBtnNewTab,
		primaryBtnBgColor,
		primaryBtnTextColor,
		primaryBtnHoverBgColor,
		primaryBtnHoverTextColor,
		primaryBtnBorderRadius,
		primaryBtnPaddingV,
		primaryBtnPaddingH,
		primaryBtnFontSize,
		primaryBtnFontWeight,
		showSecondaryBtn,
		secondaryBtnText,
		secondaryBtnUrl,
		secondaryBtnNewTab,
		secondaryBtnVariant,
		secondaryBtnColor,
		secondaryBtnTextColor,
		secondaryBtnHoverBgColor,
		secondaryBtnHoverTextColor,
		secondaryBtnBorderRadius,
		secondaryBtnPaddingV,
		secondaryBtnPaddingH,
		secondaryBtnFontSize,
		secondaryBtnFontWeight,
		btnGap,
	} = attributes;

	const showOverlayPanel = bgType === 'image' || bgType === 'gradient' || bgType === 'video';

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>
				<SelectControl
					label={__('Section min-height', 'b-blocks')}
					value={minHeight || '60vh'}
					options={MIN_HEIGHT_OPTIONS}
					onChange={(val) => setAttributes({ minHeight: val })}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Vertical alignment', 'b-blocks')}
					value={verticalAlign || 'middle'}
					options={VALIGN_OPTIONS}
					onChange={(val) => setAttributes({ verticalAlign: val })}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Horizontal text alignment', 'b-blocks')}
					value={contentAlign || 'center'}
					options={ALIGN_OPTIONS}
					onChange={(val) => setAttributes({ contentAlign: val })}
					help={__('Also editable from the block toolbar.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Content max-width (px)', 'b-blocks')}
					value={parseInt(contentMaxWidth, 10) || 800}
					onChange={(val) => setAttributes({ contentMaxWidth: val })}
					min={320}
					max={1400}
					step={8}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Background', 'b-blocks')} initialOpen={false}>
				<Label>{__('Background type', 'b-blocks')}</Label>
				<ButtonGroup style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
					{BG_TYPE_OPTIONS.map((opt) => (
						<Button
							key={opt.value}
							variant={bgType === opt.value ? 'primary' : 'secondary'}
							onClick={() => setAttributes({ bgType: opt.value })}
							size='small'
						>
							{opt.label}
						</Button>
					))}
				</ButtonGroup>

				{bgType === 'color' && (
					<PanelRow>
						<Label className=''>{__('Background color:', 'b-blocks')}</Label>
						<ColorControl
							value={bgColor || '#1a1a2e'}
							onChange={(val) => setAttributes({ bgColor: val || '#1a1a2e' })}
							defaultColor='#1a1a2e'
						/>
					</PanelRow>
				)}

				{bgType === 'gradient' && (
					<>
						<PanelRow>
							<Label className=''>{__('Gradient from:', 'b-blocks')}</Label>
							<ColorControl
								value={bgGradientFrom || '#1a1a2e'}
								onChange={(val) => setAttributes({ bgGradientFrom: val || '#1a1a2e' })}
								defaultColor='#1a1a2e'
							/>
						</PanelRow>
						<PanelRow>
							<Label className=''>{__('Gradient to:', 'b-blocks')}</Label>
							<ColorControl
								value={bgGradientTo || '#16213e'}
								onChange={(val) => setAttributes({ bgGradientTo: val || '#16213e' })}
								defaultColor='#16213e'
							/>
						</PanelRow>
						<RangeControl
							label={__('Gradient angle (deg)', 'b-blocks')}
							value={parseInt(bgGradientAngle, 10) || 135}
							onChange={(val) => setAttributes({ bgGradientAngle: val })}
							min={0}
							max={360}
							step={5}
							__nextHasNoMarginBottom
						/>
					</>
				)}

				{bgType === 'image' && (
					<>
						<Label>{__('Background image', 'b-blocks')}</Label>
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={['image']}
								value={bgImageId || undefined}
								onSelect={(media) => {
									if (!media) return;
									setAttributes({
										bgImageId: media.id || 0,
										bgImageUrl: media.url || '',
										bgImageAlt: media.alt || '',
									});
								}}
								render={({ open }) => (
									<div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
										<Button variant='secondary' size='small' onClick={open} icon='format-image'>
											{bgImageUrl ? __('Replace image', 'b-blocks') : __('Select image', 'b-blocks')}
										</Button>
										{bgImageUrl && (
											<Button
												variant='tertiary'
												size='small'
												isDestructive
												onClick={() => setAttributes({ bgImageId: 0, bgImageUrl: '', bgImageAlt: '' })}
											>
												{__('Remove', 'b-blocks')}
											</Button>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>

						{bgImageUrl && (
							<>
								<SelectControl
									label={__('Image position', 'b-blocks')}
									value={bgImagePosition || 'center center'}
									options={BG_POSITION_OPTIONS}
									onChange={(val) => setAttributes({ bgImagePosition: val })}
									__nextHasNoMarginBottom
								/>
								<SelectControl
									label={__('Image size', 'b-blocks')}
									value={bgImageSize || 'cover'}
									options={BG_SIZE_OPTIONS}
									onChange={(val) => setAttributes({ bgImageSize: val })}
									__nextHasNoMarginBottom
								/>
							</>
						)}
					</>
				)}

				{bgType === 'video' && (
					<>
						<Label>{__('Background video (MP4)', 'b-blocks')}</Label>
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={['video']}
								value={bgVideoId || undefined}
								onSelect={(media) => {
									if (!media) return;
									setAttributes({
										bgVideoId: media.id || 0,
										bgVideoUrl: media.url || '',
									});
								}}
								render={({ open }) => (
									<div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
										<Button variant='secondary' size='small' onClick={open} icon='format-video'>
											{bgVideoUrl ? __('Replace video', 'b-blocks') : __('Select MP4', 'b-blocks')}
										</Button>
										{bgVideoUrl && (
											<Button
												variant='tertiary'
												size='small'
												isDestructive
												onClick={() => setAttributes({ bgVideoId: 0, bgVideoUrl: '' })}
											>
												{__('Remove', 'b-blocks')}
											</Button>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>

						<Label>{__('Poster image (mobile + reduced-motion fallback)', 'b-blocks')}</Label>
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={['image']}
								value={bgVideoPosterId || undefined}
								onSelect={(media) => {
									if (!media) return;
									setAttributes({
										bgVideoPosterId: media.id || 0,
										bgVideoPosterUrl: media.url || '',
									});
								}}
								render={({ open }) => (
									<div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
										<Button variant='secondary' size='small' onClick={open} icon='format-image'>
											{bgVideoPosterUrl ? __('Replace poster', 'b-blocks') : __('Select poster', 'b-blocks')}
										</Button>
										{bgVideoPosterUrl && (
											<Button
												variant='tertiary'
												size='small'
												isDestructive
												onClick={() => setAttributes({ bgVideoPosterId: 0, bgVideoPosterUrl: '' })}
											>
												{__('Remove', 'b-blocks')}
											</Button>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>

						<PanelRow>
							<Label className=''>{__('Fallback color:', 'b-blocks')}</Label>
							<ColorControl
								value={bgColor || '#1a1a2e'}
								onChange={(val) => setAttributes({ bgColor: val || '#1a1a2e' })}
								defaultColor='#1a1a2e'
							/>
						</PanelRow>

						<p style={{ fontSize: 12, color: '#757575', margin: '8px 0 0' }}>
							{__('Videos autoplay muted and loop. They are hidden on small screens (≤ 600 px) and when the visitor has requested reduced motion — the poster image is shown as a still fallback.', 'b-blocks')}
						</p>
					</>
				)}

				{showOverlayPanel && (
					<>
						<PanelRow>
							<Label className=''>{__('Overlay color:', 'b-blocks')}</Label>
							<ColorControl
								value={overlayColor || '#000000'}
								onChange={(val) => setAttributes({ overlayColor: val || '#000000' })}
								defaultColor='#000000'
							/>
						</PanelRow>
						<RangeControl
							label={__('Overlay opacity (%)', 'b-blocks')}
							value={parseInt(overlayOpacity, 10) >= 0 ? parseInt(overlayOpacity, 10) : 40}
							onChange={(val) => setAttributes({ overlayOpacity: val })}
							min={0}
							max={100}
							step={5}
							help={__('A semi-transparent layer above the background — boosts text contrast over images/video.', 'b-blocks')}
							__nextHasNoMarginBottom
						/>
					</>
				)}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Eyebrow', 'b-blocks')} initialOpen={false}>
				<ToggleControl
					label={__('Show eyebrow label', 'b-blocks')}
					checked={!!showEyebrow}
					onChange={(val) => setAttributes({ showEyebrow: !!val })}
				/>

				{showEyebrow && (
					<>
						<TextControl
							label={__('Eyebrow text', 'b-blocks')}
							value={eyebrowText || ''}
							onChange={(val) => setAttributes({ eyebrowText: val })}
							placeholder={__('NEW — SUMMER 2026', 'b-blocks')}
							help={__('Also editable inline on the block canvas.', 'b-blocks')}
							__nextHasNoMarginBottom
						/>

						<PanelRow>
							<Label className=''>{__('Eyebrow text color:', 'b-blocks')}</Label>
							<ColorControl
								value={eyebrowColor || '#ffffff'}
								onChange={(val) => setAttributes({ eyebrowColor: val || '#ffffff' })}
								defaultColor='#ffffff'
							/>
						</PanelRow>

						<PanelRow>
							<Label className=''>{__('Eyebrow background:', 'b-blocks')}</Label>
							<ColorControl
								value={eyebrowBgColor || 'rgba(255,255,255,0.14)'}
								onChange={(val) => setAttributes({ eyebrowBgColor: val || 'rgba(255,255,255,0.14)' })}
								defaultColor='rgba(255,255,255,0.14)'
							/>
						</PanelRow>

						<RangeControl
							label={__('Eyebrow font size (px)', 'b-blocks')}
							value={parseInt(eyebrowFontSize, 10) || 13}
							onChange={(val) => setAttributes({ eyebrowFontSize: val })}
							min={10}
							max={32}
							step={1}
							__nextHasNoMarginBottom
						/>

						<SelectControl
							label={__('Eyebrow font weight', 'b-blocks')}
							value={eyebrowFontWeight || '600'}
							options={EYEBROW_WEIGHT_OPTIONS}
							onChange={(val) => setAttributes({ eyebrowFontWeight: val })}
							__nextHasNoMarginBottom
						/>

						<RangeControl
							label={__('Letter spacing (px)', 'b-blocks')}
							value={parseInt(eyebrowLetterSpacing, 10) >= 0 ? parseInt(eyebrowLetterSpacing, 10) : 2}
							onChange={(val) => setAttributes({ eyebrowLetterSpacing: val })}
							min={0}
							max={10}
							step={1}
							__nextHasNoMarginBottom
						/>
					</>
				)}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Headline', 'b-blocks')} initialOpen={false}>
				<SelectControl
					label={__('Heading HTML tag', 'b-blocks')}
					value={headingTag || 'h1'}
					options={HEADING_TAG_OPTIONS}
					onChange={(val) => setAttributes({ headingTag: val })}
					help={__('Use H1 only once per page. Other instances should be H2 or H3.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Headline font size — desktop (px)', 'b-blocks')}
					value={parseInt(headingFontSize, 10) || 56}
					onChange={(val) => setAttributes({ headingFontSize: val })}
					min={20}
					max={96}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Headline font size — tablet (px)', 'b-blocks')}
					value={parseInt(headingFontSizeTablet, 10) || 40}
					onChange={(val) => setAttributes({ headingFontSizeTablet: val })}
					min={20}
					max={96}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Headline font size — mobile (px)', 'b-blocks')}
					value={parseInt(headingFontSizeMobile, 10) || 28}
					onChange={(val) => setAttributes({ headingFontSizeMobile: val })}
					min={16}
					max={80}
					step={1}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Headline font weight', 'b-blocks')}
					value={headingFontWeight || '700'}
					options={HEADING_WEIGHT_OPTIONS}
					onChange={(val) => setAttributes({ headingFontWeight: val })}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{__('Headline color:', 'b-blocks')}</Label>
					<ColorControl
						value={headingColor || '#ffffff'}
						onChange={(val) => setAttributes({ headingColor: val || '#ffffff' })}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<RangeControl
					label={__('Headline line height (%)', 'b-blocks')}
					value={parseInt(headingLineHeight, 10) || 120}
					onChange={(val) => setAttributes({ headingLineHeight: val })}
					min={80}
					max={200}
					step={5}
					__nextHasNoMarginBottom
				/>

				<p style={{ fontSize: 12, color: '#757575', margin: '8px 0 0' }}>
					{__('Check that your headline color has sufficient contrast against the background. Aim for WCAG AA (4.5:1 for body text, 3:1 for large text).', 'b-blocks')}
				</p>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Sub-headline', 'b-blocks')} initialOpen={false}>
				<ToggleControl
					label={__('Show sub-headline', 'b-blocks')}
					checked={!!showSubHeading}
					onChange={(val) => setAttributes({ showSubHeading: !!val })}
				/>

				{showSubHeading && (
					<>
						<RangeControl
							label={__('Sub-headline font size — desktop (px)', 'b-blocks')}
							value={parseInt(subHeadingFontSize, 10) || 18}
							onChange={(val) => setAttributes({ subHeadingFontSize: val })}
							min={12}
							max={36}
							step={1}
							__nextHasNoMarginBottom
						/>

						<RangeControl
							label={__('Sub-headline font size — mobile (px)', 'b-blocks')}
							value={parseInt(subHeadingFontSizeMobile, 10) || 15}
							onChange={(val) => setAttributes({ subHeadingFontSizeMobile: val })}
							min={10}
							max={30}
							step={1}
							__nextHasNoMarginBottom
						/>

						<PanelRow>
							<Label className=''>{__('Sub-headline color:', 'b-blocks')}</Label>
							<ColorControl
								value={subHeadingColor || 'rgba(255,255,255,0.85)'}
								onChange={(val) => setAttributes({ subHeadingColor: val || 'rgba(255,255,255,0.85)' })}
								defaultColor='rgba(255,255,255,0.85)'
							/>
						</PanelRow>

						<RangeControl
							label={__('Sub-headline max-width (px)', 'b-blocks')}
							value={parseInt(subHeadingMaxWidth, 10) || 600}
							onChange={(val) => setAttributes({ subHeadingMaxWidth: val })}
							min={200}
							max={1200}
							step={10}
							help={__('Narrows the line length for readability.', 'b-blocks')}
							__nextHasNoMarginBottom
						/>
					</>
				)}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Buttons', 'b-blocks')} initialOpen={false}>
				<RangeControl
					label={__('Gap between buttons (px)', 'b-blocks')}
					value={parseInt(btnGap, 10) >= 0 ? parseInt(btnGap, 10) : 16}
					onChange={(val) => setAttributes({ btnGap: val })}
					min={4}
					max={64}
					step={2}
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={__('Show primary button', 'b-blocks')}
					checked={!!showPrimaryBtn}
					onChange={(val) => setAttributes({ showPrimaryBtn: !!val })}
				/>

				{showPrimaryBtn && (
					<>
						<TextControl
							label={__('Primary button label', 'b-blocks')}
							value={primaryBtnText || ''}
							onChange={(val) => setAttributes({ primaryBtnText: val })}
							placeholder={__('Get Started', 'b-blocks')}
							__nextHasNoMarginBottom
						/>

						<TextControl
							label={__('Primary button URL', 'b-blocks')}
							type='url'
							value={primaryBtnUrl || ''}
							onChange={(val) => setAttributes({ primaryBtnUrl: val })}
							placeholder='https://…'
							__nextHasNoMarginBottom
						/>

						<ToggleControl
							label={__('Open primary in new tab', 'b-blocks')}
							checked={!!primaryBtnNewTab}
							onChange={(val) => setAttributes({ primaryBtnNewTab: !!val })}
						/>

						<PanelRow>
							<Label className=''>{__('Primary bg:', 'b-blocks')}</Label>
							<ColorControl
								value={primaryBtnBgColor || '#ffffff'}
								onChange={(val) => setAttributes({ primaryBtnBgColor: val || '#ffffff' })}
								defaultColor='#ffffff'
							/>
						</PanelRow>
						<PanelRow>
							<Label className=''>{__('Primary text:', 'b-blocks')}</Label>
							<ColorControl
								value={primaryBtnTextColor || '#1a1a2e'}
								onChange={(val) => setAttributes({ primaryBtnTextColor: val || '#1a1a2e' })}
								defaultColor='#1a1a2e'
							/>
						</PanelRow>
						<PanelRow>
							<Label className=''>{__('Primary hover bg:', 'b-blocks')}</Label>
							<ColorControl
								value={primaryBtnHoverBgColor || '#e6e6f0'}
								onChange={(val) => setAttributes({ primaryBtnHoverBgColor: val || '#e6e6f0' })}
								defaultColor='#e6e6f0'
							/>
						</PanelRow>
						<PanelRow>
							<Label className=''>{__('Primary hover text:', 'b-blocks')}</Label>
							<ColorControl
								value={primaryBtnHoverTextColor || '#1a1a2e'}
								onChange={(val) => setAttributes({ primaryBtnHoverTextColor: val || '#1a1a2e' })}
								defaultColor='#1a1a2e'
							/>
						</PanelRow>

						<RangeControl
							label={__('Primary font size (px)', 'b-blocks')}
							value={parseInt(primaryBtnFontSize, 10) || 16}
							onChange={(val) => setAttributes({ primaryBtnFontSize: val })}
							min={12}
							max={28}
							step={1}
							__nextHasNoMarginBottom
						/>
						<SelectControl
							label={__('Primary font weight', 'b-blocks')}
							value={primaryBtnFontWeight || '600'}
							options={BTN_WEIGHT_OPTIONS}
							onChange={(val) => setAttributes({ primaryBtnFontWeight: val })}
							__nextHasNoMarginBottom
						/>
						<RangeControl
							label={__('Primary border radius (px)', 'b-blocks')}
							value={parseInt(primaryBtnBorderRadius, 10) >= 0 ? parseInt(primaryBtnBorderRadius, 10) : 6}
							onChange={(val) => setAttributes({ primaryBtnBorderRadius: val })}
							min={0}
							max={50}
							step={1}
							__nextHasNoMarginBottom
						/>
						<RangeControl
							label={__('Primary vertical padding (px)', 'b-blocks')}
							value={parseInt(primaryBtnPaddingV, 10) || 14}
							onChange={(val) => setAttributes({ primaryBtnPaddingV: val })}
							min={4}
							max={40}
							step={1}
							__nextHasNoMarginBottom
						/>
						<RangeControl
							label={__('Primary horizontal padding (px)', 'b-blocks')}
							value={parseInt(primaryBtnPaddingH, 10) || 28}
							onChange={(val) => setAttributes({ primaryBtnPaddingH: val })}
							min={8}
							max={80}
							step={1}
							__nextHasNoMarginBottom
						/>
					</>
				)}

				<hr style={{ margin: '16px 0' }} />

				<ToggleControl
					label={__('Show secondary button', 'b-blocks')}
					checked={!!showSecondaryBtn}
					onChange={(val) => setAttributes({ showSecondaryBtn: !!val })}
				/>

				{showSecondaryBtn && (
					<>
						<TextControl
							label={__('Secondary button label', 'b-blocks')}
							value={secondaryBtnText || ''}
							onChange={(val) => setAttributes({ secondaryBtnText: val })}
							placeholder={__('Learn More', 'b-blocks')}
							__nextHasNoMarginBottom
						/>

						<TextControl
							label={__('Secondary button URL', 'b-blocks')}
							type='url'
							value={secondaryBtnUrl || ''}
							onChange={(val) => setAttributes({ secondaryBtnUrl: val })}
							placeholder='https://…'
							__nextHasNoMarginBottom
						/>

						<ToggleControl
							label={__('Open secondary in new tab', 'b-blocks')}
							checked={!!secondaryBtnNewTab}
							onChange={(val) => setAttributes({ secondaryBtnNewTab: !!val })}
						/>

						<SelectControl
							label={__('Secondary variant', 'b-blocks')}
							value={secondaryBtnVariant || 'outline'}
							options={SECONDARY_VARIANT_OPTIONS}
							onChange={(val) => setAttributes({ secondaryBtnVariant: val })}
							__nextHasNoMarginBottom
						/>

						<PanelRow>
							<Label className=''>{__('Secondary color:', 'b-blocks')}</Label>
							<ColorControl
								value={secondaryBtnColor || '#ffffff'}
								onChange={(val) => setAttributes({ secondaryBtnColor: val || '#ffffff' })}
								defaultColor='#ffffff'
							/>
						</PanelRow>
						<PanelRow>
							<Label className=''>{__('Secondary text:', 'b-blocks')}</Label>
							<ColorControl
								value={secondaryBtnTextColor || '#ffffff'}
								onChange={(val) => setAttributes({ secondaryBtnTextColor: val || '#ffffff' })}
								defaultColor='#ffffff'
							/>
						</PanelRow>
						<PanelRow>
							<Label className=''>{__('Secondary hover bg:', 'b-blocks')}</Label>
							<ColorControl
								value={secondaryBtnHoverBgColor || 'rgba(255,255,255,0.14)'}
								onChange={(val) => setAttributes({ secondaryBtnHoverBgColor: val || 'rgba(255,255,255,0.14)' })}
								defaultColor='rgba(255,255,255,0.14)'
							/>
						</PanelRow>
						<PanelRow>
							<Label className=''>{__('Secondary hover text:', 'b-blocks')}</Label>
							<ColorControl
								value={secondaryBtnHoverTextColor || '#ffffff'}
								onChange={(val) => setAttributes({ secondaryBtnHoverTextColor: val || '#ffffff' })}
								defaultColor='#ffffff'
							/>
						</PanelRow>

						<RangeControl
							label={__('Secondary font size (px)', 'b-blocks')}
							value={parseInt(secondaryBtnFontSize, 10) || 16}
							onChange={(val) => setAttributes({ secondaryBtnFontSize: val })}
							min={12}
							max={28}
							step={1}
							__nextHasNoMarginBottom
						/>
						<SelectControl
							label={__('Secondary font weight', 'b-blocks')}
							value={secondaryBtnFontWeight || '600'}
							options={BTN_WEIGHT_OPTIONS}
							onChange={(val) => setAttributes({ secondaryBtnFontWeight: val })}
							__nextHasNoMarginBottom
						/>
						<RangeControl
							label={__('Secondary border radius (px)', 'b-blocks')}
							value={parseInt(secondaryBtnBorderRadius, 10) >= 0 ? parseInt(secondaryBtnBorderRadius, 10) : 6}
							onChange={(val) => setAttributes({ secondaryBtnBorderRadius: val })}
							min={0}
							max={50}
							step={1}
							__nextHasNoMarginBottom
						/>
						<RangeControl
							label={__('Secondary vertical padding (px)', 'b-blocks')}
							value={parseInt(secondaryBtnPaddingV, 10) || 14}
							onChange={(val) => setAttributes({ secondaryBtnPaddingV: val })}
							min={4}
							max={40}
							step={1}
							__nextHasNoMarginBottom
						/>
						<RangeControl
							label={__('Secondary horizontal padding (px)', 'b-blocks')}
							value={parseInt(secondaryBtnPaddingH, 10) || 28}
							onChange={(val) => setAttributes({ secondaryBtnPaddingH: val })}
							min={8}
							max={80}
							step={1}
							__nextHasNoMarginBottom
						/>
					</>
				)}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Spacing', 'b-blocks')} initialOpen={false}>
				<RangeControl
					label={__('Padding top — desktop (px)', 'b-blocks')}
					value={parseInt(paddingTop, 10) >= 0 ? parseInt(paddingTop, 10) : 96}
					onChange={(val) => setAttributes({ paddingTop: val })}
					min={0}
					max={320}
					step={4}
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={__('Padding bottom — desktop (px)', 'b-blocks')}
					value={parseInt(paddingBottom, 10) >= 0 ? parseInt(paddingBottom, 10) : 96}
					onChange={(val) => setAttributes({ paddingBottom: val })}
					min={0}
					max={320}
					step={4}
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={__('Padding top — mobile (px)', 'b-blocks')}
					value={parseInt(paddingTopMobile, 10) >= 0 ? parseInt(paddingTopMobile, 10) : 64}
					onChange={(val) => setAttributes({ paddingTopMobile: val })}
					min={0}
					max={320}
					step={4}
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={__('Padding bottom — mobile (px)', 'b-blocks')}
					value={parseInt(paddingBottomMobile, 10) >= 0 ? parseInt(paddingBottomMobile, 10) : 64}
					onChange={(val) => setAttributes({ paddingBottomMobile: val })}
					min={0}
					max={320}
					step={4}
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;

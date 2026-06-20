import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	ToggleControl,
	RangeControl,
	Button
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../utils/data';
import {
	videoSourceOptions,
	videoRatioOptions,
	alignmentOptions,
	animationOptions,
	bgShapeOptions,
	URL_PLACEHOLDERS
} from '../../../utils/data';

const parsePx = (val, fallback) => {
	if (typeof val === 'number') return val;
	if (!val && val !== 0) return fallback;
	const n = parseInt(String(val).replace(/[^0-9.-]/g, ''), 10);
	return Number.isFinite(n) ? n : fallback;
};

const triggerTypeOptions = [
	{ label: 'First Frame and Play button', value: 'first-frame' },
	{ label: 'Play Button Only', value: 'button-only' },
];

const Settings = ({ attributes, setAttributes }) => {
	const {
		triggerType,
		posterId, posterUrl, posterAlt,
		videoSource, videoUrl, videoTitle, videoRatio, maxWidth, autoplay,
		playIcon, overlayColor, posterRadius, posterWidth, alignment,
		animation, animationDuration
	} = attributes;

	const isButtonOnly = triggerType === 'button-only';

	const icon = playIcon || {};
	const iconSize = parsePx(icon.size, 72);
	const iconShape = icon.bgShape || 'circle';
	const iconBg = icon.bgColor || 'rgba(0,0,0,0.55)';
	const iconColor = icon.color || '#ffffff';

	const updateIcon = (next) => {
		setAttributes({ playIcon: { ...(playIcon || {}), ...next } });
	};

	const placeholder = URL_PLACEHOLDERS[videoSource] || URL_PLACEHOLDERS.youtube;

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody className='bPlPanelBody' title={__('Video', 'b-blocks')} initialOpen={true}>
				<PanelRow>
					<Label className=''>{__('Pop Up Trigger Type:', 'b-blocks')}</Label>
					<SelectControl
						value={triggerType || 'first-frame'}
						options={triggerTypeOptions}
						onChange={(val) => setAttributes({ triggerType: val })}
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Source:', 'b-blocks')}</Label>
					<SelectControl
						value={videoSource}
						options={videoSourceOptions}
						onChange={(val) => setAttributes({ videoSource: val })}
					/>
				</PanelRow>

				{videoSource === 'self' ? (
					<>
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={['video']}
								onSelect={(media) => setAttributes({ videoUrl: media?.url || '' })}
								render={({ open }) => (
									<Button
										variant='secondary'
										onClick={open}
										style={{ marginBottom: 8 }}
									>
										{videoUrl ? __('Replace Video File', 'b-blocks') : __('Select Video File', 'b-blocks')}
									</Button>
								)}
							/>
						</MediaUploadCheck>
						<TextControl
							label={__('Video URL', 'b-blocks')}
							value={videoUrl || ''}
							onChange={(val) => setAttributes({ videoUrl: val })}
							placeholder={placeholder}
							help={__('Direct URL to an MP4 file. Supports any URL the browser can play.', 'b-blocks')}
							__nextHasNoMarginBottom
						/>
					</>
				) : (
					<TextControl
						label={__('Video URL', 'b-blocks')}
						value={videoUrl || ''}
						onChange={(val) => setAttributes({ videoUrl: val })}
						placeholder={placeholder}
						help={
							videoSource === 'youtube'
								? __('Supports youtube.com/watch, youtu.be, embed, and shorts URLs.', 'b-blocks')
								: __('Supports vimeo.com and player.vimeo.com URLs.', 'b-blocks')
						}
						__nextHasNoMarginBottom
					/>
				)}

				<TextControl
					label={__('Video Title (optional)', 'b-blocks')}
					value={videoTitle || ''}
					onChange={(val) => setAttributes({ videoTitle: val })}
					placeholder={__('e.g. Product overview', 'b-blocks')}
					help={__('Used in the play button\'s screen-reader label and the iframe title.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{__('Aspect Ratio:', 'b-blocks')}</Label>
					<SelectControl
						value={videoRatio || '16/9'}
						options={videoRatioOptions}
						onChange={(val) => setAttributes({ videoRatio: val })}
					/>
				</PanelRow>

				<TextControl
					label={__('Lightbox Max Width', 'b-blocks')}
					value={maxWidth || '900px'}
					onChange={(val) => setAttributes({ maxWidth: val })}
					placeholder='900px'
					help={__('CSS length, e.g. 900px, 80vw, 50rem.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={__('Autoplay when opened', 'b-blocks')}
					checked={!!autoplay}
					onChange={(val) => setAttributes({ autoplay: val })}
					help={__('Some browsers will require muting to autoplay; YouTube/Vimeo handle this automatically.', 'b-blocks')}
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={isButtonOnly ? __('Trigger Layout', 'b-blocks') : __('Poster Image (optional)', 'b-blocks')}
				initialOpen={true}
			>
				{!isButtonOnly && <>
					<p style={{ margin: '0 0 12px', fontSize: 12, color: '#666' }}>
						{__('If omitted, the YouTube thumbnail / Vimeo cover / video first frame is used as the poster.', 'b-blocks')}
					</p>
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={['image']}
							value={posterId}
							onSelect={(media) => setAttributes({
								posterId: media?.id || 0,
								posterUrl: media?.url || '',
								posterAlt: media?.alt || posterAlt || ''
							})}
							render={({ open }) => (
								<Button variant='secondary' onClick={open}>
									{posterUrl ? __('Replace Poster Image', 'b-blocks') : __('Select Poster Image', 'b-blocks')}
								</Button>
							)}
						/>
					</MediaUploadCheck>

					{posterUrl && (
						<Button
							variant='link'
							isDestructive
							onClick={() => setAttributes({ posterId: 0, posterUrl: '', posterAlt: '' })}
							style={{ marginTop: 8 }}
						>
							{__('Remove Poster', 'b-blocks')}
						</Button>
					)}

					{posterUrl && (
						<TextControl
							label={__('Alt Text', 'b-blocks')}
							value={posterAlt || ''}
							onChange={(val) => setAttributes({ posterAlt: val })}
							placeholder={__('Describe the image for screen readers', 'b-blocks')}
							help={__('Used as the trigger button\'s accessible name.', 'b-blocks')}
							__nextHasNoMarginBottom
						/>
					)}

					<TextControl
						label={__('Poster Width', 'b-blocks')}
						value={posterWidth || '100%'}
						onChange={(val) => setAttributes({ posterWidth: val })}
						placeholder='100%'
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Border Radius (px)', 'b-blocks')}
						value={parsePx(posterRadius, 0)}
						onChange={(val) => setAttributes({ posterRadius: `${parseInt(val, 10) || 0}px` })}
						min={0}
						max={64}
						step={1}
						__nextHasNoMarginBottom
					/>
				</>}

				<PanelRow>
					<Label className=''>{__('Alignment:', 'b-blocks')}</Label>
					<SelectControl
						value={alignment || 'center'}
						options={alignmentOptions}
						onChange={(val) => setAttributes({ alignment: val })}
					/>
				</PanelRow>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Play Button', 'b-blocks')} initialOpen={false}>
				<RangeControl
					label={__('Icon Size (px)', 'b-blocks')}
					value={iconSize}
					onChange={(val) => updateIcon({ size: parseInt(val, 10) || 72 })}
					min={24}
					max={200}
					step={2}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{__('Icon Color:', 'b-blocks')}</Label>
					<ColorControl
						value={iconColor}
						onChange={(val) => updateIcon({ color: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Background Shape:', 'b-blocks')}</Label>
					<SelectControl
						value={iconShape}
						options={bgShapeOptions}
						onChange={(val) => updateIcon({ bgShape: val })}
					/>
				</PanelRow>

				{iconShape !== 'none' && (
					<PanelRow>
						<Label className=''>{__('Background Color:', 'b-blocks')}</Label>
						<ColorControl
							value={iconBg}
							onChange={(val) => updateIcon({ bgColor: val })}
							defaultColor='rgba(0,0,0,0.55)'
						/>
					</PanelRow>
				)}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Lightbox Style', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Label className=''>{__('Overlay Color:', 'b-blocks')}</Label>
					<ColorControl
						value={overlayColor}
						onChange={(val) => setAttributes({ overlayColor: val })}
						defaultColor='rgba(0,0,0,0.85)'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Open Animation:', 'b-blocks')}</Label>
					<SelectControl
						value={animation || 'zoom'}
						options={animationOptions}
						onChange={(val) => setAttributes({ animation: val })}
					/>
				</PanelRow>

				<RangeControl
					label={__('Animation Duration (s)', 'b-blocks')}
					value={Number(animationDuration) || 0.3}
					onChange={(val) => setAttributes({ animationDuration: Math.max(0, Math.min(2, Number(val) || 0)) })}
					min={0}
					max={1.5}
					step={0.05}
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;

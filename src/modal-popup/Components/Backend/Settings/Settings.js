import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl, Button } from '@wordpress/components';

import { Label, ColorControl, ColorsControl, IconControl, Typography, HelpPanel } from '../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../utils/data';
import { triggerTypeOptions, triggerAlignOptions, modalSizeOptions, animationOptions } from '../../../utils/data';

const Settings = ({ attributes, setAttributes }) => {
	const {
		triggerType, triggerLabel, triggerIcon, triggerImageId, triggerImageUrl, triggerImageAlt, triggerAlign,
		triggerBtnColors, triggerBtnPadding, triggerBtnBorderRadius, triggerTypography,
		modalSize, modalBgColor, overlayColor, modalPadding, modalBorderRadius,
		showCloseButton, closeOnOverlayClick, closeOnEscape, animation,
		modalTitle, modalTitleTypography, modalTitleColor
	} = attributes;

	const parsePx = (val, fallback) => {
		if (typeof val === 'number') return val;
		if (!val) return fallback;
		const n = parseInt(String(val).replace(/[^0-9.-]/g, ''), 10);
		return Number.isFinite(n) ? n : fallback;
	};

	return <InspectorControls>
		<HelpPanel slug={pluginSlug} />

		<PanelBody className='bPlPanelBody' title={__('Trigger', 'b-blocks')}>
			<PanelRow>
				<Label className=''>{__('Trigger Type:', 'b-blocks')}</Label>
				<SelectControl
					value={triggerType}
					options={triggerTypeOptions}
					onChange={val => setAttributes({ triggerType: val })}
				/>
			</PanelRow>

			{(triggerType === 'button' || triggerType === 'text') && <TextControl
				label={__('Trigger Label', 'b-blocks')}
				value={triggerLabel}
				onChange={val => setAttributes({ triggerLabel: val })}
				placeholder={__('Open', 'b-blocks')}
			/>}

			{triggerType === 'icon' && <>
				<TextControl
					label={__('Accessible Label', 'b-blocks')}
					help={__('Used as the aria-label for screen readers.', 'b-blocks')}
					value={triggerLabel}
					onChange={val => setAttributes({ triggerLabel: val })}
					placeholder={__('Open modal', 'b-blocks')}
				/>
				<IconControl
					label={__('Trigger Icon:', 'b-blocks')}
					value={triggerIcon}
					onChange={val => setAttributes({ triggerIcon: val })}
					defaults={{ class: 'fa-solid fa-circle-info', fontSize: 24, color: '#0073aa' }}
				/>
			</>}

			{triggerType === 'button' && <IconControl
				label={__('Inline Icon (optional):', 'b-blocks')}
				value={triggerIcon}
				onChange={val => setAttributes({ triggerIcon: val })}
				defaults={{ class: '', fontSize: 16, color: '#ffffff' }}
				isSize={false}
				isColor={false}
			/>}

			{triggerType === 'image' && <>
				<TextControl
					label={__('Image Alt Text', 'b-blocks')}
					help={__('Describes the image for screen readers and is used as the button\'s accessible name.', 'b-blocks')}
					value={triggerImageAlt}
					onChange={val => setAttributes({ triggerImageAlt: val })}
					placeholder={__('Open modal preview', 'b-blocks')}
				/>
				<MediaUploadCheck>
					<MediaUpload
						allowedTypes={['image']}
						value={triggerImageId}
						onSelect={(media) => setAttributes({
							triggerImageId: media?.id || 0,
							triggerImageUrl: media?.url || '',
							triggerImageAlt: media?.alt || triggerImageAlt
						})}
						render={({ open }) => <Button
							variant='secondary'
							onClick={open}
						>
							{triggerImageUrl ? __('Replace Image', 'b-blocks') : __('Select Image', 'b-blocks')}
						</Button>}
					/>
				</MediaUploadCheck>
				{triggerImageUrl && <Button
					variant='link'
					isDestructive
					onClick={() => setAttributes({ triggerImageId: 0, triggerImageUrl: '', triggerImageAlt: '' })}
					style={{ marginTop: 8 }}
				>
					{__('Remove Image', 'b-blocks')}
				</Button>}
			</>}

			<PanelRow>
				<Label className=''>{__('Trigger Alignment:', 'b-blocks')}</Label>
				<SelectControl
					value={triggerAlign}
					options={triggerAlignOptions}
					onChange={val => setAttributes({ triggerAlign: val })}
				/>
			</PanelRow>
		</PanelBody>

		{triggerType === 'button' && <PanelBody className='bPlPanelBody' title={__('Button Trigger Style', 'b-blocks')} initialOpen={false}>
			<ColorsControl
				label={__('Button Colors:', 'b-blocks')}
				value={triggerBtnColors}
				onChange={val => setAttributes({ triggerBtnColors: val })}
				defaults={{ color: '#ffffff', bg: '#0073aa' }}
			/>

			<PanelRow>
				<Label className=''>{__('Hover Text:', 'b-blocks')}</Label>
				<ColorControl
					value={triggerBtnColors?.hoverColor}
					onChange={val => setAttributes({ triggerBtnColors: { ...(triggerBtnColors || {}), hoverColor: val } })}
					defaultColor='#ffffff'
				/>
			</PanelRow>

			<PanelRow>
				<Label className=''>{__('Hover BG:', 'b-blocks')}</Label>
				<ColorControl
					value={triggerBtnColors?.hoverBg}
					onChange={val => setAttributes({ triggerBtnColors: { ...(triggerBtnColors || {}), hoverBg: val } })}
					defaultColor='#005177'
				/>
			</PanelRow>

			<RangeControl
				label={__('Vertical Padding (px)', 'b-blocks')}
				value={parsePx(triggerBtnPadding?.vertical, 10)}
				onChange={val => setAttributes({ triggerBtnPadding: { ...(triggerBtnPadding || {}), vertical: `${val}px` } })}
				min={0}
				max={60}
			/>

			<RangeControl
				label={__('Horizontal Padding (px)', 'b-blocks')}
				value={parsePx(triggerBtnPadding?.horizontal, 20)}
				onChange={val => setAttributes({ triggerBtnPadding: { ...(triggerBtnPadding || {}), horizontal: `${val}px` } })}
				min={0}
				max={80}
			/>

			<RangeControl
				label={__('Border Radius (px)', 'b-blocks')}
				value={parsePx(triggerBtnBorderRadius, 4)}
				onChange={val => setAttributes({ triggerBtnBorderRadius: `${val}px` })}
				min={0}
				max={50}
			/>

			<Typography
				value={triggerTypography}
				onChange={val => setAttributes({ triggerTypography: val })}
				defaults={{ fontSize: { desktop: 16, tablet: 15, mobile: 14 } }}
			/>
		</PanelBody>}

		{triggerType === 'text' && <PanelBody className='bPlPanelBody' title={__('Text Trigger Style', 'b-blocks')} initialOpen={false}>
			<ColorControl
				label={__('Text Color:', 'b-blocks')}
				value={triggerBtnColors?.color}
				onChange={val => setAttributes({ triggerBtnColors: { ...(triggerBtnColors || {}), color: val } })}
				defaultColor='#0073aa'
			/>
			<ColorControl
				label={__('Hover Color:', 'b-blocks')}
				value={triggerBtnColors?.hoverColor}
				onChange={val => setAttributes({ triggerBtnColors: { ...(triggerBtnColors || {}), hoverColor: val } })}
				defaultColor='#005177'
			/>
			<Typography
				value={triggerTypography}
				onChange={val => setAttributes({ triggerTypography: val })}
				defaults={{ fontSize: { desktop: 16, tablet: 15, mobile: 14 } }}
			/>
		</PanelBody>}

		<PanelBody className='bPlPanelBody' title={__('Modal', 'b-blocks')} initialOpen={false}>
			<PanelRow>
				<Label className=''>{__('Modal Size:', 'b-blocks')}</Label>
				<SelectControl
					value={modalSize}
					options={modalSizeOptions}
					onChange={val => setAttributes({ modalSize: val })}
				/>
			</PanelRow>

			<TextControl
				label={__('Modal Title (optional)', 'b-blocks')}
				value={modalTitle}
				onChange={val => setAttributes({ modalTitle: val })}
				placeholder={__('Leave empty to hide', 'b-blocks')}
			/>

			{modalTitle && <>
				<ColorControl
					label={__('Title Color:', 'b-blocks')}
					value={modalTitleColor}
					onChange={val => setAttributes({ modalTitleColor: val })}
					defaultColor='#111111'
				/>
				<Typography
					value={modalTitleTypography}
					onChange={val => setAttributes({ modalTitleTypography: val })}
					defaults={{ fontSize: { desktop: 22, tablet: 20, mobile: 18 }, fontWeight: 600 }}
				/>
			</>}

			<ColorControl
				label={__('Background Color:', 'b-blocks')}
				value={modalBgColor}
				onChange={val => setAttributes({ modalBgColor: val })}
				defaultColor='#ffffff'
			/>

			<ColorControl
				label={__('Overlay Color:', 'b-blocks')}
				value={overlayColor}
				onChange={val => setAttributes({ overlayColor: val })}
				defaultColor='rgba(0,0,0,0.6)'
			/>

			<RangeControl
				label={__('Vertical Padding (px)', 'b-blocks')}
				value={parsePx(modalPadding?.vertical, 30)}
				onChange={val => setAttributes({ modalPadding: { ...(modalPadding || {}), vertical: `${val}px` } })}
				min={0}
				max={80}
			/>

			<RangeControl
				label={__('Horizontal Padding (px)', 'b-blocks')}
				value={parsePx(modalPadding?.horizontal, 30)}
				onChange={val => setAttributes({ modalPadding: { ...(modalPadding || {}), horizontal: `${val}px` } })}
				min={0}
				max={80}
			/>

			<RangeControl
				label={__('Border Radius (px)', 'b-blocks')}
				value={parsePx(modalBorderRadius, 8)}
				onChange={val => setAttributes({ modalBorderRadius: `${val}px` })}
				min={0}
				max={40}
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Behavior', 'b-blocks')} initialOpen={false}>
			<ToggleControl
				label={__('Show Close Button', 'b-blocks')}
				checked={!!showCloseButton}
				onChange={val => setAttributes({ showCloseButton: val })}
			/>

			<ToggleControl
				label={__('Close on Overlay Click', 'b-blocks')}
				checked={!!closeOnOverlayClick}
				onChange={val => setAttributes({ closeOnOverlayClick: val })}
			/>

			<ToggleControl
				label={__('Close on Escape Key', 'b-blocks')}
				checked={!!closeOnEscape}
				onChange={val => setAttributes({ closeOnEscape: val })}
			/>

			<PanelRow>
				<Label className=''>{__('Entry Animation:', 'b-blocks')}</Label>
				<SelectControl
					value={animation}
					options={animationOptions}
					onChange={val => setAttributes({ animation: val })}
				/>
			</PanelRow>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;

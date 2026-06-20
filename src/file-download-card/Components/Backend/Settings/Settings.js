import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	RangeControl,
	TextControl,
	TextareaControl,
	ToggleControl,
	Button,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';
import { fontWeightOptions, badgeForMime } from '../../../utils/data';

const Settings = ({ attributes, setAttributes }) => {
	const {
		fileUrl,
		fileId,
		fileName,
		fileType,
		fileSize,
		cardTitle,
		cardDescription,
		buttonLabel,
		openNewTab,
		showFileType,
		showFileSize,
		layout,
		iconStyle,
		alignment,
		maxWidth,
		cardBg,
		cardBorderColor,
		cardBorderWidth,
		cardBorderRadius,
		paddingV,
		paddingH,
		shadow,
		iconBg,
		iconColor,
		iconSize,
		iconRadius,
		titleColor,
		titleSize,
		titleWeight,
		descColor,
		descSize,
		metaColor,
		metaSize,
		btnBg,
		btnText,
		btnHoverBg,
		btnHoverText,
		btnRadius,
		btnPaddingV,
		btnPaddingH,
		btnSize,
		btnWeight,
		addID,
		addClass,
		addCSS,
	} = attributes;

	const onSelectFile = (media) => {
		setAttributes({
			fileId: media?.id || 0,
			fileUrl: media?.url || '',
			fileName: media?.title || media?.filename || '',
			fileType: media?.mime || '',
			fileSize: media?.filesizeHumanReadable || '',
		});
	};

	const clearFile = () => {
		setAttributes({ fileId: 0, fileUrl: '', fileName: '', fileType: '', fileSize: '' });
	};

	const badgeLabel = fileUrl ? badgeForMime(fileType, fileUrl) : '';

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody className='bPlPanelBody' title={__('File', 'b-blocks')} initialOpen={true}>
				{fileUrl ? (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							marginBottom: 10,
							padding: '8px 10px',
							background: '#f0f0f1',
							borderRadius: 6,
						}}
					>
						<strong style={{ fontSize: 11 }}>{badgeLabel}</strong>
						<span style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
							{fileName || fileUrl}
						</span>
					</div>
				) : null}

				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
					<MediaUploadCheck>
						<MediaUpload
							value={fileId || 0}
							onSelect={onSelectFile}
							render={({ open }) => (
								<Button variant='secondary' onClick={open}>
									{fileUrl ? __('Replace File', 'b-blocks') : __('Select File', 'b-blocks')}
								</Button>
							)}
						/>
					</MediaUploadCheck>
					{fileUrl && (
						<Button variant='link' isDestructive onClick={clearFile}>
							{__('Remove', 'b-blocks')}
						</Button>
					)}
				</div>

				<TextControl
					label={__('Or enter file URL', 'b-blocks')}
					value={fileId ? '' : fileUrl || ''}
					onChange={(val) => setAttributes({ fileUrl: val, fileId: 0 })}
					type='url'
					placeholder='https://'
					help={
						fileId
							? __('Using a media-library file. Remove it to enter an external URL.', 'b-blocks')
							: __('Use for files hosted outside the media library.', 'b-blocks')
					}
					disabled={!!fileId}
					__nextHasNoMarginBottom
				/>

				<TextControl
					className='mt20'
					label={__('Card title', 'b-blocks')}
					value={cardTitle || ''}
					onChange={(val) => setAttributes({ cardTitle: val })}
					placeholder={fileName || __('Auto-uses file name', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Description', 'b-blocks')}
					value={cardDescription || ''}
					onChange={(val) => setAttributes({ cardDescription: val })}
					placeholder={__('Optional short description', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Button label', 'b-blocks')}
					value={buttonLabel || ''}
					onChange={(val) => setAttributes({ buttonLabel: val })}
					placeholder={__('Download', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('File size (override)', 'b-blocks')}
					value={fileSize || ''}
					onChange={(val) => setAttributes({ fileSize: val })}
					placeholder='e.g. 2.4 MB'
					help={
						fileId
							? __('Auto-detected from the media library on the front end.', 'b-blocks')
							: __('Shown for external URLs (not auto-detected).', 'b-blocks')
					}
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					className='mt20'
					label={__('Open in new tab', 'b-blocks')}
					checked={!!openNewTab}
					onChange={(val) => setAttributes({ openNewTab: val })}
				/>

				<ToggleControl
					label={__('Show file type badge', 'b-blocks')}
					checked={!!showFileType}
					onChange={(val) => setAttributes({ showFileType: val })}
				/>

				<ToggleControl
					label={__('Show file size', 'b-blocks')}
					checked={!!showFileSize}
					onChange={(val) => setAttributes({ showFileSize: val })}
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={false}>
				<SelectControl
					label={__('Layout', 'b-blocks')}
					value={layout}
					options={[
						{ label: __('Horizontal (icon left)', 'b-blocks'), value: 'horizontal' },
						{ label: __('Vertical (icon top)', 'b-blocks'), value: 'vertical' },
					]}
					onChange={(val) => setAttributes({ layout: val })}
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

				<RangeControl
					label={__('Border Radius', 'b-blocks')}
					value={cardBorderRadius}
					onChange={(val) => setAttributes({ cardBorderRadius: val })}
					min={0}
					max={32}
				/>

				<RangeControl
					label={__('Border Width', 'b-blocks')}
					value={cardBorderWidth}
					onChange={(val) => setAttributes({ cardBorderWidth: val })}
					min={0}
					max={8}
				/>

				<RangeControl
					label={__('Padding — Vertical', 'b-blocks')}
					value={paddingV}
					onChange={(val) => setAttributes({ paddingV: val })}
					min={0}
					max={80}
				/>

				<RangeControl
					label={__('Padding — Horizontal', 'b-blocks')}
					value={paddingH}
					onChange={(val) => setAttributes({ paddingH: val })}
					min={0}
					max={80}
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
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Colors', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Label>{__('Card Background:', 'b-blocks')}</Label>
					<ColorControl
						value={cardBg || '#ffffff'}
						onChange={(val) => setAttributes({ cardBg: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<PanelRow>
					<Label>{__('Card Border:', 'b-blocks')}</Label>
					<ColorControl
						value={cardBorderColor || '#e0e0e0'}
						onChange={(val) => setAttributes({ cardBorderColor: val })}
						defaultColor='#e0e0e0'
					/>
				</PanelRow>

				<PanelRow>
					<Label>{__('Title Color:', 'b-blocks')}</Label>
					<ColorControl
						value={titleColor || '#111827'}
						onChange={(val) => setAttributes({ titleColor: val })}
						defaultColor='#111827'
					/>
				</PanelRow>

				<PanelRow>
					<Label>{__('Description Color:', 'b-blocks')}</Label>
					<ColorControl
						value={descColor || '#6b7280'}
						onChange={(val) => setAttributes({ descColor: val })}
						defaultColor='#6b7280'
					/>
				</PanelRow>

				<PanelRow>
					<Label>{__('Meta Color:', 'b-blocks')}</Label>
					<ColorControl
						value={metaColor || '#9ca3af'}
						onChange={(val) => setAttributes({ metaColor: val })}
						defaultColor='#9ca3af'
					/>
				</PanelRow>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Icon Badge', 'b-blocks')} initialOpen={false}>
				<SelectControl
					label={__('Style', 'b-blocks')}
					value={iconStyle}
					options={[
						{ label: __('Filled', 'b-blocks'), value: 'filled' },
						{ label: __('Outline', 'b-blocks'), value: 'outline' },
					]}
					onChange={(val) => setAttributes({ iconStyle: val })}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Badge Size', 'b-blocks')}
					value={iconSize}
					onChange={(val) => setAttributes({ iconSize: val })}
					min={32}
					max={96}
				/>

				<RangeControl
					label={__('Corner Radius', 'b-blocks')}
					value={iconRadius}
					onChange={(val) => setAttributes({ iconRadius: val })}
					min={0}
					max={48}
				/>

				<PanelRow>
					<Label>{__('Badge Background:', 'b-blocks')}</Label>
					<ColorControl
						value={iconBg || '#2563eb'}
						onChange={(val) => setAttributes({ iconBg: val })}
						defaultColor='#2563eb'
					/>
				</PanelRow>

				<PanelRow>
					<Label>{__('Icon / Text Color:', 'b-blocks')}</Label>
					<ColorControl
						value={iconColor || '#ffffff'}
						onChange={(val) => setAttributes({ iconColor: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Button', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Label>{__('Background:', 'b-blocks')}</Label>
					<ColorControl
						value={btnBg || '#2563eb'}
						onChange={(val) => setAttributes({ btnBg: val })}
						defaultColor='#2563eb'
					/>
				</PanelRow>

				<PanelRow>
					<Label>{__('Text Color:', 'b-blocks')}</Label>
					<ColorControl
						value={btnText || '#ffffff'}
						onChange={(val) => setAttributes({ btnText: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<PanelRow>
					<Label>{__('Hover Background:', 'b-blocks')}</Label>
					<ColorControl
						value={btnHoverBg || '#1d4ed8'}
						onChange={(val) => setAttributes({ btnHoverBg: val })}
						defaultColor='#1d4ed8'
					/>
				</PanelRow>

				<PanelRow>
					<Label>{__('Hover Text Color:', 'b-blocks')}</Label>
					<ColorControl
						value={btnHoverText || '#ffffff'}
						onChange={(val) => setAttributes({ btnHoverText: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<RangeControl
					className='mt10'
					label={__('Border Radius', 'b-blocks')}
					value={btnRadius}
					onChange={(val) => setAttributes({ btnRadius: val })}
					min={0}
					max={9999}
					step={1}
				/>

				<RangeControl
					label={__('Font Size', 'b-blocks')}
					value={btnSize}
					onChange={(val) => setAttributes({ btnSize: val })}
					min={11}
					max={20}
				/>

				<SelectControl
					label={__('Font Weight', 'b-blocks')}
					value={btnWeight}
					options={fontWeightOptions}
					onChange={(val) => setAttributes({ btnWeight: val })}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Padding — Vertical', 'b-blocks')}
					value={btnPaddingV}
					onChange={(val) => setAttributes({ btnPaddingV: val })}
					min={0}
					max={48}
				/>

				<RangeControl
					label={__('Padding — Horizontal', 'b-blocks')}
					value={btnPaddingH}
					onChange={(val) => setAttributes({ btnPaddingH: val })}
					min={0}
					max={80}
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Typography', 'b-blocks')} initialOpen={false}>
				<RangeControl
					label={__('Title Size', 'b-blocks')}
					value={titleSize}
					onChange={(val) => setAttributes({ titleSize: val })}
					min={12}
					max={36}
				/>
				<SelectControl
					label={__('Title Weight', 'b-blocks')}
					value={titleWeight}
					options={fontWeightOptions}
					onChange={(val) => setAttributes({ titleWeight: val })}
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={__('Description Size', 'b-blocks')}
					value={descSize}
					onChange={(val) => setAttributes({ descSize: val })}
					min={11}
					max={24}
				/>
				<RangeControl
					label={__('Meta Size', 'b-blocks')}
					value={metaSize}
					onChange={(val) => setAttributes({ metaSize: val })}
					min={10}
					max={18}
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Advanced', 'b-blocks')} initialOpen={false}>
				<TextControl
					label={__('Custom ID', 'b-blocks')}
					value={addID || ''}
					onChange={(val) => setAttributes({ addID: val })}
					placeholder={__('Enter a custom HTML id', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Custom Class', 'b-blocks')}
					value={addClass || ''}
					onChange={(val) => setAttributes({ addClass: val })}
					placeholder={__('Enter additional CSS class(es)', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextareaControl
					label={__('Custom CSS', 'b-blocks')}
					value={addCSS || ''}
					onChange={(val) => setAttributes({ addCSS: val })}
					placeholder={__('Enter additional CSS', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;

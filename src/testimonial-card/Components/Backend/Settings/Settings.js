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
		reviewerRole,
		reviewerCompany,
		avatarId,
		avatarUrl,
		rating,
		layout,
		avatarPosition,
		avatarSize,
		avatarShape,
		showCompany,
		showAvatar,
		showRating,
		quoteIcon,
		quoteIconColor,
		accentColor,
		cardBg,
		textColor,
		nameColor,
		metaColor,
		borderColor,
		borderWidth,
		borderRadius,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		textFontSize,
		textFontWeight,
		nameFontSize,
		nameFontWeight,
		metaFontSize,
		starSize,
		alignment,
		maxWidth,
		bubbleTailPosition,
	} = attributes;

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>
				<SelectControl
					label={__('Layout', 'b-blocks')}
					value={layout}
					options={[
						{ label: __('Card', 'b-blocks'), value: 'card' },
						{ label: __('Minimal', 'b-blocks'), value: 'minimal' },
						{ label: __('Bubble', 'b-blocks'), value: 'bubble' },
					]}
					onChange={(val) => setAttributes({ layout: val })}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Avatar Position', 'b-blocks')}
					value={avatarPosition}
					options={[
						{ label: __('Left', 'b-blocks'), value: 'left' },
						{ label: __('Top', 'b-blocks'), value: 'top' },
						{ label: __('Right', 'b-blocks'), value: 'right' },
					]}
					onChange={(val) => setAttributes({ avatarPosition: val })}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Text Alignment', 'b-blocks')}
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
					max={1200}
					step={10}
					help={maxWidth === 0 ? __('Auto (full container width)', 'b-blocks') : `${maxWidth}px`}
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={false}>
				<RangeControl
					label={__('Rating', 'b-blocks')}
					value={rating}
					onChange={(val) => setAttributes({ rating: val })}
					min={0}
					max={5}
					step={1}
					help={rating === 0 ? __('Hidden', 'b-blocks') : `${rating}/5`}
				/>

				<TextControl
					label={__('Reviewer Role', 'b-blocks')}
					value={reviewerRole || ''}
					onChange={(val) => setAttributes({ reviewerRole: val })}
					placeholder={__('e.g. Product Manager', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Company', 'b-blocks')}
					value={reviewerCompany || ''}
					onChange={(val) => setAttributes({ reviewerCompany: val })}
					placeholder={__('e.g. Acme Inc.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					className='mt20'
					label={__('Show Avatar', 'b-blocks')}
					checked={!!showAvatar}
					onChange={(val) => setAttributes({ showAvatar: val })}
				/>

				<ToggleControl
					label={__('Show Company', 'b-blocks')}
					checked={!!showCompany}
					onChange={(val) => setAttributes({ showCompany: val })}
				/>

				<ToggleControl
					label={__('Show Rating', 'b-blocks')}
					checked={!!showRating}
					onChange={(val) => setAttributes({ showRating: val })}
				/>

				<ToggleControl
					label={__('Show Quote Icon', 'b-blocks')}
					checked={!!quoteIcon}
					onChange={(val) => setAttributes({ quoteIcon: val })}
				/>

				{layout === 'bubble' && (
					<SelectControl
						label={__('Bubble Tail Position', 'b-blocks')}
						value={bubbleTailPosition}
						options={[
							{ label: __('Bottom-left', 'b-blocks'), value: 'bottom-left' },
							{ label: __('Bottom-right', 'b-blocks'), value: 'bottom-right' },
						]}
						onChange={(val) => setAttributes({ bubbleTailPosition: val })}
						__nextHasNoMarginBottom
					/>
				)}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Avatar', 'b-blocks')} initialOpen={false}>
				{avatarUrl && (
					<div style={{ marginBottom: 8 }}>
						<img
							src={avatarUrl}
							alt=''
							style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
						/>
					</div>
				)}
				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={['image']}
							value={avatarId || 0}
							onSelect={(media) => setAttributes({
								avatarId: media?.id || 0,
								avatarUrl: media?.url || '',
							})}
							render={({ open }) => (
								<Button variant='secondary' onClick={open}>
									{avatarUrl ? __('Replace Avatar', 'b-blocks') : __('Select Avatar', 'b-blocks')}
								</Button>
							)}
						/>
					</MediaUploadCheck>
					{avatarUrl && (
						<Button
							variant='link'
							isDestructive
							onClick={() => setAttributes({ avatarId: 0, avatarUrl: '' })}
						>
							{__('Remove', 'b-blocks')}
						</Button>
					)}
				</div>

				<RangeControl
					label={__('Size', 'b-blocks')}
					value={avatarSize}
					onChange={(val) => setAttributes({ avatarSize: val })}
					min={32}
					max={120}
				/>

				<SelectControl
					label={__('Shape', 'b-blocks')}
					value={avatarShape}
					options={[
						{ label: __('Circle', 'b-blocks'), value: 'circle' },
						{ label: __('Rounded', 'b-blocks'), value: 'rounded' },
						{ label: __('Square', 'b-blocks'), value: 'square' },
					]}
					onChange={(val) => setAttributes({ avatarShape: val })}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Style', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Label>{__('Accent Color:', 'b-blocks')}</Label>
					<ColorControl
						value={accentColor || '#0d6efd'}
						onChange={(val) => setAttributes({ accentColor: val })}
						defaultColor='#0d6efd'
					/>
				</PanelRow>

				{layout !== 'minimal' && (
					<PanelRow>
						<Label>{__('Card Background:', 'b-blocks')}</Label>
						<ColorControl
							value={cardBg || '#ffffff'}
							onChange={(val) => setAttributes({ cardBg: val })}
							defaultColor='#ffffff'
						/>
					</PanelRow>
				)}

				<PanelRow>
					<Label>{__('Text Color:', 'b-blocks')}</Label>
					<ColorControl
						value={textColor || ''}
						onChange={(val) => setAttributes({ textColor: val || '' })}
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label>{__('Name Color:', 'b-blocks')}</Label>
					<ColorControl
						value={nameColor || ''}
						onChange={(val) => setAttributes({ nameColor: val || '' })}
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label>{__('Meta Color:', 'b-blocks')}</Label>
					<ColorControl
						value={metaColor || ''}
						onChange={(val) => setAttributes({ metaColor: val || '' })}
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label>{__('Quote Icon Color:', 'b-blocks')}</Label>
					<ColorControl
						value={quoteIconColor || ''}
						onChange={(val) => setAttributes({ quoteIconColor: val || '' })}
						defaultColor=''
					/>
				</PanelRow>

				{layout === 'card' && (
					<>
						<PanelRow>
							<Label>{__('Border Color:', 'b-blocks')}</Label>
							<ColorControl
								value={borderColor || ''}
								onChange={(val) => setAttributes({ borderColor: val || '' })}
								defaultColor=''
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
					</>
				)}

				<RangeControl
					label={__('Border Radius', 'b-blocks')}
					value={borderRadius}
					onChange={(val) => setAttributes({ borderRadius: val })}
					min={0}
					max={48}
				/>

				<RangeControl
					label={__('Star Size', 'b-blocks')}
					value={starSize}
					onChange={(val) => setAttributes({ starSize: val })}
					min={10}
					max={32}
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Typography', 'b-blocks')} initialOpen={false}>
				<Label>{__('Review Text', 'b-blocks')}</Label>
				<RangeControl
					label={__('Font Size', 'b-blocks')}
					value={textFontSize}
					onChange={(val) => setAttributes({ textFontSize: val })}
					min={12}
					max={32}
				/>
				<SelectControl
					label={__('Weight', 'b-blocks')}
					value={textFontWeight}
					options={fontWeightOptions}
					onChange={(val) => setAttributes({ textFontWeight: val })}
					__nextHasNoMarginBottom
				/>

				<Label className='mt20'>{__('Reviewer Name', 'b-blocks')}</Label>
				<RangeControl
					label={__('Font Size', 'b-blocks')}
					value={nameFontSize}
					onChange={(val) => setAttributes({ nameFontSize: val })}
					min={12}
					max={28}
				/>
				<SelectControl
					label={__('Weight', 'b-blocks')}
					value={nameFontWeight}
					options={fontWeightOptions}
					onChange={(val) => setAttributes({ nameFontWeight: val })}
					__nextHasNoMarginBottom
				/>

				<Label className='mt20'>{__('Role / Company', 'b-blocks')}</Label>
				<RangeControl
					label={__('Font Size', 'b-blocks')}
					value={metaFontSize}
					onChange={(val) => setAttributes({ metaFontSize: val })}
					min={10}
					max={20}
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Spacing', 'b-blocks')} initialOpen={false}>
				<RangeControl
					label={__('Padding Top', 'b-blocks')}
					value={paddingTop}
					onChange={(val) => setAttributes({ paddingTop: val })}
					min={0}
					max={96}
				/>
				<RangeControl
					label={__('Padding Right', 'b-blocks')}
					value={paddingRight}
					onChange={(val) => setAttributes({ paddingRight: val })}
					min={0}
					max={96}
				/>
				<RangeControl
					label={__('Padding Bottom', 'b-blocks')}
					value={paddingBottom}
					onChange={(val) => setAttributes({ paddingBottom: val })}
					min={0}
					max={96}
				/>
				<RangeControl
					label={__('Padding Left', 'b-blocks')}
					value={paddingLeft}
					onChange={(val) => setAttributes({ paddingLeft: val })}
					min={0}
					max={96}
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;

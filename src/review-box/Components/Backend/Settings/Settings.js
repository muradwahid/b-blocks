import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RadioControl,
	RangeControl,
	TextControl,
	TextareaControl,
	ToggleControl,
	Button,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

import CriteriaRepeater from '../CriteriaRepeater';
import TextRepeater from '../TextRepeater';

const Settings = ({ attributes, setAttributes }) => {
	const {
		productName,
		reviewAuthor,
		reviewDate,
		reviewSummary,
		ratingMode,
		overallRating,
		maxRating,
		criteria,
		pros,
		cons,
		ctaLabel,
		ctaUrl,
		ctaNewTab,
		ctaNofollow,
		showSchema,
		productImage = {},
		styles = {},
		showProsConsColumns,
		showCriteria,
	} = attributes;

	const setStyle = (key, val) => {
		setAttributes({ styles: { ...styles, [key]: val } });
	};

	const safeMax = Math.max(1, Math.min(10, parseInt(maxRating, 10) || 5));

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={true}>
				<TextControl
					label={__('Product Name', 'b-blocks')}
					value={productName || ''}
					onChange={(val) => setAttributes({ productName: val })}
					placeholder={__('e.g. Acme Widget Pro', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Reviewer Name', 'b-blocks')}
					value={reviewAuthor || ''}
					onChange={(val) => setAttributes({ reviewAuthor: val })}
					placeholder={__('e.g. Jane Doe', 'b-blocks')}
					help={__('Used in schema markup as the review author.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Review Date', 'b-blocks')}
					value={reviewDate || ''}
					onChange={(val) => setAttributes({ reviewDate: val })}
					placeholder='YYYY-MM-DD'
					help={__('ISO 8601 date (e.g. 2026-05-21). Used in schema markup.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextareaControl
					label={__('Review Summary', 'b-blocks')}
					value={reviewSummary || ''}
					onChange={(val) => setAttributes({ reviewSummary: val })}
					placeholder={__('A brief overall verdict shown below the criteria.', 'b-blocks')}
					rows={4}
					__nextHasNoMarginBottom
				/>

				<div style={{ marginTop: 16 }}>
					<Label>{__('Product Image', 'b-blocks')}</Label>
					{productImage?.url && (
						<div style={{ marginTop: 8 }}>
							<img
								src={productImage.url}
								alt={productImage.alt || ''}
								style={{ maxWidth: '100%', height: 'auto', borderRadius: 4 }}
							/>
						</div>
					)}
					<div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={['image']}
								value={productImage?.id || 0}
								onSelect={(media) => setAttributes({
									productImage: {
										id: media?.id || 0,
										url: media?.url || '',
										alt: media?.alt || '',
									},
								})}
								render={({ open }) => (
									<Button variant='secondary' onClick={open}>
										{productImage?.url
											? __('Replace Image', 'b-blocks')
											: __('Select Image', 'b-blocks')}
									</Button>
								)}
							/>
						</MediaUploadCheck>
						{productImage?.url && (
							<Button
								variant='link'
								isDestructive
								onClick={() => setAttributes({ productImage: { id: 0, url: '', alt: '' } })}
							>
								{__('Remove Image', 'b-blocks')}
							</Button>
						)}
					</div>
				</div>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Rating', 'b-blocks')} initialOpen={false}>
				<RadioControl
					label={__('Rating Mode', 'b-blocks')}
					selected={ratingMode || 'auto'}
					options={[
						{ label: __('Auto (average criteria)', 'b-blocks'), value: 'auto' },
						{ label: __('Manual', 'b-blocks'), value: 'manual' },
					]}
					onChange={(val) => setAttributes({ ratingMode: val })}
				/>

				{ratingMode === 'manual' && (
					<RangeControl
						label={__('Overall Rating', 'b-blocks')}
						value={parseFloat(overallRating) || 0}
						onChange={(val) => setAttributes({ overallRating: val })}
						min={0}
						max={safeMax}
						step={0.1}
					/>
				)}

				<div style={{ marginTop: 12 }}>
					<Label>{__('Scored Criteria', 'b-blocks')}</Label>
					<CriteriaRepeater
						value={criteria || []}
						onChange={(val) => setAttributes({ criteria: val })}
						maxRating={safeMax}
					/>
				</div>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Pros & Cons', 'b-blocks')} initialOpen={false}>
				<Label>{__('Pros', 'b-blocks')}</Label>
				<TextRepeater
					value={pros || []}
					onChange={(val) => setAttributes({ pros: val })}
					addLabel={__('Add Pro', 'b-blocks')}
					placeholder={__('Something great about this product', 'b-blocks')}
					removeLabel={__('Remove pro', 'b-blocks')}
				/>

				<div style={{ marginTop: 16 }}>
					<Label>{__('Cons', 'b-blocks')}</Label>
					<TextRepeater
						value={cons || []}
						onChange={(val) => setAttributes({ cons: val })}
						addLabel={__('Add Con', 'b-blocks')}
						placeholder={__('Something to improve', 'b-blocks')}
						removeLabel={__('Remove con', 'b-blocks')}
					/>
				</div>

				<ToggleControl
					className='mt20'
					label={__('Show as columns on desktop', 'b-blocks')}
					checked={!!showProsConsColumns}
					onChange={(val) => setAttributes({ showProsConsColumns: val })}
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('CTA Button', 'b-blocks')} initialOpen={false}>
				<TextControl
					label={__('Button Label', 'b-blocks')}
					value={ctaLabel || ''}
					onChange={(val) => setAttributes({ ctaLabel: val })}
					placeholder={__('Check Price', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Button URL', 'b-blocks')}
					value={ctaUrl || ''}
					onChange={(val) => setAttributes({ ctaUrl: val })}
					placeholder='https://example.com/product'
					type='url'
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={__('Open in new tab', 'b-blocks')}
					checked={!!ctaNewTab}
					onChange={(val) => setAttributes({ ctaNewTab: val })}
				/>

				<ToggleControl
					label={__('Add nofollow', 'b-blocks')}
					checked={!!ctaNofollow}
					onChange={(val) => setAttributes({ ctaNofollow: val })}
					help={__('Recommended for affiliate links.', 'b-blocks')}
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Style', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Label className=''>{__('Background Color:', 'b-blocks')}</Label>
					<ColorControl
						value={styles.backgroundColor || ''}
						onChange={(val) => setStyle('backgroundColor', val || '')}
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Accent Color:', 'b-blocks')}</Label>
					<ColorControl
						value={styles.accentColor || '#2271b1'}
						onChange={(val) => setStyle('accentColor', val)}
						defaultColor='#2271b1'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Text Color:', 'b-blocks')}</Label>
					<ColorControl
						value={styles.textColor || ''}
						onChange={(val) => setStyle('textColor', val || '')}
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Rating Star Color:', 'b-blocks')}</Label>
					<ColorControl
						value={styles.ratingColor || '#f5a623'}
						onChange={(val) => setStyle('ratingColor', val)}
						defaultColor='#f5a623'
					/>
				</PanelRow>

				<TextControl
					className='mt10'
					label={__('Border Radius', 'b-blocks')}
					value={styles.borderRadius || '8px'}
					onChange={(val) => setStyle('borderRadius', val)}
					placeholder='8px'
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Padding', 'b-blocks')}
					value={styles.padding || '24px'}
					onChange={(val) => setStyle('padding', val)}
					placeholder='24px'
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Display', 'b-blocks')} initialOpen={false}>
				<ToggleControl
					label={__('Show Criteria table', 'b-blocks')}
					checked={!!showCriteria}
					onChange={(val) => setAttributes({ showCriteria: val })}
				/>

				<ToggleControl
					label={__('Output Schema Markup', 'b-blocks')}
					checked={!!showSchema}
					onChange={(val) => setAttributes({ showSchema: val })}
					help={__('Adds JSON-LD Review schema to this page so Google can show rich snippets.', 'b-blocks')}
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;

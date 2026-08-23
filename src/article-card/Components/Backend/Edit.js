import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { useBlockProps, RichText, BlockControls, AlignmentToolbar, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, Dashicon } from '@wordpress/components';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Style from '../Common/Style';
import Settings from './Settings/Settings';

const at = (obj, d) => {
	if (typeof obj === 'string') return obj;
	return obj?.[d] || (d === 'mobile' ? (obj?.tablet || obj?.desktop) : obj?.desktop);
};

const Edit = (props) => {
	const { attributes, setAttributes, clientId, device = 'desktop' } = props;
	const { layout = {}, image = {}, content = {}, link = {} } = attributes;

	const { alignment } = layout;
	const normAlign = typeof alignment === 'string' ? { desktop: alignment, tablet: '', mobile: '' } : (alignment || {});
	const { id: imageId = {}, url: imageUrl = {}, alt: imageAlt = '' } = image;
	const { badge, heading, headingTag, excerpt, meta, metaIcon } = content;
	const { ctaLabel, ctaStyle, cardLinkMode } = link;

	const isPremium = typeof bBlocksPremiumChecker !== 'undefined' ? bBlocksPremiumChecker : false;
	const updateObj = updateAttributes(attributes, setAttributes);
	const deviceImgUrl = at(imageUrl, device);
	const HeadingTag = headingTag || 'h3';

	const wrapperClass = [
		'b-blocks-article-card',
		`b-blocks-article-card--cta-${ctaStyle}`,
	]
		.filter(Boolean)
		.join(' ');

	const Media = deviceImgUrl ? (
		<div className='b-blocks-article-card-media'>
			<img className='b-blocks-article-card-img' src={deviceImgUrl} alt={imageAlt || ''} />
		</div>
	) : (
		<div className='b-blocks-article-card-media'>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={(val) => {
						setAttributes({
							image: {
								...image,
								id: { ...imageId, [device]: val?.id || 0 },
								url: { ...imageUrl, [device]: val?.url || '' },
								alt: val?.alt || imageAlt || '',
							},
						});
					}}
					allowedTypes={['image']}
					value={at(imageId, device)}
					render={({ open }) => (
						<div className='b-blocks-article-card-media-placeholder' onClick={open}>
							<Dashicon icon='format-image' style={{ fontSize: 36, width: 36, height: 36, marginBottom: 8 }} />
							<div><strong>{__('Select or Upload Image', 'b-blocks')}</strong></div>
							<span style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{__('Click to open Media Library', 'b-blocks')}</span>
						</div>
					)}
				/>
			</MediaUploadCheck>
		</div>
	);

	const Body = (
		<div className='b-blocks-article-card-body'>
			{badge ? <span className='b-blocks-article-card-badge'>{badge}</span> : null}

			<RichText
				tagName={HeadingTag}
				className='b-blocks-article-card-heading'
				value={heading}
				onChange={(val) => updateObj('content', val, 'heading')}
				placeholder={__('Article title goes here', 'b-blocks')}
				allowedFormats={['core/bold', 'core/italic']}
			/>

			<RichText
				tagName='p'
				className='b-blocks-article-card-excerpt'
				value={excerpt}
				onChange={(val) => updateObj('content', val, 'excerpt')}
				placeholder={__('Add a short excerpt or description…', 'b-blocks')}
				allowedFormats={['core/bold', 'core/italic']}
			/>

			{meta ? (
				<span className='b-blocks-article-card-meta'>
					{metaIcon ? <span className='b-blocks-article-card-meta-icon' aria-hidden='true' dangerouslySetInnerHTML={{ __html: metaIcon }} /> : null}
					<span className='b-blocks-article-card-meta-text'>{meta}</span>
				</span>
			) : null}

			{!cardLinkMode && ctaLabel ? (
				<span className='b-blocks-article-card-cta'>
					<span className='b-blocks-article-card-cta-label'>{ctaLabel}</span>
					{ctaStyle === 'link' ? (
						<svg className='b-blocks-article-card-cta-arrow' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
							<path
								d='M5 12h14M13 6l6 6-6 6'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					) : null}
				</span>
			) : null}
		</div>
	);

	const blockProps = useBlockProps({ id: `block-${clientId}` });

	return (
		<>
			<Settings {...{ ...props, updateObj, isPremium }} />

			<BlockControls>
				<MediaUploadCheck>
					<ToolbarGroup>
						<MediaUpload
							allowedTypes={['image']}
							value={imageId[device] || 0}
							onSelect={(media) =>
								setAttributes({
									image: {
										...image,
										id: { ...imageId, [device]: media?.id || 0 },
										url: { ...imageUrl, [device]: media?.url || '' },
										alt: media?.alt || imageAlt || '',
									},
								})
							}
							render={({ open }) => (
								<ToolbarButton
									icon='format-image'
									label={deviceImgUrl ? __('Replace image', 'b-blocks') : __('Add image', 'b-blocks')}
									onClick={open}
								/>
							)}
						/>
					</ToolbarGroup>
				</MediaUploadCheck>

				<AlignmentToolbar
					value={normAlign[device] || at(normAlign, device) || 'left'}
					onChange={(val) => {
						const currentAlign = typeof alignment === 'string' ? { desktop: alignment, tablet: '', mobile: '' } : { ...alignment };
						currentAlign[device] = val || '';
						updateObj('layout', currentAlign, 'alignment');
					}}
				/>
			</BlockControls>

			<div {...blockProps}>
				<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />

				<div>
					<div className={wrapperClass}>
						<article className='b-blocks-article-card-card'>
							{Media}
							{Body}
						</article>
					</div>
				</div>
			</div>
		</>
	);
};

export default compose(
	withSelect((select) => {
		const { getDeviceType } = select('core/editor');

		return {
			device: getDeviceType()?.toLowerCase(),
		};
	})
)(Edit);

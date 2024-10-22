import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { PanelBody, SelectControl, RangeControl, TextControl, ToggleControl, PanelRow } from '@wordpress/components';

import { Label, BtnGroup, InlineMediaUpload, SortableControl } from '../../../../../../bpl-tools/Components';
import { BControlPro } from '../../../../../../bpl-tools/ProControls';

import { categoriesPosition, imageFittings, dateFormats, readMorePositions } from '../../../utils/options';

const Elements = ({ attributes, setAttributes, premiumProps, taxOfPostType, updateObj, imageSizes }) => {
	const { elementsSort, isFImg, fImgSize, fImgFitting, isFImgLink, isTitle, isTitleLink, isMeta, isMetaAuthor, isMetaAuthorLink, metaAuthorIcon, isMetaDate, metaDateFormat, metaDateIcon, isMetaCategory, metaCategoryIn, metaCategoryIcon, metaTaxonomies = {}, isMetaReadTime, metaReadTimeIcon, isMetaReadTimeSec, metaReadTimeLabel, isMetaComment, metaCommentIcon, isExcerpt, isExcerptFromContent, isEllipsisOnExcerpt, excerptLength, isReadMore, readMorePosition, readMoreLabel, isLinkNewTab } = attributes;

	const [selectedDateFormat, setSelectedDateFormat] = useState(dateFormats.find(f => f.value === metaDateFormat)?.value || 'custom');

	return <>
		{isTitle && isMeta && <PanelBody className='bPlPanelBody' title={__('Elements', 'b-blocks')}>
			<BControlPro label={__('Sort Element:')} value={elementsSort} onChange={val => setAttributes({ elementsSort: val })} {...premiumProps} Component={SortableControl} />
		</PanelBody>}


		<PanelBody className='bPlPanelBody' title={__('Feature Image', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Show Feature Image', 'b-blocks')} checked={isFImg} onChange={val => setAttributes({ isFImg: val })} />

			{isFImg && <>
				<BControlPro className='mt20' label={__('Size:', 'b-blocks')} labelPosition='left' value={fImgSize} onChange={val => setAttributes({ fImgSize: val })} options={imageSizes} {...premiumProps} Component={SelectControl} />

				<SelectControl className='mt20' label={__('Fitting:', 'b-blocks')} labelPosition='left' value={fImgFitting} onChange={val => setAttributes({ fImgFitting: val })} options={imageFittings} />

				<ToggleControl className='mt10' label={__('Enable Link', 'b-blocks')} checked={isFImgLink} onChange={val => setAttributes({ isFImgLink: val })} />
			</>}
		</PanelBody>


		<PanelBody className='bPlPanelBody' title={__('Title', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Show Title', 'b-blocks')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

			{isTitle && <ToggleControl className='mt10' label={__('Enable Title Link', 'b-blocks')} checked={isTitleLink} onChange={val => setAttributes({ isTitleLink: val })} />}
		</PanelBody>


		<PanelBody className='bPlPanelBody' title={__('Meta Data', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Show Meta Data', 'b-blocks')} checked={isMeta} onChange={val => setAttributes({ isMeta: val })} />

			{isMeta && <>
				<hr />

				<Label className='mb10'><strong>{__('Author', 'b-blocks')}</strong></Label>

				<ToggleControl label={__('Show Author', 'b-blocks')} checked={isMetaAuthor} onChange={val => setAttributes({ isMetaAuthor: val })} />

				{isMetaAuthor && <>
					<BControlPro className='mt10' label={__('Author Link', 'b-blocks')} checked={isMetaAuthorLink} onChange={val => setAttributes({ isMetaAuthorLink: val })} {...premiumProps} Component={ToggleControl} />

					<BControlPro className='mt10' label={__('Author Icon:', 'b-blocks')} value={metaAuthorIcon} types={['image']} onChange={val => setAttributes({ metaAuthorIcon: val })} placeholder={__('Enter Author Icon URL', 'b-blocks')} {...premiumProps} Component={InlineMediaUpload} />
				</>}

				<hr />

				<Label className='mb10'><strong>{__('Date', 'b-blocks')}</strong></Label>

				<ToggleControl label={__('Show Date', 'b-blocks')} checked={isMetaDate} onChange={val => setAttributes({ isMetaDate: val })} />

				{isMetaDate && <>
					<Label className='mt10'>{__('Date Format:', 'b-blocks')}</Label>
					<PanelRow className='gap15'>
						<BControlPro value={selectedDateFormat} onChange={val => {
							setSelectedDateFormat(val);
							setAttributes({ metaDateFormat: 'custom' == val ? 'Y-m-d' : val });
						}} options={dateFormats} {...premiumProps} Component={SelectControl} />

						{'custom' === selectedDateFormat && <BControlPro value={metaDateFormat} onChange={val => setAttributes({ metaDateFormat: val })} {...premiumProps} Component={TextControl} />}
					</PanelRow>
					{'custom' === selectedDateFormat && <small>{__('Documentation on date formatting in ', 'b-blocks')} <a href='https://wordpress.org/support/article/formatting-date-and-time/' target='_blank' rel='noreferrer' aria-label='Documentation on Date Formatting'>here</a>.</small>}

					<BControlPro className='mt10' label={__('Date Icon:', 'b-blocks')} value={metaDateIcon} types={['image']} onChange={val => setAttributes({ metaDateIcon: val })} placeholder={__('Enter Date Icon URL', 'b-blocks')} {...premiumProps} Component={InlineMediaUpload} />
				</>}
				<hr />


				<Label className='mb10'><strong>{__('Category', 'b-blocks')}</strong></Label>

				<ToggleControl label={__('Show Category', 'b-blocks')} checked={isMetaCategory} onChange={val => setAttributes({ isMetaCategory: val })} />

				{isMetaCategory && <>
					<BtnGroup label={__('Category In:', 'b-blocks')} value={metaCategoryIn} onChange={val => setAttributes({ metaCategoryIn: val })} options={categoriesPosition} />

					{'content' === metaCategoryIn && <BControlPro className='mt10' label={__('Category Icon:', 'b-blocks')} value={metaCategoryIcon} types={['image']} onChange={val => setAttributes({ metaCategoryIcon: val })} placeholder={__('Enter Category Icon URL', 'b-blocks')} {...premiumProps} Component={InlineMediaUpload} />}
				</>}

				<hr />
				<hr />

				<Label className='mb10'><strong>{__('Taxonomies', 'b-blocks')}</strong></Label>
				{taxOfPostType?.map((t, i) => {
					const { selected = [] } = metaTaxonomies;
					const { name, slug } = t;

					return <>
						<BControlPro key={slug} className={i ? 'mt20' : ''} label={__(`Show ${name} Taxonomy`, 'b-blocks')} checked={selected?.includes(slug)} onChange={val => {
							const newObj = { ...metaTaxonomies };
							if (val) {
								newObj[slug] = {};
							} else {
								delete newObj[slug];
							}
							newObj['selected'] = val ? [...selected, slug] : selected?.filter(s => s !== slug)

							setAttributes({ metaTaxonomies: newObj });
						}} {...premiumProps} Component={ToggleControl} />

						{selected?.includes(slug) && <BControlPro className='mt10' label={__(`${name} Icon:`, 'b-blocks')} value={metaTaxonomies?.[slug]?.icon} types={['image']} onChange={val => updateObj('metaTaxonomies', slug, val, 'icon')} placeholder={__(`Enter ${name} Icon URL`, 'b-blocks')} {...premiumProps} Component={InlineMediaUpload} />}
					</>
				})}

				<hr />
				<hr />

				<Label className='mb10'><strong>{__('Reading Time', 'b-blocks')}</strong></Label>

				<BControlPro label={__('Show Reading Time', 'b-blocks')} checked={isMetaReadTime} onChange={val => setAttributes({ isMetaReadTime: val })} {...premiumProps} Component={ToggleControl} />

				{(isMetaReadTime || !premiumProps?.isPremium) && <>
					<small>{__('Reading Time will be displayed if the post has content!', 'b-blocks')}</small>

					<BControlPro className='mt10' label={__('Show Reading Time Seconds', 'b-blocks')} checked={isMetaReadTimeSec} onChange={val => setAttributes({ isMetaReadTimeSec: val })} {...premiumProps} Component={ToggleControl} />

					<BControlPro className='mt10' label={__('Reading Time Label:', 'b-blocks')} value={metaReadTimeLabel} onChange={val => setAttributes({ metaReadTimeLabel: val })} placeholder={__('Reading Time Label')} {...premiumProps} Component={TextControl} />

					<BControlPro className='mt10' label={__('Reading Time Icon:', 'b-blocks')} value={metaReadTimeIcon} types={['image']} onChange={val => setAttributes({ metaReadTimeIcon: val })} placeholder={__('Enter Reading Time Icon URL', 'b-blocks')} {...premiumProps} Component={InlineMediaUpload} />
				</>}

				<hr />

				<Label className='mb10'><strong>{__('Comment', 'b-blocks')}</strong></Label>

				<ToggleControl label={__('Show Comment', 'b-blocks')} checked={isMetaComment} onChange={val => setAttributes({ isMetaComment: val })} />

				{isMetaComment && <>
					<small>{__('Comment Count will be displayed if the comment status is open!', 'b-blocks')}</small>

					<BControlPro className='mt10' label={__('Comment Icon:', 'b-blocks')} value={metaCommentIcon} types={['image']} onChange={val => setAttributes({ metaCommentIcon: val })} placeholder={__('Enter Comment Icon URL', 'b-blocks')} {...premiumProps} Component={InlineMediaUpload} />
				</>}
			</>}
		</PanelBody>


		<PanelBody className='bPlPanelBody' title={__('Excerpt', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Show Excerpt', 'b-blocks')} checked={isExcerpt} onChange={val => setAttributes({ isExcerpt: val })} />

			{isExcerpt && <>
				<ToggleControl className='mt15' label={__('Show Excerpt from Content', 'b-blocks')} checked={isExcerptFromContent} onChange={val => setAttributes({ isExcerptFromContent: val })} />

				<BControlPro className='mt15' label={__('Show Ellipsis', 'b-blocks')} checked={isEllipsisOnExcerpt} onChange={val => setAttributes({ isEllipsisOnExcerpt: val })} {...premiumProps} Component={ToggleControl} />

				<Label className='mt15'>{__('Excerpt Length:', 'b-blocks')}</Label>
				<RangeControl value={excerptLength} onChange={val => setAttributes({ excerptLength: val })} min={-1} max={120} step={1} />
				<small>{__(`Set -1 to show all the ${isExcerptFromContent ? 'content' : 'excerpt'}`, 'b-blocks')}</small>
			</>}
		</PanelBody>


		<PanelBody className='bPlPanelBody' title={__('Read More', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Show Read More', 'b-blocks')} checked={isReadMore} onChange={val => setAttributes({ isReadMore: val })} />

			{isReadMore && <>
				<BControlPro className='mt20' label={__('Position:', 'b-blocks')} labelPosition='left' value={readMorePosition} onChange={val => setAttributes({ readMorePosition: val })} options={readMorePositions} {...premiumProps} Component={SelectControl} />
				<small>{__(`For the bottom position, select 'Fill Available Space' option for the 'Content/Texts Height' from General->Layout`, 'b-blocks')}</small>

				<Label>{__('Read More Label:', 'b-blocks')}</Label>
				<TextControl value={readMoreLabel} onChange={val => setAttributes({ readMoreLabel: '' === val ? 'Read More' : val })} />

				<ToggleControl label={__('Open link in new tab', 'b-blocks')} checked={isLinkNewTab} onChange={val => setAttributes({ isLinkNewTab: val })} />
			</>}
		</PanelBody>
	</>
}
export default withSelect((select) => {
	return {
		imageSizes: select('core/block-editor')?.getSettings()?.imageSizes?.map(s => ({ label: s.name, value: s.slug }))
	}
})(Elements);
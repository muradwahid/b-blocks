import { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, TextControl, ToggleControl, TabPanel, RadioControl, PanelRow, __experimentalUnitControl as UnitControl, Dashicon } from '@wordpress/components';
import SelectPure from 'select-pure';
import produce from 'immer';

// Settings Components
import BDevice from '../../../../Components/BDevice';
import Background from '../../../../Components/Background';
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import BorderControl from '../../../../Components/BorderControl';
import SpaceControl from '../../../../Components/SpaceControl';
import SelectPureControl from '../../../../Components/SelectPureControl';
import ColorsControl from '../../../../Components/ColorsControl';
import Typography from '../../../../Components/Typography';
import BtnGroup from '../../../../Components/BtnGroup';
import { pxUnit, emUnit, vhUnit } from '../../../../Components/Helper/options';

import { sliderEffects, aligns, postsOrdersBy, postsOrders } from '../../utils/options';
import { tabs, categoriesPosition, imageFittings, layouts, subLayouts } from './utils/options';
import { filterSelected } from './utils/functions';

const Settings = ({ attributes, setAttributes, posts, postTypes, getTaxonomy }) => {
	const { layout, subLayout, columns, columnGap, rowGap, isContentEqualHight, sliderHeight, postType, selectedCategories, postsPerPage, postsOrderBy, postsOrder, contentAlign, contentBG, contentPadding, border, sliderIsLoop, sliderIsTouchMove, sliderIsAutoplay, sliderSpeed, sliderEffect, sliderIsPage, sliderIsPageClickable, sliderIsPageDynamic, sliderPageColor, sliderPageWidth, sliderPageHeight, sliderPageBorder, sliderIsPrevNext, sliderPrevNextColor, isFImg, fImgFitting, isFImgLink, isTitle, isTitleLink, titleTypo, titleColor, titleMargin, isMeta, isMetaAuthor, isMetaDate, isMetaCategory, metaCategoryIn, isMetaComment, metaTypo, metaTextColor, metaLinkColor, metaIconColor, metaColorsOnImage, metaMargin, isExcerpt, excerptLength, excerptAlign, excerptTypo, excerptColor, excerptMargin, isReadMore, readMoreLabel, isLinkNewTab, readMoreAlign, readMoreTypo, readMoreColors, readMoreHovColors, readMorePadding, readMoreBorder } = attributes;

	const [device, setDevice] = useState('desktop');

	useEffect(() => {
		if (('slider' === layout || 'ticker' === layout) && ('default' === subLayout || 'title-meta' === subLayout))
			setAttributes({ subLayout: 'left-image', columns: { ...columns, desktop: 2 } })
	}, [layout]);

	const isPosts = posts?.length;

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={tabs}>{tab => <>
				{'general' === tab.name && <>
					<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
						<div className='helpItem'>
							<a href='https://bblockswp.com/docs/posts-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
						</div>

						<div className='helpItem rateUs'>
							<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
								<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
								<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
							</a>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Layouts Settings', 'b-blocks')} initialOpen={true}>
						<Title className='mb5'>{__('Layout Type:', 'b-blocks')}</Title>
						<BtnGroup value={layout} onChange={val => setAttributes({ layout: val })} options={layouts} isTextIcon={true} />

						<PanelRow className='mt10'>
							<Title className=''>{__('Sub Layout:', 'b-blocks')}</Title>
							<SelectControl value={subLayout} onChange={val => {
								setAttributes({ subLayout: val });
								'default' === val || 'title-meta' === val || 'left-image' === val || 'right-image' === val ? setAttributes({
									contentBG: { color: '#f4f2fc', styles: `background-color: #f4f2fc;` },
									titleColor: '#4527a4',
									metaCategoryIn: 'image',
									metaTextColor: '#333',
									metaLinkColor: '#8344c5',
									metaIconColor: '#4527a4',
									excerptColor: '#333',
								}) : 'overlay-content' === val || 'overlay-content-hover' === val || 'overlay-box' === val ? setAttributes({
									contentBG: { color: '#000000b3', styles: `background-color: #000000b3;` },
									titleColor: '#ccc0f0',
									metaCategoryIn: 'content',
									metaTextColor: '#fff',
									metaLinkColor: '#e0d0f0',
									metaIconColor: '#ccc0f0',
									excerptColor: '#fff',
								}) : '';

								'left-image' === val || 'right-image' === val ? setAttributes({
									columns: { ...columns, desktop: 2 }
								}) : setAttributes({
									columns: { ...columns, desktop: 3 }
								});

								'overlay-box' === val ? setAttributes({
									contentAlign: 'center'
								}) : setAttributes({
									contentAlign: 'left'
								});
							}} options={'slider' === layout || 'ticker' === layout ? subLayouts.filter(l => l.value !== 'default' && l.value !== 'title-meta') : subLayouts} />
						</PanelRow>
						<small>{__('Some settings may change when layout and sub-layout will be changed.', 'b-blocks')}</small>

						{'ticker' !== layout && <>
							<PanelRow className='mt20'>
								<Title className='mb5'>{__('Columns:', 'b-blocks')}</Title>
								<BDevice device={device} onChange={val => setDevice(val)} />
							</PanelRow>
							<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />
						</>}

						{'ticker' !== layout && <>
							<Title>{__('Column Gap:', 'b-blocks')}</Title>
							<RangeControl value={columnGap} onChange={val => setAttributes({ columnGap: val })} min={0} max={100} step={1} beforeIcon='arrow-right-alt' />
						</>}

						{'slider' !== layout && <>
							<Title>{__('Row Gap:', 'b-blocks')}</Title>
							<RangeControl value={rowGap} onChange={val => setAttributes({ rowGap: val })} min={0} max={150} step={1} beforeIcon='arrow-down-alt' />
						</>}

						{'grid' === layout && <ToggleControl className='mt20' label={__('Enable Content Equal Height', 'b-blocks')} checked={isContentEqualHight} onChange={val => setAttributes({ isContentEqualHight: val })} />}

						{'slider' === layout && <UnitControl className='mt20' label={__('Slider Min Height:', 'b-blocks')} labelPosition='left' value={sliderHeight} onChange={val => setAttributes({ sliderHeight: val })} units={[pxUnit(), emUnit(), vhUnit()]} />}
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Posts Query', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Title className=''>{__('Post Type:', 'b-blocks')}</Title>
							<SelectControl value={postType} onChange={val => setAttributes({ postType: val })} options={postTypes} />
						</PanelRow>

						{/* {'post' === postType && categories?.length ? <>
							<Title>{__('Select Categories:', 'b-blocks')}</Title>
							{categories.map(cat => {
								const isInc = selectedCategories.includes(cat.id);

								return <CheckboxControl label={cat.name} key={cat.id} checked={isInc} onChange={val => setAttributes({ selectedCategories: val ? [...selectedCategories, cat.id] : selectedCategories.filter(id => id !== cat.id) })} />;
							})}
						</> : null} */}

						{'post' === postType && getTaxonomy('category')?.length ? <>
							<Title>{__('Select Categories:', 'b-blocks')}</Title>
							<SelectPureControl
								value={filterSelected(getTaxonomy('category'), selectedCategories).map(cat => cat.toString())}
								onChange={val => setAttributes({ selectedCategories: val.map(cat => parseInt(cat)) })}
								options={getTaxonomy('category').map(cat => ({ label: cat.name, value: cat.id.toString() }))}
								SelectPure={SelectPure}
							/>
						</> : null}

						<Title>{__('Post Per Page:', 'b-blocks')}</Title>
						<RangeControl value={postsPerPage} onChange={val => setAttributes({ postsPerPage: val, isPostsPerPageAll: -1 === val })} min={-1} max={36} step={1} />
						<small>{__('To show all posts set -1', 'b-blocks')}</small>

						<PanelRow className='mt20'>
							<Title className=''>{__('Post Order By:', 'b-blocks')}</Title>
							<SelectControl value={postsOrderBy} onChange={val => setAttributes({ postsOrderBy: val })} options={postsOrdersBy} />
						</PanelRow>

						<PanelRow>
							<Title className=''>{__('Post Order:', 'b-blocks')}</Title>
							<SelectControl value={postsOrder} onChange={val => setAttributes({ postsOrder: val })} options={postsOrders} />
						</PanelRow>
					</PanelBody>


					{'slider' === layout && <PanelBody className='bPlPanelBody' title={__('Slider Options', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Enable Loop', 'b-blocks')} checked={sliderIsLoop} onChange={val => setAttributes({ sliderIsLoop: val })} />

						<ToggleControl className='mt10' label={__('Enable Touch Move', 'b-blocks')} checked={sliderIsTouchMove} onChange={val => setAttributes({ sliderIsTouchMove: val })} />

						<ToggleControl className='mt10' label={__('Enable Autoplay', 'b-blocks')} checked={sliderIsAutoplay} onChange={val => setAttributes({ sliderIsAutoplay: val })} />

						<Title>{__('Speed & Delay (s):', 'b-blocks')}</Title>
						<RangeControl value={sliderSpeed} onChange={val => setAttributes({ sliderSpeed: val })} min={0} max={10} step={.05} />
						<small>{__('Smaller speed & delay value will be slide faster', 'b-blocks')}</small>

						<PanelRow className='mt20'>
							<Title className=''>{__('Effect:', 'b-blocks')}</Title>
							<SelectControl value={sliderEffect} onChange={cng => setAttributes({ sliderEffect: cng })} options={sliderEffects} />
						</PanelRow>
						<small>{__('To work fade & creative effects properly, set single column per view', 'b-blocks')}</small>

						<Title>{__('Pagination:', 'b-blocks')}</Title>
						<ToggleControl label={__('Show Pagination', 'b-blocks')} checked={sliderIsPage} onChange={val => setAttributes({ sliderIsPage: val })} />

						{sliderIsPage && <>
							<ToggleControl className='mt10' label={__('Enable Pagination Clickable', 'b-blocks')} checked={sliderIsPageClickable} onChange={val => setAttributes({ sliderIsPageClickable: val })} />

							<ToggleControl className='mt10' label={__('Enable Pagination Dynamic Bullets', 'b-blocks')} checked={sliderIsPageDynamic} onChange={val => setAttributes({ sliderIsPageDynamic: val })} />
						</>}

						<Title>{__('Preview Next Button:', 'b-blocks')}</Title>
						<ToggleControl label={__('Show Preview Next Button', 'b-blocks')} checked={sliderIsPrevNext} onChange={val => setAttributes({ sliderIsPrevNext: val })} />
					</PanelBody>}
				</>}


				{'elements' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Feature Image', 'b-blocks')}>
						<ToggleControl label={__('Show Feature Image', 'b-blocks')} checked={isFImg} onChange={val => setAttributes({ isFImg: val })} />

						{isFImg && <>
							<PanelRow>
								<Title className=''>{__('Fitting:', 'b-blocks')}</Title>
								<SelectControl value={fImgFitting} onChange={val => setAttributes({ fImgFitting: val })} options={imageFittings} />
							</PanelRow>

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
							<ToggleControl className='20px' label={__('Show Author', 'b-blocks')} checked={isMetaAuthor} onChange={val => setAttributes({ isMetaAuthor: val })} />

							<ToggleControl className='20px' label={__('Show Date', 'b-blocks')} checked={isMetaDate} onChange={val => setAttributes({ isMetaDate: val })} />

							<ToggleControl className='20px' label={__('Show Category', 'b-blocks')} checked={isMetaCategory} onChange={val => setAttributes({ isMetaCategory: val })} />

							{isMetaCategory && <PanelRow>
								<Title className=''>{__('Category In:', 'b-blocks')}</Title>
								<RadioControl selected={metaCategoryIn} onChange={val => setAttributes({ metaCategoryIn: val })} options={categoriesPosition} />
							</PanelRow>}

							<ToggleControl className='20px' label={__('Show Comment', 'b-blocks')} checked={isMetaComment} onChange={val => setAttributes({ isMetaComment: val })} />
						</>}
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Excerpt', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Excerpt', 'b-blocks')} checked={isExcerpt} onChange={val => setAttributes({ isExcerpt: val })} />

						{isExcerpt && <>
							<Title className='mt15'>{__('Excerpt Length:', 'b-blocks')}</Title>
							<RangeControl value={excerptLength} onChange={val => setAttributes({ excerptLength: val })} min={0} max={55} step={1} />
							<small>{__('Excerpt max value will be your site default excerpt length', 'b-blocks')}</small>
						</>}
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Read More', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Read More', 'b-blocks')} checked={isReadMore} onChange={val => setAttributes({ isReadMore: val })} />

						{isReadMore && <>
							<Title>{__('Read More Label:', 'b-blocks')}</Title>
							<TextControl value={readMoreLabel} onChange={val => setAttributes({ readMoreLabel: '' === val ? 'Read More' : val })} />

							<ToggleControl label={__('Open link in new tab', 'b-blocks')} checked={isLinkNewTab} onChange={val => setAttributes({ isLinkNewTab: val })} />
						</>}
					</PanelBody>
				</>}


				{'style' === tab.name && <>
					{isPosts && <PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={true}>
						<PanelRow>
							<Title className=''>{__('Text Align:', 'b-blocks')}</Title>
							<BtnGroup value={contentAlign} onChange={val => setAttributes({ contentAlign: val })} options={aligns} isIcon={true} />
						</PanelRow>

						<Background label={__('Background', 'b-blocks')} value={contentBG} onChange={val => setAttributes({ contentBG: val })} defaults={{ color: '#f4f2fc' }} />

						<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={contentPadding} onChange={val => setAttributes({ contentPadding: val })} defaults={{ vertical: '20px', horizontal: '25px' }} />

						<BorderControl label={__('Border:', 'b-blocks')} value={border} onChange={val => setAttributes({ border: val })} defaults={{ radius: '5px' }} />
					</PanelBody>}


					{isPosts && 'slider' === layout && <PanelBody className='bPlPanelBody' title={__('Slider Options Style', 'b-blocks')} initialOpen={false}>
						{sliderIsPage && <>
							<BColor label={__('Pagination Bullets Color:', 'b-blocks')} value={sliderPageColor} onChange={val => setAttributes({ sliderPageColor: val })} defaultColor='#4527a4' />

							<UnitControl className='mt20' label={__('Pagination Width:', 'b-blocks')} labelPosition='left' value={sliderPageWidth} onChange={val => setAttributes({ sliderPageWidth: val })} units={[pxUnit(), emUnit()]} />

							<UnitControl className='mt20' label={__('Pagination Height:', 'b-blocks')} labelPosition='left' value={sliderPageHeight} onChange={val => setAttributes({ sliderPageHeight: val })} units={[pxUnit(), emUnit()]} />

							<BorderControl label={__('Pagination Border:', 'b-blocks')} value={sliderPageBorder} onChange={val => setAttributes({ sliderPageBorder: val })} defaults={{ radius: '50%' }} />
						</>}

						{sliderIsPrevNext && <BColor label={__('Preview Next Button Color:', 'b-blocks')} value={sliderPrevNextColor} onChange={val => setAttributes({ sliderPrevNextColor: val })} defaultColor='#4527a4' />}
					</PanelBody>}


					{isPosts && isTitle && <PanelBody className='bPlPanelBody' title={__('Title Styles', 'b-blocks')} initialOpen={false}>
						<Typography value={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: { desktop: 25, tablet: 22, mobile: 20 } }} produce={produce} />

						<BColor label={__('Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#4527a4' />

						<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
					</PanelBody>}


					{isPosts && isMeta && <PanelBody className='bPlPanelBody' title={__('Meta Data Styles', 'b-blocks')} initialOpen={false}>
						<Typography value={metaTypo} onChange={val => setAttributes({ metaTypo: val })} defaults={{ fontSize: { desktop: 13, tablet: 13, mobile: 13 }, textTransform: 'uppercase' }} produce={produce} />

						<BColor label={__('Text Color:', 'b-blocks')} value={metaTextColor} onChange={val => setAttributes({ metaTextColor: val })} defaultColor='#333' />

						<BColor label={__('Link Color:', 'b-blocks')} value={metaLinkColor} onChange={val => setAttributes({ metaLinkColor: val })} defaultColor='#8344c5' />

						<BColor label={__('Icon Color:', 'b-blocks')} value={metaIconColor} onChange={val => setAttributes({ metaIconColor: val })} defaultColor='#4527a4' />

						<ColorsControl label={__('Category Colors On Image:', 'b-blocks')} value={metaColorsOnImage} onChange={val => setAttributes({ metaColorsOnImage: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />

						<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={metaMargin} onChange={val => setAttributes({ metaMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
					</PanelBody>}


					{isPosts && isExcerpt && <PanelBody className='bPlPanelBody' title={__('Excerpt Styles', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Title className=''>{__('Text Align:', 'b-blocks')}</Title>
							<BtnGroup value={excerptAlign} onChange={val => setAttributes({ excerptAlign: val })} options={aligns} isIcon={true} />
						</PanelRow>

						<Typography value={excerptTypo} onChange={val => setAttributes({ excerptTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} produce={produce} />

						<BColor label={__('Color:', 'b-blocks')} value={excerptColor} onChange={val => setAttributes({ excerptColor: val })} defaultColor='#333' />

						<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={excerptMargin} onChange={val => setAttributes({ excerptMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
					</PanelBody>}


					{isPosts && isReadMore && <PanelBody className='bPlPanelBody' title={__('Read More Settings', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Title className=''>{__('Button Align:', 'b-blocks')}</Title>
							<BtnGroup value={readMoreAlign} onChange={val => setAttributes({ readMoreAlign: val })} options={aligns.filter(a => a.value !== 'justify')} isIcon={true} />
						</PanelRow>

						<Typography value={readMoreTypo} onChange={val => setAttributes({ readMoreTypo: val })} defaults={{ fontSize: { desktop: 14, tablet: 14, mobile: 14 }, textTransform: 'uppercase', fontWeight: 600 }} produce={produce} />

						<ColorsControl value={readMoreColors} onChange={val => setAttributes({ readMoreColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} />

						<ColorsControl label={__('Hover Colors:', 'b-blocks')} value={readMoreHovColors} onChange={val => setAttributes({ readMoreHovColors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />

						<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={readMorePadding} onChange={val => setAttributes({ readMorePadding: val })} defaults={{ vertical: '12px', horizontal: '35px' }} />

						<BorderControl label={__('Border:', 'b-blocks')} value={readMoreBorder} onChange={val => setAttributes({ readMoreBorder: val })} defaults={{ radius: '3px' }} />
					</PanelBody>}
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={contentAlign} onChange={val => setAttributes({ contentAlign: val })} />
		</BlockControls>
	</>;
};
export default withSelect((select) => {
	const { getPostTypes, getEntityRecords } = select('core');

	return {
		postTypes: getPostTypes({ per_page: -1 })?.filter(p => !['apb', 'page', 'attachment', 'wp_block', 'wp_template', 'wp_navigation', 'wp_template_part', 'nav_menu_item'].includes(p.slug))?.map(({ name, slug }) => ({ label: name, value: slug })),

		getTaxonomy: slug => getEntityRecords('taxonomy', slug, { per_page: -1 })
	}
})(Settings);
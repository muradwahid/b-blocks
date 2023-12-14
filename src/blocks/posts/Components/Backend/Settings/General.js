/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { PanelBody, SelectControl, RangeControl, CheckboxControl, TextControl, ToggleControl, PanelRow, __experimentalUnitControl as UnitControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { Label, BDevice, BtnGroup, ColorsControl, HelpPanel, SelectPureControl, SpaceControl } from '../../../../../../../Components';
import { BControlPro, SelectControlPro, BtnGroupPro } from '../../../../../../../Components/Pro';
import { pxUnit, emUnit, vhUnit } from '../../../../../../../Components/utils/options';

import { layouts, effects, tickerDirections, postsOrdersBy, postsOrders, subLayouts, contentHeights } from '../../../utils/options';
import { omit, filterSelected, strToIntArr } from '../../../utils/functions';


// const ShortCode = ({ currentPostId }) => {
// 	const tooltip = useRef(null);

// 	const handleShortcode = (e) => {
// 		const input = e.target;
// 		input.select();
// 		input.setSelectionRange(0, 30);
// 		document.execCommand('copy');
// 		tooltip.current.innerHTML = __('Copied Successfully!', 'b-blocks');
// 		setTimeout(() => {
// 			tooltip.current.innerHTML = __('Copy To Clipboard', 'b-blocks');
// 		}, 1500);
// 	};

// 	return <PanelBody className='bPlPanelBody'>
// 		<Label className='mb5'>Copy the shortcode and use it anywhere.</Label>
// 		<PanelRow>
// 			<div className='bBlocksPostsFrontShortcode'>
// 				<input onClick={handleShortcode} value={`[bBlocksPosts id=${currentPostId}]`} />
// 				<span ref={tooltip} className='tooltip'>
// 					{__('Copy To Clipboard', 'b-blocks')}
// 				</span>
// 			</div>
// 		</PanelRow>
// 	</PanelBody>
// }


const TickerOptions = ({ attributes, setAttributes, premiumProps }) => {
	const { tickerDirection, tickerSpeed, tickerInterval, tickerHeight, tickerVisible, tickerIsMousePause } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Ticker Options', 'b-blocks')} initialOpen={false}>
		<BControlPro label={__('Direction:', 'b-blocks')} value={tickerDirection} onChange={val => setAttributes({ tickerDirection: val })} options={tickerDirections} {...premiumProps} Component={BtnGroup} />

		<BControlPro className='mt20' label={__('Speed:', 'b-blocks')} value={tickerSpeed} onChange={val => setAttributes({ tickerSpeed: val })} {...premiumProps} Component={TextControl} />
		<small>{__('Values: slow, medium, fast or any value in milliseconds.', 'b-blocks')}</small>

		<BControlPro className='mt20' label={__('Interval:', 'b-blocks')} labelPosition='left' value={tickerInterval} onChange={val => setAttributes({ tickerInterval: parseInt(val) })} {...premiumProps} Component={NumberControl} />
		<small>{__('Values: time in milliseconds.', 'b-blocks')}</small>

		<BControlPro className='mt20' label={__('Height:', 'b-blocks')} labelPosition='left' value={tickerHeight} onChange={val => setAttributes({ tickerHeight: val })} units={[pxUnit(), emUnit()]} {...premiumProps} Component={UnitControl} />
		<small>{__('Keep height 0, to auto height.', 'b-blocks')}</small>

		{'0px' === tickerHeight || '0em' === tickerHeight ? <>
			<BControlPro className='mt20' label={__('Post Visible:', 'b-blocks')} value={tickerVisible} onChange={val => setAttributes({ tickerVisible: val })} min={0} max={12} step={1} beforeIcon='visibility' {...premiumProps} Component={RangeControl} />
			<small>{__('0 to display all', 'b-blocks')}</small>
		</> : ''}

		<BControlPro className='mt20' label={__('Ticker Mouse Pause', 'b-blocks')} checked={tickerIsMousePause} onChange={val => setAttributes({ tickerIsMousePause: val })} {...premiumProps} Component={ToggleControl} />
	</PanelBody>
}


const SliderOptions = ({ attributes, setAttributes }) => {
	const { sliderIsLoop, sliderIsTouchMove, sliderIsAutoplay, sliderAutoplayOptions, sliderSpeed, sliderEffect, sliderIsPage, sliderIsPageClickable, sliderIsPageDynamic, sliderIsPrevNext } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Slider Options', 'b-blocks')} initialOpen={false}>
		<ToggleControl label={__('Enable Loop', 'b-blocks')} checked={sliderIsLoop} onChange={val => setAttributes({ sliderIsLoop: val })} />

		<ToggleControl className='mt10' label={__('Enable Touch Move', 'b-blocks')} checked={sliderIsTouchMove} onChange={val => setAttributes({ sliderIsTouchMove: val })} />

		<ToggleControl className='mt10' label={__('Enable Autoplay', 'b-blocks')} checked={sliderIsAutoplay} onChange={val => setAttributes({ sliderIsAutoplay: val })} />

		{sliderIsAutoplay && <>
			<Label className='mt10'>{__('Autoplay Delay (s):', 'content-slider-block')}</Label>
			<RangeControl value={sliderAutoplayOptions.delay} onChange={val => setAttributes({ sliderAutoplayOptions: { ...sliderAutoplayOptions, delay: val } })} min={0} max={10} step={.05} />
			<small>{__('Smaller delay value will be autoplay faster', 'content-slider-block')}</small>
		</>}

		<Label>{__('Speed (s):', 'b-blocks')}</Label>
		<RangeControl value={sliderSpeed} onChange={val => setAttributes({ sliderSpeed: val })} min={0} max={10} step={.05} />
		<small>{__('Smaller speed & delay value will be slide faster', 'b-blocks')}</small>

		<PanelRow className='mt20'>
			<Label className=''>{__('Effect:', 'b-blocks')}</Label>
			<SelectControl value={sliderEffect} onChange={cng => setAttributes({ sliderEffect: cng })} options={effects} />
		</PanelRow>
		<small>{__('To work fade & creative effects properly, set single column per view', 'b-blocks')}</small>

		<Label><strong>{__('Pagination:', 'b-blocks')}</strong></Label>
		<ToggleControl label={__('Show Pagination', 'b-blocks')} checked={sliderIsPage} onChange={val => setAttributes({ sliderIsPage: val })} />

		{sliderIsPage && <>
			<ToggleControl className='mt10' label={__('Enable Pagination Clickable', 'b-blocks')} checked={sliderIsPageClickable} onChange={val => setAttributes({ sliderIsPageClickable: val })} />

			<ToggleControl className='mt10' label={__('Enable Pagination Dynamic Bullets', 'b-blocks')} checked={sliderIsPageDynamic} onChange={val => setAttributes({ sliderIsPageDynamic: val })} />
		</>}

		<Label><strong>{__('Preview Next Button:', 'b-blocks')}</strong></Label>
		<ToggleControl label={__('Show Preview Next Button', 'b-blocks')} checked={sliderIsPrevNext} onChange={val => setAttributes({ sliderIsPrevNext: val })} />
	</PanelBody>
}


const Pagination = ({ attributes, setAttributes, premiumProps }) => {
	const { isPagination, paginationPrevLabel, paginationNextLabel, paginationColors, paginationHovColors, paginationPadding, paginationSpacing } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Pagination', 'b-blocks')} initialOpen={false}>
		<BControlPro label={__('Show Pagination', 'b-blocks')} checked={isPagination} onChange={val => setAttributes({ isPagination: val })} {...premiumProps} Component={ToggleControl} />
		<small>{__(`Pagination will not work if, 'Show All Posts' is enable`, 'b-blocks')}</small>

		<BControlPro className='mt20' label={__('Previous Label:', 'b-blocks')} value={paginationPrevLabel} onChange={val => setAttributes({ paginationPrevLabel: val })} {...premiumProps} Component={TextControl} />

		<BControlPro className='mt20' label={__('Next Label:', 'b-blocks')} value={paginationNextLabel} onChange={val => setAttributes({ paginationNextLabel: val })} {...premiumProps} Component={TextControl} />

		<BControlPro label={__('Colors:', 'b-blocks')} value={paginationColors} onChange={val => setAttributes({ paginationColors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} {...premiumProps} Component={ColorsControl} />

		<BControlPro label={__('Active & Hover Colors:', 'b-blocks')} value={paginationHovColors} onChange={val => setAttributes({ paginationHovColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} {...premiumProps} Component={ColorsControl} />

		<BControlPro className='mt20' label={__('Padding:', 'b-blocks')} value={paginationPadding} onChange={val => setAttributes({ paginationPadding: val })} defaults={{ vertical: '8px', horizontal: '15px' }} {...premiumProps} Component={SpaceControl} />

		<BControlPro className='mt20' label={__('Space Between:', 'b-blocks')} labelPosition='left' value={paginationSpacing} onChange={val => setAttributes({ paginationSpacing: val })} units={[pxUnit(), emUnit()]} {...premiumProps} Component={UnitControl} />
	</PanelBody>
}


const General = ({ attributes, setAttributes, premiumProps, postTypes, currentPostType, allTaxonomies, getTaxonomy }) => {
	const { layout, subLayout, columns, columnGap, rowGap, isContentEqualHight, sliderHeight, content, postType, selectedTaxonomies, selectedCategories, selectedTags, isPostsPerPageAll, postsPerPage, postsOrderBy, postsOrder, postsOffset, postsInclude, postsExclude, isExcludeCurrent } = attributes;

	const isGrid = 'grid' === layout;
	const isGrid1 = 'grid1' === layout;
	const isSlider = 'slider' === layout;
	const isTicker = 'ticker' === layout;

	const [device, setDevice] = useState('desktop');

	const props = { attributes, setAttributes, premiumProps }

	return <>
		{/* {currentPostType === 'bBlocksPosts' && <ShortCode currentPostId={currentPostId} />} */}

		<HelpPanel slug='b-blocks' docsLink='https://bplugins.com/docs/advanced-post-block' />


		<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>
			<Label className='mb5'>{__('Layout:', 'b-blocks')}</Label>
			<BtnGroupPro value={layout} onChange={val => {
				setAttributes({
					layout: val,
					subLayout: (['slider', 'ticker'].includes(val) && ['default', 'title-meta'].includes(subLayout)) || ('ticker' === val && 'overlay-half-content' === subLayout) ? 'left-image' : subLayout,
					columns: ['slider', 'ticker'].includes(val) ? { ...columns, desktop: 2 } : columns
				});
			}} options={layouts} isTextIcon={true} proValues={['grid1']} {...premiumProps} />

			<PanelRow className='mt20'>
				<Label className=''>{__('Sub Layout:', 'b-blocks')}</Label>
				<SelectControlPro value={subLayout} onChange={val => {
					setAttributes({ subLayout: val });
					'default' === val || 'title-meta' === val || 'left-image' === val || 'right-image' === val ? setAttributes({
						contentBG: { color: '#f4f2fc', styles: `background-color: #f4f2fc;` },
						titleColor: '#4527a4',
						metaCategoryIn: 'image',
						metaTextColor: '#333',
						metaLinkColor: '#8344c5',
						metaIconColor: '#4527a4',
						excerptColor: '#333'
					}) : 'overlay-content' === val || 'overlay-content-hover' === val || 'overlay-box' === val || 'overlay-content-box' === val ? setAttributes({
						contentBG: { color: '#000000b3', styles: `background-color: #000000b3;` },
						titleColor: '#ccc0f0',
						metaCategoryIn: 'content',
						metaTextColor: '#fff',
						metaLinkColor: '#e0d0f0',
						metaIconColor: '#ccc0f0',
						excerptColor: '#fff'
					}) : 'overlay-half-content' === val ? setAttributes({
						contentBG: { type: 'gradient', gradient: 'linear-gradient(0deg, #000000bf 0%, #0000 100%)', styles: `background-image: linear-gradient(0deg, #000000bf 0%, #0000 100%);` },
						titleColor: '#fff',
						metaCategoryIn: 'content',
						metaTextColor: '#fff',
						metaLinkColor: '#e0d0f0',
						metaIconColor: '#ccc0f0',
						excerptColor: '#fff'
					}) : '';

					'left-image' === val || 'right-image' === val ? setAttributes({
						columns: { ...columns, desktop: 2 }
					}) : setAttributes({
						columns: { ...columns, desktop: 3 }
					});

					'overlay-box' === val || 'overlay-content-box' === val ? setAttributes({
						contentAlign: 'center'
					}) : setAttributes({
						contentAlign: 'left'
					});
				}}
					options={
						isGrid1 ? subLayouts.filter(l => !['left-image', 'right-image'].includes(l.value)) :
							// isSlider ? subLayouts.filter(l => !['default', 'title-meta'].includes(l.value)) :
							isTicker ? subLayouts.filter(l => !['overlay-half-content'].includes(l.value)) :
								subLayouts
					}
					proValues={['overlay-content-box', 'overlay-half-content']}
					{...premiumProps}
				/>
			</PanelRow>
			<small>{__('Some settings may change when sub layout will be changed.', 'b-blocks')}</small>

			{!isGrid1 && !isTicker && <>
				<PanelRow className='mt20'>
					<Label className='mb5'>{__('Columns:', 'b-blocks')}</Label>
					<BDevice device={device} onChange={val => setDevice(val)} />
				</PanelRow>
				<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />
			</>}

			{!isTicker && <>
				<Label>{__('Column Gap:', 'b-blocks')}</Label>
				<RangeControl value={columnGap} onChange={val => setAttributes({ columnGap: val })} min={0} max={100} step={1} beforeIcon='arrow-right-alt' />
			</>}

			{!isSlider && <>
				<Label>{__('Row Gap:', 'b-blocks')}</Label>
				<RangeControl value={rowGap} onChange={val => setAttributes({ rowGap: val })} min={0} max={150} step={1} beforeIcon='arrow-down-alt' />
			</>}

			{(isGrid || isGrid1) && <ToggleControl className='mt20' label={__('Post Equal Height', 'b-blocks')} checked={isContentEqualHight} onChange={val => setAttributes({ isContentEqualHight: val })} />}

			{isSlider && <UnitControl className='mt20' label={__('Slider Min Height:', 'b-blocks')} labelPosition='left' value={sliderHeight} onChange={val => setAttributes({ sliderHeight: val })} units={[pxUnit(), emUnit(), vhUnit()]} />}

			{/* <BControlPro className='mt20' label={__('Content/Texts Height:', 'b-blocks')} labelPosition='left' value={content?.height} onChange={val => setAttributes({ content: { ...content, height: val } })} options={contentHeights} {...premiumProps} Component={SelectControl} /> */}
		</PanelBody>


		<PanelBody className='bPlPanelBody' title={__('Posts Query', 'b-blocks')} initialOpen={false}>
			<PanelRow>
				<Label className=''>{__('Post Type:', 'b-blocks')}</Label>
				<SelectControlPro value={postType} onChange={val => setAttributes({ postType: val, selectedTaxonomies: [] })} options={postTypes} proValues={['page']} {...premiumProps} />
			</PanelRow>

			{'post' === postType && getTaxonomy('category')?.length ? <>
				<Label>{__('Select Categories:', 'b-blocks')}</Label>
				<SelectPureControl
					value={filterSelected(getTaxonomy('category'), selectedCategories).map(cat => cat.toString())}
					onChange={val => setAttributes({ selectedCategories: val.map(cat => parseInt(cat)) })}
					options={getTaxonomy('category').map(cat => ({ label: cat.name, value: cat.id.toString() }))}
				/>
			</> : null}

			{/* {'post' === postType && getTaxonomy('post_tag')?.length ? <>
				<BControlPro
					className='mt20'
					label={__('Select Tags:', 'b-blocks')}
					value={filterSelected(getTaxonomy('post_tag'), selectedTags).map(tag => tag.toString())}
					onChange={val => setAttributes({ selectedTags: val.map(tag => parseInt(tag)) })}
					options={getTaxonomy('post_tag').map(tag => ({ label: tag.name, value: tag.id.toString() }))}
					{...premiumProps} Component={SelectPureControl}
				/>
			</> : null} */}

			{/* {allTaxonomies?.length ? <>
				<Label>{__('Select Taxonomies for filter:', 'b-blocks')}</Label>
				{allTaxonomies.map(tax => {
					const isInc = Object.keys(selectedTaxonomies).includes(tax.slug);

					return <BControlPro label={tax.name} key={tax.slug} checked={isInc} onChange={val => setAttributes({ selectedTaxonomies: val ? { ...selectedTaxonomies, [tax.slug]: [] } : omit(selectedTaxonomies, tax.slug) })} {...premiumProps} Component={CheckboxControl} />;
				})}
			</> : null}

			{allTaxonomies?.length && Object.keys(selectedTaxonomies)?.length ? Object.keys(selectedTaxonomies).map(tax => getTaxonomy(tax)?.length ? <BControlPro key={tax}
				className='mt20'
				label={__(`Select ${allTaxonomies?.find(t => t.slug === tax)?.name}:`, 'b-blocks')}
				value={filterSelected(getTaxonomy(tax), selectedTaxonomies[tax]).map(tax => tax.toString())}
				onChange={val => setAttributes({ selectedTaxonomies: { ...selectedTaxonomies, [tax]: val.map(tax => parseInt(tax)) } })}
				options={getTaxonomy(tax).map(tax => ({ label: tax.name, value: tax.id.toString() }))}
				{...premiumProps} Component={SelectPureControl}
			/> : null) : null} */}

			<Label>{__('Post Per Page:', 'b-blocks')}</Label>
			<RangeControl value={postsPerPage} onChange={val => setAttributes({ postsPerPage: val, isPostsPerPageAll: -1 === val })} min={-1} max={36} step={1} />
			<small>{__('To show all posts set -1', 'b-blocks')}</small>

			<PanelRow className='mt20'>
				<Label className=''>{__('Post Order By:', 'b-blocks')}</Label>
				<SelectControl value={postsOrderBy} onChange={val => setAttributes({ postsOrderBy: val })} options={postsOrdersBy} />
			</PanelRow>

			<PanelRow className='mt20'>
				<Label className=''>{__('Post Order:', 'b-blocks')}</Label>
				<SelectControl value={postsOrder} onChange={val => setAttributes({ postsOrder: val })} options={postsOrders} />
			</PanelRow>

			{/* {!isPostsPerPageAll && <>
				<BControlPro className='mt20' label={__('Post Offset:', 'b-blocks')} labelPosition='left' value={postsOffset} onChange={val => setAttributes({ postsOffset: parseInt(val) })} min={0} {...premiumProps} Component={NumberControl} />
				<small>{__('`Post Offset` will not work if `Post Per Page` is -1', 'b-blocks')}</small>
			</>}

			<BControlPro className='mt20' label={__('Include Posts:', 'b-blocks')} value={postsInclude?.join(',')} onChange={val => setAttributes({ postsInclude: strToIntArr(val) })} {...premiumProps} Component={TextControl} />
			<small>{__('Enter the posts id by coma separated Ex: `23,45,16`', 'b-blocks')}</small>

			<BControlPro className='mt20' label={__('Exclude Posts:', 'b-blocks')} value={postsExclude?.join(',')} onChange={val => setAttributes({ postsExclude: strToIntArr(val) })} {...premiumProps} Component={TextControl} />
			<small>{__('Enter the posts id by coma separated Ex: `23,45,16`', 'b-blocks')}</small>

			{currentPostType === postType && <BControlPro className='mt20' label={__('Exclude Current Post', 'b-blocks')} checked={isExcludeCurrent} onChange={val => setAttributes({ isExcludeCurrent: val })} {...premiumProps} Component={ToggleControl} />} */}
		</PanelBody>


		{/* {!isSlider && !isTicker && !isPostsPerPageAll ? <Pagination {...props} /> : ''} */}

		{isSlider && <SliderOptions {...props} />}

		{/* {isTicker && <TickerOptions {...props} />} */}
	</>
}

export default withSelect((select, { attributes }) => {
	const { getPostTypes, getTaxonomies, getEntityRecords } = select('core');
	const { getCurrentPostType, getCurrentPostId } = select('core/editor');

	const { postType } = attributes;
	const taxonomies = getTaxonomies({ per_page: -1 });

	return {
		postTypes: getPostTypes({ per_page: -1 })?.filter(p => !['apb', 'attachment', 'wp_block', 'wp_template', 'wp_navigation', 'wp_template_part', 'nav_menu_item'].includes(p.slug))?.map(({ name, slug }) => ({ label: name, value: slug })),

		currentPostType: getCurrentPostType(),

		currentPostId: getCurrentPostId(),

		allTaxonomies: 'post' === postType ? taxonomies?.filter(tax => tax.types.includes('post')).filter(tax => tax.slug !== 'category' && tax.slug !== 'post_tag') : taxonomies?.filter(tax => tax.types.includes(postType)),

		getTaxonomy: slug => getEntityRecords('taxonomy', slug, { per_page: -1 })
	}
})(General);
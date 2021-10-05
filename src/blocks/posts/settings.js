import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, CheckboxControl, TextControl, ToggleControl, TabPanel, RadioControl, PanelRow } from '@wordpress/components';

// Icon
import icons from '../../Const/icons';

// Variables
import BDevice from '../../Components/BDevice';
import Background from '../../Components/Background';
import Title from '../../Components/Title';
import BColor from '../../Components/BColor';
import BorderControl from '../../Components/BorderControl';
import SpaceControl from '../../Components/SpaceControl';
import ColorsControl from '../../Components/ColorsControl';
import Typography from '../../Components/Typography';
import BtnGroup from '../../Components/BtnGroup';
import options from '../../Const/options';
const { generalStyleTabs, aligns, postsOrdersBy, postsOrders } = options;
const layouts = [
    { label: __('Grid', 'b-blocks'), value: 'grid', icon: icons.grid },
    { label: __('Masonry', 'b-blocks'), value: 'masonry', icon: icons.masonry }
];
const subLayouts = [
    { label: __('Default', 'b-blocks'), value: 'default' },
    { label: __('Title Meta', 'b-blocks'), value: 'title-meta' },
    { label: __('Left Image', 'b-blocks'), value: 'left-image' },
    { label: __('Right Image', 'b-blocks'), value: 'right-image' }
];
const categoriesPosition = [
    { label: __('Content', 'b-blocks'), value: 'content' },
    { label: __('Image', 'b-blocks'), value: 'image' }
];

const Settings = ({ settings, getPostTypes, categories }) => {
    const { attributes: { layout, subLayout, columns, columnGap, rowGap, isContentEqualHight, postType, selectedCategories, isPostsPerPageAll, postsPerPage, postsOrderBy, postsOrder, contentAlign, contentBG, contentPadding, border, isFImg, isFImgLink, isTitle, isTitleLink, titleTypo, titleColor, titleMargin, isMeta, isMetaAuthor, isMetaDate, isMetaCategory, metaCategoryIn, isMetaComment, metaTypo, metaTextColor, metaLinkColor, metaIconColor, metaMargin, isExcerpt, excerptLength, excerptAlign, excerptTypo, excerptColor, excerptMargin, isReadMore, readMoreLabel, isLinkNewTab, readMoreAlign, readMoreTypo, readMoreColors, readMoreHovColors, readMorePadding, readMoreBorder }, setAttributes, posts } = settings;

    const [device, setDevice] = useState('desktop');

    return <>
        <InspectorControls>
            <TabPanel className='bBlocksTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
                {'general' === tab.name && <>
                    {/* Layouts Settings */}
                    {posts && 0 !== posts.length && <PanelBody className='bBlocksPanelBody' title={__('Layouts Settings', 'b-blocks')} initialOpen={true}>
                        {/* Layout Type */}
                        <PanelRow>
                            <Title mt='0' mb='0'>{__('Layout Type:', 'b-blocks')}</Title>
                            <BtnGroup options={layouts} myValue={layout} setState={val => setAttributes({ layout: val })} icon={true} />
                        </PanelRow>

                        {/* Sub Layout */}
                        <PanelRow className='mt-20p'>
                            <Title mt='0' mb='0'>{__('Sub Layout:', 'b-blocks')}</Title>
                            <SelectControl value={subLayout} onChange={val => {
                                setAttributes({ subLayout: val });
                                'left-image' === val || 'right-image' === val ? setAttributes({
                                    columns: { ...columns, desktop: 2 }
                                }) : setAttributes({
                                    columns: { ...columns, desktop: 3 }
                                });
                            }} options={subLayouts} />
                        </PanelRow>
                        <small>{__('Some settings may change when sub layout will be changed.', 'b-blocks')}</small>

                        {/* Columns */}
                        <PanelRow className='mt-20p'>
                            <Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
                            <BDevice device={device} onChange={val => setDevice(val)} />
                        </PanelRow>
                        <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

                        {/* Column Gap */}
                        <Title>{__('Column Gap:', 'b-blocks')}</Title>
                        <RangeControl value={columnGap} onChange={val => setAttributes({ columnGap: val })} min={0} max={100} step={1} beforeIcon='arrow-right-alt' />

                        {/* Row Gap */}
                        <Title>{__('Row Gap:', 'b-blocks')}</Title>
                        <RangeControl value={rowGap} onChange={val => setAttributes({ rowGap: val })} min={0} max={150} step={1} beforeIcon='arrow-down-alt' />

                        {/* Content Height */}
                        {'grid' === layout && <><Title mt='10px'></Title><ToggleControl label={__('Enable Content Equal Height', 'b-blocks')} checked={isContentEqualHight} onChange={val => setAttributes({ isContentEqualHight: val })} /></>}
                    </PanelBody>}


                    {/* Posts Query */}
                    <PanelBody className='bBlocksPanelBody' title={__('Posts Query', 'b-blocks')} initialOpen={posts && 0 !== posts.length ? false : true}>
                        {/* Post Type */}
                        <PanelRow>
                            <Title mt='0' mb='0'>{__('Post Type:', 'b-blocks')}</Title>
                            <SelectControl value={postType} onChange={val => setAttributes({ postType: val })} options={getPostTypes} />
                        </PanelRow>

                        {/* Select Categories */}
                        {'post' === postType && categories && 0 !== categories.length ? <>
                            <Title>{__('Select Categories:', 'b-blocks')}</Title>
                            {categories.map(cat => {
                                const isInc = selectedCategories.includes(cat.id);

                                return <CheckboxControl label={cat.name} key={cat.id} checked={isInc} onChange={val => setAttributes({ selectedCategories: val ? [...selectedCategories, cat.id] : selectedCategories.filter(id => id !== cat.id) })} />;
                            })}
                        </> : null}

                        {/* Posts Per Page */}
                        <Title>{__('Post Per Page:', 'b-blocks')}</Title>
                        <ToggleControl label={__('Show All Posts', 'b-blocks')} checked={isPostsPerPageAll} onChange={val => setAttributes({ isPostsPerPageAll: val })} />

                        {false === isPostsPerPageAll && <RangeControl value={postsPerPage} onChange={val => setAttributes({ postsPerPage: val })} min={1} max={36} step={1} />}

                        {/* Posts Order By */}
                        <PanelRow className='mt-20p'>
                            <Title mt='0' mb='0'>{__('Post Order By:', 'b-blocks')}</Title>
                            <SelectControl value={postsOrderBy} onChange={val => setAttributes({ postsOrderBy: val })} options={postsOrdersBy} />
                        </PanelRow>

                        {/* Posts Order */}
                        <PanelRow className='mt-20p'>
                            <Title mt='0' mb='0'>{__('Post Order:', 'b-blocks')}</Title>
                            <SelectControl value={postsOrder} onChange={val => setAttributes({ postsOrder: val })} options={postsOrders} />
                        </PanelRow>
                    </PanelBody>


                    {/* Elements Settings */}
                    {posts && 0 !== posts.length && <PanelBody className='bBlocksPanelBody' title={__('Elements Settings', 'b-blocks')} initialOpen={false}>
                        {/*Feature Image */}
                        <Title mt='0'>{__('Feature Image:', 'b-blocks')}</Title>
                        <ToggleControl label={__('Show Feature Image', 'b-blocks')} checked={isFImg} onChange={val => setAttributes({ isFImg: val })} />

                        {isFImg && <ToggleControl label={__('Enable Feature Image Link', 'b-blocks')} checked={isFImgLink} onChange={val => setAttributes({ isFImgLink: val })} />}


                        {/* Title */}
                        <Title>{__('Title:', 'b-blocks')}</Title>
                        <ToggleControl label={__('Show Title', 'b-blocks')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

                        {isTitle && <ToggleControl label={__('Enable Title Link', 'b-blocks')} checked={isTitleLink} onChange={val => setAttributes({ isTitleLink: val })} />}


                        {/* Meta Data */}
                        <Title>{__('Meta Data:', 'b-blocks')}</Title>
                        <ToggleControl label={__('Show Meta Data', 'b-blocks')} checked={isMeta} onChange={val => setAttributes({ isMeta: val })} />

                        {isMeta && <>
                            <ToggleControl label={__('Show Author', 'b-blocks')} checked={isMetaAuthor} onChange={val => setAttributes({ isMetaAuthor: val })} />

                            <ToggleControl label={__('Show Date', 'b-blocks')} checked={isMetaDate} onChange={val => setAttributes({ isMetaDate: val })} />

                            <ToggleControl label={__('Show Category', 'b-blocks')} checked={isMetaCategory} onChange={val => setAttributes({ isMetaCategory: val })} />

                            {isMetaCategory && <>
                                <Title mt='0' mb='0'>{__('Show Category In:', 'b-blocks')}</Title>
                                <RadioControl selected={metaCategoryIn} onChange={val => setAttributes({ metaCategoryIn: val })} options={categoriesPosition} />
                                <Title mt='10px'></Title>
                            </>}

                            <ToggleControl label={__('Show Comment', 'b-blocks')} checked={isMetaComment} onChange={val => setAttributes({ isMetaComment: val })} />
                        </>}


                        {/* Excerpt */}
                        <Title>{__('Excerpt:', 'b-blocks')}</Title>
                        <ToggleControl label={__('Show Excerpt', 'b-blocks')} checked={isExcerpt} onChange={val => setAttributes({ isExcerpt: val })} />

                        {isExcerpt && <>
                            {/* Excerpt Length */}
                            <Title mt='0' mb='0'>{__('Excerpt Length:', 'b-blocks')}</Title>
                            <RangeControl value={excerptLength} onChange={val => setAttributes({ excerptLength: val })} min={0} max={100} step={1} />
                        </>}


                        {/* Read More */}
                        <Title>{__('Read More:', 'b-blocks')}</Title>
                        <ToggleControl label={__('Show Read More', 'b-blocks')} checked={isReadMore} onChange={val => setAttributes({ isReadMore: val })} />

                        {isReadMore && <>
                            {/* Read More Label */}
                            <Title mt='0' mb='0'>{__('Read More Label:', 'b-blocks')}</Title>
                            <TextControl value={readMoreLabel} onChange={val => setAttributes({ readMoreLabel: '' === val ? 'Read More' : val })} />

                            {/* New Tab */}
                            <ToggleControl label={__('Open link in new tab', 'b-blocks')} checked={isLinkNewTab} onChange={val => setAttributes({ isLinkNewTab: val })} />
                        </>}
                    </PanelBody>}
                </>}

                {'style' === tab.name && <>
                    {/* Content Style */}
                    {posts && 0 !== posts.length && <PanelBody className='bBlocksPanelBody' title={__('Content Settings', 'b-blocks')} initialOpen={true}>
                        {/* Text Align */}
                        <PanelRow>
                            <Title mt='0' mb='0'>{__('Text Align:', 'b-blocks')}</Title>
                            <BtnGroup options={aligns} myValue={contentAlign} setState={val => setAttributes({ contentAlign: val })} icon={true} />
                        </PanelRow>

                        {/* Background */}
                        <Background label={__('Background', 'b-blocks')} background={contentBG} onChange={val => setAttributes({ contentBG: val })} defaults={{ color: '#f4f2fc' }} />

                        {/* Padding */}
                        <SpaceControl className='mt-20p' label={__('Padding:', 'b-blocks')} space={contentPadding} onChange={val => setAttributes({ contentPadding: val })} defaults={{ vertical: '20px', horizontal: '25px' }} />

                        {/* Border */}
                        <BorderControl label={__('Border:', 'b-blocks')} border={border} onChange={val => setAttributes({ border: val })} defaults={{ radius: '5px' }} />
                    </PanelBody>}


                    {/* Feature Image Styles */}
                    {/* {isFImg && <PanelBody className='bBlocksPanelBody' title={__('Feature Image Styles', 'b-blocks')} initialOpen={false}></PanelBody>} */}


                    {/* Title Styles */}
                    {posts && 0 !== posts.length && isTitle && <PanelBody className='bBlocksPanelBody' title={__('Title Styles', 'b-blocks')} initialOpen={false}>
                        {/* Typography */}
                        <Typography typography={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: 25 }} />

                        {/* Color */}
                        <BColor className='mt-20p' label={__('Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#4527a4' />

                        {/* Margin */}
                        <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
                    </PanelBody>}


                    {/* Meta Data Styles */}
                    {posts && 0 !== posts.length && isMeta && <PanelBody className='bBlocksPanelBody' title={__('Meta Data Styles', 'b-blocks')} initialOpen={false}>
                        {/* Typography */}
                        <Typography typography={metaTypo} onChange={val => setAttributes({ metaTypo: val })} defaults={{ fontSize: 13, textTransform: 'uppercase' }} />

                        {/* Text Color */}
                        <BColor className='mt-20p' label={__('Text Color:', 'b-blocks')} value={metaTextColor} onChange={val => setAttributes({ metaTextColor: val })} defaultColor='#333' />

                        {/* Link Color */}
                        <BColor className='mt-20p' label={__('Link Color:', 'b-blocks')} value={metaLinkColor} onChange={val => setAttributes({ metaLinkColor: val })} defaultColor='#8344c5' />

                        {/* Icon Color */}
                        <BColor className='mt-20p' label={__('Icon Color:', 'b-blocks')} value={metaIconColor} onChange={val => setAttributes({ metaIconColor: val })} defaultColor='#4527a4' />

                        {/* Margin */}
                        <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={metaMargin} onChange={val => setAttributes({ metaMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
                    </PanelBody>}


                    {/* Excerpt Styles */}
                    {posts && 0 !== posts.length && isExcerpt && <PanelBody className='bBlocksPanelBody' title={__('Excerpt Styles', 'b-blocks')} initialOpen={false}>
                        {/* Text Align */}
                        <PanelRow>
                            <Title mt='0' mb='0'>{__('Text Align:', 'b-blocks')}</Title>
                            <BtnGroup options={aligns} myValue={excerptAlign} setState={val => setAttributes({ excerptAlign: val })} icon={true} />
                        </PanelRow>

                        {/* Typography */}
                        <Typography className='mt-20p' typography={excerptTypo} onChange={val => setAttributes({ excerptTypo: val })} defaults={{ fontSize: 15 }} />

                        {/* Color */}
                        <BColor className='mt-20p' label={__('Color:', 'b-blocks')} value={excerptColor} onChange={val => setAttributes({ excerptColor: val })} defaultColor='#333' />

                        {/* Margin */}
                        <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={excerptMargin} onChange={val => setAttributes({ excerptMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
                    </PanelBody>}


                    {/* Read More Settings */}
                    {posts && 0 !== posts.length && isReadMore && <PanelBody className='bBlocksPanelBody' title={__('Read More Settings', 'b-blocks')} initialOpen={false}>
                        {/* Button Align */}
                        <PanelRow>
                            <Title mt='0' mb='0'>{__('Button Align:', 'b-blocks')}</Title>
                            <BtnGroup options={aligns.filter(a => a.value !== 'justify')} myValue={readMoreAlign} setState={val => setAttributes({ readMoreAlign: val })} icon={true} />
                        </PanelRow>

                        {/* Typography */}
                        <Typography typography={readMoreTypo} onChange={val => setAttributes({ readMoreTypo: val })} defaults={{ fontSize: 14, textTransform: 'uppercase', fontWeight: 600 }} />

                        {/* Padding */}
                        <SpaceControl className='mt-20p' label={__('Padding:', 'b-blocks')} space={readMorePadding} onChange={val => setAttributes({ readMorePadding: val })} defaults={{ vertical: '12px', horizontal: '35px' }} />

                        {/* Border */}
                        <BorderControl label={__('Border:', 'b-blocks')} border={readMoreBorder} onChange={val => setAttributes({ readMoreBorder: val })} defaults={{ radius: '3px' }} />

                        <ColorsControl colors={readMoreColors} onChange={val => setAttributes({ readMoreColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} />

                        <ColorsControl label={__('Hover Colors:', 'b-blocks')} colors={readMoreHovColors} onChange={val => setAttributes({ readMoreHovColors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />
                    </PanelBody>}
                </>}
            </>}</TabPanel>
        </InspectorControls>


        <BlockControls>
            <AlignmentToolbar value={contentAlign} onChange={val => setAttributes({ contentAlign: val })} />
        </BlockControls>
    </>;
};
export default Settings;
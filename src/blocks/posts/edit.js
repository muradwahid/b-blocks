import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

import { InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, FontSizePicker, CheckboxControl, TextControl, ToggleControl, TabPanel, Spinner, RadioControl, PanelRow } from '@wordpress/components';

// Icon
import icons from '../../Const/icons';

// Variables
import BColor from '../../GutenComp/BColor';
import BtnGroup from '../../GutenComp/BtnGroup';
import Title from '../../GutenComp/Title';
import BDevice from '../../GutenComp/BDevice';
import options from '../../Const/options';
const { fontSizes, aligns, textTransforms, postsOrdersBy, postsOrders } = options;
const layouts = [
    { label: __('Grid', 'b-blocks'), value: 'grid', icon: icons.grid },
    { label: __('Masonry', 'b-blocks'), value: 'masonry', icon: icons.masonry },
];

// Components
import Default from './Layout/Default';

const Edit = props => {
    const { className, attributes, setAttributes, clientId, posts, categories } = props;

    const { cId, layout, columns, columnGap, rowGap, isContentEqualHight, selectedCategories, isPostsPerPageAll, postsPerPage, postsOrderBy, postsOrder, contentAlign, contentBGColor, postTextPTB, postTextPLR, borderColor, isFImg, isFImgLink, isTitle, isTitleLink, titleFontSize, titleColor, titleMB, isMeta, isMetaAuthor, isMetaDate, isMetaCategory, metaCategoryIn, isMetaComment, metaFontSize, metaTransform, metaTextColor, metaLinkColor, metaIconColor, metaMB, isExcerpt, excerptLength, excerptAlign, excerptFontSize, excerptColor, excerptMB, isReadMore, readMoreLabel, isLinkNewTab, readMoreAlign, readMoreFontSize, readMoreTransform, readMoreColor, readMoreHovColor } = attributes;

    // Posts and Categories Check
    if (!posts || !categories) {
        return <h3 className='loading fontSize-20'><Spinner /> {__('Loading...', 'b-blocks')}</h3>;
    }

    // Functions
    useEffect(() => {
        clientId && setAttributes({ cId: clientId });
    }, [clientId]);

    // Components
    const noPosts = () => <h3 className='noPosts fontSize-20 text-center'>{__('No posts found!! Please add some posts', 'b-blocks')}</h3>;

    const [device, setDevice] = useState('desktop');

    // Class Names
    const gridClasses = `bBlocksGridPosts columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile} cGap-${columnGap} rGap-${rowGap} alignItems-${'false' == isContentEqualHight ? 'start' : 'initial'}`;

    const masonryClasses = `bBlocksMasonryPosts cols-${columns.desktop} cols-tablet-${columns.tablet} cols-mobile-${columns.mobile} gap-${columnGap}`;

    return <>
        {posts && 0 !== posts.length && <InspectorControls>
            <TabPanel className='b_blocks_tab_panel' activeClass='active-tab' tabs={[{ name: 'layout', title: __('Layout', 'b-blocks'), className: 'layout-tab' }, { name: 'style', title: __('Style', 'b-blocks'), className: 'style-tab' }]}>
                {tab => {
                    return <>
                        {'layout' == tab.name && <>
                            {/* Layouts Settings */}
                            <PanelBody title={__('Layouts Settings', 'b-blocks')} initialOpen={true}>
                                {/* Layout Type */}
                                <PanelRow>
                                    <Title mt='5px'>{__('Layout Type:', 'b-blocks')}</Title>
                                    <BtnGroup options={layouts} myValue={layout} setState={val => setAttributes({ layout: val })} icon={true} />
                                </PanelRow>

                                {/* Columns */}
                                <PanelRow className='mt-15'>
                                    <Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
                                    <BDevice device={device} onChange={val => setDevice(val)} />
                                </PanelRow>
                                <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} />

                                {/* Column Gap */}
                                <Title>{__('Column Gap:', 'b-blocks')}</Title>
                                <RangeControl value={columnGap} onChange={val => setAttributes({ columnGap: val })} min={0} max={100} step={1} />

                                {/* Row Gap */}
                                <Title>{__('Row Gap:', 'b-blocks')}</Title>
                                <RangeControl value={rowGap} onChange={val => setAttributes({ rowGap: val })} min={0} max={150} step={1} />

                                {'grid' == layout && <>
                                    {/* Content Height */}
                                    <Title>{__('Content Height:', 'b-blocks')}</Title>
                                    <ToggleControl label={'true' == isContentEqualHight ? 'Disable Equal Height' : 'Enable Equal Height'} checked={'true' == isContentEqualHight ? true : false} onChange={val => setAttributes({ isContentEqualHight: val.toString() })} />
                                </>}
                            </PanelBody>

                            {/* Posts Query */}
                            <PanelBody title={__('Posts Query', 'b-blocks')} initialOpen={false}>
                                {/* Select Categories */}
                                {categories && 0 !== categories.length ? <>
                                    <Title mt='0'>{__('Select Categories:', 'b-blocks')}</Title>
                                    {categories.map(cat => {
                                        const isInc = selectedCategories.includes(cat.id);

                                        return (
                                            <CheckboxControl label={cat.name} key={cat.id} checked={isInc} onChange={val => setAttributes({ selectedCategories: val ? [...selectedCategories, cat.id] : selectedCategories.filter(id => id !== cat.id) })} />
                                        );
                                    })}
                                </> : null}

                                {/* Posts Per Page */}
                                <Title>{__('Post Per Page:', 'b-blocks')}</Title>
                                <ToggleControl label={'true' == isPostsPerPageAll ? 'Show Some Posts' : 'Show All Posts'} checked={'true' == isPostsPerPageAll ? true : false} onChange={val => setAttributes({ isPostsPerPageAll: val.toString() })} />

                                {'false' == isPostsPerPageAll && <RangeControl value={postsPerPage} onChange={val => setAttributes({ postsPerPage: 0 === val ? 12 : val })} min={1} max={36} step={1} />}

                                {/* Posts Order By */}
                                <PanelRow className='mt-20p'>
                                    <Title mt='0' mb='15px'>{__('Post Order By:', 'b-blocks')}</Title>
                                    <SelectControl value={postsOrderBy} onChange={val => setAttributes({ postsOrderBy: val })} options={postsOrdersBy} />
                                </PanelRow>

                                {/* Posts Order */}
                                <PanelRow className='mt-20p'>
                                    <Title mt='0' mb='15px'>{__('Post Order:', 'b-blocks')}</Title>
                                    <SelectControl value={postsOrder} onChange={val => setAttributes({ postsOrder: val })} options={postsOrders} />
                                </PanelRow>
                            </PanelBody>

                            {/* Elements Settings */}
                            <PanelBody title={__('Elements Settings', 'b-blocks')} initialOpen={false}>
                                {/*Feature Image */}
                                <Title mt='0'>{__('Feature Image:', 'b-blocks')}</Title>
                                <ToggleControl label={'true' == isFImg ? 'Hide Feature Image' : 'Show Feature Image'} checked={'true' == isFImg ? true : false} onChange={val => setAttributes({ isFImg: val.toString() })} />

                                {'true' == isFImg && <ToggleControl label={'true' == isFImgLink ? 'Disable Feature Image Link' : 'Enable Feature Image Link'} checked={'true' == isFImgLink ? true : false} onChange={val => setAttributes({ isFImgLink: val.toString() })} />}


                                {/* Title */}
                                <Title>{__('Title:', 'b-blocks')}</Title>
                                <ToggleControl label={'true' == isTitle ? 'Hide Title' : 'Show Title'} checked={'true' == isTitle ? true : false} onChange={val => setAttributes({ isTitle: val.toString() })} />

                                {'true' == isTitle && <ToggleControl label={'true' == isTitleLink ? 'Disable Title Link' : 'Enable Title Link'} checked={'true' == isTitleLink ? true : false} onChange={val => setAttributes({ isTitleLink: val.toString() })} />}


                                {/* Meta Data */}
                                <Title>{__('Meta Data:', 'b-blocks')}</Title>
                                <ToggleControl label={'true' == isMeta ? 'Hide Meta Data' : 'Show Meta Data'} checked={'true' == isMeta ? true : false} onChange={val => setAttributes({ isMeta: val.toString() })} />

                                {'true' == isMeta && <>
                                    <ToggleControl label={'true' == isMetaAuthor ? 'Hide Author' : 'Show Author'} checked={'true' == isMetaAuthor ? true : false} onChange={val => setAttributes({ isMetaAuthor: val.toString() })} />

                                    <ToggleControl label={'true' == isMetaDate ? 'Hide Date' : 'Show Date'} checked={'true' == isMetaDate ? true : false} onChange={val => setAttributes({ isMetaDate: val.toString() })} />

                                    <ToggleControl label={'true' == isMetaCategory ? 'Hide Category' : 'Show Category'} checked={'true' == isMetaCategory ? true : false} onChange={val => setAttributes({ isMetaCategory: val.toString() })} />

                                    {'true' == isMetaCategory && <>
                                        <Title mt='0' mb='0'>{__('Show Category In:', 'b-blocks')}</Title>
                                        <RadioControl selected={metaCategoryIn} options={[
                                            { label: 'Content', value: 'content' },
                                            { label: 'Image', value: 'image' },
                                        ]} onChange={val => setAttributes({ metaCategoryIn: val })} />
                                        <Title mb='0' />
                                    </>}

                                    <ToggleControl label={'true' == isMetaComment ? 'Hide Comment' : 'Show Comment'} checked={'true' == isMetaComment ? true : false} onChange={val => setAttributes({ isMetaComment: val.toString() })} />
                                </>}


                                {/* Excerpt */}
                                <Title>{__('Excerpt:', 'b-blocks')}</Title>
                                <ToggleControl label={'true' == isExcerpt ? 'Hide Excerpt' : 'Show Excerpt'} checked={'true' == isExcerpt ? true : false} onChange={val => setAttributes({ isExcerpt: val.toString() })} />

                                {'true' == isExcerpt && <>
                                    {/* Excerpt Length */}
                                    <Title>{__('Excerpt Length:', 'b-blocks')}</Title>
                                    <RangeControl value={excerptLength} onChange={val => setAttributes({ excerptLength: val })} min={0} max={100} step={1} />
                                </>}


                                {/* Read More */}
                                <Title>{__('Read More:', 'b-blocks')}</Title>
                                <ToggleControl label={'true' == isReadMore ? 'Hide Read More' : 'Show Read More'} checked={'true' == isReadMore ? true : false} onChange={val => setAttributes({ isReadMore: val.toString() })} />

                                {'true' == isReadMore && <>
                                    {/* Read More Label */}
                                    <Title>{__('Read More Label:', 'b-blocks')}</Title>
                                    <TextControl value={readMoreLabel} onChange={val => setAttributes({ readMoreLabel: '' === val ? 'Read More' : val })} />

                                    {/* New Tab */}
                                    <Title mb='0' />
                                    <ToggleControl label={'true' == isLinkNewTab ? 'Open in this tab' : 'Open in new tab'} checked={'true' == isLinkNewTab ? true : false} onChange={val => setAttributes({ isLinkNewTab: val.toString() })} />
                                </>}
                            </PanelBody>
                        </>}

                        {'style' == tab.name && <>
                            {/* Content Settings */}
                            <PanelBody title={__('Content Settings', 'b-blocks')} initialOpen={true}>
                                {/* Text Align */}
                                <PanelRow>
                                    <Title mt='5px'>{__('Text Align:', 'b-blocks')}</Title>
                                    <BtnGroup options={aligns} myValue={contentAlign} setState={val => setAttributes({ contentAlign: val })} icon={true} />
                                </PanelRow>

                                {/* Background Color */}
                                <PanelRow className='mt-25'>
                                    <Title mt='5px'>{__('Background Color:', 'b-blocks')}</Title>
                                    <BColor value={contentBGColor} onChange={val => setAttributes({ contentBGColor: val })} defaultColor='#f4f2fc' />
                                </PanelRow>

                                {/* Padding Top Bottom */}
                                <Title>{__('Padding Top Bottom:', 'b-blocks')}</Title>
                                <RangeControl value={postTextPTB} onChange={val => setAttributes({ postTextPTB: val })} min={0} max={100} step={1} />

                                {/* Padding Left Right */}
                                <Title>{__('Padding Left Right:', 'b-blocks')}</Title>
                                <RangeControl value={postTextPLR} onChange={val => setAttributes({ postTextPLR: val })} min={0} max={150} step={1} />

                                {/* Border Color */}
                                <PanelRow className='mt-25'>
                                    <Title mt='5px'>{__('Border Color:', 'b-blocks')}</Title>
                                    <BColor value={borderColor} onChange={val => setAttributes({ borderColor: val })} defaultColor='#4427a500' />
                                </PanelRow>
                            </PanelBody>

                            {/* Title Settings */}
                            {'true' == isTitle && <PanelBody title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                                {/* Font Size */}
                                <Title mt='0'>{__('Font Size:', 'b-blocks')}</Title>
                                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={20} value={titleFontSize} onChange={val => setAttributes({ titleFontSize: 'undefined' === typeof val ? 20 : val })} />

                                {/* Color */}
                                <PanelRow className='mt-20p mb-5p'>
                                    <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                                    <BColor value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#4527a4' />
                                </PanelRow>

                                {/* Margin Bottom */}
                                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                                <RangeControl value={titleMB} onChange={val => setAttributes({ titleMB: val })} min={0} max={100} step={1} />
                            </PanelBody>}

                            {/* Meta Data Settings */}
                            {'true' == isMeta && <PanelBody title={__('Meta Data Settings', 'b-blocks')} initialOpen={false}>
                                {/* Font Size */}
                                <Title mt='0'>{__('Font Size:', 'b-blocks')}</Title>
                                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={13} value={metaFontSize} onChange={val => setAttributes({ metaFontSize: 'undefined' === typeof val ? 13 : val })} />

                                {/* Text Transform */}
                                <PanelRow className='mt-20p mb-5p'>
                                    <Title mt='5px'>{__('Text Transform:', 'b-blocks')}</Title>
                                    <BtnGroup options={textTransforms} myValue={metaTransform} setState={val => setAttributes({ metaTransform: val })} />
                                </PanelRow>

                                {/* Text Color */}
                                <PanelRow className='mt-20p mb-5p'>
                                    <Title mt='5px'>{__('Text Color:', 'b-blocks')}</Title>
                                    <BColor value={metaTextColor} onChange={val => setAttributes({ metaTextColor: val })} defaultColor='#333' />
                                </PanelRow>

                                {/* Link Color */}
                                <PanelRow className='mt-20p mb-5p'>
                                    <Title mt='5px'>{__('Link Color:', 'b-blocks')}</Title>
                                    <BColor value={metaLinkColor} onChange={val => setAttributes({ metaLinkColor: val })} defaultColor='#8344c5' />
                                </PanelRow>

                                {/* Icon Color */}
                                <PanelRow className='mt-20p mb-5p'>
                                    <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                                    <BColor value={metaIconColor} onChange={val => setAttributes({ metaIconColor: val })} defaultColor='#4527a4' />
                                </PanelRow>

                                {/* Margin Bottom */}
                                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                                <RangeControl value={metaMB} onChange={val => setAttributes({ metaMB: val })} min={0} max={100} step={1} />
                            </PanelBody>}

                            {/* Excerpt Settings */}
                            {'true' == isExcerpt && <PanelBody title={__('Excerpt Settings', 'b-blocks')} initialOpen={false}>
                                {/* Text Align */}
                                <PanelRow>
                                    <Title mt='5px'>{__('Text Align:', 'b-blocks')}</Title>
                                    <BtnGroup options={aligns} myValue={excerptAlign} setState={val => setAttributes({ excerptAlign: val })} icon={true} />
                                </PanelRow>

                                {/* Font Size */}
                                <Title>{__('Font Size:', 'b-blocks')}</Title>
                                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={excerptFontSize} onChange={val => setAttributes({ excerptFontSize: 'undefined' === typeof val ? 15 : val })} />

                                {/* Color */}
                                <PanelRow className='mt-20p mb-5p'>
                                    <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                                    <BColor value={excerptColor} onChange={val => setAttributes({ excerptColor: val })} defaultColor='#333' />
                                </PanelRow>

                                {/* Margin Bottom */}
                                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                                <RangeControl value={excerptMB} onChange={val => setAttributes({ excerptMB: val })} min={0} max={100} step={1} />
                            </PanelBody>}

                            {/* Read More Settings */}
                            {'true' == isReadMore && <PanelBody title={__('Read More Settings', 'b-blocks')} initialOpen={false}>
                                {/* Text Align */}
                                <PanelRow>
                                    <Title mt='5px'>{__('Text Align:', 'b-blocks')}</Title>
                                    <BtnGroup options={aligns} myValue={readMoreAlign} setState={val => setAttributes({ readMoreAlign: val })} icon={true} />
                                </PanelRow>

                                {/* Font Size */}
                                <Title>{__('Font Size:', 'b-blocks')}</Title>
                                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={14} value={readMoreFontSize} onChange={val => setAttributes({ readMoreFontSize: 'undefined' === typeof val ? 14 : val })} />

                                {/* Text Transform */}
                                <PanelRow className='mt-20p mb-5p'>
                                    <Title mt='5px'>{__('Text Transform:', 'b-blocks')}</Title>
                                    <BtnGroup options={textTransforms} myValue={readMoreTransform} setState={val => setAttributes({ readMoreTransform: val })} />
                                </PanelRow>

                                <Title>{__('Colors:', 'b-blocks')}</Title>
                                <TabPanel className='b_blocks_tab_panel' activeClass='active-tab'
                                    tabs={[{ name: 'normal', title: __('Normal', 'b-blocks'), className: 'normal-tab' }, { name: 'hover', title: __('Hover', 'b-blocks'), className: 'hover-tab', }]}>
                                    {tab => {
                                        return <>
                                            {'normal' == tab.name && <>
                                                {/* Color */}
                                                <PanelRow className='mt-20p mb-5p'>
                                                    <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                                                    <BColor value={readMoreColor} onChange={val => setAttributes({ readMoreColor: val })} defaultColor='#4527a4' />
                                                </PanelRow>
                                            </>}

                                            {'hover' == tab.name && <>
                                                {/* Hover Color */}
                                                <PanelRow className='mt-20p mb-5p'>
                                                    <Title mt='5px'>{__('Hover Color:', 'b-blocks')}</Title>
                                                    <BColor value={readMoreHovColor} onChange={val => setAttributes({ readMoreHovColor: val })} defaultColor='#8344c5' />
                                                </PanelRow>
                                            </>}
                                        </>
                                    }}
                                </TabPanel>
                            </PanelBody>}
                        </>}
                    </> // Return of Layout TabPanel
                }}
            </TabPanel>
        </InspectorControls>}


        <BlockControls>
            <AlignmentToolbar value={contentAlign} onChange={val => setAttributes({ contentAlign: val })} />
        </BlockControls>


        {posts && 0 !== posts.length ? <div className={`${className}  bBlocksPosts`}>

            {'grid' == layout ? <div className={gridClasses} id={`bBlocksGridPosts-${cId}`}>
                {posts.map(post => <Default key={post.id} atts={attributes} post={post} />)} {/* Single Posts */}
            </div> /* Grid Layout */ :

                'masonry' == layout && <div className={masonryClasses} id={`bBlocksMasonryPosts-${cId}`}>
                    {posts.map(post => <Default key={post.id} atts={attributes} post={post} />)} {/* Single Posts */}
                </div> /* Masonry Layout */
            }
        </div> /* Post Block Posts */ : noPosts()}
    </>;
}
export default withSelect((select, props) => {
    const { selectedCategories, isPostsPerPageAll, postsPerPage, postsOrderBy, postsOrder } = props.attributes;

    const query = {
        categories: selectedCategories,
        per_page: 'true' == isPostsPerPageAll ? -1 : postsPerPage, // Set -1 to display ALL
        orderby: postsOrderBy,
        order: postsOrder,
    }

    return {
        select,
        posts: select('core').getEntityRecords('postType', 'post', query),
        categories: select('core').getEntityRecords('taxonomy', 'category'),
        media: id => select('core').getMedia(id),
        authors: select('core').getAuthors()
    };
})(Edit);
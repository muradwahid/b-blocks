import $ from 'jquery';

const { registerBlockType } = wp.blocks;
const { withSelect } = wp.data;
const { useEffect } = wp.element;

const { InspectorControls, BlockControls, AlignmentToolbar, ColorPalette } = wp.blockEditor;
const { PanelBody, SelectControl, RangeControl, FontSizePicker, CheckboxControl, TextControl, Dashicon, ToggleControl, TabPanel, Spinner, Button, ButtonGroup, Tooltip } = wp.components;


// Icon
import icons from '../../Const/icons';


// Variables
import options from '../../Const/options';
const { fontSizes, colors, aligns, fontWeights, textTransforms, postsOrdersBy, postsOrders, getMonth, shadows } = options;
const layouts = [
    { label: 'Grid', value: 'grid', icon: icons.grid },
    { label: 'Slider', value: 'slider', icon: icons.sliderNoColor },
    { label: 'Masonry', value: 'masonry', icon: icons.masonry },
];

const subLayout = {
    grid: [
        { label: 'Grid 1', value: 'grid1', icon: icons.gridVertical3 },
    ]
};


// Functions
import func from '../../Const/functions';
const { firstTitle, otherTitle } = func;


registerBlockType('b-blocks/advance-posts', {
    // Build In attributes
    title: 'Advance Posts',
    icon: icons.advancePosts,
    category: 'bBlocks',
    keywords: ['Show Posts', 'Blog Posts', 'Custom Posts'],

    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        selectedCategories: { type: 'array', default: [] },
        postsPerPageAll: { type: 'boolean', default: 'true' },
        postsPerPage: { type: 'number', default: 10 },
        postsOrderBy: { type: 'string', default: 'date' },
        postsOrder: { type: 'string', default: 'desc' },

        layout: { type: 'string', default: 'grid' },
        columns: { type: 'number', default: 3 },
        columnGap: { type: 'number', default: 10 },
        rowGap: { type: 'number', default: 10 },
        contentEqualHight: { type: 'string', default: 'true' },

        contentAlign: { type: 'string', default: 'left' },
        contentBGColor: { type: 'string', default: '#fff' },
        postTextPTB: { type: 'number', default: 20 },
        postTextPLR: { type: 'number', default: 25 },
        shadow: { type: 'string', default: 'shadow' },

        featureImgShow: { type: 'string', default: 'true' },
        featureImgLink: { type: 'string', default: 'false' },

        titleShow: { type: 'string', default: 'true' },
        titleLink: { type: 'string', default: 'true' },
        titleFontSize: { type: 'number' },
        titleColor: { type: 'string', default: '#4527a4' },
        titleMB: { type: 'number', default: 15 },

        metaShow: { type: 'string', default: 'true' },
        metaAuthorShow: { type: 'string', default: 'true' },
        metaDateShow: { type: 'string', default: 'true' },
        metaCategoryShow: { type: 'string', default: 'true' },
        metaCommentShow: { type: 'string', default: 'false' },
        metaFontSize: { type: 'number', default: 13 },
        metaTransform: { type: 'string', default: 'uppercase' },
        metaTextColor: { type: 'string', default: '#333' },
        metaLinkColor: { type: 'string', default: '#8344c5' },
        metaIconColor: { type: 'string', default: '#4527a4' },
        metaMB: { type: 'number', default: 15 },

        excerptShow: { type: 'string', default: 'true' },
        excerptLength: { type: 'number', default: 25 },
        excerptAlign: { type: 'string', default: 'justify' },
        excerptFontSize: { type: 'number' },
        excerptColor: { type: 'string', default: '#333' },
        excerptMB: { type: 'number', default: 10 },

        readMoreShow: { type: 'string', default: 'true' },
        readMoreLabel: { type: 'string', default: 'Read More' },
        linkNewTab: { type: 'string', default: 'false' },
        readMoreAlign: { type: 'string', default: 'left' },
        readMoreFontSize: { type: 'number', default: 14 },
        readMoreTransform: { type: 'string', default: 'capitalize' },
        readMoreFontWeight: { type: 'string', default: '600' },
        readMoreColor: { type: 'string', default: '#4527a4' },
        readMoreHovColor: { type: 'string', default: '#8344c5' },
    },

    // Build In Functions
    edit: withSelect((select, props) => {
        const { selectedCategories, postsPerPageAll, postsPerPage, postsOrderBy, postsOrder } = props.attributes;

        const query = {
            categories: selectedCategories,
            per_page: 'true' == postsPerPageAll ? -1 : postsPerPage, // set -1 to display ALL
            orderby: postsOrderBy,
            order: postsOrder,
        }

        return {
            select,
            posts: select('core').getEntityRecords('postType', 'post', query),
            categories: select('core').getEntityRecords('taxonomy', 'category'),
            media: id => select('core').getMedia(id),
        };

    })(({ select, posts, categories, media, attributes, setAttributes, clientId }) => {
        const { selectedCategories, postsPerPageAll, postsPerPage, postsOrderBy, postsOrder, layout, columns, columnGap, rowGap, contentEqualHight, contentAlign, contentBGColor, postTextPTB, postTextPLR, shadow, featureImgShow, featureImgLink, titleShow, titleLink, titleFontSize, titleColor, titleMB, metaShow, metaAuthorShow, metaDateShow, metaCategoryShow, metaCommentShow, metaFontSize, metaTransform, metaTextColor, metaLinkColor, metaIconColor, metaMB, excerptShow, excerptLength, excerptAlign, excerptFontSize, excerptColor, excerptMB, readMoreShow, readMoreLabel, linkNewTab, readMoreAlign, readMoreFontSize, readMoreTransform, readMoreFontWeight, readMoreColor, readMoreHovColor } = attributes;

        // Render HTML and Excerpt count
        const renderHTML = rawHTML => <span dangerouslySetInnerHTML={{ __html: rawHTML }} />;
        const truncate = (str, no_words) => str.split(" ").splice(0, no_words).join(" ");

        // Posts and Categories Check
        if (!posts || !categories) {
            return <h3 style={{ color: '#4527a4' }}><Spinner /> Loading...</h3>;
        }

        // Single Category Func
        const singleCat = id => {
            let catName;
            categories.map(cat => {
                if (cat.id === id) {
                    catName = `<a href="${cat.link}" target="_blank">${cat.name}</a>`;
                }
            });
            return catName;
        }


        // Styles
        const gridPostsStyle = { display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gridGap: `${rowGap}px ${columnGap}px` }
        const sliderPostsStyle = {}
        const masonryPostsStyle = { columns: columns, gap: `${columnGap}px` }

        const contentStyle = { textAlign: contentAlign, height: 'true' == contentEqualHight ? '100%' : 'auto', backgroundColor: contentBGColor }

        const postTextStyle = { padding: `${postTextPTB}px ${postTextPLR}px` }

        const titleStyle = { textAlign: contentAlign, fontSize: `${titleFontSize}px`, color: titleColor, margin: `0 0 ${titleMB}px 0` }
        const metaStyle = { textAlign: contentAlign, fontSize: `${metaFontSize}px`, textTransform: metaTransform, color: metaTextColor, margin: `0 0 ${metaMB}px 0` }
        const excerptStyle = { textAlign: excerptAlign, fontSize: `${excerptFontSize}px`, color: excerptColor, margin: `0 0 ${excerptMB}px 0` }

        const readMoreWrapStyle = { textAlign: readMoreAlign, }
        const readMoreStyle = { display: 'inline-block', fontSize: `${readMoreFontSize}px`, textTransform: readMoreTransform, fontWeight: readMoreFontWeight, color: readMoreColor, transition: 'all .3s ease' }


        // Components
        const noPosts = () => {
            return <h3 style={{ color: '#4527a4', textAlign: 'center' }}>No posts found!! Please add some posts</h3>;
        }


        // Single Posts Functions
        const readMoreHov = e => e.target.style.color = readMoreHovColor;

        const readMoreHovLeave = e => e.target.style.color = readMoreColor;

        const featureImg = (link, f_media) => 'true' == featureImgShow && f_media > 0 && <div div className="feature_img">
            {'true' == featureImgLink ? media(f_media) && <a href={link} target={'true' == linkNewTab ? '_blank' : '_self'}><img src={media(f_media).source_url} alt={media(f_media).caption.rendered} /></a> : media(f_media) && <img src={media(f_media).source_url} alt={media(f_media).caption.rendered} />}
        </div>;

        const postTitle = (link, title) => 'true' == titleShow && <h3 className="title" style={titleStyle}>
            {'true' == titleLink ? <a href={link} target={'true' == linkNewTab ? '_blank' : '_self'} style={{ color: titleColor }}>{title.rendered}</a> : title.rendered}
        </h3>;

        const metaAuthor = (author_info) => 'true' == metaAuthorShow && <span>
            <Dashicon icon="admin-users" style={{ color: metaIconColor }} />&nbsp;
            <a href={author_info.author_link} target="_blank" style={{ color: metaLinkColor }}>{author_info.display_name}</a>
        </span>;

        const metaDate = date => 'true' == metaDateShow && <span>
            <Dashicon icon="calendar" style={{ color: metaIconColor }} />&nbsp;
            <span style={{ color: metaTextColor }}>{date}</span>
        </span>;

        const metaCategory = categories => 'true' == metaCategoryShow && <span>
            <Dashicon icon="category" style={{ color: metaIconColor }} />&nbsp;
            <span style={{ color: metaLinkColor }}>{renderHTML(categories.map(id => `${singleCat(id)}`))}</span>
        </span>;

        const metaComments = (link, comment_info) => 'true' == metaCommentShow && <span>
            <Dashicon icon="admin-comments" style={{ color: metaIconColor }} />&nbsp;
            <a href={`${link}/#comments`} target="_blank" style={{ color: metaLinkColor }}>{comment_info === 0 ? "No Comments" : comment_info === 1 ? "1 Comment" : `${comment_info} Comments`}</a>
        </span>;

        const postExcerpt = content => 'true' == excerptShow && <div className="excerpt" style={excerptStyle}>{renderHTML(truncate(content.rendered, excerptLength))}</div>;

        const postReadMore = link => 'true' == readMoreShow && <div className="read_more" style={readMoreWrapStyle}><a href={link} target={'true' == linkNewTab ? '_blank' : '_self'} style={readMoreStyle} onMouseEnter={readMoreHov} onMouseLeave={readMoreHovLeave}>{readMoreLabel}</a></div>;

        return [
            posts && posts.length !== 0 && <InspectorControls>
                <TabPanel className="b_blocks_tab_panel" activeClass="active-tab"
                    tabs={[{ name: 'layout', title: 'Layout', className: 'layout-tab' }, { name: 'style', title: 'Style', className: 'style-tab' }, { name: 'advanced', title: 'Advanced', className: 'advanced-tab', }]}>
                    {tab => {
                        return <span>
                            {'layout' == tab.name && <span>
                                {/* Layouts Settings */}
                                <PanelBody title="Layouts Settings" initialOpen={true}>
                                    {/* Layout Type */}
                                    {firstTitle('Layout Type:')}
                                    <ButtonGroup className="b_blocks_button_groups">
                                        {Object.values(layouts).map(obj => (
                                            <Tooltip text={obj.label} position="top">
                                                <Button className="b_blocks_ap_posts_layout_change_btn" key={obj.value} icon={obj.icon} isMedium isPrimary={layout === obj.value} aria-pressed={layout === obj.value} onClick={() => setAttributes({ layout: obj.value })}></Button>
                                            </Tooltip>
                                        ))}
                                    </ButtonGroup>

                                    {/* Columns */}
                                    {otherTitle('Columns:')}
                                    <RangeControl value={columns} onChange={cng => setAttributes({ columns: cng })} min={1} max={6} step={1} />

                                    {/* Column Gap */}
                                    {otherTitle('Column Gap:')}
                                    <RangeControl value={columnGap} onChange={cng => setAttributes({ columnGap: cng })} min={0} max={60} step={1} />

                                    {/* Row Gap */}
                                    {otherTitle('Row Gap:')}
                                    <RangeControl value={rowGap} onChange={cng => setAttributes({ rowGap: cng })} min={0} max={100} step={1} />

                                    {'grid' == layout && <span>
                                        {/* Content Height */}
                                        {otherTitle('Content Height:')}
                                        <ToggleControl label={'true' == contentEqualHight ? 'Disable Equal Height' : 'Enable Equal Height'} checked={'true' == contentEqualHight ? true : false} onChange={cng => setAttributes({ contentEqualHight: cng.toString() })} />
                                    </span>}
                                </PanelBody>


                                {/* Posts Query */}
                                <PanelBody title="Posts Query" initialOpen={false}>
                                    {/* Select Categories */}
                                    {categories && categories.length !== 0 ? <span>
                                        {firstTitle('Select Categories:')}
                                        {categories.map(cat => {
                                            const isInc = selectedCategories.includes(cat.id);

                                            return (
                                                <CheckboxControl label={cat.name} key={cat.id} checked={isInc} onChange={cng => setAttributes({ selectedCategories: cng ? [...selectedCategories, cat.id] : selectedCategories.filter(id => id !== cat.id) })} />
                                            );
                                        })}
                                    </span> : ''}

                                    {/* Posts Per Page */}
                                    {otherTitle('Post Per Page:')}
                                    <ToggleControl label={'true' == postsPerPageAll ? 'Show Some Posts' : 'Show All Posts'} checked={'true' == postsPerPageAll ? true : false} onChange={cng => setAttributes({ postsPerPageAll: cng.toString() })} />

                                    {!postsPerPageAll && <span>
                                        <RangeControl value={postsPerPage} onChange={cng => setAttributes({ postsPerPage: cng })} min={1} max={36} step={1} />
                                    </span>}

                                    {/* Posts Order By */}
                                    {otherTitle('Post Order By:')}
                                    <SelectControl value={postsOrderBy} onChange={cng => setAttributes({ postsOrderBy: cng })} options={postsOrdersBy} />

                                    {/* Posts Order */}
                                    {otherTitle('Post Order:')}
                                    <SelectControl value={postsOrder} onChange={cng => setAttributes({ postsOrder: cng })} options={postsOrders} />
                                </PanelBody>


                                {/* Elements Settings */}
                                <PanelBody title="Elements Settings" initialOpen={false}>
                                    {/*Feature Image */}
                                    {firstTitle('Feature Image:')}
                                    <ToggleControl label={'true' == featureImgShow ? 'Hide Feature Image' : 'Show Feature Image'} checked={'true' == featureImgShow ? true : false} onChange={cng => setAttributes({ featureImgShow: cng.toString() })} />

                                    {'true' == featureImgShow && <span>
                                        <ToggleControl label={'true' == featureImgLink ? 'Disable Feature Image Link' : 'Enable Feature Image Link'} checked={'true' == featureImgLink ? true : false} onChange={cng => setAttributes({ featureImgLink: cng.toString() })} />
                                    </span>}


                                    {/* Title */}
                                    {otherTitle('Title:')}
                                    <ToggleControl label={'true' == titleShow ? 'Hide Title' : 'Show Title'} checked={'true' == titleShow ? true : false} onChange={cng => setAttributes({ titleShow: cng.toString() })} />

                                    {'true' == titleShow && <span>
                                        <ToggleControl label={'true' == titleLink ? 'Disable Title Link' : 'Enable Title Link'} checked={'true' == titleLink ? true : false} onChange={cng => setAttributes({ titleLink: cng.toString() })} />
                                    </span>}


                                    {/* Meta Data */}
                                    {otherTitle('Meta Data:')}
                                    <ToggleControl label={'true' == metaShow ? 'Hide Meta Data' : 'Show Meta Data'} checked={'true' == metaShow ? true : false} onChange={cng => setAttributes({ metaShow: cng.toString() })} />

                                    {'true' == metaShow && <span>
                                        <ToggleControl label={'true' == metaAuthorShow ? 'Hide Author' : 'Show Author'} checked={'true' == metaAuthorShow ? true : false} onChange={cng => setAttributes({ metaAuthorShow: cng.toString() })} />

                                        <ToggleControl label={'true' == metaDateShow ? 'Hide Date' : 'Show Date'} checked={'true' == metaDateShow ? true : false} onChange={cng => setAttributes({ metaDateShow: cng.toString() })} />

                                        <ToggleControl label={'true' == metaCategoryShow ? 'Hide Category' : 'Show Category'} checked={'true' == metaCategoryShow ? true : false} onChange={cng => setAttributes({ metaCategoryShow: cng.toString() })} />

                                        <ToggleControl label={'true' == metaCommentShow ? 'Hide Comment' : 'Show Comment'} checked={'true' == metaCommentShow ? true : false} onChange={cng => setAttributes({ metaCommentShow: cng.toString() })} />
                                    </span>}


                                    {/* Excerpt */}
                                    {otherTitle('Excerpt:')}
                                    <ToggleControl label={'true' == excerptShow ? 'Hide Excerpt' : 'Show Excerpt'} checked={'true' == excerptShow ? true : false} onChange={cng => setAttributes({ excerptShow: cng.toString() })} />

                                    {'true' == excerptShow && <span>
                                        {/* Excerpt Length */}
                                        <small style={{ fontSize: '13px' }}>Excerpt Length:</small>
                                        <RangeControl value={excerptLength} onChange={cng => setAttributes({ excerptLength: cng })} min={0} max={100} step={1} />
                                    </span>}


                                    {/* Read More */}
                                    {otherTitle('Read More:')}
                                    <ToggleControl label={'true' == readMoreShow ? 'Hide Read More' : 'Show Read More'} checked={'true' == readMoreShow ? true : false} onChange={cng => setAttributes({ readMoreShow: cng.toString() })} />

                                    {'true' == readMoreShow && <span>
                                        {/* Read More Label */}
                                        <small style={{ fontSize: '13px' }}>Read More Label:</small>
                                        <TextControl value={readMoreLabel} onChange={cng => setAttributes({ readMoreLabel: cng })} />

                                        {/* New Tab */}
                                        <ToggleControl label={'true' == linkNewTab ? 'Open in this tab' : 'Open in new tab'} checked={'true' == linkNewTab ? true : false} onChange={cng => setAttributes({ linkNewTab: cng.toString() })} />
                                    </span>}
                                </PanelBody>
                            </span>}

                            {'style' == tab.name && <span>
                                {/* Content Settings */}
                                <PanelBody title="Content Settings" initialOpen={true}>
                                    {/* Align */}
                                    {firstTitle('Align:')}
                                    <ButtonGroup className="b_blocks_button_groups">
                                        {Object.values(aligns).map(obj => (
                                            <Tooltip text={obj.label} position="top">
                                                <Button key={obj.value} icon={obj.icon} isMedium isPrimary={contentAlign === obj.value} aria-pressed={contentAlign === obj.value} onClick={() => setAttributes({ contentAlign: obj.value })}></Button>
                                            </Tooltip>
                                        ))}
                                    </ButtonGroup>

                                    {/* Background Color */}
                                    {otherTitle('Background Color:')}
                                    <ColorPalette value={contentBGColor} onChange={cng => setAttributes({ contentBGColor: cng })} colors={colors} />

                                    {/* Top Bottom Padding */}
                                    {otherTitle('Top Bottom Padding:')}
                                    <RangeControl value={postTextPTB} onChange={cng => setAttributes({ postTextPTB: cng })} min={0} max={50} step={1} />

                                    {/* Left Right Padding */}
                                    {otherTitle('Left Right Padding:')}
                                    <RangeControl value={postTextPLR} onChange={cng => setAttributes({ postTextPLR: cng })} min={0} max={50} step={1} />

                                    {/* Shadow */}
                                    {otherTitle('Shadow:')}
                                    <SelectControl value={shadow} onChange={cng => setAttributes({ shadow: cng })} options={shadows} />
                                </PanelBody>


                                {/* Feature Image Settings */}
                                {'true' == featureImgShow && <span>
                                    <PanelBody title="Feature Image Settings" initialOpen={false}>

                                    </PanelBody>
                                </span>}


                                {/* Title Settings */}
                                {'true' == titleShow && <span>
                                    <PanelBody title="Title Settings" initialOpen={false}>
                                        {/* Font Size */}
                                        {firstTitle('Font Size:')}
                                        <FontSizePicker fontSizes={fontSizes} value={titleFontSize} onChange={cng => setAttributes({ titleFontSize: cng })} />

                                        {/* Color */}
                                        {otherTitle('Color:')}
                                        <ColorPalette value={titleColor} onChange={cng => setAttributes({ titleColor: cng })} colors={colors} />

                                        {/* Bottom Margin */}
                                        {otherTitle('Bottom Margin:')}
                                        <RangeControl value={titleMB} onChange={cng => setAttributes({ titleMB: cng })} min={0} max={50} step={1} />
                                    </PanelBody>
                                </span>}


                                {/* Meta Data Settings */}
                                {'true' == metaShow && <span>
                                    <PanelBody title="Meta Data Settings" initialOpen={false}>
                                        {/* Font Size */}
                                        {firstTitle('Font Size:')}
                                        <FontSizePicker fontSizes={fontSizes} value={metaFontSize} onChange={cng => setAttributes({ metaFontSize: cng })} />

                                        {/* Text Transform */}
                                        {otherTitle('Text Transform:')}
                                        <ButtonGroup className="b_blocks_button_groups">
                                            {Object.values(textTransforms).map(obj => (
                                                <Tooltip text={obj.label} position="top">
                                                    <Button key={obj.value} isMedium isPrimary={metaTransform === obj.value} aria-pressed={metaTransform === obj.value} onClick={() => setAttributes({ metaTransform: obj.value })}>{obj.icon}</Button>
                                                </Tooltip>
                                            ))}
                                        </ButtonGroup>

                                        {/* Text Color */}
                                        {otherTitle('Text Color:')}
                                        <ColorPalette value={metaTextColor} onChange={cng => setAttributes({ metaTextColor: cng })} colors={colors} />

                                        {/* Link Color */}
                                        {otherTitle('Link Color:')}
                                        <ColorPalette value={metaLinkColor} onChange={cng => setAttributes({ metaLinkColor: cng })} colors={colors} />

                                        {/* Icon Color */}
                                        {otherTitle('Icon Color:')}
                                        <ColorPalette value={metaIconColor} onChange={cng => setAttributes({ metaIconColor: cng })} colors={colors} />

                                        {/* Bottom Margin */}
                                        {otherTitle('Bottom Margin:')}
                                        <RangeControl value={metaMB} onChange={cng => setAttributes({ metaMB: cng })} min={0} max={50} step={1} />
                                    </PanelBody>
                                </span>}


                                {/* Excerpt Settings */}
                                {'true' == excerptShow && <span>
                                    <PanelBody title="Excerpt Settings" initialOpen={false}>
                                        {/* Align */}
                                        {firstTitle('Align:')}
                                        <ButtonGroup className="b_blocks_button_groups">
                                            {Object.values(aligns).map(obj => (
                                                <Tooltip text={obj.label} position="top">
                                                    <Button key={obj.value} icon={obj.icon} isMedium isPrimary={excerptAlign === obj.value} aria-pressed={excerptAlign === obj.value} onClick={() => setAttributes({ excerptAlign: obj.value })}></Button>
                                                </Tooltip>
                                            ))}
                                        </ButtonGroup>

                                        {/* Font Size */}
                                        {otherTitle('Font Size:')}
                                        <FontSizePicker fontSizes={fontSizes} value={excerptFontSize} onChange={cng => setAttributes({ excerptFontSize: cng })} />

                                        {/* Color */}
                                        {otherTitle('Color:')}
                                        <ColorPalette value={excerptColor} onChange={cng => setAttributes({ excerptColor: cng })} colors={colors} />

                                        {/* Bottom Margin */}
                                        {otherTitle('Bottom Margin:')}
                                        <RangeControl value={excerptMB} onChange={cng => setAttributes({ excerptMB: cng })} min={0} max={50} step={1} />
                                    </PanelBody>
                                </span>}


                                {/* Read More Settings */}
                                {'true' == readMoreShow && <span>
                                    <PanelBody title="Read More Settings" initialOpen={false}>
                                        {/* Align */}
                                        {firstTitle('Align:')}
                                        <ButtonGroup className="b_blocks_button_groups">
                                            {Object.values(aligns).map(obj => (
                                                <Tooltip text={obj.label} position="top">
                                                    <Button key={obj.value} icon={obj.icon} isMedium isPrimary={readMoreAlign === obj.value} aria-pressed={readMoreAlign === obj.value} onClick={() => setAttributes({ readMoreAlign: obj.value })}></Button>
                                                </Tooltip>
                                            ))}
                                        </ButtonGroup>

                                        {/* Font Size */}
                                        {otherTitle('Font Size:')}
                                        <FontSizePicker fontSizes={fontSizes} value={readMoreFontSize} onChange={cng => setAttributes({ readMoreFontSize: cng })} />

                                        {/* Text Transform */}
                                        {otherTitle('Text Transform:')}
                                        <ButtonGroup className="b_blocks_button_groups">
                                            {Object.values(textTransforms).map(obj => (
                                                <Tooltip text={obj.label} position="top">
                                                    <Button key={obj.value} isMedium isPrimary={readMoreTransform === obj.value} aria-pressed={readMoreTransform === obj.value} onClick={() => setAttributes({ readMoreTransform: obj.value })}>{obj.icon}</Button>
                                                </Tooltip>
                                            ))}
                                        </ButtonGroup>

                                        {/* Font Weight */}
                                        {otherTitle('Font Weight:')}
                                        <SelectControl value={readMoreFontWeight} onChange={cng => setAttributes({ readMoreFontWeight: cng })} options={fontWeights} />

                                        {otherTitle('Colors:')}
                                        <TabPanel className="b_blocks_tab_panel" activeClass="active-tab"
                                            tabs={[{ name: 'normal', title: 'Normal', className: 'normal-tab' }, { name: 'hover', title: 'Hover', className: 'hover-tab', }]}>
                                            {tab => {
                                                return <span>
                                                    {'normal' == tab.name && <span>
                                                        {/* Color */}
                                                        {otherTitle('Color:')}
                                                        <ColorPalette value={readMoreColor} onChange={cng => setAttributes({ readMoreColor: cng })} colors={colors} />
                                                    </span>}

                                                    {'hover' == tab.name && <span>
                                                        {/* Hover Color */}
                                                        {otherTitle('Hover Color:')}
                                                        <ColorPalette value={readMoreHovColor} onChange={cng => setAttributes({ readMoreHovColor: cng })} colors={colors} />
                                                    </span>}
                                                </span>
                                            }}
                                        </TabPanel>
                                    </PanelBody>
                                </span>}
                            </span>}


                            {'advanced' == tab.name && <span>
                                Advanced
                            </span>}
                        </span>
                    }}
                </TabPanel>
            </InspectorControls >,


            posts && posts.length !== 0 ? <div className="b_blocks_advance_posts">
                <BlockControls>
                    <AlignmentToolbar value={contentAlign} onChange={cng => setAttributes({ contentAlign: cng })} />
                </BlockControls>


                {'grid' == layout ? <div id={`bBlocksGridAdvancePosts-${clientId}`} className="b_blocks_grid_posts" style={gridPostsStyle}>
                    {posts.map(post => {
                        const { id, date, featured_media, title, uagb_author_info, categories, uagb_comment_info, content, link, _links } = post;

                        const d = new Date(date);
                        const convertDate = `${getMonth[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

                        return (
                            <article div key={id} className="b_blocks_article">
                                <div className={`post_content ${shadow} rounded`} style={contentStyle}>
                                    {featureImg(link, featured_media)}

                                    <div className="post_text" style={postTextStyle}>
                                        {postTitle(link, title)}

                                        {'true' == metaShow && <p className="meta" style={metaStyle}>
                                            {metaAuthor(uagb_author_info)}
                                            {metaDate(convertDate)}
                                            {metaCategory(categories)}
                                            {metaComments(link, uagb_comment_info)}
                                        </p>}

                                        {postExcerpt(content)}

                                        {postReadMore(link)}
                                    </div>
                                </div>
                            </article>
                        );
                    })} {/* Single Posts */}
                </div> /* Grid Layout */ :


                    'masonry' == layout ? <div id={`bBlocksMasonryAdvancePosts-${clientId}`} className="b_blocks_masonry_posts" style={masonryPostsStyle}>
                        {posts.map(post => {
                            const { id, date, featured_media, title, uagb_author_info, categories, uagb_comment_info, content, link, _links } = post;

                            const d = new Date(date);
                            const convertDate = `${getMonth[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

                            return (
                                <article div key={id} className="b_blocks_article" style={{ breakInside: 'avoid', marginBottom: `${rowGap}px` }}>
                                    <div className={`post_content ${shadow} rounded`} style={contentStyle}>
                                        {featureImg(link, featured_media)}

                                        <div className="post_text" style={postTextStyle}>
                                            {postTitle(link, title)}

                                            {'true' == metaShow && <p className="meta" style={metaStyle}>
                                                {metaAuthor(uagb_author_info)}
                                                {metaDate(convertDate)}
                                                {metaCategory(categories)}
                                                {metaComments(link, uagb_comment_info)}
                                            </p>}

                                            {postExcerpt(content)}
                                            {postReadMore(link)}
                                        </div>
                                    </div>
                                </article>
                            );
                        })} {/* Single Posts */}
                    </div> /* Masonry Layout */ :


                        'slider' == layout && <span>
                            {useEffect(() => {
                                $(`#bBlocksSliderAdvancePosts-${clientId}`).lightSlider({
                                    item: columns,
                                    slideMargin: columnGap,
                                    gallery: false,
                                    enableDrag: false,
                                    loop: false,
                                    slideMove: 1,
                                    easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
                                    speed: 600,
                                    autoWidth: false,
                                    onSliderLoad: function () {
                                        $('#autoWidth').removeClass('cS-hidden');
                                    }
                                });

                                var seen = {};
                                $('.lSAction, .lSPager').each(function () {
                                    var txt = $(this).attr('class');
                                    if (seen[txt])
                                        $(this).remove();
                                    else
                                        seen[txt] = true;
                                });
                            })}

                            <div id={`bBlocksSliderAdvancePosts-${clientId}`} className="b_blocks_slider_posts" style={sliderPostsStyle}>
                                {posts.map(post => {
                                    const { id, date, featured_media, title, uagb_author_info, categories, uagb_comment_info, content, link, _links } = post;

                                    const d = new Date(date);
                                    const convertDate = `${getMonth[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

                                    return (
                                        <article className="b_blocks_article" style={{ backgroundImage: `url(${'true' == featureImgShow && featured_media > 0 && media(featured_media) && media(featured_media).source_url})` }}>
                                            <div class="b_blocks_article_overlay"></div>

                                            <div className={`b_blocks_article_inner_wrap ${shadow}`}>
                                                <div class="b_blocks_article_content">
                                                    {postTitle(link, title)}
                                                    {postExcerpt(content)}
                                                    {postReadMore(link)}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })} {/* Single Posts */}
                            </div>
                        </span>/* Slider Layout */
                }
            </div> /* B Block Posts */ : noPosts()
        ];
    }),

    save: () => null,

    example: {
        attributes: {
            'preview': true,
        },
    },
});
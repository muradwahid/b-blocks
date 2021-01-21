const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
const { withSelect } = wp.data;
const { useEffect, Fragment } = wp.element;
const { InspectorControls, BlockControls, AlignmentToolbar, ColorPalette } = wp.blockEditor;
const { PanelBody, SelectControl, RangeControl, FontSizePicker, CheckboxControl, TextControl, Dashicon, ToggleControl, TabPanel, Spinner } = wp.components;

// Icon
import icons from '../../Const/icons';

// Variables
import options from '../../Const/options';
const { fontSizes, colors, aligns, fontWeights, textTransforms, postsOrdersBy, postsOrders, getMonth, shadows } = options;

const layouts = [
    { label: __('Grid', 'b-blocks'), value: 'grid', icon: icons.grid },
    { label: __('Masonry', 'b-blocks'), value: 'masonry', icon: icons.masonry },
];

// Components
import BtnGroup from '../../GutenComp/BtnGroup';

// Functions
import func from '../../Const/functions';
const { firstTitle, otherTitle } = func;

registerBlockType('b-blocks/posts', {
    // Build In attributes
    title: __('Posts', 'b-blocks'),
    description: __('Display blog posts', 'b-blocks'),
    icon: icons.postEmbed,
    category: 'bBlocks',
    keywords: [__('Specific Category Posts', 'b-blocks')],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        align: { type: 'string', default: 'full' },
        cId: { type: 'string' },

        selectedCategories: { type: 'array', default: [] },
        postsPerPageAll: { type: 'boolean', default: 'false' },
        postsPerPage: { type: 'number', default: 12 },
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

        titleShow: { type: 'string', default: 'true' },
        titleFontSize: { type: 'number', default: 20 },
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
        excerptFontSize: { type: 'number', default: 15 },
        excerptColor: { type: 'string', default: '#333' },
        excerptMB: { type: 'number', default: 10 },

        readMoreShow: { type: 'string', default: 'true' },
        readMoreLabel: { type: 'string', default: 'Read More' },
        readMoreAlign: { type: 'string', default: 'left' },
        readMoreFontSize: { type: 'number', default: 14 },
        readMoreTransform: { type: 'string', default: 'uppercase' },
        readMoreFontWeight: { type: 'string', default: '600' },
        readMoreColor: { type: 'string', default: '#4527a4' },
        readMoreHovColor: { type: 'string', default: '#8344c5' },
    },

    // Build In Functions
    edit: withSelect((select, props) => {
        const { selectedCategories, postsPerPageAll, postsPerPage, postsOrderBy, postsOrder } = props.attributes;

        const query = {
            categories: selectedCategories,
            per_page: postsPerPageAll == 'true' ? -1 : postsPerPage, // set -1 to display ALL
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

    })(({ select, posts, categories, media, authors, attributes, setAttributes, clientId }) => {
        const { cId, selectedCategories, postsPerPageAll, postsPerPage, postsOrderBy, postsOrder, layout, columns, columnGap, rowGap, contentEqualHight, contentAlign, contentBGColor, postTextPTB, postTextPLR, shadow, featureImgShow, titleShow, titleFontSize, titleColor, titleMB, metaShow, metaAuthorShow, metaDateShow, metaCategoryShow, metaCommentShow, metaFontSize, metaTransform, metaTextColor, metaLinkColor, metaIconColor, metaMB, excerptShow, excerptLength, excerptAlign, excerptFontSize, excerptColor, excerptMB, readMoreShow, readMoreLabel, readMoreAlign, readMoreFontSize, readMoreTransform, readMoreFontWeight, readMoreColor, readMoreHovColor } = attributes;

        // Render HTML and Excerpt count
        const renderHTML = rawHTML => <span dangerouslySetInnerHTML={{ __html: rawHTML }} />;
        const truncate = (str, no_words) => str && str.split(" ").splice(0, no_words).join(" ");

        // Posts and Categories Check
        if (!posts || !categories) {
            return <h3 style={{ color: '#4527a4', fontSize: '20px' }}><Spinner /> {__('Loading...', 'b-blocks')}</h3>;
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

        // Posts Image Size
        useEffect(() => {
            const f_image = document.querySelectorAll('.b_blocks_grid_posts .b_blocks_article .feature_img img');
            f_image.length && f_image.forEach(im => {
                im ? im.style.height = `${(im.clientWidth / 16) * 9}px` : null;
            });
        }, [posts, layout, columns, columnGap]);


        // Styles
        const gridPostsStyle = { display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gridGap: `${rowGap}px ${columnGap}px` }
        const masonryPostsStyle = { columns: columns, gap: `${columnGap}px` }

        const contentStyle = { textAlign: contentAlign, height: contentEqualHight == 'true' ? '100%' : 'auto', backgroundColor: contentBGColor }

        const postTextStyle = { padding: `${postTextPTB}px ${postTextPLR}px` }

        const titleStyle = { textAlign: contentAlign, fontSize: `${titleFontSize}px`, color: titleColor, margin: `0 0 ${titleMB}px 0` }
        const metaStyle = { textAlign: contentAlign, fontSize: `${metaFontSize}px`, textTransform: metaTransform, color: metaTextColor, margin: `0 0 ${metaMB}px 0` }
        const excerptStyle = { textAlign: excerptAlign, fontSize: `${excerptFontSize}px`, color: excerptColor, margin: `0 0 ${excerptMB}px 0` }

        const readMoreWrapStyle = { textAlign: readMoreAlign, }
        const readMoreStyle = { display: 'inline-block', fontSize: `${readMoreFontSize}px`, textTransform: readMoreTransform, fontWeight: readMoreFontWeight, color: readMoreColor, transition: 'all .3s ease' }


        // Functions
        useEffect(() => {
            clientId && setAttributes({ cId: clientId });
        }, [clientId]);


        // Components
        const noPosts = () => {
            return <h3 style={{ color: '#4527a4', textAlign: 'center', fontSize: '20px' }}>{__('No posts found!! Please add some posts', 'b-blocks')}</h3>;
        }


        // Single Posts Components
        const readMoreHov = e => e.target.style.color = readMoreHovColor;

        const readMoreHovLeave = e => e.target.style.color = readMoreColor;

        const featureImg = (link, f_media) => featureImgShow == 'true' && f_media > 0 && <div div className="feature_img">
            {media(f_media) && <a href={link} target="_blank"><img src={media(f_media).source_url} alt={media(f_media).caption.rendered} /></a>}
        </div>;

        const postTitle = (link, title) => titleShow == 'true' && <h3 className="title" style={titleStyle}><a href={link} target="_blank" style={{ color: titleColor }}>{title.rendered}</a></h3>;

        const metaAuthor = authorID => metaAuthorShow == 'true' && <span>
            <Dashicon icon="admin-users" style={{ color: metaIconColor }} />&nbsp;
            {authorID && authors && authors.filter(a => a.id == authorID).map(auth => <a href={auth.link} target="_blank" style={{ color: metaLinkColor }}>{auth.name}</a>)}
        </span>;

        const metaDate = date => metaDateShow == 'true' && <span>
            <Dashicon icon="calendar" style={{ color: metaIconColor }} />&nbsp;
            <span style={{ color: metaTextColor }}>{date}</span>
        </span>;

        const metaCategory = categories => metaCategoryShow == 'true' && <span>
            <Dashicon icon="category" style={{ color: metaIconColor }} />&nbsp;
            <span style={{ color: metaLinkColor }}>{renderHTML(categories.map(id => `${singleCat(id)}`))}</span>
        </span>;

        // const metaComments = (link, comment_info) => metaCommentShow == 'true' && <span>
        //     <Dashicon icon="admin-comments" style={{ color: metaIconColor }} />&nbsp;
        //     <a href={`${link}/#comments`} target="_blank" style={{ color: metaLinkColor }}>{comment_info === 0 ? __('No Comments', 'b-blocks') : comment_info === 1 ? __('1 Comment', 'b-blocks') : __(`${comment_info} Comments`, 'b-blocks')}</a>
        // </span>;

        const postExcerpt = content => excerptShow == 'true' && <div className="excerpt b_blocks_inner_content" style={excerptStyle}>{renderHTML(truncate(content.rendered, excerptLength))}</div>;

        const postReadMore = link => readMoreShow == 'true' && <div className="read_more" style={readMoreWrapStyle}><a href={link} target="_blank" style={readMoreStyle} onMouseEnter={readMoreHov} onMouseLeave={readMoreHovLeave}>{readMoreLabel}</a></div>;

        return [
            posts && 0 !== posts.length && <InspectorControls>
                {/* Layouts Settings */}
                <PanelBody title={__('Layouts Settings', 'b-blocks')} initialOpen={true}>
                    {/* Layout Type */}
                    {firstTitle('Layout Type:')}
                    <BtnGroup options={layouts} myValue={layout} setState={cng => setAttributes({ layout: cng })} icon={true} />

                    {/* Columns */}
                    {otherTitle('Columns:')}
                    <RangeControl value={columns} onChange={cng => setAttributes({ columns: cng })} min={1} max={6} step={1} />

                    {/* Column Gap */}
                    {otherTitle('Column Gap:')}
                    <RangeControl value={columnGap} onChange={cng => setAttributes({ columnGap: cng })} min={0} max={100} step={1} />

                    {/* Row Gap */}
                    {otherTitle('Row Gap:')}
                    <RangeControl value={rowGap} onChange={cng => setAttributes({ rowGap: cng })} min={0} max={150} step={1} />

                    {'grid' == layout && <Fragment>
                        {/* Content Height */}
                        {otherTitle('Content Height:')}
                        <ToggleControl label={contentEqualHight == 'true' ? 'Disable Equal Height' : 'Enable Equal Height'} checked={contentEqualHight == 'true' ? true : false} onChange={cng => setAttributes({ contentEqualHight: cng.toString() })} />
                    </Fragment>}
                </PanelBody>


                {/* Posts Query */}
                <PanelBody title={__('Posts Query', 'b-blocks')} initialOpen={false}>
                    {/* Select Categories */}
                    {categories && 0 !== categories.length ? <Fragment>
                        {firstTitle('Select Categories:')}
                        {categories.map(cat => {
                            const isInc = selectedCategories.includes(cat.id);

                            return (
                                <CheckboxControl label={cat.name} key={cat.id} checked={isInc} onChange={cng => setAttributes({ selectedCategories: cng ? [...selectedCategories, cat.id] : selectedCategories.filter(id => id !== cat.id) })} />
                            );
                        })}
                    </Fragment> : null}

                    {/* Posts Per Page */}
                    {otherTitle('Post Per Page:')}
                    <ToggleControl label={postsPerPageAll == 'true' ? 'Show Some Posts' : 'Show All Posts'} checked={postsPerPageAll == 'true' ? true : false} onChange={cng => setAttributes({ postsPerPageAll: cng.toString() })} />

                    {'false' == postsPerPageAll && <Fragment>
                        <RangeControl value={postsPerPage} onChange={cng => setAttributes({ postsPerPage: 0 === cng ? 12 : cng })} min={1} max={36} step={1} />
                    </Fragment>}

                    {/* Posts Order By */}
                    {otherTitle('Post Order By:')}
                    <SelectControl value={postsOrderBy} onChange={cng => setAttributes({ postsOrderBy: cng })} options={postsOrdersBy} />

                    {/* Posts Order */}
                    {otherTitle('Post Order:')}
                    <SelectControl value={postsOrder} onChange={cng => setAttributes({ postsOrder: cng })} options={postsOrders} />
                </PanelBody>


                {/* Elements Settings */}
                <PanelBody title={__('Elements Settings', 'b-blocks')} initialOpen={false}>
                    {/*Feature Image */}
                    {firstTitle('Feature Image:')}
                    <ToggleControl label={featureImgShow == 'true' ? 'Hide Feature Image' : 'Show Feature Image'} checked={featureImgShow == 'true' ? true : false} onChange={cng => setAttributes({ featureImgShow: cng.toString() })} />


                    {/* Title */}
                    {otherTitle('Title:')}
                    <ToggleControl label={titleShow == 'true' ? 'Hide Title' : 'Show Title'} checked={titleShow == 'true' ? true : false} onChange={cng => setAttributes({ titleShow: cng.toString() })} />


                    {/* Meta Data */}
                    {otherTitle('Meta Data:')}
                    <ToggleControl label={metaShow == 'true' ? 'Hide Meta Data' : 'Show Meta Data'} checked={metaShow == 'true' ? true : false} onChange={cng => setAttributes({ metaShow: cng.toString() })} />

                    {metaShow == 'true' && <Fragment>
                        <ToggleControl label={metaAuthorShow == 'true' ? 'Hide Author' : 'Show Author'} checked={metaAuthorShow == 'true' ? true : false} onChange={cng => setAttributes({ metaAuthorShow: cng.toString() })} />

                        <ToggleControl label={metaDateShow == 'true' ? 'Hide Date' : 'Show Date'} checked={metaDateShow == 'true' ? true : false} onChange={cng => setAttributes({ metaDateShow: cng.toString() })} />

                        <ToggleControl label={metaCategoryShow == 'true' ? 'Hide Category' : 'Show Category'} checked={metaCategoryShow == 'true' ? true : false} onChange={cng => setAttributes({ metaCategoryShow: cng.toString() })} />

                        {/* <ToggleControl label={metaCommentShow == 'true' ? 'Hide Comment' : 'Show Comment'} checked={metaCommentShow == 'true' ? true : false} onChange={cng => setAttributes({ metaCommentShow: cng.toString() })} /> */}
                    </Fragment>}


                    {/* Excerpt */}
                    {otherTitle('Excerpt:')}
                    <ToggleControl label={excerptShow == 'true' ? 'Hide Excerpt' : 'Show Excerpt'} checked={excerptShow == 'true' ? true : false} onChange={cng => setAttributes({ excerptShow: cng.toString() })} />

                    {excerptShow == 'true' && <Fragment>
                        {/* Excerpt Length */}
                        <small style={{ fontSize: '13px' }}>Excerpt Length:</small>
                        <RangeControl value={excerptLength} onChange={cng => setAttributes({ excerptLength: cng })} min={0} max={100} step={1} />
                    </Fragment>}


                    {/* Read More */}
                    {otherTitle('Read More:')}
                    <ToggleControl label={readMoreShow == 'true' ? 'Hide Read More' : 'Show Read More'} checked={readMoreShow == 'true' ? true : false} onChange={cng => setAttributes({ readMoreShow: cng.toString() })} />

                    {readMoreShow == 'true' && <Fragment>
                        {/* Read More Label */}
                        <small style={{ fontSize: '13px' }}>Read More Label:</small>
                        <TextControl value={readMoreLabel} onChange={cng => setAttributes({ readMoreLabel: '' === cng ? 'Read More' : cng })} />
                    </Fragment>}
                </PanelBody>


                {/* Content Settings */}
                <PanelBody title={__('Content Settings', 'b-blocks')} initialOpen={false}>
                    {/* Text Align */}
                    {firstTitle('Text Align:')}
                    <BtnGroup options={aligns} myValue={contentAlign} setState={cng => setAttributes({ contentAlign: cng })} icon={true} />

                    {/* Background Color */}
                    {otherTitle('Background Color:')}
                    <ColorPalette value={contentBGColor} onChange={cng => setAttributes({ contentBGColor: cng })} colors={colors} />

                    {/* Top Bottom Padding */}
                    {otherTitle('Top Bottom Padding:')}
                    <RangeControl value={postTextPTB} onChange={cng => setAttributes({ postTextPTB: cng })} min={0} max={100} step={1} />

                    {/* Left Right Padding */}
                    {otherTitle('Left Right Padding:')}
                    <RangeControl value={postTextPLR} onChange={cng => setAttributes({ postTextPLR: cng })} min={0} max={150} step={1} />

                    {/* Shadow */}
                    {otherTitle('Shadow:')}
                    <SelectControl value={shadow} onChange={cng => setAttributes({ shadow: cng })} options={shadows} />
                </PanelBody>


                {/* Feature Image Settings */}
                {/* {'true' == featureImgShow && <Fragment>
                    <PanelBody title={__('Feature Image Settings', 'b-blocks')} initialOpen={false}>

                    </PanelBody>
                </Fragment>} */}


                {/* Title Settings */}
                {titleShow == 'true' && <Fragment>
                    <PanelBody title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                        {/* Font Size */}
                        {firstTitle('Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} fallbackFontSize={20} value={titleFontSize} onChange={cng => setAttributes({ titleFontSize: 'undefined' === typeof cng ? 20 : cng })} />

                        {/* Color */}
                        {otherTitle('Color:')}
                        <ColorPalette value={titleColor} onChange={cng => setAttributes({ titleColor: cng })} colors={colors} />

                        {/* Bottom Margin */}
                        {otherTitle('Bottom Margin:')}
                        <RangeControl value={titleMB} onChange={cng => setAttributes({ titleMB: cng })} min={0} max={100} step={1} />
                    </PanelBody>
                </Fragment>}


                {/* Meta Data Settings */}
                {metaShow == 'true' && <Fragment>
                    <PanelBody title={__('Meta Data Settings', 'b-blocks')} initialOpen={false}>
                        {/* Font Size */}
                        {firstTitle('Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} fallbackFontSize={13} value={metaFontSize} onChange={cng => setAttributes({ metaFontSize: 'undefined' === typeof cng ? 13 : cng })} />

                        {/* Text Transform */}
                        {otherTitle('Text Transform:')}
                        <BtnGroup options={textTransforms} myValue={metaTransform} setState={cng => setAttributes({ metaTransform: cng })} />

                        {/* Text Color */}
                        {otherTitle('Text Color:')}
                        <ColorPalette value={metaTextColor} onChange={cng => setAttributes({ metaTextColor: cng })} colors={colors} />

                        {/* Link Color */}
                        {otherTitle('Link Color:')}
                        <ColorPalette value={metaLinkColor} onChange={cng => setAttributes({ metaLinkColor: cng })} colors={colors} />

                        {/* Meta Data Icon Color */}
                        {otherTitle('Icon Color:')}
                        <ColorPalette value={metaIconColor} onChange={cng => setAttributes({ metaIconColor: cng })} colors={colors} />

                        {/* Bottom Margin */}
                        {otherTitle('Bottom Margin:')}
                        <RangeControl value={metaMB} onChange={cng => setAttributes({ metaMB: cng })} min={0} max={100} step={1} />
                    </PanelBody>
                </Fragment>}


                {/* Excerpt Settings */}
                {excerptShow == 'true' && <Fragment>
                    <PanelBody title={__('Excerpt Settings', 'b-blocks')} initialOpen={false}>
                        {/* Text Align */}
                        {firstTitle('Text Align:')}
                        <BtnGroup options={aligns} myValue={excerptAlign} setState={cng => setAttributes({ excerptAlign: cng })} icon={true} />

                        {/* Font Size */}
                        {otherTitle('Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={excerptFontSize} onChange={cng => setAttributes({ excerptFontSize: 'undefined' === typeof cng ? 15 : cng })} />

                        {/* Color */}
                        {otherTitle('Color:')}
                        <ColorPalette value={excerptColor} onChange={cng => setAttributes({ excerptColor: cng })} colors={colors} />

                        {/* Bottom Margin */}
                        {otherTitle('Bottom Margin:')}
                        <RangeControl value={excerptMB} onChange={cng => setAttributes({ excerptMB: cng })} min={0} max={100} step={1} />
                    </PanelBody>
                </Fragment>}


                {/* Read More Link Settings */}
                {readMoreShow == 'true' && <Fragment>
                    <PanelBody title={__('Read More Settings', 'b-blocks')} initialOpen={false}>
                        {/* Text Align */}
                        {firstTitle('Text Align:')}
                        <BtnGroup options={aligns} myValue={readMoreAlign} setState={cng => setAttributes({ readMoreAlign: cng })} icon={true} />

                        {/* Font Size */}
                        {otherTitle('Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} fallbackFontSize={14} value={readMoreFontSize} onChange={cng => setAttributes({ readMoreFontSize: 'undefined' === typeof cng ? 14 : cng })} />

                        {/* Text Transform */}
                        {otherTitle('Text Transform:')}
                        <BtnGroup options={textTransforms} myValue={readMoreTransform} setState={cng => setAttributes({ readMoreTransform: cng })} />

                        {/* Font Weight */}
                        {otherTitle('Font Weight:')}
                        <SelectControl value={readMoreFontWeight} onChange={cng => setAttributes({ readMoreFontWeight: cng })} options={fontWeights} />

                        {otherTitle('Colors:')}
                        <TabPanel className="b_blocks_tab_panel" activeClass="active-tab"
                            tabs={[{ name: 'normal', title: __('Normal', 'b-blocks'), className: 'normal-tab' }, { name: 'hover', title: __('Hover', 'b-blocks'), className: 'hover-tab', }]}>
                            {tab => {
                                return <Fragment>
                                    {'normal' == tab.name && <Fragment>
                                        {/* Color */}
                                        {firstTitle('Color:')}
                                        <ColorPalette value={readMoreColor} onChange={cng => setAttributes({ readMoreColor: cng })} colors={colors} />
                                    </Fragment>}

                                    {'hover' == tab.name && <Fragment>
                                        {/* Hover Color */}
                                        {firstTitle('Hover Color:')}
                                        <ColorPalette value={readMoreHovColor} onChange={cng => setAttributes({ readMoreHovColor: cng })} colors={colors} />
                                    </Fragment>}
                                </Fragment>
                            }}
                        </TabPanel>
                    </PanelBody>
                </Fragment>}
            </InspectorControls>,


            posts && 0 !== posts.length ? <div className="b_blocks_posts">
                <BlockControls>
                    <AlignmentToolbar value={contentAlign} onChange={cng => setAttributes({ contentAlign: cng })} />
                </BlockControls>


                {'grid' == layout ? <div id={`bBlocksGridPosts-${clientId}`} className="b_blocks_grid_posts" style={gridPostsStyle}>
                    {posts.map(post => {
                        const { id, date, featured_media, title, author, categories, content, link } = post;

                        const d = new Date(date);
                        const convertDate = `${getMonth[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

                        return (
                            <article div key={id} className="b_blocks_article">
                                <div className={`post_content ${shadow} rounded`} style={contentStyle}>
                                    {featureImg(link, featured_media)}

                                    <div className="post_text" style={postTextStyle}>
                                        {postTitle(link, title)}

                                        {metaShow == 'true' && <p className="meta" style={metaStyle}>
                                            {metaAuthor(author)}
                                            {metaDate(convertDate)}
                                            {metaCategory(categories)}
                                            {/* {metaComments(link, uagb_comment_info)} */}
                                        </p>}

                                        {postExcerpt(content)}

                                        {postReadMore(link)}
                                    </div>
                                </div>
                            </article>
                        );
                    })} {/* Single Posts */}
                </div> /* Grid Layout */ :


                    'masonry' == layout && <div id={`bBlocksMasonryPosts-${clientId}`} className="b_blocks_masonry_posts" style={masonryPostsStyle}>
                        {posts.map(post => {
                            const { id, date, featured_media, title, author, categories, content, link } = post;

                            const d = new Date(date);
                            const convertDate = `${getMonth[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

                            return (
                                <article div key={id} className="b_blocks_article" style={{ breakInside: 'avoid', marginBottom: `${rowGap}px` }}>
                                    <div className={`post_content ${shadow} rounded`} style={contentStyle}>
                                        {featureImg(link, featured_media)}

                                        <div className="post_text" style={postTextStyle}>
                                            {postTitle(link, title)}

                                            {metaShow == 'true' && <p className="meta" style={metaStyle}>
                                                {metaAuthor(author)}
                                                {metaDate(convertDate)}
                                                {metaCategory(categories)}
                                                {/* {metaComments(link, uagb_comment_info)} */}
                                            </p>}

                                            {postExcerpt(content)}

                                            {postReadMore(link)}
                                        </div>
                                    </div>
                                </article>
                            );
                        })} {/* Single Posts */}
                    </div> /* Masonry Layout */
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
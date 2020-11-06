const { registerBlockType } = wp.blocks;
const { withSelect } = wp.data;

const { InspectorControls, BlockControls, AlignmentToolbar, ColorPalette } = wp.blockEditor;
const { PanelBody, SelectControl, RangeControl, FontSizePicker, CheckboxControl, TextControl, Dashicon, ToggleControl, TabPanel, Spinner, Button, ButtonGroup, Tooltip } = wp.components;


// Variables
import options from '../../Const/options';
const { fontSizes, colors, aligns, fontWeights, textTransforms, layouts, postsOrdersBy, postsOrders, getMonth, shadows } = options;


// Functions
import func from '../../Const/functions';
const { firstTitle, otherTitle } = func;


// Icon
import icons from '../../Const/icons';


registerBlockType('b-blocks/posts', {
    // Build In attributes
    title: 'Posts',
    icon: icons.postEmbed,
    category: 'bBlocks',
    keywords: ['Specific Category Posts'],

    // Custom Attributes
    attributes: {
        selectedCategories: { type: 'array', default: [] },
        postsPerPageAll: { type: 'boolean', default: 'true' },
        postsPerPage: { type: 'number', default: 10 },
        postsOrderBy: { type: 'string', default: 'date' },
        postsOrder: { type: 'string', default: 'desc' },

        layout: { type: 'string', default: 'grid' },
        columns: { type: 'number', default: 3 },
        columnGap: { type: 'number', default: 15 },
        rowGap: { type: 'number', default: 30 },
        shadow: { type: 'string', default: 'shadow-lg' },

        contentAlign: { type: 'string', default: 'left' },
        contentEqualHight: { type: 'string', default: 'true' },
        contentBGColor: { type: 'string', default: '#fff' },
        postTextPTB: { type: 'number', default: 15 },
        postTextPLR: { type: 'number', default: 25 },

        featureImgShow: { type: 'string', default: 'true' },

        titleShow: { type: 'string', default: 'true' },
        titleFontSize: { type: 'number' },
        titleColor: { type: 'string', default: '#4527a4' },
        titleMB: { type: 'number', default: 15 },

        metaShow: { type: 'boolean', default: 'true' },
        metaAuthorShow: { type: 'boolean', default: 'true' },
        metaDateShow: { type: 'boolean', default: 'true' },
        metaCategoryShow: { type: 'boolean', default: 'true' },
        metaCommentShow: { type: 'boolean', default: 'false' },
        metaFontSize: { type: 'number', default: 13 },
        metaTransform: { type: 'string', default: 'uppercase' },
        metaTextColor: { type: 'string', default: '#333' },
        metaLinkColor: { type: 'string', default: '#8344c5' },
        metaIconColor: { type: 'string', default: '#4527a4' },
        metaMB: { type: 'number', default: 15 },

        excerptShow: { type: 'boolean', default: 'true' },
        excerptLength: { type: 'number', default: 25 },
        excerptAlign: { type: 'string', default: 'justify' },
        excerptFontSize: { type: 'number' },
        excerptColor: { type: 'string', default: '#333' },
        excerptMB: { type: 'number', default: 10 },

        readMoreShow: { type: 'boolean', default: 'true' },
        readMoreLabel: { type: 'string', default: 'Read More' },
        readMoreAlign: { type: 'string', default: 'right' },
        readMoreFontSize: { type: 'number', default: 14 },
        readMoreTransform: { type: 'string', default: 'capitalize' },
        readMoreFontWeight: { type: 'string', default: '600' },
        readMorePTB: { type: 'number', default: 8 },
        readMorePLR: { type: 'number', default: 25 },
        readMoreRadius: { type: 'number', default: 0 },
        readMoreTextColor: { type: 'string', default: '#fff' },
        readMoreBGColor: { type: 'string', default: '#4527a4' },
        readMoreTextHovColor: { type: 'string', default: '#fff' },
        readMoreBGHovColor: { type: 'string', default: '#8344c5' },
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
        };

    })(({ select, posts, categories, media, attributes, setAttributes }) => {
        const { selectedCategories, postsPerPageAll, postsPerPage, postsOrderBy, postsOrder, layout, columns, columnGap, rowGap, shadow, contentAlign, contentEqualHight, postTextPTB, postTextPLR, contentBGColor, featureImgShow, titleShow, titleFontSize, titleColor, titleMB, metaShow, metaAuthorShow, metaDateShow, metaCategoryShow, metaCommentShow, metaFontSize, metaTransform, metaTextColor, metaLinkColor, metaIconColor, metaMB, excerptShow, excerptLength, excerptAlign, excerptFontSize, excerptColor, excerptMB, readMoreShow, readMoreLabel, readMoreAlign, readMoreFontSize, readMoreTransform, readMoreFontWeight, readMorePTB, readMorePLR, readMoreRadius, readMoreTextColor, readMoreBGColor, readMoreTextHovColor, readMoreBGHovColor } = attributes;

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
        const postsStyle = { display: layout == 'grid' ? 'grid' : layout == 'masonry' ? 'block' : 'grid', columns: columns, gridTemplateColumns: `repeat(${columns}, 1fr)`, gridGap: `${rowGap}px ${columnGap}px` }

        const articleStyle = { breakInside: 'avoid', marginBottom: layout == 'masonry' ? `${rowGap}px` : '' }

        const articleInnerWrapStyle = { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: contentAlign, height: contentEqualHight == 'true' ? '100%' : 'auto', backgroundColor: contentBGColor }

        const postTextStyle = { padding: `${postTextPTB}px ${postTextPLR}px 0 ${postTextPLR}px` }

        const titleStyle = { textAlign: contentAlign, fontSize: `${titleFontSize}px`, color: titleColor, margin: `0 0 ${titleMB}px 0` }
        const metaStyle = { textAlign: contentAlign, fontSize: `${metaFontSize}px`, textTransform: metaTransform, color: metaTextColor, margin: `0 0 ${metaMB}px 0` }
        const excerptStyle = { textAlign: excerptAlign, fontSize: `${excerptFontSize}px`, color: excerptColor, margin: `0 0 ${excerptMB}px 0` }

        const readMoreWrapStyle = { textAlign: readMoreAlign, padding: `0 ${postTextPLR}px ${postTextPTB}px ${postTextPLR}px`, marginBottom: '10px' }
        const readMoreStyle = { display: 'inline-block', fontSize: `${readMoreFontSize}px`, textTransform: readMoreTransform, fontWeight: readMoreFontWeight, padding: `${readMorePTB}px ${readMorePLR}px`, borderRadius: `${readMoreRadius}px`, color: readMoreTextColor, backgroundColor: readMoreBGColor, transition: 'all .3s ease' }

        return [
            posts && posts.length !== 0 && <InspectorControls>
                {/* Posts Query */}
                <PanelBody title="Posts Query" initialOpen={true}>
                    {/* Select Categories */}
                    {categories && categories.length !== 0 ? <span>
                        {firstTitle('Select Categories:')}
                        {categories.map(cat => {
                            const isInc = selectedCategories.includes(cat.id);

                            return (
                                <CheckboxControl label={cat.name} key={cat.id} checked={isInc} onChange={cng => setAttributes({ selectedCategories: cng ? [...selectedCategories, cat.id] : selectedCategories.filter(id => id !== cat.id) })} />

                                // <span>{cat.name}</span>
                            );
                        })}
                    </span> : ''}

                    {/* Posts Per Page */}
                    {otherTitle('Post Per Page:')}
                    <ToggleControl label={postsPerPageAll == 'true' ? 'Show Some Posts' : 'Show All Posts'} checked={postsPerPageAll == 'true' ? true : false} onChange={cng => setAttributes({ postsPerPageAll: cng.toString() })} />

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


                {/* Layout Settings */}
                <PanelBody title="Layout Settings" initialOpen={false}>
                    {/* Layout Type */}
                    {firstTitle('Layout Type:')}
                    <SelectControl value={layout} onChange={cng => setAttributes({ layout: cng })} options={layouts} />

                    {/* Columns */}
                    {otherTitle('Columns:')}
                    <RangeControl value={columns} onChange={cng => setAttributes({ columns: cng })} min={1} max={6} step={1} />

                    {/* Column Gap */}
                    {otherTitle('Column Gap:')}
                    <RangeControl value={columnGap} onChange={cng => setAttributes({ columnGap: cng })} min={0} max={60} step={1} />

                    {/* Row Gap */}
                    {otherTitle('Row Gap:')}
                    <RangeControl value={rowGap} onChange={cng => setAttributes({ rowGap: cng })} min={0} max={100} step={1} />

                    {/* Article Shadow */}
                    {otherTitle('Article Shadow:')}
                    <SelectControl value={shadow} onChange={cng => setAttributes({ shadow: cng })} options={shadows} />
                </PanelBody>


                {/* Content Settings */}
                <PanelBody title="Content Settings" initialOpen={false}>
                    {/* Content Alignment */}
                    {firstTitle('Content Alignment:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(aligns).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} icon={obj.icon} isMedium isPrimary={contentAlign === obj.value} aria-pressed={contentAlign === obj.value} onClick={() => setAttributes({ contentAlign: obj.value })}></Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Content Height */}
                    {otherTitle('Content Height:')}
                    <ToggleControl label={contentEqualHight == 'true' ? 'Disable Equal Height' : 'Enable Equal Height'} checked={contentEqualHight == 'true' ? true : false} onChange={cng => setAttributes({ contentEqualHight: cng.toString() })} />

                    {/* Content Background Color */}
                    {otherTitle('Content Background Color:')}
                    <ColorPalette value={contentBGColor} onChange={cng => setAttributes({ contentBGColor: cng })} colors={colors} />

                    {/* Post Text Top Bottom Padding */}
                    {otherTitle('Post Text Top Bottom Padding:')}
                    <RangeControl value={postTextPTB} onChange={cng => setAttributes({ postTextPTB: cng })} min={0} max={50} step={1} />

                    {/* Post Text Left Right Padding */}
                    {otherTitle('Post Text Left Right Padding:')}
                    <RangeControl value={postTextPLR} onChange={cng => setAttributes({ postTextPLR: cng })} min={0} max={50} step={1} />
                </PanelBody>


                {/* Feature Image Settings */}
                <PanelBody title="Feature Image Settings" initialOpen={false}>
                    {/* Show/Hide Title */}
                    {firstTitle('Show/Hide Feature Image:')}
                    <ToggleControl label={featureImgShow == 'true' ? 'Hide Feature Image' : 'Show Feature Image'} checked={featureImgShow == 'true' ? true : false} onChange={cng => setAttributes({ featureImgShow: cng.toString() })} />
                </PanelBody>


                {/* Title Settings */}
                <PanelBody title="Title Settings" initialOpen={false}>
                    {/* Show/Hide Title */}
                    {firstTitle('Show/Hide Title:')}
                    <ToggleControl label={titleShow == 'true' ? 'Hide Title' : 'Show Title'} checked={titleShow == 'true' ? true : false} onChange={cng => setAttributes({ titleShow: cng.toString() })} />

                    {titleShow == 'true' && <span>
                        {/* Title Font Size */}
                        {otherTitle('Title Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} value={titleFontSize} onChange={cng => setAttributes({ titleFontSize: cng })} />

                        {/* Title Color */}
                        {otherTitle('Title Color:')}
                        <ColorPalette value={titleColor} onChange={cng => setAttributes({ titleColor: cng })} colors={colors} />

                        {/* Title Bottom Margin */}
                        {otherTitle('Title Bottom Margin:')}
                        <RangeControl value={titleMB} onChange={cng => setAttributes({ titleMB: cng })} min={0} max={50} step={1} />
                    </span>}
                </PanelBody>


                {/* Meta Data Settings */}
                <PanelBody title="Meta Data Settings" initialOpen={false}>
                    {/* Show/Hide Meta Data */}
                    {firstTitle('Show/Hide Meta Data:')}
                    <ToggleControl label={metaShow == 'true' ? 'Hide Meta Data' : 'Show Meta Data'} checked={metaShow == 'true' ? true : false} onChange={cng => setAttributes({ metaShow: cng.toString() })} />

                    {metaShow == 'true' && <span>
                        {/* Show/Hide Author */}
                        {otherTitle('Show/Hide Author:')}
                        <ToggleControl label={metaAuthorShow == 'true' ? 'Hide Author' : 'Show Author'} checked={metaAuthorShow == 'true' ? true : false} onChange={cng => setAttributes({ metaAuthorShow: cng.toString() })} />

                        {/* Show/Hide Date */}
                        {otherTitle('Show/Hide Date:')}
                        <ToggleControl label={metaDateShow == 'true' ? 'Hide Date' : 'Show Date'} checked={metaDateShow == 'true' ? true : false} onChange={cng => setAttributes({ metaDateShow: cng.toString() })} />

                        {/* Show/Hide Category */}
                        {otherTitle('Show/Hide Category:')}
                        <ToggleControl label={metaCategoryShow == 'true' ? 'Hide Category' : 'Show Category'} checked={metaCategoryShow == 'true' ? true : false} onChange={cng => setAttributes({ metaCategoryShow: cng.toString() })} />

                        {/* Show/Hide Comment */}
                        {otherTitle('Show/Hide Comment:')}
                        <ToggleControl label={metaCommentShow == 'true' ? 'Hide Comment' : 'Show Comment'} checked={metaCommentShow == 'true' ? true : false} onChange={cng => setAttributes({ metaCommentShow: cng.toString() })} />


                        {/* Meta Data Font Size */}
                        {otherTitle('Meta Data Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} value={metaFontSize} onChange={cng => setAttributes({ metaFontSize: cng })} />

                        {/* Meta Data Text Transform */}
                        {otherTitle('Meta Data Text Transform:')}
                        <ButtonGroup className="b_blocks_button_groups">
                            {Object.values(textTransforms).map(obj => (
                                <Tooltip text={obj.label} position="top">
                                    <Button key={obj.value} isMedium isPrimary={metaTransform === obj.value} aria-pressed={metaTransform === obj.value} onClick={() => setAttributes({ metaTransform: obj.value })}>{obj.icon}</Button>
                                </Tooltip>
                            ))}
                        </ButtonGroup>

                        {/* Meta Data Text Color */}
                        {otherTitle('Meta Data Text Color:')}
                        <ColorPalette value={metaTextColor} onChange={cng => setAttributes({ metaTextColor: cng })} colors={colors} />

                        {/* Meta Data Link Color */}
                        {otherTitle('Meta Data Link Color:')}
                        <ColorPalette value={metaLinkColor} onChange={cng => setAttributes({ metaLinkColor: cng })} colors={colors} />

                        {/* Meta Data Icon Color */}
                        {otherTitle('Meta Data Icon Color:')}
                        <ColorPalette value={metaIconColor} onChange={cng => setAttributes({ metaIconColor: cng })} colors={colors} />

                        {/* Meta Data Bottom Margin */}
                        {otherTitle('Meta Data Bottom Margin:')}
                        <RangeControl value={metaMB} onChange={cng => setAttributes({ metaMB: cng })} min={0} max={50} step={1} />
                    </span>}
                </PanelBody>


                {/* Excerpt Settings */}
                <PanelBody title="Excerpt Settings" initialOpen={false}>
                    {/* Show/Hide Excerpt */}
                    {firstTitle('Show/Hide Excerpt:')}
                    <ToggleControl label={excerptShow == 'true' ? 'Hide Excerpt' : 'Show Excerpt'} checked={excerptShow == 'true' ? true : false} onChange={cng => setAttributes({ excerptShow: cng.toString() })} />

                    {excerptShow == 'true' && <span>
                        {/* Excerpt Length */}
                        {otherTitle('Excerpt Length:')}
                        <RangeControl value={excerptLength} onChange={cng => setAttributes({ excerptLength: cng })} min={0} max={100} step={1} />

                        {/* Excerpt Alignment */}
                        {otherTitle('Excerpt Alignment:')}
                        <ButtonGroup className="b_blocks_button_groups">
                            {Object.values(aligns).map(obj => (
                                <Tooltip text={obj.label} position="top">
                                    <Button key={obj.value} icon={obj.icon} isMedium isPrimary={excerptAlign === obj.value} aria-pressed={excerptAlign === obj.value} onClick={() => setAttributes({ excerptAlign: obj.value })}></Button>
                                </Tooltip>
                            ))}
                        </ButtonGroup>

                        {/* Excerpt Font Size */}
                        {otherTitle('Excerpt Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} value={excerptFontSize} onChange={cng => setAttributes({ excerptFontSize: cng })} />

                        {/* Excerpt Color */}
                        {otherTitle('Excerpt Color:')}
                        <ColorPalette value={excerptColor} onChange={cng => setAttributes({ excerptColor: cng })} colors={colors} />

                        {/* Excerpt Bottom Margin */}
                        {otherTitle('Excerpt Bottom Margin:')}
                        <RangeControl value={excerptMB} onChange={cng => setAttributes({ excerptMB: cng })} min={0} max={50} step={1} />
                    </span>}
                </PanelBody>

                {/* Read More Link Settings */}
                <PanelBody title="Read More Link Settings" initialOpen={false}>
                    {/* Show/Hide Read More Link */}
                    {firstTitle('Show/Hide Read More Link:')}
                    <ToggleControl label={readMoreShow == 'true' ? 'Hide Read More Link' : 'Show Read More Link'} checked={readMoreShow == 'true' ? true : false} onChange={cng => setAttributes({ readMoreShow: cng.toString() })} />

                    {readMoreShow == 'true' && <span>
                        {/* Read More Link Label */}
                        {otherTitle('Read More Link Label:')}
                        <TextControl label="Read More Link Label" value={readMoreLabel} onChange={cng => setAttributes({ readMoreLabel: cng })} />

                        {/* Read More Link Alignment */}
                        {otherTitle('Read More Link Alignment:')}
                        <ButtonGroup className="b_blocks_button_groups">
                            {Object.values(aligns).map(obj => (
                                <Tooltip text={obj.label} position="top">
                                    <Button key={obj.value} icon={obj.icon} isMedium isPrimary={readMoreAlign === obj.value} aria-pressed={readMoreAlign === obj.value} onClick={() => setAttributes({ readMoreAlign: obj.value })}></Button>
                                </Tooltip>
                            ))}
                        </ButtonGroup>

                        {/* Read More Link Font Size */}
                        {otherTitle('Read More Link Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} value={readMoreFontSize} onChange={cng => setAttributes({ readMoreFontSize: cng })} />

                        {/* Read More Link Text Transform */}
                        {otherTitle('Read More Link Text Transform:')}
                        <ButtonGroup className="b_blocks_button_groups">
                            {Object.values(textTransforms).map(obj => (
                                <Tooltip text={obj.label} position="top">
                                    <Button key={obj.value} isMedium isPrimary={readMoreTransform === obj.value} aria-pressed={readMoreTransform === obj.value} onClick={() => setAttributes({ readMoreTransform: obj.value })}>{obj.icon}</Button>
                                </Tooltip>
                            ))}
                        </ButtonGroup>

                        {/* Read More Link Font Weight */}
                        {otherTitle('Read More Link Font Weight:')}
                        <SelectControl value={readMoreFontWeight} onChange={cng => setAttributes({ readMoreFontWeight: cng })} options={fontWeights} />

                        {/* Read More Link Top Bottom Padding */}
                        {otherTitle('Read More Link Top Bottom Padding:')}
                        <RangeControl value={readMorePTB} onChange={cng => setAttributes({ readMorePTB: cng })} min={0} max={50} step={1} />

                        {/* Read More Link Left Right Padding */}
                        {otherTitle('Read More Link Left Right Padding:')}
                        <RangeControl value={readMorePLR} onChange={cng => setAttributes({ readMorePLR: cng })} min={0} max={150} step={1} />

                        {/* Read More Link Border Radius */}
                        {otherTitle('Read More Link Border Radius:')}
                        <RangeControl value={readMoreRadius} onChange={cng => setAttributes({ readMoreRadius: cng })} min={0} max={50} step={1} />
                    </span>}

                    {otherTitle('Read More Link Colors:')}
                    <TabPanel className="b_blocks_tab_panel" activeClass="active-tab"
                        tabs={[{ name: 'normal', title: 'Normal', className: 'normal-tab' }, { name: 'hover', title: 'Hover', className: 'hover-tab', }]}>
                        {tab => {
                            return <span>
                                {'normal' == tab.name && <span>
                                    {/* Read More Text Color */}
                                    {otherTitle('Read More Text Color:')}
                                    <ColorPalette value={readMoreTextColor} onChange={cng => setAttributes({ readMoreTextColor: cng })} colors={colors} />

                                    {/* Read More Background Color */}
                                    {otherTitle('Read More Background Color:')}
                                    <ColorPalette value={readMoreBGColor} onChange={cng => setAttributes({ readMoreBGColor: cng })} colors={colors} />
                                </span>}

                                {'hover' == tab.name && <span>
                                    {/* Read More Text Hover Color */}
                                    {otherTitle('Read More Text Hover Color:')}
                                    <ColorPalette value={readMoreTextHovColor} onChange={cng => setAttributes({ readMoreTextHovColor: cng })} colors={colors} />

                                    {/* Read More Background Hover Color */}
                                    {otherTitle('Read More Background Hover Color:')}
                                    <ColorPalette value={readMoreBGHovColor} onChange={cng => setAttributes({ readMoreBGHovColor: cng })} colors={colors} />
                                </span>}
                            </span>
                        }}
                    </TabPanel>
                </PanelBody>
            </InspectorControls>,


            posts && posts.length !== 0 ? <div className="b_blocks_posts" style={postsStyle}>
                <BlockControls>
                    <AlignmentToolbar value={contentAlign} onChange={cng => setAttributes({ contentAlign: cng })} />
                </BlockControls>


                {posts.map(post => {
                    const { id, date, featured_media, title, uagb_author_info, categories, uagb_comment_info, content, link, _links } = post;

                    const d = new Date(date);
                    const convertDate = `${getMonth[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

                    const readMoreHov = e => {
                        e.target.style.color = readMoreTextHovColor;
                        e.target.style.backgroundColor = readMoreBGHovColor;
                    }

                    const readMoreHovLeave = e => {
                        e.target.style.color = readMoreTextColor;
                        e.target.style.backgroundColor = readMoreBGColor;
                    }

                    return (
                        <article div key={id} className="b_blocks_article" style={articleStyle}>
                            <div className={`b_blocks_article_inner_wrap ${shadow} rounded`} style={articleInnerWrapStyle}>
                                <div className="post_content">
                                    {featureImgShow == 'true' && featured_media > 0 && <div div className="feature_img">
                                        {media(featured_media) && <a href={link} target="_blank"><img src={media(featured_media).source_url} alt={media(featured_media).caption.rendered} /></a>}
                                    </div>}

                                    <div className="post_text" style={postTextStyle}>
                                        {titleShow == 'true' && <h3 className="title" style={titleStyle}><a href={link} target="_blank" style={{ color: titleColor }}>{title.rendered}</a></h3>}

                                        {metaShow == 'true' && <p className="meta" style={metaStyle}>
                                            {metaAuthorShow == 'true' && <span>
                                                <Dashicon icon="admin-users" style={{ color: metaIconColor }} />&nbsp;
                                                <a href={uagb_author_info.author_link} target="_blank" style={{ color: metaLinkColor }}>{uagb_author_info.display_name}</a>
                                            </span>}

                                            {metaDateShow == 'true' && <span>
                                                <Dashicon icon="calendar" style={{ color: metaIconColor }} />&nbsp;
                                                <span style={{ color: metaTextColor }}>{convertDate}</span>
                                            </span>}

                                            {metaCategoryShow == 'true' && <span>
                                                <Dashicon icon="category" style={{ color: metaIconColor }} />&nbsp;
                                                <span style={{ color: metaLinkColor }}>{renderHTML(categories.map(id => `${singleCat(id)}`))}</span>
                                            </span>}

                                            {metaCommentShow == 'true' && <span>
                                                <Dashicon icon="admin-comments" style={{ color: metaIconColor }} />&nbsp;
                                                <a href={`${link}/#comments`} target="_blank" style={{ color: metaLinkColor }}>{uagb_comment_info === 0 ? "No Comments" : uagb_comment_info === 1 ? "1 Comment" : `${uagb_comment_info} Comments`}</a>
                                            </span>}
                                        </p>}

                                        {excerptShow == 'true' && <div className="excerpt" style={excerptStyle}>{renderHTML(truncate(content.rendered, excerptLength))}</div>}

                                    </div>
                                </div>

                                {readMoreShow == 'true' && <div className="read_more" style={readMoreWrapStyle}><a href={link} target="_blank" style={readMoreStyle} onMouseEnter={readMoreHov} onMouseLeave={readMoreHovLeave}>{readMoreLabel}</a></div>}
                            </div>
                        </article>
                    );
                })}
            </div> : <h3 style={{ color: '#4527a4', textAlign: 'center' }}>No posts found!! Please add some posts</h3>
        ];
    }),

    save: () => null,

    example: {
        attributes: {
            'preview': true,
        },
    },
});
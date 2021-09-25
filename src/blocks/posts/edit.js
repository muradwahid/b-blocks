import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { Spinner } from '@wordpress/components';

import Settings from './settings';

// Components
import Default from './Layout/Default';
import SideImage from './Layout/SideImage';
import func from '../../Const/functions';
const { mediaUrl } = func;

const Edit = props => {
    const { attributes, setAttributes, className, clientId, getPostTypes, posts, categories } = props;

    const { layout, columns, columnGap, rowGap, isContentEqualHight, contentAlign, contentBG, contentPadding, border, isFImg, isTitleLink, titleTypo, titleColor, titleMargin, metaTypo, metaTextColor, metaLinkColor, metaIconColor, metaMargin, excerptAlign, excerptTypo, excerptColor, excerptMargin, readMoreAlign, readMoreTypo, readMoreColors, readMoreHovColors, readMorePadding, readMoreBorder } = attributes;

    // Posts and Categories Check
    if (!posts || !categories) {
        return <h3 className='bBlocksLoading'><Spinner /> {__('Loading...', 'b-blocks')}</h3>;
    }

    // Update clientId
    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]);

    // Components
    const noPosts = () => <h3 className='bBlocksNoPosts'>{__('No posts found!! Please add some posts', 'b-blocks')}</h3>;

    return posts && 0 !== posts.length ? <>
        <Settings settings={props} getPostTypes={getPostTypes} categories={categories} />

        <div className={`${className} bBlocksPosts`} id={`bBlocksPosts-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${titleTypo?.googleFontLink || 'https://fonts.googleapis.com/css2?family=Roboto&display=swap'}); @import url(${metaTypo?.googleFontLink}); @import url(${excerptTypo?.googleFontLink}); @import url(${readMoreTypo?.googleFontLink});

                #bBlocksPosts-${clientId} .bBlocksPost{
                    margin-bottom: ${'masonry' === layout ? `${rowGap}px` : '0px'};
                    ${border?.styles || 'border: 1px solid #4527a400; border-radius: 5px;'}
                }
                #bBlocksPosts-${clientId} .bBlocksPostDefault, #bBlocksPosts-${clientId} .bBlocksPostSideImage{
                    text-align: ${contentAlign};
                    ${contentBG?.styles || 'background-color: #f4f2fc;'}
                }

                #bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostText{ padding: ${contentPadding?.styles || '20px 25px'}; }

                #bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostTitle{
                    text-align: ${contentAlign};
                    ${!isTitleLink ? titleTypo?.styles || 'font-family: Roboto, sans-serif; font-size: 25px;' : ''}
                    color: ${titleColor};
                    margin: ${titleMargin?.styles || '0 0 15px 0'};
                }
                #bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostTitle a{
                    ${titleTypo?.styles || 'font-family: Roboto, sans-serif; font-size: 25px;'}
                    color: ${titleColor};
                }
                #bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostMeta{
                    text-align: ${contentAlign};
                    ${metaTypo?.styles || 'font-size: 13px; text-transform: uppercase;'}
                    color: ${metaTextColor};
                    margin: ${metaMargin?.styles || '0 0 15px 0'};
                }
                #bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostMeta a{ color: ${metaLinkColor}; }
                #bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostMeta .dashicons{ color: ${metaIconColor}; }
                #bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostFImgCats{ ${metaTypo?.styles || 'font-size: 13px; text-transform: uppercase;'} }
                #bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostExcerpt{
                    text-align: ${excerptAlign};
                    ${excerptTypo?.styles || 'font-size: 15px;'}
                    color: ${excerptColor};
                    margin: ${excerptMargin?.styles || '0 0 10px 0'};
                }
                #bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostReadMore{ text-align: ${readMoreAlign}; }
                #bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostReadMore a{
                    ${readMoreTypo?.styles || 'font-size: 14px; text-transform: uppercase; font-weight: 600;'}
                    ${readMoreColors?.styles || 'color: #fff; background: #8344c5;'}
                    padding: ${readMorePadding?.styles || '12px 35px'};
                    ${readMoreBorder?.styles || 'border-radius: 3px;'}
                }
                #bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostReadMore a:hover{ ${readMoreHovColors?.styles || 'color: #fff; background: #4527a4;'} }

                #bBlocksPosts-${clientId} .bBlocksGridPosts{
                    grid-gap: ${rowGap}px ${columnGap}px;
                    align-items: ${false === isContentEqualHight ? 'start' : 'initial'};
                }
                #bBlocksPosts-${clientId} .bBlocksMasonryPosts{ gap: ${columnGap}px; }
            `}} />
            <style>
                {posts.map(post => {
                    const { id, featured_media } = post;
                    const fImgUrl = mediaUrl(featured_media);

                    const sideImgCSS = `#bBlocksPosts-${clientId} .bBlocksPostSideImage.bBlocksPost-${id}{ display: ${fImgUrl ? 'grid' : 'flex'}; }`;
                    const fImgCSS = isFImg && fImgUrl ? `#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostFImg-${id}{ background-image: url(${fImgUrl}); }` : '';

                    return sideImgCSS + fImgCSS;
                })}
            </style>

            {'grid' === layout ? <div className={`bBlocksGridPosts columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
                <MapPosts attributes={{ clientId, ...attributes }} posts={posts} />
            </div> /* Grid Layout */ :

                'masonry' === layout && <div className={`bBlocksMasonryPosts cols-${columns.desktop} cols-tablet-${columns.tablet} cols-mobile-${columns.mobile}`}>
                    <MapPosts attributes={{ clientId, ...attributes }} posts={posts} />
                </div> /* Masonry Layout */}
        </div> </> : noPosts();
}
export default withSelect((select, props) => {
    const { postType, selectedCategories, isPostsPerPageAll, postsPerPage, postsOrderBy, postsOrder } = props.attributes;

    const query = {
        categories: selectedCategories,
        per_page: isPostsPerPageAll ? -1 : postsPerPage, // -1 to display all
        orderby: postsOrderBy,
        order: postsOrder,
    }

    return {
        getPostTypes: select('core').getPostTypes()?.filter(p => 'page' !== p.slug && 'attachment' !== p.slug && 'wp_block' !== p.slug && 'wp_template' !== p.slug)?.map(p => {
            return { label: p.name, value: p.slug }
        }),
        posts: select('core').getEntityRecords('postType', postType, query),
        categories: select('core').getEntityRecords('taxonomy', 'category', { post_type: postType }),
        media: id => select('core').getMedia(id),
        authors: select('core').getAuthors()
    };
})(Edit);


const MapPosts = ({ attributes, posts }) => {
    const { subLayout } = attributes;

    return posts.map(post => (
        'default' === subLayout || 'title-meta' === subLayout ? <Default atts={attributes} post={post} /> :
            'left-image' === subLayout || 'right-image' === subLayout ? <SideImage atts={attributes} post={post} /> :
                <p>{__('Please, select a sub layout', 'b-blocks')}</p>
    ));
}
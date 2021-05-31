import PostMetaAuthor from './PostMetaAuthor';
import PostMetaDate from './PostMetaDate';
import PostMetaCategory from './PostMetaCategory';
import PostMetaComment from './PostMetaComment';

const PostMeta = ({ atts, post }) => {
    const { contentAlign, isMeta, metaFontSize, metaTransform, metaTextColor, metaMB } = atts;

    return (
        'true' == isMeta && <div className={`bBlocksPostMeta text-${contentAlign} fontSize-${metaFontSize} ttr-${metaTransform} mb-${metaMB}`} style={{ color: metaTextColor }}>
            <PostMetaAuthor atts={atts} post={post} />
            <PostMetaDate atts={atts} post={post} />
            <PostMetaCategory atts={atts} post={post} />
            <PostMetaComment atts={atts} post={post} />
        </div>
    );
};
export default PostMeta;
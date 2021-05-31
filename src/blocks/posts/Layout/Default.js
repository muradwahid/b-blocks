// Components
import FeatureImage from '../Single/FeatureImage';
import PostTitle from '../Single/PostTitle';
import PostExcerpt from '../Single/PostExcerpt';
import PostReadMore from '../Single/PostReadMore';
import PostMeta from '../Single/PostMeta';

const Default = ({ atts, post }) => {
    const { layout, rowGap, contentAlign, contentBGColor, postTextPTB, postTextPLR, borderColor } = atts;

    return (
        <article className={`bBlocksPostArticle text-${contentAlign} ${'masonry' == layout ? `mb-${rowGap}` : ''}`} style={{ backgroundColor: contentBGColor, border: `1px solid ${borderColor}` }}>
            <FeatureImage atts={atts} post={post} />

            <div className={`bBlocksPostText ptb-${postTextPTB} plr-${postTextPLR}`}>
                <PostTitle atts={atts} post={post} />

                <PostMeta atts={atts} post={post} />

                <PostExcerpt atts={atts} post={post} />
                <PostReadMore atts={atts} post={post} />
            </div>
        </article>
    );
};
export default Default;
import { Fragment } from '@wordpress/element';

// Components
import FeatureImage from '../Single/FeatureImage';
import PostTitle from '../Single/PostTitle';
import PostExcerpt from '../Single/PostExcerpt';
import PostReadMore from '../Single/PostReadMore';
import PostMeta from '../Single/PostMeta';

const Default = ({ atts, post }) => {
    const { subLayout } = atts;
    const { id } = post;

    return <article className={`bBlocksPost bBlocksPost-${id} bBlocksPostDefault`}>
        <FeatureImage atts={atts} post={post} />

        <div className='bBlocksPostText'>
            <PostTitle atts={atts} post={post} />

            <PostMeta atts={atts} post={post} />

            {'title-meta' !== subLayout && <Fragment>
                <PostExcerpt atts={atts} post={post} />
                <PostReadMore atts={atts} post={post} />
            </Fragment>}
        </div>
    </article>;
};
export default Default;
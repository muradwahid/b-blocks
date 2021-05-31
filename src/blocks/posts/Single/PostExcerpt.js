// Functions
import func from '../../../Const/functions';
const { truncate, renderHTML } = func;

const PostExcerpt = props => {
    const { atts: { isExcerpt, excerptLength, excerptAlign, excerptFontSize, excerptColor, excerptMB }, post: { content } } = props;

    return (
        'true' == isExcerpt ? <div className={`bBlocksPostExcerpt b_blocks_inner_content text-${excerptAlign} fontSize-${excerptFontSize} mb-${excerptMB}`} style={{ color: excerptColor }}>{renderHTML(truncate(content.rendered, excerptLength))}</div> : null
    );
};
export default PostExcerpt;
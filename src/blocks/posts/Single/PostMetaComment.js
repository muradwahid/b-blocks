import { Dashicon } from '@wordpress/components';

const PostMetaComment = props => {
    const { atts: { isMetaComment, metaLinkColor, metaIconColor }, post: { link, wbComment } } = props;

    return (
        'true' == isMetaComment ? <span>
            <Dashicon icon='admin-comments' className='alignSelf-flex-end' style={{ color: metaIconColor }} />&nbsp;
            <a href={`${link}#comments`} target='_blank' rel='noreferrer noopener' style={{ color: metaLinkColor }}>{wbComment}</a>
        </span> : null
    );
};
export default PostMetaComment;
const MetaComment = ({ post, attributes }) => {
	const { link, title, commentCount, commentStatus } = post;
	const { isMetaComment, metaCommentIcon } = attributes;

	return (isMetaComment && 'open' === commentStatus) ? <span>
		{metaCommentIcon ?
			<img src={metaCommentIcon} alt='Author' /> :
			<span className='dashicons dashicons-admin-comments' />}

		<a href={`${link}/#comments`} target='_blank' rel='noreferrer' aria-label={`Comments of ${title}`}>{commentCount}</a>
	</span> : null;
};
export default MetaComment;
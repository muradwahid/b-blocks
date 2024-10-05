const PostMetaDate = ({ post, attributes }) => {
	const { date } = post;
	const { isMetaDate, metaDateIcon } = attributes;

	return (isMetaDate && date) ? <span>
		{metaDateIcon ?
			<img src={metaDateIcon} alt='Date' /> :
			<span className='dashicons dashicons-calendar-alt' />}

		<span>{date}</span>
	</span> : null;
};
export default PostMetaDate;
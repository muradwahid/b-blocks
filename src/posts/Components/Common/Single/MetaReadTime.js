const MetaReadTime = ({ post, attributes }) => {
	const { readTime, content } = post;
	const { isMetaReadTime, metaReadTimeIcon, isMetaReadTimeSec, metaReadTimeLabel } = attributes;

	const readTimeText = isMetaReadTimeSec ? `${readTime?.min}:${readTime?.sec}` : readTime?.min;

	return (isMetaReadTime && content) ? <span>
		{metaReadTimeIcon ?
			<img src={metaReadTimeIcon} alt='Author' /> :
			<span className='dashicons dashicons-clock' />}

		<span>{readTimeText} {metaReadTimeLabel}</span>
	</span> : null;
};
export default MetaReadTime;
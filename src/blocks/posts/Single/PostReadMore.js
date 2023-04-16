const PostReadMore = ({ post, attributes }) => {
	const { link } = post;
	const { isReadMore, readMoreLabel, isLinkNewTab } = attributes;

	return isReadMore ? <div className='bBlocksPostReadMore'>
		<a href={link} target={isLinkNewTab ? '_blank' : '_self'} rel='noreferrer' dangerouslySetInnerHTML={{ __html: readMoreLabel }} />
	</div> : null;
};
export default PostReadMore;
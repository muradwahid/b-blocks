const
	ReadMore = ({ post, attributes }) => {
		const { link } = post;
		const { isReadMore, readMorePosition = 'auto', readMoreLabel, isLinkNewTab } = attributes;

		return isReadMore ? <div className={`bBlocksReadMore ${readMorePosition}`}>
			<a href={link} target={isLinkNewTab ? '_blank' : '_self'} rel='noreferrer' dangerouslySetInnerHTML={{ __html: readMoreLabel }} aria-label={readMoreLabel} />
		</div> : null;
	};
export default
	ReadMore;
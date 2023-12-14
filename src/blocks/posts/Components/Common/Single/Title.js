const Title = ({ post, attributes }) => {
	const { link, title } = post;
	const { isTitle, isTitleLink, isLinkNewTab } = attributes;

	return isTitle ? <>
		{isTitleLink ?
			<h3 className='bBlocksTitle'>
				<a href={link} target={isLinkNewTab ? '_blank' : '_self'} rel='noreferrer' dangerouslySetInnerHTML={{ __html: title }} aria-label={title} />
			</h3> :
			<h3 className='bBlocksTitle' dangerouslySetInnerHTML={{ __html: title }} />}
	</> : null;
};
export default Title;
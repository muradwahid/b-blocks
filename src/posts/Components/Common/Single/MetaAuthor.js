const MetaAuthor = ({ post, attributes }) => {
	const { author } = post;
	const { name, link } = author || {};
	const { isMetaAuthor, isMetaAuthorLink = true, metaAuthorIcon } = attributes;

	return (isMetaAuthor && name) ? <span>
		{metaAuthorIcon ?
			<img src={metaAuthorIcon} alt='Author' /> :
			<span className='dashicons dashicons-admin-users' />}

		{!isMetaAuthorLink ?
			<span>{name}</span> :
			<a href={link} target='_blank' rel='noreferrer' aria-label={name}>{name}</a>}
	</span> : null;
};
export default MetaAuthor;
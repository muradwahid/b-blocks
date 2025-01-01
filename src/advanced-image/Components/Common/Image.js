const Image = ({ image, link }) => {
	const { url, alt, title } = image || {};

	return <LinkProvider link={link}>
		{url && <img src={url} alt={alt || title} />}
	</LinkProvider>
}
export default Image;

const LinkProvider = (link = {}, children) => {
	const { url = '', tab = '_self' } = link;

	return url ? <a href={url} target={tab}>{children}</a> : children;
}
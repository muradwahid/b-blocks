const Image = ({ image, link, isBackend = false }) => {
	const { url, alt, title } = image || {};

	return url && <LinkProvider link={link} isBackend={isBackend}>
		<img src={url} alt={alt || title} />
	</LinkProvider>
}
export default Image;

const LinkProvider = ({ link = {}, children, isBackend }) => {
	const { url = '', tab = '_self' } = link;

	return (url && !isBackend) ? <a href={url} target={tab}>{children}</a> : children;
}
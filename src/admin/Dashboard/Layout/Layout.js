import Content from '../Parts/Content';
import Header from '../Parts/Header';

const Layout = ({ children }) => {
	const navigation = [
		{ name: 'Welcome', href: '/welcome' },
		{ name: 'Blocks', href: '/blocks' },
		{ name: 'In Dev', href: '/inDev' },
		{ name: 'Popular Plugin', href: '/popularPlugin' }
	]

	return <>
		<Header navigation={navigation} />
		<Content>{children}</Content>
	</>
}
export default Layout;
import Content from '../Parts/Content';
import Header from '../Parts/Header';

const Layout = ({ info, children }) => {
	const navigation = [
		{ name: 'Welcome', href: '/welcome' },
		{ name: 'Blocks', href: '/blocks' },
		{ name: 'Custom Cursor and Click Effects', href: '/cursor' },
		{ name: 'In Dev', href: '/inDev' },
		// { name: 'Our Other Popular Plugins', href: '/popularPlugin' }
	]

	return <>
		<Header info={info} navigation={navigation} />
		<Content>{children}</Content>
	</>
}
export default Layout;
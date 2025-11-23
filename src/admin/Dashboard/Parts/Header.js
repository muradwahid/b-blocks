import { NavLink } from 'react-router-dom';
// https://ps.w.org/b-blocks/assets/icon-128x128.png?rev=3342212
const Header = ({ info, navigation }) => {
	return <div className='bPlDashboardHeader'>
		<div className='pluginInfo'>
			<div className='name'>
				{/* ?rev=3385620 */}
				<img src='https://ps.w.org/b-blocks/assets/icon-128x128.png' alt='B Blocks Logo' />
				<h1> B Blocks </h1>
			</div>

			<div className='version'> v{info?.version} </div>
		</div>

		<div className='navLinks'>
			{navigation.map((item, index) => <NavLink key={index} to={item.href} className={`link ${({ isActive }) => isActive ? 'active' : ''}`}>
				{item.name}
			</NavLink>)}
		</div>
	</div>
};
export default Header;
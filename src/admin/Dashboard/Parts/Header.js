import { NavLink } from 'react-router-dom';

const Header = ({ navigation }) => {
	return <div className='bPlDashboardHeader'>
		<div className='pluginInfo'>
			<div className='name'>
				<img src='https://ps.w.org/b-blocks/assets/icon-128x128.png' alt='B Blocks Logo' />
				<h1> B Blocks </h1>
			</div>

			<div className='version'> v1.9.6 </div>
		</div>

		<div className='navLinks'>
			{navigation.map((item, index) => <NavLink key={index} to={item.href} className={`link ${({ isActive }) => isActive ? 'active' : ''}`}>
				{item.name}
			</NavLink>)}
		</div>
	</div>
};
export default Header;
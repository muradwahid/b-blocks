import { __ } from '@wordpress/i18n';
import { TabPanel } from '@wordpress/components';

import { pageCategories, patternCategories } from '../utils/options';


const Sidebar = ({ type, setType, category, setCategory, setSearch, setItemsDisplayed, itemsPerPage }) => {
	const handleSearch = (event) => {
		setSearch(event.target.value);
		setItemsDisplayed(itemsPerPage);
	};

	const categories = 'pages' === type ? pageCategories : patternCategories;

	return (
		<aside className='modalBodySidebar'>
			<div className='modalBodySidebarSearch'>
				<input type='text' placeholder='Search' onChange={handleSearch} />

				<svg onClick={handleSearch} xmlns='http://www.w3.org/2000/svg' height='16' width='16' viewBox='0 0 512 512'>
					<path d='M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z' />
				</svg>
			</div>

			<TabPanel
				className='bPlTabPanel'
				activeClass='activeTab'
				tabs={[
					// { name: 'pages', title: __('Pages', 'b-blocks') },
					{ name: 'patterns', title: __('Patterns', 'b-blocks') }
				]}
				onSelect={tabName => {
					setType(tabName);
					setCategory('all');
					setItemsDisplayed(itemsPerPage);
				}}
			>
				{() => <li className='modalBodySidebarCategories'>
					{categories.map((cat, i) => <li onClick={() => {
						setCategory(cat.name);
						setItemsDisplayed(itemsPerPage);
					}} className={`libraryBtn ${cat.name === category ? 'active' : ''}`} key={i}>{cat.label}</li>)}
				</li>}
			</TabPanel>
		</aside>
	);
};

export default Sidebar;
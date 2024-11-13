import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { TabPanel, Spinner } from '@wordpress/components';

import { debounce } from '../../../../../bpl-tools/utils/functions';

const Sidebar = ({ isPremium, show, setShow, main, mainLoading, templates, refetchTemplates, templatesLoading, type, setType, category, setCategory, pageNumber, setPageNumber, search, setSearch }) => {

	const handleSearch = useMemo(() => debounce((sq) => {
		setSearch(sq);
	}, 600), [search]);

	const handleInputChange = (e) => {
		const sq = e.target.value;
		handleSearch(sq);
	};

	const { 'patterns-category': patternsCats = [], 'pages-category': pagesCats = [], type: types = [] } = main || {};

	const cats = 'pages' === type ? pagesCats : patternsCats;
	const categories = [{ label: 'All', name: 'all' }, ...cats.filter(c => 'pro' !== c.name)];

	return (
		<aside className='modalBodySidebar'>
			<div className='modalBodySidebarSearch'>
				<input type='text' placeholder='Search' onChange={handleInputChange} />

				<svg onClick={handleInputChange} xmlns='http://www.w3.org/2000/svg' height='16' width='16' viewBox='0 0 512 512'>
					<path d='M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z' />
				</svg>
			</div>


			<li className='modalBodySidebarCategories'>
				{mainLoading ? <div className='bPlPlaceCenter'>
					<Spinner className='bPlSpinner' />
				</div> :
					categories.map(({ name, label }, i) => <li onClick={() => {
						setCategory(name);
						setPageNumber(1);
					}} className={`libraryBtn ${name === category ? 'active' : ''}`} key={i}>{label}</li>)}
			</li>
			{/* <TabPanel
					className='bPlTabPanel'
					activeClass='activeTab'
					tabs={types.map(t => ({ ...t, title: t.label })).filter(t => 'pages' !== t.name)}
					onSelect={tabName => {
						setType(tabName);
						setCategory('all');
						setPageNumber(1);
					}}
				>
					{() => <li className='modalBodySidebarCategories'>
						{categories.map(({ name, label }, i) => <li onClick={() => {
							setCategory(name);
							setPageNumber(1);
						}} className={`libraryBtn ${name === category ? 'active' : ''}`} key={i}>{label}</li>)}
					</li>}
				</TabPanel> */}
		</aside>
	);
};
export default Sidebar;
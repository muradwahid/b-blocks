import { useState, useEffect, useRef } from 'react';

import Sidebar from './Sidebar';
import Templates from './Templates';
import { closeIcon } from '../utils/icons';
import { searchData } from '../utils/functions';
import pages from '../data/pages.json';
import patterns from '../data/patterns';

const Modal = ({ isPremium, show, setShow }) => {
	const [type, setType] = useState('pages');
	const [category, setCategory] = useState('all');
	const [search, setSearch] = useState('');

	// Modal outside click
	const contentRef = useRef();
	useEffect(() => {
		let handler = (e) => {
			if (!contentRef.current?.contains(e.target)) {
				setShow(false);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => {
			document.removeEventListener('mousedown', handler);
		};
	});

	// Filter and search
	const typeFilter = 'pages' === type ? pages : patterns;
	const categoryFilter = typeFilter.filter(item => 'all' === category ? true : item.categories?.includes(category));
	const filteredItems = search ? searchData(search, [...pages, ...patterns]) : categoryFilter;

	// Load More
	const [itemsDisplayed, setItemsDisplayed] = useState(9);
	const itemsPerPage = 9;
	const pageItems = filteredItems.slice(0, itemsDisplayed);

	return <div className='templateLibraryModalWrap' style={{ visibility: show ? 'visible' : 'hidden' }} >
		<div ref={contentRef} style={{ marginTop: show ? '0' : '50px', transition: 'margin 0.5s ease-out' }} className='modalContainer'>
			<header className='modalHeader'>
				<div className='modalHeaderLogo'>
					<img src='https://ps.w.org/b-blocks/assets/icon-128x128.png' alt='B Blocks' /> B Blocks
				</div>

				<div onClick={() => setShow(false)} className='modalHeaderClose'>{closeIcon}</div>
			</header>

			{show && <div className='modalBody'>
				<Sidebar type={type} category={category} search={search} setType={setType} setCategory={setCategory} setSearch={setSearch} setItemsDisplayed={setItemsDisplayed} itemsPerPage={itemsPerPage} />

				<Templates filteredItems={filteredItems} pageItems={pageItems} setShow={setShow} isPremium={isPremium}>
					{itemsDisplayed < filteredItems.length && <button className='modalBodyTemplateLoadMore libraryBtn active' onClick={() => setItemsDisplayed(itemsDisplayed + itemsPerPage)}>Load More</button>}
				</Templates>
			</div>}
		</div>
	</div>;
};
export default Modal;
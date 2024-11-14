import { useEffect, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import { Spinner, TabPanel } from '@wordpress/components';

import Sidebar from './Sidebar';
import Templates from './Templates';
import { closeIcon } from '../utils/icons';

const perPage = 9;

const Modal = (props) => {
	const { isPremium, show, setShow, setTemplates, totalCount, templatesLoading, setType, setCategory, pageNumber, setPageNumber } = props;

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


	return <div className='templateLibraryModalWrap' style={{ visibility: show ? 'visible' : 'hidden' }} >
		<div ref={contentRef} style={{ marginTop: show ? '0' : '50px', transition: 'margin 0.5s ease-out' }} className='modalContainer'>
			<header className='modalHeader'>
				<div className='modalHeaderLogo'>
					<img src='https://ps.w.org/b-blocks/assets/icon-128x128.png' alt='B Blocks' /> B Blocks
				</div>

				<div className='modalHeaderTypes'>
					<TabPanel
						className='bPlTabPanel bPlAutoTab'
						activeClass='activeTab'
						tabs={[
							// { name: 'pages', title: __('Pages', 'b-blocks') },
							{ name: 'patterns', title: __('Patterns', 'b-blocks') }
						]}
						onSelect={tabName => {
							setType(tabName);
							setCategory('all');
							setPageNumber(1);
							setTemplates([]);
						}}
					>{() => <></>}</TabPanel>
				</div>

				<div onClick={() => setShow(false)} className='modalHeaderClose'>{closeIcon}</div>
			</header>

			{show && <div className='modalBody'>
				<Sidebar {...props} />

				<Templates {...props} setShow={setShow} isPremium={isPremium}>
					<div className='modalBodyBottom'>
						{templatesLoading ? <div className='bPlPlaceCenter'>
							<Spinner className='bPlSpinner' />
						</div> : (perPage * pageNumber) < totalCount && <button className='modalBodyTemplateLoadMore libraryBtn active' onClick={() => setPageNumber(prev => prev + 1)}>Load More</button>}
					</div>
				</Templates>
			</div>}
		</div>
	</div>;
};
export default Modal;
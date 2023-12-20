import { useState } from 'react';
import { __ } from '@wordpress/i18n';

import './TemplateLibrary.scss';
import Modal from './Modal/Modal';

const TemplateLibrary = () => {
	const [show, setShow] = useState(false);

	return <>
		<button className='templateLibraryButton' onClick={() => setShow(true)}>
			<img src='https://ps.w.org/b-blocks/assets/icon-128x128.png' alt='B Blocks' />
			{__('Template Library', 'b-blocks')}
		</button>

		<Modal show={show} setShow={setShow} />
	</>;
};
export default TemplateLibrary;
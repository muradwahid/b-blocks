import { useState } from 'react';
import { __ } from '@wordpress/i18n';

import './TemplateLibrary.scss';
import Modal from './Modal/Modal';
import usePremiumInEditor from '../hooks/usePremiumInEditor';

const TemplateLibrary = () => {
	const { isPremium } = usePremiumInEditor();

	const [show, setShow] = useState(false);

	return <>
		<button className='templateLibraryButton' onClick={() => setShow(true)}>
			<img src='https://ps.w.org/b-blocks/assets/icon-128x128.png' alt='B Blocks' />
			{__('Template Library', 'b-blocks')}
		</button>

		<Modal isPremium={isPremium} show={show} setShow={setShow} />
	</>;
};
export default TemplateLibrary;
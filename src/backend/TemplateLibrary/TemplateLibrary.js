import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';

import './TemplateLibrary.scss';
import Modal from './Modal/Modal';
import useTemplatesMain from './hooks/useTemplatesMain';
import useTemplates from './hooks/useTemplates';
// import { useWPOptionQuery } from '../../../../bpl-tools/hooks';
import { pluginIcon } from '../../utils/icons';

const TemplateLibrary = () => {
	const [show, setShow] = useState(false);
	const [type, setType] = useState('patterns');
	// const [type, setType] = useState('pages');
	const [category, setCategory] = useState('all');
	const [pageNumber, setPageNumber] = useState(1);
	const [search, setSearch] = useState('');
	const [templates, setTemplates] = useState([]);

	// const { data = {} } = useWPOptionQuery('bBlocksUtils');

	const { main, isLoading: mainLoading } = useTemplatesMain(bBlocksNonce, type);
	const { templates: fTemplates, totalCount, refetchTemplates, isLoading: templatesLoading } = useTemplates(bBlocksNonce, type, category, pageNumber, search);


	const isPremium = bBlocksPremiumChecker;

	useEffect(() => {
		setTemplates([...templates, ...fTemplates]);
	}, [fTemplates]);

	return <>
		<button className='templateLibraryButton' onClick={() => setShow(true)}>
			{/* <img src='https://ps.w.org/b-blocks/assets/icon-128x128.png?rev=3342212' alt='bBlocks' /> */}
			{pluginIcon}
			{__('Template Library', 'b-blocks')}
		</button>

		<Modal {...{ nonce: bBlocksNonce, isPremium, show, setShow, main, mainLoading, templates, setTemplates, totalCount, templatesLoading, type, refetchTemplates,setType, category, setCategory, pageNumber, setPageNumber, search, setSearch }} />
	</>;
};
export default TemplateLibrary;
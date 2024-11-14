import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';

import './TemplateLibrary.scss';
import Modal from './Modal/Modal';
import usePremiumInEditor from '../../hooks/usePremiumInEditor';
import useTemplatesMain from './hooks/useTemplatesMain';
import useTemplates from './hooks/useTemplates';

const TemplateLibrary = () => {
	const { isPremium } = usePremiumInEditor();

	const [show, setShow] = useState(false);
	const [type, setType] = useState('patterns');
	const [category, setCategory] = useState('all');
	const [pageNumber, setPageNumber] = useState(1);
	const [search, setSearch] = useState('');
	const [templates, setTemplates] = useState([]);

	const { main, isLoading: mainLoading } = useTemplatesMain();
	const { templates: fTemplates, totalCount, refetchTemplates, isLoading: templatesLoading } = useTemplates(type, category, pageNumber, search);

	useEffect(() => {
		setTemplates([...templates, ...fTemplates]);
	}, [fTemplates]);

	return <>
		<button className='templateLibraryButton' onClick={() => setShow(true)}>
			<img src='https://ps.w.org/b-blocks/assets/icon-128x128.png' alt='B Blocks' />
			{__('Template Library', 'b-blocks')}
		</button>

		<Modal {...{ isPremium, show, setShow, main, mainLoading, templates, setTemplates, totalCount, refetchTemplates, templatesLoading, type, setType, category, setCategory, pageNumber, setPageNumber, search, setSearch }} />
	</>;
};
export default TemplateLibrary;
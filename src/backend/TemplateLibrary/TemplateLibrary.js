import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';

import './TemplateLibrary.scss';
import Modal from './Modal/Modal';
import usePremiumInEditor from '../../hooks/usePremiumInEditor';
import useTemplatesMain from './hooks/useTemplatesMain';
import useTemplates from './hooks/useTemplates';
import { useWPOptionQuery } from '../../../../bpl-tools/hooks';
import { pluginIcon } from '../../utils/icons';

const TemplateLibrary = () => {
	const { isPremium } = usePremiumInEditor();

	const [show, setShow] = useState(false);
	const [type, setType] = useState('patterns');
	const [category, setCategory] = useState('all');
	const [pageNumber, setPageNumber] = useState(1);
	const [search, setSearch] = useState('');
	const [templates, setTemplates] = useState([]);

	const { data = {} } = useWPOptionQuery('bBlocksUtils');
	const { main, isLoading: mainLoading } = useTemplatesMain(data?.nonce);
	const { templates: fTemplates, totalCount, refetchTemplates, isLoading: templatesLoading } = useTemplates(data?.nonce, type, category, pageNumber, search);

	useEffect(() => {
		setTemplates([...templates, ...fTemplates]);
	}, [fTemplates]);

	return <>
		<button className='templateLibraryButton' onClick={() => setShow(true)}>
			{/* <img src='https://ps.w.org/b-blocks/assets/icon-128x128.png?rev=3342212' alt='B Blocks' /> */}
			{pluginIcon}
			{__('Template Library', 'b-blocks')}
		</button>

		<Modal {...{ nonce: data?.nonce, isPremium, show, setShow, main, mainLoading, templates, setTemplates, totalCount, refetchTemplates, templatesLoading, type, setType, category, setCategory, pageNumber, setPageNumber, search, setSearch }} />
	</>;
};
export default TemplateLibrary;
import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';

import './TemplateLibrary.scss';
import Modal from './Modal/Modal';
import useTemplatesMain from './hooks/useTemplatesMain';
import useTemplates from './hooks/useTemplates';
import useAccessCounts from './hooks/useAccessCounts';
// import { useWPOptionQuery } from '../../../../bpl-tools/hooks';
import { pluginIcon } from '../../utils/icons';

const TemplateLibrary = () => {
	const [show, setShow] = useState(false);
	const [type, setType] = useState('pages');
	const [category, setCategory] = useState('all');
	const [access, setAccess] = useState('all'); // all | free | pro (client-side, combines with category)
	const [pageNumber, setPageNumber] = useState(1);
	const [search, setSearch] = useState('');
	const [templates, setTemplates] = useState([]);

	// const { data = {} } = useWPOptionQuery('bBlocksUtils');
	const nonce = window.bBlocksCursorDataConfig?.nonce

	// "free" is not a real category (the Pages taxonomy only tags "pro"); free
	// === "not pro". So only "pro" is queried server-side — everything else
	// queries the content category (or all) and access is filtered client-side.
	const effectiveCategory = 'all' !== category ? category : ('pro' === access ? 'pro' : 'all');

	const { main, isLoading: mainLoading } = useTemplatesMain(nonce, type);
	const { templates: fTemplates, totalCount, refetchTemplates, isLoading: templatesLoading } = useTemplates(nonce, type, effectiveCategory, pageNumber, search);

	// Accurate per-category Free/Pro counts (fetched once the modal is open).
	const accessCounts = useAccessCounts(nonce, type, show);

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

		<Modal {...{ isPremium, show, setShow, main, mainLoading, templates, setTemplates, totalCount, templatesLoading, type, refetchTemplates, setType, category, setCategory, access, setAccess, accessCounts, pageNumber, setPageNumber, search, setSearch }} />
	</>;
};
export default TemplateLibrary;
import { useState, useEffect } from 'react';

import { useWPAjax } from '../../../../../react-utils/hooks';

const useTemplates = (nonce, type = 'patterns', category = 'all', pageNumber = 1, search = '') => {
	const src = search.split(' ').join(',');

	const { data = null, saveData, refetch, isLoading } = useWPAjax('bblocks_templates', { _wpnonce: nonce, type, category, pageNumber, search: src }, false);

	useEffect(() => {
		refetch()
	}, [nonce]);

	const [templates, setTemplates] = useState([]);
	const [totalCount, setTotalCount] = useState([]);

	useEffect(() => {
		if (type, category, pageNumber) {
			saveData({ type, category, pageNumber, search: src });
		}
	}, [type, category, pageNumber, search]);

	useEffect(() => {
		if (data) {
			setTemplates(data?.patterns || []);
			setTotalCount(parseInt(data?.count) || 0);
		}
	}, [data]);

	return { templates, totalCount, refetchTemplates: saveData, isLoading };
};
export default useTemplates;
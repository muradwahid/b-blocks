import { useState, useEffect } from 'react';

import { useWPAjax } from '../../../../../bpl-tools/hooks';

const useTemplatesMain = (nonce,type) => {
	const { data = null, saveData, refetch, isLoading } = useWPAjax('bblocks_templates_main', { _wpnonce: nonce }, false);

	useEffect(() => {
		refetch()
	}, [nonce]);

	useEffect(() => {
		saveData({ type })
	}, [type]);

	const [main, setMain] = useState([]);

	useEffect(() => {
		if (data) {
			setMain(data);
		}
	}, [data]);

	return { main, isLoading };
};
export default useTemplatesMain;
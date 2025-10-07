import { useState, useEffect } from 'react';

import { useWPAjax } from '../../../../../bpl-tools/hooks';

const useTemplatesMain = (nonce) => {
	const { data = null, refetch, isLoading } = useWPAjax('bblocks_templates_main', { _wpnonce: nonce }, false);

	useEffect(() => {
		refetch()
	}, [nonce]);

	const [main, setMain] = useState([]);

	useEffect(() => {
		if (data) {
			setMain(data);
		}
	}, [data]);

	return { main, isLoading };
};
export default useTemplatesMain;
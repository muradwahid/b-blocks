import { useState, useEffect } from 'react';

import { useWPAjax, useWPOptionQuery } from '../../../../../react-utils/hooks';

const useTemplatesMain = () => {
	const { data: bBlocksUtils } = useWPOptionQuery('bBlocksUtils');
	const { data = null, refetch, isLoading } = useWPAjax('bblocks_templates_main', { _wpnonce: bBlocksUtils?.nonce }, false);

	useEffect(() => {
		refetch()
	}, [bBlocksUtils]);

	const [main, setMain] = useState([]);

	useEffect(() => {
		if (data) {
			setMain(data);
		}
	}, [data]);

	return { main, isLoading };
};
export default useTemplatesMain;
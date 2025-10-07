import { useEffect } from 'react';

import { useWPAjax, useWPOptionQuery } from '../../../bpl-tools/hooks';

const usePremiumInEditor = () => {
	const { data: bBlocksUtils } = useWPOptionQuery('bBlocksUtils');
	const { data = null, refetch, isLoading = true } = useWPAjax('bBlocksPipeChecker', { _wpnonce: bBlocksUtils?.nonce }, true);
	const isPremium = (!isLoading && data?.isPipe) || false;

	useEffect(() => {
		refetch()
	}, [bBlocksUtils]);

	return { isPremium, isLoading };
};
export default usePremiumInEditor;
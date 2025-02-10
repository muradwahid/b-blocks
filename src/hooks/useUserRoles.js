import { useEffect } from 'react';

import { useWPAjax, useWPOptionQuery } from '../../../bpl-tools/hooks';

const useUserRoles = () => {
	const { data: bBlocksUtils } = useWPOptionQuery('bBlocksUtils');
	const { data = null, refetch, isLoading = true } = useWPAjax('bBlocksUserRoles', { _wpnonce: bBlocksUtils?.nonce }, true);

	const roles = null === data ? [] : Object.entries(data).map(([key, value]) => ({
		label: value,
		value: key,
	}));

	useEffect(() => {
		refetch()
	}, [bBlocksUtils]);

	return { roles, isLoading };
};
export default useUserRoles;
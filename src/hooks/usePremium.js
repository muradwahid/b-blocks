import { useWPAjax } from '../../../bpl-tools/hooks';

const usePremium = (nonce) => {
	const { data = null, isLoading } = useWPAjax('bBlocksPipeChecker', { _wpnonce: nonce });
	const isPremium = (!isLoading && data?.isPipe) || false;

	return { isPremium, isLoading };
};
export default usePremium;
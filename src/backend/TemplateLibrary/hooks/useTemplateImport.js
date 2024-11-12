import { useWPAjax, useWPOptionQuery } from '../../../../../react-utils/hooks';

const useTemplateImport = () => {
	const { data: bBlocksUtils } = useWPOptionQuery('bBlocksUtils');
	const { data = null, saveData, isLoading } = useWPAjax('bblocks_template_import', { _wpnonce: bBlocksUtils?.nonce });

	return { data, getContent: saveData, isLoading };
};
export default useTemplateImport;
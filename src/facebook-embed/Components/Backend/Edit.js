import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import FacebookBackend from './FacebookBackend';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import usePremiumInEditor from '../../../hooks/usePremiumInEditor';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;

	const { isPremium = false } = usePremiumInEditor();

	const updateObj = updateAttributes(attributes, setAttributes);
	return <>
		<Settings {...{ attributes, updateObj, isPremium }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />
			<FacebookBackend attributes={attributes} />
		</div>
	</>;
}
export default Edit;
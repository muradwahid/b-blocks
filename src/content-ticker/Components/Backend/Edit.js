import { useBlockProps } from '@wordpress/block-editor';
import { withDispatch } from '@wordpress/data';

import ContentTicker from '../Common/ContentTicker';
import Style from '../Common/Style';
import Settings from './Settings/Settings';
import usePremiumInEditor from '../../../hooks/usePremiumInEditor';

const Edit = (props) => {
	const { attributes, setAttributes, clientId, selectBlock } = props;

	const { isPremium = false } = usePremiumInEditor();
	return <>
		<Settings {...{ attributes, setAttributes, isPremium }} />
		<div {...useBlockProps()} onClick={() => selectBlock(clientId)}>
			<Style attributes={attributes} id={`block-${clientId}`} />
			<ContentTicker {...{ attributes }} />
		</div>
	</>
};
export default withDispatch((dispatch, ownProps) => {
	return {
		selectBlock: () => {
			dispatch('core/block-editor').selectBlock(ownProps.clientId);
		}
	};
})(Edit)

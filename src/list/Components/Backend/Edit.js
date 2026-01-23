import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import ListBackEnd from './ListBackEnd';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;

	const updateObj = updateAttributes(attributes, setAttributes);

	return <>
		<Settings {...{ attributes, setAttributes, updateObj}} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />
			<ListBackEnd attributes={attributes} updateObj={updateObj}/>
		</div>
	</>;
}
export default Edit;
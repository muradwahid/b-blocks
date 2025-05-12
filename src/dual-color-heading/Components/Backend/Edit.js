import { useBlockProps } from '@wordpress/block-editor';
import DualColorHeading from '../Common/DualColorHeading/DualColorHeading';
import Style from '../Common/Style';
import Settings from './Settings/Settings';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const updateObj = updateAttributes(attributes, setAttributes)
	return <>
		<Settings {...{ attributes, setAttributes, updateObj }}  />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />
			<DualColorHeading attributes={attributes} />

		</div>
	</>;
}
export default Edit;
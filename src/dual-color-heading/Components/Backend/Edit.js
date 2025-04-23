import { useBlockProps } from '@wordpress/block-editor';
import DualColorHeading from '../Common/DualColorHeading/DualColorHeading';
import Style from '../Common/Style';
import Settings from './Settings/Settings';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;

	return <>
		<Settings {...{ attributes, setAttributes }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />
			<DualColorHeading attributes={attributes} />

		</div>
	</>;
}
export default Edit;
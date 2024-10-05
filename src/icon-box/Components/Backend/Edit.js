import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import IconBox from '../Common/IconBox';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;

	const id = `${prefix}-${clientId}`;

	return <>
		<Settings {...{ attributes, setAttributes }} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} />
			<IconBox attributes={attributes} />
		</div>
	</>;
}
export default Edit;
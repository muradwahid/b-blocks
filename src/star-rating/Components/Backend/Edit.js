import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import Rating from '../Common/Rating';

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />

			<Rating attributes={attributes} />
		</div>
	</>;
};

export default Edit;
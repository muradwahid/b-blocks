import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import Rating from '../Common/Rating';
import { prefix } from '../../utils/data';

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;

	const id = `${prefix}-${clientId}`;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} />

			<Rating attributes={attributes} />
		</div>
	</>;
};

export default Edit;
import { useBlockProps } from '@wordpress/block-editor';

import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import IconBox from '../Common/IconBox';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;

	const id = `block-${clientId}`;

	return <>
		<Settings {...{ attributes, setAttributes }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={id} extraCSS={generateCSS(id, attributes.advanced, true)} />

			<div>
				<IconBox attributes={attributes} />
			</div>
		</div>
	</>;
}
export default Edit;
import { useBlockProps } from '@wordpress/block-editor';

import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import IconBox from '../Common/IconBox';
import { withSelect } from '@wordpress/data';

const Edit = props => {
	const { attributes, setAttributes, clientId, device } = props;

	const id = `block-${clientId}`;

	return <>
		<Settings {...{ attributes, setAttributes, device }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={id} extraCSS={generateCSS(id, attributes.advanced, true)} />

			<div>
				<IconBox attributes={attributes} />
			</div>
		</div>
	</>;
}
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(Edit);
import { useBlockProps } from '@wordpress/block-editor';


import Settings from './Settings/Settings';
import Style from '../Common/Style';
import TextPath from '../Common/TextPath';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import { withSelect } from '@wordpress/data';

const Edit = props => {
	const { attributes, setAttributes, clientId, device } = props;

	const updateObj = updateAttributes(attributes, setAttributes);

	return <>
		<Settings {...{ attributes, setAttributes, updateObj, device }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />
			<TextPath attributes={attributes} />
		</div>
	</>;
}

export default withSelect((select) => {
		const { getDeviceType } = select('core/editor');

		return {
			device: getDeviceType()?.toLowerCase(),
		};
})(Edit);
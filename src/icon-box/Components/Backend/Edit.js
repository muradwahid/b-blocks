import { useBlockProps } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import IconBox from '../Common/IconBox';

const Edit = props => {
	const { attributes, setAttributes, clientId, device } = props;

	const id = `block-${clientId}`;

	return <>
		<Settings {...{ attributes, setAttributes, device }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={id} isBackend={true} />

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
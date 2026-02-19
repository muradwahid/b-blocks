import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import { withSelect } from '@wordpress/data';
import BreadCrumb from '../Common/BreadCrumb';

const Edit = props => {
	const { attributes, setAttributes, clientId, device } = props;
	const { home, options } = attributes;

	const isPremium = false;

	const updateObj = updateAttributes(attributes, setAttributes);

	const crumbs = [
		(options.isHomeShow && {
			label: home.label
		}),
		{
			label: 'Template'
		},
		{
			label: 'Current Page'
		}
	].filter(Boolean);

	return <>
		<Settings {...{ attributes, setAttributes, isPremium, updateObj, device }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />
			<div>
				<BreadCrumb attributes={attributes} crumbs={crumbs} />
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
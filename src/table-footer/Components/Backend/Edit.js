import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { withSelect } from '@wordpress/data';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

const Edit = props => {
	const { attributes, setAttributes, clientId, device, parentClientId } = props;
	const { settings } = attributes;
	const innerBlocksProps = useInnerBlocksProps(
		useBlockProps({ tagName: 'tfoot' }),
		{
			template: [],
			templateLock: false,
			renderAppender: false,
			allowedBlocks: ['b-blocks/table-row']
		}
	);

	const updateObj = updateAttributes(attributes, setAttributes);

	return <>
		<Settings {...{ attributes, setAttributes, device, updateObj, parentClientId }} />
			<Style attributes={attributes} id={`block-${clientId}`} />
		<tfoot {...innerBlocksProps} colSpan={settings.colSpan} rowSpan={settings.rowSpan}>
		</tfoot>
	</>;
}
export default 	withSelect((select,{clientId}) => {
	const { getDeviceType } = select('core/editor');
	const { getBlocks, getBlockRootClientId } = select('core/block-editor');
	const parentClientId = getBlockRootClientId(clientId);

	return {
		device: getDeviceType()?.toLowerCase(),
		innerBlocks: getBlocks(clientId),
		parentClientId
	};
}) (Edit);
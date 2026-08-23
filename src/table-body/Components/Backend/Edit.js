import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

const Edit = props => {
	const { attributes, setAttributes, clientId, device, parentClientId } = props;
	
	const innerBlocksProps = useInnerBlocksProps(
		useBlockProps({ tagName: 'tbody' }),
		{
			template: [["b-blocks/table-row", {}], ["b-blocks/table-row", {}], ["b-blocks/table-row", {}]],
			templateLock: false,
			renderAppender: false,
			allowedBlocks: ['b-blocks/table-row']
		}
	);


	const updateObj = updateAttributes(attributes, setAttributes)

	return <>
		<Settings {...{ attributes, setAttributes, updateObj, device, parentClientId }} />
		<Style attributes={attributes} id={`block-${clientId}`} />

		<tbody {...innerBlocksProps}>
		</tbody>
	</>;
}
export default withSelect((select, { clientId }) => {
	const { getDeviceType } = select('core/editor');
	const { getBlocks, getBlockRootClientId } = select('core/block-editor');
	const parentClientId = getBlockRootClientId(clientId);

	return {
		device: getDeviceType()?.toLowerCase(),
		innerBlocks: getBlocks(clientId),
		parentClientId
	};
})(Edit);
import { InnerBlocks, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { withSelect } from '@wordpress/data';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

const Edit = props => {
	const { attributes, setAttributes, clientId, device, innerBlocks, parentClientId } = props;

	const { settings, tagName: Tag = 'td',className } = attributes;
	const innerBlocksProps = useInnerBlocksProps(
		useBlockProps({ tagName: Tag, className }),
		{
			template: [["core/paragraph", { placeholder: "Type / to choose a block" }]],
			templateLock: false,
			renderAppender: innerBlocks?.length > 0 ? undefined : InnerBlocks.ButtonBlockAppender,
			__experimentalDirectInsert: false,
		}
	);

	const updateObj = updateAttributes(attributes, setAttributes);

	return <>
		<Settings {...{ attributes, setAttributes, device, updateObj, clientId, parentClientId }} />
		<Style attributes={attributes} id={`block-${clientId}`} />
		<Tag {...innerBlocksProps} colSpan={settings?.colSpan} rowSpan={settings.rowSpan}>
		</Tag>
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
import { useRef, useState, useEffect } from '@wordpress/element';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { DropdownMenu, Popover } from '@wordpress/components';
import { useDispatch, useSelect, withSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { useMergeRefs } from '@wordpress/compose';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

const Edit = props => {
	const { attributes, setAttributes, clientId, device } = props;

	const trRef = useRef(null);
	const [isMounted, setMounted] = useState(false);

	// Wait for first paint so trRef.current is available for Popover anchor
	useEffect(() => { setMounted(true); }, []);

	const { insertBlock, removeBlock } = useDispatch('core/block-editor');

	const { blockIndex, parentClientId, parentBlockName, columnCount } = useSelect(select => {
		const { getBlockIndex, getBlockRootClientId, getBlock, getBlockName } = select('core/block-editor');
		const parentId = getBlockRootClientId(clientId);
		const currentBlock = getBlock(clientId);
		return {
			blockIndex: getBlockIndex(clientId),
			parentClientId: parentId,
			parentBlockName: getBlockName(parentId),
			columnCount: currentBlock?.innerBlocks?.length || 4,
		};
	}, [clientId]);

	// Only body rows get the action menu; head/footer rows are structural and should not be added/deleted
	const isBodyRow = parentBlockName === 'b-blocks/table-body';

	const createNewRow = () => {
		const cells = Array.from({ length: columnCount }, () => createBlock('b-blocks/table-cell', {}));
		return createBlock('b-blocks/table-row', {}, cells);
	};

	const addRowAbove = () => insertBlock(createNewRow(), blockIndex, parentClientId, true);
	const addRowBelow = () => insertBlock(createNewRow(), blockIndex + 1, parentClientId, true);
	const deleteRow = () => removeBlock(clientId);

	// Split blockProps so we can access its ref for useMergeRefs
	const blockProps = useBlockProps({ tagName: 'tr' });
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: [['b-blocks/table-cell', {}], ['b-blocks/table-cell', {}], ['b-blocks/table-cell', {}]],
		templateLock: false,
		renderAppender: false,
		allowedBlocks: ['b-blocks/table-cell'],
	});

	// Merge Gutenberg's block ref with our own trRef without losing block selection
	const mergedRef = useMergeRefs([trRef, innerBlocksProps.ref]);

	const menuControls = [
		{ title: 'Add Row Above', icon: 'table-row-before', onClick: addRowAbove },
		{ title: 'Add Row Below', icon: 'table-row-after', onClick: addRowBelow },
		{ title: 'Delete Row', icon: 'trash', onClick: deleteRow },
	];

	const updateObj = updateAttributes(attributes, setAttributes);

	return <>
		<Settings {...{ attributes, setAttributes, updateObj, device, parentClientId }} />
		<Style attributes={attributes} id={`block-${clientId}`} />


		<tr {...innerBlocksProps} ref={mergedRef}></tr>

		{isMounted && trRef.current && isBodyRow && (
			<Popover
				anchor={trRef.current}
				placement='right'
				noArrow
				animate={false}
				flip={false}
				resize={false}
				focusOnMount={false}
				className='b-blocks-row-action-popover'
			>
				<DropdownMenu
					icon='ellipsis'
					label='Row Actions'
					controls={menuControls}
					className='b-blocks-row-action-menu'
				/>
			</Popover>
		)}
	</>;
};

export default withSelect((select, { clientId }) => {
	const { getDeviceType } = select('core/editor');
	const { getBlocks } = select('core/block-editor');
	return {
		device: getDeviceType()?.toLowerCase(),
		innerBlocks: getBlocks(clientId)
	};
})(Edit);
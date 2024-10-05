import { useEffect, useState } from 'react';
import { BlockEditorProvider, BlockList, BlockTools, WritingFlow, ObserveTyping, BlockInspector, BlockEditorKeyboardShortcuts } from '@wordpress/block-editor';
import { SlotFillProvider, Popover } from '@wordpress/components';
import { parse, serialize } from '@wordpress/blocks';

const BackendContent = ({ popup, setAttributes }) => {
	const { ShortcutProvider } = wp.keyboardShortcuts;
	const [blocks, updateBlocks] = useState([]);

	useEffect(() => {
		updateBlocks(parse(popup?.content));
	}, []);

	const onChangeContent = (blocks) => {
		const lastBlock = blocks[blocks.length - 1];
		if (lastBlock.name === 'core/paragraph' && lastBlock.attributes.content === '') {
			updateBlocks(blocks);
		} else {
			updateBlocks([...blocks, ...parse('<!-- wp:paragraph --><!-- /wp:paragraph -->')]);
		}
		setAttributes({ popup: { ...popup, content: serialize(blocks) } })
	}

	return <BlockEditorProvider value={blocks} onInput={(blocks) => onChangeContent(blocks)} onChange={(blocks) => onChangeContent(blocks)}>
		<SlotFillProvider>
			<ShortcutProvider className='btnContentArea'>
				<BlockEditorKeyboardShortcuts />

				<div className='btnContentBox'>
					<div className='btnContentEditor'>
						<BlockTools>
							<WritingFlow>
								<ObserveTyping>
									<BlockList />
								</ObserveTyping>
							</WritingFlow>
						</BlockTools>

						<div className='popoverSlotOuter'>
							<Popover.Slot />
						</div>
					</div>

					<div className='btnContentSidebar'>
						<BlockInspector />
					</div>
				</div>
			</ShortcutProvider>
		</SlotFillProvider>
	</BlockEditorProvider>
}
export default BackendContent;
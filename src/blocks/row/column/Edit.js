import { useState, useEffect } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { InnerBlocks } from '@wordpress/block-editor';
import { ResizableBox } from '@wordpress/components';

import Settings from './Settings';
import Style from './Style';
import { calcPercentage } from '../functions';

const Edit = props => {
	const { className, attributes, setAttributes, clientId, toggleSelection, rowWidth, nextBlockClientId, nextColumnWidth, prevBlockClientId, prevColumnWidth, updateAttributes } = props;
	const { width, background, padding, border } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const [absWidth, setAbsWidth] = useState(0);
	const [colWidth, setColWidth] = useState({ mobile: 100, tablet: 50, desktop: 33.33 });
	const [nextColWidth, setNextColWidth] = useState({ mobile: 100, tablet: 50, desktop: 33.33 });
	const [prevColWidth, setPrevColWidth] = useState({ mobile: 100, tablet: 50, desktop: 33.33 });
	const [isResizing, setIsResizing] = useState(false);
	const [maxResizeWidth, setMaxResizeWidth] = useState(0);
	const [blockIndex, setBlockIndex] = useState(null);

	const columnEl = document.querySelector(`#block-${clientId}`);

	// Max Resize width
	useEffect(() => {
		setMaxResizeWidth(rowWidth);
	}, [rowWidth]);

	// On Resize start get the previous|next column width
	// Calculate current column resize box based on row/parent element width
	// Set resize box maxWidth by (next|prev+current) colum width
	const onResizeStartEvent = (event, direction, elt) => {
		// toggleSelection(false);

		// if (nextBlockClientId !== null) {
		// 	nextColWidth.desktop = parseFloat(nextColumnWidth?.desktop);
		// }
		// if (prevBlockClientId !== null) {
		// 	prevColWidth.desktop = parseFloat(prevColumnWidth?.desktop);
		// }
		// let maxResizeWidthHold = 0;
		// if (direction === 'right' && nextBlockClientId !== null) {
		// 	const resizeNextColWidth = (nextColWidth.desktop / 100) * rowWidth - 100;
		// 	let resizeCurrentColWidth = (width.desktop / 100) * rowWidth;
		// 	maxResizeWidthHold = resizeNextColWidth + resizeCurrentColWidth;
		// }
		// if (direction === 'left' && prevBlockClientId !== null) {
		// 	let resizePrevColWidth = (prevColWidth.desktop / 100) * rowWidth - 100;
		// 	let resizeCurrentColWidth = (width.desktop / 100) * rowWidth;
		// 	maxResizeWidthHold = resizePrevColWidth + resizeCurrentColWidth;
		// }

		// // Every time select resize handler set the width
		// // setAttributes({ width: colWidth });
		// let columnRect = {};
		// if (columnEl) {
		// 	columnRect = columnEl.getBoundingClientRect();
		// }

		// setColWidth(colWidth);
		// setNextColWidth(nextColWidth);
		// setPrevColWidth(prevColWidth);
		// setMaxResizeWidth(maxResizeWidthHold);
		// setIsResizing(true);
		// setAbsWidth(columnRect.width || 0);

		console.log('start' + { elt })
	}

	// Update column and resize box width onResize

	// If direction is Right then update next and current column width
	// Calculate column width by (next+current)/100

	// If direction is left then update prev and current column width
	// Calculate colum width by (prev+current)/100
	const onResize = (event, direction, elt, delta) => {
		// let currentBlockWidth = absWidth + delta.width;
		// let calWidth = parseFloat((currentBlockWidth / rowWidth) * 100);
		// let diff = parseFloat(colWidth.desktop) - calWidth;

		// let nextBlockWidth = 0;
		// // If direction right then update next and current column
		// if (direction === 'right') {
		// 	if (nextBlockClientId !== null) {
		// 		nextBlockWidth = parseFloat(nextColumnWidth.desktop) + diff;

		// 		if (nextBlockWidth > 10 && calWidth > 10) {
		// 			nextBlockWidth = Math.abs(nextBlockWidth);
		// 			updateAttributes(nextBlockClientId, { width: { ...nextColumnWidth, desktop: nextBlockWidth.toFixed(2) } });
		// 		}
		// 	}
		// }

		// if (nextBlockWidth > 10 && calWidth > 10) {
		// 	setAttributes({ width: { ...width, desktop: calWidth.toFixed(2) } });
		// }


		// console.log({ event, direction, elt, delta })
		console.log(calcPercentage(delta.width, rowWidth));
	}

	const onResizeStop = (event, direction, elt, delta) => {
		console.log(elt?.clientWidth)
	}

	return <>
		{/* <Settings attributes={props.attributes} setAttributes={setAttributes} /> */}

		<div className={className} id={`bBlocksColumn-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} isBackend={true} />

			<ResizableBox
				enable={{
					top: false,
					right: true,
					bottom: false,
					left: false,
					topRight: false,
					bottomRight: false,
					bottomLeft: false,
					topLeft: false,
				}}
				minHeight={10}
				onResize={(event, direction, elt, delta) => onResize(event, direction, elt, delta)}
				onResizeStop={(event, direction, elt, delta) => onResizeStop(event, direction, elt, delta)}
				onResizeStart={(event, direction, elt) => onResizeStartEvent(event, direction, elt)}
			>
				<div className='bBlocksColumn'>
					<InnerBlocks />
				</div>
			</ResizableBox>
		</div>
	</>;
};
export default compose(
	withSelect((select, props) => {
		const { clientId } = props;
		const parentBlockId = select('core/block-editor').getBlockParents(clientId)[0];
		const prevBlockClientId = select('core/block-editor').getPreviousBlockClientId(clientId);
		const nextBlockClientId = select('core/block-editor').getNextBlockClientId(clientId);

		return {
			rowWidth: document.querySelector(`#block-${parentBlockId}`)?.clientWidth || 0,
			nextBlockClientId,
			nextColumnWidth: select('core/block-editor').getBlockAttributes(nextBlockClientId)?.width,
			prevBlockClientId,
			prevColumnWidth: select('core/block-editor').getBlockAttributes(prevBlockClientId)?.width
		};
	}),

	withDispatch((dispatch) => {
		return {
			updateAttributes: (id, args) => dispatch('core/block-editor').updateBlockAttributes(id, args)
		}
	})
)(Edit);
import { useState, useEffect, useRef } from 'react';
import { createBlock } from '@wordpress/blocks';
import { compose } from '@wordpress/compose';
import { withSelect, dispatch, withDispatch } from '@wordpress/data';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { ResizableBox } from '@wordpress/components';
const { replaceInnerBlocks } = dispatch('core/block-editor');

import { tabController } from '../../../../../Components/utils/functions';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { calcPercentage, getInt, toFixed } from '../../../row/utils/functions';
import { rowPrefix, colPrefix } from '../../../row/utils/data';

// const initialWidth = { mobile: 100, tablet: 50, desktop: 33.33 }
const MINWIDTH = 10;

const Edit = props => {
	const { attributes, context, setAttributes, clientId, isSelected, toggleSelection, parentBlockId, rowWidth, parentInnerBlocks, currentIndex, innerBlocks, nextClientId, nextWidth, updateAttributes } = props;
	const { width } = attributes;
	const columns = context['b-blocks/rowColumns'];
	const columnGap = context['b-blocks/rowColumnGap'];

	useEffect(() => tabController(), [isSelected]);

	// const [colWidth, setColWidth] = useState(initialWidth);
	// const [nextColWidth, setNextColWidth] = useState(nextWidth);
	const [isResizing, setIsResizing] = useState(false);

	const colWidthHold = useRef(width);
	const nextColWidthHold = useRef(nextWidth);

	const id = `${colPrefix}-${clientId}`;
	// const columnEl = document.querySelector(`#${id}`);
	// const nextColumnEl = document.querySelector(`#${rowPrefix}-${nextClientId}`);
	const columnEl = document.querySelector(`#block-${clientId}`);
	const nextColumnEl = document.querySelector(`#block-${nextClientId}`);

	// Initial things
	useEffect(() => {
		// if (columnEl) {
		// 	columnEl.style.width = width.desktop + '%';
		// }
		// setColWidth({ ...width });
		colWidthHold.current = { ...width }
		nextColWidthHold.current = { ...nextWidth }
	}, [isSelected, columnEl, rowWidth]);


	// On Resize start get the column width
	// On Resize start get the next column width
	const onResizeStartEvent = () => {
		toggleSelection(false);

		// if (nextClientId !== null) {
		// 	nextColWidth.desktop = parseFloat(nextWidth?.desktop);
		// }

		// setColWidth(width);
		// setNextColWidth(nextColWidth);
		setIsResizing(true);
	}

	// Calculate difference(%) in onResize
	// If col and nextCol width is equal and more then MINWIDTH, then set current and next width in placeholder
	const onResize = (event, direction, elt, delta) => {
		const difference = calcPercentage(delta.width, rowWidth);
		const calWidth = colWidthHold.current.desktop + difference;

		let nextBlockWidth = 0;
		// If direction right then update next and current column
		if (nextColumnEl && nextClientId !== null) {
			// nextBlockWidth = parseFloat(nextColWidth.desktop) - difference;
			nextBlockWidth = parseFloat(nextColWidthHold.current.desktop) - difference;


			if (nextBlockWidth >= MINWIDTH && calWidth >= MINWIDTH) {
				nextBlockWidth = Math.abs(nextBlockWidth);
				// nextColumnEl.style.width = toFixed(nextBlockWidth) + '%';
				updateAttributes(nextClientId, { width: { ...nextWidth, desktop: nextBlockWidth } });
				// nextColWidthHold.current = { ...nextWidth, desktop: nextBlockWidth }
			}
		}

		if (nextBlockWidth >= MINWIDTH && calWidth >= MINWIDTH) {
			// if (columnEl) {
			// 	columnEl.style.width = toFixed(calWidth) + '%';
			// }
			setAttributes({ width: { ...width, desktop: calWidth } });
			// colWidthHold.current = { ...colWidth, desktop: calWidth };
			// colWidthHold.current = { ...width, desktop: calWidth };
		}
	}

	// console.log(colWidthHold.current)

	// console.log({ currentIndex, width, nextWidth, colWidthHold: colWidthHold.current, nextColWidthHold: nextColWidthHold.current })

	// Set current and next column width from placeholder in onResizeStop
	const onResizeStop = () => {
		toggleSelection(true);
		setIsResizing(false);
		colWidthHold.current = { ...width }
		nextColWidthHold.current = { ...nextWidth }
		// setAttributes({ width: colWidthHold.current });
		// updateAttributes(nextClientId, { width: nextColWidthHold.current });
		// setNextColWidth(nextColWidthHold.current);
	}

	// Update columns width base on add or remove
	const updateColumns = type => {
		const newColumns = type === 'add' ? columns + 1 : columns - 1;
		const columnFixedWidth = 100 / newColumns;
		// const equalWidth = { ...colWidth, desktop: columnFixedWidth };
		const equalWidth = { ...width, desktop: columnFixedWidth };

		let newInnerBlocks = [...parentInnerBlocks];
		if (type === 'delete') {
			newInnerBlocks.splice(currentIndex, 1);
		} else {
			newInnerBlocks.splice(currentIndex + 1, 0, createBlock('b-blocks/column', { width: equalWidth }));
		}

		replaceInnerBlocks(parentBlockId, newInnerBlocks);
	}

	// Update column width on width change form sidebar
	const updateColumnWidth = (device, val) => {
		if ('desktop' !== device) {
			setAttributes({ width: { ...width, [device]: val } });
			return;
		}
		if (val < MINWIDTH) {
			return;
		}

		const difference = val - width.desktop;

		let nextBlockWidth = {};
		if (nextColumnEl && nextClientId !== null) {
			nextBlockWidth = { ...nextWidth };
			nextBlockWidth.desktop = parseFloat(nextBlockWidth.desktop) - difference;

			if (nextBlockWidth.desktop >= MINWIDTH && val >= MINWIDTH) {
				// nextColumnEl.style.width = toFixed(Math.abs(nextBlockWidth.desktop)) + '%';
				updateAttributes(nextClientId, { width: { ...nextBlockWidth } });
				// setNextColWidth({ ...nextBlockWidth });
				nextColWidthHold.current = { ...nextBlockWidth };
			}
		}

		if (nextBlockWidth.desktop >= MINWIDTH && val >= MINWIDTH) {
			const newWidth = Math.abs(val);

			// if (columnEl) {
			// 	columnEl.style.width = toFixed(newWidth) + '%';
			// }

			setAttributes({ width: { ...width, desktop: newWidth } });
			// setColWidth({ ...colWidth, desktop: newWidth });
			colWidthHold.current = { ...colWidthHold.current, desktop: newWidth };
		}
	}

	return <>
		<Settings {...props} {...{ attributes, setAttributes, nextClientId, columns, updateColumns, updateColumnWidth, MINWIDTH }} />

		<div {...useBlockProps()} >
			<div className={'wp-block-b-blocks-column'} id={id}>
				<Style attributes={attributes} id={`block-${clientId}`} />

				<ResizableBox
					className={isResizing ? `${colPrefix}Resizing` : ''}
					enable={{
						top: false,
						right: nextClientId ? true : false,
						bottom: false,
						left: false,
						topRight: false,
						bottomRight: false,
						bottomLeft: false,
						topLeft: false,
					}}
					onResize={(event, direction, elt, delta) => onResize(event, direction, elt, delta)}
					onResizeStop={(event, direction, elt, delta) => onResizeStop(event, direction, elt, delta)}
					onResizeStart={(event, direction, elt) => onResizeStartEvent(event, direction, elt)}
					size={{ width: 'auto', height: '100%' }}
					style={{ transition: 'all .2s ease' }}
					minWidth={(rowWidth / MINWIDTH) - getInt(columnGap || '0px')}
				>
					<div className={colPrefix} style={innerBlocks?.length === 0 ? { padding: '10px', background: '#fff' } : {}}>
						<InnerBlocks renderAppender={() => !innerBlocks?.length ? <InnerBlocks.ButtonBlockAppender className='columnEmpty' /> : <InnerBlocks.DefaultBlockAppender />} />
					</div>
				</ResizableBox>

				<span className='widthPlaceholder'>{isSelected && toFixed(width?.desktop)}</span>
				{/* <span className='widthPlaceholder'>{isResizing ? toFixed(colWidthHold?.current?.desktop) : isSelected && toFixed(width?.desktop)}</span> */}
			</div>
		</div>
	</>;
};
export default compose(
	withSelect((select, props) => {
		const { clientId } = props;
		const { getBlocks, getBlockParents, getBlockIndex, getBlockAttributes, getPreviousBlockClientId, getNextBlockClientId } = select('core/block-editor');

		const parentBlockId = getBlockParents(clientId)[0];
		const parentBlockEl = document.querySelector(`#${rowPrefix}-${parentBlockId}`);
		const parentWidth = parentBlockEl ? getComputedStyle(parentBlockEl.querySelector(`.${rowPrefix}`), null).getPropertyValue('width') : '0px';

		const nextClientId = getNextBlockClientId(clientId);
		const prevClientId = getPreviousBlockClientId(clientId);

		return {
			parentBlockId,
			rowWidth: getInt(parentWidth),
			parentInnerBlocks: getBlocks(parentBlockId),
			currentIndex: getBlockIndex(clientId, parentBlockId),
			innerBlocks: getBlocks(clientId),
			nextClientId,
			nextWidth: getBlockAttributes(nextClientId)?.width,
			prevClientId,
			prevWidth: getBlockAttributes(prevClientId)?.width
		};
	}),

	withDispatch((dispatch) => {
		return {
			updateAttributes: (id, args) => dispatch('core/block-editor').updateBlockAttributes(id, args)
		}
	})
)(Edit);
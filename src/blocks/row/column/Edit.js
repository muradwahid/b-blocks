import { createBlock } from '@wordpress/blocks';
import { useState, useEffect, useRef } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect, dispatch, withDispatch } from '@wordpress/data';
import { InnerBlocks } from '@wordpress/block-editor';
import { ResizableBox } from '@wordpress/components';
const { replaceInnerBlocks } = dispatch('core/block-editor');

import Settings from './Settings';
import Style from './Style';
import { calcPercentage, getInt, twoFixed } from '../functions';

const initialWidth = { mobile: 100, tablet: 50, desktop: 33.33 }

const Edit = props => {
	const { className, attributes, context, setAttributes, clientId, isSelected, toggleSelection, parentBlockId, rowWidth, innerBlocks, currentIndex, nextClientId, nextWidth, prevClientId, prevWidth, updateAttributes } = props;
	const { width } = attributes;
	const columns = context['b-blocks/rowColumns'];

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const [absWidth, setAbsWidth] = useState(0);
	const [colWidth, setColWidth] = useState(initialWidth);
	const [nextColWidth, setNextColWidth] = useState(nextWidth);
	const [prevColWidth, setPrevColWidth] = useState(initialWidth);
	const [isResizing, setIsResizing] = useState(false);
	const [maxResizeWidth, setMaxResizeWidth] = useState(0);

	const colWidthHold = useRef(width);
	const nextColWidthHold = useRef(nextWidth);

	const columnEl = document.querySelector(`#block-${clientId}`);
	const nextColumnEl = document.querySelector(`#block-${nextClientId}`);

	// Max Resize width
	useEffect(() => {
		if (columnEl) {
			columnEl.style.width = width.desktop + '%';
		}
		setMaxResizeWidth(rowWidth);
		setColWidth({ ...width });
		colWidthHold.current = { ...width }
		nextColWidthHold.current = { ...nextWidth }
	}, [isSelected, columnEl, rowWidth]);


	// On Resize start get the previous|next column width
	// Calculate current column resize box based on row/parent element width
	// Set resize box maxWidth by (next|prev+current) colum width
	const onResizeStartEvent = (direction) => {
		toggleSelection(false);

		if (nextClientId !== null) {
			nextColWidth.desktop = parseFloat(nextWidth?.desktop);
		}
		if (prevClientId !== null) {
			prevColWidth.desktop = parseFloat(prevWidth?.desktop);
		}
		let maxResizeWidthHold = 0;
		if (direction === 'right' && nextClientId !== null) {
			const resizeNextColWidth = (nextColWidth.desktop / 100) * rowWidth - 100;
			const resizeCurrentColWidth = (colWidth.desktop / 100) * rowWidth;
			maxResizeWidthHold = resizeNextColWidth + resizeCurrentColWidth;
		}
		if (direction === 'left' && prevClientId !== null) {
			const resizePrevColWidth = (prevColWidth.desktop / 100) * rowWidth - 100;
			const resizeCurrentColWidth = (colWidth.desktop / 100) * rowWidth;
			maxResizeWidthHold = resizePrevColWidth + resizeCurrentColWidth;
		}

		// Every time select resize handler set the width
		let columnRect = {};
		if (columnEl) {
			columnRect = columnEl.getBoundingClientRect();
		}

		setColWidth(width);
		setNextColWidth(nextColWidth);
		setPrevColWidth(prevColWidth);
		setMaxResizeWidth(maxResizeWidthHold);
		setIsResizing(true);
		setAbsWidth(columnRect.width || 0);
	}

	// Update column and resize box width onResize

	// If direction is Right then update next and current column width
	// Calculate column width by (next+current)/100

	// If direction is left then update prev and current column width
	// Calculate column width by (prev+current)/100
	const onResize = (event, direction, elt, delta) => {
		const currentBlockWidth = absWidth + delta.width;
		const calWidth = calcPercentage(currentBlockWidth, rowWidth);
		const difference = parseFloat(colWidth.desktop) - calWidth;

		let nextBlockWidth = 0;
		// If direction right then update next and current column
		if (direction === 'right' && nextColumnEl && nextClientId !== null) {
			nextBlockWidth = parseFloat(nextColWidth.desktop) + difference;

			if (nextBlockWidth >= 10 && calWidth >= 10) {
				nextBlockWidth = Math.abs(nextBlockWidth);
				nextColumnEl.style.width = twoFixed(nextBlockWidth) + '%';
				updateAttributes(nextClientId, { width: { ...nextWidth, desktop: twoFixed(nextBlockWidth) } });
				nextColWidthHold.current = { ...nextWidth, desktop: twoFixed(nextBlockWidth) }
			}
		}

		if (nextBlockWidth >= 10 && calWidth >= 10) {
			if (columnEl) {
				columnEl.style.width = twoFixed(calWidth) + '%';
			}
			colWidthHold.current = { ...colWidth, desktop: twoFixed(calWidth) };
		}
	}

	// console.log({ currentIndex, width: width.desktop, colWidth: colWidth.desktop, nextWidth: nextWidth?.desktop, nextColWidth: nextColWidth?.desktop });

	// On resize stop
	const onResizeStop = () => {
		toggleSelection(true);
		setIsResizing(false);
		setAttributes({ width: colWidthHold.current });
		setNextColWidth(nextColWidthHold.current);
	}

	// Update columns width base on add or remove
	const updateColumns = type => {
		const newColumns = type === 'add' ? columns + 1 : columns - 1;
		const columnFixedWidth = twoFixed(100 / newColumns);
		const equalWidth = { ...colWidth, desktop: columnFixedWidth };

		let newInnerBlocks = [...innerBlocks];
		if (type === 'delete') {
			newInnerBlocks.splice(currentIndex, 1);
		} else {
			newInnerBlocks.splice(currentIndex + 1, 0, createBlock('b-blocks/column', { width: equalWidth }));
		}

		replaceInnerBlocks(parentBlockId, newInnerBlocks);
	}

	const updateColumnWidth = (device, val) => {
		if ('desktop' !== device) {
			setAttributes({ width: { ...width, [device]: val } });
			return;
		}
		if (val < 10) {
			return;
		}

		const difference = twoFixed(val - width.desktop);

		let nextColumnNewWidth = {};
		if (nextColumnEl && nextClientId !== null) {
			nextColumnNewWidth = { ...nextWidth };
			nextColumnNewWidth.desktop = parseFloat(nextColumnNewWidth.desktop) - difference;

			if (nextColumnNewWidth.desktop >= 10 && val >= 10) {
				nextColumnEl.style.width = twoFixed(Math.abs(nextColumnNewWidth.desktop)) + '%';
				updateAttributes(nextClientId, { width: { ...nextColumnNewWidth } });
				setNextColWidth({ ...nextColumnNewWidth });
				nextColWidthHold.current = { ...nextColumnNewWidth };
			}
		}

		if (nextColumnNewWidth.desktop >= 10 && val >= 10) {
			const newWidth = Math.abs(val);

			if (columnEl) {
				columnEl.style.width = twoFixed(newWidth) + '%';
			}

			setAttributes({ width: { ...width, desktop: twoFixed(newWidth) } });
			setColWidth({ ...colWidth, desktop: twoFixed(newWidth) });
			colWidthHold.current = { ...colWidthHold.current, desktop: twoFixed(newWidth) };
		}
	}

	return <>
		<Settings {...props} {...{ attributes, setAttributes, nextClientId, columns, updateColumns, updateColumnWidth }} />

		<div className={className} id={`bBlocksColumn-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} isBackend={true} />

			<ResizableBox
				className={isResizing ? 'bBlocksColumnResizing' : ''}
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
				minHeight={10}
				onResize={(event, direction, elt, delta) => onResize(event, direction, elt, delta)}
				onResizeStop={(event, direction, elt, delta) => onResizeStop(event, direction, elt, delta)}
				onResizeStart={(event, direction, elt) => onResizeStartEvent(event, direction, elt)}
				size={{ width: 'auto', height: '100%' }}
				style={{ transition: 'all .2s ease' }}
			>
				<div className='bBlocksColumnWrap'>
					<div className='bBlocksColumn'>
						<InnerBlocks />
					</div>
				</div>
			</ResizableBox>

			<span className='widthPlaceholder'>{isResizing ? twoFixed(colWidthHold?.current?.desktop) : isSelected && twoFixed(width?.desktop)}</span>
		</div>
	</>;
};
export default compose(
	withSelect((select, props) => {
		const { clientId } = props;
		const { getBlocks, getBlockParents, getBlockIndex, getBlockAttributes, getPreviousBlockClientId, getNextBlockClientId } = select('core/block-editor');
		// const columns = context['b-blocks/rowColumns'];
		// const columnGap = context['b-blocks/rowColumnGap'];
		// const totalGap = getInt(columnGap) * (columns - 1);

		const parentBlockId = getBlockParents(clientId)[0];
		const parentBlockEl = document.querySelector(`#block-${parentBlockId}`);
		const parentWidth = parentBlockEl ? getComputedStyle(parentBlockEl.querySelector(`.bBlocksRow`), null).getPropertyValue('width') : '0px';

		const nextClientId = getNextBlockClientId(clientId);
		const prevClientId = getPreviousBlockClientId(clientId);

		return {
			parentBlockId,
			rowWidth: getInt(parentWidth),
			innerBlocks: getBlocks(parentBlockId),
			currentIndex: getBlockIndex(clientId, parentBlockId),
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
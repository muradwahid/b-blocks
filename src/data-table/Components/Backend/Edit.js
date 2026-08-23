import { BlockControls, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { DropdownMenu, ToolbarGroup, ToolbarButton, __experimentalNumberControl as NumberControl, CheckboxControl } from '@wordpress/components';
import { useSelect, useDispatch, withSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { tableRowBefore, tableRowAfter, tableColumnBefore, tableColumnAfter, seen, unseen } from '@wordpress/icons';
import { useState, useRef, useEffect } from 'react';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import { TableActionIcon } from '../../utils/icons';
import { Button } from '../../../../../bpl-tools/Components';
import { buildDtConfig } from '../../utils/datatables';

import { tableIcon } from '../../../utils/blocksIcon';

const Edit = props => {
	const { attributes, setAttributes, clientId, device, innerBlocks } = props;
	const [row, setRow] = useState(3)
	const [column, setColumn] = useState(3)
	const [isPreview, setIsPreview] = useState(false)

	const editorWrapperRef = useRef(null)
	const previewContainerRef = useRef(null)
	const dtEditorInstance = useRef(null)

	useEffect(() => {
		if (!isPreview) return

		let cancelled = false

		const buildCleanTable = () => {
			const srcTable = editorWrapperRef.current?.querySelector('table')
			if (!srcTable) return null

			const clone = srcTable.cloneNode(true)
			clone.className = 'b-blocks-table-main-container'

			// Remove <style> tags (from block Style components) and Gutenberg UI chrome
			clone.querySelectorAll(
				'style, .block-list-appender, .block-editor-block-appender, ' +
				'[class*="open-parent-settings"], .components-popover'
			).forEach(el => el.remove())

			// For each cell, pull content out of the inner-blocks layout wrapper.
			// This preserves images, lists, headings — any block inside the cell.
			clone.querySelectorAll('td, th').forEach(cell => {
				const layout = cell.querySelector('.block-editor-block-list__layout')
				if (layout) {
					layout.querySelectorAll(
						'.block-list-appender, .block-editor-block-appender'
					).forEach(el => el.remove())
					cell.innerHTML = layout.innerHTML
				}
			})

			// Strip Gutenberg-specific attributes and classes from every element
			const editorAttrs = [
				'contenteditable', 'data-block', 'data-type', 'data-title',
				'tabindex', 'aria-label', 'aria-multiline', 'aria-autocomplete',
			]
			clone.querySelectorAll('*').forEach(el => {
				editorAttrs.forEach(attr => el.removeAttribute(attr))
				// el.className is SVGAnimatedString for SVG nodes, not a plain string.
				// getAttribute/setAttribute work correctly for both HTML and SVG.
				const cls = el.getAttribute('class')
				if (cls) {
					el.setAttribute('class', cls
						.split(/\s+/)
						.filter(c => c &&
							// Keep wp-block-b-blocks-* — the block's own styling classes.
							// Only remove the generic 'wp-block' marker and editor-only classes.
							c !== 'wp-block' &&
							!c.startsWith('block-editor') &&
							!c.startsWith('is-selected') &&
							!c.startsWith('is-hovered') &&
							!c.startsWith('is-highlighted') &&
							!c.startsWith('has-child-selected')
						)
						.join(' ')
					)
				}
			})

			return clone
		}

		const run = async () => {
			const dt = attributes.datatables
			const loads = [import('datatables.net')]
			let jsZipIdx = -1, pdfMakeIdx = -1, pdfFontsIdx = -1
			if (dt?.responsive) loads.push(import('datatables.net-responsive'))
			if (dt?.fixedHeader) loads.push(import('datatables.net-fixedheader'))
			if (dt?.buttons?.enabled) {
				loads.push(import('datatables.net-buttons/js/dataTables.buttons'))
				if (dt.buttons.csv || dt.buttons.excel || dt.buttons.pdf) {
					loads.push(import('datatables.net-buttons/js/buttons.html5'))
				}
				if (dt.buttons.print) loads.push(import('datatables.net-buttons/js/buttons.print'))
				if (dt.buttons.colvis) loads.push(import('datatables.net-buttons/js/buttons.colVis'))
				if (dt.buttons.excel) { jsZipIdx = loads.length; loads.push(import('jszip')) }
				if (dt.buttons.pdf) {
					pdfMakeIdx = loads.length; loads.push(import('pdfmake/build/pdfmake'))
					pdfFontsIdx = loads.length; loads.push(import('pdfmake/build/vfs_fonts'))
				}
			}
			if (dt?.select?.enabled) loads.push(import('datatables.net-select'))

			const results = await Promise.all(loads)
			if (cancelled) return
			const [{ default: DataTable }] = results

			if (jsZipIdx >= 0) DataTable.Buttons.jszip(results[jsZipIdx].default)
			if (pdfMakeIdx >= 0) {
				const pdfMake = results[pdfMakeIdx].default
				const pdfFonts = results[pdfFontsIdx]
				pdfMake.vfs = pdfFonts?.pdfMake?.vfs ?? pdfFonts?.default?.pdfMake?.vfs ?? pdfFonts?.default ?? pdfFonts
				DataTable.Buttons.pdfMake(pdfMake)
			}

			const cleanTable = buildCleanTable()
			if (!cleanTable || cancelled) return

			previewContainerRef.current.innerHTML = ''
			previewContainerRef.current.appendChild(cleanTable)

			const cfg = buildDtConfig(dt, true)
			if (cfg) {
				dtEditorInstance.current = new DataTable(cleanTable, cfg)
				cleanTable.style.setProperty(
					'border-collapse',
					attributes?.content?.cellBorderType || 'collapse',
					'important'
				)
			}
		}

		// eslint-disable-next-line no-console
		run().catch(err => console.warn('b-blocks/table preview:', err))
		return () => {
			cancelled = true
			if (dtEditorInstance.current) {
				dtEditorInstance.current.destroy()
				dtEditorInstance.current = null
			}
			if (previewContainerRef.current) {
				previewContainerRef.current.innerHTML = ''
			}
		}
	}, [isPreview, attributes.datatables])

	const { options } = attributes

	const generateCells = (tagName = 'td', className = '') => Array.from({ length: column }, () => ['b-blocks/table-cell', { tagName, className }]);
	const generateRows = Array.from({ length: row }, () => ['b-blocks/table-row', {}, generateCells('td')]);

	const TEMPLATE = [
		options.isEnableHeader ? ['b-blocks/table-head', {}, [['b-blocks/table-row', {}, generateCells('th', 'b-blocks-table-head-cell')]]] : null,
		['b-blocks/table-body', {}, generateRows],
		options.isEnableFooter ? ['b-blocks/table-footer', {}, [['b-blocks/table-row', {}, generateCells('td', 'b-blocks-table-footer-cell')]]] : null,
	].filter(Boolean);

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(
		{ tagName: 'table', className: 'b-blocks-table-main-container' },
		{
			template: TEMPLATE,
			templateLock: false,
			renderAppender: false,
			allowedBlocks: ['b-blocks/table-body', 'b-blocks/table-head', 'b-blocks/table-footer'],
		}
	);

	const childBlocks = useSelect(
		select => select('core/block-editor').getBlocks(clientId),
		[clientId]
	);

	const { insertBlock, removeBlock, replaceInnerBlocks } = useDispatch('core/block-editor');

	// Derive the body section and current column count from live block state
	const bodyBlock = childBlocks.find(b => b.name === 'b-blocks/table-body');
	const headBlock = childBlocks.find(b => b.name === 'b-blocks/table-head');
	const footerBlock = childBlocks.find(b => b.name === 'b-blocks/table-footer');
	const columnCount = bodyBlock?.innerBlocks[0]?.innerBlocks?.length || column;

	const makeRow = (tagName = 'td', className = '') => {
		const cells = Array.from({ length: columnCount }, () => createBlock('b-blocks/table-cell', { tagName, className }));
		return createBlock('b-blocks/table-row', {}, cells);
	};

	const handleToggleHeader = (val) => {
		updateObj('options', val, 'isEnableHeader');
		if (!val && headBlock) {
			removeBlock(headBlock.clientId, false);
		} else if (val && !headBlock) {
			insertBlock(createBlock('b-blocks/table-head', {}, [makeRow('th', 'b-blocks-table-head-cell')]), 0, clientId, false);
		}
	};

	const handleToggleFooter = (val) => {
		updateObj('options', val, 'isEnableFooter');
		if (!val && footerBlock) {
			removeBlock(footerBlock.clientId, false);
		} else if (val && !footerBlock) {
			insertBlock(createBlock('b-blocks/table-footer', {}, [makeRow('td', 'b-blocks-table-footer-cell')]), childBlocks.length, clientId, false);
		}
	};

	const generateTable = () => {
		const cols = Number(column) || 1;
		const rows = Number(row) || 1;
		const makeCells = (tagName, className = '') =>
			Array.from({ length: cols }, () => createBlock('b-blocks/table-cell', { tagName, ...(className && { className }) }));

		const blocks = [
			options.isEnableHeader
				? createBlock('b-blocks/table-head', {}, [createBlock('b-blocks/table-row', {}, makeCells('th', 'b-blocks-table-head-cell'))])
				: null,
			createBlock('b-blocks/table-body', {},
				Array.from({ length: rows }, () => createBlock('b-blocks/table-row', {}, makeCells('td')))
			),
			options.isEnableFooter
				? createBlock('b-blocks/table-footer', {}, [createBlock('b-blocks/table-row', {}, makeCells('td', 'b-blocks-table-footer-cell'))])
				: null,
		].filter(Boolean);

		replaceInnerBlocks(clientId, blocks, false);
	};

	const addTopRow = () => {
		if (!bodyBlock) return;
		insertBlock(makeRow('td'), 0, bodyBlock.clientId, false);
	};

	const insertBottomRow = () => {
		if (!bodyBlock) return;
		insertBlock(makeRow('td'), bodyBlock.innerBlocks.length, bodyBlock.clientId, false);
	};

	// For column ops, iterate every row across all sections and insert/append a cell
	const insertLeftColumn = () => {
		childBlocks.forEach(section => {
			section.innerBlocks.forEach(row => {
				const tagName = row.innerBlocks[0]?.attributes?.tagName || 'td';
				insertBlock(createBlock('b-blocks/table-cell', { tagName }), 0, row.clientId, false);
			});
		});
	};

	const addRightColumn = () => {
		childBlocks.forEach(section => {
			section.innerBlocks.forEach(row => {
				const lastCell = row.innerBlocks[row.innerBlocks.length - 1];
				const tagName = lastCell?.attributes?.tagName || 'td';
				insertBlock(
					createBlock('b-blocks/table-cell', { tagName }),
					row.innerBlocks.length,
					row.clientId,
					false
				);
			});
		});
	};

	const menuControls = [
		{ title: 'Add Top Row', icon: tableRowBefore, onClick: addTopRow },
		{ title: 'Insert Bottom Row', icon: tableRowAfter, onClick: insertBottomRow },
		{ title: 'Insert Left Column', icon: tableColumnBefore, onClick: insertLeftColumn },
		{ title: 'Add Right Column', icon: tableColumnAfter, onClick: addRightColumn },
	];

	const updateObj = updateAttributes(attributes, setAttributes);

	return <>
		<Settings {...{ attributes, setAttributes, updateObj, device, handleToggleHeader, handleToggleFooter }} />
		<Style attributes={attributes} id={`block-${clientId}`} />



		<BlockControls>
			<ToolbarGroup>
				<DropdownMenu
					icon={<TableActionIcon />}
					label='Table Actions'
					controls={menuControls}
					className='b-blocks-table-action-menu'
				/>
				<ToolbarButton
					icon={isPreview ? unseen : seen}
					label={isPreview ? 'Exit Preview' : 'Preview DataTables'}
					onClick={() => setIsPreview(v => !v)}
					isActive={isPreview}
					disabled={!attributes.datatables?.enabled || innerBlocks.length === 0}
				/>
			</ToolbarGroup>
		</BlockControls>

		<div {...blockProps}>
			{innerBlocks.length === 0 && <div className='b-blocks-table-input-form-wrapper'>
				<div className='b-blocks-table-input-form-title-wrapper'>
					{tableIcon}
					<h2>Table</h2>
				</div>
				<p className="b-blocks-table-input-form-description">Start creating a custom table for your content</p>

				<div className="b-blocks-table-input-field-wrapper">
					<div className='b-blocks-table-row-column-field'>
						<span>Rows</span>
						<NumberControl value={row} onChange={(val) => setRow(val)} />
					</div>
					<div className='b-blocks-table-row-column-field'>
						<span>Columns</span>
						<NumberControl value={column} onChange={(val) => setColumn(val)} />
					</div>
				</div>

				<div className="b-blocks-table-input-field-checkbox-wrapper">
					<CheckboxControl label='Include Header' checked={options.isEnableHeader} onChange={(val) => updateObj('options', val, 'isEnableHeader')} />
					<CheckboxControl label='Include Footer' checked={options.isEnableFooter} onChange={(val) => updateObj('options', val, 'isEnableFooter')} />
				</div>
				<Button onClick={generateTable}>Generate Table</Button>
			</div>}
			{innerBlocks.length > 0 && <>
				<div ref={editorWrapperRef} style={{ display: isPreview ? 'none' : undefined }}>
					<table {...innerBlocksProps}></table>
				</div>
				{isPreview && <div ref={previewContainerRef} className='b-blocks-dt-editor-preview' />}
			</>}
		</div>
	</>;
};

export default withSelect((select, { clientId }) => {
	const { getDeviceType } = select('core/editor');
	const { getBlocks } = select('core/block-editor');
	return {
		device: getDeviceType()?.toLowerCase(),
		innerBlocks: getBlocks(clientId),
	};
})(Edit);
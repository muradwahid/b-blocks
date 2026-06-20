import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, Notice } from '@wordpress/components';
import { useMemo } from '@wordpress/element';

const slugifyLabel = (label) => {
	if (!label) return '';
	return String(label)
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '') || 'cat';
};

const PARENT_BLOCK = 'b-blocks/content-filter';

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;
	const { category } = attributes;

	// Walk up the block tree to find the parent Content Filter block, so we
	// can read its `categories` attribute and populate the SelectControl
	// with the live list of category options.
	const parentCategories = useSelect(
		(select) => {
			const { getBlockParentsByBlockName, getBlock } = select('core/block-editor');
			const parents = getBlockParentsByBlockName(clientId, PARENT_BLOCK);
			if (!parents || parents.length === 0) return [];
			// Closest parent is last entry in the array.
			const parentClientId = parents[parents.length - 1];
			const parentBlock = getBlock(parentClientId);
			if (!parentBlock || !parentBlock.attributes) return [];
			const raw = parentBlock.attributes.categories;
			return Array.isArray(raw) ? raw : [];
		},
		[clientId]
	);

	const options = useMemo(() => {
		const seen = new Set();
		const opts = [{ label: __('— Select category —', 'b-blocks'), value: '' }];
		parentCategories.forEach((cat) => {
			const label = String(cat || '').trim();
			if (!label) return;
			const slug = slugifyLabel(label);
			if (seen.has(slug)) return;
			seen.add(slug);
			opts.push({ label, value: slug });
		});
		return opts;
	}, [parentCategories]);

	// Auto-recover: if the saved category is no longer in the parent's list
	// (e.g. it was renamed), keep the value but warn the editor.
	const categoryExists = useMemo(() => {
		if (!category) return true;
		return options.some((o) => o.value === category);
	}, [options, category]);

	const blockProps = useBlockProps({
		className: 'bb-cf-item',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Filter Item', 'b-blocks')} initialOpen={true}>
					{options.length <= 1 && (
						<Notice status='warning' isDismissible={false}>
							{__('Add categories to the parent Content Filter block first, then return here to assign this item to one of them.', 'b-blocks')}
						</Notice>
					)}
					<SelectControl
						label={__('Category', 'b-blocks')}
						help={__('This item will appear when this category is selected (or "All").', 'b-blocks')}
						value={category || ''}
						options={options}
						onChange={(val) => setAttributes({ category: val })}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					{!categoryExists && (
						<Notice status='warning' isDismissible={false}>
							{__('The saved category is no longer in the parent\'s list. Pick a different one or restore the parent category.', 'b-blocks')}
						</Notice>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps} data-bb-cf-category={category || ''}>
				<div className='bb-cf-item__label' aria-hidden='true'>
					{category
						? options.find((o) => o.value === category)?.label || category
						: __('Uncategorized', 'b-blocks')}
				</div>
				<InnerBlocks
					template={[
						['core/heading', { level: 3, content: __('Item Title', 'b-blocks') }],
						['core/paragraph', { content: __('Add any blocks inside this filterable item.', 'b-blocks') }],
					]}
					templateLock={false}
				/>
			</div>
		</>
	);
};

export default Edit;

import { __ } from '@wordpress/i18n';
import { Button, TextControl } from '@wordpress/components';

import { slugify } from './slugify';

/**
 * Sidebar categories repeater for the Portfolio Gallery block.
 *
 * Stores an array of plain string labels. Slugs are derived at render
 * time via slugify (matches PHP `sanitize_title()`). Renaming a
 * category does NOT automatically retag items — but if the new label
 * produces a different slug, items whose `categorySlug` points at the
 * old slug will silently fall off the filter (which mirrors the
 * documented behavior in RESEARCH.md).
 *
 * Capped at 20 categories.
 */
const MAX_CATEGORIES = 20;

const CategoriesRepeater = ({ value = [], onChange }) => {
	const list = Array.isArray(value) ? value : [];

	const updateAt = (index, next) => {
		const copy = list.map((row, i) => (i === index ? next : row));
		onChange(copy);
	};

	const removeAt = (index) => {
		const copy = list.filter((_, i) => i !== index);
		onChange(copy);
	};

	const moveItem = (from, to) => {
		if (to < 0 || to >= list.length) return;
		const copy = list.slice();
		const [moved] = copy.splice(from, 1);
		copy.splice(to, 0, moved);
		onChange(copy);
	};

	const addRow = () => {
		if (list.length >= MAX_CATEGORIES) return;
		onChange([...list, __('New Category', 'b-blocks')]);
	};

	const atCap = list.length >= MAX_CATEGORIES;

	return (
		<div className='bb-pg-categories'>
			{list.length === 0 && (
				<p className='bb-pg-categories__hint'>
					{__('No categories yet. Add the first one below.', 'b-blocks')}
				</p>
			)}

			{list.map((label, idx) => {
				const slug = slugify(label || '');
				return (
					<div key={idx} className='bb-pg-categories__row'>
						<div className='bb-pg-categories__row-input'>
							<TextControl
								value={label || ''}
								onChange={(val) => updateAt(idx, val)}
								placeholder={__('Category name', 'b-blocks')}
								help={slug ? `${__('Slug', 'b-blocks')}: ${slug}` : ''}
								__nextHasNoMarginBottom
							/>
						</div>
						<Button
							variant='tertiary'
							size='small'
							icon='arrow-up-alt2'
							label={__('Move category up', 'b-blocks')}
							onClick={() => moveItem(idx, idx - 1)}
							disabled={idx === 0}
						/>
						<Button
							variant='tertiary'
							size='small'
							icon='arrow-down-alt2'
							label={__('Move category down', 'b-blocks')}
							onClick={() => moveItem(idx, idx + 1)}
							disabled={idx === list.length - 1}
						/>
						<Button
							variant='tertiary'
							isDestructive
							size='small'
							icon='trash'
							label={__('Remove category', 'b-blocks')}
							onClick={() => removeAt(idx)}
						/>
					</div>
				);
			})}

			<Button
				variant='secondary'
				className='bb-pg-add-category'
				onClick={addRow}
				icon='plus'
				disabled={atCap}
			>
				{atCap
					? __('Maximum 20 categories', 'b-blocks')
					: __('Add Category', 'b-blocks')}
			</Button>
		</div>
	);
};

export default CategoriesRepeater;

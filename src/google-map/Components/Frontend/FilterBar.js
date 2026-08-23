import { __ } from '@wordpress/i18n';

import { P } from '../../utils/data';

/**
 * Category filter chips. Purely presentational — GoogleMap.js owns the active
 * category and re-renders its markers when it changes.
 *
 * Each chip carries its category id as `data-category`; Common/Style.js keys
 * the per-category colours off that, so the palette stays in the stylesheet
 * instead of becoming inline styles.
 */
const FilterBar = ({ categories = [], filterBar = {}, active = '', onChange = () => { } }) => {
	if (!categories.length) return null;

	const { showAll = true, allLabel = '' } = filterBar;

	const chips = showAll
		? [{ id: '', label: allLabel || __('All', 'b-blocks') }, ...categories]
		: categories;

	return (
		<div className={`${P}-filter-bar`} role='group' aria-label={__('Filter map locations by category', 'b-blocks')}>
			{chips.map((chip) => {
				const isActive = active === chip.id;

				return (
					<button
						key={chip.id || 'all'}
						type='button'
						className={`${P}-filter-chip${isActive ? ' active' : ''}`}
						data-category={chip.id || ''}
						aria-pressed={isActive}
						onClick={() => onChange(chip.id)}
					>
						{chip.id ? <span className={`${P}-filter-dot`} aria-hidden='true' /> : null}
						{chip.label}
					</button>
				);
			})}
		</div>
	);
};
export default FilterBar;

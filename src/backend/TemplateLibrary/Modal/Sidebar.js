import { useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';

import { debounce } from '../../../../../bpl-tools/utils/functions';

const Sidebar = ({ main, mainLoading, setTemplates, type, category, setCategory, access, setAccess, accessCounts, setPageNumber, setSearch }) => {
	const handleSearch = useMemo(() => debounce((sq) => {
		setSearch(sq);
		setPageNumber(1);
		setTemplates([]);
	}, 600), []);

	const handleInputChange = (e) => handleSearch(e.target.value);

	const { 'patterns-category': patternsCats = [], 'pages-category': pagesCats = [] } = main || {};
	const cats = 'pages' === type ? pagesCats : patternsCats;

	// Accurate aggregate counts come from accessCounts (server-tallied); until
	// it loads, fall back to the taxonomy ("free" === total − pro).
	const ac = accessCounts;
	const taxTotal = (main?.type || []).find((t) => t.name === type)?.count;
	const taxPro = (cats || []).find((c) => c.name === 'pro')?.count ?? 0;
	const taxFree = Number.isFinite(taxTotal) ? taxTotal - taxPro : undefined;

	const totalAll = ac ? ac.all : taxTotal;
	const totalFree = ac ? ac.free : taxFree;
	const totalPro = ac ? ac.pro : taxPro;

	// "All" reflects the active access filter.
	const allCount = 'pro' === access ? totalPro : 'free' === access ? totalFree : totalAll;

	// Accurate per-category count for the active access selection.
	const catCount = (name) => {
		if (ac) {
			const c = ac.categories?.[name];
			if (!c) return undefined;
			return 'pro' === access ? c.pro : 'free' === access ? c.free : c.total;
		}
		// Taxonomy fallback is only correct for the unfiltered view.
		return 'all' === access ? (cats || []).find((c) => c.name === name)?.count : undefined;
	};

	// Content categories (`pro`/`free` live in the access filter). Always show
	// the full list — the count badge reflects the active access filter (zero
	// counts are hidden), so the list never collapses.
	const contentCats = (cats || []).filter((c) => 'free' !== c.name && 'pro' !== c.name);
	const categories = [{ label: __('All', 'b-blocks'), name: 'all' }, ...contentCats];

	// Access filter (All / Free / Pro) — combines with any category.
	const accessFilters = [
		{ name: 'all', label: __('All', 'b-blocks') },
		{ name: 'free', label: __('Free', 'b-blocks') },
		{ name: 'pro', label: __('Pro', 'b-blocks') },
	];

	const pickCategory = (name) => {
		setCategory(name);
		setPageNumber(1);
		setTemplates([]);
	};

	const toggleAccess = (name) => {
		const next = access === name ? 'all' : name;
		setAccess(next);
		// The server query only changes when entering/leaving "pro" with no
		// content category active — refetch from page 1 in that case.
		if ('all' === category && ('pro' === access) !== ('pro' === next)) {
			setPageNumber(1);
			setTemplates([]);
		}
	};

	const renderCount = (count) => (Number.isFinite(count) && count > 0 ? <span className='catCount'>{count}</span> : null);

	return (
		<aside className='modalBodySidebar'>
			<div className='modalBodySidebarSearch'>
				<svg onClick={handleInputChange} xmlns='http://www.w3.org/2000/svg' height='16' width='16' viewBox='0 0 512 512'>
					<path d='M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z' />
				</svg>

				<input type='text' placeholder={__('Search templates…', 'b-blocks')} onChange={handleInputChange} />
			</div>

			<div className='modalBodySidebarAccess'>
				{accessFilters.map(({ name, label }) => (
					<button
						key={name}
						className={`is-${name} ${access === name ? 'active' : ''}`}
						onClick={() => toggleAccess(name)}
						aria-pressed={access === name}
					>
						<span className='tick' aria-hidden='true' />
						<span>{label}</span>
					</button>
				))}
			</div>

			<div className='modalBodySidebarHeading'>{__('Categories', 'b-blocks')}</div>

			<div className='modalBodySidebarCategories'>
				{mainLoading ? <div className='bPlPlaceCenter'>
					<Spinner className='bPlSpinner' />
				</div> :
					categories.map(({ name, label }, i) => (
						<button
							key={i}
							className={name === category ? 'active' : ''}
							onClick={() => pickCategory(name)}
						>
							<span className='catLabel' dangerouslySetInnerHTML={{ __html: label }} />
							{renderCount(name === 'all' ? allCount : catCount(name))}
						</button>
					))}
			</div>
		</aside>
	);
};
export default Sidebar;
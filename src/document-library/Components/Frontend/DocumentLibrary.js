import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { categories, fileNameOf, isLocalUrl, labels, byteUnits, sortValues } from '../../utils/common';

import { sanitizeURL } from '../../../../../bpl-tools/utils/common';

import Grid from './Templates/Grid';
import List from './Templates/List';
import DocumentModal from './DocumentModal';
import { searchIcon } from '../../utils/icons';

/**
 * Toolbar (search, type filter, sort), the Grid or List template, paging ("Load more" or page
 * numbers) and the View modal. Shared by the editor and the frontend; everything runs in the browser.
 */
const DocumentLibrary = ({ attributes, assetsUrl = '', isBackend = false, urlKey = '' }) => {
	const { items = [], layout = {}, header = {}, toolbar = {}, itemOptions = {} } = attributes;
	const { showAuthor = false } = itemOptions;
	const { template = 'grid', perPage = 0, paging = 'loadMore' } = layout;
	const { show: showHeader = true, title = '', description = '' } = header;
	const { show: showToolbar = true, showSearch = true, showTypeFilter = true, showSort = true, showCopyList = false, defaultSort = 'default', filterBy = 'type' } = toolbar;

	// On the page (urlKey comes from view.js, never in the editor) the visitor's search, filter, sort and page live in
	// the address, as dl1-q, dl1-type, dl1-sort and dl1-page: a shared link opens the same list and Back returns to it.
	// Read on the first render only.
	const fromUrl = (name) => (urlKey ? new URLSearchParams(window.location.search).get(`${urlKey}-${name}`) : null);
	const [search, setSearch] = useState(() => fromUrl('q') || '');
	const [type, setType] = useState(() => fromUrl('type') || 'all');
	const [sort, setSort] = useState(() => (sortValues.includes(fromUrl('sort')) ? fromUrl('sort') : defaultSort));
	const [limit, setLimit] = useState(Number(perPage) || 0);
	const [page, setPage] = useState(() => Math.max(1, parseInt(fromUrl('page'), 10) || 1));
	// The effects below react to changes, not to the first render (which may come from the address).
	const isMounted = useRef(false);
	const [viewing, setViewing] = useState(null);
	// Unique per library on the page, for the hidden labels of the search and selects.
	const inputId = `b-blocks-document-library-${useId().replace(/:/g, '')}`;
	const rootRef = useRef(null);

	// The editor shows saved content as is, so URLs are checked here as well as in render.php.
	// Extension, file name and kind (file type group) travel with each item, so templates and filters read them directly.
	// Worked out once per list, not on every key typed in the search.
	// `at` (the place in the saved list) keys each card, so sorting and filtering move cards instead of rebuilding them.
	const docs = useMemo(() => items.map((item, at) => ({ item, at })).filter(({ item }) => item?.url && sanitizeURL(item.url) && !item.hidden).map(({ item, at }) => {
		const fileName = item.url.split(/[?#]/)[0].split('/').pop() || '';
		const file = fileName.toLowerCase();
		const ext = file.includes('.') ? file.split('.').pop() : (item.mime || '').split('/').pop();
		const kind = Object.keys(categories).find((key) => categories[key].exts.includes(ext)) || 'others';

		// An emptied title shows the file name, as render.php does on the page.
		const title = String(item.title || '').trim() || fileNameOf(fileName);

		// isLocal: a file from this site (downloads in place, opens in the built-in viewer).
		return { ...item, title, file, ext, kind, at, isLocal: isLocalUrl(item.url) };
	}), [items]);

	// The filter lists file types, or the categories given to the items.
	const isCustom = 'category' === filterBy;
	const present = isCustom ?
		[...new Set(docs.map((doc) => (doc.category || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)) :
		Object.keys(categories).filter((key) => docs.some((doc) => doc.kind === key));

	// Sort values: Media Library items carry raw ones (time, bytes); items added by URL are read
	// from their text. A document with no value sorts last in either direction.
	const valueOf = (doc, key) => {
		if ('date' === key) {
			return doc.time || Date.parse(doc.date) / 1000 || null;
		}
		const [num, unit] = String(doc.size || '').trim().split(/\s+/);
		return doc.bytes || parseFloat(String(num).replace(',', '.')) * (byteUnits[String(unit).toUpperCase()] || 1) || null;
	};

	// Only the controls a visitor can see apply: a search, filter or sort chosen before its control was turned
	// off stops counting, and a filter value the list no longer has (Filter By switched, items removed) is All.
	const hasToolbar = showToolbar && (showSearch || showTypeFilter || showSort || showCopyList);
	const [listCopied, setListCopied] = useState(false);

	// "Copied" shows for two seconds; the timer goes with the block.
	useEffect(() => {
		if (!listCopied) {
			return undefined;
		}
		const timer = setTimeout(() => setListCopied(false), 2000);
		return () => clearTimeout(timer);
	}, [listCopied]);
	const activeType = hasToolbar && showTypeFilter && present.includes(type) ? type : 'all';
	const term = hasToolbar && showSearch ? search.trim().toLowerCase() : '';
	const [sortKey, sortDir] = (hasToolbar && showSort ? sort : defaultSort).split('-');
	const direction = 'desc' === sortDir ? -1 : 1;
	const found = docs
		// Search what a visitor can see (title, description, the author when shown) and the file name, not the site's
		// upload path. The editor knows authors the page does not carry while Author is off.
		.filter((doc) => ('all' === activeType || (isCustom ? (doc.category || '').trim() : doc.kind) === activeType) && ('' === term || `${doc.title} ${doc.description || ''} ${showAuthor ? doc.author || '' : ''} ${doc.file}`.toLowerCase().includes(term)))
		.sort((a, b) => {
			// Featured documents stay on top, in any order.
			if (!!a.featured !== !!b.featured) {
				return a.featured ? -1 : 1;
			}
			if ('name' === sortKey) {
				return String(a.title || '').localeCompare(String(b.title || '')) * direction;
			}
			if ('date' === sortKey || 'size' === sortKey) {
				const va = valueOf(a, sortKey);
				const vb = valueOf(b, sortKey);
				return null === va || null === vb ? (null === va) - (null === vb) : (va - vb) * direction;
			}
			return 0;
		});

	// Back to the start whenever the list or the page size changes.
	useEffect(() => {
		if (!isMounted.current) {
			return;
		}
		setLimit(Number(perPage) || 0);
		setPage(1);
	}, [perPage, paging, search, type, sort, filterBy, items.length]);

	useEffect(() => {
		if (isMounted.current) {
			setSort(defaultSort);
		}
	}, [defaultSort]);

	useEffect(() => {
		isMounted.current = true;
	}, []);

	const size = Number(perPage) || 0;
	const pages = size ? Math.ceil(found.length / size) : 1;

	// A page number from the address that no longer exists (fewer documents now) becomes the last page.
	useEffect(() => {
		if (page > Math.max(1, pages)) {
			setPage(Math.max(1, pages));
		}
	}, [page, pages]);

	// The address follows the list. Replaced, not added: typing a search does not fill the Back history.
	useEffect(() => {
		if (!urlKey) {
			return;
		}
		const url = new URL(window.location.href);
		const set = (name, value, empty) => (value === empty ? url.searchParams.delete(`${urlKey}-${name}`) : url.searchParams.set(`${urlKey}-${name}`, value));
		set('q', term ? search.trim() : '', '');
		set('type', activeType, 'all');
		set('sort', hasToolbar && showSort ? sort : defaultSort, defaultSort);
		set('page', 'numbers' === paging && 1 < page ? String(page) : '', '');
		if (url.href !== window.location.href) {
			window.history.replaceState(window.history.state, '', url);
		}
	}, [urlKey, term, search, activeType, sort, page, paging, defaultSort, hasToolbar, showSort]);
	const visible = !size ? found : 'numbers' === paging ? found.slice((page - 1) * size, page * size) : found.slice(0, limit);
	const Template = 'list' === template ? List : Grid;

	// Page numbers: all of them up to 7, else the first, the last and the ones around the current page.
	const numbers = 7 >= pages ? Array.from({ length: pages }, (_, i) => i + 1) : [...new Set([1, page - 1, page, page + 1, pages])].filter((n) => 1 <= n && n <= pages);

	const goTo = (number) => {
		setPage(number);
		// The new page starts at the top of the list; bring it back on screen.
		const top = rootRef.current?.getBoundingClientRect().top;
		if (!isBackend && 0 > top) {
			rootRef.current.scrollIntoView({ block: 'start' });
		}
	};

	// Why the list is empty: the search, the filter, every document hidden (said in the editor only), or no documents.
	let emptyText = labels.noDocuments;
	if (0 < docs.length) {
		emptyText = '' !== term ? (labels.noMatch || '').replace('%s', search.trim()) : labels.noDocumentsFound;
	} else if (isBackend && items.some((item) => item?.hidden)) {
		emptyText = labels.allHidden;
	}

	return <div ref={rootRef} className={`b-blocks-document-library is-${'list' === template ? 'list' : 'grid'}`}>
		{showHeader && ('' !== title || '' !== description) && <div className='b-blocks-document-library-header'>
			{title && <h2 className='b-blocks-document-library-title'>{title}</h2>}
			{description && <p className='b-blocks-document-library-subtitle'>{description}</p>}
		</div>}

		<div className='b-blocks-document-library-content'>
			{hasToolbar && <div className='b-blocks-document-library-toolbar' role='search'>
				{showSearch && <div className='b-blocks-document-library-search'>
					<label htmlFor={`${inputId}-search`} className='screen-reader-text'>{labels.searchDocuments}</label>
					{searchIcon}
					<input id={`${inputId}-search`} type='search' value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.searchPlaceholder} />
				</div>}

				{showTypeFilter && <>
					<label htmlFor={`${inputId}-type`} className='screen-reader-text'>{isCustom ? labels.filterByCategory : labels.filterByType}</label>
					<select id={`${inputId}-type`} value={activeType} onChange={(e) => setType(e.target.value)}>
						<option value='all'>{isCustom ? labels.allCategories : labels.allTypes}</option>
						{present.map((key) => <option key={key} value={key}>{isCustom ? key : categories[key].label}</option>)}
					</select>
				</>}

				{showSort && <>
					<label htmlFor={`${inputId}-sort`} className='screen-reader-text'>{labels.sortDocuments}</label>
					<select id={`${inputId}-sort`} value={sort} onChange={(e) => setSort(e.target.value)}>
						<option value='default'>{labels.sortBy}</option>
						<option value='name-asc'>{labels.sortNameAsc}</option>
						<option value='name-desc'>{labels.sortNameDesc}</option>
						<option value='date-desc'>{labels.sortDateDesc}</option>
						<option value='date-asc'>{labels.sortDateAsc}</option>
						<option value='size-desc'>{labels.sortSizeDesc}</option>
						<option value='size-asc'>{labels.sortSizeAsc}</option>
					</select>
				</>}

				{/* The documents the search and filter leave, as "Title - link" lines, ready to paste into a message. */}
				{showCopyList && <button
					type='button'
					className='b-blocks-document-library-copy'
					disabled={0 === found.length}
					onClick={() => {
						if (isBackend) {
							return;
						}
						const list = found.map((doc) => `${doc.title} - ${new URL(doc.url, window.location.href).href}`).join('\n');
						// No clipboard on a page served over plain http: the visitor copies the list by hand.
						(window.navigator.clipboard ? window.navigator.clipboard.writeText(list) : Promise.reject()).then(() => setListCopied(true)).catch(() => window.prompt(labels.copyThisList, list));
					}}
				>
					{listCopied ? labels.copied : labels.copyLinks}
					<span className='screen-reader-text' role='status'>{listCopied ? labels.linksCopied : ''}</span>
				</button>}
			</div>}

			{/* Screen readers hear how many documents a search or filter leaves, or that none match. One region that
			stays on the page: a region added with its text already in it is usually not read out. */}
			{hasToolbar && <span className='screen-reader-text' role='status'>{0 < found.length ? (labels.documentCount?.[1 === found.length ? 'one' : 'other'] || '').replace('%d', found.length) : emptyText}</span>}

			{0 === found.length ?
				<div className='b-blocks-document-library-empty' role={hasToolbar ? undefined : 'status'}>
					<p>{emptyText}</p>

					{/* A search or filter that leaves nothing can be undone in one click. */}
					{0 < docs.length && ('' !== term || 'all' !== activeType) && <button type='button' onClick={() => { setSearch(''); setType('all'); }}>{labels.clearSearch}</button>}
				</div> :
				<Template docs={visible} attributes={attributes} isBackend={isBackend} onView={setViewing} />}

			{0 < size && 'numbers' !== paging && found.length > limit && <div className='b-blocks-document-library-more'>
				<button type='button' onClick={() => setLimit(limit + size)}>{labels.loadMore}</button>
			</div>}

			{0 < size && 'numbers' === paging && 1 < pages && <nav className='b-blocks-document-library-pages' aria-label={labels.documentPages}>
				{numbers.map((number, i) => <span key={number} className='b-blocks-document-library-page'>
					{0 < i && number - numbers[i - 1] > 1 && <span className='b-blocks-document-library-gap' aria-hidden='true'>…</span>}

					<button
						type='button'
						className={number === page ? 'is-current' : undefined}
						aria-current={number === page ? 'page' : undefined}
						aria-label={(labels.pageNumber || '').replace('%d', number)}
						onClick={() => goTo(number)}
					>{number}</button>
				</span>)}
			</nav>}
		</div>

		{viewing && <DocumentModal doc={viewing} assetsUrl={assetsUrl} onClose={() => setViewing(null)} />}
	</div>;
};
export default DocumentLibrary;

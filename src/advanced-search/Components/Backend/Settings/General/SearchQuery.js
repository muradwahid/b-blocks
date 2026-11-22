import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import { FormTokenField, PanelBody, SelectControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { orderByOptions, searchInOptions } from '../../../../utils/options';

const SearchQuery = ({ attributes, updateObj, terms, setPostQuery, foundPosts, savedPosts }) => {
	const { search = {} } = attributes;
	const { minChars = 2, delay = 300, orderBy = 'relevance', includeTerms = [], excludeTerms = [], searchIn = 'all', excludePosts = [] } = search;

	return <PanelBody className='bPlPanelBody' title={__('Search Query', 'b-blocks')} initialOpen={false}>
		<SelectControl label={__('Order By', 'b-blocks')} labelPosition='edge' value={orderBy} options={orderByOptions} onChange={(val) => updateObj('search', val, 'orderBy')} __next40pxDefaultSize __nextHasNoMarginBottom />
		<SelectControl className='mt10' label={__('Search In', 'b-blocks')} help={__('Live results only: the full results page (View All) uses the normal WordPress search.', 'b-blocks')} labelPosition='edge' value={searchIn} options={searchInOptions} onChange={(val) => updateObj('search', val, 'searchIn')} __next40pxDefaultSize __nextHasNoMarginBottom />

		<FormTokenField className='mt10' label={__('Only In These Terms', 'b-blocks')} value={includeTerms.map((id) => terms.find((t) => t.value === id)?.label || `#${id}`)} suggestions={terms.map((t) => t.label)} onChange={(tokens) => updateObj('search', tokens.map((label) => terms.find((t) => t.label === label)?.value || parseInt(String(label).replace('#', ''), 10)).filter(Boolean), 'includeTerms')} __experimentalExpandOnFocus __experimentalAutoSelectFirstMatch __experimentalValidateInput={(token) => terms.some((t) => t.label === token)} __next40pxDefaultSize __nextHasNoMarginBottom />
		<FormTokenField className='mt10' label={__('Never In These Terms', 'b-blocks')} value={excludeTerms.map((id) => terms.find((t) => t.value === id)?.label || `#${id}`)} suggestions={terms.map((t) => t.label)} onChange={(tokens) => updateObj('search', tokens.map((label) => terms.find((t) => t.label === label)?.value || parseInt(String(label).replace('#', ''), 10)).filter(Boolean), 'excludeTerms')} __experimentalExpandOnFocus __experimentalAutoSelectFirstMatch __experimentalValidateInput={(token) => terms.some((t) => t.label === token)} __next40pxDefaultSize __nextHasNoMarginBottom />
		<p className='components-base-control__help'>{__('Categories, tags and other public terms. The View All page can only follow categories.', 'b-blocks')}</p>

		<FormTokenField className='mt10' label={__('Never Show These Posts', 'b-blocks')} value={excludePosts.map((id) => { const post = [...savedPosts, ...foundPosts].find((p) => p.id === id); return post ? `${decodeEntities(post.title)} (#${id})` : `#${id}`; })} suggestions={foundPosts.map((p) => `${decodeEntities(p.title)} (#${p.id})`)} onInputChange={setPostQuery} onChange={(tokens) => updateObj('search', tokens.map((token) => parseInt((String(token.value ?? token).match(/#(\d+)\)?$/) || [])[1], 10)).filter(Boolean), 'excludePosts')} __experimentalValidateInput={(token) => /\(#\d+\)$/.test(token)} __experimentalAutoSelectFirstMatch __next40pxDefaultSize __nextHasNoMarginBottom />
		<p className='components-base-control__help'>{__('Type part of a title to find a post. Live results only.', 'b-blocks')}</p>

		<NumberControl className='mt10' label={__('Minimum Characters', 'b-blocks')} help={__('Live search starts after this many characters (2–5).', 'b-blocks')} labelPosition='edge' value={minChars} min={2} max={5} onChange={(val) => updateObj('search', Math.min(5, Math.max(2, parseInt(val, 10) || 2)), 'minChars')} />
		<NumberControl className='mt10' label={__('Typing Delay (ms)', 'b-blocks')} help={__('Wait after the last key before searching (0–2000).', 'b-blocks')} labelPosition='edge' value={delay} min={0} max={2000} step={50} onChange={(val) => updateObj('search', Math.min(2000, Math.max(0, parseInt(val, 10) || 0)), 'delay')} />
	</PanelBody>;
};
export default SearchQuery;

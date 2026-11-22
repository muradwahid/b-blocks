import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import { FormTokenField, PanelBody, SelectControl, TextControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { fallbackOptions } from '../../../../utils/options';

const ResultContent = ({ attributes, updateObj, setPostQuery, foundPosts, savedPosts }) => {
	const { search = {} } = attributes;
	const { showImage = false, showExcerpt = true, excerptLength = 22, highlight = true, newTab = false, showDate = false, showType = false, showAuthor = false, showCategory = false, showTerms = false, termsLimit = 3, fallback = 'none', fallbackPosts = [], fallbackTitle = '', groupByType = false } = search;

	return <PanelBody className='bPlPanelBody' title={__('Result Content', 'b-blocks')} initialOpen={false}>
		<ToggleControl label={__('Show Image', 'b-blocks')} help={__('The featured image of each result.', 'b-blocks')} checked={showImage} onChange={(val) => updateObj('search', val, 'showImage')} />

		<ToggleControl className='mt10' label={__('Show Excerpt', 'b-blocks')} checked={showExcerpt} onChange={(val) => updateObj('search', val, 'showExcerpt')} />
		{showExcerpt && <NumberControl className='mt10' label={__('Excerpt Length (words)', 'b-blocks')} labelPosition='edge' value={excerptLength} min={5} max={55} onChange={(val) => updateObj('search', Math.min(55, Math.max(5, parseInt(val, 10) || 5)), 'excerptLength')} />}

		<ToggleControl className='mt10' label={__('Show Date', 'b-blocks')} checked={showDate} onChange={(val) => updateObj('search', val, 'showDate')} />
		<ToggleControl className='mt10' label={__('Show Post Type', 'b-blocks')} checked={showType} onChange={(val) => updateObj('search', val, 'showType')} />
		<ToggleControl className='mt10' label={__('Show Author', 'b-blocks')} checked={showAuthor} onChange={(val) => updateObj('search', val, 'showAuthor')} />
		<ToggleControl className='mt10' label={__('Show Category', 'b-blocks')} help={__('The first category (or product category…) of each result.', 'b-blocks')} checked={showCategory} onChange={(val) => updateObj('search', val, 'showCategory')} />
		<ToggleControl className='mt10' label={__('Highlight Matching Words', 'b-blocks')} checked={highlight} onChange={(val) => updateObj('search', val, 'highlight')} />
		<ToggleControl className='mt10' label={__('Open Results In New Tab', 'b-blocks')} checked={newTab} onChange={(val) => updateObj('search', val, 'newTab')} />

		<ToggleControl className='mt10' label={__('Show Matching Categories & Tags', 'b-blocks')} help={__('Terms whose name matches, with their post count, above the results.', 'b-blocks')} checked={showTerms} onChange={(val) => updateObj('search', val, 'showTerms')} />
		{showTerms && <NumberControl className='mt10' label={__('How Many Terms', 'b-blocks')} labelPosition='edge' value={termsLimit} min={1} max={10} onChange={(val) => updateObj('search', Math.min(10, Math.max(1, parseInt(val, 10) || 1)), 'termsLimit')} />}

		<ToggleControl className='mt10' label={__('Group Results By Post Type', 'b-blocks')} help={__('A heading per post type with its total, e.g. "Posts (8)". One search per post type.', 'b-blocks')} checked={groupByType} onChange={(val) => updateObj('search', val, 'groupByType')} />

		<SelectControl className='mt10' label={__('When Nothing Matches', 'b-blocks')} help={__('Posts shown under the Not Found text.', 'b-blocks')} labelPosition='edge' value={fallback} options={fallbackOptions} onChange={(val) => updateObj('search', val, 'fallback')} __next40pxDefaultSize __nextHasNoMarginBottom />
		{'chosen' === fallback && <FormTokenField className='mt10' label={__('Posts To Show', 'b-blocks')} value={fallbackPosts.map((id) => { const post = [...savedPosts, ...foundPosts].find((p) => p.id === id); return post ? `${decodeEntities(post.title)} (#${id})` : `#${id}`; })} suggestions={foundPosts.map((p) => `${decodeEntities(p.title)} (#${p.id})`)} onInputChange={setPostQuery} onChange={(tokens) => updateObj('search', tokens.map((token) => parseInt((String(token.value ?? token).match(/#(\d+)\)?$/) || [])[1], 10)).filter(Boolean), 'fallbackPosts')} __experimentalValidateInput={(token) => /\(#\d+\)$/.test(token)} __experimentalAutoSelectFirstMatch __next40pxDefaultSize __nextHasNoMarginBottom />}
		{'none' !== fallback && <TextControl className='mt10' label={__('Heading', 'b-blocks')} help={__('Shown above these posts. Empty: no heading.', 'b-blocks')} value={fallbackTitle} onChange={(val) => updateObj('search', val, 'fallbackTitle')} __next40pxDefaultSize __nextHasNoMarginBottom />}
	</PanelBody>;
};
export default ResultContent;

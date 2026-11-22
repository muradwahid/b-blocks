import { useEffect, useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import GeneralOptions from './GeneralOptions';
import SearchQuery from './SearchQuery';
import ResultContent from './ResultContent';
import SearchField from './SearchField';
import Display from './Display';
import Button from './Button';

// The site's searchable post types and the terms the filters can use, asked once per editor session.
let postTypesRequest = null;
let termsRequest = null;

const General = (props) => {
	const { search = {}, button = {} } = props.attributes;
	const { excludePosts = [], fallbackPosts = [] } = search;
	const { show: showButton = true } = button;

	const [postTypes, setPostTypes] = useState([]);
	useEffect(() => {
		postTypesRequest = postTypesRequest || apiFetch({ path: '/b-blocks/v1/search/types' }).catch(() => []);
		postTypesRequest.then((list) => setPostTypes(Array.isArray(list) ? list : []));
	}, []);

	// Terms are picked by name ("Category: News") and saved as IDs.
	const [terms, setTerms] = useState([]);
	useEffect(() => {
		termsRequest = termsRequest || apiFetch({ path: '/b-blocks/v1/search/terms' }).catch(() => []);
		termsRequest.then((list) => setTerms(Array.isArray(list) ? list : []));
	}, []);

	// Posts for the Never Show / Chosen Posts pickers, found by title while typing. Labelled "Title (#ID)": two posts
	// with one title stay apart, and the ID is what is saved.
	const [postQuery, setPostQuery] = useState('');
	const [foundPosts, setFoundPosts] = useState([]);
	useEffect(() => {
		if (2 > postQuery.trim().length) {
			return undefined;
		}
		const timer = setTimeout(() => apiFetch({ path: addQueryArgs('/wp/v2/search', { search: postQuery, type: 'post', subtype: 'any', per_page: 20, _fields: 'id,title' }) }).then((list) => setFoundPosts(Array.isArray(list) ? list : [])).catch(() => setFoundPosts([])), 300);
		return () => clearTimeout(timer);
	}, [postQuery]);

	// The titles of the posts already saved in both pickers.
	const savedIds = [...excludePosts, ...fallbackPosts].join(',');
	const [savedPosts, setSavedPosts] = useState([]);
	useEffect(() => {
		if (!savedIds) {
			return;
		}
		apiFetch({ path: addQueryArgs('/wp/v2/search', { include: savedIds, type: 'post', subtype: 'any', per_page: 100, _fields: 'id,title' }) }).then((list) => setSavedPosts(Array.isArray(list) ? list : [])).catch(() => { });
	}, [savedIds]);

	return <>
		<GeneralOptions {...props} postTypes={postTypes} />

		<SearchQuery {...props} terms={terms} setPostQuery={setPostQuery} foundPosts={foundPosts} savedPosts={savedPosts} />

		<ResultContent {...props} setPostQuery={setPostQuery} foundPosts={foundPosts} savedPosts={savedPosts} />

		<SearchField {...props} />

		<Display {...props} terms={terms} />

		{showButton && <Button {...props} />}
	</>;
};
export default General;

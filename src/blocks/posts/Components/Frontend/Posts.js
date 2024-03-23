import { useState, useEffect } from 'react';

import { useWPAjax } from '../../../../../../react-utils/hooks';
import Style from '../Common/Style';
import DisplayPosts from '../Common/DisplayPosts';
import Pagination from '../Common/Pagination';
import Slider from '../Common/Layout/Slider';
import Ticker from './Layout/Ticker';

const Posts = ({ firstPosts, nonce, totalPosts, attributes }) => {
	const { cId, postType, selectedTaxonomies = {}, selectedCategories, selectedTags = [], isPostsPerPageAll, postsPerPage, postsOrderBy, postsOrder, postsOffset = 0, postsInclude = [], postsExclude = [], isExcludeCurrent, passFilter = null, fImgSize = 'full', metaDateFormat = 'M j, Y' } = attributes;

	const [pageNumber, setPageNumber] = useState(1);

	const queryAttr = { postType, selectedTaxonomies, selectedCategories, selectedTags, isPostsPerPageAll, postsPerPage, postsOrderBy, postsOrder, postsOffset, postsInclude, postsExclude, isExcludeCurrent, passFilter, fImgSize, metaDateFormat }
	const { data = null, saveData } = useWPAjax('bBlocksPosts', { _wpnonce: nonce, queryAttr, pageNumber });

	const [posts, setPosts] = useState([]);

	useEffect(() => {
		if (pageNumber) {
			saveData({ pageNumber });
		}
	}, [pageNumber]);

	useEffect(() => {
		if (data) {
			setPosts(data);
		}
	}, [data]);

	const dpPosts = (Array.isArray(posts) && posts.length) || pageNumber > 1 ? posts : ((Array.isArray(firstPosts) && firstPosts.length) ? firstPosts : []);

	return <>
		<Style attributes={attributes} clientId={cId} />

		<DisplayPosts posts={dpPosts} attributes={attributes} clientId={cId} Slider={Slider} Ticker={Ticker} />

		<Pagination attributes={attributes} totalCount={totalPosts} onChange={val => setPageNumber(val)} />
	</>
}
export default Posts;
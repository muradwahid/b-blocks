import { useState, useEffect } from 'react';

import { useWPAjax } from '../../../../../react-utils/hooks';

const useAjaxPosts = (nonce, attributes, pageNumber) => {
	const { postType, selectedTaxonomies = {}, selectedCategories = [], selectedTags = [], isPostsPerPageAll, postsPerPage, postsOrderBy, postsOrder, postsOffset = 0, postsInclude = [], postsExclude = [], isExcludeCurrent, fImgSize = 'full', metaDateFormat = 'M j, Y', excerptLength = 25 } = attributes;

	const queryAttr = { postType, selectedTaxonomies, selectedCategories, selectedTags, isPostsPerPageAll, postsPerPage, postsOrderBy, postsOrder, postsOffset, postsInclude, postsExclude, isExcludeCurrent, fImgSize, metaDateFormat, excerptLength }
	const { data = null, saveData, isLoading } = useWPAjax('bBlocksPosts', { _wpnonce: nonce, queryAttr, pageNumber });


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

	return { posts, isLoading };
};
export default useAjaxPosts;
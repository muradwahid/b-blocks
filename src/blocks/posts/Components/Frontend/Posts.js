import { useState, useEffect } from 'react';

import Style from '../Common/Style';
import DisplayPosts from '../Common/DisplayPosts';
import Pagination from '../Common/Pagination';
import Slider from '../Common/Layout/Slider';
import Ticker from './Layout/Ticker';
import useAjaxPosts from '../../hooks/useAjaxPosts';
import usePremium from '../../../../hooks/usePremium';

const Posts = ({ firstPosts, nonce, totalPosts, attributes }) => {
	const { cId } = attributes;

	const [pageNumber, setPageNumber] = useState(1);
	const [posts, setPosts] = useState(firstPosts);

	const { posts: ajaxPosts, isLoading: isAPLoading } = useAjaxPosts(nonce, attributes, pageNumber);
	const { isPremium, isLoading: isPLoading } = usePremium(nonce);

	useEffect(() => {
		if (isPremium && !isPLoading && Array.isArray(ajaxPosts) && !isAPLoading) {
			setPosts(ajaxPosts);
		}
	}, [isPremium, isPLoading, ajaxPosts, isAPLoading, pageNumber]);

	const dpPosts = (Array.isArray(posts) && posts.length) ? posts : [];

	return <>
		<Style attributes={attributes} clientId={cId} />

		<DisplayPosts posts={dpPosts} attributes={attributes} clientId={cId} Slider={Slider} Ticker={Ticker} />

		{isPremium && <Pagination attributes={attributes} totalCount={totalPosts} onChange={val => setPageNumber(val)} />}
	</>
}
export default Posts;
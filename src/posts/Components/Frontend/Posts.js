import { useState, useEffect } from 'react';

import useAjaxPosts from '../../hooks/useAjaxPosts';
import usePremium from '../../../hooks/usePremium';
import Style from '../Common/Style';
import DisplayPosts from '../Common/DisplayPosts';
import Pagination from '../Common/Pagination';
import Slider from '../Common/Layout/Slider';
import Ticker from './Layout/Ticker';

const Posts = ({ firstPosts, nonce, totalPosts, attributes, id }) => {
	const [pageNumber, setPageNumber] = useState(1);

	const { isPremium } = usePremium(nonce);

	const posts = (Array.isArray(firstPosts) && firstPosts.length) ? firstPosts : [];

	return <>
		<Style attributes={attributes} id={id} />

		{isPremium ? <>
			<PremiumDisplayPosts firstPosts={posts} attributes={attributes} id={id} nonce={nonce} pageNumber={pageNumber} />

			<Pagination attributes={attributes} totalCount={totalPosts} onChange={val => setPageNumber(val)} />
		</> :
			<FreeDisplayPosts posts={posts} attributes={attributes} id={id} />}
	</>
}
export default Posts;

const FreeDisplayPosts = ({ posts, attributes, id }) => <DisplayPosts posts={posts} attributes={attributes} id={id} Slider={Slider} Ticker={Ticker} />

const PremiumDisplayPosts = ({ firstPosts, attributes, id, nonce, pageNumber }) => {
	const [posts, setPosts] = useState(firstPosts);

	const { posts: ajaxPosts, isLoading: isAPLoading } = useAjaxPosts(nonce, attributes, pageNumber);

	useEffect(() => {
		if (Array.isArray(ajaxPosts) && !isAPLoading && pageNumber > 1) {
			setPosts(ajaxPosts);
		}
	}, [ajaxPosts, isAPLoading, pageNumber]);

	const dpPosts = (Array.isArray(posts) && posts.length) ? posts : [];

	return <DisplayPosts posts={dpPosts} attributes={attributes} id={id} Slider={Slider} Ticker={Ticker} />
}
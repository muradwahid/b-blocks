import Style from '../Common/Style';
import DisplayPosts from '../Common/DisplayPosts';
import Pagination from '../Common/Pagination';
import Slider from './Layout/Slider';
import Ticker from './Layout/Ticker';

const Posts = ({ posts, totalPosts, attributes, setAttributes, id, isPremium }) => {
	return <>
		<Style attributes={attributes} id={id} />

		<DisplayPosts posts={posts} attributes={attributes} id={id} Slider={Slider} Ticker={Ticker} />

		{isPremium && <Pagination attributes={attributes} totalCount={totalPosts} onChange={val => setAttributes({ paginationCurrentPage: val })} />}
	</>
}
export default Posts;
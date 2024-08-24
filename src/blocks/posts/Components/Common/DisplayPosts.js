import SubLayout from './SubLayout/SubLayout';
import Masonry from './Layout/Masonry';

const DisplayPosts = ({ posts, attributes, id, Slider, Ticker }) => {
	const { layout, columns } = attributes;
	const { desktop = 3, tablet = 2, mobile = 1 } = columns;

	const PostsLoop = () => posts.map(post => <SubLayout key={post.id} post={post} attributes={attributes} />)

	switch (layout) {
		case 'grid':
			return <div className={`bBlocksGridPosts columns-${desktop} columns-tablet-${tablet} columns-mobile-${mobile}`}>
				<PostsLoop />
			</div>;

		case 'grid1':
			return <div className='bBlocksGrid1Posts'>
				<PostsLoop />
			</div>;

		case 'masonry':
			return <Masonry posts={posts} attributes={attributes} />;

		case 'slider':
			return <Slider posts={posts} attributes={attributes} id={id} />

		case 'ticker':
			return <Ticker posts={posts} attributes={attributes} id={id} />;

		default:
			return null;
	}
}
export default DisplayPosts;
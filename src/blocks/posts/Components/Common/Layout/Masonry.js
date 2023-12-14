import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import SubLayout from '../SubLayout/SubLayout';

const MyMasonry = ({ posts, attributes }) => {
	const { columns, columnGap, rowGap } = attributes;
	const { desktop = 3, tablet = 2, mobile = 1 } = columns;

	return <ResponsiveMasonry className='bBlocksMasonryPosts' columnsCountBreakPoints={{ 0: mobile, 576: tablet, 768: desktop }}>
		<Masonry gutter={`${rowGap}px ${columnGap}px`}>
			{posts.map(post => <SubLayout key={post.id} post={post} attributes={attributes} />)}
		</Masonry>
	</ResponsiveMasonry>
}
export default MyMasonry;
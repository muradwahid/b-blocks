import { useEffect } from 'react';
const $ = jQuery;

import SubLayout from '../../Common/SubLayout/SubLayout';
import { tickerConfig } from '../../../utils/configs';

const Ticker = ({ posts, attributes, clientId }) => {
	const tickerSl = `#bBlocksPosts-${clientId} .bBlocksTickerPosts`;

	useEffect(() => {
		if (posts?.length) {
			$(tickerSl).easyTicker(tickerConfig(attributes));
		}
	}, [posts?.length]);

	return <div className='bBlocksTickerPosts'>
		<div>
			{posts.map(post => <SubLayout key={post.id} post={post} attributes={attributes} />)}
		</div>
	</div>;
}
export default Ticker;
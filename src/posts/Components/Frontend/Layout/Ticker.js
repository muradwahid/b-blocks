import { useEffect } from 'react';
const $ = jQuery;

import SubLayout from '../../Common/SubLayout/SubLayout';
import { tickerConfig } from '../../../utils/configs';
import { prefix } from '../../../utils/data';

const Ticker = ({ posts, attributes, id }) => {
	const tickerSl = `#${id} .${prefix}LayoutTicker`;

	useEffect(() => {
		if (posts?.length) {
			$(tickerSl).easyTicker(tickerConfig(attributes));
		}
	}, [posts?.length]);

	return <div className={`${prefix}LayoutTicker`}>
		<div>
			{posts.map(post => <SubLayout key={post.id} post={post} attributes={attributes} />)}
		</div>
	</div>;
}
export default Ticker;
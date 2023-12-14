import { useEffect, useRef } from 'react';
const $ = jQuery;

import SubLayout from '../../Common/SubLayout/SubLayout';
import { tickerConfig } from '../../../utils/configs';

const Ticker = ({ posts, attributes, clientId }) => {
	const { rowGap, tickerDirection, tickerSpeed, tickerInterval, tickerHeight, tickerVisible, tickerIsMousePause } = attributes;

	const tickerRef = useRef(null);
	const tickerWrapperRef = useRef(null);

	const mainSl = `#bBlocksPosts-${clientId}`;

	useEffect(() => {
		const tickerWrapEl = tickerWrapperRef.current;
		if (tickerWrapEl) {
			// Re init ticker
			tickerWrapEl.innerHTML = '';
			tickerWrapEl.innerHTML = tickerRef.current.outerHTML;

			$(`${mainSl} .bBlocksTickerWrapper .bBlocksTickerPosts`).easyTicker(tickerConfig(attributes));
		}
	}, [rowGap, tickerDirection, tickerSpeed, tickerInterval, tickerHeight, tickerVisible, tickerIsMousePause]);

	return <>
		<div className='bBlocksTickerWrapper' ref={tickerWrapperRef}></div>
		<div className='bBlocksTickerPosts' ref={tickerRef}>
			<div>
				{posts.map(post => <SubLayout key={post.id} post={post} attributes={attributes} />)}
			</div>
		</div>
	</>;
}
export default Ticker;
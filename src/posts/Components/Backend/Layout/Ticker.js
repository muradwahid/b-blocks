import { useEffect, useRef } from 'react';
const $ = jQuery;

import SubLayout from '../../Common/SubLayout/SubLayout';
import { tickerConfig } from '../../../utils/configs';
import { prefix } from '../../../utils/data';

const Ticker = ({ posts, attributes, id }) => {
	const { rowGap, tickerDirection, tickerSpeed, tickerInterval, tickerHeight, tickerVisible, tickerIsMousePause } = attributes;

	const tickerRef = useRef(null);
	const tickerWrapperRef = useRef(null);

	const mainSl = `#${id}`;

	useEffect(() => {
		const tickerWrapEl = tickerWrapperRef.current;
		if (tickerWrapEl) {
			// Re init ticker
			tickerWrapEl.innerHTML = '';
			tickerWrapEl.innerHTML = tickerRef.current.outerHTML;

			$(`${mainSl} .${prefix}LayoutTickerWrapper .${prefix}LayoutTicker`).easyTicker(tickerConfig(attributes));
		}
	}, [rowGap, tickerDirection, tickerSpeed, tickerInterval, tickerHeight, tickerVisible, tickerIsMousePause]);

	return <>
		<div className={`${prefix}LayoutTickerWrapper`} ref={tickerWrapperRef}></div>
		<div className={`${prefix}LayoutTicker`} ref={tickerRef}>
			<div>
				{posts.map(post => <SubLayout key={post.id} post={post} attributes={attributes} />)}
			</div>
		</div>
	</>;
}
export default Ticker;
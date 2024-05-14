import { useEffect, useRef } from 'react';
const $ = jQuery;

import { drags } from '../../utils/functions';

const ImageCompare = ({ attributes, beforeLabelEl, afterLabelEl, captionEl }) => {
	const { beforeImg, afterImg } = attributes;

	const imgCompareRef = useRef(null);
	const dividerRef = useRef(null);
	const resizeRef = useRef(null);
	const beforeImgRef = useRef(null);

	const setImgWidth = width => {
		beforeImgRef.current.style.width = width;
		beforeImgRef.current.style.minWidth = width;
	}

	// Image Slider Scripts
	useEffect(() => {
		const compareEl = imgCompareRef.current

		const handleResize = () => {
			const imgCompareWidth = compareEl?.clientWidth;

			if (imgCompareWidth) {
				setImgWidth(`${imgCompareWidth}px`);
				drags($(dividerRef.current), $(resizeRef.current), $(compareEl));
			}
		};

		const observer = new ResizeObserver(handleResize);

		if (compareEl) {
			observer.observe(compareEl);
		}

		window.addEventListener('resize', handleResize);

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return <div className='bBlocksImageCompare' ref={imgCompareRef}>
		<div className='comparison-slider'>
			{afterLabelEl}
			<img className='afterImg' src={afterImg?.url} alt={afterImg?.alt} />

			<div className='resize' ref={resizeRef}>
				{beforeLabelEl}
				<img className='beforeImg' src={beforeImg?.url} alt={beforeImg?.alt} ref={beforeImgRef} />
			</div>

			<div className='divider' ref={dividerRef}></div>
		</div>

		{captionEl}
	</div>
}
export default ImageCompare;
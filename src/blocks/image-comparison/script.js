import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
const $ = jQuery;

import './style.scss';
import Style from './Style';
import { drags } from './utils/functions';

document.addEventListener('DOMContentLoaded', () => {
	const allImageCompare = document.querySelectorAll('.wp-block-b-blocks-image-comparison');
	allImageCompare.forEach(imageCompare => {
		const attributes = JSON.parse(imageCompare.dataset.attributes);

		createRoot(imageCompare).render(<>
			<Style attributes={attributes} clientId={attributes.cId} />

			<ImageCompare attributes={attributes} />
		</>);

		imageCompare?.removeAttribute('data-attributes');
	});
});

const ImageCompare = ({ attributes }) => {
	const { beforeImg, afterImg, isLabel, beforeLabel, afterLabel, isCap, cap } = attributes;

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
		setTimeout(() => {
			if (imgCompareRef.current) {
				const comparisonWidth = imgCompareRef.current?.clientWidth + 'px';

				setImgWidth(comparisonWidth);

				drags($(dividerRef.current), $(resizeRef.current), $(imgCompareRef.current));

				window.addEventListener('resize', () => {
					const comparisonWidth = imgCompareRef.current?.clientWidth + 'px';
					setImgWidth(comparisonWidth);
				});
			}
		}, 0);
	}, [$]);

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

	// useEffect(() => {
	// 	setTimeout(() => {
	// 		if ($('.comparison-slider')[0]) {
	// 			let compSlider = $('.comparison-slider');

	// 			//let's loop through the sliders and initialize each of them
	// 			compSlider.each(function () {
	// 				let compSliderWidth = $(this).width() + 'px';
	// 				$(this).find('.resize img').css({ width: compSliderWidth, minWidth: compSliderWidth });
	// 				drags($(this).find('.divider'), $(this).find('.resize'), $(this));
	// 			});

	// 			//if the user resizes the windows lets update our variables and resize our images
	// 			$(window).on('resize', function () {
	// 				let compSliderWidth = compSlider.width() + 'px';
	// 				compSlider.find('.resize img').css({ width: compSliderWidth, minWidth: compSliderWidth });
	// 			});
	// 		}
	// 	});
	// }, [$]);

	return <div className='bBlocksImageComparison'>
		<div className='comparison-slider' ref={imgCompareRef}>
			{isLabel && afterLabel && <div className='overlay afterLabel' dangerouslySetInnerHTML={{ __html: afterLabel }} />}
			<img className='afterImg' src={afterImg?.url} alt={afterImg?.alt} />

			<div className='resize' ref={resizeRef}>
				{isLabel && beforeLabel && <div className='overlay beforeLabel' dangerouslySetInnerHTML={{ __html: beforeLabel }} />}
				<img className='beforeImg' src={beforeImg?.url} alt={beforeImg?.alt} ref={beforeImgRef} />
			</div>

			<div className='divider' ref={dividerRef}></div>
		</div>

		{isCap && cap && <div className='caption' dangerouslySetInnerHTML={{ __html: cap }} />}
	</div>
}
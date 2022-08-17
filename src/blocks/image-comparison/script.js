import { render, useEffect } from '@wordpress/element';
const $ = jQuery;

import './style.scss';
import Style from './Style';
import { drags } from './utils/functions';

// Image Compare
document.addEventListener('DOMContentLoaded', () => {
	const allImageCompare = document.querySelectorAll('.wp-block-b-blocks-image-comparison');
	allImageCompare.forEach(imageCompare => {
		const attributes = JSON.parse(imageCompare.dataset.attributes);

		render(<>
			<Style attributes={attributes} clientId={attributes.cId} />

			<ImageCompare attributes={attributes} />
		</>, imageCompare);

		imageCompare?.removeAttribute('data-attributes');
	});
});

const ImageCompare = ({ attributes }) => {
	const { beforeImg, afterImg, isLabel, beforeLabel, afterLabel, isCap, cap } = attributes;

	// Image Slider Scripts
	useEffect(() => {
		if ($('.comparison-slider')[0]) {
			let compSlider = $('.comparison-slider');

			//let's loop through the sliders and initialize each of them
			compSlider.each(function () {
				let compSliderWidth = $(this).width() + 'px';
				$(this).find('.resize img').css({ width: compSliderWidth, minWidth: compSliderWidth });
				drags($(this).find('.divider'), $(this).find('.resize'), $(this));
			});

			//if the user resizes the windows lets update our variables and resize our images
			$(window).on('resize', function () {
				let compSliderWidth = compSlider.width() + 'px';
				compSlider.find('.resize img').css({ width: compSliderWidth, minWidth: compSliderWidth });
			});
		}
	}, [$]);

	return <div className='bBlocksImageComparison'>
		<div className='comparison-slider'>
			{isLabel && afterLabel && <div className='overlay afterLabel'>{afterLabel}</div>}
			<img className='afterImg' src={afterImg?.url} alt={afterImg?.alt} />

			<div className='resize'>
				{isLabel && beforeLabel && <div className='overlay beforeLabel'>{beforeLabel}</div>}
				<img className='beforeImg' src={beforeImg?.url} alt={beforeImg?.alt} />
			</div>

			<div className='divider'></div>
		</div>

		{isCap && cap && <div className='caption'>{cap}</div>}
	</div>
}
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';
const $ = jQuery;

// Settings Components
import { tabController } from '../../../../Components/Helper/functions';
import { ImagePlaceholder } from '../../../../Components/ImageControl';

import Settings from './Settings';
import Style from './Style';
import { drags } from './utils/functions';

const Edit = props => {
	const { className, attributes, setAttributes, clientId, isSelected } = props;
	const { width, beforeImg, afterImg, isLabel, beforeLabel, afterLabel, isCap, cap } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	useEffect(() => tabController(), [isSelected]);

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
	}, [$, width, beforeImg, afterImg]);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div className={className} id={`bBlocksImageComparison-${clientId}`}>
			<Style attributes={props.attributes} clientId={clientId} />

			<div className='bBlocksImageComparison'>
				{beforeImg?.url && afterImg?.url ? <div className='comparison-slider'>
					{isLabel && <RichText className={`overlay afterLabel`} tagName='div' value={afterLabel} onChange={val => setAttributes({ afterLabel: val })} placeholder={__('After image label', 'b-blocks')} inlineToolbar />}

					<img className='afterImg' src={afterImg?.url} alt={afterImg?.alt} />

					<div className='resize'>
						{isLabel && <RichText className={`overlay beforeLabel`} tagName='div' value={beforeLabel} onChange={val => setAttributes({ beforeLabel: val })} placeholder={__('Before image label', 'b-blocks')} inlineToolbar />}

						<img className='beforeImg' src={beforeImg?.url} alt={beforeImg?.alt} />
					</div>

					<div className='divider'></div>
				</div> :

					<div className='imgPlaceholder'>
						<div className='beforeImg'>
							{beforeImg?.url ? <>
								<img src={beforeImg?.url} alt={beforeImg?.alt} />
								{isBlobURL(beforeImg?.url) && <Spinner />}
							</> :
								<ImagePlaceholder label={__(' Before Image:', 'b-blocks')} value={beforeImg} onChange={val => setAttributes({ beforeImg: val })} />
							}
						</div>

						<div className='afterImg'>
							{afterImg?.url ? <>
								<img src={afterImg?.url} alt={afterImg?.alt} />
								{isBlobURL(afterImg?.url) && <Spinner />}
							</> :
								<ImagePlaceholder label={__(' After Image:', 'b-blocks')} value={afterImg} onChange={val => setAttributes({ afterImg: val })} />
							}
						</div>
					</div>}

				{isCap && <RichText className='caption' tagName='div' value={cap} onChange={val => setAttributes({ cap: val })} placeholder={__('Caption of the image comparison', 'b-blocks')} inlineToolbar />}
			</div>
		</div>
	</>;
};
export default Edit;
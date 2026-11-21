import { useEffect, useRef } from "react";
import Slider from "react-slick";
import "./style.scss";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { sliderArrows } from '../../../../utils/arrows';
import SliderButton from "../../../Common/SliderButton";
import ImageCompareTwo from "../../Default/ImageCompareTwo";
import { sanitizeHtml } from '../../../../../utils/sanitizeHtml';
const ImageCompareSlider = ({ attributes, device, setActiveIndex }) => {
	const { orientation, options, dragg, label, slider, sliderOptions, isLabel, isCap, align } = attributes;
	const sliderRef = useRef()
	const { hAlign, vAlign } = label;
	const { height, autoplay, speed, autoplaySpeed, pauseOnHover, infinite, dots, arrows, slidesView, arrowType } = sliderOptions;

	useEffect(() => {
		if (sliderRef.current && slider.length < 2) {
			const cloneSlides = sliderRef.current.innerSlider.list.querySelectorAll(".slick-cloned")
			cloneSlides.forEach((clone) => {
				// clone.classList.remove("slick-cloned")
				clone.style.display = "none"
			})
		}
		// sliderRef.current.slickGoTo(0);
	}, [sliderRef.current]);

	// useEffect(()=>{
	// if(sliderRef.current && activeIndex){
	// 	sliderRef.current.slickGoTo(activeIndex)
	//		}
	// },[activeIndex])

	const settings = {
		className: "center",
		centerMode: true,
		arrows,
		dots,
		infinite,
		centerPadding: "15%",
		draggable: false,
		autoplay,
		// adaptiveHeight: true,
		slidesToShow: slidesView[device],
		speed,
		autoplaySpeed,
		pauseOnHover,
		nextArrow: <SliderButton className='slick-arrow slick-prev' icon={sliderArrows[arrowType].right} />,
		prevArrow: <SliderButton className='slick-arrow slick-next' icon={sliderArrows[arrowType].left} />
		// slickGoTo: activeIndex,
	};

	return <Slider {...settings} className="b-blocks-image-compare-slider-wrapper" ref={sliderRef}>
			{
				slider.map((slide, i) => {
					const { beforeImg, afterImg, caption } = slide;

					const beforeLabelEl = isLabel && beforeImg.beforeLabel && <div className={`b-blocks-label b-blocks-before-label b-blocks-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} dangerouslySetInnerHTML={{ __html: sanitizeHtml( beforeImg.beforeLabel ) }} />

					const afterLabelEl = isLabel && afterImg.afterLabel && <div className={`b-blocks-label b-blocks-after-label b-blocks-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} dangerouslySetInnerHTML={{ __html: sanitizeHtml( afterImg.afterLabel ) }} />

					const captionEl = isCap && caption && <div className='b-blocks-caption' dangerouslySetInnerHTML={{ __html: sanitizeHtml( caption ) }} />

					const props = { beforeLabelEl, afterLabelEl, captionEl, orientation, options, dragg, label }

					const key = `${device}-${beforeImg?.img?.url}-${afterImg?.img?.url}-${slider.length}-${JSON.stringify(height)}-${align}-${options.autoSlide.isMouseOver}`;

					return <ImageCompareTwo key={key} {...props} height={height[device]} beforeImg={beforeImg.img} afterImg={afterImg.img} onClick={() => setActiveIndex(i)} />
				})
			}
		</Slider> 
};

export default ImageCompareSlider;

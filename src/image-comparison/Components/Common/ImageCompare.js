import { useDeviceWidth } from "../../../../../bpl-tools/hooks";
import ImageCompareTwo from "../themes/Default/ImageCompareTwo";
import ImageCompareSlider from '../themes/Sliders/SliderOne/ImageCompareSlider';

export const ImageCompare = ({ attributes, afterLabelEl, beforeLabelEl, captionEl, isBackend = false, backDevice = "desktop", activeIndex, setActiveIndex = () => { } }) => {
	const { beforeImg, afterImg, orientation, styles, options, dragg, label, align, theme, slider, sliderOptions } = attributes;
	const { device: frontDevice } = useDeviceWidth();
	const device = isBackend ? backDevice : frontDevice;

	const key = `${beforeImg?.url}-${afterImg?.url}-${JSON.stringify(styles.container.height)}-${align}-${options.autoSlide.isMouseOver}-${device}`;
	return <>
		{
			theme === "default" && <ImageCompareTwo key={key} {...{ beforeLabelEl, afterLabelEl, captionEl, beforeImg, afterImg, orientation, options, dragg, label, device }} height={styles.container.height[device]} />
		}
		{
			theme === "slider" && <ImageCompareSlider key={`${slider.length}-${JSON.stringify(sliderOptions)}`} {...{ attributes, device, activeIndex, setActiveIndex }} />
		}

	</>
}
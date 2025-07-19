import { useEffect, useRef } from 'react';
import { useDeviceWidth } from '../../../../../bpl-tools/hooks';

const ImageScroller = ({ attributes, device: editorDevice }) => {
	const { image, options } = attributes;
	const { direction, isScrollAuto } = options;
	const containerRef = useRef(null);
	const imgRef = useRef(null);
	const { device: frontDevice } = useDeviceWidth();
	const device = editorDevice || frontDevice;

	const handleImageScroll = () => {
		containerRef.current?.addEventListener('mouseover', () => {
			if (
				direction === 'vertical' &&
				Number(imgRef.current.clientHeight) > parseInt(image.height[device])
			) {
				imgRef.current.style.transform = `translateY(-${Number(imgRef.current.clientHeight) - parseInt(image.height[device])
					}px)`;
			}
			if (direction === 'horizontal' && Number(imgRef.current.clientWidth) > Number(containerRef.current.clientWidth)) {
				imgRef.current.style.transform = `translateX(-${Number(imgRef.current.clientWidth) - Number(containerRef.current.clientWidth)}px)`;
			}
		});
		containerRef.current?.addEventListener('mouseout', () => {
			if (direction === 'vertical') {
				imgRef.current.style.transform = `translateY(0px)`;
			}
			if (direction === 'horizontal') {
				imgRef.current.style.transform = `translateX(0px)`;
			}
		});
	}

	useEffect(() => {
		if (!containerRef.current || !imgRef.current) return;
		if (isScrollAuto) {
			handleImageScroll();
		}
	}, [isScrollAuto, imgRef.current]);

	const ImageEl = () => <div ref={containerRef} className={`b-blocks-image-scroller-wrapper ${direction} ${!isScrollAuto ? 'scrollable' : ''}`}>
		<img ref={imgRef} className={`b-blocks-image-scroller`} src={image.img.url} alt={image.img.alt} />
	</div>
	return <ImageEl />
};

export default ImageScroller;

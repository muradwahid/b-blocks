import React, { useEffect, useRef, useState } from 'react';
import { prefix } from '../../../utils/data';
import { BiCaretLeft, BiCaretRight } from '../../../utils/icons';
import { lineShapes } from '../../../utils/shapes';
import useDragg from '../../hooks/useDragg';
import "./style.scss";
const ImageCompareTwo = ({ beforeLabelEl, height, afterLabelEl, beforeImg, afterImg, orientation, options, dragg, label, captionEl, ...props }) => {

	const { defaultOffset, isMoveClick, autoSlide, moveMouseOver } = options;
	const { isAutoSlide, isHoverStop, speed } = autoSlide;
	const [position, setPosition] = useState(defaultOffset * 100);
	const [isDragging, setIsDragging] = useState(false);
	const containerRef = useRef(null);

	const { handleClick } = useDragg(isDragging, containerRef, setPosition, setIsDragging, orientation, isAutoSlide, isHoverStop, speed, isMoveClick)


	const applyHeight = () => {
		const container = containerRef.current;
		if (!container) return;

		const images = Array.from(container.querySelectorAll("img"));
		if (!images.length) return;

		const parsedHeight = parseInt(height, 10);
		const hasFixedHeight = !isNaN(parsedHeight) && parsedHeight > 0;

		let finalHeight;

		if (hasFixedHeight) {
			finalHeight = parsedHeight;
		} else {
			const heights = images
				.map(img => img.getBoundingClientRect().height)
				.filter(h => h > 0);

			if (!heights.length) return;

			finalHeight = Math.max(...heights);
		}

		container.style.height = `${finalHeight}px`;
		images.forEach(img => {
			img.style.height = `${finalHeight}px`;
		});
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const observer = new ResizeObserver(applyHeight);
		observer.observe(container);

		return () => observer.disconnect();
	}, []);

	return <div {...props} className={prefix}>
		<div
			ref={containerRef}
			className={`b-blocks-comparison-wrapper ${label.isShowHover ? 'b-blocks-label-hover' : ''}`}
			onMouseDown={() => setIsDragging(true)}
			onTouchStart={() => setIsDragging(true)}
			{...(moveMouseOver ? {
				onMouseMove: () => setIsDragging(true),
				onMouseLeave: () => setIsDragging(false)
			} : {})}
			onClick={handleClick}
		>
			<div
				className="b-blocks-image-wrapper"
			>
				<img src={beforeImg?.url} alt={beforeImg?.alt || beforeImg?.title} onLoad={applyHeight} />
				{beforeLabelEl}

			</div>
			<div
				className="b-blocks-image-wrapper"
				style={{
					clipPath: lineShapes(position)[dragg.shapeType + orientation]
				}}
			>
				<img src={afterImg?.url} alt={afterImg?.alt || afterImg?.title} onLoad={applyHeight} />
				{afterLabelEl}
			</div>
			<div
				className={`b-blocks-comparison-slider-handle b-blocks-slider-${orientation} ${dragg.handleType} ${dragg.shapeType !== 'default' ? 'circle-outline-line-none' : ''} `}
				style={{
					left: orientation === "horizontal" ? `${position}%` : "",
					top: orientation === "vertical" ? `${position}%` : "",
				}}
			>
				{
					dragg.handleType === 'default' ? <div key={dragg.handleType} className="b-blocks-default-icon"></div> : <div key={dragg.handleType} className={`b-blocks-${dragg.handleType}-icon`}>
						<div>
							<BiCaretLeft />
							<BiCaretRight />
						</div>
					</div>
				}
			</div>
		</div>
		{captionEl}
	</div>
};

export default ImageCompareTwo;


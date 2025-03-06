import React, { useEffect, useRef, useState } from 'react';
import "./style.scss";
import { prefix } from '../../utils/data';
import useDragg from '../hooks/useDragg';
import { BiCaretLeft, BiCaretRight } from '../../utils/icons';
import { lineShapes } from '../../utils/shapes';
import useDeviceWidth from '../hooks/useDeviceWidth';
const ImageCompareTwo = ({ attributes, beforeLabelEl, afterLabelEl, captionEl, device: backDevice, isBackend = false }) => {
    const { beforeImg, afterImg, orientation, styles, options, dragg, label } = attributes;
    const { defaultOffset, isMoveClick, autoSlide, moveMouseOver } = options;
    const { isAutoSlide, isHoverStop, speed } = autoSlide;
    const [position, setPosition] = useState(defaultOffset * 100);
    const [isDragging, setIsDragging] = useState(false);
    const { device: frontDevice } = useDeviceWidth();
    const containerRef = useRef(null);

    const device = isBackend ? backDevice : frontDevice;

    const { handleClick } = useDragg(isDragging, containerRef, setPosition, setIsDragging, orientation, isAutoSlide, isHoverStop, speed, isMoveClick)

    useEffect(() => {
        const containerHeight = styles.container.height[device];
        let time;
        time = setTimeout(() => {
            if (!isNaN(parseInt(containerHeight)) && parseInt(containerHeight) > 0) {
                containerRef.current.style.height = containerHeight;
            } else {
                const images = containerRef.current.querySelectorAll('img');
                const heights = Array.from(images).map(img => img.getBoundingClientRect().height);
                const maxHeight = Math.max(...heights);
                // alert(maxHeight)
                containerRef.current.style.height = `${maxHeight}px`;
                Array.from(images).forEach(img => img.style.height = `${maxHeight}px`);
            }
        }, 200);
        return () => clearTimeout(time);
    }, [containerRef.current, beforeImg?.url, afterImg?.url, styles.container.height[device]]);

    return <div className={prefix}>
        <div
            ref={containerRef}
            className={`icb-comparison-wrapper ${label.isShowHover ? 'icb-label-hover' : ''}`}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            {...(moveMouseOver ? {
                onMouseMove: () => setIsDragging(true),
                onMouseLeave: () => setIsDragging(false)
            } : {})}
            onClick={handleClick}
        >
            <div
                className="icb-image-wrapper"
            >
                <img src={beforeImg?.url} alt={beforeImg?.alt || beforeImg?.title} />
                {beforeLabelEl}

            </div>
            <div
                className="icb-image-wrapper"
                style={{
                    clipPath: lineShapes(position)[dragg.shapeType + orientation]
                }}
            >
                <img src={afterImg?.url} alt={afterImg?.alt || afterImg?.title} />
                {afterLabelEl}
            </div>
            <div
                className={`icb-comparison-slider-handle icb-slider-${orientation} ${dragg.handleType} ${dragg.shapeType !== 'default' ? 'circle-outline-line-none' : ''} `}
                style={{
                    left: orientation === "horizontal" ? `${position}%` : "",
                    top: orientation === "vertical" ? `${position}%` : "",
                }}
            >
                {
                    dragg.handleType === 'default' ? <div key={dragg.handleType} className="icb-default-icon"></div> : <div key={dragg.handleType} className={`icb-${dragg.handleType}-icon`}>
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


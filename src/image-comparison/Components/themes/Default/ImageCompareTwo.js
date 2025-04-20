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
    useEffect(() => {
        // const containerHeight = styles.container.height[device];
        // const containerHeight = height[device];
        let time;
        time = setTimeout(() => {
            if (!isNaN(parseInt(height)) && parseInt(height) > 0) {
                containerRef.current.style.height = height;
                const images = containerRef.current.querySelectorAll('img');
                Array.from(images).forEach(img => img.style.height = `${height}`);
            } else {
                const images = containerRef.current.querySelectorAll('img');
                const heights = Array.from(images).map(img => img.getBoundingClientRect().height);
                const maxHeight = Math.max(...heights);
                // console.log(maxHeight);
                // alert(maxHeight)
                containerRef.current.style.height = `${maxHeight}px`;
                Array.from(images).forEach(img => img.style.height = `${maxHeight}px`);
            }
        }, 200);
        return () => clearTimeout(time);
    }, [containerRef.current, beforeImg?.url, afterImg?.url, height]);

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
                <img src={beforeImg?.url} alt={beforeImg?.alt || beforeImg?.title} />
                {beforeLabelEl}

            </div>
            <div
                className="b-blocks-image-wrapper"
                style={{
                    clipPath: lineShapes(position)[dragg.shapeType + orientation]
                }}
            >
                <img src={afterImg?.url} alt={afterImg?.alt || afterImg?.title} />
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


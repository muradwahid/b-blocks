import React, { useEffect, useRef, useState } from 'react';
import "./style.scss";
import { prefix } from '../../utils/data';
import useDragg from '../hooks/useDragg';
import { BiCaretLeft, BiCaretRight } from '../../utils/icons';
import { lineShapes } from '../../utils/shapes';
const ImageCompareTwo = ({ attributes, beforeLabelEl, afterLabelEl, captionEl }) => {
    const { beforeImg, afterImg, orientation, styles, options, dragg } = attributes;
    const { defaultOffset, autoSlide, moveMouseOver } = options
    const { isAutoSlide, isHoverStop, speed } = autoSlide;
    const [position, setPosition] = useState(defaultOffset * 100);
    const [isDragging, setIsDragging] = useState(false);
    const [height, setHeight] = useState("");
    const [imageHeight, setImageHeight] = useState("")
    const [afterHeight, setAfterHeight] = useState();
    const [beforeHeight, setBeforeHeight] = useState();
    const containerRef = useRef(null);

    const { handleClick } = useDragg(isDragging, containerRef, setPosition, setIsDragging, orientation, isAutoSlide, isHoverStop, speed)

    useEffect(() => {
        setAfterHeight(undefined); // Reset heights
        setBeforeHeight(undefined);
    }, [beforeImg?.url, afterImg?.url, styles.height]);


    // Update height when afterHeight or beforeHeight changes
    useEffect(() => {
        setImageHeight(afterHeight >= beforeHeight ? `${afterHeight}px` : `${beforeHeight}px`);
    }, [beforeHeight, afterHeight, styles.height]);

    useEffect(() => {
        if (!isNaN(parseInt(styles.height)) && parseInt(styles.height) > 0) {
            containerRef.current.style.height = styles.height;
            setHeight(styles.height);
        } else {
            setHeight(imageHeight);
            containerRef.current.style.height = imageHeight;
        }
    }, [containerRef.current, imageHeight, styles.height, height]);

    return <div className={prefix}>
        <div
            ref={containerRef}
            className="bBlocks-comparison-wrapper"
            style={{ height }}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            {...(moveMouseOver ? {
                onMouseMove: () => setIsDragging(true),
                onMouseLeave: () => setIsDragging(false)
            } : {})}
            onClick={handleClick}
        >
            <div
                className="bBlocks-image-wrapper"
            >
                <img onLoad={(e) => setAfterHeight(e.target.getBoundingClientRect().height)} style={{ height }} src={afterImg?.url} alt={afterImg?.alt || afterImg?.title} key={`after-${afterImg?.url}`} />
                {afterLabelEl}
            </div>
            <div
                className="bBlocks-image-wrapper"
                style={{
                    // clipPath: orientation === 'horizontal'
                    //     ? `inset(0 0 0 ${position}%)`
                    //     : `inset(${position}% 0 0 0)`,
                    clipPath: lineShapes(position)[dragg.shapeType + orientation]
                }}
            >
                <img onLoad={(e) => setBeforeHeight(e.target.getBoundingClientRect().height)} style={{ height }} src={beforeImg?.url} alt={beforeImg?.alt || beforeImg?.title} key={`before-${beforeImg?.url}`} />
                {beforeLabelEl}
            </div>

            <div
                className={`bBlocks-comparison-slider-handle bBlocks-slider-${orientation} ${dragg.handleType} ${dragg.handleType} ${dragg.shapeType !== 'default' ? 'circle-outline-line-none' : ''}`}
                style={{
                    left: orientation === "horizontal" ? `${position}%` : "",
                    top: orientation === "vertical" ? `${position}%` : "",
                }}
            >
                {
                    dragg.handleType === 'default' ? <div key={dragg.handleType} className="bBlocks-default-icon"></div> : <div key={dragg.handleType} className={`bBlocks-${dragg.handleType}-icon`}>
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
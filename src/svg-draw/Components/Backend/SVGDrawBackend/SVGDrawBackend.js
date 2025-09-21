import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
// import SVG from 'react-inlinesvg';

import { cloudIcon } from '../../../utils/icons';

const SVGDrawBackend = ({ attributes }) => {
	const { icon, options, style } = attributes;
	const { type } = icon;
	const { strokeWidth } = style;
	const svgRef = useRef(null);
	// eslint-disable-next-line no-unused-vars
	const [animationSettings, setAnimationSettings] = useState(options);
	// const [iconProps, setIconProps] = useState(icon);

	const { duration, repeat, direction, delay, easing } = options;
	const animation = () => {
		anime({
			targets: svgRef.current?.querySelectorAll('svg path'),
			strokeDashoffset: [anime.setDashoffset, 0],
			easing,
			duration,
			delay(el, i) {
				return i * Number(delay);
			},
			loop: repeat,
			autoplay: true,
			direction,
		});
	};
	// useEffect(() => {
	// 	if (icon.type !== iconProps) {
	// 		setIconProps(icon.type);
	// 		animation();
	// 	}
	// }, [iconProps, icon]);


	useEffect(() => {
		animation();
	}, [svgRef.current?.querySelectorAll('svg'), options, animationSettings]);

	const SVGStyle = {
		// fill,
		// stroke: strokeColor,
		strokeWidth,
	};

	return <div className='svdr-icon-draw-wrapper'>
		{type.svgType === 'icon' &&
			type.iconType === 'library' &&
			icon.library && (
				<div ref={svgRef} className='react-svg-drawing svdr-svg-wrapper' style={SVGStyle} dangerouslySetInnerHTML={{ __html: icon.library }} ></div>
			)}
		{type.svgType === 'icon' && type.iconType === 'upload' && (
			<div ref={svgRef} className='react-svg-drawing svdr-svg-wrapper' style={SVGStyle} 
			dangerouslySetInnerHTML={{ __html: icon.upload || cloudIcon }} 
			>
				{/* <SVG src={icon.upload || defaultSvg} height='auto' /> */}
			</div>
		)}
		{type.svgType === 'custom' && (
			<div ref={svgRef} className='react-svg-drawing svdr-svg-wrapper' style={SVGStyle} dangerouslySetInnerHTML={{ __html: icon.custom }} ></div>
		)}
	</div>
};

export default SVGDrawBackend;

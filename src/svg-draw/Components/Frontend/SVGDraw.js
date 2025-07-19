import { useEffect, useRef } from 'react';
import anime from 'animejs';
import SVG from 'react-inlinesvg';

import defaultSvg from '../../../../assets/icons/cloud-solid.svg';

const SVGDraw = ({ attributes }) => {
	const { icon, options, style } = attributes;
	const { type } = icon;
	const { strokeWidth } = style;
	const { duration, repeat, direction, delay, easing } = options;

	const svgRef = useRef(null);
	const animation = () => {
		anime({
			targets: svgRef.current?.querySelectorAll('svg path'),
			strokeDashoffset: [anime.setDashoffset, 0],
			easing,
			duration,
			delay: (el, i) => i * Number(delay),
			loop: repeat,
			autoplay: true,
			direction,
		});
	};
	useEffect(() => {
		animation();
		if (type.iconType === 'upload') {
			const time = setTimeout(() => animation(), 300);
			return () => clearTimeout(time);
		}
	}, []);

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
			<div ref={svgRef} className='react-svg-drawing svdr-svg-wrapper' style={SVGStyle} >
				<SVG src={icon.upload || defaultSvg} height='auto' />
			</div>
		)}
		{type.svgType === 'custom' && (
			<div ref={svgRef} className='react-svg-drawing svdr-svg-wrapper' style={SVGStyle} dangerouslySetInnerHTML={{ __html: icon.custom }} ></div>
		)}
	</div>
};
export default SVGDraw;
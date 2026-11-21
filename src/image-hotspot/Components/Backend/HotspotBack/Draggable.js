import { useEffect, useRef, useState } from 'react';
import { sanitizeHtml } from '../../../../utils/sanitizeHtml';
const Draggable = ({ value, onChange = () => { }, preset, element, setActiveIdx, index, wrapperEl, align, isSelected, ...props }) => {
	const [position, setPosition] = useState(value || { x: 0, y: 0 });
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const circleRef = useRef(null);

	useEffect(() => {
		const el = circleRef.current;
		if (!el || !wrapperEl) return;
		const getPercentagePosition = (clientX, clientY) => {
			const rect = wrapperEl.getBoundingClientRect();
			const x = ((clientX - rect.left) / rect.width) * 100;
			const y = ((clientY - rect.top) / rect.height) * 100;
			return { x: Math.min(Math.max(x, 0), 100), y: Math.min(Math.max(y, 0), 100) };
		};

		const handleMouseDown = (e) => {
			setIsDragging(true);
			const percentagePos = getPercentagePosition(e.clientX, e.clientY);
			setOffset({
				x: percentagePos.x - position.x,
				y: percentagePos.y - position.y,
			});
		};

		const handleMouseMove = (e) => {
			if (isDragging) {
				const percentagePos = getPercentagePosition(e.clientX, e.clientY);
				setPosition({
					x: percentagePos.x - offset.x,
					y: percentagePos.y - offset.y,
				});
			}
		};

		const handleMouseUp = () => {
			setIsDragging(false);
		};

		wrapperEl.addEventListener('mouseup', handleMouseUp);
		wrapperEl.addEventListener('mousemove', handleMouseMove);
		el.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			el.removeEventListener('mousedown', handleMouseDown);
			wrapperEl.removeEventListener('mousemove', handleMouseMove);
			wrapperEl.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isSelected, isDragging, wrapperEl, position, element.spotOption, element.tooltipPosition, align]);

	useEffect(() => {
		setPosition(value);
	}, [value, element.spotOption]);

	useEffect(() => {
		onChange(position);
	}, [position, element.spotOption]);
	return <>
		{element.spotOption === 'text' && (
			<div
				onClick={() => setActiveIdx(index)}
				onMouseDown={() => setActiveIdx(index)}
				{...props}
				ref={circleRef}
				style={{
					position: 'absolute',
					cursor: 'move',
				}}
				className='b-blocks-bphb-hotspot-container'
				id={`b-blocks-bphb-hotspot-container-${index}`}
			>
				<div
					className={`b-blocks-bphb-hotspot ${preset === 'default'
						? 'circle'
						: preset === 'themetwo'
							? 'two'
							: preset === 'themethree'
								? 'three'
								: preset === 'themefour'
									? 'fourth'
									: 'fifth'
						}`}
				>
					{element.tooltip && (
						<div
							className={`b-blocks-tooltip-reader ${preset === 'default'
								? 'one'
								: preset === 'themetwo'
									? 'two'
									: preset === 'themethree'
										? 'three'
										: preset === 'themefour'
											? 'fourth'
											: 'fifth'
								} b-blocks-tooltip-${element.tooltipPosition}`}
						>
							<div
								className='b-blocks-bphb-tooltip-content'
								dangerouslySetInnerHTML={{ __html: sanitizeHtml( element.tooltip ) }}
							></div>
						</div>
					)}

					<span className='b-blocks-imghp-text-icon'>{element.spotText}</span>
				</div>
			</div>
		)}
		{element.spotOption === 'icon' && (
			<div
				{...props}
				ref={circleRef}
				onClick={() => setActiveIdx(index)}
				onMouseDown={() => setActiveIdx(index)}
				style={{
					position: 'absolute',
					cursor: 'move',
				}}
				className='b-blocks-bphb-hotspot-container'
				id={`b-blocks-bphb-hotspot-container-${index}`}
			>
				<div
					className={`b-blocks-bphb-hotspot ${preset === 'default'
						? 'circle'
						: preset === 'themetwo'
							? 'two'
							: preset === 'themethree'
								? 'three'
								: preset === 'themefour'
									? 'fourth'
									: 'fifth'
						}`}
				>
					{element.tooltip && (
						<div
							className={`b-blocks-tooltip-reader ${preset === 'default'
								? 'one'
								: preset === 'themetwo'
									? 'two'
									: preset === 'themethree'
										? 'three'
										: preset === 'themefour'
											? 'fourth'
											: 'fifth'
								} b-blocks-tooltip-${element.tooltipPosition}`}
						>
							<div
								className='b-blocks-bphb-tooltip-content'
								dangerouslySetInnerHTML={{ __html: sanitizeHtml( element.tooltip ) }}
							></div>
						</div>
					)}
					{
						// element.icon.type === 'upload' && <SVG src={element.icon.url.upload} height='auto' />
						element.icon.type === 'upload' && <span className='b-blocks-imghp-upload-icon' dangerouslySetInnerHTML={{ __html: sanitizeHtml( element.icon.url.upload ) }}></span>
					}
					{
						element.icon.type === 'library' && <span className='b-blocks-imghp-library-icon' dangerouslySetInnerHTML={{ __html: sanitizeHtml( element.icon.url.library ) }} ></span>
					}

				</div>
			</div>
		)}
		{element.spotOption === 'image' && (
			<div
				{...props}
				ref={circleRef}
				onClick={() => setActiveIdx(index)}
				onMouseDown={() => setActiveIdx(index)}
				style={{
					position: 'absolute',
					cursor: 'move',
				}}
				className='b-blocks-bphb-hotspot-container'
				id={`b-blocks-bphb-hotspot-container-${index}`}
			>
				<div
					className={`b-blocks-bphb-hotspot ${preset === 'default'
						? 'circle'
						: preset === 'themetwo'
							? 'two'
							: preset === 'themethree'
								? 'three'
								: preset === 'themefour'
									? 'fourth'
									: 'fifth'
						}`}
				>
					{element.tooltip && (
						<div
							className={`b-blocks-tooltip-reader ${preset === 'default'
								? 'one'
								: preset === 'themetwo'
									? 'two'
									: preset === 'themethree'
										? 'three'
										: preset === 'themefour'
											? 'fourth'
											: 'fifth'
								} b-blocks-tooltip-${element.tooltipPosition}`}
						>
							<div
								className='b-blocks-bphb-tooltip-content'
								dangerouslySetInnerHTML={{ __html: sanitizeHtml( element.tooltip ) }}
							></div>
						</div>
					)}
					{element.image && (
						<img
							src={element.image}
							style={{
								width: '100%',
								height: '100%',
								borderRadius: 'inherit',
								objectFit: 'cover',
							}}
							alt=''
						/>
					)}
				</div>
			</div>
		)}
	</>
};

export default Draggable;

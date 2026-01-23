import React, { useEffect, useMemo, useRef, useState } from "react";

function clamp(n, min, max) {
	return Math.max(min, Math.min(max, n));
}

function offsetToRatio(offset) {
	if (typeof offset === "number") return clamp(offset, 0, 1);
	const s = String(offset).trim();
	if (s.endsWith("%")) {
		const v = parseFloat(s.slice(0, -1));
		return clamp(v / 100, 0, 1);
	}
	const asNum = Number(s);
	return Number.isFinite(asNum) ? clamp(asNum, 0, 1) : 0;
}

function parseInlineSvg(svgString, pathSelector) {
	if (!svgString || typeof svgString !== "string") return null;
	if (typeof window === "undefined") return null;

	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString(svgString, "image/svg+xml");
		const svg = doc.querySelector("svg");
		if (!svg) return null;

		const viewBox = svg.getAttribute("viewBox") || null;

		const path =
			(pathSelector ? doc.querySelector(pathSelector) : null) ||
			doc.querySelector("path");

		const d = path?.getAttribute("d") || null;
		if (!d) return null;

		return { viewBox, d };
	} catch {
		return null;
	}
}

const TextPath = ({
	pathSize = 300,
	alignment = "start",
	customPath = "",
	customSvgPathSelector = "",
	showIcon = false,
	icon = null,
	iconSize = 24,
	iconStartOffset = "5%",
	iconEndOffset = "95%",
	attributes
}) => {
	const { icon:pathIcon, styles } = attributes;
	const { type, iconType, title } = pathIcon;
	const { path } = styles;

	const customSvg = type==='custom'? iconType==='library'? pathIcon.library : pathIcon.upload : '' 

	const pathId = useMemo(
		() => `textPath-${Math.random().toString(36).slice(2)}`,
		[]
	);

	const pathRef = useRef(null);
	const [iconA, setIconA] = useState(null);
	const [iconB, setIconB] = useState(null);

	const parsedSvg = useMemo(() => {
		if (!customSvg) return null;
		return parseInlineSvg(customSvg, customSvgPathSelector || null);
	}, [customSvg, customSvgPathSelector]);

	const svgViewBox =
		(type === "custom" && parsedSvg?.viewBox) ||
		parsedSvg?.viewBox ||
		`0 0 ${pathSize} ${pathSize}`;

	const generatePathD = () => {
		const width = pathSize;
		const height = pathSize;
		const centerX = width / 2;
		const centerY = height / 2;

		switch (type) {
			case "arc":
				return `M 50,${centerY + 50} Q ${centerX},${centerY - 100} ${width - 50
					},${centerY + 50}`;

			case "wave": {
				const amplitude = 40;
				const frequency = 2;
				let wavePath = `M 0,${centerY}`;
				for (let x = 0; x <= width; x += 5) {
					const y =
						centerY + amplitude * Math.sin((x / width) * Math.PI * frequency);
					wavePath += ` L ${x},${y}`;
				}
				return wavePath;
			}

			case "circle": {
				const radius = Math.min(width, height) / 2 - 20;
				return `M ${centerX - radius},${centerY}
                A ${radius},${radius} 0 1,1 ${centerX + radius},${centerY}
                A ${radius},${radius} 0 1,1 ${centerX - radius},${centerY}`;
			}

			case "custom": {
				if (customSvg && parsedSvg?.d) return parsedSvg.d;
				if (customPath) return customPath;
				return `M 50,${centerY} L ${width - 50},${centerY}`;
			}

			case "line":
				return `M 50,${centerY} L ${width - 50},${centerY}`;
		}
	};

	useEffect(() => {
		if (!showIcon) return;
		const p = pathRef.current;
		if (!p) return;
		let len = 0;
		try {
			len = p.getTotalLength();
		} catch {
			return;
		}
		if (!len || !Number.isFinite(len)) return;

		const aRatio = offsetToRatio(iconStartOffset);
		const bRatio = offsetToRatio(iconEndOffset);

		const a = p.getPointAtLength(len * aRatio);
		const b = p.getPointAtLength(len * bRatio);

		setIconA({ x: a.x, y: a.y });
		setIconB({ x: b.x, y: b.y });
	}, [
		showIcon,
		iconStartOffset,
		iconEndOffset,
		pathSize,
		type,
		customPath,
		customSvg,
		parsedSvg?.d,
	]);

	const renderIcon = () => {
		if (!icon) return null;
		if (!React.isValidElement(icon)) return null;

		return React.cloneElement(icon, {
			...icon.props,
			width: iconSize,
			height: iconSize,
			fill: icon.props.fill ?? "currentColor",
			stroke: icon.props.stroke ?? "currentColor",
			style: { display: "block", ...(icon.props.style || {}) },
		});
	};
	return (
		<div
			className="b-blocks-text-path-container"
		>
			<svg
				// width={pathSize}
				// height={pathSize}
				viewBox={svgViewBox}
				style={{
					// transform: `rotate(${rotate}deg)`,
					transition: "transform 0.3s ease",
				}}
				className="b-blocks-text-path-svg"
			>
				<defs>
					<path
						ref={pathRef}
						id={pathId}
						d={generatePathD()}
						fill="none"
						stroke={path.color}
						strokeWidth={path.thickness}
						strokeLinecap="round"
						style={{ transition: "stroke 0.3s ease" }}
					/>
				</defs>

				<use href={`#${pathId}`} />
				{showIcon && iconA && (
					<g transform={`translate(${iconA.x}, ${iconA.y})`}>
						<g
							transform={`translate(${-iconSize / 2}, ${-iconSize / 2})`}
							fill={path.color}
							stroke={path.color}
						>
							{renderIcon()}
						</g>
					</g>
				)}

				{showIcon && iconB && (
					<g transform={`translate(${iconB.x}, ${iconB.y})`}>
						<g
							transform={`translate(${-iconSize / 2}, ${-iconSize / 2})`}
							fill={path.color}
							stroke={path.color}
						>
							{renderIcon()}
						</g>
					</g>
				)}
				<text
					className='b-blocks-text-path-title'
					textAnchor={alignment}
					// style={{
					// 	transition: "fill 0.3s ease, font-size 0.3s ease",
					// 	fontSize: isHovered ? fontSize * 1.05 : fontSize,
					// }}
				>
					<textPath
						href={`#${pathId}`}
						// startOffset={
						// 	typeof startOffset === "number"
						// 		? `${startOffset * 100}%`
						// 		: startOffset
						// }
						startOffset={path.staringPoint}
						style={{ textAnchor: alignment }}
					>
						{title}
					</textPath>
				</text>
			</svg>
		</div>
	);
};

export default TextPath;

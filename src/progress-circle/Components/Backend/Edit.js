import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import { prefix } from '../../utils/data';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const formatPercentageDisplay = (value) => {
	if (Number.isInteger(value)) {
		return String(value);
	}
	return value.toFixed(2).replace(/\.?0+$/, '');
};

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		percentage,
		size,
		strokeWidth,
		fillColor,
		trackColor,
		lineCap,
		showLabel,
		labelType,
		customLabel,
		labelColor,
		labelFontSize,
		prefix: labelPrefix,
		suffix: labelSuffix,
		showTitle,
		title,
		titleColor,
		titleFontSize,
		animate,
	} = attributes;

	const safePercentage = clamp(parseFloat(percentage) || 0, 0, 100);
	const safeSize = clamp(parseInt(size, 10) || 160, 80, 400);
	let safeStroke = clamp(parseInt(strokeWidth, 10) || 12, 2, 40);
	if (safeStroke >= safeSize / 2) {
		safeStroke = Math.max(2, Math.floor(safeSize / 2 - 1));
	}
	const safeLabelFontSize = clamp(parseInt(labelFontSize, 10) || 28, 10, 80);
	const safeTitleFontSize = clamp(parseInt(titleFontSize, 10) || 15, 10, 40);
	const safeLineCap = lineCap === 'butt' ? 'butt' : 'round';

	const radius = (safeSize / 2) - (safeStroke / 2);
	const circumference = 2 * Math.PI * radius;
	const targetOffset = circumference * (1 - (safePercentage / 100));
	const cx = safeSize / 2;
	const cy = safeSize / 2;

	const blockProps = useBlockProps({
		className: [
			animate ? 'pc-animate' : '',
			`pc-linecap-${safeLineCap}`,
		].filter(Boolean).join(' '),
	});

	const wrapperStyle = {
		maxWidth: `${safeSize}px`,
	};

	const trackStyle = {
		stroke: trackColor || '#e5e7eb',
		strokeWidth: safeStroke,
	};

	const fillStyle = {
		stroke: fillColor || '#4f46e5',
		strokeWidth: safeStroke,
		strokeDasharray: circumference,
		strokeDashoffset: targetOffset,
		transition: 'stroke-dashoffset 0.2s ease-out',
	};

	const labelStyle = { fontSize: `${safeLabelFontSize}px` };
	if (labelColor) {
		labelStyle.color = labelColor;
	}

	const titleStyle = { fontSize: `${safeTitleFontSize}px` };
	if (titleColor) {
		titleStyle.color = titleColor;
	}

	const hasTitle = showTitle && title && title.trim().length > 0;
	const ariaLabel = (title && title.trim().length > 0) ? title : __('Progress', 'b-blocks');

	const percentageText = `${labelPrefix || ''}${formatPercentageDisplay(safePercentage)}${labelSuffix || ''}`;
	const labelText = (labelType === 'custom' && customLabel && customLabel.trim().length > 0)
		? customLabel
		: percentageText;

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps}>
				<div className={prefix} style={wrapperStyle}>
					<div
						className='pcVisual'
						role='progressbar'
						aria-valuenow={Math.round(safePercentage)}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label={ariaLabel}
					>
						<svg
							className='pcSvg'
							xmlns='http://www.w3.org/2000/svg'
							viewBox={`0 0 ${safeSize} ${safeSize}`}
							width={safeSize}
							height={safeSize}
							style={{ width: '100%', height: 'auto' }}
							aria-hidden='true'
							focusable='false'
						>
							<circle
								className='pcTrack'
								cx={cx}
								cy={cy}
								r={radius}
								fill='none'
								style={trackStyle}
							/>
							<circle
								className='pcFill'
								cx={cx}
								cy={cy}
								r={radius}
								fill='none'
								strokeLinecap={safeLineCap}
								transform={`rotate(-90 ${cx} ${cy})`}
								style={fillStyle}
							/>
						</svg>

						{showLabel && (
							<span className='pcLabel' style={labelStyle}>
								{labelText}
							</span>
						)}
					</div>

					{hasTitle && (
						<span className='pcTitle' style={titleStyle}>
							{title}
						</span>
					)}
				</div>
			</div>
		</>
	);
};

export default Edit;

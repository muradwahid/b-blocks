import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import { prefix } from '../../utils/data';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		title,
		showTitle,
		percentage,
		showPercentage,
		percentagePosition,
		titlePosition,
		height,
		borderRadius,
		fillColor,
		trackColor,
		titleColor,
		percentageColor,
		titleFontSize,
		striped,
		animate,
	} = attributes;

	const safePercentage = clamp(parseInt(percentage, 10) || 0, 0, 100);
	const safeHeight = clamp(parseInt(height, 10) || 20, 8, 60);
	const safeRadius = clamp(parseInt(borderRadius, 10) || 0, 0, 40);
	const safeTitleFontSize = clamp(parseInt(titleFontSize, 10) || 16, 10, 40);

	const blockProps = useBlockProps({
		className: [
			`pb-title-${titlePosition === 'inline' ? 'inline' : 'above'}`,
			`pb-percentage-${percentagePosition === 'inside' ? 'inside' : 'end'}`,
			striped ? 'pb-striped' : '',
			animate ? 'pb-animate' : '',
		].filter(Boolean).join(' '),
	});

	const trackStyle = {
		height: `${safeHeight}px`,
		backgroundColor: trackColor || '#e5e7eb',
		borderRadius: `${safeRadius}px`,
	};

	const fillStyle = {
		width: `${safePercentage}%`,
		backgroundColor: fillColor || '#4f46e5',
		borderRadius: `${safeRadius}px`,
		color: percentageColor || '#ffffff',
	};

	const titleStyle = {
		fontSize: `${safeTitleFontSize}px`,
	};
	if (titleColor) {
		titleStyle.color = titleColor;
	}

	const endPercentageStyle = {};
	if (titleColor) {
		endPercentageStyle.color = titleColor;
	}

	const hasTitle = showTitle && title && title.trim().length > 0;
	const percentageText = `${safePercentage}%`;

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps}>
				<div className={prefix}>
					<div className='pbHeader'>
						{hasTitle && (
							<span className='pbTitle' style={titleStyle}>
								{title}
							</span>
						)}

						{showPercentage && percentagePosition === 'end' && (
							<span className='pbPercentageEnd' style={endPercentageStyle}>
								{percentageText}
							</span>
						)}
					</div>

					<div className='pbTrack' style={trackStyle}>
						<div
							className='pbFill'
							role='progressbar'
							aria-valuenow={safePercentage}
							aria-valuemin={0}
							aria-valuemax={100}
							aria-label={hasTitle ? undefined : (title || __('Progress', 'b-blocks'))}
							style={fillStyle}
						>
							{showPercentage && percentagePosition === 'inside' && (
								<span className='pbPercentageInside'>{percentageText}</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Edit;

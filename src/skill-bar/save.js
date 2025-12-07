import { useBlockProps } from '@wordpress/block-editor';
export default function save({ attributes }) {
	const {
		skills,
		theme,
		template,
		columns,
		customBackgroundColor,
		customTitleColor,
		customPercentageColor,
		// customBarBackgroundColor,
		customBarProgressColor,
		customBarRemainingColor
	} = attributes;

	const isCustomizable = theme === 'customizable';

	const customStyles = {};
	if (isCustomizable && customBackgroundColor) {
		customStyles.backgroundColor = customBackgroundColor;
	}

	const titleStyles = {};
	if (isCustomizable && customTitleColor) {
		titleStyles.color = customTitleColor;
	}

	const percentageStyles = {};
	if (isCustomizable && customPercentageColor) {
		percentageStyles.color = customPercentageColor;
	}

	const blockProps = useBlockProps.save({
		className: `skill-bar-block theme-${theme} template-${template} columns-${columns}`,
	});

	return (
		<div {...blockProps}>
			<div className="b-blocks-skill-bar-skills-grid">
				{skills.map((skill, index) => {
					const barBgStyle = {};
					if (isCustomizable && customBarRemainingColor) {
						barBgStyle.backgroundColor = customBarRemainingColor;
					}

					const barFillColor = isCustomizable && customBarProgressColor ? customBarProgressColor : skill.color;
					const circularStroke = isCustomizable && customBarProgressColor ? customBarProgressColor : skill.color;
					const circularBgStroke = isCustomizable && customBarRemainingColor ? customBarRemainingColor : '#e0e0e0';

					return (
						<div
							key={index}
							className="b-blocks-skill-bar-skill-item"
							data-percentage={skill.percentage}
							style={customStyles}
						>
							<div className="skill-header">
								<span className="skill-title" style={titleStyles}>{skill.title}</span>
								<span className="skill-percentage" style={percentageStyles}>{skill.percentage}%</span>
							</div>
							{template === 'circular' ? (
								<div className="skill-circular">
									<svg viewBox="0 0 100 100">
										<circle
											className="skill-circular-bg"
											cx="50"
											cy="50"
											r="45"
											fill="none"
											stroke={circularBgStroke}
											strokeWidth="10"
										/>
										<circle
											className="b-blocks-skill-bar-skill-circular-progress"
											cx="50"
											cy="50"
											r="45"
											fill="none"
											stroke={circularStroke}
											strokeWidth="10"
											strokeDasharray={`${2 * Math.PI * 45}`}
											strokeDashoffset={`${2 * Math.PI * 45}`}
											transform="rotate(-90 50 50)"
											data-color={circularStroke}
										/>
									</svg>
									<div className="b-blocks-skill-bar-skill-circular-text" style={percentageStyles}>{skill.percentage}%</div>
								</div>
							) : (
								<div className="skill-bar-wrapper">
									<div className="skill-bar-bg" style={barBgStyle}>
										<div
											className="b-blocks-skill-bar-skill-bar-fill"
											style={{ backgroundColor: barFillColor }}
											data-percentage={skill.percentage}
											data-color={barFillColor}
										/>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
export const chartConfig = (attributes) => {
	const { data, type, textColor, isXScale, isXGridLine, isYScale, isYGridLine, gridLineColor, isTitle, title, titleFontSize, titleColor, isSubtitle, subtitle, subtitleFontSize, subtitleColor } = attributes;

	return {
		type,
		data,
		options: {
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: 'top',

					labels: {
						usePointStyle: true,
						color: textColor
					}
				},
				title: {
					display: isTitle,
					text: title,
					color: titleColor,
					font: {
						size: titleFontSize,
						family: 'Roboto',
					},
					padding: {
						bottom: 10
					}
				},
				subtitle: {
					display: isSubtitle,
					text: subtitle,
					color: subtitleColor,
					font: {
						size: subtitleFontSize,
						family: 'Roboto',
					},
					padding: {
						bottom: 15
					}
				},
				tooltip: {
					position: 'nearest',
					usePointStyle: true
				}
			},
			scales: {
				x: {
					display: isXScale,
					ticks: {
						color: textColor
					},
					grid: {
						display: isXGridLine,
						color: gridLineColor
					}
				},
				y: {
					display: isYScale,
					beginAtZero: true,
					ticks: {
						color: textColor
					},
					grid: {
						display: isYGridLine,
						color: gridLineColor
					}
				}
			}
		}
	}
};
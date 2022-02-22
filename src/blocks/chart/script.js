// import Sass
import './style.scss';

// Chart
const allChart = document.querySelectorAll('.wp-block-b-blocks-chart');

Object.values(allChart).map(chart => {
	const chartEl = document.getElementById(chart.id);

	const { data, type, textColor, gridLineColor, isTitle, title, titleFontSize, titleColor, isXScale, isXGridLine, isYScale, isYGridLine, isSubtitle, subtitle, subtitleFontSize, subtitleColor, isDownload } = JSON.parse(chartEl.dataset.chart);

	const chartCtx = document.querySelector(`#${chart.id} .bBlocksChart canvas`);
	const bChart = new Chart(chartCtx, {
		type,
		data,
		options: {
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
	});

	isDownload && document.querySelector(`#${chart.id} .downloadArea .downloadChart`).addEventListener('click', () => {
		const a = document.createElement('a');
		a.href = bChart.toBase64Image();
		a.download = 'b-chart.png';
		a.click();
	});

	chartEl.removeAttribute('data-chart');
});
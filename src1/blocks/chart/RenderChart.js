import { useEffect, useRef } from 'react';

const RenderChart = ({ attributes, clientId, isBackend = false }) => {
	const { data, type, textColor, isXScale, isXGridLine, isYScale, isYGridLine, gridLineColor, isTitle, title, titleFontSize, titleColor, isSubtitle, subtitle, subtitleFontSize, subtitleColor, isDownload } = attributes;

	const chartCtxWrap = useRef(null);
	const downloadChart = useRef(null);

	const dependency = isBackend ? [data, type, textColor, isXScale, isXGridLine, isYScale, isYGridLine, gridLineColor, isTitle, title, titleFontSize, titleColor, isSubtitle, subtitle, subtitleFontSize, subtitleColor, isDownload] : []

	useEffect(() => {
		if (isBackend) {
			chartCtxWrap.current.innerHTML = '';
			chartCtxWrap.current.innerHTML = `<canvas>Your browser does not support the canvas element.</canvas>`;
		}

		const chartCtx = document.querySelector(`#bBlocksChart-${clientId} .bBlocksChart canvas`);

		const bChart = chartCtx && new Chart(chartCtx, {
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
		});

		isDownload && downloadChart?.current.addEventListener('click', () => {
			const a = document.createElement('a');
			a.href = bChart.toBase64Image();
			a.download = 'b-chart.png';
			a.click();
		});
	}, dependency);

	return <>
		{isDownload && <div className='downloadArea'>
			<div className='downloadChart' ref={downloadChart}>Download Chart</div>
		</div>}

		<div className='bBlocksChart' ref={chartCtxWrap}>
			<canvas>Your browser does not support the canvas element.</canvas>
		</div>
	</>
}
export default RenderChart;
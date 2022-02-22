import { useEffect, useRef } from '@wordpress/element';

import Settings from './settings';

const Edit = props => {
	const { className, attributes: { data, type, background, textColor, isXScale, isXGridLine, isYScale, isYGridLine, gridLineColor, width, alignment, isTitle, title, titleFontSize, titleColor, isSubtitle, subtitle, subtitleFontSize, subtitleColor, isDownload }, setAttributes, clientId } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]); // Set & Update clientId to cId

	const chartCtxWrap = useRef(null);
	const downloadChart = useRef(null);

	useEffect(() => {
		chartCtxWrap.current.innerHTML = '';
		chartCtxWrap.current.innerHTML = `<canvas>Your browser does not support the canvas element.</canvas>`;

		const chartCtx = document.querySelector(`#bBlocksChart-${clientId} .bBlocksChart canvas`);

		const bChart = chartCtx && new Chart(chartCtx, {
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

		isDownload && downloadChart?.current.addEventListener('click', () => {
			const a = document.createElement('a');
			a.href = bChart.toBase64Image();
			a.download = 'b-chart.png';
			a.click();
		});
	}, [data, type, textColor, gridLineColor, isTitle, title, titleFontSize, titleColor, isSubtitle, subtitle, subtitleFontSize, subtitleColor, isDownload]);

	return <>
		<Settings settings={props} />

		<div className={className} id={`bBlocksChart-${clientId}`}>
			<style dangerouslySetInnerHTML={{
				__html: `
				#bBlocksChart-${clientId}{
					text-align: ${alignment};
				}
				#bBlocksChart-${clientId} .bBlocksChart, #bBlocksChart-${clientId} .downloadArea{
					width: ${width};
				}
				#bBlocksChart-${clientId} .bBlocksChart canvas{
					${background?.styles || 'background-color: #0000;'};
				}
			`}} />

			{isDownload && <div className='downloadArea'>
				<div className='downloadChart' ref={downloadChart}>Download Chart</div>
			</div>}

			<div className='bBlocksChart' ref={chartCtxWrap}>
				<canvas>Your browser does not support the canvas element.</canvas>
			</div>
		</div>
	</>;
};
export default Edit;
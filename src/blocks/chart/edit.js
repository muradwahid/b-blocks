import { useEffect, useRef } from '@wordpress/element';

import Settings from './settings';

const Edit = props => {
    const { className, attributes: { data, type, background, textColor, gridLineColor, width, alignment, isTitle, title, titleFontSize, titleColor, isSubtitle, subtitle, subtitleFontSize, subtitleColor }, setAttributes, clientId } = props;

    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]);
    const chartCtxWrap = useRef(null);

    useEffect(() => {
        chartCtxWrap.current.innerHTML = '';
        chartCtxWrap.current.innerHTML = `<canvas>Your browser does not support the canvas element.</canvas>`;

        const chartCtx = document.querySelector(`#bBlocksChart-${clientId} .bBlocksChart canvas`);

        chartCtx && new Chart(chartCtx, {
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
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: gridLineColor
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: gridLineColor
                        }
                    }
                }
            }
        });
    }, [data, type, textColor, gridLineColor, isTitle, title, titleFontSize, titleColor, isSubtitle, subtitle, subtitleFontSize, subtitleColor]);

    return <>
        <Settings settings={props} />


        <div className={className} id={`bBlocksChart-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                #bBlocksChart-${clientId}{
                    text-align: ${alignment};
                }
                #bBlocksChart-${clientId} .bBlocksChart{
                    width: ${width};
                }
                #bBlocksChart-${clientId} .bBlocksChart canvas{
                    ${background?.styles || 'background-color: #0000;'};
                }
            `}} />

            <div className='bBlocksChart' ref={chartCtxWrap}>
                <canvas>Your browser does not support the canvas element.</canvas>
            </div>
        </div>
    </>;
};
export default Edit;
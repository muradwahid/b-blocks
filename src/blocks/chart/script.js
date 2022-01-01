// import Sass
import './style.scss';

// Chart
const allChart = document.querySelectorAll('.wp-block-b-blocks-chart');

Object.values(allChart).map(chart => {
    const chartEl = document.getElementById(chart.id);

    const { data, type, textColor, gridLineColor, isTitle, title, titleFontSize, titleColor, isSubtitle, subtitle, subtitleFontSize, subtitleColor } = JSON.parse(chartEl.dataset.chart);

    const chartCtx = document.querySelector(`#${chart.id} .bBlocksChart canvas`);
    new Chart(chartCtx, {
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

    chartEl.removeAttribute('data-chart');
});
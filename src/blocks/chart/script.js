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
        data: data || {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
                {
                    label: 'T-Shirts Sell 2021',
                    data: [3, 9, 10, 16, 14, 16],
                    backgroundColor: ['#ff638433', '#36a28733', '#ffce5633', '#4bc0c033', '#9966ff33', '#ff9f4033'],
                    borderColor: ['#ff6384', '#36a287', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'],
                    tension: 0.3,
                    borderWidth: 2,
                    hoverBorderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 4,
                    pointStyle: 'triangle'
                },
                {
                    label: 'Shoes Sell 2021',
                    data: [5, 7, 12, 14, 13, 17],
                    backgroundColor: ['#ff638433', '#36a28733', '#ffce5633', '#4bc0c033', '#9966ff33', '#ff9f4033'],
                    borderColor: ['#ff6384', '#36a287', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'],
                    tension: 0.3,
                    borderWidth: 2,
                    hoverBorderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 4,
                    pointStyle: 'circle'
                }
            ]
        },
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
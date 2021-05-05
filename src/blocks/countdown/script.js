// Import Sass
import './style.scss';

const allCountdown = document.querySelectorAll('.wp-block-b-blocks-countdown');

Object.values(allCountdown).map(countdown => {
    const countdownId = countdown.id;

    const countdownData = document.getElementById(`${countdownId}`);
    const { destDate } = JSON.parse(countdownData.dataset.date);

    const dest = new Date(destDate).getTime(); // Convert Destination Date in time (milliseconds)

    setInterval(() => {
        const now = new Date().getTime(); // Convert Current Date in time (milliseconds)
        const diff = dest > now ? (dest - now) / 1000 : 0; // Different time in seconds

        const days = Math.floor(diff / (24 * 60 * 60));
        const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((diff % (60 * 60)) / 60);
        const seconds = Math.floor(diff % 60);


        const countdownDays = document.querySelector(`#${countdownId} .countdownDays .holder`);
        countdownDays ? countdownDays.innerHTML = days : null;

        const countdownHours = document.querySelector(`#${countdownId} .countdownHours .holder`);
        countdownHours ? countdownHours.innerHTML = hours : null;

        const countdownMinutes = document.querySelector(`#${countdownId} .countdownMinutes .holder`);
        countdownMinutes ? countdownMinutes.innerHTML = minutes : null;

        const countdownSeconds = document.querySelector(`#${countdownId} .countdownSeconds .holder`);
        countdownSeconds ? countdownSeconds.innerHTML = seconds : null;
    }, 1000);
});
// Import Sass
import './style.scss';

const allCountdown = document.querySelectorAll('.wp-block-b-blocks-countdown');

Object.values(allCountdown).map(countdown => {
	const countdownId = countdown.id;

	const countdownEl = document.getElementById(countdownId);

	const { destDate } = JSON.parse(countdownEl.dataset.date);

	const dest = new Date(destDate).getTime(); // Convert Destination Date in time (milliseconds)

	setInterval(() => {
		const now = new Date().getTime(); // Convert Current Date in time (milliseconds)
		const diff = dest > now ? (dest - now) / 1000 : 0; // Different time in seconds

		const days = Math.floor(diff / (24 * 60 * 60));
		const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
		const minutes = Math.floor((diff % (60 * 60)) / 60);
		const seconds = Math.floor(diff % 60);


		const countdownDays = document.querySelector(`#${countdownId} .countdownDays .digit`);
		countdownDays ? countdownDays.innerHTML = (1 === days.toString().length ? ('0' + days).slice(-2) : days) : null;

		const countdownHours = document.querySelector(`#${countdownId} .countdownHours .digit`);
		countdownHours ? countdownHours.innerHTML = ('0' + hours).slice(-2) : null;

		const countdownMinutes = document.querySelector(`#${countdownId} .countdownMinutes .digit`);
		countdownMinutes ? countdownMinutes.innerHTML = ('0' + minutes).slice(-2) : null;

		const countdownSeconds = document.querySelector(`#${countdownId} .countdownSeconds .digit`);
		countdownSeconds ? countdownSeconds.innerHTML = ('0' + seconds).slice(-2) : null;
	}, 1000);

	countdownEl.removeAttribute('data-date');
});
// import Sass
import './style.scss';

// Counters
const allCounters = document.querySelectorAll('.wp-block-b-blocks-counters');

Object.values(allCounters).map(counters => {
	const countersEl = document.getElementById(counters.id);

	const counterEl = document.querySelectorAll(`#${counters.id} .bBlocksCounters .counterNumber .number`);

	const duration = parseInt(JSON.parse(countersEl.dataset.duration));

	counterEl?.forEach(count => {
		const startNumber = parseInt(count.dataset.countStart);
		const endNumber = parseInt(count.dataset.countEnd);

		const start = Date.now(); // Remember start time
		const timer = setInterval(() => {
			const timePassed = Date.now() - start; // How much time passed from the start?

			if (timePassed >= duration) {
				clearInterval(timer); // Finish the animation after duration
				return;
			}

			count.innerText = parseInt((timePassed / (duration / (endNumber - startNumber))) + startNumber);
		}, 20);

		setTimeout(() => {
			count.innerText = endNumber
		}, duration);
	});
});
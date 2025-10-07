export const performCounter = (counterEl, duration, separator = {}) => {
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

			count.innerText = formateNumberWithSeparator(parseInt((timePassed / (duration / (endNumber - startNumber))) + startNumber), separator);
		}, 20);

		setTimeout(() => {
			count.innerText = formateNumberWithSeparator(endNumber, separator)
		}, duration);
	});
}

export const formateNumberWithSeparator = (number, separator) => {
	const { char = '' } = separator;

	return char ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, char) : number;
}
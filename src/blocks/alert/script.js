// import Sass
import './style.scss';

// Alert
const allAlert = document.querySelectorAll('.wp-block-b-blocks-alert');

Object.values(allAlert).map(alert => {
	const alertEl = document.getElementById(alert.id);

	const alertCloseEl = document.querySelector(`#${alert.id} .bBlocksAlert .alert .alertClose`);

	alertCloseEl && alertCloseEl.addEventListener('click', () => {
		alertEl.classList.add('transformHidden');

		setTimeout(() => {
			alertEl.style.display = 'none';
		}, 400);
	});
});
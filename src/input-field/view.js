import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import InputField from './Components/Common/InputField';
import { safeJsonParse } from './utils/functions';

document.addEventListener('bblocks:inputField:loaded', (even) => {
	const inputFieldEls = even.target.querySelectorAll('.wp-block-b-blocks-input-field[data-attributes]');
	inputFieldEls.forEach(inputFieldEl => {
		let attributes = safeJsonParse(inputFieldEl.dataset.attributes)

		if (attributes) {
			createRoot(inputFieldEl).render(<>
				<Style attributes={attributes} id={inputFieldEl.id} />
				<InputField attributes={attributes} />
			</>);

			inputFieldEl.removeAttribute('data-attributes');
		}
	});
});
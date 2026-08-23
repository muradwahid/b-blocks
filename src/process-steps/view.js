import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import ProcessSteps from './Components/Frontend/ProcessSteps';

document.addEventListener('DOMContentLoaded', () => {
	const processStepsEls = document.querySelectorAll('.wp-block-b-blocks-process-steps');

	processStepsEls.forEach((processStepsEl) => {
		const attributes = JSON.parse(processStepsEl.dataset.attributes);

		createRoot(processStepsEl).render(<>
			<Style attributes={attributes} id={processStepsEl.id} />

			<ProcessSteps attributes={attributes} />
		</>);

		processStepsEl?.removeAttribute('data-attributes');
	});
});

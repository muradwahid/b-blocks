import { createRoot } from 'react-dom/client';
import './style.scss';
import Style from './Components/Common/Style';
import DualColorHeading from './Components/Common/DualColorHeading/DualColorHeading';

document.addEventListener('DOMContentLoaded', () => {
	const dualColorHeadingEls = document.querySelectorAll('.wp-block-b-blocks-dual-color-heading');
	dualColorHeadingEls.forEach(dualColorHeadingEl => {
		const attributes = JSON.parse(dualColorHeadingEl.dataset.attributes);
		createRoot(dualColorHeadingEl).render(
      <>
        <Style attributes={attributes} id={dualColorHeadingEl.id} />
        <DualColorHeading attributes={attributes} />
      </>
    );

		dualColorHeadingEl?.removeAttribute('data-attributes');
	});
});
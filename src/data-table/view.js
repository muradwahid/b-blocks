import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import Frontend from './Components/Frontend/Frontend';

document.addEventListener('DOMContentLoaded', () => {
	const tableEls = document.querySelectorAll('.wp-block-b-blocks-table[data-attributes]');
	tableEls.forEach(tableEl => {
    let attributes = {};
    try {
      const raw = tableEl.dataset.attributes;
      if (raw && raw !== 'undefined' && raw !== '') {
        attributes = JSON.parse(raw);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('table: Invalid attributes JSON', e);
    }
    const templateContent = tableEl.querySelector('.b-blocks-table-innerBlocks-contents>table');
    if (!templateContent) return;

		createRoot(tableEl).render(<>
			<Style attributes={attributes} id={tableEl.id} />

      <Frontend attributes={attributes} templateContent={templateContent} />
		</>);

		tableEl?.removeAttribute('data-attributes');
	});
});
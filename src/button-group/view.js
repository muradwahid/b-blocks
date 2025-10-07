import { createRoot } from 'react-dom/client';

import { sanitizeHTML, sanitizeURL } from '../../../bpl-tools/utils/common';

import './style.scss';
import Style from './Components/Common/Style';
import { prefix } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const allButtonGroupEls = document.querySelectorAll('.wp-block-b-blocks-button-group');
	allButtonGroupEls.forEach(buttonGroupEl => {
		const attributes = JSON.parse(buttonGroupEl.dataset.attributes);
		const { btnType, btnOne, btnOneLink, btnTwo, btnTwoLink, isSep, sepType, sepText, sepIcon } = attributes;

		createRoot(buttonGroupEl).render(<>
			<Style attributes={attributes} id={buttonGroupEl.id} />

			<div className={prefix}>
				<div className='bBlocksBtn firstBtn'>
					<a className={`btnOne btn-${btnType}`} href={sanitizeURL(btnOneLink)} dangerouslySetInnerHTML={{ __html: sanitizeHTML(btnOne) }} />

					{isSep && <div className='btnSeparator'>
						{'text' === sepType ? <span>{sepText}</span> : 'icon' === sepType && sepIcon?.class ? <i className={sepIcon?.class}></i> : ''}
					</div>}
				</div>

				<div className='bBlocksBtn secondBtn'>
					<a className={`btnTwo btn-${btnType}`} href={sanitizeURL(btnTwoLink)} dangerouslySetInnerHTML={{ __html: sanitizeHTML(btnTwo) }} />
				</div>
			</div>
		</>);

		buttonGroupEl?.removeAttribute('data-attributes');
	});
});
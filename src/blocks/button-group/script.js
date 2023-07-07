import { render } from 'react-dom';

import './style.scss';
import Style from './Style';

document.addEventListener('DOMContentLoaded', () => {
	const allButtonGroup = document.querySelectorAll('.wp-block-b-blocks-button-group');
	allButtonGroup.forEach(buttonGroup => {
		const attributes = JSON.parse(buttonGroup.dataset.attributes);
		const { cId, btnType, btnOne, btnOneLink, btnTwo, btnTwoLink, isSep, sepType, sepText, sepIcon } = attributes;

		render(<>
			<Style attributes={attributes} clientId={cId} />

			<div className='bBlocksButtonGroup'>
				<div className='bBlocksBtn firstBtn'>
					<a className={`btnOne btn-${btnType}`} href={btnOneLink} dangerouslySetInnerHTML={{ __html: btnOne }} />

					{isSep && <div className='btnSeparator'>
						{'text' === sepType ? <span>{sepText}</span> : 'icon' === sepType && sepIcon?.class ? <i className={sepIcon?.class}></i> : ''}
					</div>}
				</div>

				<div className='bBlocksBtn secondBtn'>
					<a className={`btnTwo btn-${btnType}`} href={btnTwoLink} dangerouslySetInnerHTML={{ __html: btnTwo }} />
				</div>
			</div>
		</>, buttonGroup);

		buttonGroup?.removeAttribute('data-attributes');
	});
});
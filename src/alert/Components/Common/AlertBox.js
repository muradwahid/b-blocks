import { sanitizeHTML } from '../../../../../bpl-tools/utils/common';

import { prefix } from '../../utils/data';

const AlertBox = ({ attributes, alertEl = null }) => {
	const { message, icon, isDismiss } = attributes;

	return <div className={prefix}>
		<div className='alert'>
			{icon?.class && <i className={`alertIcon ${icon?.class}`}></i>}

			{message && <span className='alertMessage' dangerouslySetInnerHTML={{ __html: sanitizeHTML(message) }} />}

			{isDismiss && <i className='alertClose fa fa-times-circle' onClick={() => {
				if (alertEl) {
					alertEl.classList.add('transformHidden');

					setTimeout(() => {
						alertEl.style.display = 'none';
					}, 400);
				}
			}}></i>}
		</div>
	</div>
}
export default AlertBox;
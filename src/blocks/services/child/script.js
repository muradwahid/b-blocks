import { createRoot } from 'react-dom/client';

import Style from './Components/Common/Style';
import Service from './Components/Common/Service';

document.addEventListener('DOMContentLoaded', () => {
	const serviceEls = document.querySelectorAll('.wp-block-b-blocks-service');
	serviceEls.forEach(serviceEl => {
		const attributes = JSON.parse(serviceEl.dataset.attributes);
		const { isTitle, title, isDesc, desc, link, linkIn } = attributes;

		createRoot(serviceEl).render(<>
			<Style attributes={attributes} clientId={attributes.cId} />

			<Service attributes={attributes}>
				{isTitle && title && <>
					{'title' === linkIn && link ?
						<a href={link}><h3 className='title' dangerouslySetInnerHTML={{ __html: title }} /></a> :
						<h3 className='title' dangerouslySetInnerHTML={{ __html: title }} />}
				</>}

				{isDesc && desc && <p className='description' dangerouslySetInnerHTML={{ __html: desc }} />}
			</Service>
		</>);

		serviceEl?.removeAttribute('data-attributes');
	});
});
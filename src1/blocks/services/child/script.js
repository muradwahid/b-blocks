import { render } from 'react-dom';

import Style from './Style';
import Service from './Service';

// Service
document.addEventListener('DOMContentLoaded', () => {
	const allService = document.querySelectorAll('.wp-block-b-blocks-service');
	allService.forEach(service => {
		const attributes = JSON.parse(service.dataset.attributes);
		const { isTitle, title, isDesc, desc, link, linkIn } = attributes;

		render(<>
			<Style attributes={attributes} clientId={attributes.cId} />

			<Service attributes={attributes}>
				{isTitle && title && <>
					{'title' === linkIn && link ?
						<a href={link}><h3 className='title' dangerouslySetInnerHTML={{ __html: title }} /></a> :
						<h3 className='title' dangerouslySetInnerHTML={{ __html: title }} />}
				</>}

				{isDesc && desc && <p className='description' dangerouslySetInnerHTML={{ __html: desc }} />}
			</Service>
		</>, service);

		service?.removeAttribute('data-attributes');
	});
});
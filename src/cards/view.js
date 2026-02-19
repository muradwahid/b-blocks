import { createRoot } from 'react-dom/client';

import { sanitizeHTML, sanitizeURL } from '../../../bpl-tools/utils/common';

import './style.scss';
import Style from './Components/Common/Style';
import { prefix } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const cardsEls = document.querySelectorAll('.wp-block-b-blocks-cards');
	cardsEls.forEach(cardEl => {
		const attributes = JSON.parse(cardEl.dataset.attributes);
		const { cards = [], columns, layout, link = {}, imgPos, isCat, isTitle, titlePos, isDesc } = attributes;
		const { target: linkTarget = '_self', element: linkElement = 'card' } = link;


		createRoot(cardEl).render(<>
			<Style attributes={attributes} id={cardEl.id} />

			<div className={`${prefix} ${layout || 'vertical'} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				{cards.map((item, index) => {
					const { img, cat, title, desc, link = '' } = item;

					// Components
					const CardTitle = () => isTitle && <LinkProvider enabled={linkElement === 'title'} url={link} target={linkTarget}>
						<h3 className={`${prefix}-cardTitle`} dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }} />
					</LinkProvider>

					const CardImage = () => img?.url && <LinkProvider enabled={linkElement === 'image'} url={link} target={linkTarget}>
						<figure className={`${prefix}-cardImage`}>
							<img src={img.url} alt={img?.alt || img?.title} />

							{'image' === titlePos && <CardTitle />}
						</figure>
					</LinkProvider>;

					return <div key={index} id={`${prefix}-card-${index}`}>
						<LinkProvider enabled={linkElement === 'card'} url={link} target={linkTarget}>
							<div className={`${prefix}-card ${'bottom' === imgPos ? 'bottomImg' : 'topImg'}`}>
								{'top' === imgPos && <CardImage />}

								<div className='cardDetails'>
									{isCat && <h6 className={`${prefix}-cardCategory`} dangerouslySetInnerHTML={{ __html: sanitizeHTML(cat) }} />}

									{'content' === titlePos && <CardTitle />}

									{isDesc && <p className={`${prefix}-cardDescription`} dangerouslySetInnerHTML={{ __html: sanitizeHTML(desc) }} />}
								</div>

								{'bottom' === imgPos && <CardImage />}
							</div>
						</LinkProvider>
					</div>;
				})}
			</div>
		</>);

		cardEl?.removeAttribute('data-attributes');
	});
});

const LinkProvider = ({ enabled, url, target, children }) => {
	if (enabled && url) {
		return <a className='cardLink' href={sanitizeURL(url)} target={target}>{children}</a>
	} else {
		return children;
	}
}
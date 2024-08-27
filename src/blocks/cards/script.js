import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Style';

document.addEventListener('DOMContentLoaded', () => {
	const allCards = document.querySelectorAll('.wp-block-b-blocks-cards');
	allCards.forEach(card => {
		const attributes = JSON.parse(card.dataset.attributes);
		const { cId, cards = [], columns, layout, link = {}, imgPos, isCat, isTitle, titlePos, isDesc } = attributes;
		const { target: linkTarget = '_self', element: linkElement = 'card' } = link;

		createRoot(card).render(<>
			<Style attributes={attributes} clientId={cId} />

			<div className={`bBlocksCards ${layout || 'vertical'} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				{cards.map((item, index) => {
					const { img, cat, title, desc, link = '' } = item;

					// Components
					const CardTitle = () => isTitle && <LinkProvider enabled={linkElement === 'title'} url={link} target={linkTarget}>
						<h3 className='cardTitle' dangerouslySetInnerHTML={{ __html: title }} />
					</LinkProvider>

					const CardImage = () => img?.url && <LinkProvider enabled={linkElement === 'image'} url={link} target={linkTarget}>
						<figure className='cardImage'>
							<img src={img.url} alt={img?.alt || img?.title} />

							{'image' === titlePos && <CardTitle />}
						</figure>
					</LinkProvider>;

					return <div key={index} id={`bBlocksCard-${index}`}>
						<LinkProvider enabled={linkElement === 'card'} url={link} target={linkTarget}>
							<div className={`bBlocksCard ${'bottom' === imgPos ? 'bottomImg' : 'topImg'}`}>
								{'top' === imgPos && <CardImage />}

								<div className='cardDetails'>
									{isCat && <h6 className='cardCategory' dangerouslySetInnerHTML={{ __html: cat }} />}

									{'content' === titlePos && <CardTitle />}

									{isDesc && <p className='cardDescription' dangerouslySetInnerHTML={{ __html: desc }} />}
								</div>

								{'bottom' === imgPos && <CardImage />}
							</div>
						</LinkProvider>
					</div>;
				})}
			</div>
		</>);

		card?.removeAttribute('data-attributes');
	});
});

const LinkProvider = ({ enabled, url, target, children }) => {
	if (enabled && url) {
		return <a className='cardLink' href={url} target={target}>{children}</a>
	} else {
		return children;
	}
}
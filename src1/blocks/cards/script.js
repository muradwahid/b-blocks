import { render } from 'react-dom';

import './style.scss';
import Style from './Style';

// Cards
document.addEventListener('DOMContentLoaded', () => {
	const allCards = document.querySelectorAll('.wp-block-b-blocks-cards');
	allCards.forEach(card => {
		const attributes = JSON.parse(card.dataset.attributes);
		const { cId, cards = [], columns, layout, imgPos, isCat, isTitle, titlePos, isDesc } = attributes;

		render(<>
			<Style attributes={attributes} clientId={cId} />

			<div className={`bBlocksCards ${layout || 'vertical'} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				{cards.map((item, index) => {
					const { img, cat, title, desc } = item;

					// Components
					const CardTitle = () => isTitle && <h3 className='cardTitle' dangerouslySetInnerHTML={{ __html: title }} />

					const CardImage = () => img?.url && <figure className='cardImage'>
						<img src={img.url} alt={img?.alt || img?.title} />

						{'image' === titlePos && <CardTitle />}
					</figure>;

					return <div key={index} id={`bBlocksCard-${index}`}>
						<div className={`bBlocksCard ${'bottom' === imgPos ? 'bottomImg' : 'topImg'}`}>
							{'top' === imgPos && <CardImage />}

							<div className='cardDetails'>
								{isCat && <h6 className='cardCategory' dangerouslySetInnerHTML={{ __html: cat }} />}

								{'content' === titlePos && <CardTitle />}

								{isDesc && <p className='cardDescription' dangerouslySetInnerHTML={{ __html: desc }} />}
							</div>

							{'bottom' === imgPos && <CardImage />}
						</div>
					</div>;
				})}
			</div>
		</>, card);

		card?.removeAttribute('data-attributes');
	});
});
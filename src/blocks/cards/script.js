import { RichText } from '@wordpress/block-editor';
import { render } from '@wordpress/element';

import './style.scss';
import Style from './Style';

// Cards
document.addEventListener('DOMContentLoaded', () => {
	const allCards = document.querySelectorAll('.wp-block-b-blocks-cards');
	allCards.forEach(card => {
		const attributes = JSON.parse(card.dataset.attributes);
		const { cards = [], columns, layout, imgPos, isCat, isTitle, titlePos, isDesc } = attributes;

		render(<>
			<Style attributes={attributes} clientId={attributes.cId} />

			<div className={`bBlocksCards ${layout || 'vertical'} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				{cards.map((item, index) => {
					const { img, cat, title, desc } = item;

					// Components
					const CardTitle = () => isTitle && <RichText.Content className='cardTitle' tagName='h3' value={title} />

					const CardImage = () => img?.url && <figure className='cardImage'>
						<img className={img?.id ? `wp-image-${img.id}` : null} src={img.url} alt={img?.alt || img?.title} />

						{'image' === titlePos && <CardTitle />}
					</figure>;

					return <div key={index} id={`bBlocksCard-${index}`}>
						<div className={`bBlocksCard ${'bottom' === imgPos ? 'bottomImg' : 'topImg'}`}>
							{'top' === imgPos && <CardImage />}

							<div className='cardDetails'>
								{isCat && <RichText.Content className='cardCategory' tagName='h6' value={cat} />}

								{'content' === titlePos && <CardTitle />}

								{isDesc && <RichText.Content className='cardDescription' tagName='p' value={desc} />}
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
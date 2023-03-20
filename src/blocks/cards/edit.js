import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';
import produce from 'immer';

// Settings Components
import { tabController } from '../../../../Components/Helper/functions';
import { ImagePlaceholder } from '../../../../Components/ImageControl';

import Settings from './Settings';
import Style from './Style';

const Edit = props => {
	const { className, attributes, setAttributes, clientId, isSelected } = props;
	const { cards = [], columns, layout, imgPos, isCat, isTitle, titlePos, isDesc } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	useEffect(() => tabController(), [isSelected]);

	const [activeIndex, setActiveIndex] = useState(0);

	const updateCard = (type, val) => {
		const newCard = produce(cards, draft => {
			draft[activeIndex][type] = val;
		});
		setAttributes({ cards: newCard });

		setActiveIndex(activeIndex);
	}

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} activeIndex={activeIndex} setActiveIndex={setActiveIndex} updateCard={updateCard} />

		<div className={className} id={`bBlocksCards-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<div className={`bBlocksCards ${layout || 'vertical'} columns-${columns?.desktop} columns-tablet-${columns?.tablet} columns-mobile-${columns?.mobile}`}>
				{cards?.map((item, index) => {
					const { img, cat, title, desc } = item;

					// Components
					const CardTitle = () => isTitle && <RichText className='cardTitle' tagName='h3' value={title} onChange={val => updateCard('title', val)} placeholder={__('Card title', 'b-blocks')} inlineToolbar />

					const CardImage = () => img?.url ? <>
						<figure className='cardImage'>
							<img className={img?.id ? `wp-image-${img.id}` : null} src={img.url} alt={img?.alt || img?.title} />

							{'image' === titlePos && <CardTitle />}
						</figure>
						{isBlobURL(img.url) && <Spinner />}
					</> : <ImagePlaceholder label={__(' Card Image:', 'b-blocks')} value={img} onChange={val => updateCard('img', val)} />;

					return <div key={index} onClick={() => setActiveIndex(index)} className={`${index === activeIndex ? 'bBlocksNowEditing' : ''}`} id={`bBlocksCard-${index}`}>
						<div className={`bBlocksCard ${'bottom' === imgPos ? 'bottomImg' : 'topImg'}`}>
							{'top' === imgPos && <CardImage />}

							<div className='cardDetails'>
								{isCat && <RichText className='cardCategory' tagName='h6' value={cat} onChange={val => updateCard('cat', val)} placeholder={__('Card category', 'b-blocks')} inlineToolbar />}

								{'content' === titlePos && <CardTitle />}

								{isDesc && <RichText className='cardDescription' tagName='p' value={desc} onChange={val => updateCard('desc', val)} placeholder={__('Description of the card', 'b-blocks')} inlineToolbar />}
							</div>

							{'bottom' === imgPos && <CardImage />}
						</div>
					</div>;
				})}
			</div>
		</div>
	</>
};
export default Edit;
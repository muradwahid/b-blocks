import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';
import { produce } from 'immer';

import { ImagePlaceholder } from '../../../../../bpl-tools/Components/Deprecated';

import usePremiumInEditor from '../../../hooks/usePremiumInEditor';
import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { cards = [], columns, layout, imgPos, isCat, isTitle, titlePos, isDesc } = attributes;

	const { isPremium = false } = usePremiumInEditor();

	const [activeIndex, setActiveIndex] = useState(0);

	const updateCard = (type, val) => {
		const newCard = produce(cards, draft => {
			draft[activeIndex][type] = val;
		});
		setAttributes({ cards: newCard });
	}

	const id = `block-${clientId}`;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} activeIndex={activeIndex} setActiveIndex={setActiveIndex} updateCard={updateCard} isPremium={isPremium} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={id} />

			<div className={`${prefix} ${layout || 'vertical'} columns-${columns?.desktop} columns-tablet-${columns?.tablet} columns-mobile-${columns?.mobile}`}>
				{cards?.map((item, index) => {
					const { img, cat, title, desc } = item;

					// Components
					const CardTitle = isTitle && <RichText className={`${prefix}-cardTitle`}tagName='h3' value={title} onChange={val => updateCard('title', val)} placeholder={__('Card title', 'b-blocks')} inlineToolbar />

					const CardImage = img?.url ? <>
						<figure className={`${prefix}-cardImage`}>
							<img className={`${prefix}-wp-image`} src={img.url} alt={img?.alt || img?.title} />

							{'image' === titlePos && CardTitle}
						</figure>
						{isBlobURL(img.url) && <Spinner />}
					</> : <ImagePlaceholder label={__(' Card Image:', 'b-blocks')} value={img} onChange={val => updateCard('img', val)} />;

					return <div key={index} onClick={() => setActiveIndex(index)} className={`${index === activeIndex ? 'bPlNowEditing' : ''}`} id={`${prefix}-card-${index}`}>
						<div className={`${prefix}-card ${'bottom' === imgPos ? 'bottomImg' : 'topImg'}`}>
							{'top' === imgPos && CardImage}

							<div className='cardDetails'>
								{isCat && <RichText className={`${prefix}-cardCategory`} tagName='h6' value={cat} onChange={val => updateCard('cat', val)} placeholder={__('Card category', 'b-blocks')} inlineToolbar />}

								{'content' === titlePos && CardTitle}

								{isDesc && <RichText className={`${prefix}-cardDescription`} tagName='p' value={desc} onChange={val => updateCard('desc', val)} placeholder={__('Description of the card', 'b-blocks')} inlineToolbar />}
							</div>

							{'bottom' === imgPos && CardImage}
						</div>
					</div>;
				})}
			</div>
		</div>
	</>
};
export default Edit;
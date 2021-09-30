import { __ } from '@wordpress/i18n';
import { useState, useEffect, createContext } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';

import Settings from './settings';

// Variables
import { ImagePlaceholder } from '../../Components/ImageControl';

export const IndexContext = createContext();

const Edit = props => {
    const { className, attributes: { cards = [], columns, columnGap, rowGap, layout, textAlign, padding, imgPos, imgHeight, isCat, catTypo, catMargin, isTitle, titlePos, titleTypo, titleMargin, isDesc, descTypo }, setAttributes, clientId } = props;

    // useEffect
    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]);
    const [activeIndex, setActiveIndex] = useState(0);

    const updateCard = (index, type, val) => {
        const newCard = [...cards];
        newCard[index][type] = val;
        setAttributes({ cards: newCard });
        setActiveIndex(index);
    }

    return <>
        <IndexContext.Provider value={setActiveIndex}>
            <Settings settings={props} />
        </IndexContext.Provider>

        <div className={className} id={`bBlocksCards-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${catTypo?.googleFontLink});
                @import url(${titleTypo?.googleFontLink});
                @import url(${descTypo?.googleFontLink});

                #bBlocksCards-${clientId} .bBlocksCards{
                    grid-gap: ${rowGap} ${columnGap};
                }
                #bBlocksCards-${clientId} .bBlocksCards .bBlocksCard .cardImage img{ height: ${imgHeight}; }
                #bBlocksCards-${clientId} .bBlocksCards .bBlocksCard .cardDetails{
                    text-align: ${textAlign};
                    padding: ${padding?.styles || '20px 10px'}; 
                }
                #bBlocksCards-${clientId} .bBlocksCards .bBlocksCard .cardDetails .cardCategory{
                    ${catTypo?.styles || 'font-size: 15px;'}
                    margin: ${catMargin?.styles || '0 0 10px 0'};
                }
                #bBlocksCards-${clientId} .bBlocksCards .bBlocksCard .cardTitle{
                    ${titleTypo?.styles || 'font-size: 22px;'}
                    margin: ${titleMargin?.styles || '0 0 10px 0'};
                }
                #bBlocksCards-${clientId} .bBlocksCards .bBlocksCard .cardDescription{
                    ${descTypo?.styles || 'font-size: 15px;'}
                }
            `}} />

            <div className={`bBlocksCards ${layout || 'vertical'} columns-${columns?.desktop} columns-tablet-${columns?.tablet} columns-mobile-${columns?.mobile}`}>
                {cards?.map((item, index) => {
                    const { background, img, imgBorder, cat, catColor, title, titleColor, desc, descColor } = item;

                    // Components
                    const cardTitle = () => isTitle && <RichText className='cardTitle' tagName='h3' value={title} onChange={val => updateCard(index, 'title', val)} placeholder={__('Card title', 'b-blocks')} inlineToolbar />

                    const cardImage = () => img?.url ? <>
                        <figure className='cardImage'>
                            <img className={img?.id ? `wp-image-${img?.id}` : null} src={img?.url} alt={img?.alt} />

                            {'image' === titlePos && cardTitle()}
                        </figure>
                        {isBlobURL(img?.url) && <Spinner />}
                    </> : <ImagePlaceholder label={__(' Card Image:', 'b-blocks')} img={img} onChange={val => updateCard(index, 'img', val)} />;

                    return <div key={index} onClick={() => setActiveIndex(index)} className={`${index === activeIndex ? 'bBlocksNowEditing' : ''}`} id={`bBlocksCard-${index}`}>
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            #bBlocksCards-${clientId} #bBlocksCard-${index} .bBlocksCard{
                                ${background?.styles || `background-color: #0000;`}
                            }
                            #bBlocksCards-${clientId} #bBlocksCard-${index} .cardImage{
                                ${imgBorder?.styles || 'border-radius: 5px;'}
                            }
                            #bBlocksCards-${clientId} #bBlocksCard-${index} .cardDetails .cardCategory{
                                color: ${catColor};
                            }
                            #bBlocksCards-${clientId} #bBlocksCard-${index} .cardTitle{
                                color: ${titleColor};
                            }
                            #bBlocksCards-${clientId} #bBlocksCard-${index} .cardDescription{
                                color: ${descColor};
                            }
                        `}} />

                        <div className={`bBlocksCard ${'bottom' === imgPos ? 'bottomImg' : 'topImg'}`}>
                            {'top' === imgPos && cardImage()}

                            <div className='cardDetails'>
                                {isCat && <RichText className='cardCategory' tagName='h6' value={cat} onChange={val => updateCard(index, 'cat', val)} placeholder={__('Card category', 'b-blocks')} inlineToolbar />}

                                {'content' === titlePos && cardTitle()}

                                {isDesc && <RichText className='cardDescription' tagName='p' value={desc} onChange={val => updateCard(index, 'desc', val)} placeholder={__('Description of the card', 'b-blocks')} inlineToolbar />}
                            </div>

                            {'bottom' === imgPos && cardImage()}
                        </div>
                    </div>;
                })}
            </div>
        </div>
    </>
};
export default Edit;
import { __ } from '@wordpress/i18n';
import { useState, useEffect, createContext } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';

import Settings from './settings';

// Variables
import { ImagePlaceholder } from '../../../../Components/ImageControl';

export const IndexContext = createContext();

const Edit = props => {
    const { className, attributes: { products = [], columns, columnGap, rowGap, layout, textAlign, padding, imgMargin, nameTypo, nameMargin, isDesc, descTypo, descMargin, priceTypo, isSep }, setAttributes, clientId } = props;

    // useEffect
    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]);
    const [activeIndex, setActiveIndex] = useState(0);

    const updateProduct = (index, type, val) => {
        const newProduct = [...products];
        newProduct[index][type] = val;
        setAttributes({ products: newProduct });
        setActiveIndex(index);
    }

    return <>
        <IndexContext.Provider value={setActiveIndex}>
            <Settings settings={props} />
        </IndexContext.Provider>

        <div className={className} id={`bBlocksPriceLists-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${nameTypo?.googleFontLink});
                @import url(${descTypo?.googleFontLink});
                @import url(${priceTypo?.googleFontLink});

                #bBlocksPriceLists-${clientId} .bBlocksPriceLists{
                    grid-gap: ${rowGap} ${columnGap};
                }
                #bBlocksPriceLists-${clientId} .bBlocksPriceLists .bBlocksPrice{
                    text-align: ${textAlign};
                    padding: ${padding?.styles || '50px 20px'};
                }
                #bBlocksPriceLists-${clientId} .bBlocksPriceLists .bBlocksPrice .productImage{
                    margin: ${imgMargin?.styles || '0 0 20px 0'};
                }
                #bBlocksPriceLists-${clientId} .bBlocksPriceLists .bBlocksPrice .productName{
                    ${nameTypo?.styles || 'font-size: 18px; font-weight: 600;'}
                    margin: ${nameMargin?.styles || '0 0 10px 0'};
                }
                #bBlocksPriceLists-${clientId} .bBlocksPriceLists .bBlocksPrice .productDescription{
                    ${descTypo?.styles || 'font-size: 15px; font-style: italic;'}
                    margin: ${descMargin?.styles || '0 0 15px 0'};
                }
                #bBlocksPriceLists-${clientId} .bBlocksPriceLists .bBlocksPrice .productPrice{
                    ${priceTypo?.styles || 'font-size: 24px; font-style: italic;'}
                }
            `}} />

            <div className={`bBlocksPriceLists ${layout || 'vertical'} columns-${columns?.desktop} columns-tablet-${columns?.tablet} columns-mobile-${columns?.mobile}`}>
                {products?.map((item, index) => {
                    const { background, img, imgBorder, name, nameColor, desc, descColor, price, priceColor, separator } = item;

                    return <div key={index} onClick={() => setActiveIndex(index)} className={`bBlocksPrice ${index === activeIndex ? 'bBlocksNowEditing' : ''}`} id={`bBlocksPrice-${index}`}>
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            #bBlocksPriceLists-${clientId} #bBlocksPrice-${index}{
                                ${background?.styles || `background-color: #0000;`}
                            }
                            #bBlocksPriceLists-${clientId} #bBlocksPrice-${index} .productImage{
                                ${imgBorder?.styles || ''}
                            }
                            #bBlocksPriceLists-${clientId} #bBlocksPrice-${index} .productName{
                                color: ${nameColor};
                            }
                            #bBlocksPriceLists-${clientId} #bBlocksPrice-${index} .productDescription{
                                color: ${descColor};
                            }
                            #bBlocksPriceLists-${clientId} #bBlocksPrice-${index} .productPrice{
                                color: ${priceColor};
                            }
                            #bBlocksPriceLists-${clientId} #bBlocksPrice-${index} .productSeparator{
                                ${separator?.styles || 'width: 40%; border-top: 1px solid #bbb;'}
                            }
                        `}} />

                        {img?.url ? <>
                            <img className={`productImage ${img?.id ? `wp-image-${img?.id}` : null}`} src={img?.url} alt={img?.alt} />
                            {isBlobURL(img?.url) && <Spinner />}
                        </> : <ImagePlaceholder label={__(' Product Image:', 'b-blocks')} img={img} onChange={val => updateProduct(index, 'img', val)} />}

                        <div className='productDetails'>
                            <RichText className='productName' tagName='h4' value={name} onChange={val => updateProduct(index, 'name', val)} placeholder={__('Product name', 'b-blocks')} inlineToolbar />

                            {isDesc && <RichText className='productDescription' tagName='p' value={desc} onChange={val => updateProduct(index, 'desc', val)} placeholder={__('Description of the product', 'b-blocks')} inlineToolbar />}

                            <RichText className='productPrice' tagName='span' value={price} onChange={val => updateProduct(index, 'price', val)} placeholder={__('$99.99', 'b-blocks')} inlineToolbar />
                        </div>

                        {isSep && <span className='productSeparator'></span>}
                    </div>;
                })}
            </div>
        </div>
    </>
};
export default Edit;
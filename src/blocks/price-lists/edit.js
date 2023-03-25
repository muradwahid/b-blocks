import { __ } from '@wordpress/i18n';
import { useState, useEffect, createContext } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';

// Settings Components
import { ImagePlaceholder } from '../../../../Components/ImageControl';
import { getBackgroundCSS, getSeparatorCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/Helper/getCSS';

import Settings from './settings';

export const IndexContext = createContext();

const Edit = props => {
	const { className, attributes: { products = [], columns, columnGap, rowGap, layout, textAlign, padding, imgMargin, nameTypo, nameMargin, isDesc, descTypo, descMargin, priceTypo, isSep }, setAttributes, clientId } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const [activeIndex, setActiveIndex] = useState(0);

	const updateProduct = (index, type, val) => {
		const newProduct = [...products];
		newProduct[index][type] = val;
		setAttributes({ products: newProduct });
		setActiveIndex(index);
	}

	const mainSl = `#bBlocksPriceLists-${clientId}`;
	const priceListsSl = `${mainSl} .bBlocksPriceLists`;
	const gPriceSl = `${priceListsSl} .bBlocksPrice`;

	return <>
		<IndexContext.Provider value={setActiveIndex}>
			<Settings settings={props} />
		</IndexContext.Provider>

		<div className={className} id={`bBlocksPriceLists-${clientId}`}>
			<style dangerouslySetInnerHTML={{
				__html: `
				${getTypoCSS(`${gPriceSl} .productName`, nameTypo)}
				${getTypoCSS(`${gPriceSl} .productDescription`, descTypo)}
				${getTypoCSS(`${gPriceSl} .productPrice`, priceTypo)}

				${priceListsSl}{
					grid-gap: ${rowGap} ${columnGap};
				}
				${gPriceSl}{
					text-align: ${textAlign};
					padding: ${getSpaceCSS(padding)};
				}
				${gPriceSl} .productImage{
					margin: ${getSpaceCSS(imgMargin)};
				}
				${gPriceSl} .productName{
					margin: ${getSpaceCSS(nameMargin)};
				}
				${gPriceSl} .productDescription{
					margin: ${getSpaceCSS(descMargin)};
				}
			`}} />

			<div className={`bBlocksPriceLists ${layout || 'vertical'} columns-${columns?.desktop} columns-tablet-${columns?.tablet} columns-mobile-${columns?.mobile}`}>
				{products?.map((item, index) => {
					const { background, img, imgBorder, name, nameColor, desc, descColor, price, priceColor, separator } = item;

					const priceSl = `${mainSl} #bBlocksPrice-${index}`;

					return <div key={index} onClick={() => setActiveIndex(index)} className={`bBlocksPrice ${index === activeIndex ? 'bBlocksNowEditing' : ''}`} id={`bBlocksPrice-${index}`}>
						<style dangerouslySetInnerHTML={{
							__html: `
							${priceSl}{
								${getBackgroundCSS(background)}
							}
							${priceSl} .productImage{
								${getSpaceCSS(imgBorder)}
							}
							${priceSl} .productName{
								color: ${nameColor};
							}
							${priceSl} .productDescription{
								color: ${descColor};
							}
							${priceSl} .productPrice{
								color: ${priceColor};
							}
							${priceSl} .productSeparator{
								${getSeparatorCSS(separator)}
							}
						`}} />

						{img?.url ? <>
							<img className={`productImage ${img?.id ? `wp-image-${img?.id}` : null}`} src={img?.url} alt={img?.alt} />
							{isBlobURL(img?.url) && <Spinner />}
						</> : <ImagePlaceholder label={__(' Product Image:', 'b-blocks')} value={img} onChange={val => updateProduct(index, 'img', val)} />}

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
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';
import { produce } from 'immer';

import { ImagePlaceholder } from '../../../../../bpl-tools/Components/Deprecated';
import { getBackgroundCSS, getSeparatorCSS, getSpaceCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';

import Settings from './Settings/Settings';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { products = [], columns, columnGap, rowGap, layout, textAlign, padding, imgMargin, nameTypo, nameMargin, isDesc, descTypo, descMargin, priceTypo, isSep } = attributes;

	const [activeIndex, setActiveIndex] = useState(0);

	const updateProduct = (type, val) => {
		const newProducts = produce(products, draft => {
			draft[activeIndex][type] = val;
		});
		setAttributes({ products: newProducts });
	}

	const id = `${prefix}-${clientId}`;

	const mainSl = `#${id}`;
	const priceListsSl = `${mainSl} .${prefix}`;
	const gPriceSl = `${priceListsSl} .priceItem`;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} updateProduct={updateProduct} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

		<div {...useBlockProps()} id={id}>
			<style dangerouslySetInnerHTML={{
				__html: `
				${getTypoCSS('', nameTypo)?.googleFontLink}
				${getTypoCSS('', descTypo)?.googleFontLink}
				${getTypoCSS('', priceTypo)?.googleFontLink}
				${getTypoCSS(`${gPriceSl} .productName`, nameTypo)?.styles}
				${getTypoCSS(`${gPriceSl} .productDescription`, descTypo)?.styles}
				${getTypoCSS(`${gPriceSl} .productPrice`, priceTypo)?.styles}

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

			<div className={`${prefix} ${layout || 'vertical'} columns-${columns?.desktop} columns-tablet-${columns?.tablet} columns-mobile-${columns?.mobile}`}>
				{products?.map((item, index) => {
					const { background, img, imgBorder, name, nameColor, desc, descColor, price, priceColor, separator } = item;

					const priceSl = `${mainSl} #priceItem-${index}`;

					return <div key={index} onClick={() => setActiveIndex(index)} className={`priceItem ${index === activeIndex ? 'bBlocksNowEditing' : ''}`} id={`priceItem-${index}`}>
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
						</> : <ImagePlaceholder label={__(' Product Image:', 'b-blocks')} value={img} onChange={val => updateProduct('img', val)} />}

						<div className='productDetails'>
							<RichText className='productName' tagName='h4' value={name} onChange={val => updateProduct('name', val)} placeholder={__('Product name', 'b-blocks')} inlineToolbar />

							{isDesc && <RichText className='productDescription' tagName='p' value={desc} onChange={val => updateProduct('desc', val)} placeholder={__('Description of the product', 'b-blocks')} inlineToolbar />}

							<RichText className='productPrice' tagName='span' value={price} onChange={val => updateProduct('price', val)} placeholder={__('$99.99', 'b-blocks')} inlineToolbar />
						</div>

						{isSep && <span className='productSeparator'></span>}
					</div>;
				})}
			</div>
		</div>
	</>
};
export default Edit;
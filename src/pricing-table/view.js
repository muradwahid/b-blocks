import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import PriceFeatures from './Components/Common/PriceFeatures';
import { prefix } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const pricingTableEls = document.querySelectorAll('.wp-block-b-blocks-pricing-table');
	pricingTableEls.forEach(pricingTableEl => {
		const attributes = JSON.parse(pricingTableEl.dataset.attributes);

		const isBasic = pricingTableEl.className.includes('basic');
		const isStandard = pricingTableEl.className.includes('standard');
		const isUltimate = pricingTableEl.className.includes('ultimate');

		createRoot(pricingTableEl).render(<>
			<Style attributes={attributes} id={pricingTableEl.id} isStandard={isStandard} />

			<PricingTable attributes={attributes} id={pricingTableEl.id} isBasic={isBasic} isStandard={isStandard} isUltimate={isUltimate} />
		</>);

		pricingTableEl?.removeAttribute('data-attributes');
	});
});

const PricingTable = ({ attributes, id, isBasic, isStandard, isUltimate }) => {
	const { pricingTables, columns } = attributes;

	useEffect(() => {
		const priceFeaturesAll = document.querySelectorAll(`#${id} .priceItem .priceFeatures`);
		const priceFeaturesHeight = [];

		priceFeaturesAll?.forEach(priceFeatures => {
			priceFeaturesHeight.push(priceFeatures?.clientHeight);
		});

		priceFeaturesAll?.forEach(priceFeatures => {
			priceFeatures.style.height = Math.max(...priceFeaturesHeight) + 'px';
		});
	}, [pricingTables]);

	// Single Price Table
	const PriceTable = ({ priceTable, index }) => {
		const { name, price, priceCurrency, period, link, linkLabel, features } = priceTable;

		const priceTableEl = useRef(null);
		const priceAmountWrapEl = useRef(null);

		useEffect(() => {
			if (isUltimate) {
				const widthOfPriceWrap = priceTableEl?.current?.clientHeight / 100 * 82;

				priceAmountWrapEl.current.style.width = `${widthOfPriceWrap}px`;
				priceAmountWrapEl.current.style.top = `${widthOfPriceWrap / 2}px`;
				priceAmountWrapEl.current.style.left = `${-widthOfPriceWrap / 2 + 60}px`;
			}
		}, []);

		const priceAmountEl = <span className='priceAmount'>{priceCurrency}{price}</span>;
		const pricePeriodEl = <span className='pricePeriod' dangerouslySetInnerHTML={{ __html: period }} />;

		return <div key={index} id={`priceItem-${index}`}>
			<div className='priceItem' ref={priceTableEl}>
				<h3 className='priceName' dangerouslySetInnerHTML={{ __html: name }} />

				{isStandard || isUltimate ? <div className='priceAmountWrap' ref={priceAmountWrapEl}>{priceAmountEl} / {pricePeriodEl}</div> : ''}

				<PriceFeatures features={features} />

				{!isStandard && !isUltimate ? <div className='priceAmountWrap'>{priceAmountEl}</div> : ''}
				{!isBasic && <br />}

				<a className='priceLink' href={link} dangerouslySetInnerHTML={{ __html: linkLabel }} />
			</div>
		</div>;
	}

	return <div className={`${prefix} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
		{pricingTables?.map((priceTable, index) => <PriceTable key={index} priceTable={priceTable} index={index} />)}
	</div>
}
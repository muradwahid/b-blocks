import { render, useEffect, useRef } from '@wordpress/element';

import './style.scss';
import Style from './Style';
import featureState from './icons/state.svg';

// Pricing Tables
document.addEventListener('DOMContentLoaded', () => {
	const allPricingTables = document.querySelectorAll('.wp-block-b-blocks-pricing-table');
	allPricingTables.forEach(priceTable => {
		const attributes = JSON.parse(priceTable.dataset.attributes);

		const isBasic = priceTable.className.includes('basic');
		const isStandard = priceTable.className.includes('standard');
		const isUltimate = priceTable.className.includes('ultimate');

		render(<>
			<Style attributes={attributes} clientId={attributes.cId} isStandard={isStandard} />

			<PricingTable attributes={attributes} clientId={attributes.cId} isBasic={isBasic} isStandard={isStandard} isUltimate={isUltimate} />
		</>, priceTable);

		priceTable?.removeAttribute('data-attributes');
	});
});

const PricingTable = ({ attributes, clientId, isBasic, isStandard, isUltimate }) => {
	const { pricingTables, columns } = attributes;

	useEffect(() => {
		const priceFeaturesAll = document.querySelectorAll(`#bptbPricingTables-${clientId} .bptbPricingTables .bptbPriceTable .priceFeatures`);
		const priceFeaturesHeight = [];

		priceFeaturesAll?.forEach(priceFeatures => {
			priceFeaturesHeight.push(priceFeatures?.clientHeight);
		});

		priceFeaturesAll?.forEach(priceFeatures => {
			priceFeatures.style.height = Math.max(...priceFeaturesHeight) + 'px';
		});
	}, [pricingTables]);

	return <div className={`bBlocksPricingTables columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
		{pricingTables?.map((priceTable, index) => {
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
			const pricePeriodEl = <span className='pricePeriod'>{period}</span>;

			return <div key={index} id={`bBlocksPriceTable-${index}`}>
				<div className='bBlocksPriceTable' ref={priceTableEl}>
					<h3 className='priceName'>{name}</h3>

					{isStandard || isUltimate ? <div className='priceAmountWrap' ref={priceAmountWrapEl}>{priceAmountEl} / {pricePeriodEl}</div> : ''}

					<div className='priceFeatures'>
						{features?.map((feature, featureIndex) => {
							const { isEnable, label } = feature;

							return <div key={featureIndex} className='priceFeature'>
								{isEnable ? <svg className='priceFeatureEnabled'>
									<use xlinkHref={`${featureState}#enabled`}></use>
								</svg> : <svg className='priceFeatureDisabled'>
									<use xlinkHref={`${featureState}#disabled`}></use>
								</svg>}

								<span className='priceFeatureLabel'>{label}</span>
							</div>;
						})}
					</div>

					{!isStandard && !isUltimate ? <div className='priceAmountWrap'>{priceAmountEl}</div> : ''}
					{!isBasic && <br />}

					<a className='priceLink' href={link}>{linkLabel}</a>
				</div>
			</div>;
		})}
	</div>
}
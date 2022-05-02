import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import { CheckboxControl, Button, Tooltip, Dashicon } from '@wordpress/components';

import Settings from './Settings';
import Style from './Style';

const Edit = props => {
	const { className, attributes, setAttributes, clientId } = props;
	const { pricingTables, columns } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const [activeIndex, setActiveIndex] = useState(0);

	const updatePriceTable = (type, val, otherIndex = false, otherType = false) => {
		const newPricingTable = [...pricingTables];

		if (false !== otherIndex && otherType) {
			newPricingTable[activeIndex][type][otherIndex][otherType] = val;
			setAttributes({ pricingTables: newPricingTable });
		} else {
			newPricingTable[activeIndex][type] = val;
			setAttributes({ pricingTables: newPricingTable });
		}
		setActiveIndex(activeIndex);
	}

	useEffect(() => {
		const priceFeaturesAll = document.querySelectorAll(`#bBlocksPricingTables-${clientId} .bBlocksPricingTables .bBlocksPriceTable .priceFeatures`);
		const priceFeaturesHeight = [];

		priceFeaturesAll?.forEach(priceFeatures => {
			priceFeaturesHeight.push(priceFeatures?.clientHeight);
		});

		priceFeaturesAll?.forEach(priceFeatures => {
			priceFeatures.style.height = Math.max(...priceFeaturesHeight) + 'px';
		});
	}, [pricingTables]);

	const isBasic = className.includes('basic');
	const isStandard = className.includes('standard');
	const isUltimate = className.includes('ultimate');

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} updatePriceTable={updatePriceTable} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

		<div className={`${className} ${!isStandard && !isUltimate ? 'is-style-basic' : ''}`} id={`bBlocksPricingTables-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} isStandard={isStandard} />

			<div className={`bBlocksPricingTables columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				{pricingTables?.map((priceTable, index) => {
					const { name, price, priceCurrency, period, link, linkLabel, features } = priceTable;

					const bBlocksPriceTable = useRef(null);
					const bBlocksPriceAmountWrap = useRef(null);

					useEffect(() => {
						if (isUltimate) {
							const widthOfPriceWrap = bBlocksPriceTable?.current?.clientHeight / 100 * 82;

							bBlocksPriceAmountWrap.current.style.width = `${widthOfPriceWrap}px`;
							bBlocksPriceAmountWrap.current.style.top = `${widthOfPriceWrap / 2}px`;
							bBlocksPriceAmountWrap.current.style.left = `${-widthOfPriceWrap / 2 + 60}px`;
						}
					}, [className, bBlocksPriceTable, bBlocksPriceAmountWrap]);

					const priceAmountEl = <span className='priceAmount'>{priceCurrency}{price}</span>;
					const pricePeriodEl = <RichText className='pricePeriod' tagName='span' value={period} onChange={val => updatePriceTable(index, 'period', val)} placeholder={__('Period', 'b-blocks')} inlineToolbar />;

					return <div key={index} onClick={() => setActiveIndex(index)} className={`${index === activeIndex ? 'bBlocksNowEditing' : ''}`} id={`bBlocksPriceTable-${index}`}>
						<div className='bBlocksPriceTable' ref={bBlocksPriceTable}>
							<RichText className='priceName' tagName='h3' value={name} onChange={val => updatePriceTable(index, 'name', val)} placeholder={__('Plan Name', 'b-blocks')} inlineToolbar />

							{isStandard || isUltimate ? <div className='priceAmountWrap' ref={bBlocksPriceAmountWrap}>{priceAmountEl} / {pricePeriodEl}</div> : ''}

							<div className='priceFeatures'>
								{features?.map((feature, featureIndex) => {
									const { isEnable, label } = feature;

									return <div key={featureIndex} className='priceFeature'>
										<Tooltip text={__('Remove the feature', 'b-blocks')} position='top'>
											<a className='removePriceFeature' onClick={e => {
												e.preventDefault();
												updatePriceTable(index, 'features', [...features.slice(0, featureIndex), ...features.slice(featureIndex + 1)]);
											}}><Dashicon icon='no' size={18} /></a>
										</Tooltip>

										<CheckboxControl className='priceFeatureIsEnable' checked={isEnable} onChange={val => updatePriceTable(index, 'features', val, featureIndex, 'isEnable')} />

										<RichText className='priceFeatureLabel' tagName='span' value={label} onChange={val => updatePriceTable(index, 'features', val, featureIndex, 'label')} placeholder={__('Price Feature Label', 'b-blocks')} inlineToolbar />
									</div>;
								})}

								<Button className='addPriceFeature' label={__('Add New Feature', 'b-blocks')} onClick={() => {
									updatePriceTable(index, 'features', [...features, {
										isEnable: '#', label: 'New Feature of Price'
									}]);
								}}><Dashicon icon='plus' size={23} />{__('Add New Feature', 'b-blocks')}</Button>
							</div>

							{!isStandard && !isUltimate ? <div className='priceAmountWrap'>{priceAmountEl}</div> : ''}
							{!isBasic && <br />}

							<RichText className='priceLink' tagName='a' value={linkLabel} href={link} onChange={val => updatePriceTable(index, 'linkLabel', val)} placeholder={__('Link Label', 'b-blocks')} inlineToolbar />
						</div>
					</div>;
				})}
			</div>
		</div>
	</>;
};
export default Edit;
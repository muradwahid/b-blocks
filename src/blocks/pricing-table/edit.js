import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import { CheckboxControl, Button, Tooltip, Dashicon } from '@wordpress/components';

import Settings from './settings';

const Edit = props => {
	const { className, attributes: { pricingTables, columns, columnGap, rowGap, textAlign, padding, shadow }, setAttributes, clientId } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const [activeIndex, setActiveIndex] = useState(0);

	const updatePriceTable = (index, type, val, otherIndex = false, otherType = false) => {
		const newPricingTable = [...pricingTables];

		if (false !== otherIndex && otherType) {
			newPricingTable[index][type][otherIndex][otherType] = val;
			setAttributes({ pricingTables: newPricingTable });
		} else {
			newPricingTable[index][type] = val;
			setAttributes({ pricingTables: newPricingTable });
		}
		setActiveIndex(index);
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
		<Settings attributes={props.attributes} setAttributes={setAttributes} clientId={clientId} updatePriceTable={updatePriceTable} setActiveIndex={setActiveIndex} />

		<div className={className} id={`bBlocksPricingTables-${clientId}`}>
			<style dangerouslySetInnerHTML={{
				__html: `
				#bBlocksPricingTables-${clientId} .bBlocksPricingTables{
					grid-gap: ${rowGap} ${columnGap};
					text-align: ${textAlign};
					padding: ${isStandard ? '30px 0' : '0'}
				}
				#bBlocksPricingTables-${clientId} .bBlocksPricingTables .bBlocksPriceTable{
					padding: ${padding?.styles || '35px 25px'};
					box-shadow: ${shadow?.styles || '0px 0px 30px 0px #6e8faf4d'};
				}
			`}} />
			<style>
				{pricingTables?.map((priceTable, index) => {
					const defPriceTableSelect = `#bBlocksPricingTables-${clientId} .bBlocksPricingTables #bBlocksPriceTable-${index} .bBlocksPriceTable`;
					const priceTableSelect = hasClass => `#bBlocksPricingTables-${clientId}.is-style-${hasClass} .bBlocksPricingTables #bBlocksPriceTable-${index} .bBlocksPriceTable`;

					return `
					${defPriceTableSelect} .priceName,
					${priceTableSelect('basic')} .priceAmountWrap,
					${priceTableSelect('standard')} .priceAmountWrap{
						color: ${priceTable.color};
					}
					${defPriceTableSelect} .priceLink,
					${priceTableSelect('basic')} .priceName,
					${priceTableSelect('standard')}::before,
					${priceTableSelect('ultimate')} .priceAmountWrap{
						color: #fff;
						background-color: ${priceTable.color};
					}
					${priceTableSelect('basic')} .priceName::before{
						border-top-color: ${priceTable.color};
					}
				`.replace(/\s+/g, ' ')
				})}
			</style>

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

					return <div key={index} onClick={() => setActiveIndex(index)} className={`${index === activeIndex ? 'nowEditing' : ''}`} id={`bBlocksPriceTable-${index}`}>
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

							{isBasic && <div className='priceAmountWrap'>{priceAmountEl}</div>}
							{!isBasic && <br />}

							<RichText className='priceLink' tagName='a' value={linkLabel} href={link} onChange={val => updatePriceTable(index, 'linkLabel', val)} placeholder={__('Link Label', 'b-blocks')} inlineToolbar />
						</div>
					</div>;
				})}
			</div>
		</div >
	</>;
};
export default Edit;
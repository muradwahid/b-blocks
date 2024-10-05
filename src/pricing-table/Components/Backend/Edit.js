import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from 'react';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { produce } from 'immer';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import PriceFeatures from '../Common/PriceFeatures';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { pricingTables, columns } = attributes;
	const { className } = useBlockProps();

	const [activeIndex, setActiveIndex] = useState(0);

	const id = `${prefix}-${clientId}`;

	const updatePriceTable = (type, val, otherIndex = false, otherType = false) => {
		const newPricingTable = produce(pricingTables, draft => {
			if (false !== otherIndex && otherType) {
				draft[activeIndex][type][otherIndex][otherType] = val;
			} else {
				draft[activeIndex][type] = val;
			}
		});
		setAttributes({ pricingTables: newPricingTable });
	}

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

	const isBasic = className.includes('basic');
	const isStandard = className.includes('standard');
	const isUltimate = className.includes('ultimate');

	// Single Price Table
	const PriceTable = ({ priceTable, index }) => {
		const { name, price, priceCurrency, period, link, linkLabel, features } = priceTable;

		const priceItem = useRef(null);
		const priceAmountWrap = useRef(null);

		useEffect(() => {
			if (isUltimate) {
				const widthOfPriceWrap = priceItem?.current?.clientHeight / 100 * 82;

				priceAmountWrap.current.style.width = `${widthOfPriceWrap}px`;
				priceAmountWrap.current.style.top = `${widthOfPriceWrap / 2}px`;
				priceAmountWrap.current.style.left = `${-widthOfPriceWrap / 2 + 60}px`;
			}
		}, [className, priceItem, priceAmountWrap]);

		const priceAmountEl = <span className='priceAmount'>{priceCurrency}{price}</span>;
		const pricePeriodEl = <RichText className='pricePeriod' tagName='span' value={period} onChange={val => updatePriceTable('period', val)} placeholder={__('Period', 'b-blocks')} inlineToolbar />;

		return <div key={index} onClick={() => setActiveIndex(index)} className={`${index === activeIndex ? 'bBlocksNowEditing' : ''}`} id={`priceItem-${index}`}>
			<div className='priceItem' ref={priceItem}>
				<RichText className='priceName' tagName='h3' value={name} onChange={val => updatePriceTable('name', val)} placeholder={__('Plan Name', 'b-blocks')} inlineToolbar />

				{isStandard || isUltimate ? <div className='priceAmountWrap' ref={priceAmountWrap}>{priceAmountEl} / {pricePeriodEl}</div> : ''}

				<PriceFeatures features={features} />

				{!isStandard && !isUltimate ? <div className='priceAmountWrap'>{priceAmountEl}</div> : ''}
				{!isBasic && <br />}

				<RichText className='priceLink' tagName='a' value={linkLabel} href={link} onChange={val => updatePriceTable('linkLabel', val)} placeholder={__('Link Label', 'b-blocks')} inlineToolbar />
			</div>
		</div>;
	}

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} updatePriceTable={updatePriceTable} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

		<div {...useBlockProps()} className={`${className} ${!isStandard && !isUltimate ? 'is-style-basic' : ''}`} id={id}>
			<Style attributes={attributes} id={id} isStandard={isStandard} />

			<div className={`${prefix} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				{pricingTables?.map((priceTable, index) => <PriceTable key={index} priceTable={priceTable} index={index} />)}
			</div>
		</div>
	</>;
};
export default Edit;
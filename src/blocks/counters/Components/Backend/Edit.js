import { useState, useEffect } from 'react';
import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { produce } from 'immer';

import { tabController } from '../../../../../../Components/utils/functions';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { performCounter } from '../../utils/functions';
import Counter from '../Common/Counter';

const Edit = props => {
	const { className, attributes, setAttributes, clientId, isSelected } = props;
	const { counters = [], columns, duration, separator = {}, isLabel } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	useEffect(() => tabController(), [isSelected]);

	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		const counterEl = document.querySelectorAll(`.bBlocksCounters .counterNumber .number`);

		performCounter(counterEl, duration, separator);
	}, [counters, duration, separator]);

	const updateCounter = (type, val, otherType = false) => {
		const newCounters = produce(counters, draft => {
			if (otherType) {
				draft[activeIndex][type][otherType] = val;
			} else {
				draft[activeIndex][type] = val;
			}
		});
		setAttributes({ counters: newCounters });
	}

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} activeIndex={activeIndex} setActiveIndex={setActiveIndex} updateCounter={updateCounter} />

		<div className={className} id={`bBlocksCounters-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<div className={`bBlocksCounters columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				{counters?.map((counter, index) => {
					const { text } = counter.label;

					const labelEl = isLabel && <RichText className='counterLabel' tagName='p' value={text} onChange={val => updateCounter('label', val, 'text')} placeholder={__('Label', 'counters-block')} inlineToolbar />

					return <Counter key={index} attributes={attributes} counter={counter} index={index} labelEl={labelEl} isBackend={true} custom={{ activeIndex, setActiveIndex }} />;
				})}
			</div>
		</div>
	</>;
};
export default Edit;
import { useState, useEffect } from 'react';
import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { produce } from 'immer';

import Settings from './Settings';
import Style from './Style';
import { performCounter } from './utils/functions';

const Edit = props => {
	const { className, attributes, setAttributes, clientId } = props;
	const { counters = [], columns, duration, isIcon, iconPosition, isLabel } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		const counterEl = document.querySelectorAll(`.bBlocksCounters .counterNumber .number`);

		performCounter(counterEl, duration);
	}, [counters, duration]);

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
				{counters?.map((item, index) => {
					const { icon, number, label } = item;

					const iconEl = icon?.class && <i className={icon.class}></i>;
					const labelEl = isLabel && <RichText className='counterLabel' tagName='p' value={label.text} onChange={val => updateCounter('label', val, 'text')} placeholder={__('Label', 'counters-block')} inlineToolbar />

					return <div key={index} onClick={() => setActiveIndex(index)} className={`${index === activeIndex ? 'bBlocksNowEditing' : ''}`} id={`bBlocksCounter-${index}`}>
						<div className='bBlocksCounter'>
							{isIcon && 'top' === iconPosition && <div className='counterIcon'>{iconEl}</div>}

							<div className='counterNumber'>
								<span className='prefix'>{number.prefix}</span>
								<span className='number' data-count-start={number.start} data-count-end={number.end}>{number.start}</span>
								<span className='suffix'>{number.suffix}</span>
							</div>

							{'label' === iconPosition ? <div className='counterIconLabel'>{iconEl}{labelEl}</div> : labelEl}
						</div>
					</div>;
				})}
			</div>
		</div>
	</>;
};
export default Edit;
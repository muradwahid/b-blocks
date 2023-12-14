import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Style';
import { performCounter } from './utils/functions';

document.addEventListener('DOMContentLoaded', () => {
	const allCounters = document.querySelectorAll('.wp-block-b-blocks-counters');
	allCounters.forEach(counters => {
		const attributes = JSON.parse(counters.dataset.attributes);

		createRoot(counters).render(<Counters attributes={attributes} countersEl={counters} />);

		counters?.removeAttribute('data-attributes');
	});
});

const Counters = ({ attributes, countersEl }) => {
	const { cId, counters = [], columns, isIcon, iconPosition, isLabel } = attributes;

	useEffect(() => {
		const counterEl = document.querySelectorAll(`#${countersEl.id} .bBlocksCounters .counterNumber .number`);

		performCounter(counterEl, attributes.duration);
	}, []);

	return <>
		<Style attributes={attributes} clientId={cId} />

		<div className={`bBlocksCounters columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
			{counters?.map((item, index) => {
				const { icon, number, label } = item;

				const iconEl = icon?.class && <i className={icon.class}></i>;
				const labelEl = isLabel && label.text && <p className='counterLabel' dangerouslySetInnerHTML={{ __html: label.text }} />

				return <div key={index} id={`bBlocksCounter-${index}`}>
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
	</>;
}
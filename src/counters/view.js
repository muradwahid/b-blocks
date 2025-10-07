import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { sanitizeHTML } from '../../../bpl-tools/utils/common';

import './style.scss';
import Style from './Components/Common/Style';
import Counter from './Components/Common/Counter';
import { performCounter } from './utils/functions';
import { prefix } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const countersEls = document.querySelectorAll('.wp-block-b-blocks-counters');
	countersEls.forEach(countersEl => {
		const attributes = JSON.parse(countersEl.dataset.attributes);

		createRoot(countersEl).render(<Counters attributes={attributes} countersEl={countersEl} />);

		countersEl?.removeAttribute('data-attributes');
	});
});

const Counters = ({ attributes, countersEl }) => {
	const { counters = [], columns, duration, separator = {}, isLabel } = attributes;

	useEffect(() => {
		const counterEl = document.querySelectorAll(`#${countersEl.id} .${prefix} .counterNumber .number`);

		const intersectionObserver = new IntersectionObserver((entries) => {
			if (entries[0].intersectionRatio <= 0) return;

			performCounter(counterEl, duration, separator);
			intersectionObserver.unobserve(entries[0].target); // Remove if use multiple
		});
		intersectionObserver.observe(document.querySelector(`#${countersEl.id} .${prefix} .counterNumber .number`));
	}, []);

	return <>
		<Style attributes={attributes} id={countersEl.id} />

		<div className={`${prefix} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
			{counters?.map((counter, index) => {
				const { text } = counter.label;

				const labelEl = isLabel && text && <p className='counterLabel' dangerouslySetInnerHTML={{ __html: sanitizeHTML(text) }} />

				return <Counter key={index} attributes={attributes} counter={counter} index={index} labelEl={labelEl} />;
			})}
		</div>
	</>;
}
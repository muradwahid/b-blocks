import { useState, useEffect } from '@wordpress/element';

import Settings from './Settings';
import Style from './Style';
import Counters from './Counters';
import { performCounter } from './utils/functions';

const Edit = props => {
	const { className, attributes, setAttributes, clientId } = props;
	const { counters = [], duration } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		const counterEl = document.querySelectorAll(`.bBlocksCounters .counterNumber .number`);

		performCounter(counterEl, duration);
	}, [counters, duration]);

	const updateCounter = (type, val, otherType = false) => {
		const newCounters = [...counters];

		if (otherType) {
			newCounters[activeIndex][type][otherType] = val;
			setAttributes({ counters: newCounters });
		} else {
			newCounters[activeIndex][type] = val;
			setAttributes({ counters: newCounters });
		}
		setActiveIndex(activeIndex);
	}

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} activeIndex={activeIndex} setActiveIndex={setActiveIndex} updateCounter={updateCounter} />

		<div className={className} id={`bBlocksCounters-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<Counters attributes={attributes} isBackend={true} custom={{ activeIndex, setActiveIndex, updateCounter }} />
		</div>
	</>;
};
export default Edit;
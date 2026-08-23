import { useState, useEffect, useRef } from 'react';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { produce } from 'immer';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import Counter from '../Common/Counter';
import { performCounter } from '../../utils/functions';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { counters = [], columns, duration, separator = {}, isLabel } = attributes;

	const editorRef = useRef();

	const [activeIndex, setActiveIndex] = useState(0);

	const isPremium = bBlocksPremiumChecker;

	useEffect(() => {
		if (!editorRef.current) return;
		const doc = editorRef.current.ownerDocument;
		const counterEl = doc.querySelectorAll(`.${prefix} .counterNumber .number`);
		performCounter(counterEl, duration, separator);
	}, [counters, duration, separator, editorRef]);

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
		<Settings attributes={attributes} setAttributes={setAttributes} activeIndex={activeIndex} setActiveIndex={setActiveIndex} isPremium={isPremium} />

		<div {...useBlockProps({ ref: editorRef })}>
			<Style attributes={attributes} id={`block-${clientId}`} />

			<div className={`${prefix} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				{counters?.map((counter, index) => {
					const { text } = counter.label;

					const labelEl = isLabel && <RichText className='counterLabel' tagName='p' value={text} onChange={val => updateCounter('label', val, 'text')} placeholder={__('Label', 'b-blocks')} inlineToolbar />

					return <Counter key={index} attributes={attributes} counter={counter} index={index} labelEl={labelEl} isBackend={true} custom={{ activeIndex, setActiveIndex }} />;
				})}
			</div>
		</div>
	</>;
};
export default Edit;
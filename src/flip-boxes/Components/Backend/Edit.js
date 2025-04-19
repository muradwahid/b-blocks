import { useState } from 'react';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import FlipBoxes from '../Common/FlipBoxes';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;

	const [activeIndex, setActiveIndex] = useState(0);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />

			<FlipBoxes attributes={attributes} isBackend={true} custom={{ activeIndex, setActiveIndex }} />
		</div>
	</>
};
export default Edit;
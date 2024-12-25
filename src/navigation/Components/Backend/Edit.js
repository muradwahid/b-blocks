import { useState } from 'react';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import style from '../Common/Style';
import Navigation from './Navigation';

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;

	const [activeIndex, setActiveIndex] = useState(0);

	const isPremium = false;

	return <>
		<Settings {...{ attributes, setAttributes, isPremium, activeIndex, setActiveIndex, clientId }} />

		<div {...useBlockProps()}>
			<style>{style(attributes, `block-${clientId}`)}</style>

			<Navigation {...props} />
		</div>
	</>
};
export default Edit;
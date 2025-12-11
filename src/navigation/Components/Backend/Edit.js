import { useState } from 'react';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import style from '../Common/style';
import Navigation from './Navigation';

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;

	const [activeIndex, setActiveIndex] = useState(0);

	const isPremium = bBlocksPremiumChecker;

	return <>
		<Settings {...{ attributes, setAttributes, isPremium, activeIndex, setActiveIndex, clientId }} />

		<div {...useBlockProps()}>
			<style>{style(attributes, `block-${clientId}`, true)}</style>

			<div>
				<Navigation {...props} />
			</div>
		</div>
	</>
};
export default Edit;
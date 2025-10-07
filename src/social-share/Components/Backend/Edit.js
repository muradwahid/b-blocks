import { useState, useEffect } from 'react';
import { useBlockProps } from '@wordpress/block-editor';

import { tabController } from '../../../../../bpl-tools/utils/functions';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import SocialShare from '../Common/SocialShare';

const Edit = props => {
	const { attributes, setAttributes, clientId, isSelected } = props;

	useEffect(() => tabController(), [isSelected]);

	const [activeIndex, setActiveIndex] = useState(0);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />

			<SocialShare attributes={attributes} isBackend={true} custom={{ activeIndex, setActiveIndex }} />
		</div>
	</>;
};
export default Edit;
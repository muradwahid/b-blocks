import { useState, useEffect } from 'react';
import { useBlockProps } from '@wordpress/block-editor';

import { tabController } from '../../../../../Components/utils/functions';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import SocialShare from '../Common/SocialShare';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId, isSelected } = props;

	useEffect(() => tabController(), [isSelected]);

	const [activeIndex, setActiveIndex] = useState(0);

	const id = `${prefix}-${clientId}`;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} />

			<SocialShare attributes={attributes} isBackend={true} custom={{ activeIndex, setActiveIndex }} />
		</div>
	</>;
};
export default Edit;
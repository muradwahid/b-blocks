import { useEffect } from 'react';
import { useBlockProps } from '@wordpress/block-editor';

import { tabController } from '../../../../../bpl-tools/utils/functions';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import RenderChart from '../Common/RenderChart';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId, isSelected } = props;

	useEffect(() => tabController(), [isSelected]);

	const id = `${prefix}-${clientId}`;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} />

			<RenderChart attributes={attributes} id={id} isBackend={true} />
		</div>
	</>;
};
export default Edit;
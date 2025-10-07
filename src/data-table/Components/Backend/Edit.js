import { useBlockProps } from '@wordpress/block-editor';
import { useState } from 'react';

import Style from '../Common/Style';
import DataTableBack from './DataTableBack/DataTableBack';
import Settings from './Settings/Settings';
import usePremiumInEditor from '../../../hooks/usePremiumInEditor';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const [firstIdx, setFirstIdx] = useState(0);
	const [headingIdx, setHeadingIdx] = useState(0);

	const { isPremium = false } = usePremiumInEditor();

	return <>
		<Settings {...{ attributes, setAttributes, firstIdx, headingIdx, setHeadingIdx, isPremium }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />
			<DataTableBack {...{ attributes, setAttributes, setFirstIdx, setHeadingIdx }} />
		</div>
	</>
}
export default Edit;
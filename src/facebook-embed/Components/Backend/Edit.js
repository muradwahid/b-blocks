import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import FacebookBackend from './FacebookBackend';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import { useWPAjax } from '../../../../../bpl-tools/hooks';
import { useEffect, useState } from 'react';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const [facebookKey, setFacebookKey] = useState('');
	const nonce = window.bBlocksCursorDataConfig?.nonce
	const { data, isLoading } = useWPAjax('bblocks_api_keys', { _wpnonce: nonce }, true);
	const isPremium = bBlocksPremiumChecker;

	useEffect(() => { 
		setFacebookKey(data?.facebook?.key)
	},[data,isLoading])

	const updateObj = updateAttributes(attributes, setAttributes);
	return <>
		<Settings {...{ attributes, updateObj, isPremium, facebookKey }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />
			<FacebookBackend attributes={attributes} facebookKey={facebookKey} />
		</div>
	</>;
}
export default Edit;

import { useBlockProps } from '@wordpress/block-editor';

import Facebook from '../Common/Facebook';
import Style from '../Common/Style';
import Settings from './Settings/Settings';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import { useEffect, useState } from 'react';
import { useWPAjax } from '../../../../../bpl-tools/hooks';

const Edit = props => {
    const { attributes, setAttributes, clientId } = props;

    const [facebookKey, setFacebookKey] = useState('');
    const nonce = window.bBlocksCursorDataConfig?.nonce
    const { data, isLoading } = useWPAjax('bblocks_api_keys', { _wpnonce: nonce }, true);

    const updateObj = updateAttributes(attributes, setAttributes);
    const isPremium = bBlocksPremiumChecker;
    useEffect(() => {
        setFacebookKey(data?.facebook?.key)
    },[data,isLoading])

    return  <>
        <Settings {...{ attributes, setAttributes, updateObj, isPremium, facebookKey }} />

            <div {...useBlockProps()} >
                <Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />
                <Facebook key={JSON.stringify(attributes.facebook)} attributes={attributes} facebookKey={facebookKey} />
                </div>
        </> 
}
export default Edit;
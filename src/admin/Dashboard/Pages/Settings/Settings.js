import { useEffect, useState } from 'react';
import { TextControl } from '@wordpress/components';

import Layout from '../../Layout/Layout';

import { Button } from '../../../../../../bpl-tools/Components';
import { useWPAjax } from '../../../../../../bpl-tools/hooks';

import { OpenAiIcon } from '../../utils/icons';

const Settings = ({ info }) => {
    const {nonce} = info
    const [apiData, setApiData] = useState({})
    const { data, saveData, isLoading, error } = useWPAjax('bblocks_api_keys', { _wpnonce:nonce},true);

    const handleApiData = (key, value) => {
        saveData({ key, value:value['key'] })
    }
    useEffect(() => {
        if (!isLoading && data) {
            setApiData(data);
        }
    }, [isLoading,data,error])
    const api = ['openAi']

    return <Layout info={info}>
        <div className='bBlocksSettingPage'>
            <h2 className='bBlocksHeading'>API Integrations</h2>
            <div className='bBlocksApiCartContainer'>
                {
                    api.map((key, index) => <div key={index} className='bBlocksApiCart'>
                        <div className='bBlocksApiHeading'>
                            <OpenAiIcon className="cartIcon" />
                            <h4>Open Ai</h4>
                        </div>
                        <div className='bBlocksApiField'>
                            <h4>Api Key</h4>
                            <TextControl
                                value={apiData[key]?.key} onChange={value => setApiData({ ...apiData, [key]: { key: value } })}
                                type='text'
                            />
                        </div>
                        <div className='bBlocksApiInfo'>
                            <p>Enter your Api Key. get it from <a target='_blank' rel='noreferrer' href='https://platform.openai.com/account/api-keys'>Open Ai Platform</a></p>
                            <p><strong>Note:</strong> You need to add credits to your account after getting the API key.</p>
                        </div>
                        <div className='bBlocksApiFooter'>
                            <p><strong>Api key status: </strong>{error?.[key] ? <span style={{color:'red'}}>✗ {error?.[key]?.message}</span> : data?.[key]?.key ? <span style={{color:"green"}} >✓ Valid Key</span>:''} </p>
                            <Button type='button' size='small' onClick={() => handleApiData(key,apiData[key])}>{isLoading ? 'Saving...' : 'Save'}</Button>
                        </div>
                    </div>)
                }
            </div>
        </div>
    </Layout>
};

export default Settings;
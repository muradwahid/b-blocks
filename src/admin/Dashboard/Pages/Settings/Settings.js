import { useEffect, useState } from 'react';
import { TextControl } from '@wordpress/components';

import { Button } from '../../../../../../bpl-tools/Components';
import { useWPAjax } from '../../../../../../bpl-tools/hooks';

import { apiKeyData } from '../../utils/data2';

const Settings = ({ info }) => {
    const { nonce } = info
    const [apiData, setApiData] = useState({})
    const [dataKey, setDataKey] = useState('');
    const { data, saveData, isLoading, error } = useWPAjax('bblocks_api_keys', { _wpnonce: nonce }, true);

    const handleApiData = (key, value) => {
        setDataKey(key)
        saveData({ key, value: value['key'] })
    }
    useEffect(() => {
        if (!isLoading && data) {
            setApiData(data);
        }
    }, [isLoading, data, error])
    return <div className='bBlocksSettingPage'>
            <h2 className='bBlocksHeading'>API Integrations</h2>
            <div className='bBlocksApiCartContainer'>
                {
                    apiKeyData.map((item) => <div key={item.name} className='bBlocksApiCart'>
                        <div>
                            <div className='bBlocksApiHeading'>
                                {item.icon}
                                <h4>{item.label}</h4>
                            </div>
                            <div className='bBlocksApiField'>
                                <h4>{item.inputLabel}</h4>
                                <TextControl
                                    value={apiData[item.name]?.key ?? ''} onChange={value => setApiData({ ...apiData, [item.name]: { key: value } })}
                                    type='text'
                                />
                            </div>
                            <div className='bBlocksApiInfo' dangerouslySetInnerHTML={{ __html: item.infoEl }} />
                        </div>
                        <div className='bBlocksApiFooter'>
                            <p><strong>{item.inputLabel} status: </strong>{error?.[item.name] ? <span style={{ color: 'red' }}>✗ {error?.[item.name]?.message}</span> : data?.[item.name]?.key ? <span style={{ color: "green" }} >✓ Valid Key</span> : ''} </p>
                            <Button className='bBlocksApiSaveBtn' type='button' size='small' onClick={() => handleApiData(item.name, apiData[item.name])}>{isLoading && dataKey === item.name ? 'Saving...' : 'Save'}</Button>
                        </div>
                    </div>)
                }
            </div>
        </div>
};

export default Settings;
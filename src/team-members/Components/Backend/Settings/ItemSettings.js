import { __ } from '@wordpress/i18n';

import { Label, Background, ColorControl, ColorsControl, InlineDetailMediaUpload, ShadowControl, SeparatorControl } from '../../../../../../bpl-tools/Components';
import { BorderControl, ChangeImageData } from '../../../../../../bpl-tools/Components/Deprecated';
import { primaryColor } from '../../../../../../bpl-tools/utils/data';
import { TabPanel } from '@wordpress/components';
import { normalHoverTabs } from '../../../../utils/options';

const ItemSettings = ({ attributes, index, updateMember }) => {
    const { members } = attributes
    const { background = {}, border = {}, shadow = {}, photo, photoBorder = {}, nameColor = '', titleColor = '', separator = {}, bioColor = '', socialIconColors = {}, iconStyle={} } = members[index] || {};

    return <>

        <Background label={__('Background:', 'b-blocks')} value={background} onChange={val => updateMember(index, 'background', val)} />

        <BorderControl label={__('Border:', 'b-blocks')} value={border} onChange={val => updateMember(index, 'border', val)} defaults={{ radius: '3px' }} />

        <ShadowControl label={__('Shadow:', 'b-blocks')} value={shadow?.shadow || shadow} onChange={val => updateMember(index, 'shadow', val)} />

        <Label>{__('Photo:', 'b-blocks')}</Label>
        <InlineDetailMediaUpload value={photo} onChange={val => updateMember(index, 'photo', val)} placeholder={__('Enter Image URL', 'b-blocks')} />
        <ChangeImageData className='mt20' value={photo} onChange={val => updateMember(index, 'photo', val)} />

        <BorderControl label={__('Photo Border:', 'b-blocks')} value={photoBorder} onChange={val => updateMember(index, 'photoBorder', val)} defaults={{ radius: '50%' }} />

        <ColorControl label={__('Name Color:', 'b-blocks')} value={nameColor} onChange={val => updateMember(index, 'nameColor', val)} defaultColor='#333' />

        <ColorControl label={__('Designation/Title Color:', 'b-blocks')} value={titleColor} onChange={val => updateMember(index, 'titleColor', val)} defaultColor='#333' />

        <SeparatorControl value={separator} onChange={val => updateMember(index, 'separator', val)} defaults={{ width: '20%', height: '3px', color: '#777' }} />

        <ColorControl label={__('Bio Color:', 'b-blocks')} value={bioColor} onChange={val => updateMember(index, 'bioColor', val)} defaultColor='#333' />

        <TabPanel className='bPlTabPanel mini' activeClass='activeTab' tabs={normalHoverTabs}>
            {
                tab => <>
                    {
                        tab.name==='normal' && <>
                            <ColorsControl label={__('Social Icon Colors:', 'b-blocks')} value={socialIconColors} onChange={val => updateMember(index, 'socialIconColors', val)} defaults={{ color: '#fff', bg: primaryColor }} />

                            <BorderControl label={__('Icon Border','b-blocks')} value={iconStyle?.normal?.border} onChange={val=>updateMember(index, 'iconStyle', val, 'normal', 'border' )}/>

                            <ShadowControl  label={__('Icon Shadow','b-blocks')} value={iconStyle?.normal?.shadow} onChange={val=>updateMember(index, 'iconStyle', val, 'normal', 'shadow' )} />

                        </>
                    }
                    {
                        tab.name==='hover' && <>
                            <ColorsControl label={__('Social Icon Colors:', 'b-blocks')} value={iconStyle?.hover?.socialIconColors} onChange={val => updateMember(index,'iconStyle', val, 'hover', 'socialIconColors')}  />

                            <BorderControl label={__('Icon Border','b-blocks')} value={iconStyle?.hover?.border} onChange={val=>updateMember(index, 'iconStyle', val, 'hover', 'border' )}/>

                            <ShadowControl  label={__('Icon Shadow','b-blocks')} value={iconStyle?.hover?.border} onChange={val=>updateMember(index, 'iconStyle', val, 'hover', 'shadow' )} />
                        </>
                    }
                </>
            }
        </TabPanel>
    </>
};

export default ItemSettings;
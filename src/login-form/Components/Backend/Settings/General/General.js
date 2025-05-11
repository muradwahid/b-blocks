import { Fragment } from 'react';
import { Flex, PanelBody, TextControl, ToggleControl, __experimentalInputControl as InputControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';

import { BtnGroup, Device, HelpPanel, Label } from '../../../../../../../bpl-tools/Components';
import { submitBtnAlignOptions } from '../../../../utils/options';

const General = (props) => {
    const { attributes, updateObj, device } = props;
    const { formInput, labels, button, additional, errorMessage } = attributes;
    return  <>
            <HelpPanel slug='b-blocks' docsLink='https://bplugins.com/docs/login-form/guides/general' />

            <PanelBody className='bPlPanelBody' title={__('Labels', 'b-blocks')} initialOpen={true} >
                <ToggleControl label={__('Show Label', 'b-blocks')} checked={labels.show} value={labels.show} onChange={(value) => updateObj('labels', value, 'show')} />
                {labels.show && <Fragment>
                    <TextControl className='mt10' label={__('User Name', 'b-blocks')} value={labels.username} onChange={(value) => updateObj('labels', value, 'username')} />

                    <TextControl className='mt10' label={__('Password', 'b-blocks')} value={labels.password} onChange={(value) => updateObj('labels', value, 'password')} />
                </Fragment>}
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Placeholder', 'b-blocks')} initialOpen={false} >
                <TextControl label={__('User Name', 'b-blocks')} value={formInput.username} onChange={(value) => updateObj('formInput', value, 'username')} />

                <TextControl className='mt10' label={__('Password', 'b-blocks')} value={formInput.password} onChange={(value) => updateObj('formInput', value, 'password')} />
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Elements', 'b-blocks')} initialOpen={false} >
                <ToggleControl label={__('Show password view icon', 'b-blocks')} checked={formInput.icon.show} value={formInput.icon.show} onChange={(value) => updateObj('formInput', value, 'icon', 'show')} />
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Submit Button', 'b-blocks')} initialOpen={false} >

                <InputControl label={__('Text', 'b-blocks')} labelPosition='edge' value={button.text} onChange={(value) => updateObj('button', value, 'text')} />
                
                <Label>{<Flex>{__('Alignment', 'b-blocks')} <Device /></Flex>}</Label>
                <BtnGroup labelPosition='top' options={submitBtnAlignOptions} value={button.alignment[device]} onChange={(value) => updateObj('button', value, 'alignment', device)} isIcon={true} size="default" />
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Input Error Message', 'b-blocks')} initialOpen={false} >

                <TextControl label={__('UserName or Email', 'b-blocks')} value={errorMessage.username} onChange={(value) => updateObj('errorMessage', value, 'username')} />
                
                <TextControl label={__('Password', 'b-blocks')} value={errorMessage.password} onChange={(value) => updateObj('errorMessage', value, 'password') } />
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Addition Options', 'b-blocks')} initialOpen={false} >
                <TextControl className='mb0' placeholder='https://your-link.com' value={additional.loginRedirect} onChange={(value) => updateObj('additional', value, 'loginRedirect') } />
                <small>
                    {__(
                        'If you want to redirect after login, please insert the redirect link; otherwise, leave it blank.',
                        'b-blocks'
                    )}
                </small>

                <TextControl className='mt20 mb0' placeholder='https://your-link.com' value={additional.logoutRedirect} onChange={(value) => updateObj('additional', value, 'logoutRedirect') } />
                <small>
                    {__(
                        'If you want to redirect after logout, please insert the redirect link; otherwise, leave it blank. Ensure that you provide your current website link!',
                        'b-blocks'
                    )}
                </small>

                <ToggleControl className='mt20' label={__('Lost your password', 'b-blocks')} checked={additional.lostPass} value={additional.lostPass} onChange={(value) => updateObj('additional', value, 'lostPass')} />

                {additional.lostPass && <TextControl value={additional.lostPassText} onChange={(value) => updateObj('additional', value, 'lostPassText')} />}

                <ToggleControl className='mt20' label={__('Remember Me', 'b-blocks')} checked={additional.remember} value={additional.remember} onChange={(value) => updateObj('additional', value, 'remember')} />
                
            </PanelBody>
        </> 
};

export default withSelect((select) => {
    const { getDeviceType } = select('core/editor');

    return {
        device: getDeviceType()?.toLowerCase(),
    };
})(General)

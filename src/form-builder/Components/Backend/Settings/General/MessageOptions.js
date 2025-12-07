import { ToggleControl } from '@wordpress/components';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const MessageOptions = ({ attributes, updateObj }) => {
  const { message } = attributes;
  return <PanelBody title={__('Message', 'b-blocks')} initialOpen={false} className='bPlPanelBody'>
    <ToggleControl label={__('Show Demo Success message')} value={message.isShowDemoSuccess} checked={message.isShowDemoSuccess} onChange={val => updateObj('message', val,'isShowDemoSuccess')} />
    <ToggleControl className='mt10' label={__('Show Demo Error message')} value={message.isShowDemoError} checked={message.isShowDemoError} onChange={val => updateObj('message', val, 'isShowDemoError')} />
    <div className='mt10'><strong>Success</strong></div>
    <TextControl label={__('Success Message', 'b-blocks')} value={message.success.successFulRegistration} onChange={value => updateObj('message', value, 'success', 'successFulRegistration')} />
    
    <p className='mt10 mb0'><strong>Error</strong></p>
    
    <TextControl label={__('Default Message', 'b-blocks')} value={message.error.default} onChange={value => updateObj('message', value, 'error', 'default')} />
    </PanelBody>
};

export default MessageOptions;
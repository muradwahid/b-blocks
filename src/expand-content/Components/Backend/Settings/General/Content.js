import { TextControl, ToggleControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const Content = (props) => {
    const { attributes, updateObj } = props;
    const { buttons } = attributes;
    return <PanelBody title={__('Content', 'b-blocks')} initialOpen={false} className='bPlPanelBody'>

        <TextControl label={__('Show More Label', 'b-blocks')} value={buttons?.showMore} onChange={(val) => updateObj('buttons', val, 'showMore')} placeholder={__('Show More', 'b-blocks')} />

        <TextControl className='mt10' label={__('Show Less Label', 'b-blocks')} value={buttons?.showLess} onChange={(val) => updateObj('buttons', val, 'showLess')} placeholder={__('Show Less', 'b-blocks')} />

        <ToggleControl className='mt10' label={__('Show collapse button after expanding', 'b-blocks')} checked={buttons.isShowCollapse} onChange={(val) => updateObj('buttons', val, 'isShowCollapse')} help={__('When disabled, visitors can expand once and the content stays open.', 'b-blocks')} />

        <ToggleControl className='mt10' label={__('Remember state for the visitor', 'b-blocks')} checked={buttons.persistState} onChange={(val) => updateObj('buttons', val, 'persistState')} help={__('Saves the open / closed state in sessionStorage so it persists across page navigation in the same tab.', 'b-blocks')} />

    </PanelBody>
};

export default Content;
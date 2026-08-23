import { BorderBoxControl, Flex, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Background, BoxControl, Device, ShadowControl } from '../../../../../../../bpl-tools/Components';

const ContentStyleOptions = (props) => {
    const { attributes, updateObj, device } = props;
    const { styles } = attributes;
    const { content } = styles;
    return <>
        <PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={false} >

            <BoxControl className='mt10' label={<Flex>{__('Padding', 'b-blocks')} <Device /> </Flex>} values={content[device].padding} onChange={val => updateObj('styles', val, 'content', device, 'padding')} />

            <Background value={content.bg} onChange={val => updateObj('styles', val, 'content', 'bg')} />

            <BorderBoxControl label={__('Border', 'b-blocks')} value={content.border} onChange={val => updateObj('styles', val, 'content', 'border')} />

            <BoxControl className='mt10' label={<Flex>{__('Border Radius', 'b-blocks')} <Device /> </Flex>} values={content[device].radius} onChange={val => updateObj('styles', val, 'content', device, 'radius')} />

            <ShadowControl value={content.shadow} onChange={val => updateObj('styles', val, 'content', 'shadow')} />

        </PanelBody>
    </>
};

export default ContentStyleOptions;
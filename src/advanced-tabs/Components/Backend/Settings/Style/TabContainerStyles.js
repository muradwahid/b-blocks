import { BorderBoxControl, Flex, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Background, BoxControl, Device } from '../../../../../../../bpl-tools/Components';

const TabContainerStyles = (props) => {

  const { attributes, updateObj, device } = props;

  const { styles } = attributes;

  const { tabContainer } = styles;

  return <PanelBody className='bPlPanelBody' title={__('Tab Container', 'b-blocks')} initialOpen={true}>

    <BoxControl label={<Flex>{__('Margin', 'b-blocks')}<Device /></Flex>} values={tabContainer[device].margin} onChange={val => updateObj('styles', val, 'tabContainer', device, 'margin')} />

    <BoxControl className='mt10' label={<Flex>{__('Padding', 'b-blocks')}<Device /></Flex>} values={tabContainer[device].padding} onChange={val => updateObj('styles', val, 'tabContainer', device, 'padding')} />

    <Background label={__('Background', 'b-blocks')} value={tabContainer.bg} onChange={val => updateObj('styles', val, 'tabContainer', 'bg')} />
    
    <BorderBoxControl label={__('Border', 'b-blocks')} value={tabContainer.border} onChange={val => updateObj('styles', val, 'tabContainer', 'border')} />
    
    <BoxControl className='mt10' label={<Flex>{__('Border Radius', 'b-blocks')}<Device/></Flex>} values={tabContainer[device].radius} onChange={val => updateObj('styles', val, 'tabContainer', device, 'radius')} />
    
    
    </PanelBody>
};

export default TabContainerStyles;
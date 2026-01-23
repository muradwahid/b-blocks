import { Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n'
import { ColorControl, Device, Typography } from '../../../../../../../bpl-tools/Components';
import { withSelect } from '@wordpress/data';

const ListsStyle = (props) => {
  const { attributes, updateObj, device } = props;
  const { styles } = attributes;
  const { lists } = styles;
	return <PanelBody className='bPlPanelBody' title={__('Lists Style','b-blocks')} initialOpen={true}>
    <ColorControl label={__('Color','b-blocks')} value={lists.color} onChange={val => updateObj('styles', val, 'lists', 'color')} />
    {/* <Background label={__('Background','b-blocks')} value={lists.bg} onChange={val => updateObj('styles', val, 'lists', 'bg')} /> */}
    <Typography value={lists.typography} onChange={val => updateObj('styles', val, 'lists', 'typography')} />
    
    <UnitControl className='mt10' label={<Flex>{__('Space Between', 'b-blocks')} <Device /></Flex>} labelPosition='edge' value={lists[device].gap.horizontal} onChange={val => updateObj('styles', val, 'lists', device, 'gap', 'horizontal')} />
    
    {/* <UnitControl className='mt10' label={<Flex>{__('Vertical Gap', 'b-blocks')} <Device /></Flex>} labelPosition='edge' value={lists[device].gap.vertical} onChange={val => updateObj('styles', val, device, 'gap', 'vertical')} /> */}
    
	</PanelBody>
}
export default withSelect((select) => {
    const { getDeviceType } = select('core/editor');

    return {
      device: getDeviceType()?.toLowerCase(),
    };
  })(ListsStyle);
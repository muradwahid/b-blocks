import { __ } from '@wordpress/i18n';
import { SelectControl, PanelBody, ToggleControl, __experimentalUnitControl as UnitControl, Flex } from '@wordpress/components';
import { dividerOptions } from '../../../../utils/options';
import { ColorControl, Label } from '../../../../../../../bpl-tools/Components';
import { withSelect } from '@wordpress/data';

const Divider = (props) => { 
  const { attributes, updateObj } = props;
  const { styles, layout } = attributes;
  const { divider } = styles;

  return <PanelBody className='bPlPanelBody' title={__('Divider', 'b-blocks')} initialOpen={false}>
    
    <ToggleControl label={__('Enable Divider', 'b-blocks')} checked={divider.isEnabled} onChange={(val) => updateObj('styles', val, 'divider', 'isEnabled')} />
    { 
      divider.isEnabled && <>
        {
          <Flex align='center' className='mt10'>
            <Label className='mt0 flex1'>{__('Style', 'b-blocks')}</Label>
            <SelectControl className='flex1' value={divider.style} options={dividerOptions} onChange={val => updateObj('styles', val, 'divider', 'style')} />

          </Flex>
        }
        {
          <Flex align='center'>
            <Label className='mt0 flex1'>{__('Weight', 'b-blocks')}</Label>
            <UnitControl className='flex1' value={divider.weight} labelPosition='edge' onChange={val => updateObj('styles', val, 'divider', 'weight')} />
          </Flex>
        }

        {(layout?.desktop.type === 'vertical') && <Flex align='center' className='mt10'>
          <Label className='mt0 flex1'>{__('Width', 'b-blocks')}</Label>
          <UnitControl className='flex1' value={divider.width} labelPosition='edge' onChange={val => updateObj('styles', val, 'divider', 'width')} />
        </Flex>}

        <ColorControl label={__('Color', 'b-blocks')} value={divider.color} onChange={val => updateObj('styles', val, 'divider', 'color')} />
      </>
    }
    
  </PanelBody>
}

export default withSelect((select) => {
  const { getDeviceType } = select('core/editor');

  return {
    device: getDeviceType()?.toLowerCase(),
  };
})(Divider);
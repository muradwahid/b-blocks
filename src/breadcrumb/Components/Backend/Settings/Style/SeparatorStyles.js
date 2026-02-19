import { Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ColorControl, Device, Label, Typography } from '../../../../../../../bpl-tools/Components';


const SeparatorStyles = ({ attributes, updateObj, device }) => {
  const { styles, separator: separatorOptions } = attributes;
  const { separator } = styles;
  return <PanelBody className='bPlPanelBody' title={__('Separator', 'b-blocks')} initialOpen={false}>
    <ColorControl label={__('Color', 'b-blocks')} value={separator.color} onChange={(val) => updateObj('styles', val, 'separator', 'color')} />
    {separatorOptions.type === 'text' && <Typography value={separator.text.typo} onChange={(val) => updateObj('styles', val, 'separator', 'text', 'typo')} />}

    {separatorOptions.type === 'library' && <Flex className='mt10'>
      <Label className='mb0 flex2'>{__('Icon Size', 'b-blocks')} <Device /></Label>
      <UnitControl className='flex1' value={separator.library[device].size} onChange={(val) => updateObj('styles', val, 'separator', 'library', device, 'size')} />
    </Flex>}

  </PanelBody>
};

export default SeparatorStyles;
import { Flex, PanelBody, TextControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption   } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { IconLibrary, Label } from '../../../../../../../bpl-tools/Components';


const Separator = ({ attributes, updateObj }) => {
  const { separator } = attributes;
  return <PanelBody className='bPlPanelBody' title={__('Separator', 'b-blocks')} initialOpen={false}>
    <Flex className='mt10'>
      <Label className='flex1 mb0'>{__('Separator Type', 'b-blocks')}</Label>
      <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={separator?.type} onChange={(val) => updateObj('separator', val, 'type')} isDeselectable >
        <ToggleGroupControlOption label={__('Text', 'b-blocks')} value='text' />
        <ToggleGroupControlOption label={__('Icon', 'b-blocks')} value='library' />
      </ToggleGroupControl>
    </Flex>

    {
      separator.type ==='text' && <TextControl className='mt10' label={__('Separator Text', 'b-blocks')} value={separator?.text} onChange={(val) => updateObj('separator', val, 'text')} />
    }

    {
      separator.type ==='library' && <IconLibrary className='mt10' value={separator?.library} onChange={(val) => updateObj('separator', val, 'library')} />
    }

  </PanelBody>

};

export default Separator;
import { BorderBoxControl, Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Background, BoxControl, ColorControl, Device, Label, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';

const Prefix = ({ attributes, updateObj, device }) => {
  const { styles, prefix: prefixOptions } = attributes;
  const { prefix } = styles;
  return <PanelBody className='bPlPanelBody' title={__('Prefix', 'b-blocks')} initialOpen={false}>

    {prefixOptions.type === 'text' && <Typography value={prefix.text.typo} onChange={(val) => updateObj('styles', val, 'prefix', 'text', 'typo')} />}

    {prefixOptions.type === 'library' && <>
      <Flex>
        <Label className='flex2 mb0'>{__('Size', 'b-blocks')}<Device/></Label>
        <UnitControl className='flex1' value={prefix.library[device].size} onChange={(val) => updateObj('styles', val, 'prefix', 'library', device, 'size')} />
      </Flex>
    </>}

    {
      prefixOptions.type === 'image' && <>
        <Flex>
          <Label className='flex2 mb0'>{__('Height', 'b-blocks')}</Label>
          <UnitControl className='flex1' value={prefix.image.height} onChange={(val) => updateObj('styles', val, 'prefix', 'image', 'height')} />
        </Flex>

        <Flex className='mt10'>
          <Label className='flex2 mb0'>{__('Width', 'b-blocks')}</Label>
          <UnitControl className='flex1' value={prefix.image.width} onChange={(val) => updateObj('styles', val, 'prefix', 'image', 'width')} />
        </Flex>

      </>
    }


    {/* <UnitControl label={__('Right Gap', 'b-blocks')} value={prefix[device].rightGap} onChange={(val) => updateObj('styles', val, 'prefix', device, 'rightGap')} /> */}

    <BoxControl className='mt10' label={__('Padding', 'b-blocks')} values={prefix[device].padding} onChange={(val) => updateObj('styles', val, 'prefix', device, 'padding')} />

    {prefixOptions.type === 'text' && <ColorControl label={__('Color', 'b-blocks')} value={prefix.color} onChange={(val) => updateObj('styles', val, 'prefix', 'color')} />}

    <Background isImage={false} label={__('Background', 'b-blocks')} value={prefix.bg} onChange={(val) => updateObj('styles', val, 'prefix', 'bg')} />

    <ShadowControl label={__('Shadow', 'b-blocks')} value={prefix.shadow} onChange={(val) => updateObj('styles', val, 'prefix', 'shadow')} />

    <BorderBoxControl label={__('Border', 'b-blocks')} value={prefix.border} onChange={(val) => updateObj('styles', val, 'prefix', 'border')} />

    <BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} values={prefix[device].radius} onChange={(val) => updateObj('styles', val, 'prefix', device, 'radius')} />
  </PanelBody>
};

export default Prefix;
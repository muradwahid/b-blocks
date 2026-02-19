import { Fragment } from 'react';
import { PanelBody, TextControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { IconLibrary, Label, MediaArea } from '../../../../../../../bpl-tools/Components';

const PrefixOptions = ({ attributes, updateObj }) => {
  const { options, prefix } = attributes;

  return <PanelBody className='bPlPanelBody' title={__('Prefix', 'b-blocks')} initialOpen={false}>
    <ToggleControl label={__('Show Prefix', 'b-blocks')} checked={options?.isShowPrefix} onChange={(val) => updateObj('options', val, 'isShowPrefix')} />
    
{options.isShowPrefix && <Fragment>
    <ToggleControl label={__('Before Separator', 'b-blocks')} checked={options?.isBeforeSeparator} onChange={(val) => updateObj('options', val, 'isBeforeSeparator')} />
    
    {/* <Flex className='mt10'> */}
      <Label className='flex1 mb0 mt10'>{__('Prefix Type', 'b-blocks')}</Label>
      <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={prefix?.type} onChange={(val) => updateObj('prefix', val, 'type')} isDeselectable >
        <ToggleGroupControlOption label={__('Text', 'b-blocks')} value='text' />
        <ToggleGroupControlOption label={__('Icon', 'b-blocks')} value='library' />
        <ToggleGroupControlOption label={__('Image', 'b-blocks')} value='image' />
      </ToggleGroupControl>
    {/* </Flex> */}

    {
      prefix.type === 'text' && <TextControl className='mt10' label={__('Prefix Text', 'b-blocks')} value={prefix?.text} onChange={(val) => updateObj('prefix', val, 'text')} />
    }

    {
      prefix.type === 'library' && <IconLibrary className='mt10' value={prefix?.library} onChange={(val) => updateObj('prefix', val, 'library')} />
    }

    {
      prefix.type === 'image' && <MediaArea height='80%' width='80%' className='mt10' value={{url:prefix?.image}} onChange={(val) => updateObj('prefix', val?.url, 'image')} />
    }
    </Fragment>}


    </PanelBody>
};

export default PrefixOptions;
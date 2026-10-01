import { TextareaControl, TextControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { IconLibrary, Label, MediaArea } from '../../../../../../../bpl-tools/Components';
import { SVGSanitizer } from "../../../../../../../bpl-tools/utils/common";
import { useWPOptionQuery, useWPAjax } from '../../../../../../../bpl-tools/hooks';
import { allowSvgInUploader } from '../../../../../utils/helpers';

const ItemSettings = ({ attributes, setAttributes, index, updateObj }) => {
  const { tabLists, tabs } = attributes;
  const { isCloseAllTab } = tabs;
  const tab = tabLists[index];
  const handleInitialActive = () => {
    const newTabLists = tabLists.map((tab, idx) => {
      if (idx === index) {
        return { ...tab, isDefault: true }
      } else {
        return { ...tab, isDefault: false }
      }
    })
    if (!isCloseAllTab) {
      setAttributes({ tabLists: newTabLists })
    }
  }

  const { data: bBlocksUtils } = useWPOptionQuery('bBlocksUtils');

  const { refetch } = useWPAjax('b-blocks-enable-svg-mime-type', { _wpnonce: bBlocksUtils?.nonce }, false)

  const enableSVGUpload = () => {

    allowSvgInUploader();

    return refetch();
  }

  const svgSanitizer = new SVGSanitizer();

  return <>
    <ToggleControl label={__('Initial Active', 'b-blocks')} checked={tab.isDefault} value={tab.isDefault} onChange={handleInitialActive} />
    <TextControl type='text' className='mt10' label={__('Title', 'b-blocks')} value={tab.title} onChange={val => updateObj('tabLists', val, index, 'title')} />
    <TextareaControl rows={2} className='mt10' label={__('Sub Title', 'b-blocks')} value={tab.subTitle} onChange={val => updateObj('tabLists', val, index, 'subTitle')} />

    <Label>{__('Icon Type', 'b-blocks')}</Label>

    <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={tab.iconType} onChange={(val) => updateObj('tabLists', val, index, 'iconType')}>
      <ToggleGroupControlOption label='None' value='none' />
      <ToggleGroupControlOption label='Library' value='library' />
      <ToggleGroupControlOption label='Upload SVG' value='svg' />
    </ToggleGroupControl>

    {tab.iconType === 'library' && <IconLibrary className='mt10' label={__('Icon Library', 'b-blocks')} value={tab.library} onChange={val => updateObj('tabLists', val, index, 'library')} />}
    {
      tab.iconType === 'svg' && <>
        <MediaArea className='mt10' label={__('Upload SVG', 'b-blocks')} types={['image/svg+xml']} onClick={enableSVGUpload} value={{ url: tab.svg }} onChange={async (value) => {
          const svgStr = value?.url ? await svgSanitizer.sanitizeFile(value?.url) : '';
          updateObj('tabLists', svgStr, index, 'svg');
        }} isSvgEnabled={true} />
      </>
    }
  </>
};

export default ItemSettings;
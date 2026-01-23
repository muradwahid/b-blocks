import { CheckboxControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { IconLibrary } from '../../../../../../../bpl-tools/Components';

const ItemSettings = (props) => {
  const { attributes, updateObj,index } = props;
  const { items } = attributes;
  const item = items[index]
  return <>
    <TextControl label={__('Text', 'b-blocks')} value={item.text} onChange={(val) => updateObj('items', val, index, 'text')} />
    <IconLibrary className='mt10' label={__('Icon', 'b-blocks')} value={item.icon} onChange={(val) => updateObj('items', val, index, 'icon')} />
    
    <TextControl label={__('Link', 'b-blocks')} value={item.link} onChange={(val) => updateObj('items', val, index, 'link')} />
    
    <CheckboxControl label={__('Open in new window', 'b-blocks')} checked={item.newWindow} onChange={(val) => updateObj('items', val, index, 'newWindow')} />
    
    {/* <ColorControl className='mt10' label={__('Text Color', 'b-blocks')} value={item.textColor} onChange={(val) => updateObj('items', val, index, 'textColor')} />
    <ColorControl className='mt10' label={__('Marker Color', 'b-blocks')} value={item.markerColor} onChange={(val) => updateObj('items', val, index, 'markerColor')} /> */}
	</>
}

export default ItemSettings
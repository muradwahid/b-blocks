import { Background, ColorControl } from '../../../../../../../bpl-tools/Components';
import { __ } from '@wordpress/i18n';

const ItemSettings = ({ value, index, updateObj }) => {
  const cl = value[index];
  return <>
    {/* <Typography value={cl.typo} onChange={val => updateObj('datatableStyles', val, 'column', index, 'typo')} /> */}
    <ColorControl label={__('Color', 'b-blocks')} value={cl.color} onChange={val => updateObj('datatableStyles', val, 'column', index, 'color')} />

    <Background label={__('Background', 'b-blocks')} value={cl.bg} onChange={val => updateObj('datatableStyles', val, 'column', index, 'bg')} />

  </>
};

export default ItemSettings;
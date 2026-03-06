import { ToggleControl, Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { Device, Label } from '../../../../../../../bpl-tools/Components';

const PaginationOptions = ({ attributes, updateObj, device }) => {
  const { pagination, styles } = attributes;
  const { pagination: paginationStyle } = styles;
  return <PanelBody className='bPlPanelBody' title={__('Pagination', 'b-blocks')} initialOpen={false}>

    <ToggleControl label={__('Show Pagination', 'b-blocks')} value={pagination.pagination} checked={pagination.pagination} onChange={val => updateObj('pagination', val, 'pagination')} />
    
    {
      pagination.pagination && <>
        <ToggleControl className='mt10' label={__('Enable Pagination Clickable', 'b-blocks')} value={pagination.clickable} checked={pagination.clickable} onChange={val => updateObj('pagination', val, 'clickable')} />
        
        {/* <ToggleControl className='mt10' label={__('Enable Dynamic Bullets', 'b-blocks')} value={pagination.dynamicPagination} checked={pagination.dynamicPagination} onChange={val => updateObj('pagination', val, 'dynamicPagination')} /> */}
        
        <Flex className='mt10'>
          <Label className='mb0 flex2'>{__('Position X', 'b-blocks')}<Device /></Label>
          <UnitControl className='flex1' value={paginationStyle[device].positionX} min={-50} max={150} onChange={val => updateObj('styles', val, 'pagination', device, 'positionX')} />
        </Flex>
        
        <Flex className='mt10'>
          <Label className='mb0 flex2'>{__('Position Y', 'b-blocks')}<Device /></Label>
          <UnitControl className='flex1' value={paginationStyle[device].positionY} min={-50} max={150} onChange={val => updateObj('styles', val, 'pagination', device, 'positionY')} />
        </Flex>

      </>
    }
    
  </PanelBody>
};

export default PaginationOptions;
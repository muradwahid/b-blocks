import { __ } from "@wordpress/i18n";
import { useState } from "react";
import { PanelBody, Flex, BorderBoxControl, RangeControl,  __experimentalToggleGroupControl as ToggleGroupControl,__experimentalToggleGroupControlOption as ToggleGroupControlOption } from "@wordpress/components";
import { Background, BoxControl, ColorControl, Device, ItemsPanel, Typography } from "../../../../../../../bpl-tools/Components";
import ItemSettings from "./ItemSettings";

const DataTableStyles = ({ attributes, setAttributes, updateObj, device }) => {

  const [normalFocus, setNormalFocus] = useState('normal');
  const [normal, setNormal] = useState('normal');
  const [paginationNormal, setPaginationNormal] = useState('normal');

  const { datatableStyles } = attributes;
  const { search, recordInfo, pageLength, pagination, buttons, column } = datatableStyles;
  const newItem = {
    typo: "",
    color: "",
    bg: {}
  }
  const handleAddTab = () => { 
    setAttributes({ 
      datatableStyles: { 
        ...datatableStyles, 
        column: [...column, newItem]
      } 
    }) 
  }

  const handleRemoveTab = (index) => { 
    setAttributes({ 
      datatableStyles: { 
        ...datatableStyles, 
        column: column.filter((_, indx) => indx !== index)
      } 
    }) 

  }

  const handleCopyTab = (index) => { 
    setAttributes({ 
      datatableStyles: { 
        ...datatableStyles, 
        column: [...column, column[index]]
      }
    })
  }
  return <>
    <PanelBody className='bPlPanelBody' title={__('Data Table Styles', 'b-blocks')} initialOpen={false}>

      <PanelBody className='bPlPanelBody' title={__('Column Styles', 'b-blocks')} initialOpen={false}>

        <ItemsPanel value={datatableStyles.column}  handleAdd={handleAddTab} handleDelete={handleRemoveTab} newItem={newItem} design='sortable' itemLabel='Column' arrKey='column' title='title' ItemSettings={ItemSettings} handleCopy={handleCopyTab} minItem={0} updateObj={updateObj} />

      </PanelBody>

      {/* search style options */}
      <PanelBody className='bPlPanelBody' title={__('Search', 'b-blocks')} initialOpen={false}>
        <b className="mt10 mb10">{__('Label', 'b-blocks')}</b>

        <BoxControl className="mt10" label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} values={search.label[device].padding} onChange={val => updateObj('datatableStyles', val, 'search', 'label', device, 'padding')} />

        <BoxControl className="mt10" label={<Flex>{__('Margin', 'b-blocks')} <Device /></Flex>} values={search.label[device].margin} onChange={val => updateObj('datatableStyles', val, 'search', 'label', device, 'margin')} />

        <Typography value={search.label.typo} onChange={val => updateObj('datatableStyles', val, 'search', 'label', 'typo')} />

        <ColorControl className='mt10' label={__('Color', 'b-blocks')} value={search.label.color} onChange={val => updateObj('datatableStyles', val, 'search', 'label', 'color')} />

        <Background className='mt10' value={search.label.bg} onChange={val => updateObj('datatableStyles', val, 'search', 'label', 'bg')} />

        <b className="mt10 mb10">{__('Input Field', 'b-blocks')}</b>

        <BoxControl className="mt10" label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} values={search.input[device].padding} onChange={val => updateObj('datatableStyles', val, 'search', 'input', device, 'padding')} />

        <BoxControl className="mt10" label={<Flex>{__('Margin', 'b-blocks')} <Device /></Flex>} values={search.input[device].margin} onChange={val => updateObj('datatableStyles', val, 'search', 'input', device, 'margin')} />

        <Typography value={search.input.typo} onChange={val => updateObj('datatableStyles', val, 'search', 'input', 'typo')} />

        <ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={normalFocus} onChange={(val) => { setNormalFocus(val) }}>
          <ToggleGroupControlOption label='Normal' value='normal' />
          <ToggleGroupControlOption label='Hover' value='hover' />
          <ToggleGroupControlOption label='Focus' value='focus' />
        </ToggleGroupControl>

        <ColorControl label={__('Color', 'b-blocks')} value={search.input[normalFocus].color} onChange={val => updateObj('datatableStyles', val, 'search', 'input', normalFocus, 'color')} />

        <Background label={__('Background', 'b-blocks')} value={search.input[normalFocus].bg} onChange={val => updateObj('datatableStyles', val, 'search', 'input', normalFocus, 'bg')} />
        
        <BorderBoxControl className='mt10' label={<Flex>{__('Border', 'b-blocks')} <Device /></Flex>} value={search.input[normalFocus].border} onChange={val => updateObj('datatableStyles', val, 'search', 'input', normalFocus, 'border')} />

        <BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} values={search.input[normalFocus].radius} onChange={val => updateObj('datatableStyles', val, 'search', 'input', normalFocus, 'radius')} />
        
        {
          normalFocus === 'hover' && <RangeControl label={__('Transition', 'b-blocks')} value={search.input.normal.transition} onChange={val => updateObj('datatableStyles', val, 'search', 'input', 'normal', 'transition')} />
        }
      </PanelBody>

      {/* record info style options */}
      <PanelBody className='bPlPanelBody' title={__('Record Info', 'b-blocks')} initialOpen={false}>

        <BoxControl className="mt10" label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} values={recordInfo[device].padding} onChange={val => updateObj('datatableStyles', val, 'recordInfo', device, 'padding')} />

        <BoxControl className="mt10" label={<Flex>{__('Margin', 'b-blocks')} <Device /></Flex>} values={recordInfo[device].margin} onChange={val => updateObj('datatableStyles', val, 'recordInfo', device, 'margin')} />

        <Typography value={recordInfo.typo} onChange={val => updateObj('datatableStyles', val, 'recordInfo', 'typo')} />
        
        <ColorControl label={__('Color', 'b-blocks')} value={recordInfo.color} onChange={val => updateObj('datatableStyles', val, 'recordInfo', 'color')} />

        <Background label={__('Background', 'b-blocks')} value={recordInfo.bg} onChange={val => updateObj('datatableStyles', val, 'recordInfo', 'bg')} />
        
      </PanelBody>

      {/* page length style options */}
      <PanelBody className='bPlPanelBody' title={__('Page Length', 'b-blocks')} initialOpen={false}>
        <BoxControl className="mt10" label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} values={pageLength[device].padding} onChange={val => updateObj('datatableStyles', val, 'pageLength', device, 'padding')} />

        <BoxControl className="mt10" label={<Flex>{__('Margin', 'b-blocks')} <Device /></Flex>} values={pageLength[device].margin} onChange={val => updateObj('datatableStyles', val, 'pageLength', device, 'margin')} />

        <Typography value={pageLength.typo} onChange={val => updateObj('datatableStyles', val, 'pageLength', 'typo')} />

        <ColorControl label={__('Color', 'b-blocks')} value={pageLength.color} onChange={val => updateObj('datatableStyles', val, 'pageLength', 'color')} />

        <Background label={__('Background', 'b-blocks')} value={pageLength.bg} onChange={val => updateObj('datatableStyles', val, 'pageLength', 'bg')} />
      </PanelBody>

      {/* pagination style options */}
      <PanelBody className='bPlPanelBody' title={__('Pagination', 'b-blocks')} initialOpen={false}>
        <BoxControl className="mt10" label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} values={pagination[device].padding} onChange={val => updateObj('datatableStyles', val, 'pagination', device, 'padding')} />

        <BoxControl className="mt10" label={<Flex>{__('Margin', 'b-blocks')} <Device /></Flex>} values={pagination[device].margin} onChange={val => updateObj('datatableStyles', val, 'pagination', device, 'margin')} />

        <Typography value={pagination.typo} onChange={val => updateObj('datatableStyles', val, 'pagination', 'typo')} />
        
        <ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={paginationNormal} onChange={(val) => { setPaginationNormal(val) }}>
          <ToggleGroupControlOption label='Normal' value='normal' />
          <ToggleGroupControlOption label='Hover' value='hover' />
          <ToggleGroupControlOption label='Active' value='active' />
        </ToggleGroupControl>

        <ColorControl label={__('Color', 'b-blocks')} value={pagination[paginationNormal].color} onChange={val => updateObj('datatableStyles', val, 'pagination', paginationNormal, 'color')} />

        <Background label={__('Background', 'b-blocks')} value={pagination[paginationNormal].bg} onChange={val => updateObj('datatableStyles', val, 'pagination', paginationNormal, 'bg')} />

        <BorderBoxControl className='mt10' label={<Flex>{__('Border', 'b-blocks')} <Device /></Flex>} value={pagination[paginationNormal].border} onChange={val => updateObj('datatableStyles', val, 'pagination', paginationNormal, 'border')} />

        <BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} values={pagination[paginationNormal].radius} onChange={val => updateObj('datatableStyles', val, 'pagination', paginationNormal, 'radius')} />

        {
          paginationNormal === 'hover' && <RangeControl label={__('Transition', 'b-blocks')} value={pagination.normal.transition} onChange={val => updateObj('datatableStyles', val, 'pagination', 'normal', 'transition')} />
        }

      </PanelBody>

      {/* export buttons style options */}
      <PanelBody className='bPlPanelBody' title={__('Export Buttons', 'b-blocks')} initialOpen={false}>
        
        <BoxControl className="mt10" label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} values={buttons[device].padding} onChange={val => updateObj('datatableStyles', val, 'buttons', device, 'padding')} />

        <Typography value={buttons.typo} onChange={val => updateObj('datatableStyles', val, 'buttons', 'typo')} />

        <ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={normal} onChange={(val) => { setNormal(val) }}>
          <ToggleGroupControlOption label='Normal' value='normal' />
          <ToggleGroupControlOption label='Hover' value='hover' />
        </ToggleGroupControl>

        <ColorControl label={__('Color', 'b-blocks')} value={buttons[normal].color} onChange={val => updateObj('datatableStyles', val, 'buttons', normal, 'color')} />

        <Background label={__('Background', 'b-blocks')} value={buttons[normal].bg} onChange={val => updateObj('datatableStyles', val, 'buttons', normal, 'bg')} />

        <BorderBoxControl className='mt10' label={<Flex>{__('Border', 'b-blocks')} <Device /></Flex>} value={buttons[normal].border} onChange={val => updateObj('datatableStyles', val, 'buttons', normal, 'border')} />

        <BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} values={buttons[normal].radius} onChange={val => updateObj('datatableStyles', val, 'buttons', normal, 'radius')} />

        {
          normal === 'hover' && <RangeControl label={__('Transition', 'b-blocks')} value={buttons.normal.transition} onChange={val => updateObj('datatableStyles', val, 'buttons', 'normal', 'transition')} />
        }
      </PanelBody>

    </PanelBody>
  </>
};

export default DataTableStyles;
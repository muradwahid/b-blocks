import { SelectControl, ToggleControl } from '@wordpress/components';
import { RangeControl } from '@wordpress/components';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const BasicOptions = ({ attributes, updateObj }) => {
  const { options } = attributes;
  return <PanelBody className='bPlPanelBody' title={__('Basic Options', 'b-blocks')} initialOpen={false}>

    <SelectControl label={__('Direction', 'b-blocks')} value={options?.direction} options={[{ label: "Horizontal", value: 'horizontal' }, { label: "Vertical", value: 'vertical' }]} onChange={val => updateObj('options', val, 'direction')} />

    <ToggleControl label={__('Enable Loop', 'b-blocks')} value={options.loop} checked={options.loop} onChange={val => updateObj('options', val, 'loop')} help="This feature will work on frontend only."/>
    
    <ToggleControl className='mt10' label={__('Enable Touch Move', 'b-blocks')} value={options.touchMove} checked={options.touchMove} onChange={val => updateObj('options', val, 'touchMove')} help="This feature will work on frontend only."/>
    
    <RangeControl className='mt10' label={__('Speed (s)', 'b-blocks')} value={options.speed} onChange={val => updateObj('options', val, 'speed')} min={0} step={0.01} max={10} />
  
    <ToggleControl className='mt10' label={__('Auto Height', 'b-blocks')} value={options.autoHeight} checked={options.autoHeight} onChange={val => updateObj('options', val, 'autoHeight')} />

    {/* <ToggleControl label={__('Enable Free Mode', 'b-blocks')} value={options.freeMode} checked={options.freeMode} onChange={val => updateObj('options', val, 'freeMode')} />
    <ToggleControl label={__('Enable Free Mode Sticky', 'b-blocks')} value={options.freeModeSticky} checked={options.freeModeSticky} onChange={val => updateObj('options', val, 'freeModeSticky')} /> */}
  </PanelBody>
};

export default BasicOptions;
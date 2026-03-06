import { ToggleControl } from '@wordpress/components';
import { RangeControl } from '@wordpress/components';
import { SelectControl } from '@wordpress/components';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const AutoPlay = ({ attributes, updateObj }) => {
  const { autoplay } = attributes;
  return <PanelBody className='bPlPanelBody' title={__('Autoplay', 'b-blocks')} initialOpen={false}>
    <div style={{ color:'#595959', marginBottom:10}}> This feature will work on frontend only.</div>
    <ToggleControl label={__('Enable Autoplay', 'b-blocks')} value={autoplay.autoplay} checked={autoplay.autoplay} onChange={val => updateObj('autoplay', val, 'autoplay')} />

    <SelectControl label={__('Direction', 'b-blocks')} labelPosition='edge' value={autoplay.direction} onChange={val => updateObj('autoplay', val, 'direction')} options={[{ label: __('Left To Right', 'b-blocks'), value: 'left' }, { label: __('Right To Left', 'b-blocks'), value: 'right' }]} />
    
    <RangeControl label={__('Delay (s)', 'b-blocks')} value={autoplay.delay} onChange={val => updateObj('autoplay', val, 'delay')} min={0} step={0.01} max={10} />
    
    <ToggleControl label={__('Pause On Hover', 'b-blocks')} value={autoplay.isPauseOnHover} checked={autoplay.isPauseOnHover} onChange={val => updateObj('autoplay', val, 'isPauseOnHover')} />
    
    {/* <SelectControl label={__('Easing: ')} value={autoplay.easing} onChange={val => updateObj('autoplay', val, 'easing')} options={easingOptions} /> */}

  </PanelBody>
};

export default AutoPlay;
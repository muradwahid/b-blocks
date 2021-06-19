import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

/**
 * @props label: 'Border Settings' (String)
 * @props border: { width, style, color, side, radius } (Object)
 * @props onChange: (Function)
 * @return Border Properties
 */

import Title from './Title';
import BColor from './BColor';
import options from '../Const/options';
const { borderStyles, pxPerEmUnits, pxEmUnits, sides } = options;

const BorderControl = props => {
    const { label = __('Border Settings', 'b-blocks'), border, onChange } = props;

    return (
        <PanelBody title={label} initialOpen={false}>
            {/* Width */}
            <UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={border?.width} onChange={val => onChange({ ...border, ['width']: val })} units={pxEmUnits} />

            {/* Style */}
            <PanelRow className='mt-20p mb-5p'>
                <Title mt='0' mb='0'>{__('Style:', 'b-blocks')}</Title>
                <SelectControl value={border?.style} onChange={val => onChange({ ...border, ['style']: val })} options={borderStyles} />
            </PanelRow>

            {/* Color */}
            <PanelRow className='mt-20p mb-5p'>
                <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                <BColor value={border?.color} onChange={val => onChange({ ...border, ['color']: val })} defaultColor='#00000000' />
            </PanelRow>

            {/* Side */}
            <PanelRow className='mt-20p mb-5p'>
                <Title mt='0' mb='0'>{__('Sides:', 'b-blocks')}</Title>
                <SelectControl value={border?.side} onChange={val => onChange({ ...border, ['side']: val })} options={sides} />
            </PanelRow>

            {/* Radius */}
            <UnitControl className='mt-20p mb-5p' label={__('Radius:', 'b-blocks')} labelPosition='left' value={border?.radius} onChange={val => onChange({ ...border, ['radius']: val })} units={pxPerEmUnits} />
        </PanelBody>
    );
};
export default BorderControl;
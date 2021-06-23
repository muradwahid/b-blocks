import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, SelectControl, __experimentalUnitControl as UnitControl, Button } from '@wordpress/components';

/**
 * @props label: 'Border Settings' (String)
 * @props border: { width, style, color, side, radius } (Object)
 * @props onChange: (Function)
 * @props defaults (optional): { width, style, color, side, radius } (Object)
 * @return Border Properties
 */

import Title from './Title';
import BColor from './BColor';
import options from '../Const/options';
const { borderStyles, pxPerEmUnits, pxEmUnits, sides } = options;

const BorderControl = props => {
    const { label = __('Border Settings', 'b-blocks'), border, onChange, defaults = {} } = props;

    const defaultVal = { width: '0px', style: 'solid', color: '#0000', side: 'all', radius: '0px' }

    const setDefault = property => onChange({ ...border, [property]: defaults[property] || defaultVal[property] });

    // Add styles and google font to border
    const borderSideCheck = (side) => {
        const bSide = border?.side?.toLowerCase();
        return bSide?.includes('all') || bSide?.includes(side);
    }
    const borderCSS = `${border?.width} ${border?.style} ${border?.color}`;
    useEffect(() => {
        const allStyles = `${border?.width === '0px' ? '' : borderSideCheck('top') ? `border-top: ${borderCSS};` : ''}
        ${border?.width === '0px' ? '' : borderSideCheck('right') ? `border-right: ${borderCSS};` : ''}
        ${border?.width === '0px' ? '' : borderSideCheck('bottom') ? `border-bottom: ${borderCSS};` : ''}
        ${border?.width === '0px' ? '' : borderSideCheck('left') ? `border-left: ${borderCSS};` : ''}
        ${border?.radius === '0px' ? '' : `border-radius: ${border?.radius};`}`

        onChange({ ...border, ['styles']: allStyles.replace(/\s+/g, ' ').trim() });
    }, [border?.width, border?.style, border?.color, border?.side, border?.radius]);

    return (
        <PanelBody title={label} initialOpen={false}>
            {/* Width */}
            <PanelRow>
                <UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={border?.width || '0px'} onChange={val => onChange({ ...border, ['width']: val })} units={pxEmUnits} />
                {border?.width && border?.width !== (defaults?.width || defaultVal?.width) && <Button icon='image-rotate' className='bBlocksResetVal' onClick={() => setDefault('width')} />}
            </PanelRow>

            {/* Style */}
            <PanelRow className='mt-20p mb-5p'>
                <Title mt='0' mb='0'>{__('Style:', 'b-blocks')}</Title>
                <SelectControl value={border?.style || 'solid'} onChange={val => onChange({ ...border, ['style']: val })} options={borderStyles} />
                {border?.style && border?.style !== (defaults?.style || defaultVal?.style) && <Button icon='image-rotate' className='bBlocksResetVal' onClick={() => setDefault('style')} />}
            </PanelRow>

            {/* Color */}
            <BColor className='mt-20p mb-5p' label={__('Color:', 'b-blocks')} value={border?.color || '#0000'} onChange={val => onChange({ ...border, ['color']: val })} defaultColor={defaults?.color || '#0000'} />

            {/* Side */}
            <PanelRow className='mt-20p mb-5p'>
                <Title mt='0' mb='0'>{__('Sides:', 'b-blocks')}</Title>
                <SelectControl value={border?.side || 'all'} onChange={val => onChange({ ...border, ['side']: val })} options={sides} />
                {border?.side && border?.side !== (defaults?.side || defaultVal?.side) && <Button icon='image-rotate' className='bBlocksResetVal' onClick={() => setDefault('side')} />}
            </PanelRow>

            {/* Radius */}
            <PanelRow className='mt-20p mb-5p'>
                <UnitControl label={__('Radius:', 'b-blocks')} labelPosition='left' value={border?.radius || '0px'} onChange={val => onChange({ ...border, ['radius']: val })} units={pxPerEmUnits} />
                {border?.radius && border?.radius !== (defaults?.radius || defaultVal?.radius) && <Button icon='image-rotate' className='bBlocksResetVal' onClick={() => setDefault('radius')} />}
            </PanelRow>
        </PanelBody>
    );
};
export default BorderControl;
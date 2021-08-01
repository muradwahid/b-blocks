import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Dropdown, PanelRow, SelectControl, __experimentalUnitControl as UnitControl, Button } from '@wordpress/components';

/**
 * @props className (optional): 'mt-20p mb-5p' (String)
 * @props label: 'Border Settings' (String)
 * @props border: { width, style, color, side, radius } (Object)
 * @props onChange: (Function)
 * @props defaults (optional): { width, style, color, side, radius } (Object)
 * @return Border Properties (Object)
 */

import Title from './Title';
import BColor from './BColor';
import options from '../Const/options';
const { borderStyles, pxUnit, perUnit, emUnit, remUnit, sides } = options;

const BorderControl = props => {
    const { className, label = __('Border Settings', 'b-blocks'), border, onChange, defaults = {} } = props;

    const defaultVal = { width: '0px', style: 'solid', color: '#0000', side: 'all', radius: '0px' }

    const getDefault = property => defaults?.[property] || defaultVal[property];
    const setDefault = property => onChange({ ...border, [property]: getDefault(property) });

    const getValue = property => border?.[property] || getDefault(property);
    const setValue = (property, val) => onChange({ ...border, [property]: val });
    const resetValue = property => <Button icon='image-rotate' className='bBlocksResetVal' onClick={() => setDefault(property)} />

    // Add styles and google font to border
    const borderSideCheck = side => {
        const bSide = border?.side?.toLowerCase();
        return bSide?.includes('all') || bSide?.includes(side);
    }
    useEffect(() => {
        const widthCondition = border?.width === '0px' || !border?.width;
        const borderCSS = `${border?.width} ${border?.style} ${border?.color}`;

        const allStyles = `${widthCondition ? '' : borderSideCheck('top') ? `border-top: ${borderCSS};` : ''}
        ${widthCondition ? '' : borderSideCheck('right') ? `border-right: ${borderCSS};` : ''}
        ${widthCondition ? '' : borderSideCheck('bottom') ? `border-bottom: ${borderCSS};` : ''}
        ${widthCondition ? '' : borderSideCheck('left') ? `border-left: ${borderCSS};` : ''}
        ${border?.radius === '0px' || border?.radius === '0%' || !border?.radius ? '' : `border-radius: ${border?.radius};`}`

        const initialObj = { width: getValue('width'), style: getValue('style'), color: getValue('color'), side: getValue('side'), radius: getValue('radius') }

        onChange({ ...border, ...initialObj, ['styles']: allStyles.replace(/\s+/g, ' ').trim() });
    }, [border?.width, border?.style, border?.color, border?.side, border?.radius]);

    return <PanelRow className={`bBlocksDropdown ${className}`}>
        <Title mt='5px'>{label}</Title>

        <Dropdown className='bBlocksDropdownContainer' contentClassName='bBlocksDropdownPopover' position='bottom right'
            renderToggle={({ isOpen, onToggle }) => <Button icon='edit' onClick={onToggle} aria-expanded={isOpen} />}
            renderContent={() => <>
                {/* Width */}
                <PanelRow>
                    <UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={getValue('width')} onChange={val => setValue('width', val)} units={[pxUnit, emUnit]} />
                    {border?.width && border?.width !== getDefault('width') && resetValue('width')}
                </PanelRow>

                {/* Style */}
                <PanelRow>
                    <Title mt='0' mb='0'>{__('Style:', 'b-blocks')}</Title>
                    <SelectControl value={getValue('style')} onChange={val => setValue('style', val)} options={borderStyles} />
                    {border?.style && border?.style !== getDefault('style') && resetValue('style')}
                </PanelRow>

                {/* Color */}
                <BColor label={__('Color:', 'b-blocks')} value={getValue('color')} onChange={val => setValue('color', val)} defaultColor={getDefault('color')} />

                {/* Side */}
                <PanelRow>
                    <Title mt='0' mb='0'>{__('Sides:', 'b-blocks')}</Title>
                    <SelectControl value={getValue('side')} onChange={val => setValue('side', val)} options={sides} />
                    {border?.side && border?.side !== getDefault('side') && resetValue('side')}
                </PanelRow>

                {/* Radius */}
                <PanelRow>
                    <UnitControl label={__('Radius:', 'b-blocks')} labelPosition='left' value={getValue('radius')} onChange={val => setValue('radius', val)} units={[pxUnit, perUnit, emUnit, remUnit]} />
                    {border?.radius && border?.radius !== getDefault('radius') && resetValue('radius')}
                </PanelRow>
            </>}
        />
    </PanelRow>;
};
export default BorderControl;
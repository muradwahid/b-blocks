import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Dropdown, PanelRow, __experimentalUnitControl as UnitControl, Button, ToggleControl } from '@wordpress/components';

/**
 * @props className (optional): 'mt-20p mb-5p' (String)
 * @props label: 'Box Shadow' (String)
 * @props shadow: { hOffset, vOffset, blur, spreed, color, isInset } (Object)
 * @props onChange: (Function)
 * @props defaults (optional): { hOffset, vOffset, blur, spreed, color, isInset } (Object)
 * @return Shadow Properties (Object)
 */

import Title from './Title';
import BColor from './BColor';
import BtnGroup from './BtnGroup';
import options from '../Const/options';
const { pxUnit, emUnit, remUnit } = options;
const shadowTypes = [
    { label: 'Box', value: 'box', icon: 'Box' },
    { label: 'Text', value: 'text', icon: 'Text' }
];

const BorderControl = props => {
    const { className, label = __('Shadow', 'b-blocks'), shadow, onChange, defaults = {} } = props;

    const defaultVal = { type: 'box', hOffset: '0px', vOffset: '0px', blur: '0px', spreed: '0px', color: '#7090b0', isInset: false }

    const getDefault = property => defaults?.[property] || defaultVal[property];
    const setDefault = property => onChange({ ...shadow, [property]: getDefault(property) });

    const getValue = property => shadow?.[property] || getDefault(property);
    const setValue = (property, val) => onChange({ ...shadow, [property]: val });
    const resetValue = property => <Button icon='image-rotate' className='bBlocksResetVal' onClick={() => setDefault(property)} />

    // Add styles
    useEffect(() => {
        const isInset = shadow?.isInset ? 'inset' : '';

        const offsetBlur = `${getValue('hOffset')} ${getValue('vOffset')} ${getValue('blur')}`;

        const allStyles = 'text' === shadow?.type ? `${offsetBlur} ${getValue('color')}` : `${offsetBlur} ${getValue('spreed')} ${getValue('color')} ${isInset}`;

        const initialObj = { type: getValue('type'), hOffset: getValue('hOffset'), vOffset: getValue('vOffset'), blur: getValue('blur'), spreed: getValue('spreed'), color: getValue('color'), isInset: getValue('isInset') }

        onChange({ ...shadow, ...initialObj, ['styles']: allStyles.replace(/\s+/g, ' ').trim() });
    }, [shadow?.type, shadow?.hOffset, shadow?.vOffset, shadow?.blur, shadow?.spreed, shadow?.color, shadow?.isInset]);

    return <PanelRow className={`bBlocksDropdown ${className}`}>
        <Title mt='5px'>{label}</Title>

        <Dropdown className='bBlocksDropdownContainer' contentClassName='bBlocksDropdownPopover' position='bottom right'
            renderToggle={({ isOpen, onToggle }) => <Button icon='edit' onClick={onToggle} aria-expanded={isOpen} />}
            renderContent={() => <>
                {/* Type */}
                <PanelRow>
                    <Title mt='5px'>{__('Type:', 'b-blocks')}</Title>
                    <BtnGroup options={shadowTypes} myValue={getValue('type')} setState={val => setValue('type', val)} />
                </PanelRow>

                {/* Horizontal Offset */}
                <PanelRow>
                    <UnitControl label={__('Horizontal Offset:', 'b-blocks')} labelPosition='left' value={getValue('hOffset')} onChange={val => setValue('hOffset', val)} units={[pxUnit, emUnit, remUnit]} />
                    {shadow?.hOffset && shadow?.hOffset !== getDefault('hOffset') && resetValue('hOffset')}
                </PanelRow>

                {/* Vertical Offset */}
                <PanelRow>
                    <UnitControl label={__('Vertical Offset:', 'b-blocks')} labelPosition='left' value={getValue('vOffset')} onChange={val => setValue('vOffset', val)} units={[pxUnit, emUnit, remUnit]} />
                    {shadow?.vOffset && shadow?.vOffset !== getDefault('vOffset') && resetValue('vOffset')}
                </PanelRow>

                {/* Blur */}
                <PanelRow>
                    <UnitControl label={__('Blur:', 'b-blocks')} labelPosition='left' value={getValue('blur')} onChange={val => setValue('blur', val)} units={[pxUnit, emUnit, remUnit]} />
                    {shadow?.blur && shadow?.blur !== getDefault('blur') && resetValue('blur')}
                </PanelRow>

                {/* Spreed */}
                {'box' === shadow?.type && <PanelRow>
                    <UnitControl label={__('Spreed:', 'b-blocks')} labelPosition='left' value={getValue('spreed')} onChange={val => setValue('spreed', val)} units={[pxUnit, emUnit, remUnit]} />
                    {shadow?.spreed && shadow?.spreed !== getDefault('spreed') && resetValue('spreed')}
                </PanelRow>}

                {/* Color */}
                <BColor className='mt-20p' label={__('Color:', 'b-blocks')} value={getValue('color')} onChange={val => setValue('color', val)} defaultColor={getDefault('color')} />

                {/* Is Inset */}
                {'box' === shadow?.type && <ToggleControl className='mt-20p' label={__('Shadow Inset?', 'b-blocks')} checked={getValue('isInset')} onChange={val => setValue('isInset', val)} />}
            </>}
        />
    </PanelRow>;
};
export default BorderControl;
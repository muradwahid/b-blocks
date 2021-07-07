import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Dropdown, ColorPicker, Button, PanelRow } from '@wordpress/components';

import './BColor.scss';

/**
 * @props className (optional): 'mt-20p mb-5p' (String)
 * @props label: 'Color' (String)
 * @props value: value of color (String)
 * @props defaultColor: default color for reset color
 * @props onChange: (Function)
 * @props disableAlpha: Disable alpha of color (Boolean)
 * @return color (String)
 */

import Title from './Title';

const BColor = props => {
    const { className, label = __('Color:', 'b-blocks'), value, defaultColor, onChange, disableAlpha } = props;
    const [state, setState] = useState(value);

    return <PanelRow className={className}>
        <Title mt='5px'>{label}</Title>

        <Dropdown className='bColor' position="top center" renderToggle={({ isOpen, onToggle }) => {
            return <>
                <div className="bColorButtonContainer">
                    <button className="bColorButton" isPrimary onClick={onToggle} aria-expanded={isOpen} style={{ backgroundColor: value ? value : 'transparent' }} />
                </div>
                {defaultColor && defaultColor != state && (
                    <Button className='bBlocksResetVal' icon="image-rotate" label={__('Reset', 'b-blocks')} onClick={() => {
                        onChange(defaultColor);
                        setState(defaultColor);
                    }} />
                )}
            </>;
        }}
            renderContent={() => (
                <ColorPicker color={value || ""} disableAlpha={disableAlpha ? disableAlpha : false} onChangeComplete={(c) => {
                    onChange(`rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`);
                    setState(c.hex);
                }} />
            )}
        />
    </PanelRow>;
};
export default BColor;
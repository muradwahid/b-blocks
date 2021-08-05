import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { PanelRow, RangeControl, Tooltip } from '@wordpress/components';

/**
 * @props className (optional): 'mt-20p' (String)
 * @props icon (required): { class, fontSize, color } (Object)
 * @props onChange (required): (Function)
 * @props defaults (optional): { class, fontSize, color } (Object)
 */

import './IconControl.scss';

import Title from './Title';
import BColor from './BColor';

import iconLists from './Helper/iconLists';

const IconControl = props => {
    const { className, icon, onChange, defaults = {} } = props;

    const defaultVal = { class: '', name: '', fontSize: 16, color: '#4527a4' }

    const getDefault = property => defaults?.[property] || defaultVal[property];

    const getValue = property => icon?.[property] || getDefault(property);
    const setValue = (property, val) => onChange({ ...icon, [property]: val });

    // Font family searching
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const searchIcons = iconLists.filter(({ name }) => name.replace(/-/g, ' ').toLowerCase().includes(query.toLowerCase()));

    useEffect(() => {
        const allStyles = `${undefined == icon?.fontSize ? '' : `font-size: ${icon?.fontSize}px;`}
        ${'' === icon?.color ? '' : `color: ${icon?.color}`}`;

        // Google font link
        const initObj = { class: getValue('class'), name: getValue('name'), fontSize: getValue('fontSize'), color: getValue('color') }

        onChange({ ...icon, styles: allStyles.replace(/\s+/g, ' ').trim(), ...initObj });
    }, [icon?.class, icon?.fontSize, icon?.color]);

    return <>
        {/* Select Icon */}
        <PanelRow className={`bTempIconTitle ${className}`}>
            <Title mt='0' mb='0'>{__('Select Icon:', 'b-temp')}</Title>
            <i className={icon?.class}></i>
        </PanelRow>
        <div className='bTempIconSelect'>
            <input type='search' value={query} onClick={() => setIsSearching(!isSearching)} placeholder={getValue('name')?.replace(/-/g, ' ') || 'Search Icon'} onChange={e => setQuery(e.target.value)} />

            <span className={`dashicon dashicons dashicons-${isSearching ? 'arrow-up' : 'arrow-down'}`} onClick={() => setIsSearching(!isSearching)}></span>

            {isSearching && <div className='bTempIconLists'>
                {searchIcons?.map(item => <Tooltip key={item?.class} text={item?.name?.replace(/-/g, ' ')} position='top'><i onClick={() => {
                    onChange({ ...icon, ['class']: item?.class, ['name']: item?.name });
                    setQuery('');
                    setIsSearching(false);
                }} className={item?.class}></i></Tooltip>)}
            </div>}
        </div>

        {/* Icon Size */}
        <Title>{__('Icon Size:', 'b-temp')}</Title>
        <RangeControl value={getValue('fontSize')} onChange={val => setValue('fontSize', val)} min={0} max={80} step={1} allowReset={true} resetFallbackValue={getDefault('fontSize')} initialPosition={getDefault('fontSize')} />

        <BColor className='mt-20p' label={__('Icon Color:', 'b-temp')} value={getValue('color')} onChange={val => setValue('color', val)} defaultColor={getDefault('color')} />
    </>;
};
export default IconControl;
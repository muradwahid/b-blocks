import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button, Dropdown, PanelRow, SelectControl, __experimentalUnitControl as UnitControl, RangeControl } from '@wordpress/components';

/**
 * @props className (optional): 'mt-20p' (String)
 * @props label (optional): 'Typography' (String)
 * @props typography (required): {fontFamily, fontWeight, fontSize, fontStyle, textTransform, textDecoration, lineHeight, letterSpace} (Object)
 * @props onChange (required): (Function)
 * @props defaults (optional): { fontFamily, fontWeight, fontSize, fontStyle, textTransform, textDecoration, lineHeight, letterSpace } (Object)
 */

import './Typography.scss';
import Title from './Title';
import BtnGroup from './BtnGroup';
import options from '../Const/options';
const { fontStyles, textTransforms, textDecorations, pxUnit, perUnit, emUnit, remUnit } = options;

import fontLists from './Helper/fontLists';

const Typography = props => {
    const { className, label = __('Typography:', 'b-blocks'), typography, onChange, defaults = {} } = props;

    const defaultVal = { fontFamily: 'Default', fontWeight: 400, fontSize: 15, fontStyle: 'normal', textTransform: 'none', textDecoration: 'auto', lineHeight: '150%', letterSpace: '0px' }

    const getDefault = property => defaults?.[property] || defaultVal[property];
    const setDefault = property => onChange({ ...typography, [property]: getDefault(property) });

    const getValue = property => typography?.[property] || getDefault(property);
    const setValue = (property, val) => onChange({ ...typography, [property]: val });
    const resetValue = property => typography?.[property] && typography?.[property] !== getDefault(property) && <Button icon='image-rotate' className='bBlocksResetVal' onClick={() => setDefault(property)} />

    // Font Family Scripts
    // const newFontLists = [{ family: 'Default', variants: ['regular'], category: 'default' }]
    // fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBwIX97bVWr3-6AIUvGkcNnmFgirefZ6Sw`)
    //     .then(res => res.json())
    //     .then(data => {
    //         const fonts = data.items;
    //         for (let i = 0; i < fonts.length; i++) {
    //             newFontLists.push({ family: fonts[i].family, variants: fonts[i].variants.indexOf("regular") === -1 ? fonts[i].variants.unshift('regular') : fonts[i].variants, category: fonts[i].category });
    //         }
    //     });

    // Font family searching
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const searchFonts = fontLists.filter(({ family }) => family.toLowerCase().includes(query.toLowerCase()));

    // Get Font weights
    const fontWeights = () => {
        const currentFontWeights = fontLists.filter(font => font.family === getValue('fontFamily'))[0]?.variants;
        let weights = []
        currentFontWeights?.map(weight => weights?.push({ label: weight, value: weight }));
        return 0 === weights.length ? [400] : weights;
    }

    // Add styles and google font to typography
    const generateCss = (value, cssProperty, def) => {
        return undefined == value ? '' : value === def ? '' : `${cssProperty}: ${value};`;
    }

    useEffect(() => {
        const allStyles = `${undefined == getValue('fontFamily') ? '' : getValue('fontFamily') === defaultVal.fontFamily ? '' : `font-family: ${getValue('fontFamily')}, ${getValue('fontCategory')};`}
        ${generateCss(getValue('fontWeight'), 'font-weight', defaultVal.fontWeight)}
        ${undefined == getValue('fontSize') ? '' : getValue('fontSize') === defaultVal.fontSize ? '' : `font-size: ${getValue('fontSize')}px;`}
        ${generateCss(getValue('fontStyle'), 'font-style', defaultVal.fontStyle)}
        ${generateCss(getValue('textTransform'), 'text-transform', defaultVal.textTransform)}
        ${generateCss(getValue('textDecoration'), 'text-decoration', defaultVal.textDecoration)}
        ${generateCss(getValue('lineHeight'), 'line-height', defaultVal.lineHeight)}
        ${generateCss(getValue('letterSpace'), 'letter-spacing', defaultVal.letterSpace)}`;

        // Google font link
        const linkQuery = 400 === getValue('fontVariant') ? '' : '400i' === getValue('fontVariant') ? ':ital@1' : getValue('fontVariant')?.includes('00i') ? `: ital, wght@1, ${getValue('fontVariant')?.replace('00i', '00')} ` : `: wght@${getValue('fontVariant')} `;

        const link = 'Default' === getValue('fontFamily') || undefined === getValue('fontFamily') ? 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap' : `https://fonts.googleapis.com/css2?family=${getValue('fontFamily')?.split(' ').join('+')}${linkQuery.replace(/ /g, '')}&display=swap`;

        onChange({ ...typography, ['styles']: allStyles.replace(/\s+/g, ' ').trim(), ['googleFontLink']: link });
    }, [typography?.fontFamily, typography?.fontWeight, typography?.fontSize, typography?.fontStyle, typography?.textTransform, typography?.textDecoration, typography?.lineHeight, typography?.letterSpace]);

    return <PanelRow className={`bBlocksDropdown ${className}`}>
        <Title mt='0' mb='0'>{label}</Title>

        <Dropdown className='bBlocksDropdownContainer' contentClassName='bBlocksDropdownPopover' position='bottom right'
            renderToggle={({ isOpen, onToggle }) => <Button icon='admin-customizer' onClick={onToggle} aria-expanded={isOpen} />}
            renderContent={() => <>
                {/* Font Family & Weight */}
                <PanelRow className='bBlocksTypoFontTitle'>
                    <Title mt='0' mb='0'>{__('Font Family:', 'b-blocks')}</Title>
                    <Title mt='0' mb='0'>{__('Weight:', 'b-blocks')}</Title>
                </PanelRow>
                <PanelRow className='bBlocksTypoFont'>
                    <div className='bBlocksTypoFontSelect'>
                        <input type='search' value={query} onClick={() => setIsSearching(!isSearching)} placeholder={getValue('fontFamily') || 'Search Font'} onChange={e => setQuery(e.target.value)} />

                        <span className={`dashicon dashicons dashicons-${isSearching ? 'arrow-up' : 'arrow-down'} `} onClick={() => setIsSearching(!isSearching)}></span>

                        {isSearching && <ul className='bBlocksTypoFontLists'>
                            {searchFonts?.map(font => <li key={font?.family} onClick={() => {
                                onChange({ ...typography, ['fontFamily']: font?.family, ['fontCategory']: font?.category, ['fontWeight']: 400, ['fontVariant']: 400 });
                                setQuery('');
                                setIsSearching(false);
                            }}>{font?.family}</li>)}
                        </ul>}
                    </div>

                    <SelectControl value={getValue('fontVariant')} onChange={val => { onChange({ ...typography, ['fontWeight']: parseInt(val?.replace('00i', '00')), ['fontVariant']: val }) }} options={fontWeights()} />
                </PanelRow>

                {/* Font Size */}
                <Title>{__('Font Size:', 'b-blocks')}</Title>
                <RangeControl value={getValue('fontSize')} onChange={val => setValue('fontSize', val)} min={0} max={80} step={1} allowReset={true} resetFallbackValue={defaults?.fontSize || defaultVal.fontSize} initialPosition={defaults?.fontSize || defaultVal.fontSize} />

                {/* Font Style */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='0' mb='0'>{__('Font Style:', 'b-blocks')}</Title>
                    <SelectControl value={getValue('fontStyle')} onChange={val => setValue('fontStyle', val)} options={fontStyles} />
                    {resetValue('fontStyle')}
                </PanelRow>

                {/* Text Transform */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Text Transform:', 'b-blocks')}</Title>
                    <BtnGroup options={textTransforms} myValue={getValue('textTransform')} setState={val => setValue('textTransform', val)} />
                </PanelRow>

                {/* Text Decoration */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='0' mb='0'>{__('Text Decoration:', 'b-blocks')}</Title>
                    <SelectControl value={getValue('textDecoration')} onChange={val => setValue('textDecoration', val)} options={textDecorations} />
                    {resetValue('textDecoration')}
                </PanelRow>

                {/* Line Height */}
                <PanelRow className='mt-20p mb-5p'>
                    <UnitControl label={__('Line Height:', 'b-blocks')} labelPosition='left' value={getValue('lineHeight')} onChange={val => setValue('lineHeight', val)} units={[pxUnit, perUnit, emUnit, remUnit]} />
                    {resetValue('lineHeight')}
                </PanelRow>

                {/* Letter Spacing */}
                <PanelRow className='mt-20p mb-5p'>
                    <UnitControl label={__('Letter Spacing:', 'b-blocks')} labelPosition='left' value={getValue('letterSpace')} onChange={val => setValue('letterSpace', val)} units={[pxUnit, emUnit, remUnit]} />
                    {resetValue('letterSpace')}
                </PanelRow>
            </>}
        />
    </PanelRow>;
};
export default Typography;
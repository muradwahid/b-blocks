import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button, Dropdown, PanelRow, SelectControl, __experimentalUnitControl as UnitControl, RangeControl } from '@wordpress/components';

/**
 * @props className (optional): 'mt-20p mb-5p' (String)
 * @props label (optional): 'Typography' (String)
 * @props typography (required): {fontFamily, fontWeight, fontSize, fontStyle, textTransform, textDecoration, lineHeight, letterSpace} (Object)
 * @props onChange (required): (Function)
 * @props defaults (optional): { fontFamily, fontWeight, fontSize, fontStyle, textTransform, textDecoration, lineHeight, letterSpace } (Object)
 */

import './Typography.scss';
import Title from './Title';
import BtnGroup from './BtnGroup';
import options from '../Const/options';
const { fontStyles, textTransforms, textDecorations, allUnits, pxEmRemUnits } = options;

import fontLists from './Helper/fontLists';

const Typography = props => {
    const { className, label, typography, onChange, defaults } = props;

    const defaultVal = { fontFamily: 'Default', fontWeight: 400, fontSize: 15, fontStyle: 'normal', textTransform: 'none', textDecoration: 'auto', lineHeight: '150%', letterSpace: '0px' }

    const setDefault = property => onChange({ ...typography, [property]: defaults[property] || defaultVal[property] });

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
    const searchFonts = fontLists.filter(({ family }) => {
        const fontName = family.toLowerCase();
        const newQuery = query.toLowerCase();
        return !fontName.search(newQuery);
    });

    // Get Font weights
    const fontWeights = () => {
        const currentFontWeights = fontLists.filter(font => font.family === typography?.fontFamily)[0]?.variants;
        let weights = []
        currentFontWeights?.map(weight => weights?.push({ label: weight, value: weight }));
        return 0 === weights.length ? [400] : weights;
    }

    // Add styles and google font to typography
    const generateCss = (value, cssProperty, def) => {
        return undefined == value ? '' : value === def ? '' : `${cssProperty}: ${value};`;
    }

    useEffect(() => {
        const allStyles = `${undefined == typography?.fontFamily ? '' : typography?.fontFamily === defaultVal.fontFamily ? '' : `font-family: ${typography?.fontFamily}, ${typography?.fontCategory};`}
        ${generateCss(typography?.fontWeight, 'font-weight', defaultVal.fontWeight)}
        ${undefined == typography?.fontSize ? '' : typography?.fontSize === defaultVal.fontSize ? '' : `font-size: ${typography?.fontSize}px;`}
        ${generateCss(typography?.fontStyle, 'font-style', defaultVal.fontStyle)}
        ${generateCss(typography?.textTransform, 'text-transform', defaultVal.textTransform)}
        ${generateCss(typography?.textDecoration, 'text-decoration', defaultVal.textDecoration)}
        ${generateCss(typography?.lineHeight, 'line-height', defaultVal.lineHeight)}
        ${generateCss(typography?.letterSpace, 'letter-spacing', defaultVal.letterSpace)}`;

        // Google font link
        const linkQuery = 400 === typography?.fontVariant ? '' : '400i' === typography?.fontVariant ? ':ital@1' : typography?.fontVariant?.includes('00i') ? `: ital, wght@1, ${typography?.fontVariant?.replace('00i', '00')} ` : `: wght@${typography?.fontVariant} `;

        const link = 'Default' === typography?.fontFamily || undefined === typography?.fontFamily ? '' : `https://fonts.googleapis.com/css2?family=${typography?.fontFamily?.split(' ').join('+')}${linkQuery}&display=swap`;

        onChange({ ...typography, ['styles']: allStyles.replace(/\s+/g, ' ').trim(), ['googleFontLink']: link });
    }, [typography?.fontFamily, typography?.fontWeight, typography?.fontSize, typography?.fontStyle, typography?.textTransform, typography?.textDecoration, typography?.lineHeight, typography?.letterSpace]);

    return <PanelRow className={`bBlocksTypo ${className}`}>
        <Title mt='5px'>{label || __('Typography:', 'b-blocks')}</Title>

        <Dropdown className='bBlocksTypoContainer' contentClassName='bBlocksTypoPopover' position='bottom right'
            renderToggle={({ isOpen, onToggle }) => <Button icon='admin-customizer' onClick={onToggle} aria-expanded={isOpen} />}
            renderContent={() => <>
                {/* Font Family & Weight */}
                <PanelRow className='bBlocksTypoFontTitle'>
                    <Title mt='0' mb='0'>{__('Font Family:', 'b-blocks')}</Title>
                    <Title mt='0' mb='0'>{__('Weight:', 'b-blocks')}</Title>
                </PanelRow>
                <PanelRow className='bBlocksTypoFont'>
                    <div className='bBlocksTypoFontSelect'>
                        <input type='search' onClick={() => setIsSearching(!isSearching)} placeholder={typography?.fontFamily || defaults?.fontFamily || defaultVal.fontFamily} onChange={e => setQuery(e.target.value)} />

                        <span className={`dashicon dashicons dashicons-${isSearching ? 'arrow-up' : 'arrow-down'} `} onClick={() => setIsSearching(!isSearching)}></span>

                        {isSearching && <ul className='bBlocksTypoFontLists'>
                            {searchFonts?.map(font => <li key={font?.family} onClick={() => {
                                onChange({ ...typography, ['fontFamily']: font?.family, ['fontCategory']: font?.category, ['fontWeight']: 400, ['fontVariant']: 400 });
                                setQuery('');
                                setIsSearching(false);
                            }}>{font?.family}</li>)}
                        </ul>}
                    </div>

                    <SelectControl value={typography?.fontVariant} onChange={val => { onChange({ ...typography, ['fontWeight']: parseInt(val?.replace('00i', '00')), ['fontVariant']: val }) }} options={fontWeights()} />
                </PanelRow>

                {/* Font Size */}
                <Title>{__('Font Size:', 'b-blocks')}</Title>
                <RangeControl value={typography?.fontSize || defaults?.fontSize || defaultVal.fontSize} onChange={val => onChange({ ...typography, ['fontSize']: val })} min={0} max={80} step={1} allowReset={true} resetFallbackValue={defaults?.fontSize || defaultVal.fontSize} initialPosition={defaults?.fontSize || defaultVal.fontSize} />

                {/* Font Style */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='0' mb='0'>{__('Font Style:', 'b-blocks')}</Title>
                    <SelectControl value={typography?.fontStyle || defaults?.fontStyle || defaultVal.fontStyle} onChange={val => onChange({ ...typography, ['fontStyle']: val })} options={fontStyles} />
                    {typography?.fontStyle && typography?.fontStyle !== (defaults?.fontStyle || defaultVal.fontStyle) && <Button icon='image-rotate' className='bBlocksResetVal' onClick={() => setDefault('fontStyle')} />}
                </PanelRow>

                {/* Text Transform */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Text Transform:', 'b-blocks')}</Title>
                    <BtnGroup options={textTransforms} myValue={typography?.textTransform || defaults?.textTransform || defaultVal.textTransform} setState={val => onChange({ ...typography, ['textTransform']: val })} />
                </PanelRow>

                {/* Text Decoration */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='0' mb='0'>{__('Text Decoration:', 'b-blocks')}</Title>
                    <SelectControl value={typography?.textDecoration || defaults?.textDecoration || defaultVal.textDecoration} onChange={val => onChange({ ...typography, ['textDecoration']: val })} options={textDecorations} />
                    {typography?.textDecoration && typography?.textDecoration !== (defaults?.textDecoration || defaultVal.textDecoration) && <Button icon='image-rotate' className='bBlocksResetVal' onClick={() => setDefault('textDecoration')} />}
                </PanelRow>

                {/* Line Height */}
                <PanelRow className='mt-20p mb-5p'>
                    <UnitControl label={__('Line Height:', 'b-blocks')} labelPosition='left' value={typography?.lineHeight || defaults?.lineHeight || defaultVal.lineHeight} onChange={val => onChange({ ...typography, ['lineHeight']: val })} units={allUnits} />
                    {typography?.lineHeight && typography?.lineHeight !== (defaults?.lineHeight || defaultVal.lineHeight) && <Button icon='image-rotate' className='bBlocksResetVal' onClick={() => setDefault('lineHeight')} />}
                </PanelRow>

                {/* Letter Spacing */}
                <PanelRow className='mt-20p mb-5p'>
                    <UnitControl label={__('Letter Spacing:', 'b-blocks')} labelPosition='left' value={typography?.letterSpace || defaults?.letterSpace || defaultVal.letterSpace} onChange={val => onChange({ ...typography, ['letterSpace']: val })} units={pxEmRemUnits} />
                    {typography?.letterSpace && typography?.letterSpace !== (defaults?.letterSpace || defaultVal.letterSpace) && <Button icon='image-rotate' className='bBlocksResetVal' onClick={() => setDefault('letterSpace')} />}
                </PanelRow>
            </>}
        />
    </PanelRow>;
};
export default Typography;
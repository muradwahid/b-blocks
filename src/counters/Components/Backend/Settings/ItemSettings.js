import { __ } from '@wordpress/i18n';
import { TextControl, PanelRow, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { Background, ColorControl, IconControl, Label } from '../../../../../../bpl-tools/Components';
import { updateData } from '../../../../../../bpl-tools/utils/functions';

const ItemSettings = (props) => {
    const { attributes, setAttributes, index } = props;
    const { counters } = attributes;
    const counter = counters[index];
    const { background: singleBG, icon, number, label } = counter;

    const updateCounter = (key, value, ...keys) => {
        setAttributes({ counters: updateData(counters, value, index, key, ...keys) });
    }

    return <>
        <Background label={__('Background:', 'b-blocks')} value={singleBG} onChange={val => updateCounter('background', val)} defaults={{ color: '#0000' }} />

        <IconControl label={__('Icon:', 'b-blocks')} value={icon} onChange={val => updateCounter('icon', val)} defaults={{ class: 'fa fa-award', fontSize: 50, color: '#fff' }} isSize={false} />

        <NumberControl label={__('Start Number:', 'b-blocks')} labelPosition='left' className='mt20' value={number.start} onChange={val => updateCounter('number', parseFloat(val), 'start')} />

        <NumberControl label={__('End Number:', 'b-blocks')} labelPosition='left' className='mt20' value={number.end} onChange={val => updateCounter('number', parseFloat(val), 'end')} />

        <PanelRow>
            <Label className=''>{__('Prefix:', 'b-blocks')}</Label>
            <TextControl value={number.prefix} onChange={val => updateCounter('number', val, 'prefix')} />
        </PanelRow>

        <PanelRow>
            <Label className=''>{__('Suffix:', 'b-blocks')}</Label>
            <TextControl value={number.suffix} onChange={val => updateCounter('number', val, 'suffix')} />
        </PanelRow>

        <ColorControl label={__('Number Color:', 'b-blocks')} value={number.color} onChange={val => updateCounter('number', val, 'color')} defaultColor='#fff' />

        <ColorControl label={__('Label Color:', 'b-blocks')} value={label.color} onChange={val => updateCounter('label', val, 'color')} defaultColor='#fff' />
    </>
};

export default ItemSettings;
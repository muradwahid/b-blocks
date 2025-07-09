import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { MediaArea } from '../../../../../../../bpl-tools/Components';
import { updateData } from '../../../../../../../bpl-tools/utils/functions';

const ItemSettings = ({ attributes, setAttributes, index }) => {
    const { logo } = attributes;
    const item = logo[index];
    const updateObj = (object, val, ...props) => {
        setAttributes({ [object]: updateData(attributes[object], val, ...props) });
    }
    return <>
        <MediaArea width="100%" height="100%" label={__('Choose Logo', 'b-blocks')} value={item} onChange={value => updateObj('logo', value, index)} />
        <TextControl className='mt10' label={__('Alt', 'b-blocks')} value={item?.alt} onChange={value => updateObj('logo', value, index, 'alt')} />
        <TextControl label={__('Caption', 'b-blocks')} value={item?.caption} onChange={value => updateObj('logo', value, index, 'caption')} />
    </>
};

export default ItemSettings;
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { ItemsPanel } from '../../../../../../../bpl-tools/Components';
import ItemSettings from './ItemSettings';

const Logo = ({ attributes, setAttributes, activeIndex, setActiveIndex }) => {
    const newItem = {
        url: '',
        caption: '',
        alt: ''
    };

    return <PanelBody className='bPlPanelBody' title={__('Logo', 'b-blocks')} initialOpen={true}>
        <ItemsPanel {...{ attributes, setAttributes, activeIndex, setActiveIndex }} newItem={newItem} design='sortable' itemLabel='Logo' arrKey='logo' ItemSettings={ItemSettings} />
    </PanelBody>
};

export default Logo;
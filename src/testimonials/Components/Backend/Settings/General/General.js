import { PanelBody } from '@wordpress/components'
import { __ } from '@wordpress/i18n';
import { ItemsPanel } from '../../../../../../../bpl-tools/Components';
import { newItem } from '../../../../utils/options';
import ItemSettings from './ItemSettings';

const General = ({ attributes, setAttributes, setActiveIndex, activeIndex }) => {
    const { items } = attributes;
    return <>
        <PanelBody title={__('Testimonials', 'b-testimonials-block')}>
            <ItemsPanel value={items} onChange={setAttributes} attributes={attributes} setAttributes={setAttributes} arrKey="items" newItem={newItem} ItemSettings={ItemSettings} itemLabel="Item" activeIndex={activeIndex} setActiveIndex={setActiveIndex} design="sortable" title="name" />
        </PanelBody>
    </>
}

export default General

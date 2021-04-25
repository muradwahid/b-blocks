import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';

// Icon
import icons from '../../Const/icons';

// Variables
import Title from '../../GutenComp/Title';

// Custom Attributes
const attributes = {
    columns: { type: 'number', default: 3 },
    columnGap: { type: 'number', default: 40 },
    rowGap: { type: 'number', default: 30 },
}

registerBlockType('b-blocks/price-lists', {
    // Build In attributes
    title: __('Price Lists', 'b-blocks'),
    description: __('Display Price lists section', 'b-blocks'),
    icon: icons.priceList,
    category: 'bBlocks',
    keywords: [__('price', 'b-blocks'), __('lists', 'b-blocks'), __('price lists section', 'b-blocks')],
    supports: {
        align: ['wide', 'full'],
        html: false
    },

    attributes,

    edit: props => {
        const { className, attributes: { columns, columnGap, rowGap }, setAttributes } = props;

        return <>
            <InspectorControls>
                <PanelBody title={__('Layout Settings', 'b-blocks')}>
                    {/* Columns */}
                    <Title mt="0">{__('Columns:', 'b-blocks')}</Title>
                    <RangeControl value={columns} onChange={val => setAttributes({ columns: val })} min={0} max={6} step={1} />

                    {/* Column Gap */}
                    <Title>{__('Column Gap:', 'b-blocks')}</Title>
                    <RangeControl value={columnGap} onChange={cng => setAttributes({ columnGap: cng })} min={0} max={100} step={1} />

                    {/* Row Gap */}
                    <Title>{__('Row Gap', 'b-blocks')}</Title>
                    <RangeControl value={rowGap} onChange={cng => setAttributes({ rowGap: cng })} min={0} max={100} step={1} />
                </PanelBody>
            </InspectorControls>


            <div className={`${className} columns-${columns} cGap-${columnGap} rGap-${rowGap}`}>
                <InnerBlocks allowedBlocks={['b-blocks/price-list']} template={[['b-blocks/price-list'], ['b-blocks/price-list'], ['b-blocks/price-list']]} />
            </div>
        </>
    },

    save: props => {
        const { columns, columnGap, rowGap } = props.attributes;

        return <div className={`columns-${columns} cGap-${columnGap} rGap-${rowGap}`}>
            <InnerBlocks.Content />
        </div>;
    }
});
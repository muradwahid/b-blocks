import { registerBlockType } from '@wordpress/blocks';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl } from '@wordpress/components';

// Icon
import icons from '../../Const/icons';

// Variables
import Title from '../../GutenComp/Title';
import BDevice from '../../GutenComp/BDevice';

// Custom Attributes
const attributes = {
    columns: {
        type: 'object', default: {
            desktop: 3,
            tablet: 2,
            mobile: 1
        }
    },
    columnGap: { type: 'number', default: 40 },
    rowGap: { type: 'number', default: 30 }
}

registerBlockType('b-blocks/team-members', {
    // Build In attributes
    title: __('Team Members', 'b-blocks'),
    description: __('Display Team members section', 'b-blocks'),
    icon: icons.teamMembers,
    category: 'bBlocks',
    keywords: [__('team', 'b-blocks'), __('members', 'b-blocks'), __('team members section', 'b-blocks')],
    supports: {
        align: ['wide', 'full'],
        html: false
    },

    attributes,

    edit: props => {
        const { className, attributes: { columns, columnGap, rowGap }, setAttributes } = props;

        const [device, setDevice] = useState('desktop');

        return <>
            <InspectorControls>
                <PanelBody title={__('Layout Settings', 'b-blocks')}>
                    {/* Columns */}
                    <PanelRow>
                        <Title mt='0'>Columns:</Title>
                        <BDevice device={device} onChange={val => setDevice(val)} />
                    </PanelRow>
                    <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} />

                    {/* Column Gap */}
                    <Title>{__('Column Gap:', 'b-blocks')}</Title>
                    <RangeControl value={columnGap} onChange={cng => setAttributes({ columnGap: cng })} min={0} max={100} step={1} />

                    {/* Row Gap */}
                    <Title>{__('Row Gap', 'b-blocks')}</Title>
                    <RangeControl value={rowGap} onChange={cng => setAttributes({ rowGap: cng })} min={0} max={100} step={1} />
                </PanelBody>
            </InspectorControls>


            <div className={`${className} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile} cGap-${columnGap} rGap-${rowGap}`}>
                <InnerBlocks allowedBlocks={['b-blocks/team-member']} template={[['b-blocks/team-member'], ['b-blocks/team-member'], ['b-blocks/team-member']]} />
            </div>
        </>
    },

    save: props => {
        const { columns, columnGap, rowGap } = props.attributes;

        return <div className={`columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile} cGap-${columnGap} rGap-${rowGap}`}>
            <InnerBlocks.Content />
        </div>;
    },

    example: {
        attributes: {
            'preview': true
        },
    },
});
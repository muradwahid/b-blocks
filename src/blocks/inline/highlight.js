const { registerFormatType, toggleFormat } = wp.richText;
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, FormToggle, PanelRow } from '@wordpress/components';


const type = 'b-blocks/text-highlight';

registerFormatType(type, {
    title: __('Inline Highlight', 'b-blocks'),
    tagName: 'mark',
    className: 'b_blocks_text_highlight',

    attributes: {
        style: 'style',
    },

    edit: ({ isActive, value, onChange }) => {
        const onToggle = () => {
            onChange(toggleFormat(value, {
                type,
                attributes: {
                    style: 'color: #333; background-color: #beff14; padding: .2em; border-radius: 5px;',
                },
            }))
        }

        return <InspectorControls>
            <PanelBody icon='admin-customizer' title={__('Inline Highlight', 'b-blocks')} initialOpen={false}>
                <PanelRow>
                    <label htmlFor="b_blocks_text_highlight_toggle">{isActive ? __('Remove Inline Highlight', 'b-blocks') : __('Inline Highlight', 'b-blocks')}</label>

                    <FormToggle id="b_blocks_text_highlight_toggle" checked={isActive} onChange={onToggle} />
                </PanelRow>
            </PanelBody>
        </InspectorControls>
    }
});
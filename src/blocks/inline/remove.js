import { registerFormatType } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';

const type = 'b-blocks/remove-inline-formats';

registerFormatType(type, {
    title: __('Remove Formatting', 'b-blocks'),
    tagName: 'span',
    className: 'b_blocks_remove',
    edit({ value, onChange }) { // There is another props call isActive
        return (
            <InspectorControls>
                <PanelBody className='bBlocksPanelBody' title={__('Remove All Inline Formats', 'b-blocks')} initialOpen={false}>
                    <Button isSecondary={true} onClick={() => onChange({ ...value, formats: Array(value.formats.length) })}>{__('Remove All Inline Formats', 'b-blocks')}</Button>
                </PanelBody>
            </InspectorControls>
        );
    }
});
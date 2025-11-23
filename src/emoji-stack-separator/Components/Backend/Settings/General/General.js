import { SelectControl, TextControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const General = ({ attributes, setAttributes }) => {
    const { emoji, emojiSize, density, animationStyle } = attributes;
    return <>
        <PanelBody className='bPlPanelBody' title={__('Emoji Stack Settings', 'b-blocks')}>
            <TextControl
                label={__('Emoji', 'b-blocks')}
                value={emoji}
                onChange={(value) => {
                    const newEmoji = Array.from(value)[0];
                    setAttributes({ emoji: newEmoji });
                }}
                help={__(
                    'Enter any emoji character',
                    'b-blocks'
                )}
            />
            <SelectControl
                label={__('Emoji Size', 'b-blocks')}
                value={emojiSize}
                options={[
                    { label: __('Small', 'b-blocks'), value: 'small' },
                    { label: __('Medium', 'b-blocks'), value: 'medium' },
                    { label: __('Large', 'b-blocks'), value: 'large' },
                    { label: __('Extra Large', 'b-blocks'), value: 'xlarge' },
                ]}
                onChange={(value) => setAttributes({ emojiSize: value })}
                help={__('Adjust the size of each emoji', 'b-blocks')}
            />
            <SelectControl
                label={__('Stack Density', 'b-blocks')}
                value={density}
                options={[
                    { label: __('Sparse', 'b-blocks'), value: 'sparse' },
                    { label: __('Normal', 'b-blocks'), value: 'normal' },
                    { label: __('Dense', 'b-blocks'), value: 'dense' },
                ]}
                onChange={(value) => setAttributes({ density: value })}
                help={__('Control how tightly packed the emojis are', 'b-blocks')}
            />
            <SelectControl
                label={__('Hover Animation', 'b-blocks')}
                value={animationStyle}
                options={[
                    { label: __('None', 'b-blocks'), value: 'none' },
                    { label: __('Bounce', 'b-blocks'), value: 'bounce' },
                    { label: __('Rotate', 'b-blocks'), value: 'rotate' },
                    { label: __('Wave', 'b-blocks'), value: 'wave' },
                ]}
                onChange={(value) => setAttributes({ animationStyle: value })}
                help={__('Add interactive hover effects to emojis', 'b-blocks')}
            />
        </PanelBody>

    </>
}
export default General
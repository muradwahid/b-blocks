import { Flex } from '@wordpress/components';
import { TextControl, ToggleControl, SelectControl, TextareaControl, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Label } from '../../../../../../bpl-tools/Components';
import { CenterIcon, LeftIcon, RightIcon } from '../../../utils/icon';

const General = ({ attributes, setAttributes }) => {
    const {
        phoneNumber,
        buttonText,
        prefillMessage,
        showIcon,
        showStatusDot,
        tooltipText,
        buttonSize,
        hoverAnimation,
        openInNewTab,
        fullWidth,
        alignment,
        iconPosition,
        pulseAnimation,
    } = attributes;
    return <>

            <PanelBody
                title={__('WhatsApp Settings', 'b-blocks')}
                initialOpen={true}
                className='bPlPanelBody'
        >
                  <Flex className='mt10'>
                    <Label className='flex1 mb0'>{__('Alignment', 'b-blocks')}</Label>
                    <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={alignment} onChange={(val) => setAttributes({ alignment: val })} isDeselectable >
                      <ToggleGroupControlOptionIcon label='Left' value='flex-start' icon={LeftIcon} />
                      <ToggleGroupControlOptionIcon label='Center' value='center' icon={CenterIcon} />
                      <ToggleGroupControlOptionIcon label='Right' value='flex-end' icon={RightIcon} />
                    </ToggleGroupControl>
                  </Flex>
            
                <TextControl
                    label={__('Phone Number', 'b-blocks')}
                    help={__(
                        'Full international format without + or spaces, e.g. 15551234567',
                        'b-blocks'
                    )}
                    value={phoneNumber}
                    onChange={(value) =>
                        setAttributes({ phoneNumber: value })
                    }
                />
                <TextControl
                    label={__('Button Text', 'b-blocks')}
                    value={buttonText}
                    onChange={(value) =>
                        setAttributes({ buttonText: value })
                    }
                />
                <TextareaControl
                    label={__(
                        'Pre-filled Message',
                        'b-blocks'
                    )}
                    help={__(
                        'This message will be pre-filled when the user opens WhatsApp.',
                        'b-blocks'
                    )}
                    value={prefillMessage}
                    onChange={(value) =>
                        setAttributes({ prefillMessage: value })
                    }
                />
                <TextControl
                    label={__(
                        'Tooltip Text',
                        'b-blocks'
                    )}
                    help={__(
                        'Shown on hover. Leave empty to disable.',
                        'b-blocks'
                    )}
                    value={tooltipText}
                    onChange={(value) =>
                        setAttributes({ tooltipText: value })
                    }
                />
                <ToggleControl
                    label={__(
                        'Open in New Tab',
                        'b-blocks'
                    )}
                    checked={openInNewTab}
                    onChange={(value) =>
                        setAttributes({ openInNewTab: value })
                    }
                />
            </PanelBody>

            <PanelBody
                title={__('Appearance', 'b-blocks')}
            initialOpen={false}
            className='bPlPanelBody'
            >
                <SelectControl
                    label={__('Button Size', 'b-blocks')}
                    value={buttonSize}
                    options={[
                        { label: __('Small', 'b-blocks'), value: 'small' },
                        { label: __('Medium', 'b-blocks'), value: 'medium' },
                        { label: __('Large', 'b-blocks'), value: 'large' },
                    ]}
                    onChange={(value) =>
                        setAttributes({ buttonSize: value })
                    }
                />
                {/* <RangeControl
                    label={__(
                        'Border Radius',
                        'b-blocks'
                    )}
                    value={borderRadius}
                    onChange={(value) =>
                        setAttributes({ borderRadius: value })
                    }
                    min={0}
                    max={100}
                /> */}
                <ToggleControl
                    label={__('Full Width', 'b-blocks')}
                    checked={fullWidth}
                    onChange={(value) =>
                        setAttributes({ fullWidth: value })
                    }
                />
                {/* <ToggleControl
                    label={__('Drop Shadow', 'b-blocks')}
                    checked={shadow}
                    onChange={(value) =>
                        setAttributes({ shadow: value })
                    }
                /> */}
            </PanelBody>

            <PanelBody
                title={__('Icon & Status', 'b-blocks')}
            initialOpen={false}
            className='bPlPanelBody'
            >
                <ToggleControl
                    label={__(
                        'Show WhatsApp Icon',
                        'b-blocks'
                    )}
                    checked={showIcon}
                    onChange={(value) =>
                        setAttributes({ showIcon: value })
                    }
                />
                {showIcon && (
                    <SelectControl
                        label={__(
                            'Icon Position',
                            'b-blocks'
                        )}
                        value={iconPosition}
                        options={[
                            { label: __('Left', 'b-blocks'), value: 'left' },
                            { label: __('Right', 'b-blocks'), value: 'right' },
                        ]}
                        onChange={(value) =>
                            setAttributes({ iconPosition: value })
                        }
                    />
                )}
                <ToggleControl
                    label={__(
                        'Online Status Dot',
                        'b-blocks'
                    )}
                    help={__(
                        'Show a pulsing green dot to indicate availability.',
                        'b-blocks'
                    )}
                    checked={showStatusDot}
                    onChange={(value) =>
                        setAttributes({ showStatusDot: value })
                    }
                />
            </PanelBody>

            <PanelBody
                title={__('Animations', 'b-blocks')}
            initialOpen={false}
            className='bPlPanelBody'
            >
                <ToggleControl
                    label={__(
                        'Hover Scale Animation',
                        'b-blocks'
                    )}
                    checked={hoverAnimation}
                    onChange={(value) =>
                        setAttributes({ hoverAnimation: value })
                    }
                />
                <ToggleControl
                    label={__(
                        'Pulse Attention Animation',
                        'b-blocks'
                    )}
                    help={__(
                        'Adds a subtle pulse to draw attention.',
                        'b-blocks'
                    )}
                    checked={pulseAnimation}
                    onChange={(value) =>
                        setAttributes({ pulseAnimation: value })
                    }
                />
            </PanelBody>

            {/* <PanelBody
                title={__('Colors', 'b-blocks')}
            initialOpen={false}
            className='bPlPanelBody'
            >
                <p className="bBlocks-whatsapp-block-color-label">
                    {__('Background Color', 'b-blocks')}
                </p>
                <ColorPicker
                    color={backgroundColor}
                    onChangeComplete={(value) =>
                        setAttributes({ backgroundColor: value.hex })
                    }
                    disableAlpha
                />
                <p className="bBlocks-whatsapp-block-color-label" style={{ marginTop: '16px' }}>
                    {__('Text Color', 'b-blocks')}
                </p>
                <ColorPicker
                    color={textColor}
                    onChangeComplete={(value) =>
                        setAttributes({ textColor: value.hex })
                    }
                    disableAlpha
                />
            </PanelBody> */}
    </>
};

export default General;
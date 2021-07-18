/**
 * @props className (optional): 'mt-20p mb-5p' (String)
 * @props label (optional): 'Background' (String)
 * @props background (required): { type, color, gradient, image, position, attachment, repeat, size, overlayColor } (Object)
 * @props onChange (required): (Function)
 * @props defaults (optional): { type, color, gradient, image, position, attachment, repeat, size, overlayColor } (Object)
 */

import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { Button, PanelRow, Dropdown, __experimentalGradientPicker as Gradient, __experimentalAlignmentMatrixControl as AlignmentMatrixControl, SelectControl } from '@wordpress/components';

// Variables
import Title from './Title';
import BColor from './BColor';
import BtnGroup from './BtnGroup';
import { ImageHolderControl, } from './ImageControl';
import options from '../Const/options';
const { gradients } = options;
const bgTypes = [
    { label: 'Solid', value: 'solid', icon: 'Solid' },
    { label: 'Gradient', value: 'gradient', icon: 'Gradient' },
    { label: 'Image', value: 'image', icon: 'Image' },
];
const attachments = [
    { label: 'Initial', value: 'initial' },
    { label: 'Scroll', value: 'scroll' },
    { label: 'Fixed', value: 'fixed' },
    { label: 'Local', value: 'local' },
];
const repeats = [
    { label: 'No Repeat', value: 'no-repeat' },
    { label: 'Repeat', value: 'repeat' },
    { label: 'Repeat X', value: 'repeat-x' },
    { label: 'Repeat Y', value: 'repeat-y' },
];
const sizes = [
    { label: 'Cover', value: 'cover' },
    { label: 'Auto', value: 'auto' },
    { label: 'Contain', value: 'contain' },
];

const Background = props => {
    const { className, label = __('Background', 'b-blocks'), background = {}, defaults = {}, onChange } = props;

    const defaultVal = { type: 'solid', color: '#000000b3', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)', image: {}, position: 'center center', attachment: 'initial', repeat: 'no-repeat', size: 'cover', overlayColor: '#000000b3' }

    const getDefault = property => defaults?.[property] || defaultVal[property];
    const setDefault = property => onChange({ ...background, [property]: getDefault(property) });

    const getValue = property => background?.[property] || getDefault(property);
    const setValue = (property, val) => onChange({ ...background, [property]: val });
    const resetValue = property => <Button icon='image-rotate' className='bBlocksResetVal' onClick={() => setDefault(property)} />


    useEffect(() => {
        const allStyles = 'gradient' === getValue('type') ? `background-image: ${getValue('gradient')}` :
            'image' === getValue('type') ?
                `background-image: url(${getValue('image')?.url});
                background-position: ${getValue('position')};
                background-size: ${getValue('size')};
                background-repeat: ${getValue('repeat')};
                background-color: ${getValue('overlayColor')};
                background-blend-mode: overlay;` :
                `background-color: ${getValue('color')};`;

        const initObj = { type: getValue('type'), color: getValue('color'), gradient: getValue('gradient'), image: getValue('image'), position: getValue('position'), attachment: getValue('attachment'), repeat: getValue('repeat'), size: getValue('size'), overlayColor: getValue('overlayColor') }

        onChange({ ...background, ...initObj, styles: allStyles.replace(/\s+/g, ' ').trim() });
    }, [getValue('type'), getValue('color'), getValue('gradient'), getValue('image'), getValue('position'), getValue('attachment'), getValue('repeat'), getValue('size'), getValue('overlayColor')]);

    return <PanelRow className={`bBlocksDropdown ${className}`}>
        <Title mt='5px'>{label}</Title>

        <Dropdown className='bBlocksDropdownContainer' contentClassName='bBlocksDropdownPopover' position='bottom right'
            renderToggle={({ isOpen, onToggle }) => <Button icon='edit' onClick={onToggle} aria-expanded={isOpen} />}
            renderContent={() => <>
                {/* Type */}
                <PanelRow>
                    <Title mt='0' mb='0'>{__('Type:', 'b-blocks')}</Title>
                    <BtnGroup options={bgTypes} myValue={getValue('type')} setState={val => setValue('type', val)} />
                </PanelRow>

                {'solid' === getValue('type') && <BColor className='mt-20p' label={__('Color:', 'b-blocks')} value={getValue('color')} onChange={val => setValue('color', val)} defaultColor={getDefault('color')} />}

                {'gradient' === getValue('type') && <Gradient className='mt-20p' value={getValue('gradient')} onChange={val => setValue('gradient', val)} gradients={gradients} />}

                {'image' === getValue('type') && <>
                    <ImageHolderControl label={__('Image:', 'b-blocks')} img={getValue('image')} onChange={val => setValue('image', val)} />

                    <PanelRow>
                        <Title mt='0' mb='0'>{__('Position', 'b-blocks')}</Title>
                        <AlignmentMatrixControl value={getValue('position')} onChange={val => setValue('position', val)} />
                        {background?.position && background?.position !== getDefault('position') && resetValue('position')}
                    </PanelRow>

                    <PanelRow>
                        <Title mt='0' mb='0'>{__('Attachment:', 'b-blocks')}</Title>
                        <SelectControl value={getValue('attachment')} onChange={val => setValue('attachment', val)} options={attachments} />
                        {background?.attachments && background?.attachments !== getDefault('attachments') && resetValue('attachments')}
                    </PanelRow>

                    <PanelRow>
                        <Title mt='0' mb='0'>{__('Repeat:', 'b-blocks')}</Title>
                        <SelectControl value={getValue('repeat')} onChange={val => setValue('repeat', val)} options={repeats} />
                        {background?.repeat && background?.repeat !== getDefault('repeat') && resetValue('repeat')}
                    </PanelRow>

                    <PanelRow>
                        <Title mt='0' mb='0'>{__('Size:', 'b-blocks')}</Title>
                        <SelectControl value={getValue('size')} onChange={val => setValue('size', val)} options={sizes} />
                        {background?.size && background?.size !== getDefault('size') && resetValue('size')}
                    </PanelRow>

                    <BColor className='mt-20p' label={__('Overlay Color:', 'b-blocks')} value={getValue('overlayColor')} onChange={val => setValue('overlayColor', val)} defaultColor={getDefault('overlayColor')} />
                </>}
            </>}
        />
    </PanelRow>;
};
export default Background;
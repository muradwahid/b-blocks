import { __experimentalNumberControl as NumberControl, SelectControl, TextareaControl, PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { BButtonGroup, IconLibrary, MediaArea } from '../../../../../../../bpl-tools/Components';
import { SelectControlPro } from '../../../../../../../bpl-tools/ProControls'
import { useWPAjax, useWPOptionQuery } from '../../../../../../../bpl-tools/hooks';
import { updateData } from '../../../../../../../bpl-tools/utils/functions';
import { SVGSanitizer } from '../../../../../../../bpl-tools/utils/common';


import { easingOptions, proEasings } from '../../../../utils/options';
import { cloudIcon } from '../../../../utils/icons';
const General = (props) => {
    const { attributes, setAttributes, isPremium,setIsProModalOpen } = props;
    const { icon, options } = attributes;

    const { data: bBlocksUtils } = useWPOptionQuery('bBlocksUtils');

    const { refetch, } = useWPAjax('b-blocks-enable-svg-mime-type', { _wpnonce: bBlocksUtils?.nonce }, false)


    const enableSVGUpload = async () => {
        await refetch();
    }

    const svgSanitizer = new SVGSanitizer();


    return <>
        {/* <HelpPanel slug='b-blocks' docsLink='https://bplugins.com/docs/content-slider-block/guides/general' /> */}
        <PanelBody className='bPlPanelBody' title={__('Icon', 'b-blocks')} initialOpen={true} >

            <SelectControl label={__('SVG Type', 'b-blocks')} labelPosition='left' options={[{ label: 'Icon', value: 'icon' }, { label: 'Custom SVG', value: 'custom' },]} value={icon.type.svgType} onChange={(value) => setAttributes({ icon: updateData(icon, value, 'type', 'svgType') })} />

            {icon.type.svgType === 'custom' && (
                <>
                    <TextareaControl value={icon.custom} onChange={(value) => setAttributes({ icon: updateData(icon, value, 'custom') })} rows={8} />
                </>
            )}

            {icon.type.svgType === 'icon' && (
                <>
                    <BButtonGroup label={__('Icon Type', 'b-blocks')} options={[{ label: `Upload ${!isPremium ? '(Pro)':''}`, value: 'upload' }, { label: 'Library', value: 'library' },]} value={icon.type.iconType} onChange={(value) => {
                        if (isPremium) {
                            setAttributes({ icon: updateData(icon, value, 'type', 'iconType'), }); 
                        }else{
                            setIsProModalOpen(true);
                        }
                        
                        }} />

                    {icon.type.iconType === 'upload' && <MediaArea types={['image/svg+xml']} onClick={enableSVGUpload} label={__('Upload SVG', 'b-blocks')} value={{ url: icon.upload }} default={cloudIcon} onChange={async (value) => {
                        const svgStr = value?.url ? await svgSanitizer.sanitizeFile(value?.url) : '';
                        setAttributes({ icon: updateData(icon, svgStr, 'upload') });
                    }} isSvgEnabled={true} />}

                    {icon.type.iconType === 'library' && (
                        <IconLibrary label={__('Icon Library', 'b-blocks')} value={icon.library} onChange={(value) => setAttributes({ icon: updateData(icon, value, 'library') })} />
                    )}
                </>
            )}
        </PanelBody>

        <PanelBody className='bPlPanelBody' title={__('Options', 'b-blocks')} initialOpen={false} >

            <NumberControl label={__('Fill Duration', 'b-blocks')} labelPosition='edge' value={options.duration} onChange={(value) => setAttributes({ options: updateData(options, value, 'duration') })} />

            <small>Duration on SVG files (in ms)</small>
            <NumberControl className='mt10' label={__('Delay', 'b-blocks')} labelPosition='edge' value={options.delay} onChange={(value) => setAttributes({ options: updateData(options, value, 'delay') })} />

            <small>Duration on SVG draws (in ms)</small>
            <SelectControl className='mt10 mb10' label={__('Direction', 'b-blocks')} labelPosition='edge' options={[{ label: 'Normal', value: 'normal' }, { label: 'Reverse', value: 'reverse' }, { label: 'Alternate', value: 'alternate' },]} value={options.direction} onChange={(value) => setAttributes({ options: updateData(options, value, 'direction'), })} />

            <ToggleControl label={__('Repeat Drawing', 'b-blocks')} checked={options.repeat} value={options.repeat} onChange={(value) => setAttributes({ options: updateData(options, value, 'repeat') })} />

            <SelectControlPro  className='mt10' label={__('Animation Easing', 'b-blocks')} labelPosition='edge' options={easingOptions} value={options.easing} onChange={(value) => setAttributes({ options: updateData(options, value, 'easing') })} isPremium={isPremium} proValues={proEasings} setIsProModalOpen={setIsProModalOpen} />

        </PanelBody>
    </>
};
export default General;

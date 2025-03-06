import { PanelBody, RangeControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { pxUnit, perUnit, emUnit, vwUnit } from '../../../../../../../bpl-tools/utils/options';
import { Background, ColorControl, ColorsControl, Typography } from '../../../../../../../bpl-tools/Components';
import { SpaceControl } from '../../../../../../../bpl-tools/Components/Deprecated';
import { BControlPro } from '../../../../../../../bpl-tools/ProControls';

const Styles = ({ attributes, isPremium, setIsProModalOpen, updateObj }) => {
    const { styles, width, isLabel, labelTypo, labelColors, labelPadding, isCap, capTypo, capColors, capPadding } = attributes;
    const { height, dragg } = styles;
    return (
        <>
            <PanelBody title={__("Container", "image-compare")} className='bPlPanelBody'>

                <UnitControl label={__('Width:', 'image-compare')} labelPosition='left' value={width} onChange={val => updateObj("width", val)} units={[pxUnit(), perUnit(), emUnit(), vwUnit()]} />

                <UnitControl className='mt10' label={__('Height:', 'image-compare')} labelPosition='left' value={height} onChange={val => updateObj("styles", val, "height")} units={[pxUnit(), perUnit(), emUnit(), vwUnit()]} />

            </PanelBody>

            {isLabel && <>
                <PanelBody className='bPlPanelBody' title={__('Labels', 'image-compare')} initialOpen={false}>

                    <Typography value={labelTypo} onChange={val => updateObj('labelTypo', val)} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} />

                    <ColorsControl value={labelColors} onChange={val => updateObj('labelColors', val)} defaults={{ color: '#fff', bg: '#00000080' }} />

                    <SpaceControl className='mt20' label={__('Padding:', 'image-compare')} value={labelPadding} onChange={val => updateObj('labelPadding', val)} defaults={{ vertical: '10px', horizontal: '15px' }} />
                </PanelBody>
            </>}


            {isCap && <>
                <PanelBody className='bPlPanelBody' title={__('Caption', 'image-compare')} initialOpen={false}>

                    <Typography value={capTypo} onChange={val => updateObj('capTypo', val)} defaults={{ fontSize: { desktop: 14, tablet: 14, mobile: 14 } }} />

                    <ColorsControl value={capColors} onChange={val => updateObj('capColors', val)} defaults={{ color: '#333', bg: '#f4f4f4' }} />

                    <SpaceControl className='mt20' label={__('Padding:', 'image-compare')} value={capPadding} onChange={val => updateObj('capPadding', val)} defaults={{ vertical: '10px', horizontal: '15px' }} />
                </PanelBody>
            </>}
            <PanelBody className='bPlPanelBody' title={__('Slider', 'image-compare')} initialOpen={true}>

                <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Line Size', 'image-compare')} min={1} max={10} step={1} value={dragg.line.size} onChange={val => updateObj('styles', val, 'dragg', 'line', 'size')} Component={RangeControl} />

                <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Line Color', 'image-compare')} value={dragg.line.bg} onChange={val => updateObj('styles', val, 'dragg', 'line', 'bg')} isImage={false} Component={Background} />

                <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Icon Color', 'image-compare')} value={dragg.icon.color} onChange={val => updateObj('styles', val, 'dragg', 'icon', 'color')} isImage={false} Component={ColorControl} />
            </PanelBody>
        </>
    );
};

export default Styles;
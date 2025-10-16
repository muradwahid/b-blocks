import { __ } from '@wordpress/i18n';
import { __experimentalBorderBoxControl as BorderControl, PanelBody, SelectControl, __experimentalUnitControl as UnitControl, Flex } from '@wordpress/components';

import { BoxControl, Device } from "../../../../../../../bpl-tools/Components";
import { objectFitOptions } from '../../../../utils/options';
import LogoCaption from './LogoCaption';
import { RangeControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';

function LogoStyle({ attributes, setAttributes, updateObj, device }) {
    const { sliderStyles, options } = attributes;
    return <>
        <PanelBody className="bPlPanelBody" title={__("Logo Style", "b-blocks")} initialOpen={true}>

            <UnitControl className='mt10' labelPosition='edge' label={__("Height", "b-blocks")} value={sliderStyles.logo.height} onChange={value => updateObj('sliderStyles', value, "logo", "height")} max={sliderStyles.logo.height.includes("%") ? 100 : 1000} min={0} />

            <UnitControl className='mt10' labelPosition='edge' label={__("Width", "b-blocks")} value={sliderStyles.logo.width} onChange={(value) => updateObj('sliderStyles', value, 'logo', 'width')} max={sliderStyles.logo.width.includes("%") ? 100 : 1000} min={0} />

            <RangeControl className='mt10' label={<Flex>Column Gap <Device /></Flex>} value={options.space[device]} onChange={(value) => updateObj('options', value, 'space', device)} step={1} min={1} max={200} />

            <BoxControl label={__('Padding', 'b-blocks')} values={sliderStyles?.logo?.padding} onChange={value => updateObj('sliderStyles', value, 'logo', 'padding')} />

            <SelectControl className='mt10' labelPosition='edge' label={__("Logo Fit Options", "b-blocks")} value={sliderStyles.logo.logoFitOption} options={objectFitOptions} onChange={(value) => updateObj('sliderStyles', value, 'logo', 'logoFitOption')} />

            <SelectControl className='mt10' labelPosition='edge' label={__("Logo Hover Style", "b-blocks")} value={sliderStyles.logo.hover} options={[{ value: "", label: "None" }, { value: "logo-grayScale", label: "GrayScale" }, { value: "zoomIn", label: "Zoom In" }, { value: "zoomOut", label: "Zoom Out" }]} onChange={(value) => updateObj('sliderStyles', value, 'logo', 'hover')} />

            <BorderControl className='mt10' label={__('Border', 'b-blocks')} value={sliderStyles.logo.border} onChange={value => updateObj('sliderStyles', value, 'logo', 'border')} />

            <BoxControl className='mt10' label={__("Border Radius", "b-blocks")} values={sliderStyles.logo.radius} onChange={(value) => updateObj('sliderStyles', value, 'logo', 'radius')} />

        </PanelBody>
        {options.isCaptionVisible && (
            <LogoCaption {...{ attributes, setAttributes, updateObj }} />
        )}
    </>
}

export default withSelect((select) => {
    const { getDeviceType } = select("core/editor");

    return {
        device: getDeviceType()?.toLowerCase(),
    };
})(LogoStyle);
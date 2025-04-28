import { __experimentalBorderBoxControl as BorderControl, PanelBody, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { __ } from '@wordpress/i18n';
import React from 'react';
import { BoxControl } from "../../../../../../../bpl-tools/Components";
import { objectFitOptions } from '../../../../utils/options';
import LogoCaption from './LogoCaption';

function LogoStyle({ attributes, setAttributes, updateObj }) {
    const { sliderStyles, options } = attributes;
    return <>
        <PanelBody className="bPlPanelBody" title={__("Logo Style", "b-blocks")} initialOpen={true}>

            <UnitControl className='mt10' labelPosition='edge' label={__("Height", "b-blocks")} value={sliderStyles.logo.height} onChange={value => updateObj('sliderStyles', value, "logo", "height")} max={sliderStyles.logo.height.includes("%") ? 100 : 1000} min={0} />

            <UnitControl className='mt10' labelPosition='edge' label={__("Width", "b-blocks")} value={sliderStyles.logo.width} onChange={(value) => updateObj('sliderStyles', value, 'logo', 'width')} max={sliderStyles.logo.width.includes("%") ? 100 : 1000} min={0} />

            <SelectControl className='mt10' labelPosition='edge' label={__("Logo Fit Options", "b-blocks")} value={sliderStyles.logo.logoFitOption} options={objectFitOptions} onChange={(value) => updateObj('sliderStyles', value, 'logo', 'logoFitOption')} />

            <SelectControl className='mt10' labelPosition='edge' label={__("Logo Hover Style", "b-blocks")} value={sliderStyles.logo.hover} options={[{ value: "", label: "None" }, { value: "logo-grayScale", label: "GrayScale" }, { value: "zoomIn", label: "Zoom In" }, { value: "zoomOut", label: "Zoom Out" }]} onChange={(value) => updateObj('sliderStyles', value, 'logo', 'hover')} />

            <BorderControl className='mt10' label={__('Border', 'b-blocks')} values={sliderStyles.logo.border} onChange={value => updateObj('sliderStyles', value, 'logo', 'border')} />

            <BoxControl className='mt10' label={__("Border Radius", "b-blocks")} values={sliderStyles.logo.radius} onChange={(value) => updateObj('sliderStyles', value, 'logo', 'radius')} />

        </PanelBody>
        {options.isCaptionVisible && (
            <LogoCaption {...{ attributes, setAttributes, updateObj }} />
        )}
    </>
}

export default LogoStyle;
import { Flex, PanelBody, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Device } from "../../../../../../../bpl-tools/Components";

const ImageStyle = ({ attributes, device, updateObj }) => {
    const { image } = attributes;
    return <PanelBody className="bPlPanelBody" initialOpen={true} title={__("Image", "b-blocks")}>

            <UnitControl label={<Flex>{__("Width", "b-blocks")} < Device /></Flex>} labelPosition='edge' units={[{ label: "%", value: "%" }]} isUnitSelectTabbable value={image.width[device]} min={1} max={100} onChange={(value) => updateObj('image', value, 'width', device)} />

            <UnitControl className='mt10' label={<Flex>{__("Height", "b-blocks")} < Device /></Flex>} labelPosition='edge' units={[{ label: "px", value: "px" }]} isUnitSelectTabbable value={image.height[device]} min={1} max={1000} onChange={(value) => updateObj('image', value, 'height', device)}
            />
        </PanelBody> 
};

export default compose(
    withSelect((select) => {
        const { getDeviceType } = select("core/editor");

        return {
            device: getDeviceType()?.toLowerCase(),
        };
    })
)(ImageStyle);

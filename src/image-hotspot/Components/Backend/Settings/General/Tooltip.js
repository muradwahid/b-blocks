import {
    __experimentalNumberControl as NumberControl,
    PanelBody,
    PanelRow,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const Tooltip = ({ attributes, updateObj }) => {
    const { options } = attributes;
    return (
        <PanelBody className="bPlPanelBody" title={__("Tooltip Options", "b-blocks")} initialOpen={false} >
            <PanelRow>

                <span>{__("Speed (ms)", "b-blocks")}</span>

                <NumberControl onChange={(value) => updateObj('options', value, 'speed')} isDragEnabled isShiftStepEnabled shiftStep={10} step={1} min={100} value={Number(options.speed)} />

            </PanelRow>
            <PanelRow>
                <span>{__("Delay (ms)", "b-blocks")}</span>
                <NumberControl onChange={(value) => updateObj('options', value, 'delay')} isDragEnabled isShiftStepEnabled shiftStep={10} step={1} min={100} value={Number(options.delay)} />
            </PanelRow>
        </PanelBody>
    );
};

export default Tooltip;

import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import { HelpPanel } from "../../../../../../../bpl-tools/Components";
import { CustomCodeEditor } from "../Panel/CustomCodeEditor/CustomCodeEditor";

const General = (props) => {
    const { attributes, setAttributes } = props;
    const { htmlCode } = attributes;
    return (
        <>
            <HelpPanel slug="b-blocks" docsLink="https://bplugins.com/docs/content-slider-block/guides/general" />

            <PanelBody className="bPlPanelBody" title={__("HTML Code", "b-blocks")} initialOpen={true}>
                <CustomCodeEditor value={htmlCode} onChange={(val) => setAttributes({ htmlCode: val })} />
            </PanelBody>
        </>
    );
};
export default General;

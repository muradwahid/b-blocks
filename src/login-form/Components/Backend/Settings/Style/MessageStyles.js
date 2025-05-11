import { __experimentalBorderBoxControl as BorderBoxControl, PanelBody, SelectControl, TabPanel } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { Background, BoxControl, ColorControl, Typography } from "../../../../../../../bpl-tools/Components";
import { tabController, updateData } from "../../../../../../../bpl-tools/utils/functions";

import { inputPaddingReset } from "../../../../utils/functions";
import { errorMessageOptions, tostPositionOptions } from "../../../../utils/options";

const MessageStyles = ({ attributes, setAttributes, updateObj }) => {
    const { messages } = attributes;
    return <PanelBody className="bPlPanelBody" title={__("Form Messages", "b-blocks")} initialOpen={false} >

        <SelectControl label={__("Message Type", "b-blocks")} labelPosition='edge' value={messages.type} options={[{ label: "Normal", value: "normal" }, { label: "Toast", value: "toast" }]} onChange={(value) => setAttributes({ messages: updateData(messages, value, "type") })} />

        {messages.type === "normal" && <>
            <ColorControl label={__("Text Color", "b-blocks")} value={messages.normal.color.text} onChange={(value) => setAttributes({ messages: updateData(messages, value, "normal", "color", "text") })} />

            <Background label={__("Background", "b-blocks")} value={messages.normal.color.bg} onChange={(value) => setAttributes({ messages: updateData(messages, value, "normal", "color", "bg") })} />

            <BoxControl label={__("Padding", "b-blocks")} values={inputPaddingReset} onChange={(value) => setAttributes({ messages: updateData(messages, value, "normal", "padding") })} />

            <BorderBoxControl className="mt20" label={__("Border", "b-blocks")} value={messages.normal.border} onChange={(val) => setAttributes({ messages: updateData(messages, val, "normal", "border") })} defaults={{ width: "1px" }} />

            <BoxControl className='mt20' label={__("Border Radius", "b-blocks")} values={messages.normal.radius} onChange={value => updateObj('messages', value, 'normal', 'radius')} />
        </>}

        {messages.type === "toast" && <>
            <BoxControl label={__("Padding", "b-blocks")} allowReset={true} resetValues={inputPaddingReset} values={messages.padding} onChange={(value) => setAttributes({ messages: updateData(messages, value, "padding") })} />

            <Typography label={__("Typography", "b-blocks")} value={messages.typography} onChange={(value) => setAttributes({ messages: updateData(messages, value, "typography") })} />

            <SelectControl label={__("Position", "b-blocks")} labelPosition='edge' value={messages.position} onChange={(value) => setAttributes({ messages: updateData(messages, value, "position") })} options={tostPositionOptions} />

            <TabPanel className="bPlTabPanel mini" activeClass="activeTab" tabs={errorMessageOptions} onSelect={tabController} >
                {tab => <>
                    <ColorControl label={__("Text Color", "b-blocks")} value={messages[tab.name].color.text} onChange={(value) => setAttributes({ messages: updateData(messages, value, tab.name, "color", "text") })} />

                    <ColorControl label={__("Background", "b-blocks")} value={messages[tab.name].color.bg} onChange={(value) => setAttributes({ messages: updateData(messages, value, tab.name, "color", "bg") })} />
                </>}
            </TabPanel>
        </>}
    </PanelBody>
};

export default MessageStyles;

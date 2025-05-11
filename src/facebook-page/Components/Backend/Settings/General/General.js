import { PanelBody, RangeControl, TextControl, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { produce } from "immer";
import React from "react";

import { HelpPanel, Label, SelectTokenField } from "../../../../../../../bpl-tools/Components";

const General = (props) => {
    const { attributes, setAttributes } = props;
    const { facebook } = attributes;
    const update = (property, value) => {
        const updatedData = produce(facebook, (draft) => {
            draft[property] = value;
        });
        setAttributes({ facebook: updatedData });
    };
    return  <>
            <HelpPanel slug="b-blocks" docsLink="https://bplugins.com/docs/content-slider-block/guides/general" />

            <PanelBody className="bPlPanelBody" title={__("Items", "b-blocks")}>
                <TextControl label={__("Link", "social-media-page-block")} value={facebook.link} onChange={(value) => update("link", value)} />
                
                <Label>{__("Layout", "social-media-page-block")}</Label>
                <SelectTokenField value={facebook.layout} options={[{ label: "Timeline", value: "timeline" }, { label: "Events", value: "events" }, { label: "Messages", value: "messages" }]} onChange={(value) => setAttributes({ facebook: { ...facebook, layout: value } })} />

                <ToggleControl className='mt10' label={__("Small Header", "social-media-page-block")} checked={facebook.smallHeader} value={facebook.smallHeader} onChange={(value) => update("smallHeader", value)} />
                
                <ToggleControl className='mt10' label={__("Cover Photo", "social-media-page-block")} checked={facebook.coverPhoto} value={facebook.coverPhoto} onChange={(value) => update("coverPhoto", value)} />
                
                <ToggleControl className='mt10' label={__("Profile Photos", "social-media-page-block")} checked={facebook.profilePhotos} value={facebook.profilePhotos} onChange={(value) => update("profilePhotos", value)} />

                <ToggleControl className='mt10' label={__("Custom CTA Button", "social-media-page-block")} checked={facebook.ctaButton} value={facebook.ctaButton} onChange={(value) => update("ctaButton", value)} />

                <RangeControl className='mt10' label={__("Width", "social-media-page-block")} value={facebook.width} onChange={(value) => update("width", value)} min={0} max={1000} />

                <RangeControl className='mt10' label={__("Height", "social-media-page-block")} value={facebook.height} onChange={(value) => update("height", value)} min={0} max={1000} />
            </PanelBody>
        </> 
};
export default General;

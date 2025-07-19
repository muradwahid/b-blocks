import { PanelBody, RangeControl, TextControl, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import { HelpPanel, Label, SelectTokenField } from "../../../../../../../bpl-tools/Components";

const General = (props) => {
    const { attributes, updateObj } = props;
    const { facebook } = attributes;

    return <>
        <HelpPanel slug="b-blocks" docsLink="https://bplugins.com/docs/content-slider-block/guides/general" />

        <PanelBody className="bPlPanelBody" title={__("Items", "b-blocks")}>
            <TextControl label={__("Link", "social-media-page-block")} value={facebook.link} onChange={(value) => updateObj('facebook', value, "link")} />

            <Label>{__("Layout", "social-media-page-block")}</Label>
            <SelectTokenField value={facebook.layout} options={[{ label: "Timeline", value: "timeline" }, { label: "Events", value: "events" }, { label: "Messages", value: "messages" }]} onChange={(value) => updateObj('facebook', value, 'layout')} />

            <ToggleControl className='mt10' label={__("Small Header", "social-media-page-block")} checked={facebook.smallHeader} value={facebook.smallHeader} onChange={(value) => updateObj('facebook', value, "smallHeader")} />

            <ToggleControl className='mt10' label={__("Cover Photo", "social-media-page-block")} checked={facebook.coverPhoto} value={facebook.coverPhoto} onChange={(value) => updateObj('facebook', value, "coverPhoto")} />

            <ToggleControl className='mt10' label={__("Profile Photos", "social-media-page-block")} checked={facebook.profilePhotos} value={facebook.profilePhotos} onChange={(value) => updateObj('facebook', value, "profilePhotos")} />

            <ToggleControl className='mt10' label={__("Custom CTA Button", "social-media-page-block")} checked={facebook.ctaButton} value={facebook.ctaButton} onChange={(value) => updateObj('facebook', value, "ctaButton")} />

            <RangeControl className='mt10' label={__("Width", "social-media-page-block")} value={facebook.width} onChange={(value) => updateObj('facebook', value, "width")} min={0} max={1000} />

            <RangeControl className='mt10' label={__("Height", "social-media-page-block")} value={facebook.height} onChange={(value) => updateObj('facebook', value, "height")} min={0} max={1000} />
        </PanelBody>
    </>
};
export default General;

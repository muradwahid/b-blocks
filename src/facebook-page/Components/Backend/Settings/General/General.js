import { PanelBody, RangeControl, TextControl, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import { BtnGroup, HelpPanel, Label, SelectTokenField } from "../../../../../../../bpl-tools/Components";
import { Notice } from '@wordpress/components';
import { pageAlignOptions } from '../../../../utils/options';

const General = (props) => {
    const { attributes, updateObj, facebookKey } = props;
    const { facebook } = attributes;

    return <>
        <HelpPanel slug="b-blocks" docsLink="https://bplugins.com/docs/content-slider-block/guides/general" />

        <PanelBody className="bPlPanelBody" title={__("Items", "b-blocks")}>

            {!facebookKey && <Notice className='mb10' status='warning' isDismissible={false}>
                Set your Facebook App ID in the <a href={`${location.origin}/wp-admin/admin.php?page=b-blocks#/settings`} target="_blank" rel="noopener noreferrer"><em>Settings</em></a> to use this block.
            </Notice>}

            <TextControl label={__("Link", "social-media-page-block")} value={facebook.link} onChange={(value) => updateObj('facebook', value, "link")} />

            <Label>{__("Layout", "social-media-page-block")}</Label>
            <SelectTokenField value={facebook.layout} options={[{ label: "Timeline", value: "timeline" }, { label: "Events", value: "events" }, { label: "Messages", value: "messages" }]} onChange={(value) => updateObj('facebook', value, 'layout')} />

            <ToggleControl className='mt10' label={__("Small Header", "social-media-page-block")} checked={facebook.smallHeader} value={facebook.smallHeader} onChange={(value) => updateObj('facebook', value, "smallHeader")} />

            <ToggleControl className='mt10' label={__("Cover Photo", "social-media-page-block")} checked={facebook.coverPhoto} value={facebook.coverPhoto} onChange={(value) => updateObj('facebook', value, "coverPhoto")} />

            <ToggleControl className='mt10' label={__("Profile Photos", "social-media-page-block")} checked={facebook.profilePhotos} value={facebook.profilePhotos} onChange={(value) => updateObj('facebook', value, "profilePhotos")} />

            {/* <ToggleControl className='mt10' label={__("Custom CTA Button", "social-media-page-block")} checked={facebook.ctaButton} value={facebook.ctaButton} onChange={(value) => updateObj('facebook', value, "ctaButton")} /> */}

            <RangeControl className='mt10' label={__("Width", "social-media-page-block")} value={facebook.width} onChange={(value) => updateObj('facebook', value, "width")} min={0} max={1000} />

            <RangeControl className='mt10' label={__("Height", "social-media-page-block")} value={facebook.height} onChange={(value) => updateObj('facebook', value, "height")} min={0} max={1000} />

            <BtnGroup className='mt10' value={facebook.align} isIcon={true} label={__('Alignment', 'b-blocks')} options={pageAlignOptions} onChange={value => updateObj('facebook', value, 'align')} />
        </PanelBody>
    </>
};
export default General;

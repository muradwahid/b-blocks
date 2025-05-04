import { PanelBody, SelectControl, TextControl, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import React, { Fragment } from "react";

const SocialSignUp = ({ attributes, updateObj }) => {
    const { socialSignUp } = attributes;
    return (
        <PanelBody className="bPlPanelBody" title={__("Social Signup", "b-blocks")} initialOpen={false} >

            <ToggleControl label={__("Enable Signup with Google", "b-blocks")} checked={socialSignUp.google.show} value={socialSignUp.google.show} onChange={(value) => updateObj('socialSignUp', value, 'google', 'show')} />

            {socialSignUp.google.show && (
                <Fragment>
                    <TextControl label={__("Text for Google Button", "b-blocks")} value={socialSignUp.google.text} onChange={(value) => updateObj('socialSignUp', value, 'google', 'text')} />
                </Fragment>
            )}

            <ToggleControl label={__("Enable Signup with Facebook", "b-blocks")} checked={socialSignUp.facebook.show} value={socialSignUp.facebook.show} onChange={(value) => updateObj('socialSignUp', value, 'facebook', 'show')} />

            {socialSignUp.facebook.show && (
                <Fragment>
                    <TextControl label={__("Text for Facebook Button", "b-blocks")} value={socialSignUp.facebook.text} onChange={(value) => updateObj('socialSignUp', value, 'facebook', 'text')} />
                </Fragment>
            )}

            <ToggleControl label={__("Show Separator", "b-blocks")} checked={socialSignUp.separator.show} value={socialSignUp.separator.show} onChange={(value) => updateObj('socialSignUp', value, 'separator', 'show')} />

            {socialSignUp.separator.show && (
                <Fragment>

                    <SelectControl label={__("Separator Type", "b-blocks")} labelPosition='edge' value={socialSignUp.separator.type} options={[{ label: "Text", value: "text" }, { label: "Line", value: "line" },]} onChange={(value) => updateObj('socialSignUp', value, 'separator', 'type')} />

                    <TextControl label={__("Separator Text", "b-blocks")} value={socialSignUp.separator.text} onChange={(value) => updateObj('socialSignUp', value, 'separator', 'text')} />
                </Fragment>
            )}
        </PanelBody>
    );
};

export default SocialSignUp;

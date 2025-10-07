import { Flex, PanelBody, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { Label } from '../../../../../../../bpl-tools/Components';

const ButtonContent = ({ attributes, updateObj }) => {
    const { button } = attributes;
    return <PanelBody className="bPlPanelBody" initialOpen={false} title={__("Button", "b-blocks")}>
        <Label className="mt0 mb10">
            <strong>Register</strong>
        </Label>
        <TextControl label={__("Register Button Text", "b-blocks")} value={button.signup.text} onChange={(value) => updateObj('button', value, 'signup', 'text')} />
        <hr />
        <Label className="mt0 mb10">
            <strong>{__('SignIn', 'b-blocks')}</strong>
        </Label>
        <Flex align="normal" gap={3}>
            <TextControl value={button.signin.text.first} onChange={(value) => updateObj('button', value, 'signin', 'text', 'first')} />

            <div>
                <TextControl style={{ marginBottom: "0px !important" }} value={button.signin.text.second} onChange={(value) => updateObj('button', value, 'signin', 'text', 'second')} />
                <small>{__("Second option is linkable", "b-blocks")}</small>
            </div>
        </Flex>
        <TextControl label={__("Sign In URL", "b-blocks")} value={button.signin.text.link} placeholder={`${window.location.origin}/login`} onChange={(value) => updateObj('button', value, 'signin', 'text', 'link')} />
    </PanelBody>
};

export default ButtonContent;

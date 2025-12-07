import { useEffect } from "react";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { useSelect, useDispatch, withSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';


import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import PreSelectFormSkeleton from "../Common/PreSelectFormSkeleton";
import { MY_TEMPLATE } from "../../utils/templates";
import { isExist } from "../../../../../bpl-tools/utils/common";

import Style from "../Common/Style";
import Settings from "./Settings/Settings";
import BForm from "../Frontend/BForm";

const Edit = (props) => {
    const { attributes, setAttributes, clientId, device, postId } = props;
    const { form, button, formId, message } = attributes;

    const { replaceInnerBlocks } = useDispatch('core/block-editor');

    const updateObj = updateAttributes(attributes, setAttributes);

    const isPremium = false;
    useEffect(() => {
        setAttributes({ clientId })
    }, [clientId])


    const allowedBlocks = ['b-blocks/input-field', 'b-blocks/row', 'b-blocks/dual-color-heading', 'b-blocks/icon-box', 'b-blocks/advanced-image', 'core/paragraph'];

    const childBlocks = useSelect(
        (select) => select('core/block-editor').getBlocks(clientId),
        [clientId]
    );
    const handleFormTypeAttr = (type) => {
        const login = {
            form: { ...form, formType: 'login' },
            button: { ...button, navigation: { ...button.navigation, first: { ...button.navigation.first, text: 'Not registered yet?' }, second: { ...button.navigation.second, text: "Create an Account" } } },
            message: { ...message, success: { ...message.success, successFulRegistration: 'Login completed successfully!' } }
        }
        const register = {
            form: { ...form, formType: 'register' },
            button: { ...button, navigation: { ...button.navigation, first: { ...button.navigation.first, text: 'Already have an account?' }, second: { ...button.navigation.second, text: "Sign In" } } },
            message: { ...message, success: { ...message.success, successFulRegistration: 'Registration completed successfully!' } }
        }
        if (type === 'register') {
            setAttributes(register);
        } else if (type === 'login') {
            setAttributes(login);
        }
    }


    const handleReplaceForm = (type) => {
        handleFormTypeAttr(type)
        const template = MY_TEMPLATE[type];
        const newBlocks = template.map(block => {
            return createBlock(block.name, block.attributes || {});
        });

        replaceInnerBlocks(clientId, newBlocks, false);
    }

    useEffect(() => {
        const generateFormId = 'b_form_' + Math.floor(Math.random() * 1000000000).toString();
        if (!formId && formId === '') {
            setAttributes({ formId: generateFormId });
        }
        if (isExist(postId)) {
            setAttributes({ postId });
        }
    }, [postId]);

    return <>
        <Settings {...{ attributes, setAttributes, updateObj, isPremium, device, clientId, handleReplaceForm }} />

        <div {...useBlockProps()}>
            {
                <Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />}
            {form.formType === '' && <PreSelectFormSkeleton updateObj={updateObj} clientId={clientId} handleReplaceForm={handleReplaceForm} />}

            {form.formType !== '' && <BForm attributes={attributes} isFrontend={false}>
                <div className="b-blocks-b-form-child-field-wrapper">
                    <InnerBlocks
                        allowedBlocks={allowedBlocks}
                        templateLock={false}
                        renderAppender={() => childBlocks?.length > 0 ? <InnerBlocks.DefaultBlockAppender /> : <InnerBlocks.ButtonBlockAppender />} />
                </div>
            </BForm>}
        </div>
    </>
};
export default withSelect((select) => {
    const { getDeviceType, getCurrentPostId } = select('core/editor');
    return {
        device: getDeviceType()?.toLowerCase(),
        postId: getCurrentPostId()
    };
})(Edit);
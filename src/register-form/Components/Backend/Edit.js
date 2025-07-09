import { useBlockProps } from "@wordpress/block-editor";
import React from "react";

import useAnimation from "../../../../../bpl-tools/hooks/useAnimation";
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import RegisterForm from "../Common/RegisterForm/RegisterForm";
import Style from "../Common/Style";
import Settings from "./Settings/Settings";
import usePremiumInEditor from '../../../hooks/usePremiumInEditor';

const Edit = (props) => {
    const { attributes, setAttributes, clientId } = props;
    const { advanced } = attributes;
    const wrapperRef = React.useRef();
    const id = `register-form-${clientId}`;
    useAnimation(wrapperRef.current, advanced.animation);
    const updateObj = updateAttributes(attributes, setAttributes);

    const { isPremium = false } = usePremiumInEditor();

    return  <>
            <Settings {...{ attributes, setAttributes, updateObj, isPremium }} />

            <div {...useBlockProps()} id={id}>
                <Style attributes={attributes} id={id} isBackend={true} />
                <div ref={wrapperRef} className="wp-block-b-blocks-register-form-wrapper">
                    <RegisterForm attributes={attributes} isLoaderShow={true} isBackend={true} nonce={window.wpApiSettings.nonce} />
                </div>
            </div>
        </> 
};
export default Edit;

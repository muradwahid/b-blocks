import { useBlockProps } from "@wordpress/block-editor";
import { useRef } from "react";

import useAnimation from "../../../../../bpl-tools/hooks/useAnimation";
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import usePremiumInEditor from '../../../hooks/usePremiumInEditor';
import Form from "../Common/Form/Form";
import Style from "../Common/Style";
import Settings from "./Settings/Settings";

const Edit = (props) => {
    const { attributes, setAttributes, clientId } = props;
    const elRef = useRef(null);
    useAnimation(elRef.current, attributes?.animation);
    const updateObj = updateAttributes(attributes, setAttributes)

    const { isPremium = false } = usePremiumInEditor();

    return <>
        <Settings {...{ attributes, setAttributes, updateObj, isPremium }} />
        <div ref={elRef} {...useBlockProps()}>
            <Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />
            <Form attributes={attributes} />
        </div>
    </>
};
export default Edit;

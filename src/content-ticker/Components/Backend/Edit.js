import { useBlockProps } from "@wordpress/block-editor";
import { withDispatch } from '@wordpress/data';
import React from "react";
import ContentTicker from "../Common/ContentTicker";
import Style from "../Common/Style";
import Settings from "./Settings/Settings";

const Edit = (props) => {
    const { attributes, setAttributes, clientId, selectBlock } = props;

    return <>
        <Settings {...{ attributes, setAttributes }} />
        <div {...useBlockProps()} onClick={() => selectBlock(clientId)}>
            <Style attributes={attributes} id={`block-${clientId}`} />
            <ContentTicker {...{ attributes }} />
        </div>
    </>
};
export default withDispatch((dispatch, ownProps) => {
    return {
        selectBlock: () => {
            dispatch('core/block-editor').selectBlock(ownProps.clientId);
        }
    };
})(Edit)

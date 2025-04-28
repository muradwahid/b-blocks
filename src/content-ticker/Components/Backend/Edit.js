import { useBlockProps } from "@wordpress/block-editor";
import React from "react";
import ContentTicker from "../Common/ContentTicker";
import Style from "../Common/Style";
import Settings from "./Settings/Settings";

const Edit = (props) => {
  const { attributes, setAttributes, clientId } = props;

  return <>
    <Settings {...{ attributes, setAttributes }} />
    <div {...useBlockProps()}>
      <Style attributes={attributes} id={`block-${clientId}`} />
      <ContentTicker {...{ attributes }} />
    </div>
  </>
};
export default Edit;

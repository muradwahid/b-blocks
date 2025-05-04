import { useBlockProps } from "@wordpress/block-editor";
import React from "react";

import useAnimation from "../../../../../bpl-tools/hooks/useAnimation";
import RegisterForm from "../Common/RegisterForm/RegisterForm";
import Style from "../Common/Style";
import Settings from "./Settings/Settings";
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

const Edit = (props) => {
  const { attributes, setAttributes, clientId } = props;
  const { advanced } = attributes;
  const wrapperRef = React.useRef();
  const id = `register-form-${clientId}`;
  useAnimation(wrapperRef.current, advanced.animation);
  const updateObj = updateAttributes(attributes, setAttributes);
  return (
    <>
      <Settings {...{ attributes, setAttributes, updateObj }} />

      <div {...useBlockProps()} id={id}>
        <Style attributes={attributes} id={id} isBackend={true} />
        <div ref={wrapperRef} className="wp-block-b-blocks-register-form-wrapper">
          <RegisterForm attributes={attributes} isLoaderShow={true} isBackend={true} nonce={window.wpApiSettings.nonce} />
        </div>
      </div>
    </>
  );
};
export default Edit;

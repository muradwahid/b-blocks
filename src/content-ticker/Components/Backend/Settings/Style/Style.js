import { Fragment } from "react";
import ArrowStyles from "./StyleSettings/ArrowStyles";
import BadgeStyle from "./StyleSettings/BadgeStyle";
import ContentStyle from "./StyleSettings/ContentStyle";

const Style = (props) => {
  const { attributes, setAttributes, updateObj } = props;
  return (
    <Fragment>
      <BadgeStyle attributes={attributes} setAttributes={setAttributes} updateObj={updateObj} />
      <ContentStyle attributes={attributes} setAttributes={setAttributes} updateObj={updateObj} />
      <ArrowStyles attributes={attributes} setAttributes={setAttributes} updateObj={updateObj} />
    </Fragment>
  );
};
export default Style;

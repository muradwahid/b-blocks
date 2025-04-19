import { useBlockProps } from "@wordpress/block-editor";
import Style from "../Common/Style";
import Settings from "./Settings/Settings";
import SVGDrawBackend from "./SVGDrawBackend/SVGDrawBackend";

const Edit = (props) => {
  const { attributes, setAttributes, clientId } = props;
  const id = `svg-draw-${clientId}`;
  return (
    <>
      <Settings {...{ attributes, setAttributes }} />

      <div {...useBlockProps()} id={id}>
        <Style attributes={attributes} id={id} isBackend={true}/>
        <SVGDrawBackend attributes={attributes} />
      </div>
    </>
  );
};
export default Edit;

import SpotsStyle from "./SpotsStyle";
import TooltipStyle from "./TooltipStyle";

const Style = (props) => {
  const { attributes, setAttributes } = props;
  return (
    <>
      {/* <ImageStyle {...{ attributes, setAttributes }} /> */}
      <SpotsStyle {...{ attributes, setAttributes }} />
      <TooltipStyle {...{ attributes, setAttributes }} />
    </>
  );
};
export default Style;

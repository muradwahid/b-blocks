import SpotsStyle from "./SpotsStyle";
import TooltipStyle from "./TooltipStyle";

const Style = (props) => {
    const { attributes, setAttributes, updateObj } = props;
    return   <>
            {/* <ImageStyle {...{ attributes, setAttributes }} /> */}
            <SpotsStyle {...{ attributes, setAttributes, updateObj }} />
            <TooltipStyle {...{ attributes, setAttributes, updateObj }} />
        </> 
};
export default Style;

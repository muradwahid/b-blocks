import { HelpPanel } from "../../../../../../../bpl-tools/Components";
import Image from "./Image";
import Presets from "./Presets";
import Spots from "./Spots";
import Tooltip from "./Tooltip";

const General = (props) => {
  const { attributes, setAttributes, activeIdx, setActiveIdx } = props;

  return (
    <>
      <HelpPanel
        slug="b-blocks"
        docsLink="https://bplugins.com/docs/image-hotspot/guides/general"
      />
      <Image {...{ attributes, setAttributes }} />
      <Spots {...{ attributes, setAttributes, activeIdx, setActiveIdx }} />
      <Tooltip {...{ attributes, setAttributes }} />
      <Presets {...{ attributes, setAttributes }} />
    </>
  );
};
export default General;

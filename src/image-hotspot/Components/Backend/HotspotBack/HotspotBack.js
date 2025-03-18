import { produce } from "immer";
import { Fragment, useRef } from "react";
import Draggable from "./Draggable";
import { placeholderImg } from '../../../utils/icons';
const HotspotBack = ({
  attributes,
  setAttributes,
  activeIdx,
  setActiveIdx,
  isSelected
}) => {
  const { hotspot, image, preset, align } = attributes;
  const hotspotRef = useRef(null);

  return (
    <Fragment>
      <div
        ref={hotspotRef}
        style={{
          backgroundImage: `url(${image.url || placeholderImg})`,
        }}
        className="hotspot-image-wrapper"
        >
        {hotspot.map((el, i) =>
            <Draggable
            key={i}
            {...{activeIdx,setActiveIdx,preset,align,isSelected}}
              value={el.position}
              wrapperEl={hotspotRef.current}
              element={el}
              index={i}
              onChange={(val) =>
                setAttributes({
                  hotspot: produce(hotspot, (draft) => {
                    draft[i].position = val;
                  }),
                })
              }
            />
          )}
      </div>
    </Fragment>
  );
};

export default HotspotBack;

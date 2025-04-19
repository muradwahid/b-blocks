import { MediaPlaceholder, useBlockProps } from "@wordpress/block-editor";

import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { updateData } from "../../../../../bpl-tools/utils/functions";
import ImageScroller from "../Common/ImageScroller";
import Style from "../Common/Style";
import Settings from "./Settings/Settings";

const Edit = (props) => {
  const { attributes, setAttributes, clientId, device } = props;

  const { image } = attributes;

  return (
    <>
      <Settings {...{ attributes, setAttributes }} />

      <div {...useBlockProps()}>
        <Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />
        <div>
          <div>
            {
              image.img.url ?
                <ImageScroller attributes={attributes} device={device} /> : <MediaPlaceholder
                  allowedTypes={["image"]}
                  multiple={false}
                  labels={{
                    title: "Upload Image",
                  }}
                  accept="image/*"
                  addToGallery={true}
                  onSelect={(media) => {
                    setAttributes({ image: updateData(image, media, "img") });
                  }}
                />
            }
          </div>
        </div>
      </div>
    </>
  );
};
export default compose(
  withSelect((select) => {
    const { getDeviceType } = select('core/editor');

    return {
      device: getDeviceType()?.toLowerCase(),
    };
  })
)(Edit);
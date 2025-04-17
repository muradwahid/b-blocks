import { useRef } from "react";
import SVG from "react-inlinesvg";
import svgIcon from "../../../../../assets/icons/christmas-star-icon.svg";
import oktaIconSvg from "../../../../../assets/icons/okta-icon.svg";
import DynamicTag from "../../Backend/Settings/Panel/DynamicTag/DynamicTag";

const DualColorHeading = ({ attributes }) => {
  const { sortElements, heading, icon, separator, subHeading } =
    attributes;
  const headingRef = useRef(null);
  // useAnimation(headingRef.current, advanced?.animation);
  return (
    <div className="dch-dual-color-container" ref={headingRef}>
      {sortElements.map((el) => {
        switch (el) {
          case "heading":
            return (
              <DynamicTag
                tagName={heading.tag}
                className="dch-dual-color-title"
              >
                <span className="heading-first">{heading.first.text} </span>{" "}
                <span className="heading-last">{heading.last.text}</span>
              </DynamicTag>
            );
          case "separator":
            return (
              separator.show && (
                <div className="dch-separator-wrapper">
                  {separator.type === "line" && (
                    <>
                      <span className="separator-left"></span>
                      <span className="separator-right"></span>
                    </>
                  )}
                  {separator.type === "icon" && (
                    <>
                      {separator.iconType === "upload" && (
                        <span className="dch-separator-icon">
                          <SVG
                            src={
                              separator.icon?.upload
                                ? separator.icon.upload
                                : svgIcon
                            }
                          // width={separator.iconSize}
                          // height="auto"
                          />
                        </span>
                      )}
                      {separator.iconType === "library" && (
                        <span
                          className="dch-separator-icon"
                          dangerouslySetInnerHTML={{
                            __html: separator.icon?.library,
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              )
            );
          case "subHeading":
            return (
              <div
                className="dch-dual-color-subcontent"
                dangerouslySetInnerHTML={{ __html: subHeading.text }}
              ></div>
            );
          case "icon":
            return (
              icon.show && (
                <>
                  {icon.iconType === "upload" && (
                    <span className="dch-dual-color-icon-svg">
                      <SVG
                        src={icon.icon?.upload || oktaIconSvg}
                      />
                    </span>
                  )}
                  {
                    icon.iconType === "library" && <span className="dch-dual-color-icon-svg" dangerouslySetInnerHTML={{ __html: icon.icon.library }} />
                  }
                </>
              )
            );
        }
      })}
    </div>
  );
};

export default DualColorHeading;

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import DynamicTag from '../../../../../../bpl-tools/Components/DynamicTag/DynamicTag';
import NoHeading from "../../Common/NoHeading/NoHeading";
import TimelineStyle from "../../Common/Styles/TimelineStyle";
import useHeadingElements from "../../hooks/useHeadingElements";

const Timeline = ({ attributes, setAttributes, id }) => {
  const { title, slideTitle, tagName, sticky, headings } = attributes;
  const [contentsAttr, setContentsAttr] = useState();

  const { content, savedElements } = useHeadingElements(tagName, title.tag, title.text, ".tbcn-timeline-title-container", "tbcn-timeline-title");

  useEffect(() => {
    if (savedElements) {
      setAttributes({ headings: savedElements });
    }
  }, [savedElements]);

  return (
    <>
      <TimelineStyle attributes={attributes} id={id} />
      <div className={`tbcn-timeline-container ${sticky.toggle ? "sticky" : ""} ${sticky.horizonAlign} ${sticky.verticalAlign}`}>
        <div className="tbcn-timeline-title-container">
          <DynamicTag className="tbcn-timeline-title" style={{ color: slideTitle.titleColor }} tagName={title.tag} dangerouslySetInnerHTML={{ __html: title?.text }} />
        </div>
        <>
          {content?.length > 0 ? (
            <ul className="tbcn-timeline-list-items">
              {Array.from(content).map(
                (headingElement, idx) =>
                  headingElement.className !== "tbcn-timeline-title" && (
                    <>
                      <li className="tbcn-timeline-list" key={idx}>
                        <a onClick={() => setContentsAttr(idx)} className={`${idx === Number(contentsAttr) ? "item-active" : ""}`} href={`#bppb-heading-anchor-${idx}`}>
                          {headingElement.textContent}
                        </a>
                      </li>
                    </>
                  )
              )}
            </ul>
          ) : (
            <NoHeading />
          )}
        </>
      </div>
    </>
  );
};

export default Timeline;

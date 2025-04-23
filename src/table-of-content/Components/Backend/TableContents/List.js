import { useEffect, useState } from "react";
import DynamicTag from '../../../../../../bpl-tools/Components/DynamicTag/DynamicTag';
import NoHeading from "../../Common/NoHeading/NoHeading";
import ListStyle from "../../Common/Styles/ListStyle";
import useHeadingElements from "../../hooks/useHeadingElements";

const List = ({ attributes, setAttributes, id }) => {
  const { title, slideTitle, tagName, sticky } = attributes;
  const [contentsAttr, setContentsAttr] = useState();

  const { content, savedElements } = useHeadingElements(tagName, title.tag, title.text, ".list-title", "list-title-heading")

  useEffect(() => {
    if (savedElements) {
      setAttributes({ headings: savedElements });
    }
  }, [savedElements]);

  return (
    <>
      <ListStyle attributes={attributes} id={id} />
      <div className={`tbcn-list-container ${sticky.toggle ? "sticky" : ""} ${sticky.horizonAlign} ${sticky.verticalAlign}`}>
        <div className="list-title">
          <DynamicTag className="tbcn-list-title-heading" style={{ color: slideTitle.titleColor }} tagName={title.tag} dangerouslySetInnerHTML={{ __html: title?.text }} />
        </div>
        <>
          {content?.length > 0 ? (
            <div className="tbcn-list-items">
              {Array.from(content).map(
                (headingElement, idx) =>
                  headingElement.className !== "tbcn-list-title-heading" && (
                    <>
                      <p className="tbcn-list-item" key={idx}>
                        <a onClick={() => setContentsAttr(idx)} className={`${idx === Number(contentsAttr) ? "item-active" : ""}`} href={`#bppb-heading-anchor-${idx}`}>
                          {headingElement.textContent}
                        </a>
                      </p>
                    </>
                  )
              )}
            </div>
          ) : (
            <NoHeading />
          )}
        </>
      </div>
    </>
  );
};

export default List;

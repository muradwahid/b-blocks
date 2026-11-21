/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import DynamicTag from '../../../../../../bpl-tools/Components/DynamicTag/DynamicTag';
import NoHeading from "../../Common/NoHeading/NoHeading";
import TimelineStyle from "../../Common/Styles/TimelineStyle";
import useHeadingElements from "../../hooks/useHeadingElements";
import { sanitizeHtml } from '../../../../utils/sanitizeHtml';

const Timeline = ({ attributes, setAttributes, id }) => {
    const { title, slideTitle, tagName, sticky, headings } = attributes;
    const [contentsAttr, setContentsAttr] = useState();

    const { content, savedElements } = useHeadingElements(tagName, title.tag, title.text, ".bblocks-tbcn-timeline-title-container", "bblocks-tbcn-timeline-title");

    useEffect(() => {
        if (savedElements) {
            setAttributes({ headings: savedElements });
        }
    }, [savedElements]);

    return <>
        <TimelineStyle attributes={attributes} id={id} />
        <div className={`bblocks-tbcn-timeline-container ${sticky.toggle ? "sticky" : ""} ${sticky.horizonAlign} ${sticky.verticalAlign}`}>
            <div className="bblocks-tbcn-timeline-title-container">
                <DynamicTag className="bblocks-tbcn-timeline-title" style={{ color: slideTitle.titleColor }} tagName={title.tag} dangerouslySetInnerHTML={{ __html: sanitizeHtml( title?.text ) }} />
            </div>
            <>
                {content?.length > 0 ? (
                    <ul className="bblocks-tbcn-timeline-list-items">
                        {Array.from(content).map(
                            (headingElement, idx) =>
                                headingElement.className !== "bblocks-tbcn-timeline-title" && (
                                    <>
                                        <li className="bblocks-tbcn-timeline-list" key={idx}>
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
};

export default Timeline;

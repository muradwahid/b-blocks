import { useState } from "react";
import DynamicTag from '../../../../../bpl-tools/Components/DynamicTag/DynamicTag';
import NoHeading from "../Common/NoHeading/NoHeading";
import TimelineStyle from "../Common/Styles/TimelineStyle";
import useHeading from "../hooks/useHeading";
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

const TimelineFront = ({ attributes, id }) => {
    const { title, slideTitle, tagName, sticky, headings } = attributes;
    const [contentsAttr, setContentsAttr] = useState();
    const [rendered, setRendered] = useState(false);
    useHeading(tagName, headings)
    return <>
        <TimelineStyle attributes={attributes} id={id} />
        <div onClick={() => setRendered(!rendered)} className={`bblocks-tbcn-timeline-container ${sticky.toggle ? "sticky" : ""} ${sticky.horizonAlign} ${sticky.verticalAlign}  `}>
            <div className="bblocks-tbcn-timeline-title-container">
                <DynamicTag className="bblocks-tbcn-timeline-title" style={{ color: slideTitle.titleColor }} tagName={title.tag} dangerouslySetInnerHTML={{ __html: sanitizeHtml( title?.text ) }} />
            </div>
            <>
                {headings?.length > 0 ? (
                    <ul className="bblocks-tbcn-timeline-list-items">
                        {Array.from(headings).map((headingElement, idx) => (
                            <>
                                <li className="bblocks-tbcn-timeline-list" key={idx}>
                                    <a onClick={() => setContentsAttr(idx)} className={`${idx === Number(contentsAttr) ? "item-active" : ""}`} href={`#${headingElement.id}`}>
                                        {headingElement.contents}
                                    </a>
                                </li>
                            </>
                        ))}
                    </ul>
                ) : (
                    <NoHeading />
                )}
            </>
        </div>
    </>
};

export default TimelineFront;

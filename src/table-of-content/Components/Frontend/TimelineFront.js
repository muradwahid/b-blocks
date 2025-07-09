import { useState } from "react";
import DynamicTag from '../../../../../bpl-tools/Components/DynamicTag/DynamicTag';
import NoHeading from "../Common/NoHeading/NoHeading";
import TimelineStyle from "../Common/Styles/TimelineStyle";
import useHeading from "../hooks/useHeading";

const TimelineFront = ({ attributes, id }) => {
    const { title, slideTitle, tagName, sticky, headings } = attributes;
    const [contentsAttr, setContentsAttr] = useState();
    const [rendered, setRendered] = useState(false);
    useHeading(tagName, headings)
    return <>
        <TimelineStyle attributes={attributes} id={id} />
        <div onClick={() => setRendered(!rendered)} className={`tbcn-timeline-container ${sticky.toggle ? "sticky" : ""} ${sticky.horizonAlign} ${sticky.verticalAlign}  `}>
            <div className="tbcn-timeline-title-container">
                <DynamicTag className="tbcn-timeline-title" style={{ color: slideTitle.titleColor }} tagName={title.tag} dangerouslySetInnerHTML={{ __html: title?.text }} />
            </div>
            <>
                {headings?.length > 0 ? (
                    <ul className="tbcn-timeline-list-items">
                        {Array.from(headings).map((headingElement, idx) => (
                            <>
                                <li className="tbcn-timeline-list" key={idx}>
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

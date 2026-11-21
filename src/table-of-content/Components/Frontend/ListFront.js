import { useState } from "react";

import DynamicTag from '../../../../../bpl-tools/Components/DynamicTag/DynamicTag';
import NoHeading from "../Common/NoHeading/NoHeading";
import ListStyle from "../Common/Styles/ListStyle";
import useHeading from "../hooks/useHeading";
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

const ListFront = ({ attributes, id }) => {
    const { title, slideTitle, tagName, sticky, headings } = attributes;
    const [contentsAttr, setContentsAttr] = useState();
    useHeading(tagName, headings)
    return <>
        <ListStyle attributes={attributes} id={id} />
        <div className={`bblocks-tbcn-list-container ${sticky.toggle ? "sticky" : ""} ${sticky.horizonAlign} ${sticky.verticalAlign}`}>
            <div className="bblocks-tbcn-list-title">
                <DynamicTag className="bblocks-tbcn-list-title-heading" style={{ color: slideTitle.titleColor }} tagName={title.tag} dangerouslySetInnerHTML={{ __html: sanitizeHtml( title?.text ) }} />
            </div>
            <>
                {headings?.length > 0 ? (
                    <div className="bblocks-tbcn-list-items">
                        {Array.from(headings).map((headingElement, idx) => (
                            <>
                                <p className="bblocks-tbcn-list-item" key={idx}>
                                    <a onClick={() => setContentsAttr(idx)} className={`${idx === Number(contentsAttr) ? "item-active" : ""}`} href={`#${headingElement.id}`}>
                                        {headingElement.contents}
                                    </a>
                                </p>
                            </>
                        ))}
                    </div>
                ) : (
                    <NoHeading />
                )}
            </>
        </div>
    </>
};

export default ListFront;

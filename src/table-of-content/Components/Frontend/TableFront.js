import { useEffect, useRef, useState } from "react";
import DynamicTag from '../../../../../bpl-tools/Components/DynamicTag/DynamicTag';
import { bullets, collapseIcons, expandIcons } from "../../utils/commonOptions";
import NoHeading from "../Common/NoHeading/NoHeading";
import Style from "../Common/Styles/Style";
import useHeading from "../hooks/useHeading";
import RenderNestedList from '../Common/RenderNestedList';
import { headingTree } from '../../utils/functions';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

const TableFront = ({ attributes, id }) => {
    const accordion = useRef();
    const titleRef = useRef();
    const accordionPanel = useRef();
    const [toggle, setToggle] = useState(false);
    const [contentsAttr, setContentsAttr] = useState();
    const [accordionHeight, setAccordionHeight] = useState();
    const { header, title, tagName, minimize, markup, sticky, headings, isNested=false } = attributes;

    useHeading(tagName, headings)
    useEffect(() => {
        setAccordionHeight(accordionPanel?.current?.scrollHeight + "px");
    }, []);

    const nestedHeadings = isNested ? headingTree(attributes.headings) : attributes.headings;

    return <>
        <Style toggle={toggle} attributes={attributes} id={id} />
        <div ref={accordion} className={`bblocks-tbcn-accordion ${sticky.toggle ? "sticky" : ""} ${sticky.horizonAlign} ${sticky.verticalAlign}`}>
            <div ref={titleRef} onClick={() => setToggle(!toggle)} className="bblocks-tbcn-accordion-title">
                <DynamicTag className="bblocks-tbcn-content-table-title" style={{ margin: "0", color: header.txtColor }} tagName={title?.tag} dangerouslySetInnerHTML={{ __html: sanitizeHtml( title?.text ) }} />
                {/* {minimize.toggle && <>{!toggle ? <i style={{ color: header.iconColor }} className={minimize.collapseIcon}></i> : <i style={{ color: header.iconColor }} className={minimize.expandIcon}></i>}</>} */}
                {minimize.toggle && <>{!toggle ? collapseIcons.map(({ value: val, icon }) => val === minimize.collapseIcon && icon) : expandIcons.map(({ value: val, icon }) => val === minimize.expandIcon && icon)}</>}
            </div>
            <div
                ref={accordionPanel}
                style={{
                    height: toggle ? (minimize.toggle ? "0px" : accordionHeight) : accordionHeight,
                }}
                className="bblocks-tbcn-panel"
            >
                {headings?.length > 0 ? (<>
                    {/* <ol className="bblocks-tbcn-panel-table-container-order-list">
                        {headings.map(
                            (headingElement, idx) =>
                                headingElement.contents.length > 0 && (
                                    <>
                                        <li className="bblocks-tbcn-panel-table-list-items" onClick={() => setContentsAttr(idx)} key={idx}>
                                            {markup.view !== "decimal" && (
                                                <span>
                                                    {bullets.map(({ value: val, icon }) => val === markup.icon && icon)}
                                                </span>
                                            )}
                                            <a className={`bblocks-tbcn-table-content-anchor-list ${idx === contentsAttr ? "item-active" : ""}`} href={`#${headingElement.id}`}>
                                                {headingElement.contents}
                                            </a>
                                        </li>
                                    </>
                                )
                        )}
                    </ol> */}
                    <RenderNestedList
                        items={nestedHeadings}
                        markup={markup}
                        bullets={bullets}
                        contentsAttr={contentsAttr}
                        setContentsAttr={setContentsAttr}
                        className='bblocks-tbcn-panel-table-container-order-list'
                    />
                </>
                ) : (
                    <NoHeading />
                )}
            </div>
        </div>
    </>
};

export default TableFront;

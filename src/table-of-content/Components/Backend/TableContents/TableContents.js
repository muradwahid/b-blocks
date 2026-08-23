/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import DynamicTag from '../../../../../../bpl-tools/Components/DynamicTag/DynamicTag';
import { bullets, collapseIcons, expandIcons } from "../../../utils/commonOptions";
import NoHeading from "../../Common/NoHeading/NoHeading";
import Style from "../../Common/Styles/Style";
import useHeadingElements from "../../hooks/useHeadingElements";
import { headingTree } from '../../../utils/functions';
import RenderNestedList from '../../Common/RenderNestedList';
const TableContents = ({ attributes, setAttributes, id }) => {
    const [toggle, setToggle] = useState(true);
    // const [content, setContent] = useState([]);
    const [contentsAttr, setContentsAttr] = useState();
    const { boxList, header, title, tagName, minimize, markup, sticky, isNested = false } = attributes;

    const accordion = useRef();
    const titleRef = useRef();
    const accordionPanel = useRef();

    const { content, savedElements } = useHeadingElements(tagName, title.tag, title.text, '.bblocks-tbcn-accordion-title', 'bblocks-tbcn-content-table-title',accordion?.current);


    useEffect(() => {
        if (savedElements) {
            setAttributes({ headings: savedElements });
        }
    }, [savedElements]);

    useEffect(() => {
        const panel = accordionPanel.current;
        const handleClick = () => {
            const isPanelOpen = panel.style.height !== "0px";
            const newHeight = isPanelOpen ? "0px" : `${panel.scrollHeight}px`;

            panel.style.height = newHeight;
            setToggle(!isPanelOpen);
        };

        if (minimize.toggle) {
            titleRef.current.addEventListener("click", handleClick);
        }


        // Cleanup listener on unmount
        return () => titleRef.current?.removeEventListener("click", handleClick);
    }, [JSON.stringify(boxList), boxList.maxHeight, title.tag, tagName, markup.view, minimize.toggle]);

    // console.log("headings : ", headingTree(attributes.headings))
    const nestedHeadings = isNested ? headingTree(attributes.headings) : attributes.headings;
    return <>
        <Style attributes={attributes} id={id} />
        <div ref={accordion} className={`bblocks-tbcn-accordion ${sticky.toggle ? "sticky" : ""} ${sticky.horizonAlign} ${sticky.verticalAlign}  `}>
            <div ref={titleRef} className="bblocks-tbcn-accordion-title">
                <DynamicTag className="bblocks-tbcn-content-table-title" style={{ margin: "0", color: header.txtColor }} tagName={title?.tag} dangerouslySetInnerHTML={{ __html: title?.text }} />
                {/* {minimize.toggle && <>{toggle ? <i style={{ color: header.iconColor }} className={minimize.collapseIcon}></i> : <i style={{ color: header.iconColor }} className={minimize.expandIcon}></i>}</>} */}

                {minimize.toggle && <>{toggle ? collapseIcons.map(({ value: val, icon }, idx) => val === minimize.collapseIcon && <span key={`expand-${idx}`}>{icon}</span>) : expandIcons.map(({ value: val, icon }, idx) => val === minimize.expandIcon && <span key={`expand-${idx}`}>{icon}</span>)}</>}
            </div>
            <div ref={accordionPanel} className="bblocks-tbcn-panel" >
                {content?.length > 1 ? (<>
                    {/* <ol className="bblocks-tbcn-panel-table-container-order-list">
                        {Array.from(content).map(
                            (headingElement, idx) =>
                                headingElement.className !== "bblocks-tbcn-content-table-title" &&
                                headingElement.textContent.length > 1 &&  <li className="bblocks-tbcn-panel-table-list-items" onClick={() => setContentsAttr(idx)} key={JSON.stringify(headingElement.textContent)+1}>
                                            {markup.view !== "decimal" && <span>
                                                {bullets.map(({ value: val, icon }) => val === markup.icon && icon)}
            
                                            </span>}
                                            <a className={`bblocks-tbcn-table-content-anchor-list ${idx === contentsAttr ? "item-active" : ""}`} href={`#bppb-heading-anchor-${idx}`}>
                                                {headingElement.textContent}
                                            </a>
                                </li>
                                
                        )}
                    </ol> */}
                    <RenderNestedList
                        items={nestedHeadings}
                        markup={markup}
                        bullets={bullets}
                        contentsAttr={contentsAttr}
                        setContentsAttr={setContentsAttr}
                    />
                </>
                ) : (
                    <NoHeading />
                )}
            </div>
        </div>
    </>
};

export default TableContents;

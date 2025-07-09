/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import DynamicTag from '../../../../../../bpl-tools/Components/DynamicTag/DynamicTag';
import { bullets, collapseIcons, expandIcons } from "../../../utils/commonOptions";
import NoHeading from "../../Common/NoHeading/NoHeading";
import Style from "../../Common/Styles/Style";
import useHeadingElements from "../../hooks/useHeadingElements";
const TableContents = ({ attributes, setAttributes, id }) => {
    const [toggle, setToggle] = useState(true);
    // const [content, setContent] = useState([]);
    const [contentsAttr, setContentsAttr] = useState();
    const { boxList, header, title, tagName, minimize, markup, sticky } = attributes;

    const { content, savedElements } = useHeadingElements(tagName, title.tag, title.text, '.tbcn-accordion-title', 'tbcn-content-table-title');


    useEffect(() => {
        if (savedElements) {
            setAttributes({ headings: savedElements });
        }
    }, [savedElements]);

    const accordion = useRef();
    const titleRef = useRef();
    const accordionPanel = useRef();

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
    return <>
            <Style attributes={attributes} id={id} />
            <div ref={accordion} className={`tbcn-accordion ${sticky.toggle ? "sticky" : ""} ${sticky.horizonAlign} ${sticky.verticalAlign}  `}>
                <div ref={titleRef} className="tbcn-accordion-title">
                    <DynamicTag className="tbcn-content-table-title" style={{ margin: "0", color: header.txtColor }} tagName={title?.tag} dangerouslySetInnerHTML={{ __html: title?.text }} />
                    {/* {minimize.toggle && <>{toggle ? <i style={{ color: header.iconColor }} className={minimize.collapseIcon}></i> : <i style={{ color: header.iconColor }} className={minimize.expandIcon}></i>}</>} */}

                    {minimize.toggle && <>{toggle ? collapseIcons.map(({ value: val, icon }) => val === minimize.collapseIcon && icon) : expandIcons.map(({ value: val, icon }) => val === minimize.expandIcon && icon)}</>}
                </div>
                <div ref={accordionPanel} className="tbcn-panel" >
                    {content?.length > 1 ? (
                        <ol className="tbcn-panel-table-container-order-list">
                            {Array.from(content).map(
                                (headingElement, idx) =>
                                    headingElement.className !== "tbcn-content-table-title" &&
                                    headingElement.textContent.length > 1 && (
                                        <>
                                            <li className="tbcn-panel-table-list-items" onClick={() => setContentsAttr(idx)} key={idx}>
                                                {markup.view !== "decimal" && <span>
                                                    {bullets.map(({ value: val, icon }) => val === markup.icon && icon)}
                                                    {/* <i style={{ fontSize: "10px" }} className={`${markup.icon}`}></i> */}
                                                </span>}
                                                <a className={`tbcn-table-content-anchor-list ${idx === contentsAttr ? "item-active" : ""}`} href={`#bppb-heading-anchor-${idx}`}>
                                                    {headingElement.textContent}
                                                </a>
                                            </li>
                                        </>
                                    )
                            )}
                        </ol>
                    ) : (
                        <NoHeading />
                    )}
                </div>
            </div>
        </> 
};

export default TableContents;

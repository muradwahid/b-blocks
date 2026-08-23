import { useEffect, useRef, useState } from "react";
import { CaretDown, IconBan } from "../../../../utils/icons";
import "./style.scss";
const IconPicker = ({ icons, label, default: defaultIcon, renderFunction, value }) => {
    const [popoverVisible, setPopoverVisible] = useState(false);
    const iconCompRef = useRef();
    const btnRef = useRef(null);
    useEffect(() => {
        const handle = (e) => {
            if (!btnRef?.current?.contains(e.target) && !iconCompRef?.current?.contains(e.target)) {
                setPopoverVisible(false);
            }
        };
        document.addEventListener("mousedown", handle);
        return () => {
            document.removeEventListener("mousedown", handle);
        };
    });
    return <div className="bblocks-tbcn-iconPicker-main-wrapper">
        <div className="bblocks-tbcn-iconPicker-wrapper" >
            <p style={{ width: "50%", margin: "0" }}>{label}</p>
            <div className="bblocks-tbcn-iconPicker" >
                <div onClick={() => renderFunction(defaultIcon)} className="single-icon-admin-panel">
                    <IconBan />
                </div>
                <div ref={btnRef} onClick={() => setPopoverVisible(!popoverVisible)} className="single-icon-admin-panel selectIcon">
                    {icons.map(({ value: val, icon }) => val === value && icon)}
                </div>
            </div>
        </div>
        {popoverVisible && (
            // <Popover ref={iconComp} className="bblocks-tbcn-popover-icon-picker-admin">
            <div ref={iconCompRef} className="bblocks-tbcn-iconPicker-popover-icons" >
                {icons &&
                    icons.map((icon, idx) => (
                        <div onClick={() => renderFunction(icon.value)} key={idx} className={`bblocks-tbcn-single-icon-picker-admin ${icon.value === value ? "selectIcon" : ""}`}>
                            <div className="bblocks-tbcn-icon-picker-tooltip-container">
                                <div className="bblocks-tbcn-icon-picker-tooltip">
                                    <span>{icon.label}</span>
                                    <CaretDown />
                                </div>
                            </div>
                            {icon.icon}
                            {/* <i className={`${icon.value}`}></i> */}
                        </div>
                    ))}
            </div>
            // </Popover>
        )}
    </div>
};

export default IconPicker;

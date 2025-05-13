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
    return  <div className="tbcn-iconPicker-main-wrapper">
            <div className="tbcn-iconPicker-wrapper" >
                <p style={{ width: "50%", margin: "0" }}>{label}</p>
                <div className="tbcn-iconPicker" >
                    <div onClick={() => renderFunction(defaultIcon)} className="single-icon-admin-panel">
                        <IconBan />
                    </div>
                    <div ref={btnRef} onClick={() => setPopoverVisible(!popoverVisible)} className="single-icon-admin-panel selectIcon">
                        {icons.map(({ value: val, icon }) => val === value && icon)}
                    </div>
                </div>
            </div>
            {popoverVisible && (
                // <Popover ref={iconComp} className="tbcn-popover-icon-picker-admin">
                <div ref={iconCompRef} className="tbcn-iconPicker-popover-icons" >
                    {icons &&
                        icons.map((icon, idx) => (
                            <div onClick={() => renderFunction(icon.value)} key={idx} className={`tbcn-single-icon-picker-admin ${icon.value === value ? "selectIcon" : ""}`}>
                                <div className="tbcn-icon-picker-tooltip-container">
                                    <div className="tbcn-icon-picker-tooltip">
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

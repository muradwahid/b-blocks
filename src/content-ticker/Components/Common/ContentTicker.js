import React from "react";
import { arrows as arrowIcons } from "../../utils/arrows";
import Ticker from "./Ticker";

const ContentTicker = ({ attributes }) => {
    const { animation, arrows, badge } = attributes;
    return <div className="cttk-ticker-wrapper">
        <div className="cttk-ticker-swiper-wrapper">
            <div className="cttk-ticker-badge">{badge.text}</div>
            <Ticker attributes={attributes} />
            {animation.isArrows && (
                <>
                    {arrowIcons[arrows.icon].left}
                    {arrowIcons[arrows.icon].right}
                </>
            )}
        </div>
    </div>
};

export default ContentTicker;

import { useBlockProps } from "@wordpress/block-editor";
import { useRef, useState } from "react";

// import useAnimation from "../../../../bpl-tools/hooks/useAnimation";

import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Style from "../Common/Style";
import HotspotBack from "./HotspotBack/HotspotBack";
import Settings from "./Settings/Settings";
import usePremiumInEditor from '../../../hooks/usePremiumInEditor';

const Edit = (props) => {
    const { attributes, setAttributes, clientId, isSelected, device } = props;
    const { image } = attributes;
    const [activeIdx, setActiveIdx] = useState(0);
    const mainElRef = useRef(null);
    // useAnimation(mainElRef, attributes?.animation);

    const { isPremium = false } = usePremiumInEditor();

    const updateObj = updateAttributes(attributes, setAttributes);
    return <>
        <Settings {...{ attributes, setAttributes, activeIdx, setActiveIdx, updateObj, isPremium }} />

        <div ref={mainElRef} {...useBlockProps()} onDragStart={(event) => event.stopPropagation()} draggable={false}>
                <div>
                    <Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />

                    <HotspotBack key={`${JSON.stringify(image.width)}-${device}`} {...{ attributes, setAttributes, activeIdx, setActiveIdx, isSelected }} />

                </div>
            </div>
        </> 
};
export default compose(
    withSelect((select) => {
        const { getDeviceType } = select('core/editor');

        return {
            device: getDeviceType()?.toLowerCase(),
        };
    })
)(Edit);

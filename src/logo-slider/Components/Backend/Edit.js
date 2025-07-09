import { MediaPlaceholder, useBlockProps } from "@wordpress/block-editor";
import { withDispatch } from "@wordpress/data";
import { useState } from "react";
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Style from "../Common/Style";
import ContentBlockControl from "./Settings/General/ContentBlockControl";
import Settings from "./Settings/Settings";
import SliderBackend from "./SliderBackend/SliderBackend";
import usePremiumInEditor from '../../../hooks/usePremiumInEditor';

const Edit = (props) => {
    const { attributes, setAttributes, clientId, selectBlock } = props;
    const { logo, options } = attributes;
    const [activeIndex, setActiveIndex] = useState(0);
    const updateObj = updateAttributes(attributes, setAttributes);

    const { isPremium = false } = usePremiumInEditor();

    return <>
        <Settings {...{ attributes, setAttributes, updateObj, activeIndex, setActiveIndex, isPremium }} />
        <ContentBlockControl {...{ setAttributes, attributes, activeIndex, setActiveIndex, updateObj }} />

        <div {...useBlockProps()} onClick={() => selectBlock(clientId)}>
            <Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />

            {logo.length > 0 ? <SliderBackend key={`${logo?.length}-${JSON.stringify(options)}`} {...{ attributes, setAttributes, activeIndex, setActiveIndex }} /> : <MediaPlaceholder allowedTypes={["image"]} multiple={true} labels={{ title: "Upload Logo" }} accept="image/*" addToGallery={true} onSelect={(media) => { setAttributes({ logo: media }) }} />}

        </div>
    </>
};
export default withDispatch((dispatch, ownProps) => {
    return {
        selectBlock: () => {
            dispatch('core/block-editor').selectBlock(ownProps.clientId);
        }
    };
})(Edit)
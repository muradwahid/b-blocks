import { MediaUpload, MediaUploadCheck, useBlockProps } from "@wordpress/block-editor";
import { withDispatch } from "@wordpress/data";
import { useState } from "react";
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Style from "../Common/Style";
import ContentBlockControl from "./Settings/General/ContentBlockControl";
import Settings from "./Settings/Settings";
import SliderBackend from "./SliderBackend/SliderBackend";
import usePremiumInEditor from '../../../hooks/usePremiumInEditor';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { Button } from '../../../../../bpl-tools/Components';

const Edit = (props) => {
    const { attributes, setAttributes, clientId, selectBlock, device } = props;
    const { logo, options } = attributes;
    const [activeIndex, setActiveIndex] = useState(0);
    const updateObj = updateAttributes(attributes, setAttributes);

    const { isPremium = false } = usePremiumInEditor();

    return <>
        <Settings {...{ attributes, setAttributes, updateObj, activeIndex, setActiveIndex, isPremium }} />
        <ContentBlockControl {...{ setAttributes, attributes, activeIndex, setActiveIndex, updateObj }} />

        <div {...useBlockProps()} onClick={() => selectBlock(clientId)}>
            <Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />

            {logo.length > 0 ? <SliderBackend key={`${device}-${JSON.stringify(logo?.length)}-${JSON.stringify(options)}-${JSON.stringify(options?.logoView)}`} {...{ attributes, setAttributes, activeIndex, setActiveIndex }} /> : <div className="b-blocks-logo-slider-media-upload-placeholder">
                <MediaUploadCheck>
                    <h4 className='b-blocks-logo-slider-media-upload-title'>Upload Logo(s)</h4>
                    <MediaUpload allowedTypes={["image"]} multiple={true} gallery={true} value={logo.map((img) => img.id)} onSelect={media =>setAttributes({ logo: media })} render={({ open }) => (
                        <Button onClick={open} variant="primary" >
                            Media Library
                        </Button>
                    )} />
            </MediaUploadCheck>
            </div>
            }

        </div>
    </>
};
export default compose(
    withSelect((select) => {
        const { getDeviceType } = select('core/editor');

        return {
            device: getDeviceType()?.toLowerCase(),
        };
    }),
    withDispatch((dispatch, ownProps) => {
        return {
            selectBlock: () => {
                dispatch('core/block-editor').selectBlock(ownProps.clientId);
            }
        };
    })
)(Edit)

import { BlockControls, MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Button, ToolbarGroup, ToolbarItem } from "@wordpress/components";

function ContentBlockControl({ setAttributes, attributes, activeIndex, setActiveIndex }) {

    const { logo } = attributes;

    const itemRight = () => {
        const copyImg = [...logo];
        const changeOrder = copyImg.splice(activeIndex, 1);
        copyImg.splice(Number(activeIndex) + 1, 0, changeOrder[0]);
        setAttributes({ logo: copyImg });
        setActiveIndex(prev => ++prev)
    };
    const itemLeft = () => {
        const copyImg = [...logo];
        const changeOrder = copyImg.splice(activeIndex, 1);
        copyImg.splice(Number(activeIndex) - 1, 0, changeOrder[0]);
        setAttributes({ logo: copyImg });
        setActiveIndex(prev => --prev)
    };

    return <BlockControls>
        {logo.length > 0 && (
            <MediaUploadCheck>
                <MediaUpload onSelect={(value) => setAttributes({ logo: value })} allowedTypes={["image/*"]} value={logo?.map((value) => value?.id)} render={({ open }) => <button onClick={open}>Add new logo</button>} gallery={true} multiple={true} />
            </MediaUploadCheck>
        )}
        {logo?.length > 0 && <ToolbarGroup>
            <ToolbarItem disabled={activeIndex === 0 ? true : false} icon="arrow-left-alt2" onClick={itemLeft} as={Button} ></ToolbarItem>
            <ToolbarItem disabled={activeIndex === logo.length - 1 ? true : false} icon="arrow-right-alt2" onClick={itemRight} as={Button} ></ToolbarItem>
        </ToolbarGroup>}
    </BlockControls>
}

export default ContentBlockControl;

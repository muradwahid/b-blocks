import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { MediaUpload, MediaUploadCheck, MediaPlaceholder } from '@wordpress/block-editor';
import { Button, ToolbarItem, withNotices, TextControl, SelectControl, PanelRow } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';

import './ImageControl.scss';

import Title from './Title';
import func from '../Const/functions';
const { getImageSizes } = func;

// Media Holder Control
export const ImageHolderControl = props => {
    const { className, label = __('Image:', 'b-blocks'), img = {}, onChange } = props;

    const onImageSelect = ({ id, url, alt, title }) => onChange({ ...img, id, url, alt, title });

    return <div className={className}>
        <Title mt='0'>{label}</Title>

        <div className='editImageHolder'>
            <div className='mediaControl'>
                <MediaUpload allowedTypes={['image']} value={img?.id} onSelect={onImageSelect} render={({ open }) =>
                    !img.id ? <div className='btnControl'>
                        <Button icon='upload' onClick={open}>{__('Upload', 'b-blocks')}</Button>
                    </div> : <div className='btnControl'>
                        <Button icon='controls-repeat' onClick={open}>{__('Replace', 'b-blocks')}</Button>
                        <Button icon='exit' onClick={() => onChange({})} className='btnRed'>{__('Remove', 'b-blocks')}</Button>
                    </div>} />
            </div>

            <img src={img?.url} alt={img?.alt || img?.title} />
        </div>
    </div>;
};


// Media Edit Control
export const ImageEditControl = props => {
    const { label = __('Edit Image:', 'b-blocks'), img = {}, onChange } = props;

    const onImageSelect = ({ id, url, alt, title }) => onChange({ ...img, id, url, alt, title });

    return <>
        {img?.url && <ToolbarItem>
            {img?.id && <MediaUploadCheck>
                <MediaUpload allowedTypes={['image']} value={img?.id} onSelect={onImageSelect} render={({ open }) => {
                    return <Button className='components-icon-button components-toolbar__control' label={label} icon='edit' onClick={open} />
                }} />
            </MediaUploadCheck>}
        </ToolbarItem>}
    </>
};


// Image Placeholder
export const ImagePlaceholder = withNotices(props => {
    const { label = __(' Image:', 'b-blocks'), icon = 'format-image', img = {}, onChange, noticeOperations, noticeUI } = props;

    const onImageSelect = ({ id, url, alt, title }) => onChange({ ...img, id, url, alt, title });

    return <MediaPlaceholder labels={{ title: label }} icon={icon} allowedTypes={['image']} accept='image/*' onSelect={onImageSelect} onSelectURL={val => onChange({ ...img, id: null, url: val, alt: '', title: '' })} onError={val => noticeOperations.createErrorNotice(val)} notices={noticeUI} />
});


// Image Data
export const ChangeImageData = withSelect((select, props) => {
    const { img } = props;

    return {
        image: img?.id ? select('core').getMedia(img?.id) : null,
        imageSizes: select('core/block-editor').getSettings().imageSizes
    }
})(props => {
    const { className, img = {}, onChange, image, imageSizes } = props;

    const setValue = (property, val) => onChange({ ...img, [property]: val });

    return <div className={className}>
        {img?.url && !isBlobURL(img?.url) && <>
            <Title mt='0'>{__('Alt Text (Alternative Text):', 'b-blocks')}</Title>
            <TextControl value={img?.alt} onChange={val => setValue('alt', val)} />
        </>}

        {img?.id && <PanelRow className='mt-20p'>
            <Title mt='0' mb='0'>{__('Select Size:', 'b-blocks')}</Title>
            <SelectControl value={img?.url} onChange={val => setValue('url', val)} options={getImageSizes(image, imageSizes)} />
        </PanelRow>}
    </div>
});
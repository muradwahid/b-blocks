import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck, MediaPlaceholder } from '@wordpress/block-editor';
import { Button, ToolbarGroup, withNotices } from '@wordpress/components';

import './ImageControl.sass';

import Title from './Title';

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
        {img?.url && <ToolbarGroup>
            {img?.id && <MediaUploadCheck>
                <MediaUpload allowedTypes={['image']} value={img?.id} onSelect={onImageSelect} render={({ open }) => {
                    return <Button className='components-icon-button components-toolbar__control' label={label} icon='edit' onClick={open} />
                }} />
            </MediaUploadCheck>}
        </ToolbarGroup>}
    </>
};


// Image Placeholder
export const ImagePlaceholder = withNotices((props) => {
    const { label = __(' Image:', 'b-blocks'), icon = 'format-image', img = {}, onChange, noticeOperations, noticeUI } = props;

    const onImageSelect = ({ id, url, alt, title }) => onChange({ ...img, id, url, alt, title });

    return <MediaPlaceholder labels={{ title: label }} icon={icon} allowedTypes={['image']} accept='image/*' onSelect={onImageSelect} onSelectURL={val => onChange({ ...img, id: null, url: val, alt: '', title: '' })} onError={val => noticeOperations.createErrorNotice(val)} notices={noticeUI} />
});
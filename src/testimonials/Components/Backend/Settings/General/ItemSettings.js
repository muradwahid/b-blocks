import { TextareaControl, TextControl, __experimentalNumberControl as NumberControl } from '@wordpress/components'
import { InlineDetailMediaUpload, Label } from '../../../../../../../bpl-tools/Components'
import { __ } from '@wordpress/i18n'
import { produce } from 'immer'

const ItemSettings = (props) => {
    const { attributes, setAttributes,index } = props;
    const { items } = attributes;
    const { img, name, reviewText, deg, rating } = items[index] || {};

    const updateItem = (type, val, childType = false) => {
        const newItems = produce(items, draft => {
            if (childType) {
                draft[index][type][childType] = val;
            } else {
                draft[index][type] = val;
            }
        });
        setAttributes({ items: newItems });
    }
    return <>
            <Label>{__('Image:', 'b-testimonials-block')}</Label>
            <InlineDetailMediaUpload value={img} type={['image']} onChange={val => updateItem('img', val)} placeholder={__('Enter Image URL', 'b-testimonials-block')} />

            <TextControl className='mt10' label={__('Name', 'b-testimonials-block')} value={name} onChange={val => updateItem('name', val)} />

            <TextControl className='mt10' label={__('Designation', 'b-testimonials-block')} value={deg} onChange={val => updateItem('deg', val)} />

            <TextareaControl className='mt10' label={__('Review', 'b-testimonials-block')} value={reviewText} onChange={val => updateItem('reviewText', val)} />

            <NumberControl className='mt10' label={__('Rating:', 'b-testimonials-block')} labelPosition='left' value={rating} onChange={val => updateItem('rating', val)} min={1} max={5} />
    </>
}

export default ItemSettings
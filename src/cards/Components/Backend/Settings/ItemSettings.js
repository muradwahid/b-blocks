import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { Background, ColorControl, InlineDetailMediaUpload, Label } from '../../../../../../bpl-tools/Components';
import { BorderControl } from '../../../../../../bpl-tools/Components/Deprecated';
import { updateData } from '../../../../../../bpl-tools/utils/functions';

const ItemSettings = (props) => {
	const { attributes, setAttributes, index } = props;
	const { cards } = attributes;
	const card = cards[index];
	const { background, img, imgBorder, catColor, titleColor, descColor, cardLink } = card;

	const updateCard = (key, value) => {
		setAttributes({ cards: updateData(cards, value, index, key) });
	}
	return (
		<>
			<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => updateCard('background', val)} />

			<Label>{__('Image:', 'b-blocks')}</Label>
			<InlineDetailMediaUpload value={img} onChange={val => updateCard('img', val)} placeholder={__('Enter Image URL', 'b-blocks')} />

			<BorderControl label={__('Image Border:', 'b-blocks')} value={imgBorder} onChange={val => updateCard('imgBorder', val)} defaults={{ radius: '5px' }} />

			<ColorControl label={__('Category Color:', 'b-blocks')} value={catColor} onChange={val => updateCard('catColor', val)} defaultColor='#0dcaf0' />

			<ColorControl label={__('Title Color:', 'b-blocks')} value={titleColor} onChange={val => updateCard('titleColor', val)} defaultColor='#ff7500' />

			<ColorControl label={__('Description Color:', 'b-blocks')} value={descColor} onChange={val => updateCard('descColor', val)} defaultColor='#333' />

			<TextControl className='mt10' label={__('Link:', 'b-blocks')} value={cardLink} onChange={val => updateCard('link', val)} />
			<span>{__('Insert the link if you want; otherwise, leave it blank.', 'b-blocks')}</span>
		</>
	);
};

export default ItemSettings;
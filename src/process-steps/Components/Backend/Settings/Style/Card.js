import { __ } from '@wordpress/i18n';
import { PanelBody, BorderBoxControl } from '@wordpress/components';

import { Background, BoxControl, ShadowControl } from '../../../../../../../bpl-tools/Components';

const Card = ({ attributes, updateObj }) => {

	const { card = {} } = attributes;
	const { bg, padding = {}, borderRadius = {}, border = {} } = card;

	return <PanelBody className='bPlPanelBody' title={__('Card Style', 'b-blocks')} initialOpen={false}>

		<Background label={__('Background', 'b-blocks')} value={bg} onChange={val => updateObj('card', val, 'bg')} />

		<BoxControl label={__('Padding', 'b-blocks')} values={padding} onChange={val => updateObj('card', val, 'padding')} />

		<BorderBoxControl label={__('Border', 'b-blocks')} value={border} onChange={val => updateObj('card', val, 'border')} />

		<BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} values={borderRadius} onChange={val => updateObj('card', val, 'borderRadius')} />

		<ShadowControl label={__('Shadow', 'b-blocks')} value={card.shadow} onChange={val => updateObj('card', val, 'shadow')} />

	</PanelBody>;
};

export default Card;

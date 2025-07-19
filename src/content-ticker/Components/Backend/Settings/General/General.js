import { __experimentalInputControl as InputControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ItemsPanel } from '../../../../../../../bpl-tools/Components';
import { arrowStyles } from '../../../../utils/options';
import ButtonGroupController from '../Panel/ButtonGroupController';
import ItemSettings from '../Panel/ItemSettings';
import AnimationSettings from './AnimationSettings';
const General = ({ attributes, setAttributes, updateObj }) => {
	const { badge, content, arrows } = attributes;
	const newItem = {
		text: `Ticker custom content ${content.length + 1}`,
		link: '#',
		toggle: false,
	}
	return <>
		<PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={true}>
			<InputControl label={__('Badge Text', 'b-blocks')} className='mt5' value={badge.text} onChange={(value) => updateObj('badge', value, 'text')} />

			<ItemsPanel {...{ attributes, setAttributes }} newItem={newItem} design='sortable' itemLabel='Item' arrKey='content' title='text' ItemSettings={ItemSettings} />
		</PanelBody>

		<AnimationSettings {...{ attributes, updateObj }} />

		<PanelBody className='bPlPanelBody' title={__('Arrows', 'b-blocks')} initialOpen={false}>
			<ButtonGroupController label={__('Arrow Style:', 'slider')} value={arrows.icon} onChange={(arrow) => updateObj('arrows', arrow, 'icon')} options={arrowStyles} />
		</PanelBody>
	</>
};

export default General;

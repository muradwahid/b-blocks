import { __ } from '@wordpress/i18n';

import { IconLibrary, Notice } from '../../../../../../../bpl-tools/Components';
import { PanelBody, SelectControl } from '@wordpress/components';

const Icons = ({ attributes, updateObj }) => {
	const { icons = {} } = attributes;

	return <PanelBody
		className='bPlPanelBody'
		title={__('Icons', 'b-blocks')}
		initialOpen={false}
	>
		<SelectControl
			label={__('Positive (yes) icon', 'b-blocks')}
			value={icons.check || 'check'}
			options={[
				{ label: __('Check mark', 'b-blocks'), value: 'check' },
				{ label: __('Check inside circle', 'b-blocks'), value: 'check-circle' },
			]}
			onChange={(val) => updateObj('icons', val, 'check')}
			__nextHasNoMarginBottom
		/>

		<SelectControl
			label={__('Negative (no) icon', 'b-blocks')}
			value={icons.cross || 'times'}
			options={[
				{ label: __('Cross / X', 'b-blocks'), value: 'times' },
				{ label: __('X inside circle', 'b-blocks'), value: 'times-circle' },
			]}
			onChange={(val) => updateObj('icons', val, 'cross')}
			__nextHasNoMarginBottom
		/>

		<hr />

		<IconLibrary
			label={__('Custom “Yes” Icon', 'b-blocks')}
			value={icons.checkSvg}
			onChange={(val) => updateObj('icons', val, 'checkSvg')}
		/>

		<IconLibrary
			className='mt10'
			label={__('Custom “No” Icon', 'b-blocks')}
			value={icons.crossSvg}
			onChange={(val) => updateObj('icons', val, 'crossSvg')}
		/>

		{(icons.checkSvg || icons.crossSvg) && <Notice status='info' isIcon={true}>
			{__('A library icon overrides the built-in shape above. Clear it to go back.', 'b-blocks')}
		</Notice>}
	</PanelBody>;
};
export default Icons;

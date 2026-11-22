import { __ } from '@wordpress/i18n';
import { CheckboxControl, PanelBody, SelectControl, TextControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { PRESET_STYLES } from '../../../../utils/presets';
import { presetOptions } from '../../../../utils/options';

const GeneralOptions = ({ attributes, setAttributes, updateObj, postTypes }) => {
	const { preset = 'preset-1', search = {}, totalResults = {}, viewAll = {}, button = {} } = attributes;
	const { postType = 'all', postTypes: chosenTypes = [], initialResult = 5, notFoundText = '' } = search;
	const { show: showTotal = true, text: totalText = '', textOne: totalTextOne = '' } = totalResults;
	const { show: showViewAll = true, text: viewAllText = '', always: viewAllAlways = false } = viewAll;
	const { show: showButton = true } = button;

	return <PanelBody className='bPlPanelBody' title={__('General', 'b-blocks')} initialOpen={true}>
		<SelectControl
			label={__('Preset', 'b-blocks')}
			help={__('Sets every style to the preset look. Texts and General options stay.', 'b-blocks')}
			value={preset}
			options={presetOptions}
			onChange={(val) => {
				const presetData = PRESET_STYLES[val] || {};
				const { buttonPosition: newBtnPos = 'separate', ...presetStyles } = presetData;
				setAttributes({
					preset: val,
					...presetStyles,
					button: {
						...button,
						position: newBtnPos
					}
				});
			}}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>

		<SelectControl className='mt10' label={__('Search For Post Types', 'b-blocks')} value={postType} options={[{ label: __('All', 'b-blocks'), value: 'all' }, ...postTypes, { label: __('Several types…', 'b-blocks'), value: 'multiple' }]} onChange={(val) => updateObj('search', val, 'postType')} labelPosition='edge' __next40pxDefaultSize __nextHasNoMarginBottom />
		{'multiple' === postType && <div className='mt10'>
			{postTypes.map((type) => <CheckboxControl key={type.value} label={type.label} checked={chosenTypes.includes(type.value)} onChange={(checked) => updateObj('search', checked ? [...chosenTypes, type.value] : chosenTypes.filter((t) => t !== type.value), 'postTypes')} __nextHasNoMarginBottom />)}
			{!chosenTypes.length && <p className='components-base-control__help'>{__('None chosen: all post types are searched.', 'b-blocks')}</p>}
		</div>}

		<ToggleControl
			className='mt10'
			label={__('Show Total Results', 'b-blocks')}
			checked={showTotal}
			onChange={(val) => updateObj('totalResults', val, 'show')}
		/>
		{showTotal && <>
			<TextControl
				className='mt10'
				label={__('Total Results Text', 'b-blocks')}
				help={__('Total result count will be displayed in place of [post_count].', 'b-blocks')}
				value={totalText}
				onChange={(val) => updateObj('totalResults', val, 'text')}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
			<TextControl
				className='mt10'
				label={__('One Result Text', 'b-blocks')}
				help={__('Used when exactly one result is found.', 'b-blocks')}
				value={totalTextOne}
				onChange={(val) => updateObj('totalResults', val, 'textOne')}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		</>}

		<ToggleControl
			className='mt10'
			label={__('Show View All Button', 'b-blocks')}
			checked={showViewAll}
			onChange={(val) => updateObj('viewAll', val, 'show')}
		/>
		{showViewAll && <>
			<TextControl
				className='mt10'
				label={__('Button Text', 'b-blocks')}
				help={viewAllAlways ? __('Shown whenever there are results.', 'b-blocks') : __('Shown when there are more results than Initial Result.', 'b-blocks')}
				value={viewAllText}
				onChange={(val) => updateObj('viewAll', val, 'text')}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				className='mt10'
				label={__('Always Show View All', 'b-blocks')}
				checked={viewAllAlways}
				onChange={(val) => updateObj('viewAll', val, 'always')}
			/>
		</>}

		<NumberControl className='mt10' label={__('Initial Result', 'b-blocks')} help={__('Results shown in the live results box (1–20).', 'b-blocks')} labelPosition='edge' value={initialResult} min={1} max={20} onChange={(val) => updateObj('search', Math.min(20, Math.max(1, parseInt(val, 10) || 1)), 'initialResult')} />

		<TextControl
			className='mt10'
			label={__('Not Found Text', 'b-blocks')}
			value={notFoundText}
			onChange={(val) => updateObj('search', val, 'notFoundText')}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>

		<ToggleControl
			className='mt10'
			label={__('Show Search Button', 'b-blocks')}
			checked={showButton}
			onChange={(val) => updateObj('button', val, 'show')}
		/>
	</PanelBody>;
};
export default GeneralOptions;

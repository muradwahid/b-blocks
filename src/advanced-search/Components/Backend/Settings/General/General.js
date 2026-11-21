import { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { CheckboxControl, FormTokenField, PanelBody, SelectControl, TextControl, ToggleControl, __experimentalNumberControl as NumberControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { IconLibrary } from '../../../../../../../bpl-tools/Components';
import { PRESET_STYLES } from '../../../../utils/presets';
import { buttonTypeOptions, orderByOptions, presetOptions } from '../../../../utils/options';

// The site's searchable post types and the terms the filters can use, asked once per editor session.
let postTypesRequest = null;
let termsRequest = null;

const General = ({ attributes, setAttributes, updateObj }) => {
	const { preset = 'preset-1', search = {}, totalResults = {}, viewAll = {}, searchField = {}, button = {} } = attributes;
	const { postType = 'all', postTypes: chosenTypes = [], initialResult = 5, showImage = true, notFoundText = '', minChars = 2, delay = 300, orderBy = 'relevance', includeTerms = [], excludeTerms = [], showExcerpt = true, excerptLength = 22, highlight = true, newTab = false, showDate = false, showType = false } = search;
	const { show: showTotal = true, text: totalText = '', textOne: totalTextOne = '' } = totalResults;
	const { show: showViewAll = true, text: viewAllText = '', always: viewAllAlways = false } = viewAll;
	const { placeholder = '', showIcon: showSearchIcon = true, shortcut = false, autofocus = false } = searchField;
	const { show: showButton = true, position: buttonPosition = 'separate', type: buttonType = 'text', text: buttonText = '', icon: buttonIcon = '' } = button;

	const [postTypes, setPostTypes] = useState([]);
	useEffect(() => {
		postTypesRequest = postTypesRequest || apiFetch({ path: '/b-blocks/v1/search/types' }).catch(() => []);
		postTypesRequest.then((list) => setPostTypes(Array.isArray(list) ? list : []));
	}, []);

	// Terms are picked by name ("Category: News") and saved as IDs.
	const [terms, setTerms] = useState([]);
	useEffect(() => {
		termsRequest = termsRequest || apiFetch({ path: '/b-blocks/v1/search/terms' }).catch(() => []);
		termsRequest.then((list) => setTerms(Array.isArray(list) ? list : []));
	}, []);

	return <>
		<PanelBody className='bPlPanelBody' title={__('General', 'b-blocks')} initialOpen={true}>
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

			<ToggleControl
				className='mt10'
				label={__('Show Content Image', 'b-blocks')}
				checked={showImage}
				onChange={(val) => updateObj('search', val, 'showImage')}
			/>

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
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Search Query', 'b-blocks')} initialOpen={false}>
			<SelectControl label={__('Order By', 'b-blocks')} labelPosition='edge' value={orderBy} options={orderByOptions} onChange={(val) => updateObj('search', val, 'orderBy')} __next40pxDefaultSize __nextHasNoMarginBottom />

			<FormTokenField className='mt10' label={__('Only In These Terms', 'b-blocks')} value={includeTerms.map((id) => terms.find((t) => t.value === id)?.label || `#${id}`)} suggestions={terms.map((t) => t.label)} onChange={(tokens) => updateObj('search', tokens.map((label) => terms.find((t) => t.label === label)?.value || parseInt(String(label).replace('#', ''), 10)).filter(Boolean), 'includeTerms')} __experimentalExpandOnFocus __experimentalAutoSelectFirstMatch __experimentalValidateInput={(token) => terms.some((t) => t.label === token)} __next40pxDefaultSize __nextHasNoMarginBottom />
			<FormTokenField className='mt10' label={__('Never In These Terms', 'b-blocks')} value={excludeTerms.map((id) => terms.find((t) => t.value === id)?.label || `#${id}`)} suggestions={terms.map((t) => t.label)} onChange={(tokens) => updateObj('search', tokens.map((label) => terms.find((t) => t.label === label)?.value || parseInt(String(label).replace('#', ''), 10)).filter(Boolean), 'excludeTerms')} __experimentalExpandOnFocus __experimentalAutoSelectFirstMatch __experimentalValidateInput={(token) => terms.some((t) => t.label === token)} __next40pxDefaultSize __nextHasNoMarginBottom />
			<p className='components-base-control__help'>{__('Categories, tags and other public terms. The View All page can only follow categories.', 'b-blocks')}</p>

			<NumberControl className='mt10' label={__('Minimum Characters', 'b-blocks')} help={__('Live search starts after this many characters (2–5).', 'b-blocks')} labelPosition='edge' value={minChars} min={2} max={5} onChange={(val) => updateObj('search', Math.min(5, Math.max(2, parseInt(val, 10) || 2)), 'minChars')} />
			<NumberControl className='mt10' label={__('Typing Delay (ms)', 'b-blocks')} help={__('Wait after the last key before searching (0–2000).', 'b-blocks')} labelPosition='edge' value={delay} min={0} max={2000} step={50} onChange={(val) => updateObj('search', Math.min(2000, Math.max(0, parseInt(val, 10) || 0)), 'delay')} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Result Content', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Show Excerpt', 'b-blocks')} checked={showExcerpt} onChange={(val) => updateObj('search', val, 'showExcerpt')} />
			{showExcerpt && <NumberControl className='mt10' label={__('Excerpt Length (words)', 'b-blocks')} labelPosition='edge' value={excerptLength} min={5} max={55} onChange={(val) => updateObj('search', Math.min(55, Math.max(5, parseInt(val, 10) || 5)), 'excerptLength')} />}

			<ToggleControl className='mt10' label={__('Show Date', 'b-blocks')} checked={showDate} onChange={(val) => updateObj('search', val, 'showDate')} />
			<ToggleControl className='mt10' label={__('Show Post Type', 'b-blocks')} checked={showType} onChange={(val) => updateObj('search', val, 'showType')} />
			<ToggleControl className='mt10' label={__('Highlight Matching Words', 'b-blocks')} checked={highlight} onChange={(val) => updateObj('search', val, 'highlight')} />
			<ToggleControl className='mt10' label={__('Open Results In New Tab', 'b-blocks')} checked={newTab} onChange={(val) => updateObj('search', val, 'newTab')} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Search Field', 'b-blocks')} initialOpen={false}>
			<TextControl label={__('Placeholder Text', 'b-blocks')} value={placeholder} onChange={(val) => updateObj('searchField', val, 'placeholder')} __next40pxDefaultSize __nextHasNoMarginBottom />

			<ToggleControl
				className='mt10'
				label={__('Show Search Icon', 'b-blocks')}
				checked={showSearchIcon}
				onChange={(val) => updateObj('searchField', val, 'showIcon')}
			/>

			<ToggleControl
				className='mt10'
				label={__('"/" Key Focuses The Field', 'b-blocks')}
				help={__('On the page, pressing / outside a text field jumps to this search.', 'b-blocks')}
				checked={shortcut}
				onChange={(val) => updateObj('searchField', val, 'shortcut')}
			/>
			<ToggleControl
				className='mt10'
				label={__('Autofocus On Page Load', 'b-blocks')}
				help={__('Puts the cursor in the field when the page opens (not in the editor).', 'b-blocks')}
				checked={autofocus}
				onChange={(val) => updateObj('searchField', val, 'autofocus')}
			/>
		</PanelBody>

		{showButton && <PanelBody className='bPlPanelBody' title={__('Button', 'b-blocks')} initialOpen={false}>
			<ToggleGroupControl label={__('Position', 'b-blocks')} __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={buttonPosition} onChange={(val) => updateObj('button', val || 'separate', 'position')}>
				<ToggleGroupControlOption label={__('Separate', 'b-blocks')} value='separate' />
				<ToggleGroupControlOption label={__('Inside', 'b-blocks')} value='inside' />
			</ToggleGroupControl>

			<ToggleGroupControl className='mt10' label={__('Type', 'b-blocks')} __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={buttonType} onChange={(val) => updateObj('button', val || 'text', 'type')}>
				{buttonTypeOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
			</ToggleGroupControl>

			<TextControl
				className='mt10'
				label={'icon' !== buttonType ? __('Text', 'b-blocks') : __('Label (for screen readers)', 'b-blocks')}
				value={buttonText}
				onChange={(val) => updateObj('button', val, 'text')}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			{'text' !== buttonType && <IconLibrary className='mt10' label={__('Icon', 'b-blocks')} value={buttonIcon} onChange={(val) => updateObj('button', val, 'icon')} />}
		</PanelBody>}
	</>;
};
export default General;
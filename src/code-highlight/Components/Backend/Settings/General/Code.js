import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, SelectControl, TextareaControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';

import { languages, themes } from '../../../../utils/options';

/** The snippet itself and how it is read: grammar, theme, and how it is laid out. */
const Code = ({ attributes, updateObj }) => {
	const { content = {}, options = {}, theme } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Code', 'b-blocks')} initialOpen={true}>

		<TextareaControl label={__('Snippet', 'b-blocks')} value={content.code || ''} rows={6} onChange={(val) => updateObj('content', val, 'code')} help={__('Pasted exactly as typed — indentation and blank lines are kept.', 'b-blocks')} __nextHasNoMarginBottom />

		<SelectControl className='mt10' label={__('Language', 'b-blocks')} labelPosition='edge' value={content.language || 'none'} options={languages} onChange={(val) => updateObj('content', val, 'language')} __nextHasNoMarginBottom />

		<SelectControl className='mt10' label={__('Theme', 'b-blocks')} labelPosition='edge' value={theme || 'porple'} options={themes} onChange={(val) => updateObj('theme', val)} __nextHasNoMarginBottom />

		<ToggleControl className='mt10' label={__('Word Wrap', 'b-blocks')} checked={options.wordWrap} onChange={(val) => updateObj('options', val, 'wordWrap')} help={__('Off, a long line scrolls sideways. On, it folds onto the next line.', 'b-blocks')} __nextHasNoMarginBottom />

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Tab Size', 'b-blocks')}</Label>

			<NumberControl className='flex1' labelPosition='edge' min={1} max={8} value={options.tabSize || 2} onChange={(val) => updateObj('options', parseInt(val, 10) || 2, 'tabSize')} />
		</Flex>

	</PanelBody>;
};

export default Code;

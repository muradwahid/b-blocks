import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

import FaqItemsRepeater from '../FaqItemsRepeater';

const Settings = ({ attributes, setAttributes }) => {
	const {
		items,
		enableSchema,
		openFirst,
		allowMultiple,
		iconStyle,
		headingTag,
		gap,
		itemBorderStyle,
		itemBorderWidth,
		itemBorderRadius,
		itemBorderColor,
		questionBg,
		questionColor,
		questionFontSize,
		answerBg,
		answerColor,
		answerFontSize,
		iconColor,
	} = attributes;

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody
				className='bPlPanelBody'
				title={__('Content', 'b-blocks')}
				initialOpen={true}
			>
				<Label>{__('FAQ Items', 'b-blocks')}</Label>
				<FaqItemsRepeater
					value={items || []}
					onChange={(val) => setAttributes({ items: val })}
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('SEO & Schema', 'b-blocks')}
				initialOpen={false}
			>
				<ToggleControl
					label={__('Enable FAQPage schema', 'b-blocks')}
					checked={!!enableSchema}
					onChange={(val) => setAttributes({ enableSchema: val })}
					help={__('Outputs JSON-LD FAQPage markup. Use only once per page. Disable if your SEO plugin already handles FAQ schema.', 'b-blocks')}
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Layout', 'b-blocks')}
				initialOpen={false}
			>
				<ToggleControl
					label={__('Open first item', 'b-blocks')}
					checked={!!openFirst}
					onChange={(val) => setAttributes({ openFirst: val })}
				/>

				<ToggleControl
					label={__('Allow multiple open', 'b-blocks')}
					checked={!!allowMultiple}
					onChange={(val) => setAttributes({ allowMultiple: val })}
					help={__('When off, opening one item closes the others.', 'b-blocks')}
				/>

				<SelectControl
					label={__('Heading tag', 'b-blocks')}
					value={headingTag || 'h3'}
					options={[
						{ label: 'H2', value: 'h2' },
						{ label: 'H3', value: 'h3' },
						{ label: 'H4', value: 'h4' },
					]}
					onChange={(val) => setAttributes({ headingTag: val })}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Toggle icon', 'b-blocks')}
					value={iconStyle || 'chevron'}
					options={[
						{ label: __('Chevron', 'b-blocks'), value: 'chevron' },
						{ label: __('Plus / Minus', 'b-blocks'), value: 'plus' },
					]}
					onChange={(val) => setAttributes({ iconStyle: val })}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Gap between items', 'b-blocks')}
					value={parseInt(gap, 10) || 0}
					onChange={(val) => setAttributes({ gap: val })}
					min={0}
					max={48}
					step={2}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Style', 'b-blocks')}
				initialOpen={false}
			>
				<SelectControl
					label={__('Item border style', 'b-blocks')}
					value={itemBorderStyle || 'solid'}
					options={[
						{ label: __('Solid', 'b-blocks'), value: 'solid' },
						{ label: __('Dashed', 'b-blocks'), value: 'dashed' },
						{ label: __('None', 'b-blocks'), value: 'none' },
					]}
					onChange={(val) => setAttributes({ itemBorderStyle: val })}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Item border width', 'b-blocks')}
					value={parseInt(itemBorderWidth, 10) || 0}
					onChange={(val) => setAttributes({ itemBorderWidth: val })}
					min={0}
					max={6}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Item border radius', 'b-blocks')}
					value={parseInt(itemBorderRadius, 10) || 0}
					onChange={(val) => setAttributes({ itemBorderRadius: val })}
					min={0}
					max={24}
					step={1}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{__('Item border color:', 'b-blocks')}</Label>
					<ColorControl
						value={itemBorderColor || '#dee2e6'}
						onChange={(val) => setAttributes({ itemBorderColor: val })}
						defaultColor='#dee2e6'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Question background:', 'b-blocks')}</Label>
					<ColorControl
						value={questionBg || '#f8f9fa'}
						onChange={(val) => setAttributes({ questionBg: val })}
						defaultColor='#f8f9fa'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Question text color:', 'b-blocks')}</Label>
					<ColorControl
						value={questionColor || '#212529'}
						onChange={(val) => setAttributes({ questionColor: val })}
						defaultColor='#212529'
					/>
				</PanelRow>

				<RangeControl
					label={__('Question font size', 'b-blocks')}
					value={parseInt(questionFontSize, 10) || 17}
					onChange={(val) => setAttributes({ questionFontSize: val })}
					min={12}
					max={32}
					step={1}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{__('Answer background:', 'b-blocks')}</Label>
					<ColorControl
						value={answerBg || '#ffffff'}
						onChange={(val) => setAttributes({ answerBg: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Answer text color:', 'b-blocks')}</Label>
					<ColorControl
						value={answerColor || '#495057'}
						onChange={(val) => setAttributes({ answerColor: val })}
						defaultColor='#495057'
					/>
				</PanelRow>

				<RangeControl
					label={__('Answer font size', 'b-blocks')}
					value={parseInt(answerFontSize, 10) || 15}
					onChange={(val) => setAttributes({ answerFontSize: val })}
					min={12}
					max={28}
					step={1}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{__('Icon color:', 'b-blocks')}</Label>
					<ColorControl
						value={iconColor || ''}
						onChange={(val) => setAttributes({ iconColor: val || '' })}
						defaultColor=''
					/>
				</PanelRow>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;

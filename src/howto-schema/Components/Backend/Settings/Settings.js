import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	TextControl,
	TextareaControl,
	ToggleControl,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

import StepsRepeater from '../StepsRepeater';
import TextRepeater from '../TextRepeater';

const Settings = ({ attributes, setAttributes }) => {
	const {
		howtoName,
		description,
		totalTime,
		supply,
		tool,
		steps,
		enableSchema,
		headingTag,
		showStepNumbers,
		numberStyle,
		showConnector,
		stepSpacing,
		numberBg,
		numberColor,
		numberSize,
		connectorColor,
		stepTitleColor,
		stepTitleFontSize,
		stepTextColor,
		stepTextFontSize,
		stepBg,
		stepBorderRadius,
		metaColor,
		metaFontSize,
	} = attributes;

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody
				className='bPlPanelBody'
				title={__('Content', 'b-blocks')}
				initialOpen={true}
			>
				<TextControl
					label={__('How-To Title', 'b-blocks')}
					value={howtoName || ''}
					onChange={(val) => setAttributes({ howtoName: val })}
					help={__('Required for schema. Also used as the visible block heading.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextareaControl
					label={__('Introduction (optional)', 'b-blocks')}
					value={description || ''}
					onChange={(val) => setAttributes({ description: val })}
					placeholder={__('Briefly describe what the reader will accomplish.', 'b-blocks')}
					rows={3}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Total Time (ISO 8601, e.g. PT30M)', 'b-blocks')}
					value={totalTime || ''}
					onChange={(val) => setAttributes({ totalTime: val })}
					help={__('Use PT15M, PT1H30M, P2D, etc. Leave blank to omit from schema.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<Label>{__('Supplies', 'b-blocks')}</Label>
				<TextRepeater
					value={supply || []}
					onChange={(val) => setAttributes({ supply: val })}
					addLabel={__('Add Supply', 'b-blocks')}
					removeLabel={__('Remove supply', 'b-blocks')}
					placeholder={__('e.g. 2 cups of flour', 'b-blocks')}
					keyPrefix='supply'
				/>

				<Label>{__('Tools', 'b-blocks')}</Label>
				<TextRepeater
					value={tool || []}
					onChange={(val) => setAttributes({ tool: val })}
					addLabel={__('Add Tool', 'b-blocks')}
					removeLabel={__('Remove tool', 'b-blocks')}
					placeholder={__('e.g. Mixing bowl', 'b-blocks')}
					keyPrefix='tool'
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Steps', 'b-blocks')}
				initialOpen={true}
			>
				<SelectControl
					label={__('Step heading tag', 'b-blocks')}
					value={headingTag || 'h3'}
					options={[
						{ label: 'H2', value: 'h2' },
						{ label: 'H3', value: 'h3' },
						{ label: 'H4', value: 'h4' },
					]}
					onChange={(val) => setAttributes({ headingTag: val })}
					__nextHasNoMarginBottom
				/>

				<Label>{__('Steps', 'b-blocks')}</Label>
				<StepsRepeater
					value={steps || []}
					onChange={(val) => setAttributes({ steps: val })}
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('SEO & Schema', 'b-blocks')}
				initialOpen={false}
			>
				<ToggleControl
					label={__('Output HowTo JSON-LD', 'b-blocks')}
					checked={!!enableSchema}
					onChange={(val) => setAttributes({ enableSchema: val })}
					help={__('Outputs JSON-LD HowTo markup. Requires a title and at least one step with a name and description. Disable if your SEO plugin already outputs HowTo schema.', 'b-blocks')}
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Style', 'b-blocks')}
				initialOpen={false}
			>
				<ToggleControl
					label={__('Show step numbers', 'b-blocks')}
					checked={!!showStepNumbers}
					onChange={(val) => setAttributes({ showStepNumbers: val })}
				/>

				<SelectControl
					label={__('Number style', 'b-blocks')}
					value={numberStyle || 'circle'}
					options={[
						{ label: __('Circle', 'b-blocks'), value: 'circle' },
						{ label: __('Square', 'b-blocks'), value: 'square' },
					]}
					onChange={(val) => setAttributes({ numberStyle: val })}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Badge size', 'b-blocks')}
					value={parseInt(numberSize, 10) || 36}
					onChange={(val) => setAttributes({ numberSize: val })}
					min={24}
					max={64}
					step={1}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{__('Badge background:', 'b-blocks')}</Label>
					<ColorControl
						value={numberBg || '#2563eb'}
						onChange={(val) => setAttributes({ numberBg: val })}
						defaultColor='#2563eb'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Badge text color:', 'b-blocks')}</Label>
					<ColorControl
						value={numberColor || '#ffffff'}
						onChange={(val) => setAttributes({ numberColor: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<ToggleControl
					label={__('Show connector line', 'b-blocks')}
					checked={!!showConnector}
					onChange={(val) => setAttributes({ showConnector: val })}
				/>

				<PanelRow>
					<Label className=''>{__('Connector color:', 'b-blocks')}</Label>
					<ColorControl
						value={connectorColor || '#dee2e6'}
						onChange={(val) => setAttributes({ connectorColor: val })}
						defaultColor='#dee2e6'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Step title color:', 'b-blocks')}</Label>
					<ColorControl
						value={stepTitleColor || '#212529'}
						onChange={(val) => setAttributes({ stepTitleColor: val })}
						defaultColor='#212529'
					/>
				</PanelRow>

				<RangeControl
					label={__('Step title font size', 'b-blocks')}
					value={parseInt(stepTitleFontSize, 10) || 17}
					onChange={(val) => setAttributes({ stepTitleFontSize: val })}
					min={12}
					max={36}
					step={1}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{__('Step text color:', 'b-blocks')}</Label>
					<ColorControl
						value={stepTextColor || '#495057'}
						onChange={(val) => setAttributes({ stepTextColor: val })}
						defaultColor='#495057'
					/>
				</PanelRow>

				<RangeControl
					label={__('Step text font size', 'b-blocks')}
					value={parseInt(stepTextFontSize, 10) || 15}
					onChange={(val) => setAttributes({ stepTextFontSize: val })}
					min={11}
					max={24}
					step={1}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{__('Card background:', 'b-blocks')}</Label>
					<ColorControl
						value={stepBg || ''}
						onChange={(val) => setAttributes({ stepBg: val || '' })}
						defaultColor=''
					/>
				</PanelRow>

				<RangeControl
					label={__('Card border radius', 'b-blocks')}
					value={parseInt(stepBorderRadius, 10) || 0}
					onChange={(val) => setAttributes({ stepBorderRadius: val })}
					min={0}
					max={24}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Step spacing', 'b-blocks')}
					value={parseInt(stepSpacing, 10) || 0}
					onChange={(val) => setAttributes({ stepSpacing: val })}
					min={8}
					max={80}
					step={1}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{__('Meta text color:', 'b-blocks')}</Label>
					<ColorControl
						value={metaColor || '#6c757d'}
						onChange={(val) => setAttributes({ metaColor: val })}
						defaultColor='#6c757d'
					/>
				</PanelRow>

				<RangeControl
					label={__('Meta font size', 'b-blocks')}
					value={parseInt(metaFontSize, 10) || 14}
					onChange={(val) => setAttributes({ metaFontSize: val })}
					min={11}
					max={20}
					step={1}
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;

import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

import ColumnsRepeater from '../ColumnsRepeater';
import RowsRepeater from '../RowsRepeater';

const Settings = ({ attributes, setAttributes }) => {
	const {
		caption,
		columns,
		rows,
		featuredLabel,
		theme,
		checkIcon,
		crossIcon,
		showRowStripes,
		stickyHeader,
		stickyFirstColumn,
		headerBg,
		headerTextColor,
		featuredBg,
		featuredTextColor,
		featuredColBg,
		featuredLabelBg,
		featuredLabelColor,
		rowLabelBg,
		rowLabelColor,
		rowStripeBg,
		bodyBg,
		bodyTextColor,
		checkColor,
		crossColor,
		borderColor,
		borderWidth,
		borderRadius,
		fontSize,
		headerFontSize,
		cellPaddingV,
		cellPaddingH,
		iconSize,
		tableMaxWidth,
		tableAlignment,
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
					label={__('Accessible caption', 'b-blocks')}
					value={caption || ''}
					onChange={(val) => setAttributes({ caption: val })}
					help={__('Visually hidden but read by screen readers. Describe what is being compared.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Featured badge text', 'b-blocks')}
					value={featuredLabel || ''}
					onChange={(val) => setAttributes({ featuredLabel: val })}
					placeholder={__('e.g. Most Popular', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Columns (Plans)', 'b-blocks')}
				initialOpen={true}
			>
				<Label>{__('Columns', 'b-blocks')}</Label>
				<ColumnsRepeater
					columns={columns || []}
					rows={rows || []}
					onChange={(val) => setAttributes({ columns: val })}
					onRowsChange={(val) => setAttributes({ rows: val })}
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Feature Rows', 'b-blocks')}
				initialOpen={false}
			>
				<Label>{__('Rows', 'b-blocks')}</Label>
				<RowsRepeater
					rows={rows || []}
					columns={columns || []}
					onChange={(val) => setAttributes({ rows: val })}
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Layout', 'b-blocks')}
				initialOpen={false}
			>
				<SelectControl
					label={__('Visual theme', 'b-blocks')}
					value={theme || 'default'}
					options={[
						{ label: __('Default — clean white card', 'b-blocks'), value: 'default' },
						{ label: __('Striped — alternating rows', 'b-blocks'), value: 'striped' },
						{ label: __('Bordered — heavy cell borders', 'b-blocks'), value: 'bordered' },
						{ label: __('Dark — slate background, amber accent', 'b-blocks'), value: 'dark' },
					]}
					onChange={(val) => setAttributes({ theme: val })}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Table alignment', 'b-blocks')}
					value={tableAlignment || 'center'}
					options={[
						{ label: __('Left', 'b-blocks'), value: 'left' },
						{ label: __('Center', 'b-blocks'), value: 'center' },
						{ label: __('Right', 'b-blocks'), value: 'right' },
					]}
					onChange={(val) => setAttributes({ tableAlignment: val })}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Max table width (px)', 'b-blocks')}
					value={parseInt(tableMaxWidth, 10) || 900}
					onChange={(val) => setAttributes({ tableMaxWidth: val })}
					min={400}
					max={1600}
					step={10}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Cell vertical padding (px)', 'b-blocks')}
					value={parseInt(cellPaddingV, 10) || 12}
					onChange={(val) => setAttributes({ cellPaddingV: val })}
					min={4}
					max={32}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Cell horizontal padding (px)', 'b-blocks')}
					value={parseInt(cellPaddingH, 10) || 16}
					onChange={(val) => setAttributes({ cellPaddingH: val })}
					min={4}
					max={32}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Border width (px)', 'b-blocks')}
					value={parseInt(borderWidth, 10) || 0}
					onChange={(val) => setAttributes({ borderWidth: val })}
					min={0}
					max={4}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Border radius (px)', 'b-blocks')}
					value={parseInt(borderRadius, 10) || 0}
					onChange={(val) => setAttributes({ borderRadius: val })}
					min={0}
					max={32}
					step={1}
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={__('Row stripes', 'b-blocks')}
					checked={!!showRowStripes}
					onChange={(val) => setAttributes({ showRowStripes: val })}
				/>

				<ToggleControl
					label={__('Sticky header row', 'b-blocks')}
					checked={!!stickyHeader}
					onChange={(val) => setAttributes({ stickyHeader: val })}
					help={__('Pin the header row while the user scrolls vertically.', 'b-blocks')}
				/>

				<ToggleControl
					label={__('Sticky first column', 'b-blocks')}
					checked={!!stickyFirstColumn}
					onChange={(val) => setAttributes({ stickyFirstColumn: val })}
					help={__('Pin the feature-name column while the user scrolls horizontally.', 'b-blocks')}
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Icons', 'b-blocks')}
				initialOpen={false}
			>
				<SelectControl
					label={__('Positive (yes) icon', 'b-blocks')}
					value={checkIcon || 'check'}
					options={[
						{ label: __('Check mark', 'b-blocks'), value: 'check' },
						{ label: __('Check inside circle', 'b-blocks'), value: 'check-circle' },
					]}
					onChange={(val) => setAttributes({ checkIcon: val })}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Negative (no) icon', 'b-blocks')}
					value={crossIcon || 'times'}
					options={[
						{ label: __('Cross / X', 'b-blocks'), value: 'times' },
						{ label: __('X inside circle', 'b-blocks'), value: 'times-circle' },
					]}
					onChange={(val) => setAttributes({ crossIcon: val })}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Icon size (px)', 'b-blocks')}
					value={parseInt(iconSize, 10) || 18}
					onChange={(val) => setAttributes({ iconSize: val })}
					min={12}
					max={32}
					step={1}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Colors', 'b-blocks')}
				initialOpen={false}
			>
				<PanelRow>
					<Label className=''>{__('Header background:', 'b-blocks')}</Label>
					<ColorControl
						value={headerBg || '#1e293b'}
						onChange={(val) => setAttributes({ headerBg: val })}
						defaultColor='#1e293b'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Header text:', 'b-blocks')}</Label>
					<ColorControl
						value={headerTextColor || '#ffffff'}
						onChange={(val) => setAttributes({ headerTextColor: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Featured header background:', 'b-blocks')}</Label>
					<ColorControl
						value={featuredBg || '#2563eb'}
						onChange={(val) => setAttributes({ featuredBg: val })}
						defaultColor='#2563eb'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Featured header text:', 'b-blocks')}</Label>
					<ColorControl
						value={featuredTextColor || '#ffffff'}
						onChange={(val) => setAttributes({ featuredTextColor: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Featured column body:', 'b-blocks')}</Label>
					<ColorControl
						value={featuredColBg || '#eff6ff'}
						onChange={(val) => setAttributes({ featuredColBg: val })}
						defaultColor='#eff6ff'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Featured badge background:', 'b-blocks')}</Label>
					<ColorControl
						value={featuredLabelBg || '#f59e0b'}
						onChange={(val) => setAttributes({ featuredLabelBg: val })}
						defaultColor='#f59e0b'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Featured badge text:', 'b-blocks')}</Label>
					<ColorControl
						value={featuredLabelColor || '#ffffff'}
						onChange={(val) => setAttributes({ featuredLabelColor: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Body background:', 'b-blocks')}</Label>
					<ColorControl
						value={bodyBg || '#ffffff'}
						onChange={(val) => setAttributes({ bodyBg: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Body text:', 'b-blocks')}</Label>
					<ColorControl
						value={bodyTextColor || '#1f2937'}
						onChange={(val) => setAttributes({ bodyTextColor: val })}
						defaultColor='#1f2937'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Row label background:', 'b-blocks')}</Label>
					<ColorControl
						value={rowLabelBg || ''}
						onChange={(val) => setAttributes({ rowLabelBg: val || '' })}
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Row label text:', 'b-blocks')}</Label>
					<ColorControl
						value={rowLabelColor || ''}
						onChange={(val) => setAttributes({ rowLabelColor: val || '' })}
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Row stripe background:', 'b-blocks')}</Label>
					<ColorControl
						value={rowStripeBg || '#f8fafc'}
						onChange={(val) => setAttributes({ rowStripeBg: val })}
						defaultColor='#f8fafc'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Border color:', 'b-blocks')}</Label>
					<ColorControl
						value={borderColor || '#e2e8f0'}
						onChange={(val) => setAttributes({ borderColor: val })}
						defaultColor='#e2e8f0'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Check (yes) color:', 'b-blocks')}</Label>
					<ColorControl
						value={checkColor || '#16a34a'}
						onChange={(val) => setAttributes({ checkColor: val })}
						defaultColor='#16a34a'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Cross (no) color:', 'b-blocks')}</Label>
					<ColorControl
						value={crossColor || '#dc2626'}
						onChange={(val) => setAttributes({ crossColor: val })}
						defaultColor='#dc2626'
					/>
				</PanelRow>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Typography', 'b-blocks')}
				initialOpen={false}
			>
				<RangeControl
					label={__('Body font size (px)', 'b-blocks')}
					value={parseInt(fontSize, 10) || 15}
					onChange={(val) => setAttributes({ fontSize: val })}
					min={12}
					max={24}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Header font size (px)', 'b-blocks')}
					value={parseInt(headerFontSize, 10) || 16}
					onChange={(val) => setAttributes({ headerFontSize: val })}
					min={12}
					max={28}
					step={1}
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;

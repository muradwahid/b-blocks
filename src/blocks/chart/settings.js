import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, __experimentalUnitControl as UnitControl, SelectControl, PanelRow, TextControl, __experimentalNumberControl as NumberControl, Button, Dashicon, Tooltip, RangeControl } from '@wordpress/components';

// Variables
import Title from '../../../../Components/Title';
import Background from '../../../../Components/Background';
import BColor from '../../../../Components/BColor';
import options from '../../Const/options';
const { pxUnit, perUnit, emUnit } = options;
const types = [
	{ label: __('Line', 'b-blocks'), value: 'line' },
	{ label: __('Bar', 'b-blocks'), value: 'bar' },
	{ label: __('Pie', 'b-blocks'), value: 'pie' },
	{ label: __('Radar', 'b-blocks'), value: 'radar' },
	{ label: __('Doughnut', 'b-blocks'), value: 'doughnut' },
	{ label: __('Polar Area', 'b-blocks'), value: 'polarArea' },
];
const pointStyles = [
	{ label: __('Circle', 'b-blocks'), value: 'circle' },
	{ label: __('Cross', 'b-blocks'), value: 'cross' },
	{ label: __('Cross Rot', 'b-blocks'), value: 'crossRot' },
	{ label: __('Dash', 'b-blocks'), value: 'dash' },
	{ label: __('Line', 'b-blocks'), value: 'line' },
	{ label: __('Rect', 'b-blocks'), value: 'rect' },
	{ label: __('Rect Rounded', 'b-blocks'), value: 'rectRounded' },
	{ label: __('Rect Rot', 'b-blocks'), value: 'rectRot' },
	{ label: __('Star', 'b-blocks'), value: 'star' },
	{ label: __('Triangle', 'b-blocks'), value: 'triangle' },
];

// Icons
import icons from '../../Const/icons';

const Settings = ({ settings }) => {
	const { attributes: { data, type, background, textColor, isXScale, isXGridLine, isYScale, isYGridLine, gridLineColor, width, alignment, isTitle, title, titleFontSize, titleColor, isSubtitle, subtitle, subtitleFontSize, subtitleColor, isDownload }, setAttributes } = settings;

	const getRandomColor = () => {
		const letters = '0123456789abcdef';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	const updateData = (type, index, val, otherType = false, otherIndex = false) => {
		const newData = { ...data };

		if (false !== otherIndex && otherType) {
			newData[type][index][otherType][otherIndex] = val;
			setAttributes({ data: newData });
		} else if (otherType) {
			newData[type][index][otherType] = val;
			setAttributes({ data: newData });
		} else {
			newData[type][index] = val;
			setAttributes({ data: newData });
		}
	}

	const addDataset = () => {
		let newDatasets = [];
		for (let i = 0; i < data.datasets.length; i++) {
			newDatasets.push({
				label: data.datasets[i].label,
				data: [...data.datasets[i].data, Math.ceil(Math.random() * 20)],
				backgroundColor: [...data.datasets[i].backgroundColor, '#4527a433'],
				borderColor: [...data.datasets[i].borderColor, '#4527a4'],
				borderWidth: data.datasets[i].borderWidth,
				tension: data.datasets[i].tension,
				pointStyle: data.datasets[i].pointStyle
			})
		}

		setAttributes({
			data: {
				labels: [...data.labels, `Data ${data.labels.length + 1}`],
				datasets: [...newDatasets]
			}
		});
	}
	const removeDataset = (index) => {
		let newDatasets = [];
		for (let i = 0; i < data.datasets.length; i++) {
			newDatasets.push({
				label: data.datasets[i].label,
				data: [...data.datasets[i].data.slice(0, index), ...data.datasets[i].data.slice(index + 1)],
				backgroundColor: [...data.datasets[i].backgroundColor.slice(0, index), ...data.datasets[i].backgroundColor.slice(index + 1)],
				borderColor: [...data.datasets[i].borderColor.slice(0, index), ...data.datasets[i].borderColor.slice(index + 1)],
				borderWidth: data.datasets[i].borderWidth,
				tension: data.datasets[i].tension,
				pointStyle: data.datasets[i].pointStyle
			})
		}

		setAttributes({
			data: {
				labels: [...data.labels.slice(0, index), ...data.labels.slice(index + 1)],
				datasets: [...newDatasets]
			}
		});
	}

	const addDatasetValue = () => {
		let newData = [];
		let newBackgroundColor = [];
		let newBorderColor = [];
		for (let i = 0; i < data.labels.length; i++) {
			const newRandomColor = getRandomColor();

			newData.push(Math.ceil(Math.random() * 20));
			newBackgroundColor.push(`${newRandomColor}33`);
			newBorderColor.push(newRandomColor);
		}

		setAttributes({
			data: {
				labels: [...data.labels],
				datasets: [...data.datasets, {
					label: `Dataset Value ${data.datasets.length + 1}`,
					data: newData,
					backgroundColor: newBackgroundColor,
					borderColor: newBorderColor,
					borderWidth: 2,
					tension: 0.4,
					pointStyle: 'rectRounded'
				}]
			}
		});
	}
	const removeDatasetValue = (index) => {
		setAttributes({
			data: {
				labels: [...data.labels],
				datasets: [...data.datasets.slice(0, index), ...data.datasets.slice(index + 1)]
			}
		});
	}
	const duplicateDatasetValue = (index) => {
		setAttributes({
			data: {
				labels: [...data.labels],
				datasets: [...data.datasets, { ...data.datasets[index] }]
			}
		});
	}

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody addRemoveItems' title={__('Add or Remove Datasets', 'b-blocks')}>
				{data.labels.map((label, labelIndex) => <PanelRow key={labelIndex}>
					<Title mt='0' mb='0'>{__(`Label ${labelIndex + 1}:`, 'b-blocks')}</Title>
					<TextControl value={label} onChange={val => updateData('labels', labelIndex, val)} />

					<Tooltip text={__('Remove this Dataset', 'b-blocks')} position='top center'>
						<Button className='removeDataset' onClick={e => {
							e.preventDefault();
							removeDataset(labelIndex);
						}}><Dashicon icon='no' size={20} /></Button>
					</Tooltip>
				</PanelRow>)}

				<div className='addItem'>
					<Button label={__('Add New Dataset', 'b-blocks')} onClick={addDataset}><Dashicon icon='plus' size={20} />{__('Add New Dataset', 'b-blocks')}</Button>
				</div>

				{data.datasets.map((dataset, datasetIndex) => <PanelBody key={datasetIndex} className='bPlPanelBody editItem' title={__(`Dataset Value ${datasetIndex + 1}:`, 'b-blocks')} initialOpen={0 !== datasetIndex ? false : true}>
					<PanelRow>
						<Title mt='0' mb='0'>{__('Label:', 'b-blocks')}</Title>
						<TextControl value={dataset.label} onChange={val => updateData('datasets', datasetIndex, val, 'label')} />
					</PanelRow>

					{data.labels.map((label, labelIndex) => <PanelRow key={labelIndex} className='bBlocksChartDatasetEdit'>
						<Title mt='0' mb='0'>{__(`${label}:`, 'b-blocks')}</Title>

						<NumberControl className='chartDataValue' value={dataset.data[labelIndex]} onChange={val => updateData('datasets', datasetIndex, val, 'data', labelIndex)} />

						<Tooltip text={__('Dataset Background Color', 'b-blocks')} position='top center'>
							<BColor className='chartBGColor' label='' value={dataset.backgroundColor[labelIndex]} onChange={val => updateData('datasets', datasetIndex, val, 'backgroundColor', labelIndex)} />
						</Tooltip>

						<Tooltip text={__('Dataset Border Color', 'b-blocks')} position='top center'>
							<BColor label='' value={dataset.borderColor[labelIndex]} onChange={val => updateData('datasets', datasetIndex, val, 'borderColor', labelIndex)} />
						</Tooltip>
					</PanelRow>)}

					<NumberControl className='mt20' label={__('Border Width:')} labelPosition='left' value={dataset.borderWidth} onChange={val => {
						updateData('datasets', datasetIndex, val, 'borderWidth');
						updateData('datasets', datasetIndex, val, 'hoverBorderWidth');
					}} />

					<NumberControl className='mt15' label={__('Point Size:')} labelPosition='left' value={dataset.pointRadius} onChange={val => updateData('datasets', datasetIndex, val, 'pointRadius')} />

					<NumberControl className='mt15' label={__('Point Hover Size:')} labelPosition='left' value={dataset.pointHoverRadius} onChange={val => updateData('datasets', datasetIndex, val, 'pointHoverRadius')} />

					<PanelRow className='mt10'>
						<Title mt='0' mb='0'>{__('Point Style:', 'b-blocks')}</Title>
						<SelectControl value={dataset.pointStyle} onChange={val => updateData('datasets', datasetIndex, val, 'pointStyle')} options={pointStyles} />
					</PanelRow>

					<PanelRow className='itemAction'>
						<Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={e => {
							e.preventDefault();
							removeDatasetValue(datasetIndex);
						}}><Dashicon icon='no' size={18} />{__('Remove', 'b-blocks')}</Button>

						<Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={e => {
							e.preventDefault();
							duplicateDatasetValue(datasetIndex);
						}}>{icons.gearSettings}{__('Duplicate', 'b-blocks')}</Button>
					</PanelRow>
				</PanelBody>)}

				<div className='addItem'>
					<Button label={__('Add Dataset Value', 'b-blocks')} onClick={addDatasetValue}><Dashicon icon='plus' size={20} />{__('Add Dataset Value', 'b-blocks')}</Button>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Chart Settings', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Title mt='0' mb='0'>{__('Type:', 'b-blocks')}</Title>
					<SelectControl value={type} onChange={val => setAttributes({ type: val })} options={types} />
				</PanelRow>
				<small>{__(`Use single dataset value for 'Pie', 'Doughnut', and 'Polar Area'`, 'b-blocks')}</small>

				<UnitControl className='mt20' label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit, perUnit, emUnit]} />

				<Background className='mt20' label={__('Background:', 'b-blocks')} background={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

				<BColor label={__('Text Color:', 'b-blocks')} value={textColor} onChange={val => setAttributes({ textColor: val })} defaultColor='#666' />

				<ToggleControl className='mt20' label={__('Show X Scale', 'b-blocks')} checked={isXScale} onChange={val => setAttributes({ isXScale: val })} />

				{isXScale && <ToggleControl label={__('Show X Grid Line', 'b-blocks')} checked={isXGridLine} onChange={val => setAttributes({ isXGridLine: val })} />}

				<ToggleControl className='mt20' label={__('Show Y Scale', 'b-blocks')} checked={isYScale} onChange={val => setAttributes({ isYScale: val })} />

				{isYScale && <ToggleControl label={__('Show Y Grid Line', 'b-blocks')} checked={isYGridLine} onChange={val => setAttributes({ isYGridLine: val })} />}

				{(isXGridLine || isYGridLine) && <BColor label={__('Grid Line Color:', 'b-blocks')} value={gridLineColor} onChange={val => setAttributes({ gridLineColor: val })} defaultColor='#0000001a' />}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Title & Subtitle', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Title', 'b-blocks')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />
				{isTitle && <>
					<PanelRow>
						<Title mt='0' mb='0'>{__('Title:', 'b-blocks')}</Title>
						<TextControl value={title} onChange={val => setAttributes({ title: val })} />
					</PanelRow>

					<Title>{__('Title Font Size:', 'b-blocks')}</Title>
					<RangeControl value={titleFontSize} onChange={val => setAttributes({ titleFontSize: val })} min={0} max={80} step={1} allowReset={true} resetFallbackValue={22} initialPosition={22} />

					<BColor label={__('Title Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#4527a4' />
				</>}

				<ToggleControl className='mt20' label={__('Show Subtitle', 'b-blocks')} checked={isSubtitle} onChange={val => setAttributes({ isSubtitle: val })} />
				{isSubtitle && <>
					<PanelRow className='mt20'>
						<Title mt='0' mb='0'>{__('Subtitle:', 'b-blocks')}</Title>
						<TextControl value={subtitle} onChange={val => setAttributes({ subtitle: val })} />
					</PanelRow>

					<Title>{__('Subtitle Font Size:', 'b-blocks')}</Title>
					<RangeControl value={subtitleFontSize} onChange={val => setAttributes({ subtitleFontSize: val })} min={0} max={80} step={1} allowReset={true} resetFallbackValue={13} initialPosition={13} />

					<BColor label={__('Subtitle Color:', 'b-blocks')} value={subtitleColor} onChange={val => setAttributes({ subtitleColor: val })} defaultColor='#8344c5' />
				</>}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Download Settings', 'chart-block')} initialOpen={false}>
				<ToggleControl label={__('Download Button', 'chart-block')} checked={isDownload} onChange={val => setAttributes({ isDownload: val })} />
			</PanelBody>
		</InspectorControls>

		<BlockControls>
			<AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('Chart Alignment')} alignmentControls={[
				{ title: __('Chart in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('Chart in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('Chart in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;
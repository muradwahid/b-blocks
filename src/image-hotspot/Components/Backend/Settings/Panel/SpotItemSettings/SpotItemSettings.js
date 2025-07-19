import { CheckboxControl, __experimentalInputControl as InputControl, PanelRow, RangeControl, SelectControl, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { produce } from 'immer';

import { BButtonGroup, BtnGroup, IconLibrary, Label, MediaArea, TinyEditor } from '../../../../../../../../bpl-tools/Components';
import { FaRegImage, FaStar, IoText } from '../../../../../utils/icons';
import { toolbarPositions } from '../../../../../utils/options';

const SpotItemSettings = (props) => {
	const { attributes, setAttributes, arrKey, index, setActiveIndex } = props;
	const items = attributes[arrKey];
	const item = items[index]

	const updateItem = (type, val, childType = null, thirdChild = null) => {
		const newItem = produce(items, draft => {
			if (null !== thirdChild) {
				draft[index][type][childType][thirdChild] = val;
			}
			else if (null !== childType) {
				draft[index][type][childType] = val;
			} else {
				draft[index][type] = val;
			}
		});
		setAttributes({ hotspot: newItem });
		setActiveIndex && setActiveIndex(index);
	}
	return <>
		<TabPanel className='bPlTabPanel small' activeClass='activeTab' initialTabName={item.option} tabs={[{ title: 'Spot', name: 'spot' },
		{ title: 'Tooltip', name: 'tooltip' },]} onSelect={(tabName) => updateItem('option', tabName)} >
			{({ name }) => <>
				{name === 'spot' &&
					<>
						<BtnGroup options={[
							{ label: 'Text', icon: <IoText />, value: 'text' },
							{ label: 'Icon', icon: <FaStar />, value: 'icon' },
							{ label: 'Image', icon: <FaRegImage />, value: 'image' },
						]}
							value={item?.spotOption}
							label='Type'
							onChange={(value) => updateItem('spotOption', value)} isIcon={true} />
						{item.spotOption === 'text' && <>
							<PanelRow>
								<p style={{ margin: 0 }}>Text</p>
								<InputControl
									className='bpl-bphb-hostpot-block'
									value={item?.spotText}
									onChange={(value) =>
										updateItem('spotText', value)
									}
								/>
							</PanelRow>
							<Label>{__('Spot Link', 'b-blocks')}</Label>
							<InputControl
								className='bpl-bphb-hostpot-block'
								placeholder='https://example.com'
								value={item?.spotLink}
								onChange={(value) =>
									updateItem('spotLink', value)
								}
							/>

							<CheckboxControl
								label='Open in new window'
								className='mt10'
								checked={item.newWindow}
								onChange={(value) =>
									updateItem('newWindow', value)
								}
							/>
						</>}

						{item.spotOption === 'icon' && (
							<>
								<BButtonGroup
									label={__('Icon Type', 'b-blocks')}
									className='mt10'
									options={[
										{ label: 'Library', value: 'library' },
										{ label: 'Upload', value: 'upload' },
									]}
									value={item.icon.type}
									onChange={(val) =>
										updateItem('icon', val, 'type')
									}
								/>
								<div className='mt15'>
									{item.icon.type === 'library' && (
										<IconLibrary
											label={__('Icon Library', 'b-blocks')}
											value={item.icon.url.library}
											onChange={(val) =>
												updateItem('icon', val, 'url', 'library')
											}
										/>
									)}
									{item.icon.type === 'upload' && (
										<MediaArea
											types={['image/svg+xml']}
											value={{ url: item.icon.url.upload }}
											label='Upload SVG'
											onChange={(val) =>
												updateItem('icon', val, 'url', 'upload')
											}
										/>
									)}
								</div>
							</>
						)}
						{item.spotOption === 'image' && (
							<div className='mt15'>
								<MediaArea
									value={{ url: item.image }}
									label={__('Choose Image', 'b-blocks')}
									onChange={(val) => updateItem('image', val.url)}
								/>
							</div>
						)}
						<hr />

						<RangeControl
							label={__('X Position', 'b-blocks')}
							value={item.position.x}
							onChange={(value) =>
								updateItem('position', value, 'x')
							}
							min={0}
							max={100}
						/>
						<RangeControl
							label={__('Y Position', 'b-blocks')}
							value={item.position.y}
							onChange={(value) =>
								updateItem('position', value, 'y')
							}
							min={0}
							max={100}
						/>
					</>
				}
				{
					name === 'tooltip' && <>
						<TinyEditor
							value={item.tooltip}
							onChange={(value) => updateItem('tooltip', value)}
							className='mt10'
						/>
						<SelectControl
							label={__('Position', 'b-blocks')}
							className='mt10'
							labelPosition='edge'
							value={item.tooltipPosition}
							options={toolbarPositions}
							onChange={(value) =>
								updateItem('tooltipPosition', value)
							}
						/>
					</>
				}
			</>}
		</TabPanel>
	</>
};

export default SpotItemSettings;
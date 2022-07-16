import { __ } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon, ToolbarGroup, ToolbarButton, Button } from '@wordpress/components';

// Settings Components
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import Background from '../../../../Components/Background';
import { ImageHolderControl } from '../../../../Components/ImageControl';
import BDevice from '../../../../Components/BDevice';
import IconControl from '../../../../Components/IconControl';
import Typography from '../../../../Components/Typography';
import SeparatorControl from '../../../../Components/SeparatorControl';
import SpaceControl from '../../../../Components/SpaceControl';

import { IndexContext } from './edit';
import icons from '../../Const/icons';
import options from '../../Const/options';
const { pxUnit, perUnit, emUnit } = options;

const Settings = ({ settings }) => {
	const { attributes: { features = [], columns, columnGap, rowGap, textAlign, padding, isIcon, iconMargin, isTitle, titleTypo, titleMargin, isSep, sepMargin, isDesc, descTypo }, setAttributes } = settings;

	const setActiveIndex = useContext(IndexContext);
	const [device, setDevice] = useState('desktop');

	const addFeature = () => {
		setAttributes({
			features: [...features, {
				background: { color: '#0000' },
				isUpIcon: false,
				icon: { class: 'fa fa-wordpress', fontSize: 120 },
				upIcon: { id: null, url: '', alt: '', title: '' },
				iconWidth: '120px',
				title: `Feature ${features.length + 1}`,
				titleColor: '#333',
				separator: { width: '20%', height: '2px', style: 'solid', color: '#bbb' },
				desc: `This content area describes feature ${features.length + 1} description/details.`,
				descColor: '#333'
			}]
		});
		setActiveIndex(features.length);
	}

	const updateFeature = (index, type, val) => {
		const newFeature = [...features];
		newFeature[index][type] = val;
		setAttributes({ features: newFeature });
		setActiveIndex(index);
	}

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')}>
				{/* <div className='helpItem'>
					<a href='https://bblockswp.com/docs/feature-boxes-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
				</div> */}

				<div className='helpItem rateUs'>
					<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
						<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
						<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
					</a>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody addRemoveItems' title={__('Add or Remove Features', 'b-blocks')}>
				{features.map((item, index) => {
					const { background, isUpIcon, icon, upIcon, iconWidth, titleColor, separator, descColor } = item;

					return <PanelBody key={index} className='bPlPanelBody editItem' title={__(`Feature No ${index + 1}:`, 'b-blocks')} initialOpen={0 !== index ? false : true}>
						<Background label={__('Background:', 'b-blocks')} background={background} onChange={val => updateFeature(index, 'background', val)} />

						{isIcon && <>
							<ToggleControl label={__('Upload Icon?', 'b-blocks')} checked={isUpIcon} onChange={val => updateFeature(index, 'isUpIcon', val)} />

							{isUpIcon ? <>
								<ImageHolderControl className='mt20' label={__('Icon:', 'b-blocks')} img={upIcon} onChange={val => updateFeature(index, 'upIcon', val)} />

								<UnitControl className='mt20' label={__('Icon Width:', 'b-blocks')} labelPosition='left' value={iconWidth} onChange={val => updateFeature(index, 'iconWidth', val)} units={[pxUnit, perUnit, emUnit]} />

							</> : <IconControl icon={icon} onChange={val => updateFeature(index, 'icon', val)} defaults={{ class: 'fa fa-wordpress', fontSize: 120 }} />} </>}

						<BColor label={__('Title Color:', 'b-blocks')} value={titleColor} onChange={val => updateFeature(index, 'titleColor', val)} defaultColor='#333' />

						<SeparatorControl separator={separator} onChange={val => updateFeature(index, 'separator', val)} defaults={{ width: '20%' }} />

						<BColor label={__('Description Color:', 'b-blocks')} value={descColor} onChange={val => updateFeature(index, 'descColor', val)} defaultColor='#333' />

						<PanelRow className='itemAction mt20'>
							<Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={e => {
								e.preventDefault();
								setAttributes({ features: [...features.slice(0, index), ...features.slice(index + 1)] });
							}}><Dashicon icon='no' />{__('Remove', 'b-blocks')}</Button>

							<Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={e => {
								e.preventDefault();
								setAttributes({ features: [...features, { ...features[index] }] });
							}}>{icons.gearSettings}{__('Duplicate', 'b-blocks')}</Button>
						</PanelRow>
					</PanelBody>
				})}

				<div className='addItem'>
					<Button label={__('Add New Feature', 'b-blocks')} onClick={addFeature}><Dashicon icon='plus' />{__('Add New Feature', 'b-blocks')}</Button>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
					<BDevice device={device} onChange={val => setDevice(val)} />
				</PanelRow>
				<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

				<UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit, perUnit, emUnit]} />

				<UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit, perUnit, emUnit]} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Content Settings', 'b-blocks')} initialOpen={false}>
				<SpaceControl label={__('Padding:', 'b-blocks')} space={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '50px', horizontal: '20px' }} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Icon Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Icon', 'b-blocks')} checked={isIcon} onChange={val => setAttributes({ isIcon: val })} />

				{isIcon && <SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={iconMargin} onChange={val => setAttributes({ iconMargin: val })} defaults={{ side: 4, bottom: '20px' }} />}
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Title Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Title', 'b-blocks')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

				{isTitle && <>
					<Typography typography={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: 20, fontWeight: 600 }} />

					<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
				</>}
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

				{isSep && <SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={sepMargin} onChange={val => setAttributes({ sepMargin: val })} defaults={{ side: 4, bottom: '10px' }} />}
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Description Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

				{isDesc && <Typography typography={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: 15 }} />}
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<ToolbarGroup className='bPlToolbar'>
				<ToolbarButton label={__('Add New Feature', 'b-blocks')} onClick={addFeature}><Dashicon icon='plus' /></ToolbarButton>
			</ToolbarGroup>

			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;
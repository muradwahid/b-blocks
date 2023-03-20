import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, __experimentalUnitControl as UnitControl, TabPanel, Dashicon } from '@wordpress/components';
import produce from 'immer';

// Settings Components
import Title from '../../../../Components/Title';
import Typography from '../../../../Components/Typography';
import BorderControl from '../../../../Components/BorderControl';
import SpaceControl from '../../../../Components/SpaceControl';
import ColorsControl from '../../../../Components/ColorsControl';
import { InlineDetailMediaUpload } from '../../../../Components/MediaControl';
import { ImageEditControl, ChangeImageData } from '../../../../Components/ImageControl';
import { pxUnit, perUnit, emUnit, vwUnit } from '../../../../Components/Helper/options';

const beforeAfterImgTab = [
	{ name: 'before-img', title: __('Before Img', 'b-blocks') },
	{ name: 'after-img', title: __('After Img', 'b-blocks') }
];

const Settings = ({ attributes, setAttributes }) => {
	const { alignment, width, border, beforeImg, afterImg, isSwap, isLabel, labelTypo, labelColors, labelPadding, isCap, capTypo, capColors, capPadding } = attributes;

	return <>
		<InspectorControls>
			<Title className=''></Title> {/* Just use the component */}
			<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
				<div className='helpItem'>
					<a href='https://bblockswp.com/docs/image-comparison-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
				</div>

				<div className='helpItem rateUs'>
					<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
						<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
						<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
					</a>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Comparison Settings', 'b-blocks')}>
				<UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit(), perUnit(), emUnit(), vwUnit()]} />

				<BorderControl label={__('Border:', 'b-blocks')} value={border} onChange={val => setAttributes({ border: val })} />

				<TabPanel className='bPlTabPanel mt20' activeClass='activeTab' tabs={beforeAfterImgTab}>{tab => <>
					{'before-img' == tab.name && <>
						<InlineDetailMediaUpload className='mt10' value={beforeImg} onChange={val => setAttributes({ beforeImg: val })} placeholder={__('Enter Image URL', 'b-blocks')} />

						<ChangeImageData className='mt20' value={beforeImg} onChange={val => setAttributes({ beforeImg: val })} />
					</>}

					{'after-img' == tab.name && <>
						<InlineDetailMediaUpload className='mt10' value={afterImg} onChange={val => setAttributes({ afterImg: val })} placeholder={__('Enter Image URL', 'b-blocks')} />

						<ChangeImageData className='mt20' value={afterImg} onChange={val => setAttributes({ afterImg: val })} />
					</>}
				</>}</TabPanel>

				<ToggleControl className='mt20' label={__('Swap Images', 'b-blocks')} checked={isSwap} onChange={val => setAttributes({ isSwap: val, beforeImg: { ...afterImg }, afterImg: { ...beforeImg } })} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Labels Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Labels', 'b-blocks')} checked={isLabel} onChange={val => setAttributes({ isLabel: val })} />

				{isLabel && <>
					<Typography value={labelTypo} onChange={val => setAttributes({ labelTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} produce={produce} />

					<ColorsControl value={labelColors} onChange={val => setAttributes({ labelColors: val })} defaults={{ color: '#fff', bg: '#00000080' }} />

					<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={labelPadding} onChange={val => setAttributes({ labelPadding: val })} defaults={{ vertical: '10px', horizontal: '15px' }} />
				</>}
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Caption Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Caption', 'b-blocks')} checked={isCap} onChange={val => setAttributes({ isCap: val })} />

				{isCap && <>
					<Typography value={capTypo} onChange={val => setAttributes({ capTypo: val })} defaults={{ fontSize: { desktop: 14, tablet: 14, mobile: 14 } }} produce={produce} />

					<ColorsControl value={capColors} onChange={val => setAttributes({ capColors: val })} defaults={{ color: '#333', bg: '#f4f4f4' }} />

					<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={capPadding} onChange={val => setAttributes({ capPadding: val })} defaults={{ vertical: '10px', horizontal: '15px' }} />
				</>}
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<ImageEditControl label={__('Edit Before Image:', 'b-blocks')} value={beforeImg} onChange={val => setAttributes({ beforeImg: val })} />
			<ImageEditControl label={__('Edit After Image:', 'b-blocks')} value={afterImg} onChange={val => setAttributes({ afterImg: val })} />

			<AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('Image Comparison Alignment')} alignmentControls={[
				{ title: __('Image Comparison in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('Image Comparison in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('Image Comparison in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;
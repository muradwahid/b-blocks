import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { Dashicon, PanelBody, PanelRow, TabPanel, TextControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import produce from 'immer';

// Settings Components
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import BtnGroup from '../../../../Components/BtnGroup';
import Typography from '../../../../Components/Typography';
import SpaceControl from '../../../../Components/SpaceControl';
import BorderControl from '../../../../Components/BorderControl';
import ColorsControl from '../../../../Components/ColorsControl';
import IconControl from '../../../../Components/IconControl';
import { pxUnit, perUnit, emUnit } from '../../../../Components/Helper/options';

const sepTypes = [
	{ label: 'Icon', value: 'icon', icon: 'Icon' },
	{ label: 'Text', value: 'text', icon: 'Text' }
];
const btnGroupTabs = [
	{ name: 'btn-one', title: __('Button One', 'b-blocks') },
	{ name: 'btn-two', title: __('Button Two', 'b-blocks') }
];

const Settings = ({ attributes, setAttributes }) => {
	const { width, btnAlign, btnType, btnTypo, btnPadding, btnOneLink, btnOneBorder, btnOneColors, btnOneHovColors, btnTwoLink, btnTwoBorder, btnTwoColors, btnTwoHovColors, isSep, sepType, sepText, sepTextTypo, sepTextColor, sepIcon, sepBGColor } = attributes;

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
				{/* <div className='helpItem'>
					<a href='https://bblockswp.com/docs/button-group-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
				</div> */}

				<div className='helpItem rateUs'>
					<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
						<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
						<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
					</a>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Button Settings', 'b-blocks')}>
				<UnitControl label={__('Container Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit(), perUnit(), emUnit()]} />

				<PanelRow>
					<Title className=''>{__('Type:', 'b-blocks')}</Title>
					<BtnGroup value={btnType} onChange={val => {
						setAttributes({ btnType: val });
						'fill' === val && setAttributes({
							btnOneColors: { ...btnOneColors, color: '#fff', bg: '#4527a4', styles: 'color: #fff; background: #4527a4;' },
							btnOneBorder: { ...btnOneBorder, width: '0px', color: '#0000', styles: '' },
							btnTwoColors: { ...btnTwoColors, color: '#fff', bg: '#8344c5', styles: 'color: #fff; background: #8344c5;' },
							btnTwoBorder: { ...btnTwoBorder, width: '0px', color: '#0000', styles: '' }
						});
						'outline' === val && setAttributes({
							btnOneColors: { ...btnOneColors, color: '#4527a4', bg: '#0000', styles: 'color: #4527a4; background: #0000;' },
							btnOneBorder: { ...btnOneBorder, width: '3px', color: '#4527a4', styles: 'border: 3px solid #4527a4;' },
							btnTwoColors: { ...btnTwoColors, color: '#8344c5', bg: '#0000', styles: 'color: #8344c5; background: #0000;' },
							btnTwoBorder: { ...btnTwoBorder, width: '3px', color: '#8344c5', styles: 'border: 3px solid #8344c5;' }
						});
					}} options={[
						{ label: __('Fill', 'b-blocks'), value: 'fill', icon: 'FILL' },
						{ label: __('Outline', 'b-blocks'), value: 'outline', icon: 'OUTLINE' }
					]} />
				</PanelRow>
				<small>{__('Some settings may change when type will be changed.', 'b-blocks')}</small>

				<Typography value={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: { desktop: 16, tablet: 16, mobile: 16 } }} produce={produce} />

				<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '12px', horizontal: '30px' }} />

				<Title>{__('Buttons:', 'b-blocks')}</Title>
				<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={btnGroupTabs}>{tab => <>
					{'btn-one' == tab.name && <>
						<PanelRow>
							<Title className=''>{__('Link:', 'b-blocks')}</Title>
							<TextControl value={btnOneLink} onChange={val => setAttributes({ btnOneLink: val })} />
						</PanelRow>

						<BorderControl label={__('Border', 'b-blocks')} value={btnOneBorder} onChange={val => setAttributes({ btnOneBorder: val })} defaults={{ radius: '50px' }} />

						<ColorsControl value={btnOneColors} onChange={val => setAttributes({ btnOneColors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />

						<ColorsControl label={__('Hover Colors:', 'b-blocks')} value={btnOneHovColors} onChange={val => setAttributes({ btnOneHovColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} />
					</>}

					{'btn-two' == tab.name && <>
						<PanelRow>
							<Title className=''>{__('Link:', 'b-blocks')}</Title>
							<TextControl value={btnTwoLink} onChange={val => setAttributes({ btnTwoLink: val })} />
						</PanelRow>

						<BorderControl label={__('Border', 'b-blocks')} value={btnTwoBorder} onChange={val => setAttributes({ btnTwoBorder: val })} defaults={{ radius: '50px' }} />

						<ColorsControl value={btnTwoColors} onChange={val => setAttributes({ btnTwoColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} />

						<ColorsControl label={__('Hover Colors:', 'b-blocks')} value={btnTwoHovColors} onChange={val => setAttributes({ btnTwoHovColors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />
					</>}
				</>}
				</TabPanel>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

				{isSep && <>
					<PanelRow>
						<Title className=''>{__('Type:', 'b-blocks')}</Title>
						<BtnGroup value={sepType} onChange={val => setAttributes({ sepType: val })} options={sepTypes} />
					</PanelRow>

					{'text' === sepType && <>
						<Title>{__('Separator Text:', 'b-blocks')}</Title>
						<TextControl value={sepText} onChange={val => setAttributes({ sepText: val })} />

						<Typography label={__('Text Typography', 'b-blocks')} value={sepTextTypo} onChange={val => setAttributes({ sepTextTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} produce={produce} />

						<BColor label={__('Text Color:', 'b-blocks')} value={sepTextColor} onChange={val => setAttributes({ sepTextColor: val })} defaultColor='#333' />
					</>}

					{'icon' === sepType && <IconControl value={sepIcon} onChange={val => setAttributes({ sepIcon: val })} defaults={{ class: 'fa fa fa-arrows-alt-h', fontSize: 20, color: '#333' }} />}

					<BColor label={__('Background Color:', 'b-blocks')} value={sepBGColor} onChange={val => setAttributes({ sepBGColor: val })} defaultColor='#fff' />
				</>}
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={btnAlign} onChange={val => setAttributes({ btnAlign: val })} describedBy={__('Button Group Align')} alignmentControls={[
				{ title: __('Button Group in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('Button Group in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('Button Group in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;
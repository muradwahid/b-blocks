import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, SelectControl, TabPanel, TextControl, TextareaControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

import { BtnGroup, ColorsControl, HelpPanel, IconControl, InlineDetailMediaUpload, InlineMediaUpload, Label, ShadowControl, Typography } from '../../../../../../bpl-tools/Components';
import { BorderControl, SpaceControl } from '../../../../../../bpl-tools/Components/Deprecated';
import { BControlPro, SelectControlPro } from '../../../../../../bpl-tools/ProControls';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { buttonDocs, pluginSlug } from '../../../../utils/data';
import useUserRoles from '../../../../hooks/useUserRoles';
import ProModal from '../../../../backend/ProModal/ProModal';
import { actionTypes, animationTypes, buttonSizes, buttonTypes, contentTypes, securities, tabs, xPositions, xyPositions } from '../../../utils/options';

const Settings = ({ attributes, setAttributes, isPremium }) => {
	const { text, actionType = 'link', security, url, tooltip, tooltipPos = 'top', target, attrs = {}, hideOn = {}, isDownload, downloadFileName = '', isUpIcon, icon, upIcon, iconPos, type, isFullWidth, size, popup = {}, animationType, animationDuration, addID, addCSS, alignment, typography, colors, hovColors, padding, border, shadow, securityPassword, securityRole } = attributes;
	const { type: popType = 'image', content: popContent = '', caption: popCaption = '' } = popup;

	const [isProModalOpen, setIsProModalOpen] = useState(false);

	const { roles } = useUserRoles();

	const premiumProps = {
		isPremium,
		setIsProModalOpen
	};

	const updateObj = (obj, key, val) => {
		setAttributes({ [obj]: { ...attributes[obj], [key]: val } });
	}

	const isPopup = 'popup' === actionType;

	const contentProps = {
		value: popContent,
		onChange: val => updateObj('popup', 'content', val)
	}

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={tabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<HelpPanel slug={pluginSlug} docsLink={buttonDocs} />


					<PanelBody className='bPlPanelBody' title={__('Button', 'b-blocks')}>
						<PanelRow>
							<Label className=''>{__('Text:', 'b-blocks')}</Label>
							<TextControl value={text} onChange={val => setAttributes({ text: val })} />
						</PanelRow>

						<SelectControlPro className='mt20' label={__('Action:', 'b-blocks')} labelPosition='left' value={actionType} onChange={val => setAttributes({ actionType: val })} options={actionTypes} {...premiumProps} proValues={['popup']} />

						<BControlPro className='mt20' label={__('Security:', 'b-blocks')} labelPosition='left' value={security} onChange={val => setAttributes({ security: val })} options={securities} {...premiumProps} Component={SelectControl} />

						{security == "login" && <>
							<BControlPro className='mt20' label={__('Set User Role:', 'b-blocks')} labelPosition='left' value={securityRole} onChange={val => setAttributes({ securityRole: val })} options={[{ label: 'Default', value: 'default' }, ...roles]} {...premiumProps} Component={SelectControl} />
						</>}
						{security == "password" && <>
							<BControlPro className='mt20' label={__('Set Password:', 'b-blocks')} value={securityPassword} onChange={val => setAttributes({ securityPassword: val })} {...premiumProps} Component={TextControl} />
						</>}



						{!isPopup && <>
							<Label>{__('URL:', 'b-blocks')}</Label>
							<TextControl value={url} onChange={val => setAttributes({ url: val })} />

							<ToggleControl className='mt20' label={__('Open link in new tab', 'b-blocks')} checked={'_blank' === target} onChange={val => setAttributes({ target: val ? '_blank' : '_self' })} />

							<BControlPro className='mt20' label={__('URL/Link Rel/Relation:', 'b-blocks')} value={attrs?.rel} onChange={val => updateObj('attrs', 'rel', val)} {...premiumProps} Component={TextControl} />
							<small>For more details read the <a href='https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel' target='_blank' rel='noreferrer'>documentation</a></small>

							<BControlPro className='mt20' label={__('Enter Referer Policy:', 'b-blocks')} value={attrs?.referrerpolicy} onChange={val => updateObj('attrs', 'referrerpolicy', val)} {...premiumProps} Component={TextControl} />
							<small>For more details read the <a href='https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/referrerPolicy' target='_blank' rel='noreferrer'>documentation</a></small>

							<ToggleControl className='mt20' label={__('Download Button', 'b-blocks')} checked={isDownload} onChange={val => setAttributes({ isDownload: val })} />

							{isDownload && <>
								<small>{__('Make sure the URL/link is downloadable!', 'b-blocks')}</small>

								<BControlPro className='mt20' label={__('Download File Name:', 'b-blocks')} labelPosition='left' value={downloadFileName} onChange={val => setAttributes({ downloadFileName: val })} {...premiumProps} Component={TextControl} />
								<small>{__('This is an experimental feature, and it may not work reliably every time.', 'b-blocks')} <a href='https://www.w3schools.com/howto/howto_html_download_link.asp' target='_blank' rel='noreferrer'>Source</a></small>
							</>}
						</>}
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Elements', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Upload Icon?', 'b-blocks')} checked={isUpIcon} onChange={val => setAttributes({ isUpIcon: val })} />

						{isUpIcon ?
							<InlineDetailMediaUpload value={upIcon} types={['image']} onChange={val => setAttributes({ upIcon: val })} placeholder={__('Enter Icon URL', 'b-blocks')} /> :
							<IconControl value={icon} onChange={val => setAttributes({ icon: val })} defaults={{ class: 'fa fa-paper-plane' }} isSize={false} isColor={false} />}

						<BControlPro className='mt10' label={__('Icon Position:', 'b-blocks')} labelPosition='left' value={iconPos} onChange={val => setAttributes({ iconPos: val })} options={xPositions} {...premiumProps} Component={SelectControl} />

						<Label>{__('Tooltip Text:', 'b-blocks')}</Label>
						<TextControl value={tooltip} onChange={val => setAttributes({ tooltip: val })} />
						<small>{__('If you want to add tooltip on button, type text rather then leave empty.', 'b-blocks')}</small>

						<BControlPro className='mt10' label={__('Tooltip Position:', 'b-blocks')} labelPosition='left' value={tooltipPos} onChange={val => setAttributes({ tooltipPos: val })} options={xyPositions} {...premiumProps} Component={SelectControl} />

						<BControlPro className='mt20' label={__('Hide On Desktop', 'b-blocks')} checked={hideOn?.desktop} onChange={val => updateObj('hideOn', 'desktop', val)} {...premiumProps} Component={ToggleControl} />

						<BControlPro className='mt10' label={__('Hide On Tablet', 'b-blocks')} checked={hideOn?.tablet} onChange={val => updateObj('hideOn', 'tablet', val)} {...premiumProps} Component={ToggleControl} />

						<BControlPro className='mt10' label={__('Hide On Mobile', 'b-blocks')} checked={hideOn?.mobile} onChange={val => updateObj('hideOn', 'mobile', val)} {...premiumProps} Component={ToggleControl} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Design', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Button Full Width?', 'b-blocks')} checked={isFullWidth} onChange={val => setAttributes({ isFullWidth: val })} />

						<PanelRow>
							<Label className=''>{__('Button Size:', 'b-blocks')}</Label>

							<SelectControl value={size} onChange={val => {
								setAttributes({ size: val });

								'small' === val && setAttributes({
									typography: { ...typography, fontSize: 12 },
									padding: { ...padding, vertical: '8px', horizontal: '16px' }
								});
								'medium' === val && setAttributes({
									typography: { ...typography, fontSize: 16 },
									padding: { ...padding, vertical: '12px', horizontal: '24px' }
								});
								'large' === val && setAttributes({
									typography: { ...typography, fontSize: 20 },
									padding: { ...padding, vertical: '14px', horizontal: '30px' }
								});
								'x-large' === val && setAttributes({
									typography: { ...typography, fontSize: 22 },
									padding: { ...padding, vertical: '16px', horizontal: '46px' }
								});
							}} options={buttonSizes} />
						</PanelRow>

						<PanelRow className='mt20'>
							<Label className=''>{__('Button Type:', 'b-blocks')}</Label>

							<BtnGroup value={type} onChange={val => {
								setAttributes({ type: val });
								'flat' === val && setAttributes({ shadow: [] });
								'3d' === val && setAttributes({
									shadow: [
										{ hOffset: '-5px', vOffset: '6px', blur: '2px', spreed: '0px', color: '#0006', isInset: false },
										{ hOffset: '3px', vOffset: '-3px', blur: '0px', spreed: '2px', color: '#341b7e', isInset: true }
									]
								});
							}} isTextIcon={true} options={buttonTypes} />
						</PanelRow>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Animation', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Label className=''>{__('Type:', 'b-blocks')}</Label>
							<SelectControl value={animationType} onChange={val => setAttributes({ animationType: val })} options={animationTypes} />
						</PanelRow>

						<Label>{__('Duration (Speed) (s):', 'b-blocks')}</Label>
						<RangeControl value={animationDuration} onChange={val => setAttributes({ animationDuration: val })} min={0} max={3} step={0.05} />
						<small>{__('Animation duration of speed in seconds')}</small>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Additional', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Label className=''>{__('ID:', 'b-blocks')}</Label>
							<TextControl value={addID} onChange={val => setAttributes({ addID: val })} placeholder={__('Enter additional ID', 'b-blocks')} />
						</PanelRow>

						<Label>{__('CSS:', 'b-blocks')}</Label>
						<TextareaControl value={addCSS} onChange={val => setAttributes({ addCSS: val })} placeholder={__('Enter additional CSS', 'b-blocks')} />
					</PanelBody>
				</>}


				{'popup' === tab.name && <PanelBody className='bPlPanelBody' title={__('Options', 'b-blocks')}>
					{!isPopup && <div className='mb20'>
						<small>{__('Please select the popup from the button action to enable these options.', 'b-blocks')}</small>
					</div>}

					<div className={isPopup ? '' : 'bPlNoEvent'}>
						<BControlPro label={__('Content Type:', 'b-blocks')} labelPosition='left' value={popType} options={contentTypes} onChange={val => setAttributes({ popup: { ...popup, type: val, content: 'content' === val ? '<!-- wp:paragraph --><!-- /wp:paragraph -->' : '' } })} {...premiumProps} Component={SelectControl} />

						{'image' === popType && <BControlPro label={__('Image:', 'b-blocks')} type={['image']} {...contentProps} placeholder={__('Enter Image URL', 'b-blocks')} {...premiumProps} Component={InlineMediaUpload} />}

						{'audio' === popType && <BControlPro label={__('Audio:', 'b-blocks')} types={['audio']} {...contentProps} placeholder={__('Enter Audio URL', 'b-blocks')} {...premiumProps} Component={InlineMediaUpload} />}

						{'video' === popType && <>
							<BControlPro label={__('Video:', 'b-blocks')} types={['video']} {...contentProps} placeholder={__('Enter Video URL', 'b-blocks')} {...premiumProps} Component={InlineMediaUpload} />
							<span>{__('Also support YouTube and Vimeo video.', 'b-blocks')}</span>
						</>}

						{'document' === popType && <>
							<BControlPro label={__('Document:', 'b-blocks')} types={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']} {...contentProps} placeholder={__('Enter Document URL', 'b-blocks')} {...premiumProps} Component={InlineMediaUpload} />
							<span>{__('Supported Document: .pdf, .doc, .docx, .xls, .xlsx', 'b-blocks')}</span>
						</>}

						{'iframe' === popType && <>
							<BControlPro label={__('Iframe Source:', 'b-blocks')} {...contentProps} placeholder={__('Enter Iframe URL', 'b-blocks')} {...premiumProps} Component={TextControl} />
							<span>{__('Note: Enter only source URL', 'b-blocks')}</span>
						</>}

						<BControlPro className='mt20' label={__('Title/Caption:', 'b-blocks')} value={popCaption} onChange={val => updateObj('popup', 'caption', val)} {...premiumProps} Component={TextControl} />
					</div>
				</PanelBody>}


				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Button', 'b-blocks')}>
						<Typography value={typography} onChange={val => setAttributes({ typography: val })} defaults={{ fontSize: { desktop: 18, tablet: 17, mobile: 16 }, textDecoration: 'none' }} />

						<ColorsControl value={colors} onChange={val => setAttributes({ colors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />

						<ColorsControl label={__('Hover Colors:', 'b-blocks')} value={hovColors} onChange={val => setAttributes({ hovColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} />

						<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '10px', horizontal: '20px' }} />

						<BorderControl className='mt20' value={border} onChange={val => setAttributes({ border: val })} defaults={{ radius: '5px' }} />

						<ShadowControl label={__('Shadow:', 'b-blocks')} value={shadow?.shadow || shadow} onChange={val => setAttributes({ shadow: val })} />
					</PanelBody>
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<ProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen} block='Button'>
			<li>&emsp;<strong>{__('Button Action: ', 'b-blocks')}</strong>{__('Use the button as a link or popup trigger.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('rel Attribute: ', 'b-blocks')}</strong>{__('Add the rel/relation attribute to the anchor link.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('referrer-policy Attribute: ', 'b-blocks')}</strong>{__('Add the Referrer Policy attribute to the anchor link.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Download File Name: ', 'b-blocks')}</strong>{__('For the download, enter a custom name for the download file. This is an experimental feature, and it may not work reliably every time.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Icon Position: ', 'b-blocks')}</strong>{__('Set the icon position to the left or right.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Tooltip Position: ', 'b-blocks')}</strong>{__('Choose a different position for the tooltip.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Hide on Devices: ', 'b-blocks')}</strong>{__('Hide on various devices (desktop, tablet, and mobile).', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Popup Content: ', 'b-blocks')}</strong>{__('Show Image, Audio, Video, Block Content, Document(.pdf, .doc, .docx, .xls, .xlsx), and Iframe.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Security Features: ', 'b-blocks')}</strong>{__('Login, Password Required', 'b-blocks')}</li>
		</ProModal>


		<BlockControls>
			<AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('Button Alignment')} alignmentControls={[
				{ title: __('Button in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('Button in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('Button in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;
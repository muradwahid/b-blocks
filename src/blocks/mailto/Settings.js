import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelRow, PanelBody, TextControl, SelectControl, Dashicon } from '@wordpress/components';

import { Label, BorderControl, BtnGroup, ColorsControl, IconControl, SpaceControl, Typography } from '../../../../Components';

const mailtoStyles = [
	{ label: 'Default', value: 'default' },
	{ label: 'Style 1', value: 'style1' },
	{ label: 'Style 2', value: 'style2' },
	{ label: 'Style 3', value: 'style3' }
];

const Settings = ({ settings }) => {
	const { attributes: { mailtoAlign, receiverMail, style, btnTypo, btnColors, btnHovColors, btnPadding, btnBorder, icon, iconPosition }, setAttributes } = settings;

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
				<div className='helpItem'>
					<a href='https://bblockswp.com/docs/mail-to-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
				</div>

				<div className='helpItem rateUs'>
					<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
						<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
						<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
					</a>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Mail Settings', 'b-blocks')}>
				<Label className=''>{__('E-mail Address:', 'b-blocks')}</Label>
				<TextControl value={receiverMail} onChange={val => setAttributes({ receiverMail: val })} placeholder={__('Email Address', 'b-blocks')} />

				<PanelRow className='mt20'>
					<Label className=''>{__('Style:', 'b-blocks')}</Label>
					<SelectControl value={style} onChange={val => {
						setAttributes({ style: val });

						'default' === val && setAttributes({
							btnColors: { color: '#fff', bg: '#4527a4', styles: 'color: #fff; background: #4527a4;' },
							btnHovColors: { color: '#fff', bg: '#8344c5', styles: 'color: #fff; background: #8344c5;' },
							iconPosition: 'left'
						});
						'style1' === val && setAttributes({
							btnColors: { color: '#fff', bg: '#4527a4', styles: 'color: #fff; background: #4527a4;' },
							btnHovColors: { color: '#fff', bg: '#8344c5', styles: 'color: #fff; background: #8344c5;' },
							iconPosition: 'right'
						});
						'style2' === val && setAttributes({
							btnColors: { color: '#fff', bg: '#57d0ff', styles: 'color: #fff; background: #57d0ff;' },
							btnHovColors: { color: '#fff', bg: '#50e38b', styles: 'color: #fff; background: #50e38b;' },
							iconPosition: 'left'
						});
						'style3' === val && setAttributes({
							btnColors: { color: '#fff', bg: '#57d0ff', styles: 'color: #fff; background: #57d0ff;' },
							btnHovColors: { color: '#fff', bg: '#50e38b', styles: 'color: #fff; background: #50e38b;' },
							iconPosition: 'right'
						});
					}} options={mailtoStyles} />
				</PanelRow>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Button Settings', 'b-blocks')} initialOpen={false}>
				<Typography value={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: { desktop: 22, tablet: 20, mobile: 18 }, fontWeight: 600 }} />

				<ColorsControl value={btnColors} onChange={val => setAttributes({ btnColors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />

				<ColorsControl label={__('Hover Colors:', 'b-blocks')} value={btnHovColors} onChange={val => setAttributes({ btnHovColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} />

				<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '18px', horizontal: '45px' }} />

				<BorderControl label={__('Border:', 'b-blocks')} value={btnBorder} onChange={val => setAttributes({ btnBorder: val })} defaults={{ radius: '50px' }} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Icon Settings', 'b-blocks')} initialOpen={false}>
				<IconControl value={icon} onChange={val => setAttributes({ icon: val })} defaults={{ class: 'fa fa-paper-plane' }} isSize={false} isColor={false} />

				<PanelRow className='mt20'>
					<Label className='mb5'>{__('Position:', 'b-blocks')}</Label>
					<BtnGroup value={iconPosition} onChange={val => setAttributes({ iconPosition: val })} options={[
						{ label: 'Left', value: 'left', icon: 'LEFT' },
						{ label: 'Right', value: 'right', icon: 'RIGHT' }
					]} />
				</PanelRow>
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={mailtoAlign} onChange={val => setAttributes({ mailtoAlign: val })} describedBy={__('Mail Button Alignment')} alignmentControls={[
				{ title: __('Mail Button in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('Mail Button in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('Mail Button in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;
import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, ToggleControl, Button, Dashicon, __experimentalUnitControl as UnitControl } from '@wordpress/components';

// Settings Components
import Title from '../../../../Components/Title';
import IconControl from '../../../../Components/IconControl';
import Background from '../../../../Components/Background';
import { ImageHolderControl } from '../../../../Components/ImageControl';
import BorderControl from '../../../../Components/BorderControl';
import ShadowControl from '../../../../Components/ShadowControl';

import icons from '../../Const/icons';
import options from '../../Const/options';
const { pxUnit, perUnit, emUnit } = options;
const themes = [
	{ label: __('Default', 'b-blocks'), value: 'default' },
	{ label: __('Theme 1', 'b-blocks'), value: 'theme1' },
	{ label: __('Theme 2', 'b-blocks'), value: 'theme2' }
];
const networkTypes = [
	{ label: __('Social Networks', 'b-blocks'), value: 'socialNetworks' },
	{ label: __('Mobile Messenger', 'b-blocks'), value: 'mobileMessenger' }
];
const socialNetworks = [
	{ label: __('Facebook', 'b-blocks'), value: 'facebook' },
	{ label: __('Twitter', 'b-blocks'), value: 'twitter' },
	{ label: __('LinkedIn', 'b-blocks'), value: 'linkedin' },
	{ label: __('Pinterest', 'b-blocks'), value: 'pinterest' },
	{ label: __('Blogger', 'b-blocks'), value: 'blogger' },
	{ label: __('WordPress', 'b-blocks'), value: 'wordpress' },
	{ label: __('Tumblr', 'b-blocks'), value: 'tumblr' },
	{ label: __('Reddit', 'b-blocks'), value: 'reddit' },
	{ label: __('Digg', 'b-blocks'), value: 'digg' },
	{ label: __('LiveJournal', 'b-blocks'), value: 'livejournal' },
	{ label: __('Evernote', 'b-blocks'), value: 'evernote' },
	{ label: __('Flipboard', 'b-blocks'), value: 'flipboard' },
	{ label: __('Mix', 'b-blocks'), value: 'mix' },
	{ label: __('Pocket', 'b-blocks'), value: 'pocket' },
	{ label: __('Buffer', 'b-blocks'), value: 'buffer' },
	{ label: __('Instapaper', 'b-blocks'), value: 'instapaper' },

	{ label: __('Meneame', 'b-blocks'), value: 'meneame' },

	{ label: __('Baidu', 'b-blocks'), value: 'baidu' },
	{ label: __('Weibo', 'b-blocks'), value: 'weibo' },
	{ label: __('Xing', 'b-blocks'), value: 'xing' },
	{ label: __('RenRen', 'b-blocks'), value: 'renren' },

	{ label: __('Vkontakte (VK)', 'b-blocks'), value: 'vkontakte' },
	{ label: __('Odnoklassniki', 'b-blocks'), value: 'odnoklassniki' },
	{ label: __('My World@Mail.Ru', 'b-blocks'), value: 'moimir' },
	{ label: __('Surfingbird', 'b-blocks'), value: 'surfingbird' },
	{ label: __('LiveInternet', 'b-blocks'), value: 'liveinternet' }
];
const mobileNetworks = [
	{ label: __('SMS', 'b-blocks'), value: 'sms' },
	{ label: __('Skype', 'b-blocks'), value: 'skype' },
	{ label: __('Telegram', 'b-blocks'), value: 'telegram' },
	{ label: __('Viber', 'b-blocks'), value: 'viber' },
	{ label: __('WhatsApp', 'b-blocks'), value: 'whatsapp' },
	{ label: __('WeChat', 'b-blocks'), value: 'wechat' },
	{ label: __('LINE', 'b-blocks'), value: 'line' }
];

const Settings = ({ attributes, setAttributes, activeIndex, setActiveIndex }) => {
	const { socials, alignment, theme, background, size, padding, margin, border, shadow } = attributes;

	const addSocial = () => {
		setAttributes({
			socials: [...socials, {
				networkType: 'socialNetworks',
				network: 'facebook',
				isUpIcon: false,
				icon: { class: 'fab fa-facebook-f', color: '#1877f2' },
				upIcon: { 'id': null, 'url': '', 'alt': '', 'title': '' }
			}]
		});
		setActiveIndex(socials.length);
	}

	const updateSocial = (type, val, otherType = false) => {
		const newSocials = [...socials];

		if (otherType) {
			newSocials[activeIndex][type][otherType] = val;
			setAttributes({ socials: newSocials });
		} else {
			newSocials[activeIndex][type] = val;
			setAttributes({ socials: newSocials });
		}
		setActiveIndex(activeIndex);
	}

	const updateAllSocial = (type, val, otherType = false) => {
		const newSocials = [...socials];

		newSocials.map((social, index) => {
			if (otherType) {
				newSocials[index][type][otherType] = val;
			} else {
				newSocials[index][type] = val;
			}
		});
		setAttributes({ socials: newSocials });
	}

	const { networkType = '', network = '', isUpIcon = false, icon = {}, upIcon = {} } = socials[activeIndex] || {};

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')}>
				<div className='helpItem'>
					<a href='https://bblockswp.com/docs/social-share-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
				</div>

				<div className='helpItem rateUs'>
					<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
						<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
						<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
					</a>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody addRemoveItems editItem' title={__('Add or Remove socials', 'b-blocks')}>
				{null !== activeIndex && <>
					<h3 className='bplItemTitle'>{__(`Social No ${activeIndex + 1}:`, 'b-blocks')}</h3>

					<PanelRow>
						<Title mt='0' mb='0'>{__('Network Type:', 'b-blocks')}</Title>
						<SelectControl value={networkType} onChange={val => {
							updateSocial('networkType', val);
							updateSocial('network', 'mobileMessenger' === val ? 'sms' : 'facebook');

							updateSocial('isUpIcon', false);
							updateSocial('icon', 'mobileMessenger' === val ? 'fas fa-sms' : 'fab fa-facebook-f', 'class');
							updateSocial('icon', 'mobileMessenger' === val ? '#000' : '#1877f2', 'color');
						}} options={networkTypes} />
					</PanelRow>

					<PanelRow>
						<Title mt='0' mb='0'>{__('Network:', 'b-blocks')}</Title>
						<SelectControl value={network} onChange={val => {
							updateSocial('network', val);

							updateSocial('icon', 'facebook' === val ? 'fab fa-facebook-f' : 'twitter' === val ? 'fab fa-twitter' : 'linkedin' === val ? 'fab fa-linkedin-in' : 'pinterest' === val ? 'fab fa-pinterest-p' : 'blogger' === val ? 'fab fa-blogger-b' : 'wordpress' === val ? 'fab fa-wordpress' : 'tumblr' === val ? 'fab fa-tumblr' : 'reddit' === val ? 'fab fa-reddit-alien' : 'digg' === val ? 'fab fa-digg' : 'evernote' === val ? 'fab fa-evernote' : 'flipboard' === val ? 'fab fa-flipboard' : 'mix' === val ? 'fab fa-mix' : 'buffer' === val ? 'fab fa-buffer' : 'weibo' === val ? 'fab fa-weibo' : 'xing' === val ? 'fab fa-xing' : 'renren' === val ? 'fab fa-renren' : 'odnoklassniki' === val ? 'fab fa-odnoklassniki' :

								'sms' === val ? 'fas fa-sms' : 'skype' === val ? 'fab fa-skype' : 'telegram' === val ? 'fab fa-telegram-plane' : 'viber' === val ? 'fab fa-viber' : 'whatsapp' === val ? 'fab fa-whatsapp' : 'line' === val && 'fab fa-line',
								'class');

							updateSocial('icon', 'facebook' === val ? '#1877f2' : 'twitter' === val ? '#1da1f2' : 'linkedin' === val ? '#0a66c2' : 'pinterest' === val ? '#bd081c' : 'blogger' === val ? '#fc4f08' : 'wordpress' === val ? '#0073aa' : 'tumblr' === val ? '#35465d' : 'reddit' === val ? '#ff4500' : 'digg' === val ? '#1b1a19' : 'evernote' === val ? '#00aa0f' : 'flipboard' === val ? '#f52828' : 'mix' === val ? '#ff8226' : 'buffer' === val ? '#000' : 'weibo' === val ? '#df152c' : 'xing' === val ? '#00a82d' : 'renren' === val ? '#0259a0' : 'odnoklassniki' === val ? '#f68b25' :

								'sms' === val ? '#000' : 'skype' === val ? '#00aff0' : 'telegram' === val ? '#0088cc' : 'viber' === val ? '#794f9b' : 'whatsapp' === val ? '#25d366' : 'line' === val && '#06c755',
								'color');


							('facebook' === val || 'twitter' === val || 'linkedin' === val || 'pinterest' === val || 'blogger' === val || 'wordpress' === val || 'tumblr' === val || 'reddit' === val || 'digg' === val || 'evernote' === val || 'flipboard' === val || 'mix' === val || 'buffer' === val || 'weibo' === val || 'xing' === val || 'renren' === val || 'odnoklassniki' === val || 'sms' === val || 'skype' === val || 'telegram' === val || 'viber' === val || 'whatsapp' === val || 'line' === val) && updateSocial('isUpIcon', false);

							('livejournal' === val || 'pocket' === val || 'instapaper' === val || 'meneame' === val || 'baidu' === val || 'vkontakte' === val || 'moimir' === val || 'surfingbird' === val || 'liveinternet' === val || 'wechat' === val) && updateSocial('isUpIcon', true);
						}} options={'mobileMessenger' === networkType ? mobileNetworks : socialNetworks} />
					</PanelRow>

					<ToggleControl className='mt20' label={__('Upload Icon?', 'b-blocks')} checked={isUpIcon} onChange={val => updateSocial('isUpIcon', val)} />

					{isUpIcon ? <ImageHolderControl className='mt20' label={__('Icon:', 'b-blocks')} img={upIcon} onChange={val => updateSocial('upIcon', val)} /> :
						<IconControl label={__('Icon:', 'b-blocks')} icon={icon} onChange={val => updateSocial('icon', val)} defaults={{ class: 'fab fa-facebook-f', color: '#4527a4' }} isSize={false} />}

					<PanelRow className='itemAction mt20 mb15'>
						<Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={e => {
							e.preventDefault();
							setActiveIndex(1 === socials.length ? null : 0 === activeIndex ? 0 : activeIndex - 1);
							setAttributes({ socials: [...socials.slice(0, activeIndex), ...socials.slice(activeIndex + 1)] });
						}} ><Dashicon icon='no' />{__('Remove', 'b-blocks')}</Button>

						<Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={e => {
							e.preventDefault();
							setActiveIndex(socials.length);
							setAttributes({ socials: [...socials, { ...socials[activeIndex] }] });
						}} >{icons.gearSettings}{__('Duplicate', 'b-blocks')}</Button>
					</PanelRow>
				</>}

				<div className='addItem'>
					<Button label={__('Add New Social', 'b-blocks')} onClick={addSocial}><Dashicon icon='plus' />{__('Add New Social', 'b-blocks')}</Button>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Social Icon Settings', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Title mt='0' mb='0'>{__('Theme:', 'b-blocks')}</Title>
					<SelectControl value={theme} onChange={val => {
						setAttributes({ theme: val });
						'default' === val && (
							setAttributes({
								background: { type: 'solid', color: '#0000' },
								border: { width: '0', color: '#0000' }
							}),
							updateAllSocial('icon', '#4527a4', 'color'),
							updateAllSocial('icon', 'color: #4527a4;', 'styles')
						);

						'theme1' === val && (
							setAttributes({
								background: { type: 'gradient', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' },
								border: { width: '0', color: '#0000' }
							}),
							updateAllSocial('icon', '#fff', 'color'),
							updateAllSocial('icon', 'color: #fff;', 'styles')
						);

						'theme2' === val && (
							setAttributes({
								background: { type: 'solid', color: '#0000' },
								border: { width: '2px', color: '#4527a4' }
							}),
							updateAllSocial('icon', '#4527a4', 'color'),
							updateAllSocial('icon', 'color: #4527a4;', 'styles')
						);
					}} options={themes} />
				</PanelRow>

				<Background label={__('Background:', 'b-blocks')} background={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

				<UnitControl className='mt20' label={__('Size:', 'b-blocks')} labelPosition='left' value={size} onChange={val => setAttributes({ size: val })} units={[pxUnit, perUnit, emUnit]} />

				<UnitControl className='mt20' label={__('Padding:', 'b-blocks')} labelPosition='left' value={padding} onChange={val => setAttributes({ padding: val })} units={[pxUnit, perUnit, emUnit]} />

				<UnitControl className='mt20' label={__('Space Between:', 'b-blocks')} labelPosition='left' value={margin} onChange={val => setAttributes({ margin: val })} units={[pxUnit, perUnit, emUnit]} />

				<BorderControl label={__('Border:', 'b-blocks')} border={border} onChange={val => setAttributes({ border: val })} defaults={{ radius: '50%' }} />

				<ShadowControl label={__('Shadow:', 'b-blocks')} shadow={shadow} onChange={val => setAttributes({ shadow: val })} />
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('Social Icons Alignment')} alignmentControls={[
				{ title: __('Social Icons in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('Social Icons in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('Social Icons in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;
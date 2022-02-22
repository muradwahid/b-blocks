import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, ToggleControl, Button, Dashicon, __experimentalUnitControl as UnitControl } from '@wordpress/components';

// Variables
import Title from '../../../../Components/Title';
import IconControl from '../../../../Components/IconControl';
import Background from '../../../../Components/Background';
import { ImageHolderControl } from '../../../../Components/ImageControl';
import BorderControl from '../../../../Components/BorderControl';
import ShadowControl from '../../../../Components/ShadowControl';
import options from '../../Const/options';
const { pxUnit, perUnit, emUnit } = options;
const themes = [
	{ label: __('Default', 'social-sharing'), value: 'default' },
	{ label: __('Theme 1', 'social-sharing'), value: 'theme1' },
	{ label: __('Theme 2', 'social-sharing'), value: 'theme2' }
];
const networkTypes = [
	{ label: __('Social Networks', 'social-sharing'), value: 'socialNetworks' },
	{ label: __('Mobile Messenger', 'social-sharing'), value: 'mobileMessenger' }
];
const socialNetworks = [
	{ label: __('Facebook', 'social-sharing'), value: 'facebook' },
	{ label: __('Twitter', 'social-sharing'), value: 'twitter' },
	{ label: __('LinkedIn', 'social-sharing'), value: 'linkedin' },
	{ label: __('Pinterest', 'social-sharing'), value: 'pinterest' },
	{ label: __('Blogger', 'social-sharing'), value: 'blogger' },
	{ label: __('WordPress', 'social-sharing'), value: 'wordpress' },
	{ label: __('Tumblr', 'social-sharing'), value: 'tumblr' },
	{ label: __('Reddit', 'social-sharing'), value: 'reddit' },
	{ label: __('Digg', 'social-sharing'), value: 'digg' },
	{ label: __('LiveJournal', 'social-sharing'), value: 'livejournal' },
	{ label: __('Evernote', 'social-sharing'), value: 'evernote' },
	{ label: __('Flipboard', 'social-sharing'), value: 'flipboard' },
	{ label: __('Mix', 'social-sharing'), value: 'mix' },
	{ label: __('Pocket', 'social-sharing'), value: 'pocket' },
	{ label: __('Buffer', 'social-sharing'), value: 'buffer' },
	{ label: __('Instapaper', 'social-sharing'), value: 'instapaper' },

	{ label: __('Meneame', 'social-sharing'), value: 'meneame' },

	{ label: __('Baidu', 'social-sharing'), value: 'baidu' },
	{ label: __('Weibo', 'social-sharing'), value: 'weibo' },
	{ label: __('Xing', 'social-sharing'), value: 'xing' },
	{ label: __('RenRen', 'social-sharing'), value: 'renren' },

	{ label: __('Vkontakte (VK)', 'social-sharing'), value: 'vkontakte' },
	{ label: __('Odnoklassniki', 'social-sharing'), value: 'odnoklassniki' },
	{ label: __('My World@Mail.Ru', 'social-sharing'), value: 'moimir' },
	{ label: __('Surfingbird', 'social-sharing'), value: 'surfingbird' },
	{ label: __('LiveInternet', 'social-sharing'), value: 'liveinternet' }
];
const mobileNetworks = [
	{ label: __('SMS', 'social-sharing'), value: 'sms' },
	{ label: __('Skype', 'social-sharing'), value: 'skype' },
	{ label: __('Telegram', 'social-sharing'), value: 'telegram' },
	{ label: __('Viber', 'social-sharing'), value: 'viber' },
	{ label: __('WhatsApp', 'social-sharing'), value: 'whatsapp' },
	{ label: __('WeChat', 'social-sharing'), value: 'wechat' },
	{ label: __('LINE', 'social-sharing'), value: 'line' }
];

import icons from '../../Const/icons';

import { IndexContext } from './edit';

const Settings = ({ attributes, setAttributes }) => {
	const { socials, alignment, theme, background, size, padding, margin, border, shadow } = attributes;

	const setActiveIndex = useContext(IndexContext);

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

	const updateSocial = (index, type, val, otherType = false) => {
		const newSocials = [...socials];

		if (otherType) {
			newSocials[index][type][otherType] = val;
			setAttributes({ socials: newSocials });
		} else {
			newSocials[index][type] = val;
			setAttributes({ socials: newSocials });
		}
		setActiveIndex(index);
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

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody addRemoveItems' title={__('Add or Remove socials', 'social-sharing')}>
				{socials.map((item, index) => {
					const { networkType, network, isUpIcon, icon, upIcon } = item;

					return <PanelBody key={index} className='bPlPanelBody editItem' title={__(`Social No ${index + 1}:`, 'social-sharing')} initialOpen={0 !== index ? false : true}>
						<PanelRow>
							<Title mt='0' mb='0'>{__('Network Type:', 'b-blocks')}</Title>
							<SelectControl value={networkType} onChange={val => {
								updateSocial(index, 'networkType', val);
								updateSocial(index, 'network', 'mobileMessenger' === val ? 'sms' : 'facebook');

								updateSocial(index, 'isUpIcon', false);
								updateSocial(index, 'icon', 'mobileMessenger' === val ? 'fas fa-sms' : 'fab fa-facebook-f', 'class');
								updateSocial(index, 'icon', 'mobileMessenger' === val ? '#000' : '#1877f2', 'color');
							}} options={networkTypes} />
						</PanelRow>

						<PanelRow>
							<Title mt='0' mb='0'>{__('Network:', 'b-blocks')}</Title>
							<SelectControl value={network} onChange={val => {
								updateSocial(index, 'network', val);

								updateSocial(index, 'icon', 'facebook' === val ? 'fab fa-facebook-f' : 'twitter' === val ? 'fab fa-twitter' : 'linkedin' === val ? 'fab fa-linkedin-in' : 'pinterest' === val ? 'fab fa-pinterest-p' : 'blogger' === val ? 'fab fa-blogger-b' : 'wordpress' === val ? 'fab fa-wordpress' : 'tumblr' === val ? 'fab fa-tumblr' : 'reddit' === val ? 'fab fa-reddit-alien' : 'digg' === val ? 'fab fa-digg' : 'evernote' === val ? 'fab fa-evernote' : 'flipboard' === val ? 'fab fa-flipboard' : 'mix' === val ? 'fab fa-mix' : 'buffer' === val ? 'fab fa-buffer' : 'weibo' === val ? 'fab fa-weibo' : 'xing' === val ? 'fab fa-xing' : 'renren' === val ? 'fab fa-renren' : 'odnoklassniki' === val ? 'fab fa-odnoklassniki' :

									'sms' === val ? 'fas fa-sms' : 'skype' === val ? 'fab fa-skype' : 'telegram' === val ? 'fab fa-telegram-plane' : 'viber' === val ? 'fab fa-viber' : 'whatsapp' === val ? 'fab fa-whatsapp' : 'line' === val && 'fab fa-line',
									'class');

								updateSocial(index, 'icon', 'facebook' === val ? '#1877f2' : 'twitter' === val ? '#1da1f2' : 'linkedin' === val ? '#0a66c2' : 'pinterest' === val ? '#bd081c' : 'blogger' === val ? '#fc4f08' : 'wordpress' === val ? '#0073aa' : 'tumblr' === val ? '#35465d' : 'reddit' === val ? '#ff4500' : 'digg' === val ? '#1b1a19' : 'evernote' === val ? '#00aa0f' : 'flipboard' === val ? '#f52828' : 'mix' === val ? '#ff8226' : 'buffer' === val ? '#000' : 'weibo' === val ? '#df152c' : 'xing' === val ? '#00a82d' : 'renren' === val ? '#0259a0' : 'odnoklassniki' === val ? '#f68b25' :

									'sms' === val ? '#000' : 'skype' === val ? '#00aff0' : 'telegram' === val ? '#0088cc' : 'viber' === val ? '#794f9b' : 'whatsapp' === val ? '#25d366' : 'line' === val && '#06c755',
									'color');


								('facebook' === val || 'twitter' === val || 'linkedin' === val || 'pinterest' === val || 'blogger' === val || 'wordpress' === val || 'tumblr' === val || 'reddit' === val || 'digg' === val || 'evernote' === val || 'flipboard' === val || 'mix' === val || 'buffer' === val || 'weibo' === val || 'xing' === val || 'renren' === val || 'odnoklassniki' === val || 'sms' === val || 'skype' === val || 'telegram' === val || 'viber' === val || 'whatsapp' === val || 'line' === val) && updateSocial(index, 'isUpIcon', false);

								('livejournal' === val || 'pocket' === val || 'instapaper' === val || 'meneame' === val || 'baidu' === val || 'vkontakte' === val || 'moimir' === val || 'surfingbird' === val || 'liveinternet' === val || 'wechat' === val) && updateSocial(index, 'isUpIcon', true);
							}} options={'mobileMessenger' === networkType ? mobileNetworks : socialNetworks} />
						</PanelRow>

						<ToggleControl className='mt20' label={__('Upload Icon?', 'social-sharing')} checked={isUpIcon} onChange={val => updateSocial(index, 'isUpIcon', val)} />

						{isUpIcon ? <ImageHolderControl className='mt20' label={__('Icon:', 'social-sharing')} img={upIcon} onChange={val => updateSocial(index, 'upIcon', val)} /> :
							<IconControl label={__('Icon:', 'social-sharing')} icon={icon} onChange={val => updateSocial(index, 'icon', val)} defaults={{ class: 'fab fa-facebook-f', color: '#4527a4' }} disableSize={true} />}

						<PanelRow className='itemAction mt20'>
							<Button className='removeItem' label={__('Remove', 'social-sharing')} onClick={e => {
								e.preventDefault();
								setAttributes({ socials: [...socials.slice(0, index), ...socials.slice(index + 1)] });
							}} ><Dashicon icon='no' size={18} />{__('Remove', 'social-sharing')}</Button>

							<Button className='duplicateItem' label={__('Duplicate', 'social-sharing')} onClick={e => {
								e.preventDefault();
								setAttributes({ socials: [...socials, { ...socials[index] }] });
							}} >{icons.gearSettings}{__('Duplicate', 'social-sharing')}</Button>
						</PanelRow>
					</PanelBody>
				})}

				<div className='addItem'>
					<Button label={__('Add New Social', 'social-sharing')} onClick={addSocial}><Dashicon icon='plus' size={23} />{__('Add New Social', 'social-sharing')}</Button>
				</div>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Social Icon', 'b-blocks')}>
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
				{ title: __('Social Icons in left', 'social-sharing'), align: 'left', icon: 'align-left' },
				{ title: __('Social Icons in center', 'social-sharing'), align: 'center', icon: 'align-center' },
				{ title: __('Social Icons in right', 'social-sharing'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;
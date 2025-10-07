import { __ } from '@wordpress/i18n';

export const themes = [
	{ label: __('Default', 'b-blocks'), value: 'default' },
	{ label: __('Theme 1', 'b-blocks'), value: 'theme1' },
	{ label: __('Theme 2', 'b-blocks'), value: 'theme2' }
];

export const networkTypes = [
	{ label: __('Social Networks', 'b-blocks'), value: 'socialNetworks' },
	{ label: __('Mobile Messenger', 'b-blocks'), value: 'mobileMessenger' }
];

export const socialNetworks = [
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

export const mobileNetworks = [
	{ label: __('SMS', 'b-blocks'), value: 'sms' },
	{ label: __('Skype', 'b-blocks'), value: 'skype' },
	{ label: __('Telegram', 'b-blocks'), value: 'telegram' },
	{ label: __('Viber', 'b-blocks'), value: 'viber' },
	{ label: __('WhatsApp', 'b-blocks'), value: 'whatsapp' },
	{ label: __('WeChat', 'b-blocks'), value: 'wechat' },
	{ label: __('LINE', 'b-blocks'), value: 'line' }
];

export const iconClassList = [
	['facebook', 'fab fa-facebook-f'],
	['twitter', 'fab fa-twitter'],
	['linkedin', 'fab fa-linkedin-in'],
	['pinterest', 'fab fa-pinterest-p'],
	['blogger', 'fab fa-blogger-b'],
	['wordpress', 'fa-brands fa-wordpress'],
	['tumblr', 'fab fa-tumblr'],
	['reddit', 'fab fa-reddit-alien'],
	['digg', 'fab fa-digg'],
	['evernote', 'fab fa-evernote'],
	['flipboard', 'fab fa-flipboard'],
	['mix', 'fab fa-mix'],
	['buffer', 'fab fa-buffer'],
	['weibo', 'fab fa-weibo'],
	['xing', 'fab fa-xing'],
	['renren', 'fab fa-renren'],
	['odnoklassniki', 'fab fa-odnoklassniki'],

	['sms', 'fas fa-sms'],
	['skype', 'fab fa-skype'],
	['telegram', 'fab fa-telegram-plane'],
	['viber', 'fab fa-viber'],
	['whatsapp', 'fab fa-whatsapp'],
	['wechat', 'fab fa-weixin'],
	['line', 'fab fa-line']
];
export const iconColorList = [
	['facebook', '#1877f2'],
	['twitter', '#1da1f2'],
	['linkedin', '#0a66c2'],
	['pinterest', '#bd081c'],
	['blogger', '#fc4f08'],
	['wordpress', '#0073aa'],
	['tumblr', '#35465d'],
	['reddit', '#ff4500'],
	['digg', '#1b1a19'],
	['evernote', '#00aa0f'],
	['flipboard', '#f52828'],
	['mix', '#ff8226'],
	['buffer', '#000'],
	['weibo', '#df152c'],
	['xing', '#00a82d'],
	['renren', '#0259a0'],
	['odnoklassniki', '#f68b25'],

	['sms', '#000'],
	['skype', '#00aff0'],
	['telegram', '#0088cc'],
	['viber', '#794f9b'],
	['whatsapp', '#25d366'],
	['wechat', '#09b83e'],
	['line', '#06c755']
];
export const isUpIconList = [
	['facebook', false],
	['twitter', false],
	['linkedin', false],
	['pinterest', false],
	['blogger', false],
	['wordpress', false],
	['tumblr', false],
	['reddit', false],
	['digg', false],
	['evernote', false],
	['flipboard', false],
	['mix', false],
	['buffer', false],
	['weibo', false],
	['xing', false],
	['renren', false],
	['odnoklassniki', false],

	['sms', false],
	['skype', false],
	['telegram', false],
	['viber', false],
	['whatsapp', false],
	['line', false],

	['livejournal', true],
	['pocket', true],
	['instapaper', true],
	['meneame', true],
	['baidu', true],
	['vkontakte', true],
	['moimir', true],
	['surfingbird', true],
	['liveinternet', true]
];
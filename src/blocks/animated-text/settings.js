import { __ } from '@wordpress/i18n';
import { InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TabPanel, TextareaControl, ToggleControl, SelectControl, Dashicon } from '@wordpress/components';

// Settings Components
import Title from '../../../../Components/Title';
import BtnGroup from '../../../../Components/BtnGroup';
import Background from '../../../../Components/Background';
import Typography from '../../../../Components/Typography';
import BColor from '../../../../Components/BColor';
import SpaceControl from '../../../../Components/SpaceControl';
import BorderControl from '../../../../Components/BorderControl';

import options from '../../Const/options';
const { generalStyleTabs } = options;
const animateInOpt = [
	{ label: __('Char', 'b-blocks'), value: 'char' },
	{ label: __('Word', 'b-blocks'), value: 'word' }
];
const effects = [
	{ label: __('Flash', 'b-blocks'), value: 'flash' },
	{ label: __('Bounce', 'b-blocks'), value: 'bounce' },
	{ label: __('Shake', 'b-blocks'), value: 'shake' },
	{ label: __('Tada', 'b-blocks'), value: 'tada' },
	{ label: __('Swing', 'b-blocks'), value: 'swing' },
	{ label: __('Wobble', 'b-blocks'), value: 'wobble' },
	{ label: __('Pulse', 'b-blocks'), value: 'pulse' },
	{ label: __('Flip', 'b-blocks'), value: 'flip' }
];
const inEffects = [
	{ label: __('Fade In', 'b-blocks'), value: 'fadeIn' },
	{ label: __('Flip In X', 'b-blocks'), value: 'flipInX' },
	{ label: __('Flip In Y', 'b-blocks'), value: 'flipInY' },
	{ label: __('Fade In Up', 'b-blocks'), value: 'fadeInUp' },
	{ label: __('Fade In Down', 'b-blocks'), value: 'fadeInDown' },
	{ label: __('Fade In Left', 'b-blocks'), value: 'fadeInLeft' },
	{ label: __('Fade In Right', 'b-blocks'), value: 'fadeInRight' },
	{ label: __('Fade In Up Big', 'b-blocks'), value: 'fadeInUpBig' },
	{ label: __('Fade In Down Big', 'b-blocks'), value: 'fadeInDownBig' },
	{ label: __('Fade In Left Big', 'b-blocks'), value: 'fadeInLeftBig' },
	{ label: __('Fade In Right Big', 'b-blocks'), value: 'fadeInRightBig' },
	{ label: __('Bounce In', 'b-blocks'), value: 'bounceIn' },
	{ label: __('Bounce In Up', 'b-blocks'), value: 'bounceInUp' },
	{ label: __('Bounce In Down', 'b-blocks'), value: 'bounceInDown' },
	{ label: __('Bounce In Left', 'b-blocks'), value: 'bounceInLeft' },
	{ label: __('Bounce In Right', 'b-blocks'), value: 'bounceInRight' },
	{ label: __('Rotate In', 'b-blocks'), value: 'rotateIn' },
	{ label: __('Rotate In Up Left', 'b-blocks'), value: 'rotateInUpLeft' },
	{ label: __('Rotate In Up Right', 'b-blocks'), value: 'rotateInUpRight' },
	{ label: __('Rotate In Down Left', 'b-blocks'), value: 'rotateInDownLeft' },
	{ label: __('Rotate In Down Right', 'b-blocks'), value: 'rotateInDownRight' },
	{ label: __('Roll In', 'b-blocks'), value: 'rollIn' }
];
const outEffects = [
	{ label: __('Fade Out', 'b-blocks'), value: 'fadeOut' },
	{ label: __('Flip Out X', 'b-blocks'), value: 'flipOutX' },
	{ label: __('Flip Out Y', 'b-blocks'), value: 'flipOutY' },
	{ label: __('Fade Out Up', 'b-blocks'), value: 'fadeOutUp' },
	{ label: __('Fade Out Down', 'b-blocks'), value: 'fadeOutDown' },
	{ label: __('Fade Out Left', 'b-blocks'), value: 'fadeOutLeft' },
	{ label: __('Fade Out Right', 'b-blocks'), value: 'fadeOutRight' },
	{ label: __('Fade Out Up Big', 'b-blocks'), value: 'fadeOutUpBig' },
	{ label: __('Fade Out Down Big', 'b-blocks'), value: 'fadeOutDownBig' },
	{ label: __('Fade Out Left Big', 'b-blocks'), value: 'fadeOutLeftBig' },
	{ label: __('Fade Out Right Big', 'b-blocks'), value: 'fadeOutRightBig' },
	{ label: __('Bounce Out', 'b-blocks'), value: 'bounceOut' },
	{ label: __('Bounce Out Up', 'b-blocks'), value: 'bounceOutUp' },
	{ label: __('Bounce Out Down', 'b-blocks'), value: 'bounceOutDown' },
	{ label: __('Bounce Out Left', 'b-blocks'), value: 'bounceOutLeft' },
	{ label: __('Bounce Out Right', 'b-blocks'), value: 'bounceOutRight' },
	{ label: __('Rotate Out', 'b-blocks'), value: 'rotateOut' },
	{ label: __('Rotate Out Up Left', 'b-blocks'), value: 'rotateOutUpLeft' },
	{ label: __('Rotate Out Up Right', 'b-blocks'), value: 'rotateOutUpRight' },
	{ label: __('Rotate Out Down Left', 'b-blocks'), value: 'rotateOutDownLeft' },
	{ label: __('Rotate Out Down Right', 'b-blocks'), value: 'rotateOutDownRight' },
	{ label: __('Hinge', 'b-blocks'), value: 'hinge' },
	{ label: __('Roll Out', 'b-blocks'), value: 'rollOut' }
];
const sequences = [
	{ label: __('Default', 'b-blocks'), value: 'default' },
	{ label: __('Sync', 'b-blocks'), value: 'sync' },
	{ label: __('Shuffle', 'b-blocks'), value: 'shuffle' },
	{ label: __('Reverse', 'b-blocks'), value: 'reverse' },
];

const Settings = ({ attributes, setAttributes }) => {
	const { loop, animateIn, inEffect, inSequence, outEffect, outSequence, textAlign, background, content, typography, color, padding, border } = attributes;

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
				{'general' === tab.name && <>
					<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')}>
						<div className='helpItem'>
							<a href='https://bblockswp.com/docs/animated-text-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
						</div>

						<div className='helpItem rateUs'>
							<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
								<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
								<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
							</a>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Animated Text Settings', 'b-blocks')}>
						<Title mt='0'>{__('Animate text:', 'b-blocks')}</Title>
						<TextareaControl value={content} onChange={val => setAttributes({ content: val })} />

						<ToggleControl className='mt20' label={__('Loop', 'b-blocks')} checked={loop} onChange={val => setAttributes({ loop: val })} />
						<small>{__('Loop will not work instantly in editor! you have to refresh the page.', 'b-blocks')}</small>

						<PanelRow>
							<Title mt='0' mb='0'>{__('Animate in:', 'b-blocks')}</Title>
							<BtnGroup value={animateIn} onChange={val => setAttributes({ animateIn: val })} options={animateInOpt} />
						</PanelRow>

						<PanelRow>
							<Title mt='0' mb='0'>{__('In Effect:', 'b-blocks')}</Title>
							<SelectControl value={inEffect} onChange={val => setAttributes({ inEffect: val })} options={[...effects, ...inEffects]} />
						</PanelRow>

						<PanelRow>
							<Title mt='0' mb='0'>{__('In Sequence:', 'b-blocks')}</Title>
							<SelectControl value={inSequence} onChange={val => setAttributes({ inSequence: val })} options={sequences} />
						</PanelRow>

						{loop && <>
							<PanelRow>
								<Title mt='0' mb='0'>{__('Out Effect:', 'b-blocks')}</Title>
								<SelectControl value={outEffect} onChange={val => setAttributes({ outEffect: val })} options={[...effects, ...outEffects]} />
							</PanelRow>

							<PanelRow>
								<Title mt='0' mb='0'>{__('Out Sequence:', 'b-blocks')}</Title>
								<SelectControl value={outSequence} onChange={val => setAttributes({ outSequence: val })} options={sequences} />
							</PanelRow>
						</>}
					</PanelBody>
				</>}


				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Animated Text Style', 'b-blocks')}>
						<Background label={__('Background:', 'b-blocks')} background={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

						<Typography className='mt20' label={__('Typography:', 'b-blocks')} typography={typography} onChange={val => setAttributes({ typography: val })} defaults={{ fontSize: 22 }} />

						<BColor label={__('Color:', 'b-blocks')} value={color} onChange={val => setAttributes({ color: val })} defaultColor='#333' />

						<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} space={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '15px', horizontal: '15px' }} />

						<BorderControl label={__('Border:', 'b-blocks')} border={border} onChange={val => setAttributes({ border: val })} defaults={{ radius: '5px' }} />
					</PanelBody>
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;
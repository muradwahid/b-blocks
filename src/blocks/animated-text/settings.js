import { __ } from '@wordpress/i18n';
import { InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TabPanel, TextareaControl, ToggleControl, SelectControl, Dashicon } from '@wordpress/components';
import produce from 'immer';

// Settings Components
import Title from '../../../../Components/Title';
import BtnGroup from '../../../../Components/BtnGroup';
import Background from '../../../../Components/Background';
import Typography from '../../../../Components/Typography';
import BColor from '../../../../Components/BColor';
import SpaceControl from '../../../../Components/SpaceControl';
import BorderControl from '../../../../Components/BorderControl';

import { generalStyleTabs } from '../../utils/options';
import { animateInOpt, effects, inEffects, outEffects, sequences } from './utils/options';

const Settings = ({ attributes, setAttributes }) => {
	const { loop, animateIn, inEffect, inSequence, outEffect, outSequence, textAlign, background, content, typography, color, padding, border } = attributes;

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
				{'general' === tab.name && <>
					<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
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
						<Title className='mb5'>{__('Animate text:', 'b-blocks')}</Title>
						<TextareaControl value={content} onChange={val => setAttributes({ content: val })} />

						<ToggleControl className='mt20' label={__('Loop', 'b-blocks')} checked={loop} onChange={val => setAttributes({ loop: val })} />
						<small>{__('Loop will not work instantly in editor! you have to refresh the page.', 'b-blocks')}</small>

						<PanelRow>
							<Title className=''>{__('Animate in:', 'b-blocks')}</Title>
							<BtnGroup value={animateIn} onChange={val => setAttributes({ animateIn: val })} options={animateInOpt} />
						</PanelRow>

						<PanelRow>
							<Title className=''>{__('In Effect:', 'b-blocks')}</Title>
							<SelectControl value={inEffect} onChange={val => setAttributes({ inEffect: val })} options={[...effects, ...inEffects]} />
						</PanelRow>

						<PanelRow>
							<Title className=''>{__('In Sequence:', 'b-blocks')}</Title>
							<SelectControl value={inSequence} onChange={val => setAttributes({ inSequence: val })} options={sequences} />
						</PanelRow>

						{loop && <>
							<PanelRow>
								<Title className=''>{__('Out Effect:', 'b-blocks')}</Title>
								<SelectControl value={outEffect} onChange={val => setAttributes({ outEffect: val })} options={[...effects, ...outEffects]} />
							</PanelRow>

							<PanelRow>
								<Title className=''>{__('Out Sequence:', 'b-blocks')}</Title>
								<SelectControl value={outSequence} onChange={val => setAttributes({ outSequence: val })} options={sequences} />
							</PanelRow>
						</>}
					</PanelBody>
				</>}


				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Animated Text Style', 'b-blocks')}>
						<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

						<Typography className='mt20' label={__('Typography:', 'b-blocks')} value={typography} onChange={val => setAttributes({ typography: val })} defaults={{ fontSize: { desktop: 22, tablet: 20, mobile: 18 } }} produce={produce} />

						<BColor label={__('Color:', 'b-blocks')} value={color} onChange={val => setAttributes({ color: val })} defaultColor='#333' />

						<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '15px', horizontal: '15px' }} />

						<BorderControl label={__('Border:', 'b-blocks')} value={border} onChange={val => setAttributes({ border: val })} defaults={{ radius: '5px' }} />
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
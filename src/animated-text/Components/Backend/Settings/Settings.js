import { __ } from '@wordpress/i18n';
import { InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TabPanel, TextareaControl, ToggleControl, SelectControl } from '@wordpress/components';

import { Label, Background, BColor, BorderControl, BtnGroup, SpaceControl, Typography, HelpPanel } from '../../../../../../Components';
import { tabController } from '../../../../../../Components/utils/functions';

import { pluginSlug, animatedTextDocs } from '../../../../utils/data';
import { generalStyleTabs } from '../../../../utils/options';
import { animateInOpt, effects, inEffects, outEffects, sequences } from '../../../utils/options';

const Settings = ({ attributes, setAttributes }) => {
	const { loop, animateIn, inEffect, inSequence, outEffect, outSequence, textAlign, background, content, typography, color, padding, border } = attributes;

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<HelpPanel slug={pluginSlug} docsLink={animatedTextDocs} />


					<PanelBody className='bPlPanelBody' title={__('Animated Text Settings', 'b-blocks')}>
						<Label className='mb5'>{__('Animate text:', 'b-blocks')}</Label>
						<TextareaControl value={content} onChange={val => setAttributes({ content: val })} />

						<ToggleControl className='mt20' label={__('Loop', 'b-blocks')} checked={loop} onChange={val => setAttributes({ loop: val })} />
						<small>{__('Loop will not work instantly in editor! you have to refresh the page.', 'b-blocks')}</small>

						<PanelRow>
							<Label className=''>{__('Animate in:', 'b-blocks')}</Label>
							<BtnGroup value={animateIn} onChange={val => setAttributes({ animateIn: val })} options={animateInOpt} />
						</PanelRow>

						<PanelRow>
							<Label className=''>{__('In Effect:', 'b-blocks')}</Label>
							<SelectControl value={inEffect} onChange={val => setAttributes({ inEffect: val })} options={[...effects, ...inEffects]} />
						</PanelRow>

						<PanelRow>
							<Label className=''>{__('In Sequence:', 'b-blocks')}</Label>
							<SelectControl value={inSequence} onChange={val => setAttributes({ inSequence: val })} options={sequences} />
						</PanelRow>

						{loop && <>
							<PanelRow>
								<Label className=''>{__('Out Effect:', 'b-blocks')}</Label>
								<SelectControl value={outEffect} onChange={val => setAttributes({ outEffect: val })} options={[...effects, ...outEffects]} />
							</PanelRow>

							<PanelRow>
								<Label className=''>{__('Out Sequence:', 'b-blocks')}</Label>
								<SelectControl value={outSequence} onChange={val => setAttributes({ outSequence: val })} options={sequences} />
							</PanelRow>
						</>}
					</PanelBody>
				</>}


				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Animated Text Style', 'b-blocks')}>
						<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

						<Typography className='mt20' label={__('Typography:', 'b-blocks')} value={typography} onChange={val => setAttributes({ typography: val })} defaults={{ fontSize: { desktop: 22, tablet: 20, mobile: 18 } }} />

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
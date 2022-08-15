import { __ } from '@wordpress/i18n';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { Dashicon, PanelBody, PanelRow, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

// Settings Components
import Title from '../../../../Components/Title';
import Background from '../../../../Components/Background';
import SpaceControl from '../../../../Components/SpaceControl';
import BorderControl from '../../../../Components/BorderControl';
import ShadowControl from '../../../../Components/ShadowControl';

import options from '../../Const/options';
const { pxUnit, emUnit, vhUnit } = options;
const heightTypes = [
	{ label: __('Auto', 'b-blocks'), value: 'auto' },
	{ label: __('Window Height (100%)', 'b-blocks'), value: 'window' },
	{ label: __('Custom', 'b-blocks'), value: 'custom' }
];
const verticalPositions = [
	{ label: __('Top', 'b-blocks'), value: 'flex-start' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Bottom', 'b-blocks'), value: 'flex-end' }
];

const Settings = ({ attributes, setAttributes }) => {
	const { columnGap, heightType, height, verticalPosition, background, padding, border, shadow } = attributes;

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
				<div className='helpItem'>
					<a href='https://bblockswp.com/docs/b-blocks-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
				</div>

				<div className='helpItem rateUs'>
					<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
						<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
						<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
					</a>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')}>
				<UnitControl label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit]} />

				<PanelRow className='mt20'>
					<Title mt='0' mb='0'>{__('Height:', 'b-blocks')}</Title>
					<SelectControl value={heightType} onChange={val => {
						setAttributes({ heightType: val, height: 'window' === val ? '100vh' : 'auto' === val ? 'auto' : 'initial' })
					}} options={heightTypes} />
				</PanelRow>

				{'custom' === heightType && <UnitControl className='mt10' label={__('Min Height:', 'b-blocks')} labelPosition='left' value={height} onChange={val => setAttributes({ height: val })} units={[pxUnit, emUnit, vhUnit]} />}

				<PanelRow className='mt20'>
					<Title mt='0' mb='0'>{__('Content Position:', 'b-blocks')}</Title>
					<SelectControl value={verticalPosition} onChange={val => {
						setAttributes({ verticalPosition: val })
					}} options={verticalPositions} />
				</PanelRow>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Row Style', 'b-blocks')} initialOpen={false}>
				<Title />
				<Background label={__('Background:', 'b-blocks')} background={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#f5f5f5' }} />

				<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} space={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '50px', horizontal: '5px' }} />

				<BorderControl label={__('Border', 'b-blocks')} border={border} onChange={val => setAttributes({ border: val })} />

				<ShadowControl label={__('Shadow', 'b-blocks')} shadow={shadow} onChange={val => setAttributes({ shadow: val })} />
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			{/* <AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} /> */}
		</BlockControls>
	</>;
};
export default Settings;
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label, Background, BorderControl, ShadowControl, SpaceControl, HelpPanel } from '../../../../../../Components';
import { pxUnit, emUnit, vhUnit } from '../../../../../../Components/utils/options';

import { pluginSlug, rowDocs } from '../../../../utils/data';
import { overflows } from '../../../utils/options';
const heightTypes = [
	{ label: __('Auto', 'b-blocks'), value: 'auto' },
	{ label: __('Window Height (100%)', 'b-blocks'), value: 'window' },
	{ label: __('Custom', 'b-blocks'), value: 'custom' }
];
const positions = axis => ([
	{ label: 'x' === axis ? __('Left', 'b-blocks') : __('Top', 'b-blocks'), value: 'flex-start' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: 'x' === axis ? __('Right', 'b-blocks') : __('Bottom', 'b-blocks'), value: 'flex-end' }
]);

const Settings = ({ attributes, setAttributes }) => {
	const { columnGap, heightType, height, columnPositionY, columnPositionX, overflow, background, padding, border, shadow } = attributes;

	return <InspectorControls>
		<HelpPanel slug={pluginSlug} docsLink={rowDocs} />


		<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')}>
			<UnitControl label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit()]} />

			<PanelRow className='mt20'>
				<Label className=''>{__('Height:', 'b-blocks')}</Label>
				<SelectControl value={heightType} onChange={val => {
					setAttributes({ heightType: val, height: 'window' === val ? '100vh' : 'auto' === val ? 'auto' : 'initial' })
				}} options={heightTypes} />
			</PanelRow>

			{'custom' === heightType && <UnitControl className='mt10' label={__('Min Height:', 'b-blocks')} labelPosition='left' value={height} onChange={val => setAttributes({ height: val })} units={[pxUnit(), emUnit(), vhUnit()]} />}

			<PanelRow className='mt20'>
				<Label className=''>{__('Columns Vertical Position:', 'b-blocks')}</Label>
				<SelectControl value={columnPositionY} onChange={val => setAttributes({ columnPositionY: val })} options={positions('y')} />
			</PanelRow>

			<PanelRow className='mt10'>
				<Label className=''>{__('Columns Horizontal Position:', 'b-blocks')}</Label>
				<SelectControl value={columnPositionX} onChange={val => setAttributes({ columnPositionX: val })} options={positions('x')} />
			</PanelRow>
		</PanelBody>


		<PanelBody className='bPlPanelBody' title={__('Row Style', 'b-blocks')} initialOpen={false}>
			<PanelRow>
				<Label className=''>{__('Overflow:', 'b-blocks')}</Label>
				<SelectControl value={overflow} onChange={val => setAttributes({ overflow: val })} options={overflows} />
			</PanelRow>

			<Background className='mt20' label={__('Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#f5f5f5' }} />

			<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '50px', horizontal: '0px' }} />

			<BorderControl label={__('Border', 'b-blocks')} value={border} onChange={val => setAttributes({ border: val })} />

			<ShadowControl label={__('Shadow', 'b-blocks')} value={shadow} onChange={val => setAttributes({ shadow: val })} />
		</PanelBody>
	</InspectorControls>;
};
export default Settings;
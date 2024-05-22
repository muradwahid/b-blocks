import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, __experimentalUnitControl as UnitControl, SelectControl, PanelRow } from '@wordpress/components';

import { Label, BorderControl, ColorsControl, IconControl, ShadowControl, SpaceControl, Typography, HelpPanel } from '../../../../../../../Components';
import { pxUnit, perUnit, emUnit } from '../../../../../../../Components/utils/options';

import { types } from '../../../utils/options';
import { typeValues } from '../../../utils/functions';

const Settings = ({ attributes, setAttributes }) => {
	const { type, width, alignment, textAlign, icon, isDismiss, typography, colors, padding, border, shadow } = attributes;

	return <>
		<InspectorControls>
			<HelpPanel slug='b-blocks' docsLink='https://bblockswp.com/docs/alert-block' />


			<PanelBody className='bPlPanelBody' title={__('Alert Settings', 'b-blocks')}>
				<PanelRow>
					<Label className=''>{__('Type:', 'b-blocks')}</Label>
					<SelectControl value={type} onChange={val => setAttributes({ type: val, ...typeValues(val, border, shadow) })} options={types} />
				</PanelRow>
				<small>{__('Some settings may change when type will be changed.', 'b-blocks')}</small>

				<UnitControl className='mt20' label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit(), perUnit(), emUnit()]} />
				<small>{__('Keep width 0, to auto width.', 'b-blocks')}</small>

				<IconControl label={__('Alert Icon:', 'b-blocks')} value={icon} onChange={val => setAttributes({ icon: val })} defaults={{ class: 'fa-solid fa-bell' }} isSize={false} isColor={false} />

				<ToggleControl className='mt20' label={__('Alert Dismissible?', 'b-blocks')} checked={isDismiss} onChange={val => setAttributes({ isDismiss: val })} />

				<Typography className='mt20' label={__('Typography:', 'b-blocks')} value={typography} onChange={val => setAttributes({ typography: val })} defaults={{ fontSize: { desktop: 25, tablet: 22, mobile: 20 } }} />

				<ColorsControl value={colors} onChange={val => setAttributes({ colors: val })} defaults={{ color: '#333', bg: '#fff' }} />

				<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '15px', horizontal: '30px' }} />

				<BorderControl label={__('Border:', 'b-blocks')} value={border} onChange={val => setAttributes({ border: val })} defaults={{ width: '2px', color: '#333', radius: '8px' }} />

				<ShadowControl label={__('Shadow:', 'b-blocks')} value={shadow} onChange={val => setAttributes({ shadow: val })} />
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('Alert Alignment')} alignmentControls={[
				{ title: __('Alert in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('Alert in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('Alert in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />

			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;
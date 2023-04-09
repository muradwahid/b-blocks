import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, __experimentalUnitControl as UnitControl, SelectControl, PanelRow, Dashicon } from '@wordpress/components';
import produce from 'immer';

// Settings Components
import Title from '../../../../Components/Title';
import IconControl from '../../../../Components/IconControl';
import ColorsControl from '../../../../Components/ColorsControl';
import SpaceControl from '../../../../Components/SpaceControl';
import BorderControl from '../../../../Components/BorderControl';
import ShadowControl from '../../../../Components/ShadowControl';
import Typography from '../../../../Components/Typography';
import { pxUnit, perUnit, emUnit } from '../../../../Components/Helper/options';

const types = [
	{ label: __('General', 'b-b-blocks'), value: 'general' },
	{ label: __('Success', 'b-b-blocks'), value: 'success' },
	{ label: __('Info', 'b-b-blocks'), value: 'info' },
	{ label: __('Warning', 'b-b-blocks'), value: 'warning' },
	{ label: __('Error', 'b-b-blocks'), value: 'error' }
];

const Settings = ({ attributes, setAttributes }) => {
	const { type, width, alignment, textAlign, icon, isDismiss, typography, colors, padding, border, shadow } = attributes;

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
				<div className='helpItem'>
					<a href='https://bblockswp.com/docs/alert-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
				</div>

				<div className='helpItem rateUs'>
					<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
						<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
						<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
					</a>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Alert Settings', 'b-blocks')}>
				<PanelRow>
					<Title className=''>{__('Type:', 'b-blocks')}</Title>
					<SelectControl value={type} onChange={val => {
						setAttributes({ type: val });
						'general' === val && setAttributes({
							icon: { class: 'fa fa-exclamation-circle' },
							colors: { color: '#333', bg: '#fff' },
							border: { ...border, color: '#333' }
						});
						'success' === val && setAttributes({
							icon: { class: 'fa fa-check-circle' },
							colors: { color: '#12b878', bg: '#12b8781a' },
							border: { ...border, color: '#12b878' }
						});
						'info' === val && setAttributes({
							icon: { class: 'fa fa-info-circle' },
							colors: { color: '#2cacff', bg: '#2cacff1a' },
							border: { ...border, color: '#2cacff' }
						});
						'warning' === val && setAttributes({
							icon: { class: 'fa fa-cog' },
							colors: { color: '#f1ae2a', bg: '#f1ae2a1a' },
							border: { ...border, color: '#f1ae2a' }
						});
						'error' === val && setAttributes({
							icon: { class: 'fa fa-exclamation-triangle' },
							colors: { color: '#db4b68', bg: '#db4b681a' },
							border: { ...border, color: '#db4b68' }
						});
					}} options={types} />
				</PanelRow>
				<small>{__('Some settings may change when type will be changed.', 'b-blocks')}</small>

				<UnitControl className='mt20' label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit(), perUnit(), emUnit()]} />
				<small>{__('Keep width 0, to auto width.', 'b-blocks')}</small>

				<IconControl label={__('Alert Icon:', 'b-blocks')} value={icon} onChange={val => setAttributes({ icon: val })} defaults={{ class: 'fa fa-exclamation-circle' }} isSize={false} isColor={false} />

				<ToggleControl className='mt20' label={__('Alert Dismissible?', 'b-blocks')} checked={isDismiss} onChange={val => setAttributes({ isDismiss: val })} />

				<Typography className='mt20' label={__('Typography:', 'b-blocks')} value={typography} onChange={val => setAttributes({ typography: val })} defaults={{ fontSize: { desktop: 25, tablet: 22, mobile: 20 } }} produce={produce} />

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
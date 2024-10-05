import { __experimentalBorderBoxControl as BorderControl, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Background, BColor, BoxControl, Label, ShadowControl } from '../../../../../../../Components';

const Style = props => {
	const { attributes, setAttributes } = props;
	const { wrapper, icon } = attributes;
	const { width, height, background, border, borderRadius, shadow } = wrapper;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Box', 'b-blocks')} initialOpen={true}>
			<UnitControl label={__('Width', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ wrapper: { ...wrapper, width: val } })} />

			<UnitControl className='mt20' label={__('Height', 'b-blocks')} labelPosition='left' value={height} onChange={val => setAttributes({ wrapper: { ...wrapper, height: val } })} />

			<Background className='mt20' label={__('Background', 'b-blocks')} value={background} onChange={val => setAttributes({ wrapper: { ...wrapper, background: val } })} />


			<BoxControl className='mt20' label={__('Padding', 'b-blocks')} values={wrapper.padding} onChange={val => setAttributes({ wrapper: { ...wrapper, padding: val } })} />

			<Label>{__('Border', 'b-blocks')}</Label>
			<BorderControl label='' value={border} onChange={val => setAttributes({ wrapper: { ...wrapper, border: val } })} />

			<UnitControl className='mt20' label={__('Border Radius', 'b-blocks')} labelPosition='left' value={borderRadius} onChange={val => setAttributes({ wrapper: { ...wrapper, borderRadius: val } })} />

			<BoxControl className='mt20' label={__('Margin', 'b-blocks')} values={wrapper.margin} onChange={val => setAttributes({ wrapper: { ...wrapper, margin: val } })} />

			<ShadowControl className='mt20' label={__('Shadow', 'b-blocks')} value={shadow} onChange={val => setAttributes({ wrapper: { ...wrapper, shadow: val } })} />
		</PanelBody>


		<PanelBody className='bPlPanelBody' title={__('Icon', 'b-blocks')} initialOpen={false}>
			<BColor label={__('Color', 'b-blocks')} value={icon.color} onChange={val => setAttributes({ icon: { ...icon, color: val } })} />

			<UnitControl className='mt20' label={__('Size', 'b-blocks')} labelPosition='left' value={icon.size} onChange={val => setAttributes({ icon: { ...icon, size: val } })} />

			<ShadowControl className='mt20' label={__('Shadow', 'b-blocks')} value={icon.shadow} onChange={val => setAttributes({ icon: { ...icon, shadow: val } })} />
		</PanelBody>
	</>
}
export default Style;
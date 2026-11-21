import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, ToggleControl, SelectControl } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';

const AnimationVariants = ({ attributes, setAttributes, modelInfo }) => {
	const { autoplay = false, animationName = '', isAnimationSelector = false, variantName = '', isVariantSelector = false } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Animation & Variants', 'b-blocks')} initialOpen={false}>
		<ToggleControl label={__('Autoplay Animation', 'b-blocks')} checked={autoplay} onChange={val => setAttributes({ autoplay: val })} help={__('Works only for models that have animations.', 'b-blocks')} />

		{modelInfo.loaded && (0 < modelInfo.animations.length ? <PanelRow className='mt20'>
			<Label className=''>{__('Animation:', 'b-blocks')}</Label>
			<SelectControl value={animationName} onChange={val => setAttributes({ animationName: val })} options={[{ label: __('First', 'b-blocks'), value: '' }, ...modelInfo.animations.map(name => ({ label: name, value: name }))]} />
		</PanelRow> : <small>{__('This model has no animations.', 'b-blocks')}</small>)}

		<ToggleControl className='mt20' label={__('Animation Selector', 'b-blocks')} checked={isAnimationSelector} onChange={val => setAttributes({ isAnimationSelector: val })} help={__('Visitors can switch animations. Shown when the model has more than one.', 'b-blocks')} />

		{modelInfo.loaded && (0 < modelInfo.variants.length ? <PanelRow className='mt20'>
			<Label className=''>{__('Variant:', 'b-blocks')}</Label>
			<SelectControl value={variantName} onChange={val => setAttributes({ variantName: val })} options={[{ label: __('Default', 'b-blocks'), value: '' }, ...modelInfo.variants.map(name => ({ label: name, value: name }))]} />
		</PanelRow> : <small className='mt20' style={{ display: 'block' }}>{__('This model has no variants.', 'b-blocks')}</small>)}

		<ToggleControl className='mt20' label={__('Variant Selector', 'b-blocks')} checked={isVariantSelector} onChange={val => setAttributes({ isVariantSelector: val })} help={__('Visitors can switch material variants, for example colors.', 'b-blocks')} />
	</PanelBody>;
};
export default AnimationVariants;

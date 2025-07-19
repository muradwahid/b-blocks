import { Flex, PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { Device, Label } from '../../../../../../../bpl-tools/Components';
import { BControlPro, BtnGroupPro } from '../../../../../../../bpl-tools/ProControls';
import { arrowStyles } from '../../../../utils/options';

const SliderSettings = ({ attributes, updateObj, device, isPremium, setIsProModalOpen, }) => {
	const { sliderOptions } = attributes;
	const { autoplay, speed, autoplaySpeed, pauseOnHover, infinite, dots, arrows, slidesView, arrowType } = sliderOptions;
	return <>
		<PanelBody className='bPlPanelBody' title={__('Slider Settings', 'image-compare')} initialOpen={false}>

			<BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__("Enable Autoplay", "image-compare")} checked={autoplay} value={autoplay} onChange={val => updateObj('sliderOptions', val, 'autoplay')} Component={ToggleControl} />

			<BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} className='mt10' label={__("Stop Slider On Mouse Over")} checked={pauseOnHover} value={pauseOnHover} onChange={val => updateObj('sliderOptions', val, 'pauseOnHover')} Component={ToggleControl} />

			<BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} className='mt10' label={__("Enable Infinite Loop")} checked={infinite} value={infinite} onChange={val => updateObj('sliderOptions', val, 'infinite')} Component={ToggleControl} />

			<BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} className='mt10' label={__("Enable Pagination")} checked={dots} value={dots} onChange={val => updateObj('sliderOptions', val, 'dots')} Component={ToggleControl} />

			<BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} className='mt10' label={__("Enable Navigation")} checked={arrows} value={arrows} onChange={val => updateObj('sliderOptions', val, 'arrows')} Component={ToggleControl} />

			<BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} className='mt10' label={<Flex>{__("Slides To Show")} <Device /> </Flex>} step={1} min={1} max={10} value={slidesView[device]} onChange={val => updateObj('sliderOptions', val, 'slidesView', device)} Component={RangeControl} />

			{autoplay ? <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__("Slider Speed (ms)")} step={50} min={0} max={10000} value={autoplaySpeed} onChange={val => updateObj("sliderOptions", val, "autoplaySpeed")} Component={RangeControl} /> : null}

			<BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__("Slider Delay (ms)")} step={50} min={0} max={10000} value={speed} onChange={val => updateObj("sliderOptions", val, "speed")} Component={RangeControl} />

		</PanelBody>
		<PanelBody className='bPlPanelBody' title={__('Slider Arrow', 'image-compare')} initialOpen={false}>

			<Label>{__("Arrow Style", "image-compare")}</Label>
			<BtnGroupPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} isIcon={true} value={arrowType} onChange={(arrow) => updateObj("sliderOptions", arrow, "arrowType")} options={arrowStyles} proValues={["style1", "style2", "style3", "style4", "style5", "style6"]} size="default" />

		</PanelBody>
	</>
};
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(SliderSettings);
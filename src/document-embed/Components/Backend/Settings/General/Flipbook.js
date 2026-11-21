import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { ColorControl } from '../../../../../../../bpl-tools/Components';
import { BControlPro } from '../../../../../../../bpl-tools/ProControls';
import { flipStyleOptions, pageModeOptions } from '../../../../utils/options';

const Flipbook = ({ attributes, updateObj, premiumProps }) => {
	const { viewer = {}, flipbook = {} } = attributes;
	const { style = '3d', mobileSoft = true, hardCover = false, sound = true, autoPlay = false, autoPlayDuration = 3000, pageMode = 'auto', speed = 800, edgeColor = '#ffffff' } = flipbook;
	const isBook = 'flipbook' === viewer.engine;

	return <PanelBody className='bPlPanelBody' title={isBook ? __('Flipbook', 'b-blocks') : __('Slider', 'b-blocks')} initialOpen={false}>
		{isBook && <>
			<SelectControl
				label={__('Flip Style', 'b-blocks')}
				value={style}
				options={flipStyleOptions}
				onChange={(val) => updateObj('flipbook', val, 'style')}
				help={__('Browsers without WebGL show 3D as soft. Visitors who prefer reduced motion get the flat page turn.', 'b-blocks')}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			{'3d' === style && <ToggleControl
				className='mt10'
				label={__('Use Soft Style on Phones', 'b-blocks')}
				help={__('Phones get the lighter soft style instead of WebGL 3D.', 'b-blocks')}
				checked={mobileSoft}
				onChange={(val) => updateObj('flipbook', val, 'mobileSoft')}
			/>}

			<BControlPro className='mt10' label={__('Page Mode', 'b-blocks')} value={pageMode} options={pageModeOptions} onChange={(val) => updateObj('flipbook', val, 'pageMode')} {...premiumProps} Component={SelectControl} />

			{'flat' !== style && <BControlPro className='mt10' label={__('Hard Cover', 'b-blocks')} help={__('The first and last pages turn like a stiff cover.', 'b-blocks')} checked={hardCover} onChange={(val) => updateObj('flipbook', val, 'hardCover')} {...premiumProps} Component={ToggleControl} />}

			<BControlPro className='mt10' label={__('Page Turn Sound', 'b-blocks')} checked={sound} onChange={(val) => updateObj('flipbook', val, 'sound')} {...premiumProps} Component={ToggleControl} />

			{'3d' === style && <BControlPro className='mt10' label={__('3D Page Edge Color', 'b-blocks')} value={edgeColor} defaultColor='#ffffff' onChange={(val) => updateObj('flipbook', val, 'edgeColor')} {...premiumProps} Component={ColorControl} />}
		</>}

		<BControlPro className='mt10' label={isBook ? __('Page Turn Speed (ms)', 'b-blocks') : __('Slide Speed (ms)', 'b-blocks')} labelPosition='edge' value={speed} min={200} max={3000} step={100} onChange={(val) => updateObj('flipbook', Number(val) || 800, 'speed')} {...premiumProps} Component={NumberControl} />

		<BControlPro className='mt10' label={__('Auto Play', 'b-blocks')} checked={autoPlay} onChange={(val) => updateObj('flipbook', val, 'autoPlay')} {...premiumProps} Component={ToggleControl} />

		{autoPlay && <BControlPro className='mt10' label={__('Auto Play Interval (ms)', 'b-blocks')} labelPosition='edge' value={autoPlayDuration} min={1000} step={100} onChange={(val) => updateObj('flipbook', Number(val) || 3000, 'autoPlayDuration')} {...premiumProps} Component={NumberControl} />}
	</PanelBody>;
};
export default Flipbook;

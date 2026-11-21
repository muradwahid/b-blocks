import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, SelectControl, RangeControl } from '@wordpress/components';

import { Label, InlineMediaUpload } from '../../../../../../../bpl-tools/Components';
import { environmentImages } from '../../../../utils/options';

const Lighting = ({ attributes, setAttributes }) => {
	const { environmentImage = '', environmentImageUrl = '', skyboxImage = '', exposure = '', shadowIntensity = '', shadowSoftness = '' } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Lighting & Environment', 'b-blocks')} initialOpen={false}>
		<PanelRow>
			<Label className=''>{__('Environment Image:', 'b-blocks')}</Label>
			<SelectControl value={environmentImage} onChange={val => setAttributes({ environmentImage: val })} options={environmentImages} />
		</PanelRow>
		<small>{__('Lighting and reflections on the model.', 'b-blocks')}</small>

		{'custom' === environmentImage && <InlineMediaUpload className='mt10' value={environmentImageUrl} onChange={val => setAttributes({ environmentImageUrl: val })} placeholder={__('Enter Image URL', 'b-blocks')} />}

		<InlineMediaUpload className='mt20' label={__('Skybox Image:', 'b-blocks')} value={skyboxImage} onChange={val => setAttributes({ skyboxImage: val })} placeholder={__('Enter HDR, JPG or PNG URL', 'b-blocks')} />
		<small>{__('Shown as the background and also lights the model.', 'b-blocks')}</small>

		<RangeControl className='mt20' label={__('Exposure:', 'b-blocks')} value={'' !== exposure ? exposure : undefined} onChange={val => setAttributes({ exposure: val })} min={0} max={5} step={0.1} initialPosition={1} allowReset help={__('Brightness of the model. 1 is the default.', 'b-blocks')} />

		<RangeControl className='mt20' label={__('Shadow Intensity:', 'b-blocks')} value={'' !== shadowIntensity ? shadowIntensity : undefined} onChange={val => setAttributes({ shadowIntensity: val })} min={0} max={1} step={0.1} initialPosition={0} allowReset />

		<RangeControl className='mt20' label={__('Shadow Softness:', 'b-blocks')} value={'' !== shadowSoftness ? shadowSoftness : undefined} onChange={val => setAttributes({ shadowSoftness: val })} min={0} max={1} step={0.1} initialPosition={1} allowReset />
	</PanelBody>;
};
export default Lighting;

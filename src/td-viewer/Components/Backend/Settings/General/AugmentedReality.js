import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, ToggleControl, SelectControl } from '@wordpress/components';

import { Label, InlineMediaUpload } from '../../../../../../../bpl-tools/Components';
import { arModes, arPlacements } from '../../../../utils/options';

const AugmentedReality = ({ attributes, setAttributes }) => {
	const { isAR = false, arMode = '', arPlacement = '', iosSrc = '' } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Augmented Reality', 'b-blocks')} initialOpen={false}>
		<ToggleControl label={__('Enable AR', 'b-blocks')} checked={isAR} onChange={val => setAttributes({ isAR: val })} help={__('Visitors on supported phones can place the model in their room.', 'b-blocks')} />

		{isAR && <>
			<PanelRow className='mt20'>
				<Label className=''>{__('AR Mode:', 'b-blocks')}</Label>
				<SelectControl value={arMode} onChange={val => setAttributes({ arMode: val })} options={arModes} />
			</PanelRow>
			<small>{__('Tried first; the other modes are kept as fallback.', 'b-blocks')}</small>

			<PanelRow className='mt20'>
				<Label className=''>{__('AR Placement:', 'b-blocks')}</Label>
				<SelectControl value={arPlacement} onChange={val => setAttributes({ arPlacement: val })} options={arPlacements} />
			</PanelRow>

			<InlineMediaUpload className='mt20' label={__('iOS Model (.usdz):', 'b-blocks')} value={iosSrc} types={['model/vnd.usdz+zip']} onChange={val => setAttributes({ iosSrc: val })} placeholder={__('Enter USDZ URL (optional)', 'b-blocks')} />
		</>}
	</PanelBody>;
};
export default AugmentedReality;

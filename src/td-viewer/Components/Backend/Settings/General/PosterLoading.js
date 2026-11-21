import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, ToggleControl, SelectControl } from '@wordpress/components';

import { Label, InlineMediaUpload } from '../../../../../../../bpl-tools/Components';
import { revealTypes } from '../../../../utils/options';

const PosterLoading = ({ attributes, setAttributes }) => {
	const { poster = '', reveal = '', isProgressBar = true, isLoadingPercent = false } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Poster & Loading', 'b-blocks')} initialOpen={false}>
		<InlineMediaUpload label={__('Poster Image:', 'b-blocks')} value={poster} onChange={val => setAttributes({ poster: val })} placeholder={__('Enter Poster URL', 'b-blocks')} />
		<small>{__('Shown until the model is loaded.', 'b-blocks')}</small>

		<PanelRow className='mt20'>
			<Label className=''>{__('Show Model:', 'b-blocks')}</Label>
			<SelectControl value={reveal} onChange={val => setAttributes({ reveal: val })} options={revealTypes} />
		</PanelRow>
		{'interaction' === reveal && <small>{poster ? __('The poster stays until the visitor clicks it.', 'b-blocks') : __('Add a poster image to use this. Without one the model loads normally.', 'b-blocks')}</small>}

		<ToggleControl className='mt20' label={__('Progress Bar', 'b-blocks')} checked={isProgressBar} onChange={val => setAttributes({ isProgressBar: val })} />

		<ToggleControl className='mt20' label={__('Loading Percentage', 'b-blocks')} checked={isLoadingPercent} onChange={val => setAttributes({ isLoadingPercent: val })} />
	</PanelBody>;
};
export default PosterLoading;

import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, SelectControl } from '@wordpress/components';

import { BoxControl, Background, Device } from '../../../../../../../bpl-tools/Components';
import { aspectRatioOptions, imageFitOptions } from '../../../../utils/options';
import { at } from '../../../../utils/functions';

const ImageOverlay = ( { attributes, updateObj, device = 'desktop' } ) => {
	const { media = {} } = attributes;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Image', 'b-blocks')} initialOpen={false}>

			<SelectControl __next40pxDefaultSize __nextHasNoMarginBottom label={__('Aspect Ratio', 'b-blocks')} labelPosition='edge' value={ media.ratio } options={ aspectRatioOptions } onChange={ ( val ) => updateObj( 'media', val, 'ratio' ) } />

			<SelectControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={__('Object Fit', 'b-blocks')}
				labelPosition='edge'
				value={ media.fit }
				options={ imageFitOptions }
				onChange={ ( val ) => updateObj( 'media', val, 'fit' ) }
			/>

			<BoxControl
				className='mt10'
				label={ <Flex>{ __( 'Border Radius', 'b-blocks' ) } <Device /></Flex> }
				values={ at( media, device, 'radius' ) }
				onChange={(val) => updateObj('media', val, device, 'radius')}
			/>

			<BoxControl
				className='mt10'
				label={ <Flex>{ __( 'Margin', 'b-blocks' ) } <Device /></Flex> }
				values={ at( media, device, 'margin' ) }
				onChange={(val) => updateObj('media', val, device, 'margin')}
			/>

			<Background
				label={ __( 'Background:', 'b-blocks' ) }
				value={ media.bg }
				isImage={ false }
				onChange={ ( val ) => updateObj( 'media', val, 'bg' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Hover Overlay', 'b-blocks' ) } initialOpen={ false }>
			<Background
				label={ __( 'Overlay Background:', 'b-blocks' ) }
				value={ media.overlay }
				isImage={ false }
				onChange={ ( val ) => updateObj( 'media', val, 'overlay' ) }
			/>

		</PanelBody>
	</>;
};

export default ImageOverlay;

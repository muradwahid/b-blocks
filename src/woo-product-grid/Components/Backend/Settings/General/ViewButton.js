import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

import ButtonIcon from '../../Controls/ButtonIcon';

const ViewButton = ( { attributes, updateObj, device = 'desktop' } ) => {
	const { elements = {}, viewButton = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={ __( 'View Button', 'b-blocks' ) } initialOpen={ false }>
		<ToggleControl
			label={ __( 'Show View Button', 'b-blocks' ) }
			checked={ !! elements.viewButton }
			onChange={ ( val ) => updateObj( 'elements', val, 'viewButton' ) }
		/>

		{ elements.viewButton && <>
			<TextControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Button Text', 'b-blocks' ) }
				value={ viewButton.text }
				onChange={ ( val ) => updateObj( 'viewButton', val, 'text' ) }
			/>

			<ButtonIcon group='viewButton' value={ viewButton } updateObj={ updateObj } device={ device } />
		</> }
	</PanelBody>;
};

export default ViewButton;

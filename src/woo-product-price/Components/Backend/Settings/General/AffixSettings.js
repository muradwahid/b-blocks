import { __ } from '@wordpress/i18n';
import { TextControl, ToggleControl } from '@wordpress/components';

import { BtnGroup, IconLibrary } from '../../../../../../../bpl-tools/Components';

import { affixTypeOptions } from '../../../../utils/options';
import metadata from '../../../../block.json';

const AffixSettings = ( { attributes, updateObj, texts = {}, which } ) => {
	const affix = attributes[ which ] || {};
	const isPrefix = 'prefix' === which;
	const type = 'icon' === affix.type ? 'icon' : 'text';

	return <div className={ isPrefix ? '' : 'mt20' }>
		<ToggleControl
			__nextHasNoMarginBottom
			label={ isPrefix ? __( 'Show Prefix', 'b-blocks' ) : __( 'Show Suffix', 'b-blocks' ) }
			checked={ false !== affix.show }
			onChange={ ( val ) => updateObj( which, val, 'show' ) }
		/>

		{ false !== affix.show && <>
			<BtnGroup
				className='mt10'
				label={ isPrefix ? __( 'Prefix Type', 'b-blocks' ) : __( 'Suffix Type', 'b-blocks' ) }
				value={ type }
				defaultValue={ type }
				options={ affixTypeOptions }
				onChange={ ( val ) => updateObj( which, val, 'type' ) }
			/>

			{ 'text' === type ? <TextControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ isPrefix ? __( 'Prefix Text', 'b-blocks' ) : __( 'Suffix Text', 'b-blocks' ) }
				help={ __( 'Empty: nothing is shown.', 'b-blocks' ) }
				value={ texts[ which ] ?? '' }
				onChange={ ( val ) => updateObj( which, val, 'text' ) }
			/> : <IconLibrary
				className='mt10'
				label={ isPrefix ? __( 'Prefix Icon', 'b-blocks' ) : __( 'Suffix Icon', 'b-blocks' ) }
				value={ affix.icon ?? metadata.attributes[ which ].default.icon }
				onChange={ ( val ) => updateObj( which, val, 'icon' ) }
			/> }
		</> }
	</div>;
};

export default AffixSettings;

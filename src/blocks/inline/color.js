import { registerFormatType, applyFormat, removeFormat, getActiveFormat } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';
import { InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';


// Variables
import options from '../../utils/options';
const { colors } = options;


const allOptions = [
	// { name: 'color', title: __('Inline Color', 'b-blocks') },
	{ name: 'background-color', title: __('Inline Background Color', 'b-blocks') }
];

allOptions.forEach(({ name, title }) => {
	const type = `b-blocks/${name}`;

	registerFormatType(type, {
		title,
		tagName: 'span',
		className: `b_blocks_${name}`,

		attributes: {
			style: 'style'
		},

		edit({ isActive, value, onChange }) {
			let activeColor;

			if (isActive) {
				const activeFormat = getActiveFormat(value, type)
				const style = activeFormat.attributes.style

				activeColor = style.replace(new RegExp(`^${name}:\\s*`), '');
			}


			return (
				<InspectorControls>
					<PanelBody className='bBlocksPanelBody' icon='admin-customizer' title={title} initialOpen={false}>
						<ColorPalette value={activeColor} onChange={color => {
							if (color) {
								onChange(applyFormat(value, {
									type,
									attributes: { style: `${name}:${color}` }
								}))
								return
							}

							onChange(removeFormat(value, type));
						}} colors={colors} />
					</PanelBody>
				</InspectorControls>
			);
		}
	});
});
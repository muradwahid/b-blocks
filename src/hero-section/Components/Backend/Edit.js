import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { useBlockProps, RichText, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Style from '../Common/Style';
import Settings from './Settings/Settings';

const ALIGN_VALUES = ['left', 'center', 'right'];

const Edit = (props) => {
	const { attributes, setAttributes, clientId, device = 'desktop' } = props;
	const { layout = {}, eyebrow = {}, heading = {}, subHeading = {}, button = {} } = attributes;

	const isPremium = typeof bBlocksPremiumChecker !== 'undefined' ? bBlocksPremiumChecker : false;
	const updateObj = updateAttributes(attributes, setAttributes);

	const { contentAlign = {} } = layout;
	const contentAlignVal = (contentAlign && typeof contentAlign === 'object') ? (contentAlign[device] || '') : (device === 'desktop' ? (contentAlign || '') : '');

	const setContentAlign = (val) => {
		const base = (contentAlign && typeof contentAlign === 'object') ? contentAlign : {};
		setAttributes({ layout: { ...layout, contentAlign: { ...base, [device]: val } } });
	};

	const HeadingTag = ['h1', 'h2', 'h3'].includes(heading.tag) ? heading.tag : 'h1';

	const blockProps = useBlockProps({ id: `block-${clientId}` });

	return (
		<>
			<Settings {...{ ...props, updateObj, isPremium }} />

			<BlockControls>
				<AlignmentToolbar
					value={contentAlignVal}
					onChange={(val) => setContentAlign(ALIGN_VALUES.includes(val) ? val : '')}
				/>
			</BlockControls>

			<div {...blockProps}>
				<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />

				<div>
					<div className='b-blocks-hero-section'>
						<div className='b-blocks-hero-section-container'>
							{!!eyebrow.show && (
								<RichText
									tagName='span'
									className='b-blocks-hero-section-eyebrow'
									value={eyebrow.text}
									onChange={(val) => updateObj('eyebrow', val, 'text')}
									placeholder={__('Eyebrow label', 'b-blocks')}
									allowedFormats={['core/bold', 'core/italic']}
									inlineToolbar
								/>
							)}

							<RichText
								tagName={HeadingTag}
								className='b-blocks-hero-section-heading'
								value={heading.text}
								onChange={(val) => updateObj('heading', val, 'text')}
								placeholder={__('Add a powerful headline…', 'b-blocks')}
								allowedFormats={['core/bold', 'core/italic']}
								inlineToolbar
							/>

							{!!subHeading.show && (
								<RichText
									tagName='p'
									className='b-blocks-hero-section-subheading'
									value={subHeading.text}
									onChange={(val) => updateObj('subHeading', val, 'text')}
									placeholder={__('Add supporting copy…', 'b-blocks')}
									allowedFormats={['core/bold', 'core/italic', 'core/link']}
									inlineToolbar
								/>
							)}

							{!!button.show && (
								<div className='b-blocks-hero-section-actions'>
									<RichText
										tagName='a'
										className='b-blocks-hero-section-cta b-blocks-hero-section-cta--primary'
										value={button.text}
										onChange={(val) => updateObj('button', val, 'text')}
										placeholder={__('Primary CTA', 'b-blocks')}
										allowedFormats={[]}
										withoutInteractiveFormatting
										onClick={(e) => e.preventDefault()}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(Edit);

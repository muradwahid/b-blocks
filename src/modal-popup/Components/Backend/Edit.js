import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import { modalSizeMap } from '../../utils/data';

const TEMPLATE = [
	['core/heading', { level: 3, placeholder: 'Modal heading...' }],
	['core/paragraph', { placeholder: 'Add the modal content here. You can drop any blocks inside — newsletter forms, images, embeds, etc.' }]
];

const Edit = ({ attributes, setAttributes, clientId }) => {
	const {
		triggerType, triggerLabel, triggerIcon, triggerImageUrl, triggerImageAlt, triggerAlign,
		triggerBtnColors, triggerBtnPadding, triggerBtnBorderRadius, triggerTypography,
		modalSize, modalBgColor, overlayColor, modalPadding, modalBorderRadius,
		showCloseButton, modalTitle, modalTitleTypography, modalTitleColor
	} = attributes;

	const id = `block-${clientId}`;
	const colors = triggerBtnColors || {};
	const padding = triggerBtnPadding || {};
	const mPadding = modalPadding || {};
	const fontDesktop = triggerTypography?.fontSize?.desktop || '16px';
	const titleFontDesktop = modalTitleTypography?.fontSize?.desktop || '22px';
	const titleFontWeight = modalTitleTypography?.fontWeight || 600;
	const dialogMaxWidth = modalSizeMap[modalSize] || '600px';

	const css = `
		#${id} { text-align: ${triggerAlign || 'left'}; }
		#${id} .modalTriggerButton {
			background-color: ${colors.bg || '#0073aa'};
			color: ${colors.color || '#ffffff'};
			padding: ${padding.vertical || '10px'} ${padding.horizontal || '20px'};
			border-radius: ${triggerBtnBorderRadius || '4px'};
			font-size: ${fontDesktop};
		}
		#${id} .modalTriggerText {
			color: ${colors.color || '#0073aa'};
			font-size: ${fontDesktop};
		}
		#${id} .modalTriggerIcon i {
			font-size: ${(triggerIcon && triggerIcon.fontSize) || 24}px;
			color: ${(triggerIcon && triggerIcon.color) || '#0073aa'};
		}
		#${id} .modalEditorPreviewBody.modalDialog {
			background-color: ${modalBgColor || '#ffffff'};
			padding: ${mPadding.vertical || '30px'} ${mPadding.horizontal || '30px'};
			border-radius: ${modalBorderRadius || '8px'};
			max-width: ${dialogMaxWidth};
			width: 100%;
			margin: 0 auto;
			position: relative;
		}
		#${id} .modalEditorPreviewBody .modalTitle {
			color: ${modalTitleColor || '#111111'};
			font-size: ${titleFontDesktop};
			font-weight: ${titleFontWeight};
			margin: 0 0 16px 0;
		}
		#${id} .modalEditorPreviewBody .modalCloseHint {
			position: absolute;
			top: 8px;
			right: 8px;
			width: 32px;
			height: 32px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			font-size: 22px;
			color: #555;
			background: rgba(0,0,0,0.05);
			border-radius: 50%;
		}
		#${id} .modalEditorPreviewWrapper {
			--overlay: ${overlayColor || 'rgba(0,0,0,0.6)'};
		}
	`;

	const renderTrigger = () => {
		const iconClass = triggerIcon?.class;
		if (triggerType === 'image') {
			if (triggerImageUrl) {
				return <span className='modalTrigger modalTriggerImage'>
					<img src={triggerImageUrl} alt={triggerImageAlt || ''} style={{ maxWidth: 200, height: 'auto', display: 'block' }} />
				</span>;
			}
			return <span className='modalTrigger modalTriggerImage' style={{ padding: '12px 20px', background: '#eee', borderRadius: 6, color: '#666' }}>
				{__('Select an image in the sidebar.', 'b-blocks')}
			</span>;
		}
		if (triggerType === 'text') {
			return <span className='modalTrigger modalTriggerText' style={{ textDecoration: 'underline' }}>
				{triggerLabel || __('Open', 'b-blocks')}
			</span>;
		}
		if (triggerType === 'icon') {
			return <span className='modalTrigger modalTriggerIcon'>
				<i className={iconClass || 'fa-solid fa-circle-info'} />
			</span>;
		}
		// button
		return <span className='modalTrigger modalTriggerButton'>
			{iconClass && <i className={iconClass} style={{ marginRight: 6 }} />}
			<span>{triggerLabel || __('Open', 'b-blocks')}</span>
		</span>;
	};

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()}>
			<style dangerouslySetInnerHTML={{ __html: css }} />

			{renderTrigger()}

			<div className='modalEditorPreviewWrapper'>
				<div className='modalEditorPreviewHeader'>
					<span className='modalEditorPreviewLabel'>{__('Modal content (editor preview)', 'b-blocks')}</span>
					<span style={{ fontSize: 11, color: '#888' }}>{__('Hidden until trigger is clicked on the frontend', 'b-blocks')}</span>
				</div>

				<div className='modalEditorPreviewBody modalDialog'>
					{showCloseButton && <span className='modalCloseHint' aria-hidden='true'>×</span>}
					{modalTitle && <h2 className='modalTitle'>{modalTitle}</h2>}
					<div className='modalContent'>
						<InnerBlocks template={TEMPLATE} templateLock={false} />
					</div>
				</div>
			</div>
		</div>
	</>;
};

export default Edit;

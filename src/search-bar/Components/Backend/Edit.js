import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const ALIGN_VALUES = ['left', 'center', 'right'];
const BTN_VALUES = ['text', 'icon', 'both'];

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		placeholder,
		buttonLabel,
		buttonStyle,
		alignment,
		width,
		fontSize,
		inputBgColor,
		inputTextColor,
		borderColor,
		borderWidth,
		borderRadius,
		buttonBgColor,
		buttonTextColor,
		buttonBorderRadius,
		inputPadding,
		dropdownBgColor,
		dropdownTextColor,
		dropdownHoverBgColor,
	} = attributes;

	const safeAlign = ALIGN_VALUES.includes(alignment) ? alignment : 'left';
	const safeBtn = BTN_VALUES.includes(buttonStyle) ? buttonStyle : 'text';
	const pad = inputPadding || {};

	const wrapperStyle = {
		'--bb-sb-width': width || '100%',
		'--bb-sb-font': fontSize || '16px',
		'--bb-sb-input-bg': inputBgColor || '#ffffff',
		'--bb-sb-input-text': inputTextColor || '#333333',
		'--bb-sb-border-color': borderColor || '#cccccc',
		'--bb-sb-border-width': `${borderWidth ?? 1}px`,
		'--bb-sb-radius': `${borderRadius ?? 4}px`,
		'--bb-sb-btn-bg': buttonBgColor || '#0073aa',
		'--bb-sb-btn-text': buttonTextColor || '#ffffff',
		'--bb-sb-btn-radius': `${buttonBorderRadius ?? 4}px`,
		'--bb-sb-pad-top': pad.top || '10px',
		'--bb-sb-pad-right': pad.right || '14px',
		'--bb-sb-pad-bottom': pad.bottom || '10px',
		'--bb-sb-pad-left': pad.left || '14px',
		'--bb-sb-dd-bg': dropdownBgColor || '#ffffff',
		'--bb-sb-dd-text': dropdownTextColor || '#333333',
		'--bb-sb-dd-hover': dropdownHoverBgColor || '#f0f0f0',
	};

	const blockProps = useBlockProps({
		className: `bb-search bb-search--btn-${safeBtn} bb-search--align-${safeAlign}`,
		style: wrapperStyle,
	});

	const showLabel = safeBtn === 'text' || safeBtn === 'both';
	const showIcon = safeBtn === 'icon' || safeBtn === 'both';
	const label = buttonLabel || __('Search', 'b-blocks');

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={safeAlign}
					onChange={(val) => setAttributes({ alignment: val || 'left' })}
				/>
			</BlockControls>

			<Settings attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps}>
				<div className='bb-search-form'>
					<div className='bb-search-field'>
						<input
							type='search'
							className='bb-search-input'
							placeholder={placeholder || __('Search…', 'b-blocks')}
							readOnly
							tabIndex={-1}
							aria-label={placeholder || __('Search', 'b-blocks')}
						/>
						<button
							type='button'
							className='bb-search-submit'
							tabIndex={-1}
							aria-label={!showLabel ? label : undefined}
						>
							{showIcon && (
								<i
									className='fa-solid fa-magnifying-glass bb-search-icon'
									aria-hidden='true'
								/>
							)}
							{showLabel && (
								<span className='bb-search-submit-label'>{label}</span>
							)}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Edit;

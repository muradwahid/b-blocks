import { useBlockProps } from '@wordpress/block-editor';
import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { WhatsAppIcon } from '../../utils/icon';
import { __ } from '@wordpress/i18n';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import { withSelect } from '@wordpress/data';

const Edit = props => {
	const { attributes, setAttributes, clientId, device } = props;

	const { phoneNumber, buttonText, showIcon, showStatusDot, tooltipText, buttonSize, hoverAnimation, fullWidth, iconPosition, shadow, pulseAnimation } = attributes;

	const sizeClasses = {
		small: 'bBlocks-whatsapp-block-btn--small',
		medium: 'bBlocks-whatsapp-block-btn--medium',
		large: 'bBlocks-whatsapp-block-btn--large',
	};

	const btnClassName = [
		'bBlocks-whatsapp-block-btn',
		sizeClasses[buttonSize] || sizeClasses.medium,
		fullWidth ? 'bBlocks-whatsapp-block-btn--full' : '',
		hoverAnimation ? 'bBlocks-whatsapp-block-btn--hover-anim' : '',
		shadow ? 'bBlocks-whatsapp-block-btn--shadow' : '',
		pulseAnimation ? 'bBlocks-whatsapp-block-btn--pulse' : '',
	]
		.filter(Boolean)
		.join(' ');

	const updateObj = updateAttributes(attributes, setAttributes);


	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} updateObj={updateObj} device={device} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />

			{!phoneNumber && (
				<p className="bBlocks-whatsapp-block-notice">
					{__(
						'Please enter a WhatsApp phone number in the block settings.',
						'bBlocks-whatsapp-block-whatsapp-chat'
					)}
				</p>
			)}
			<div className="bBlocks-whatsapp-block-wrapper">
				<button
					className={btnClassName}
					type="button"
					aria-label={buttonText}
				>
					{showIcon && iconPosition === 'left' && (
						<span className="bBlocks-whatsapp-block-btn__icon">
							<WhatsAppIcon />
						</span>
					)}
					<span className="bBlocks-whatsapp-block-btn__text">
						{buttonText}
					</span>
					{showIcon && iconPosition === 'right' && (
						<span className="bBlocks-whatsapp-block-btn__icon">
							<WhatsAppIcon />
						</span>
					)}
					{showStatusDot && (
						<span className="bBlocks-whatsapp-block-btn__status-dot" />
					)}
				</button>
				{tooltipText && (
					<span className="bBlocks-whatsapp-block-tooltip">
						{tooltipText}
					</span>
				)}
			</div>
		</div>
	</>
};


export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
}) (Edit);
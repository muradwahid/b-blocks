import { whatsappIcon } from '../../utils/icon';

const Frontend = ({ attributes }) => {
    const { phoneNumber, buttonText, prefillMessage, showIcon, showStatusDot, tooltipText, buttonSize,hoverAnimation, openInNewTab, fullWidth, iconPosition, shadow, pulseAnimation, } = attributes;


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


    let waUrl = 'https://wa.me/';
    if (phoneNumber) {
        waUrl += encodeURIComponent(phoneNumber);
    }
    if (prefillMessage) {
        waUrl += '?text=' + encodeURIComponent(prefillMessage);
    }

    return <div>
        <span className="bBlocks-whatsapp-block-wrapper">
            <a
                href={waUrl}
                className={btnClassName}
                target={openInNewTab ? '_blank' : undefined}
                rel={openInNewTab ? 'noopener noreferrer' : undefined}
                role="button"
                aria-label={buttonText}
                data-tooltip={tooltipText || undefined}
            >
                {showIcon && iconPosition === 'left' && whatsappIcon}
                <span className="bBlocks-whatsapp-block-btn__text">{buttonText}</span>
                {showIcon && iconPosition === 'right' && whatsappIcon}
                {showStatusDot && (
                    <span className="bBlocks-whatsapp-block-btn__status-dot" aria-hidden="true" />
                )}
            </a>
            {tooltipText && <span className="bBlocks-whatsapp-block-tooltip" aria-hidden="true">{tooltipText}</span>}
        </span>
    </div>
};

export default Frontend;
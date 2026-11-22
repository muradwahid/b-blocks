import { forwardRef, useEffect, useState } from 'react';

import { btnProps } from '../../utils/config';
import ButtonIcon from './ButtonIcon';
import Player from './Player';
import './Popup.scss';

const Button = ({ attributes, security = 'none', securityPass = true, setSecurityPass, isPremium, Popup, popupContent, isBackend = false, children, onClick = () => { } }, ref) => {
	const { actionType = 'link', iconPos = 'left' } = attributes;

	return <>
		<a ref={ref} {...btnProps(attributes, security, securityPass, isPremium, isBackend)} onClick={() => onClick(true)}>
			{'right' !== iconPos && <ButtonIcon attributes={attributes} />}

			{children}

			{'right' === iconPos && <ButtonIcon attributes={attributes} />}
		</a>

		{(isPremium && 'popup' === actionType && (securityPass && !isBackend)) && <RenderPopup attributes={attributes} Popup={Popup} popupContent={popupContent} securityPop={securityPass} setSecurityPass={setSecurityPass} btnRef={ref} />}
	</>
}
export default forwardRef(Button);

export const RenderPopup = ({ attributes, Popup, popupContent, securityPop, setSecurityPass }) => {
	const { actionType = 'link', popup = {} } = attributes;
	const { caption = '' } = popup;

	const [isPopupOpen, setIsPopupOpen] = useState(securityPop);
	// const isPopup = 'popup' === actionType;

	useEffect(() => {
		// if (isPopup && btnRef.current) {
		// 	btnRef.current.addEventListener('click', () => {
		// 		// setIsPopupOpen(true);
		// 	});
		// }
	}, [actionType]);

	return <Popup isOpen={isPopupOpen} onClose={() => {
		setIsPopupOpen(false)
		setSecurityPass(false);
	}} caption={caption}>
		<PopupChildren popup={popup} popupContent={popupContent} />
	</Popup>
}

const PopupChildren = ({ popup, popupContent }) => {
	const { type = 'image', content = '', caption = '' } = popup;

	if (!content) {
		return <p className='warning'>Sorry! No {'iframe' === type ? 'Iframe Source' : type} Found. Please Insert...</p>
	}

	switch (type) {
		case 'image':
			return <img className='image' src={content} alt={caption} />;
		case 'audio':
		case 'video':
			return <Player popup={popup} />;
		case 'content':
			return popupContent;
		case 'document':
			return <div className='document'>
				<iframe src={`//docs.google.com/viewer?embedded=true&url=${content}`} />
			</div>;
		case 'iframe':
			return <div className='iframe'>
				<iframe src={content} />
			</div>;
		default:
			return null;
	}
}
import { useEffect, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Modal } from '@wordpress/components';

import usePremiumInEditor from '../../../hooks/usePremiumInEditor';
import Button from '../Common/Button';
import Style from '../Common/Style';
import BackendContent from './BackendContent';
import Settings from './Settings/Settings';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { text, animationType, animationDuration, popup = {} } = attributes;

	const { isPremium } = usePremiumInEditor();

	const buttonEl = useRef(null);

	useEffect(() => {
		window['AOS']?.init();
	}, []);

	useEffect(() => {
		const btnClassList = buttonEl.current?.classList;

		btnClassList.remove('aos-init');
		btnClassList.remove('aos-animate');

		setTimeout(() => {
			btnClassList.add('aos-init');
			btnClassList.add('aos-animate');
		}, 500);
	}, [animationType, animationDuration]);

	const id = `${prefix}-${clientId}`;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} />

			<Button attributes={attributes} isPremium={isPremium} Popup={Popup} popupContent={<BackendContent popup={popup} setAttributes={setAttributes} />} ref={buttonEl} isBackend={true}>
				<RichText className='btnText' tagName='span' value={text} onChange={val => setAttributes({ text: val })} placeholder={__('Button Text', 'b-blocks')} inlineToolbar />
			</Button>
		</div>
	</>;
};
export default Edit;

const Popup = ({ isOpen, onClose, caption, children }) => {
	if (!isOpen) {
		return null;
	}

	const modalRef = useRef(null);

	useEffect(() => {
		const modalEl = modalRef.current;

		if (modalEl && isOpen) {
			const closeBtn = document.createElement('button');
			closeBtn.className = 'popupCloseBtn';
			closeBtn.innerHTML = `
				<svg xmlns='http://www.w3.org/2000/svg' fill='#fff' width='24px' height='24px' viewBox='0 0 32 32'>
					<path d='M17.769 16l9.016-9.016c0.226-0.226 0.366-0.539 0.366-0.884 0-0.691-0.56-1.251-1.251-1.251-0.346 0-0.658 0.14-0.885 0.367v0l-9.015 9.015-9.016-9.015c-0.226-0.226-0.539-0.366-0.884-0.366-0.69 0-1.25 0.56-1.25 1.25 0 0.345 0.14 0.658 0.366 0.884v0l9.015 9.016-9.015 9.015c-0.227 0.226-0.367 0.539-0.367 0.885 0 0.691 0.56 1.251 1.251 1.251 0.345 0 0.658-0.14 0.884-0.366v0l9.016-9.016 9.015 9.016c0.227 0.228 0.541 0.369 0.888 0.369 0.691 0 1.251-0.56 1.251-1.251 0-0.347-0.141-0.661-0.369-0.887l-0-0z' />
				</svg>
			`;

			closeBtn.addEventListener('click', () => onClose());

			modalEl.appendChild(closeBtn);
		}
	}, [modalRef.current, isOpen])

	return <Modal onRequestClose={() => onClose()} className='popupContent' overlayClassName='btnPopupWrap' shouldCloseOnClickOutside={true} isFullScreen={false} __experimentalHideHeader={true} ref={modalRef}>
		<div>
			{children}
		</div>

		{caption && <p className='popupCaption' dangerouslySetInnerHTML={{ __html: caption }} />}
	</Modal>;
};
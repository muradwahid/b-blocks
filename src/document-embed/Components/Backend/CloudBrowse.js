import { useEffect, useRef, useState } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { Button, Modal } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';

const serviceNames = {
	dropbox: __('Dropbox', 'b-blocks'),
	googleDrive: __('Google Drive', 'b-blocks'),
	box: __('Box', 'b-blocks')
};

const extensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'txt', 'csv', 'rtf'];

/**
 * "Browse Dropbox / Google Drive / Box" for the Document Embed source. Uses the public ids
 * saved in Settings → Integration (bBlocksGlobal.cloud). Without them, says where to connect.
 *
 * Dropbox and Google open popups, which browsers only allow straight from a click, so their
 * scripts load as soon as the button shows. Box's picker renders in a modal and loads on click;
 * Box sign-in goes through the site (a token kept for this user for about an hour).
 */
const CloudBrowse = ({ source, onPick, isPremium = false, setIsProModalOpen = () => { } }) => {
	const cloud = window.bBlocksGlobal?.cloud || {};
	const isConnected = { dropbox: !!cloud.dropbox, googleDrive: !!cloud.google, box: '1' === cloud.box }[source] || false;

	const [status, setStatus] = useState('');
	// A picked file replaces the source picker with the viewer, so sharing warnings go to the
	// editor's notices, where they stay until dismissed.
	const { createWarningNotice, removeNotice } = useDispatch('core/notices');
	const setWarning = (message) => message ? createWarningNotice(message, { id: 'b-blocks-document-embed-cloud', isDismissible: true }) : removeNotice('b-blocks-document-embed-cloud');
	const [isBoxOpen, setIsBoxOpen] = useState(false);
	const [box, setBox] = useState({});
	const googleToken = useRef('');
	const tokenClient = useRef(null);
	// Set when this picker opened the Box sign-in popup.
	const awaitingBox = useRef(false);

	// Adds a script or stylesheet to this page once.
	const load = (id, tag, props) => new Promise((resolve, reject) => {
		const existing = document.getElementById(id);
		if (existing) {
			existing.dataset.loaded ? resolve() : existing.addEventListener('load', resolve);
			return;
		}
		// `dataset` is read-only on an element: data attributes are set one by one.
		const { dataset = {}, ...rest } = props;
		const node = Object.assign(document.createElement(tag), { id, ...rest });
		Object.entries(dataset).forEach(([key, value]) => node.setAttribute(`data-${key}`, value));
		node.addEventListener('load', () => {
			node.dataset.loaded = '1';
			resolve();
		});
		node.addEventListener('error', () => {
			node.remove();
			reject();
		});
		document.head.appendChild(node);
	});

	const failed = () => setStatus(sprintf(
		// translators: %s: Dropbox, Google Drive or Box.
		__('The %s picker could not load. Check your connection and the settings in Settings → Integration.', 'b-blocks'), serviceNames[source]
	));

	useEffect(() => {
		setStatus('');
		// A Box answer for a source the editor has since left is dropped.
		let live = true;

		if (!isConnected || !isPremium) {
			return undefined;
		}

		if ('dropbox' === source) {
			load('dropboxjs', 'script', { src: 'https://www.dropbox.com/static/api/2/dropins.js', dataset: { 'app-key': cloud.dropbox } }).catch(failed);
		}

		if ('googleDrive' === source) {
			Promise.all([
				load('b-blocks-gapi', 'script', { src: 'https://apis.google.com/js/api.js' }).then(() => new Promise((resolve) => window.gapi.load('picker', resolve))),
				load('b-blocks-gsi', 'script', { src: 'https://accounts.google.com/gsi/client' })
			]).then(() => {
				tokenClient.current = window.google.accounts.oauth2.initTokenClient({
					client_id: cloud.google.clientId,
					// Access to the files picked here only.
					scope: 'https://www.googleapis.com/auth/drive.file',
					callback: () => { },
					error_callback: (error) => 'popup_closed' !== error?.type && setStatus(error?.message || __('Google sign-in failed.', 'b-blocks'))
				});
			}).catch(failed);
		}

		// Box: the token lasts about an hour. Asked again every 10 minutes while the picker shows, so a click on
		// Browse after a long edit opens the picker with a live token (or the sign-in popup, straight from the click).
		let refresh = null;
		if ('box' === source) {
			const fetchToken = () => {
				const body = new FormData();
				body.append('action', 'bb_de_box_token');
				body.append('nonce', cloud.nonce);
				fetch(cloud.ajaxUrl, { method: 'POST', body, credentials: 'same-origin' }).then((res) => res.json()).then((res) => {
					if (live) {
						res.success ? setBox(res.data) : setStatus(res.data?.message || '');
					}
				}).catch(() => live && failed());
			};
			fetchToken();
			refresh = setInterval(fetchToken, 600000);
		}

		return () => {
			live = false;
			clearInterval(refresh);
		};
	}, [source, isConnected, isPremium]);

	// Box sign-in finishes in a popup, which tells this page.
	useEffect(() => {
		const onMessage = (event) => {
			// Every picker on the screen hears the popup: only the one that opened it answers.
			if (event.origin !== window.location.origin || !String(event.data?.type).startsWith('bb-box-') || !awaitingBox.current) {
				return;
			}
			awaitingBox.current = false;
			if ('bb-box-error' === event.data.type) {
				setStatus(event.data.message || __('Box sign-in failed.', 'b-blocks'));
				return;
			}
			const body = new FormData();
			body.append('action', 'bb_de_box_token');
			body.append('nonce', cloud.nonce);
			fetch(cloud.ajaxUrl, { method: 'POST', body, credentials: 'same-origin' }).then((res) => res.json()).then((res) => {
				if (res.success && res.data.token) {
					setBox(res.data);
					setIsBoxOpen(true);
				}
			}).catch(failed);
		};
		window.addEventListener('message', onMessage);

		return () => window.removeEventListener('message', onMessage);
	}, []);

	// Box: show the picker in the modal once its container exists.
	useEffect(() => {
		if (!isBoxOpen || !box.token) {
			return;
		}

		const base = 'https://cdn01.boxcdn.net/platform/elements/26.3.0/en-US/';
		Promise.all([load('b-blocks-box-css', 'link', { rel: 'stylesheet', href: `${base}picker.css` }), load('b-blocks-box-js', 'script', { src: `${base}picker.js` })]).then(() => {
			const Picker = window.Box?.ContentPicker || window.Box?.FilePicker;
			const picker = new Picker();
			picker.addListener('choose', (items) => {
				const item = items?.[0] || {};
				const link = item.shared_link?.url || '';
				const access = item.shared_link?.effective_access || item.shared_link?.access || '';
				setIsBoxOpen(false);

				if ('' === link) {
					setWarning(__('This Box file has no shared link. Open the picker again and set its sharing to "People with the link", or share it in Box first.', 'b-blocks'));
					return;
				}
				onPick({ url: link, name: item.name || '', mime: '', source: 'box' });
				if ('open' !== access) setWarning(__('This Box link is not open to everyone, so visitors may be asked to sign in to Box. Set its sharing to "People with the link".', 'b-blocks'));
			});
			picker.addListener('cancel', () => setIsBoxOpen(false));
			picker.show('0', box.token, { container: '#b-blocks-document-embed-box-picker', maxSelectable: 1, type: 'file', canUpload: false, canCreateNewFolder: false, extensions, chooseButtonLabel: __('Embed', 'b-blocks') });
		}).catch(() => {
			setIsBoxOpen(false);
			failed();
		});
	}, [isBoxOpen, box.token]);

	const browse = () => {
		if (!isPremium) {
			setIsProModalOpen(true);
			return;
		}
		setStatus('');
		setWarning('');

		if ('dropbox' === source) {
			if (!window.Dropbox?.isBrowserSupported?.()) {
				failed();
				return;
			}
			window.Dropbox.choose({
				linkType: 'preview',
				multiselect: false,
				extensions: extensions.map((ext) => `.${ext}`),
				success: (files) => {
					onPick({ url: files[0].link, name: files[0].name, mime: '', source: 'dropbox' });
					setWarning(__('Dropbox shares the file through a link. If your team settings limit links, visitors may not see it.', 'b-blocks'));
				},
				cancel: () => { }
			});
		}

		if ('googleDrive' === source) {
			if (!tokenClient.current) {
				failed();
				return;
			}
			tokenClient.current.callback = (response) => {
				if (response.error) {
					setStatus(response.error_description || response.error);
					return;
				}
				googleToken.current = response.access_token;

				const { picker } = window.google;
				new picker.PickerBuilder()
					.addView(new picker.DocsView(picker.ViewId.DOCS).setIncludeFolders(true))
					.setOAuthToken(googleToken.current)
					.setDeveloperKey(cloud.google.apiKey)
					.setAppId(cloud.google.appId)
					.setOrigin(window.location.origin)
					.setCallback((data) => {
						if (data.action !== picker.Action.PICKED) {
							return;
						}
						const doc = data[picker.Response.DOCUMENTS][0];
						const id = doc[picker.Document.ID];

						// The view link, and whether "Anyone with the link" can open it.
						fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?fields=name,mimeType,webViewLink,permissions(type,role)&supportsAllDrives=true`, { headers: { Authorization: `Bearer ${googleToken.current}` } })
							.then((res) => res.json())
							.catch(() => ({}))
							.then((meta) => {
								onPick({ url: meta.webViewLink || doc[picker.Document.URL], name: meta.name || doc[picker.Document.NAME] || '', mime: meta.mimeType || doc[picker.Document.MIME_TYPE] || '', source: 'googleDrive' });

								const isPublic = meta.permissions?.some((permission) => 'anyone' === permission.type);
								setWarning(false === isPublic || undefined === meta.permissions ?
									__('Visitors can only see this file if it is shared as "Anyone with the link" in Google Drive.', 'b-blocks') : '');
							});
					})
					.build()
					.setVisible(true);
			};
			tokenClient.current.requestAccessToken({ prompt: googleToken.current ? '' : 'consent' });
		}

		if ('box' === source) {
			if (box.token) {
				setIsBoxOpen(true);
			} else if (box.authUrl) {
				// Opened straight from the click so the popup is allowed; it reports back by message.
				awaitingBox.current = true;
				window.open(box.authUrl, 'bBlocksBoxAuth', 'width=600,height=720');
			} else {
				failed();
			}
		}
	};

	if (!isConnected) {
		return <p className='b-blocks-document-embed-cloud-note'>
			{sprintf(
				// translators: %s: Dropbox, Google Drive or Box.
				__('Connect %s in Settings → Integration to browse your files.', 'b-blocks'), serviceNames[source]
			)}
			{cloud.integrationUrl && <> <a href={cloud.integrationUrl} target='_blank' rel='noreferrer'>{__('Open Integration settings', 'b-blocks')}</a></>}
		</p>;
	}

	return <div className='b-blocks-document-embed-cloud'>
		<Button variant='secondary' onClick={browse}>
			{sprintf(
				// translators: %s: Dropbox, Google Drive or Box.
				__('Browse %s', 'b-blocks'), serviceNames[source]
			)}
			{!isPremium && <span className='labelPro'>{__('Pro', 'b-blocks')}</span>}
		</Button>

		{'' !== status && <p className='b-blocks-document-embed-warning' role='alert'>{status}</p>}

		{isBoxOpen && <Modal title={__('Choose a file from Box', 'b-blocks')} onRequestClose={() => setIsBoxOpen(false)} size='large'>
			<div id='b-blocks-document-embed-box-picker' style={{ height: 560 }} />
		</Modal>}
	</div>;
};
export default CloudBrowse;

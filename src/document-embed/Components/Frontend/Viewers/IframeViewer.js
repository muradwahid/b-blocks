import { useEffect, useRef, useState } from 'react';

/**
 * Google Docs Viewer, Office Online, Google Drive and Box.
 *
 * Google's viewer sometimes answers with the file itself instead of the viewer page (when it can't
 * fetch the document, e.g. on a local site), which inside a plain iframe starts a download on every
 * render. A sandbox without `allow-downloads` blocks that and keeps everything the viewer needs. A
 * blocked download never fires onLoad, so after 10 s onError lets the parent fall back.
 */
const IframeViewer = ({ src, title = '', onLoad = () => { }, onError, children }) => {
	const loadedRef = useRef(false);
	const onErrorRef = useRef(onError);
	onErrorRef.current = onError;

	// A URL typed in the editor changes on every keystroke: load the viewer once it settles.
	const [frameSrc, setFrameSrc] = useState(src);

	useEffect(() => {
		const timer = setTimeout(() => setFrameSrc(src), 500);

		return () => clearTimeout(timer);
	}, [src]);

	const isGview = frameSrc.includes('docs.google.com/gview');

	useEffect(() => {
		loadedRef.current = false;

		if (!isGview) {
			return undefined;
		}

		const timer = setTimeout(() => !loadedRef.current && onErrorRef.current?.(), 10000);

		return () => clearTimeout(timer);
	}, [frameSrc]);

	return <div className='b-blocks-document-embed-frame'>
		<iframe
			src={frameSrc}
			title={title}
			onLoad={() => {
				loadedRef.current = true;
				onLoad();
			}}
			sandbox={isGview ? 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms' : undefined}
			allowFullScreen
		/>

		{children}
	</div>;
};
export default IframeViewer;

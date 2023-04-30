import { useEffect } from 'react';

import Settings from './Settings';

const Edit = props => {
	const { className, attributes, setAttributes, clientId } = props;
	const { qrAlign, url, dimension, color, bgColor } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${dimension}x${dimension}&color=${color.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}&ecc=L&qzone=1&data=${url || 'http://bplugins.com'}`;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div className={className} id={`bBlocksQRCode-${clientId}`}>
			<style dangerouslySetInnerHTML={{
				__html: `
				#bBlocksQRCode-${clientId} .bBlocksQRCode{
					text-align: ${qrAlign};
				}
			`}} />

			<div className='bBlocksQRCode'>
				<img src={qrUrl} alt={url} />
			</div>
		</div>
	</>;
};
export default Edit;
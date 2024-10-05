import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { qrAlign, url, dimension, color, bgColor } = attributes;

	const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${dimension}x${dimension}&color=${color.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}&ecc=L&qzone=1&data=${url || 'http://bplugins.com'}`;

	const id = `${prefix}-${clientId}`;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()} id={id}>
			<style dangerouslySetInnerHTML={{
				__html: `
				#${id} .${prefix}{
					text-align: ${qrAlign};
				}
			`}} />

			<div className={prefix}>
				<img src={qrUrl} alt={url} />
			</div>
		</div>
	</>;
};
export default Edit;
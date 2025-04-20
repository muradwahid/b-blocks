import { useEffect } from 'react';
import { useBlockProps } from '@wordpress/block-editor';
const $ = jQuery;

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { textillateConfig } from '../../utils/config';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { loop, animateIn, inEffect, inSequence, outEffect, outSequence, content } = attributes;

	const id = `block-${clientId}`;

	useEffect(() => {
		$(`#${id} .content`).textillate(textillateConfig(attributes));
	}, [loop, animateIn, inEffect, inSequence, outEffect, outSequence, content]);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={id} />

			<div className={prefix}>
				<p className='content'>{content}</p>
			</div>
		</div>
	</>;
};
export default Edit;
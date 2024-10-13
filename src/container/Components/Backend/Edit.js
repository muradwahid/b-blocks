import { useBlockProps } from '@wordpress/block-editor';

import Container from './Container';
import Style from '../Common/Style';

import Settings from './Settings/Settings';
import { prefix } from '../../utils/data';

export default function Edit(props) {
	const { setAttributes, attributes, clientId, } = props;

	const isPremium = false;
	const id = `${prefix}-${clientId}`;

	return <div {...useBlockProps()} id={id}>
		<Settings attributes={attributes} setAttributes={setAttributes} isPremium={isPremium} />

		<Style attributes={attributes} id={id} />

		<Container attributes={attributes} />
	</div>
}

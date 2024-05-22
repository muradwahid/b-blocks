import { registerBlockType, createBlock } from '@wordpress/blocks';

import metadata from '../../../inc/alert/block.json';
import Edit from './Components/Backend/Edit';
import './editor.scss';
import { alertIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: alertIcon,

	transforms: {
		from: [
			{ type: 'block', blocks: ['abb/alert-box'], transform: attributes => createBlock('b-blocks/alert', attributes) },
			{
				type: 'block', blocks: ['core/paragraph'], transform: ({ content, align }) => {
					return createBlock('b-blocks/alert', { message: content, textAlign: align });
				}
			},
			{
				type: 'block', blocks: ['core/heading'], transform: ({ content, textAlign }) => {
					return createBlock('b-blocks/alert', { message: content, textAlign });
				}
			},
			{ type: 'prefix', prefix: 'alert', transform: () => createBlock('b-blocks/alert') }
		],

		to: [
			{
				type: 'block', blocks: ['abb/alert-box'], isMatch: attributes => {
					if (attributes) return true;
					return false;
				},
				transform: attributes => createBlock('abb/alert-box', attributes)
			},
			{
				type: 'block', blocks: ['core/paragraph'], isMatch: ({ message }) => {
					if (message) return true;
					return false;
				}, transform: ({ message, textAlign }) => {
					return createBlock('core/paragraph', { content: message, align: textAlign });
				}
			},
			{
				type: 'block', blocks: ['core/heading'], isMatch: ({ message }) => {
					if (message) return true;
					return false;
				}, transform: ({ message, textAlign }) => {
					return createBlock('core/heading', { content: message, textAlign });
				}
			}
		]
	},

	// Build In Functions
	edit: Edit,

	save: () => null
});
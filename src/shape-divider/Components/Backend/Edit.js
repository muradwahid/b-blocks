import { useBlockProps, InnerBlocks, Inserter } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import Shape from '../Common/Shape';
import { prefix } from '../../utils/data';

const innerBlocksTemplate = [
	['core/heading', { content: 'Creative Shape Divider', textAlign: "center", style: { typography: { fontSize: "52px" } }, textColor: 'white' }],
	[
		'core/paragraph', {
			content: 'The Gutenberg Shape Divider plugin is an innovative tool designed to enhance the visual appeal and creativity of websites built using the WordPress Gutenberg editor. With its intuitive interface and powerful features, this plugin empowers users to create unique and captivating designs by adding customizable shape dividers to their web pages.',
			align: 'center',
			style: { typography: { fontSize: '18px' } },
			textColor: 'white'
		}
	],
	// [
	// 	'core/buttons',
	// 	{
	// 		layout: {
	// 			type: 'flex',
	// 			justifyContent: 'center'
	// 		}
	// 	},
	// 	[[
	// 		'core/button', {
	// 			text: 'View Demo',
	// 			textColor: 'wp-block-button__link has-ast-global-color-5-color has-text-color wp-element-button',
	// 			style: {
	// 				spacing: {
	// 					padding: {
	// 						top: 'var(preset | spacing | 40)',
	// 						right: 'var(preset | spacing | 40)',
	// 						bottom: 'var(preset | spacing | 40)',
	// 						left: 'var(preset | spacing | 40)'
	// 					}
	// 				}
	// 			},
	// 			// className: 'is-style-outline'
	// 			className: 'wp-block-button is-style-outline'
	// 		}
	// 	]]
	// ]
];

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;

	const id = `${prefix}-${clientId}`

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} />

			<Shape attributes={attributes} />

			<div className='shapeContent'>
				<InnerBlocks
					template={innerBlocksTemplate}
					renderAppender={() => <Inserter
						rootClientId={clientId}
						isAppender
						renderToggle={({ onToggle, disabled }) => <Button
							onClick={onToggle}
							disabled={disabled}
							icon='plus-alt'>
						</Button>}
					/>}
				/>
			</div>
		</div>
	</>;
};
export default Edit;
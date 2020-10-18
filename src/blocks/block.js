const { registerBlockType } = wp.blocks;

registerBlockType('b-blocks/block', {
	// Build In attributes
	title: 'B Block',
	description: 'Simple B Block',
	icon: 'shield',
	category: 'bBlocks',

	// Custom Attributes
	attributes: {

	},

	// Build In Functions
	edit: props => {
		return (
			<div>
				<h2>My Demo Gutenberg Block</h2>
			</div>
		);
	},

	save: props => {
		return (
			<div>
				<h2>My Demo Gutenberg Block</h2>
			</div>
		);
	},
});

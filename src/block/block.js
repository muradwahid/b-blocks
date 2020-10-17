const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

registerBlockType('wasek/b-blocks', {
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
				<h2 className="demoHeading">My Demo Gutenberg Block</h2>
			</div>
		);
	},

	save: props => {
		return (
			<div>
				<h2 className="demoHeading">My Demo Gutenberg Block</h2>
			</div>
		);
	},
});

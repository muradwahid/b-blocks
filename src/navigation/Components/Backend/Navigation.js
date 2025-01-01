import { useRef, useEffect } from 'react';
import { InnerBlocks } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { dispatch, select } from '@wordpress/data';

const withInspectorControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name, clientId, isSelected } = props;

		if (name && name != 'core/navigation') {
			return <BlockEdit {...props} />;
		}

		const parentBlock = select('core/block-editor').getBlockParents(clientId);
		let isParentBlockNavigation = false;

		let parentAttributes = {};

		parentBlock.map((block) => {
			const thisProps = select('core/block-editor').getBlock(block);
			if (thisProps && thisProps.name == 'b-blocks/navigation') {
				isParentBlockNavigation = true;
				parentAttributes = { ...thisProps.attributes };
			}
		});

		let inspector;
		if (isParentBlockNavigation && isSelected) {
			setTimeout(() => {
				inspector = document.querySelector('.block-editor-block-inspector');

				if (inspector) {
					let buttonSelector = inspector.querySelector('.block-editor-block-inspector__tabs');
					if (buttonSelector) {
						let tabButtons = buttonSelector.querySelectorAll(`[aria-label='Settings'], [aria-label='Styles']`);
						tabButtons &&
							tabButtons.forEach((element) => {
								element.style.display = 'none';
							});
					}
				}
			}, 200);

			if (inspector) {
				setTimeout(() => {
					// inspector.querySelector(
					//	'.block-editor-block-card'
					// ).style.display = 'none';

					let nodes = inspector.children;

					let tabButtons = inspector
						.querySelector('.block-editor-block-inspector__tabs')
						.querySelectorAll(`[aria-label='Settings'], [aria-label='Styles']`);

					tabButtons.forEach((element) => {
						element.style.display = 'none';
					});

					for (let i = 0; i <= nodes.length - 1; i++) {
						let card = nodes[i].classList.contains('block-editor-block-card');
						let tab = nodes[i].classList.contains('block-editor-block-inspector__tabs');

						let child = nodes[i].children;

						if (!card && !tab) {
							for (let x = 0; x <= child.length - 1; x++) {
								const hasNavigation = child[x].querySelector('.wp-block-navigation__navigation-selector');

								if (!hasNavigation) {
									child[x].style.display = 'none';
								}
							}
						}
					}
				}, 200);

				return <BlockEdit {...props} />;
			} else {
				return <BlockEdit {...props} />;
			}
		} else {
			inspector = document.querySelector('.block-editor-block-inspector');

			if (inspector) {
				setTimeout(() => {
					inspector.querySelector('.block-editor-block-card').style.display = 'block';

					let nodes = inspector.children;
					for (let i = 0; i <= nodes.length - 1; i++) {
						let child = nodes[i].children;

						for (let x = 0; x <= child.length - 1; x++) {
							child[x].style.display = 'block';
						}
					}
				}, 200);
			}
			return <BlockEdit {...props} />;
		}
	};
}, 'withInspectorControl');

wp.hooks.addFilter('editor.BlockEdit', 'b-blocks/navigation', withInspectorControls);

const Navigation = ({ attributes, clientId }) => {
	const { layout, hamburger } = attributes;
	const { orientation, wrapMultipleLine } = layout;
	const { displayMenu } = hamburger;

	const navRef = useRef();

	const parentBlocks = select('core/block-editor').getBlocksByClientId(clientId)[0];
	const { replaceInnerBlocks, updateBlockAttributes } = dispatch('core/block-editor');

	useEffect(() => {
		if (parentBlocks?.innerBlocks) {
			parentBlocks?.innerBlocks.forEach((block) => {
				updateBlockAttributes(block.clientId, {
					openSubmenusOnClick: layout.isOpenOnClick,
					showSubmenuIcon: layout.isMenuIcon,
					overlayMenu: hamburger.displayMenu,
					hasIcon: hamburger.buttonType === 'icon' ? true : false,
					icon: hamburger.buttonType === 'icon' ? 'handle' : 'text',
				});
			});
		}
	}, [layout.isOpenOnClick, layout.isMenuIcon, hamburger.displayMenu, hamburger.buttonType, parentBlocks]);
	const align = layout.orientation === 'is-vertical' ? 'vertical-align-' + layout.verticalAlignment : 'horizontal-align-' + layout.alignment;

	const className = `${orientation} ${displayMenu} ${wrapMultipleLine ? '' : 'no-wrap'} ${align}`;

	return <div className={`bBlocksNavigation ${className}`}>
		<InnerBlocks
			templateLock={false}
			ref={navRef}
			template={[['core/navigation', { className: 'bPl-navigation' }]]}
			allowedBlocks={['core/navigation']}
			renderAppender={select('core/block-editor').getBlock(clientId)?.innerBlocks.length < 1 ? InnerBlocks.ButtonBlockAppender : false}
		/>
	</div>
};

export default Navigation;
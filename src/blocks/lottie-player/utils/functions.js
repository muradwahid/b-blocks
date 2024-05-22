export const toggleAttr = (selector, condition, attribute, value) => {
	condition && selector?.setAttribute(attribute, value);
	!condition && selector?.removeAttribute(attribute, value);
}

export const actionsOnInteractivityChange = (val, fileFrameSize) => {
	const actions = {
		noInteractivity: [],
		syncWithScroll: [{
			visibility: [0, 1],
			type: 'seek',
			frames: [0, fileFrameSize]
		}],
		scrollRelativeToContainer: [{
			visibility: [0, 1],
			type: 'seek',
			frames: [0, fileFrameSize]
		}],
		scrollWithOffset: [
			{
				visibility: [0, 0.3],
				type: 'stop',
				frames: [0]
			},
			{
				visibility: [0.3, 1.0],
				type: 'seek',
				frames: [0, fileFrameSize]
			}
		],
		syncAnimationWithCursorPosition: [{
			position: { x: [0, 1], y: [0, 1] },
			type: 'seek',
			frames: [0, fileFrameSize]
		}],
		syncAnimationWithCursorHorizontalMovement: [{
			position: { x: [0, 1], y: [-1, 2] },
			type: 'seek',
			frames: [0, fileFrameSize]
		}],
		playAnimationOnClick: [{
			type: 'click',
			forceFlag: false
		}],
		toggleAnimation: [{
			type: 'toggle'
		}],
		playAnimationWhenVisible: [{
			visibility: [0.50, 1.0],
			type: 'play'
		}]
	};

	return actions[val];
}
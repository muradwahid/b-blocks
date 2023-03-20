const $ = jQuery;

export const drags = (dragElement, resizeElement, container) => {
	// This creates a variable that detects if the user is using touch input instead of the mouse.
	let touched = false;
	window.addEventListener('touchstart', function () {
		touched = true;
	});
	window.addEventListener('touchend', function () {
		touched = false;
	});

	// click the image and move the slider on interaction with the mouse or the touch input
	dragElement.on('mousedown touchstart', function (e) {
		//add classes to the elements - good for css animations if you need it to
		dragElement.addClass('icDraggable');
		resizeElement.addClass('icResizable');
		//create vars
		let startX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
		let dragWidth = dragElement.outerWidth();
		let posX = dragElement.offset().left + dragWidth - startX;
		let containerOffset = container.offset().left;
		let containerWidth = container.outerWidth();
		let minLeft = containerOffset + 10;
		let maxLeft = containerOffset + containerWidth - dragWidth - 10;

		//add event listener on the divider element
		dragElement.parents().on('mousemove touchmove', function (e) {
			// if the user is not using touch input let do preventDefault to prevent the user from selecting the images as he moves the slider around.
			if (touched === false) {
				e.preventDefault();
			}

			let moveX = e.pageX ? e.pageX : e.originalEvent?.touches[0].pageX;
			let leftValue = moveX + posX - dragWidth;

			// stop the divider from going over the limits of the container
			if (leftValue < minLeft) {
				leftValue = minLeft;
			} else if (leftValue > maxLeft) {
				leftValue = maxLeft;
			}

			let widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + '%';

			$('.icDraggable').css('left', widthValue).on('mouseup touchend touchcancel', function () {
				$(this).removeClass('icDraggable');
				resizeElement.removeClass('icResizable');
			});

			$('.icResizable').css('width', widthValue);

		}).on('mouseup touchend touchcancel', function () {
			dragElement.removeClass('icDraggable');
			resizeElement.removeClass('icResizable');
		});
	}).on('mouseup touchend touchcancel', function () {
		// stop clicking the image and move the slider
		dragElement.removeClass('icDraggable');
		resizeElement.removeClass('icResizable');
	});
}
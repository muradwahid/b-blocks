import './style.scss'
document.addEventListener('DOMContentLoaded', function () {
	const skillBlocks = document.querySelectorAll('.wp-block-b-blocks-skill-bar');

	if (!skillBlocks.length) {
		return;
	}

	// Intersection Observer for animation on scroll
	const observerOptions = {
		threshold: 0.2,
		rootMargin: '0px 0px -50px 0px'
	};

	const observer = new IntersectionObserver(function(entries) {
		entries.forEach(function(entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				animateSkills(entry.target);
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	skillBlocks.forEach(function(block) {
		observer.observe(block);
	});

	function animateSkills(block) {
		const skillItems = block.querySelectorAll('.b-blocks-skill-bar-skill-item');
		
		skillItems.forEach(function(item) {
			const percentage = parseInt(item.dataset.percentage, 10);
			const fillBar = item.querySelector('.b-blocks-skill-bar-skill-bar-fill');
			const circularProgress = item.querySelector('.b-blocks-skill-bar-skill-circular-progress');

			if (fillBar) {
				// Set CSS variable for animation
				item.style.setProperty('--b-blocks-skill-bar-skill-percentage', percentage + '%');
				
				// Get the color from data attribute
				const fillColor = fillBar.dataset.color;
				
				// Animate width
				setTimeout(function() {
					fillBar.style.width = percentage + '%';
					if (fillColor) {
						fillBar.style.backgroundColor = fillColor;
					}
				}, 100);
			}

			if (circularProgress) {
				// Set CSS variable for animation
				item.style.setProperty('--b-blocks-skill-bar-skill-percentage', percentage);
				
				// Get the color from data attribute
				const strokeColor = circularProgress.dataset.color;
				
				// Calculate stroke-dashoffset for circular progress
				const circumference = 2 * Math.PI * 45;
				const offset = circumference * (1 - percentage / 100);
				
				setTimeout(function() {
					circularProgress.style.strokeDashoffset = offset;
					if (strokeColor) {
						circularProgress.style.stroke = strokeColor;
					}
				}, 100);
			}
		});
	}
});
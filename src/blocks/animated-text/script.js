const $ = jQuery;

import './style.scss';

// All Block Directory
const allAnimatedText = document.querySelectorAll('.wp-block-b-blocks-animated-text');

Object.values(allAnimatedText).map(animatedText => {
	const animatedTextEl = document.getElementById(animatedText.id);

	const { loop, animateIn, inEffect, inSequence, outEffect, outSequence } = JSON.parse(animatedTextEl.dataset.animate);

	$(`#${animatedText.id} .content`).textillate({
		loop,
		minDisplayTime: 2000, // each text before it is replaced
		initialDelay: 0,
		autoStart: true,
		inEffects: [], // Custom set of 'in' effects
		outEffects: ['hinge'], // Custom set of 'out' effects

		in: {
			effect: inEffect,
			delayScale: 1.5,
			delay: 50,
			sync: 'sync' === inSequence, // sequence of char/word
			shuffle: 'shuffle' === inSequence, // (doesn't make sense with sync = true)
			reverse: 'reverse' === inSequence // (doesn't make sense with sync = true)
		},

		out: {
			effect: outEffect,
			delayScale: 1.5,
			delay: 50,
			sync: 'sync' === outSequence,
			shuffle: 'shuffle' === outSequence,
			reverse: 'reverse' === outSequence
		},

		type: animateIn // Animate in type (available types: 'char' and 'word')
	});
});
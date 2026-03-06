import { useLayoutEffect, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const StackedCards = ({ attributes, slidesHost }) => {
	const { styles } = attributes;
	const { stickyTop, cardGaps } = styles;

	const rootRef = useRef(null);
	const wrapperRef = useRef(null);
	const [ready, setReady] = useState(false);

	// const setActiveNav = useCallback((index) => { }, []);

	// Move slides into wrapper once
	useEffect(() => {
		if (!wrapperRef.current || !slidesHost) return;

		if (slidesHost.dataset.moved === "1") {
			setReady(true);
			return;
		}

		const slideNodes = Array.from(slidesHost.children);
		wrapperRef.current.append(...slideNodes);
		slidesHost.dataset.moved = "1";

		setReady(true);
	}, [slidesHost]);

	// useLayoutEffect(() => {
	//   if (!ready) return;

	//   const ctx = gsap.context(() => {
	//     const wrapper = wrapperRef.current;
	//     if (!wrapper) return;

	//     const cards = Array.from(wrapper.querySelectorAll(".bBlocksStackedSingleCard"));
	//     if (!cards.length) return;

	//     const topOffset = Number(stickyTop ?? 0);
	//     const gap = Number(cardGaps ?? 16);

	//     // IMPORTANT: wrapper/parents must not clip sticky
	//     gsap.set(wrapper, { overflow: "visible" });

	//     // Measure heights AFTER DOM is in place
	//     const totalCardsHeight = cards.reduce((sum, el) => sum + el.offsetHeight, 0);
	//     const stackOffset = gap * (cards.length - 1);

	//     // 🔥 KEY FIX:
	//     // Add enough "tail" space so earlier sticky cards don't unstick (break)
	//     const extraScrollRoom = window.innerHeight + stackOffset + topOffset;

	//     gsap.set(wrapper, {
	//       position: "relative",
	//       minHeight: totalCardsHeight + extraScrollRoom,
	//       paddingBottom: extraScrollRoom, // this is usually what stops the breaking
	// 		});


	//     // Sticky stack setup
	//     cards.forEach((card, i) => {
	//       gsap.set(card, {
	//         position: "sticky",
	//         top: topOffset + i * gap,
	//         width: "100%",
	//         zIndex: 1000 + i,
	//         transformOrigin: "50% 0%",
	//         willChange: "transform",
	//       });
	//     });

	//     // Scale effect while stacking
	//     const total = cards.length;

	//     cards.forEach((card, i) => {
	//       const stickLine = topOffset + i * gap;

	//       const tween = gsap.to(card, {
	//         scale: 1 - (total - 1 - i) * 0.02, // tweak to taste
	//         ease: "none",
	//         paused: true,
	//       });

	//       ScrollTrigger.create({
	//         trigger: wrapper,            // ✅ more stable than trigger: card
	//         start: () => `top+=${stickLine} top`,
	//         end: () => `top+=${stickLine + 250} top`,
	//         scrub: true,
	//         animation: tween,
	//         invalidateOnRefresh: true,
	//         onUpdate: (self) => {
	//           // optional active index
	//           // setActiveNav(Math.round(self.progress * (total - 1)));
	//         },
	//       });
	//     });

	//     ScrollTrigger.refresh();
	//   }, rootRef);

	//   return () => ctx.revert();
	// }, [ready, stickyTop, cardGaps, setActiveNav]);

	// const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

	useLayoutEffect(() => {
		if (!ready) return;

		const ctx = gsap.context(() => {
			const wrapper = wrapperRef.current;
			const cards = Array.from(wrapper.querySelectorAll(".bBlocksStackedSingleCard"));
			if (!cards.length) return;

			const topOffset = Number(stickyTop ?? 0);
			// const gap = Number(cardGaps ?? 30);
			const gap = 30;

			gsap.set(wrapper, { overflow: "visible", paddingBottom: (cards.length - 1) * gap });

			// ✅ All cards stick to SAME top, spacing via y
			cards.forEach((card, i) => {
				gsap.set(card, {
					// position: "sticky",
					// top: topOffset+i,
					y: i * gap,
					zIndex: 1000 + i,
					transformOrigin: "50% 0%",
					willChange: "transform",
					transform: `translateY(${cards.length - 1 === i ? (30 * i) - 30 : 30 * i}px)`,
					scale: 1,
				});
			});

			const minScale = 0.72;
			const range = 500;

			// dynamic scaling (no fixed step/power)
			const scaleFor = (i, activeFloat, total) => {
				const dist = activeFloat - i; // previous cards => dist>0
				if (dist <= 0) return 1;

				const p = dist / total;            // 0..1
				const s = 1 - p * (1 - minScale);  // 1..minScale

				return i === total - 1 ? 1 : gsap.utils.clamp(minScale, 1, s);
			};

			// ✅ Incoming card i triggers scaling of all previous cards
			cards.forEach((incoming, incomingIndex) => {
				// if (incomingIndex === 0) return; // 1st has no previous
				ScrollTrigger.create({
					trigger: incoming,
					start: () => `top top+=${topOffset}`,
					// start: () => `top top+=${topOffset * incomingIndex}`,
					end: () => `+=${range}`,
					scrub: true,
					invalidateOnRefresh: true,
					onUpdate: (self) => {
						const max = cards.length - 1;
						// when 2 comes: activeFloat goes 0->1
						// when 3 comes: activeFloat goes 1->2

						if (incomingIndex === max) {
							gsap.set(incoming, { scale: 1 }); // last card সবসময় 1
							return;
						}

						// if (incomingIndex === 0) {
						// 	gsap.set(incoming, { scale: 1 }); // last card সবসময় 1
						// 	return;
						// }

						const activeFloat = incomingIndex + self.progress;

						cards.forEach((card, i) => {
							gsap.set(card, { scale: scaleFor(i, activeFloat, cards.length) });
						});
					},
				});
			});

			ScrollTrigger.refresh();
		}, rootRef);

		return () => ctx.revert();
	}, [ready, stickyTop, cardGaps]);

	// useLayoutEffect(() => {
	// 	if (!ready) return;

	// 	const ctx = gsap.context(() => {
	// 		const wrapper = wrapperRef.current;
	// 		if (!wrapper) return;

	// 		const cards = gsap.utils.toArray(".bBlocksStackedSingleCard", wrapper);
	// 		if (!cards.length) return;

	// 		const topOffset = Number(stickyTop ?? 30); // এখানে 30 দিয়েছিলে, রাখলাম
	// 		const gap = Number(cardGaps ?? 30);
	// 		const minScale = 0.72;
	// 		const rangePerCard = 400; // 300-500 এর মধ্যে টিউন করো, বড় হলে slow/smooth

	// 		// Wrapper setup
	// 		gsap.set(wrapper, {
	// 			overflow: "visible",
	// 			paddingBottom: (cards.length - 1) * gap, // extra space for last card
	// 			position: "relative"
	// 		});

	// 		// সব কার্ড একই top-এ sticky + y দিয়ে initial stack spacing
	// 		cards.forEach((card, i) => {
	// 			gsap.set(card, {
	// 				position: "sticky",
	// 				top: topOffset,          // ← এটা সবার জন্য একই রাখো (খুব গুরুত্বপূর্ণ!)
	// 				y: i * gap,
	// 				zIndex: 1000 + i,
	// 				transformOrigin: "50% 0%",
	// 				willChange: "transform, scale",
	// 				scale: 1,
	// 				immediateRender: true
	// 			});
	// 		});

	// 		// Single ScrollTrigger
	// 		ScrollTrigger.create({
	// 			trigger: wrapper,
	// 			start: `top top+=${topOffset}`,
	// 			end: () => `+=${(cards.length - 1) * rangePerCard}`,
	// 			scrub: 0.5,               // smooth feel
	// 			// pin: true,             // optional: uncomment করলে section pin হবে (অনেক ক্ষেত্রে ভালো লাগে)
	// 			invalidateOnRefresh: true,

	// 			onUpdate: (self) => {
	// 				const progress = self.progress;
	// 				const max = cards.length - 1;
	// 				let activeFloat = progress * max;

	// 				activeFloat = gsap.utils.clamp(0, max, activeFloat);

	// 				cards.forEach((card, i) => {
	// 					if (i === max) {
	// 						gsap.set(card, { scale: 1 }); // last card সবসময় 1
	// 						return;
	// 					}

	// 					// dist: কতটা "stacked" বা incoming হয়েছে
	// 					const dist = Math.max(0, activeFloat - i);
	// 					// scaleProgress: 0 to 1 over the full range
	// 					const scaleProgress = gsap.utils.clamp(0, 1, dist / max);

	// 					const scale = 1 - scaleProgress * (1 - minScale);

	// 					gsap.set(card, {
	// 						scale: gsap.utils.clamp(minScale, 1, scale)
	// 					});
	// 				});
	// 			}
	// 		});

	// 		ScrollTrigger.refresh(true);

	// 	}, rootRef.current);

	// 	return () => ctx.revert();
	// }, [ready, stickyTop, cardGaps]);


	return (
		<div ref={rootRef} className="b-blocks-stackedCardsMainWrapper">
			<div className="b-blocksStackedCardsWrapper" ref={wrapperRef} />
		</div>
	);
};

export default StackedCards;
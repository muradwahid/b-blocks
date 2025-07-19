import { useEffect, useRef, useState } from "react";

const useDragg = (isDragging, containerRef, setPosition, setIsDragging, orientation, isAutoSlide = false,isHoverStop ,speed=50,isMoveClick=false) => {
	const [mouseOver, setMouseOver] = useState(true);
	const animationRef = useRef();
	const directionRef = useRef(1);
	// const speedRef = useRef(50);

	const handleMove = (event) => {
		if (!isDragging || !containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const client = "touches" in event ? event.touches[0] : event;
		const pos = orientation === "horizontal" ? client.clientX - rect.left : client.clientY - rect.top;
		const newPosition = (pos / (orientation === "horizontal" ? rect.width : rect.height)) * 100;
		setPosition(Math.min(Math.max(newPosition, 0), 100));
	};

	const handleClick = (event) => {
		if (isDragging || !containerRef.current || !isMoveClick) return;
		const rect = containerRef.current.getBoundingClientRect();
		const pos = orientation === "horizontal" ? event.clientX - rect.left : event.clientY - rect.top;
		const newPosition = (pos / (orientation === "horizontal" ? rect.width : rect.height)) * 100;
		setPosition(Math.min(Math.max(newPosition, 0), 100));
	};

	useEffect(() => {
		if (!isDragging) return;
		const handleMouseUp = () => setIsDragging(false);
		const handleMouseMove = (e) => handleMove(e);
		const handleTouchMove = (e) => handleMove(e);
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
		window.addEventListener("touchmove", handleTouchMove);
		window.addEventListener("touchend", handleMouseUp);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
			window.removeEventListener("touchmove", handleTouchMove);
			window.removeEventListener("touchend", handleMouseUp);
		};
	}, [isDragging]);

	useEffect(() => {
		if (!isAutoSlide || !mouseOver || isDragging) return;
		let lastTime;

		const animate = (time) => {
			if (!lastTime) lastTime = time;
			const delta = (time - lastTime) / 1000;
			lastTime = time;
			setPosition((prev) => {
				// let next = prev + directionRef.current * speedRef.current * delta;
				let next = prev + directionRef.current * (speed*10) * delta;
				if (next >= 100) { directionRef.current = -1; next = 100; }
				if (next <= 0) { directionRef.current = 1; next = 0; }
				return next;
			});
			animationRef.current = requestAnimationFrame(animate);
		};

		animationRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationRef.current);
	}, [isAutoSlide, mouseOver, isDragging,isHoverStop,speed]);

	useEffect(() => {
		if (!containerRef.current) return;
		const handleMouseEnter = () => isHoverStop ? setMouseOver(false) : setMouseOver(true);
		const handleMouseLeave = () => setMouseOver(true);
		containerRef?.current?.addEventListener("mouseenter", handleMouseEnter);
		containerRef?.current?.addEventListener("mouseleave", handleMouseLeave);
		return () => {
			containerRef?.current?.removeEventListener("mouseenter", handleMouseEnter);
			containerRef?.current?.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, [containerRef.current,isHoverStop]);

	return { handleClick };
};

export default useDragg;
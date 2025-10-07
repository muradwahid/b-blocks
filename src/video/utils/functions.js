const controlsHandler = (controls) => {
	const newControls = [];
	Object.keys(controls).map(item => {
		if (controls[item]) {
			newControls.push(item);
		}
	});
	return newControls;
};
export { controlsHandler }
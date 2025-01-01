export const lowerCase = (word) => word.charAt(0).toLowerCase() + word.slice(1);

export const mobileDevice = window.matchMedia("(max-width:767px)").matches;
export const tabletDevice = window.matchMedia("(max-width:1024px)").matches;
export const desktopDevice = window.matchMedia("(min-width:1025px)").matches;

export const getBoxCSS = (value, property) => {
	if (value) {
		const result = Object.keys(value).map(
			(key) => `${property}-${key}:${value[key]};`
		);
		return result.join(" ");
	}
	return "";
};
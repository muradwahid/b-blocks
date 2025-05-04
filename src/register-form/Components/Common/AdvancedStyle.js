import React from "react";
import generateCSS from "../../../../bpl-tools/Advanced/generateCSS";
const AdvancedStyle = ({ attributes, id, isBackend = false }) => {
	const { advanced } = attributes;
	return <style dangerouslySetInnerHTML={{
		__html: `
			${generateCSS(advanced, id, isBackend)}
		`}}></style>;
};

export default AdvancedStyle;

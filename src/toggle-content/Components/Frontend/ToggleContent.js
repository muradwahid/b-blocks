import { useEffect, useMemo, useRef, useState } from "react";
const ToggleContent = ({ attributes, panelANode, panelBNode }) => {
	const { labelA = "First", labelB = "Second" } = attributes || {};
	const [active, setActive] = useState("a");

	const panelARef = useRef(null);
	const panelBRef = useRef(null);

	useEffect(() => {
		if (panelARef.current && panelANode) {
			panelARef.current.appendChild(panelANode);
		}
		if (panelBRef.current && panelBNode) {
			panelBRef.current.appendChild(panelBNode);
		}
	}, []);

	useEffect(() => {
		if (!panelARef.current || !panelBRef.current) return;

		panelARef.current.style.display = active === "a" ? "" : "none";
		panelBRef.current.style.display = active === "b" ? "" : "none";
	}, [active]);

	return <div className="simple-toggle">
		<div className="simple-toggle__head">
			<button onClick={() => setActive("a")} className={active === "a" ? "is-active" : ""}>
				{labelA}
			</button>

			<button onClick={() => setActive(a => a === "a" ? "b" : "a")}>
				Toggle
			</button>

			<button onClick={() => setActive("b")} className={active === "b" ? "is-active" : ""}>
				{labelB}
			</button>
		</div>

		<div className="simple-toggle__content">
			<div ref={panelARef} />
			<div ref={panelBRef} />
		</div>
	</div>
}
export default ToggleContent;
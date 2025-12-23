import { useCallback, useRef } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/snippets/html";
import "ace-builds/src-noconflict/snippets/html";

export const CustomCodeEditor = (props) => {
	const { value, onChange, height = "300px", width = "100%"} = props;
	const id = Math.floor(Math.random() * 99999999);

	const timeoutRef = useRef(null);

	const debouncedOnChange = useCallback(
		(newVal) => {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => {
				onChange(newVal);
			}, 600);
		},
		[onChange]
	);

	return <div>
			<AceEditor
				mode="html"
				theme="monokai"
				name={`advEditor-${id}`}
				// onLoad={this.onLoad}
				onChange={debouncedOnChange}
				fontSize={12}
				lineHeight={19}
				height={height}
				width={width}
				showPrintMargin={true}
				showGutter={true}
				highlightActiveLine={true}
				value={value}
			setOptions={{
				useWorker: false,
					enableBasicAutocompletion: true,
					enableLiveAutocompletion: false,
					enableSnippets: true,
					enableMobileMenu: true,
					showLineNumbers: true,
					tabSize: 2,
				}}
			/>
		</div> 
};


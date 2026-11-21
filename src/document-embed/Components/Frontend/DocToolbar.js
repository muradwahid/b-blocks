const DocToolbar = ({ name = '', showName = false, theme = 'dark', children }) => {
	return <div className={`b-blocks-document-embed-toolbar ${theme}`}>
		{showName && <span className='b-blocks-document-embed-name'>{name}</span>}

		<div className='b-blocks-document-embed-toolbar-right'>{children}</div>
	</div>;
};
export default DocToolbar;

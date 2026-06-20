import { useEffect } from 'react';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import ShareBar from '../Common/ShareBar';

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
	const { persistKey } = attributes;

	// Persist a stable key so multiple bars on one page stay independent.
	useEffect( () => {
		if ( ! persistKey ) {
			setAttributes( { persistKey: clientId } );
		}
	}, [ persistKey, clientId, setAttributes ] );

	const blockProps = useBlockProps( { className: 'bb-ssb bb-ssb-editor' } );

	return (
		<>
			<Settings { ...props } />

			<div { ...blockProps }>
				<Style attributes={ attributes } id={ `block-${ clientId }` } isBackend={ true } />
				<ShareBar attributes={ attributes } />
			</div>
		</>
	);
};

export default Edit;

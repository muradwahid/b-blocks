import { useEffect } from 'react';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import FloatingCta from '../Common/FloatingCta';

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
	const { cId } = attributes;

	// Persist a stable client id so the dismiss key is deterministic.
	useEffect( () => {
		if ( ! cId ) {
			setAttributes( { cId: clientId } );
		}
	}, [ cId, clientId, setAttributes ] );

	const blockProps = useBlockProps( { className: 'bb-fc-editor' } );

	return (
		<>
			<Settings { ...props } />

			<div { ...blockProps }>
				<Style attributes={ attributes } id={ `block-${ clientId }` } isBackend={ true } />
				<FloatingCta attributes={ attributes } isBackend={ true } />
			</div>
		</>
	);
};

export default Edit;

import '@wordpress/server-side-render';
import { createElement } from '@wordpress/element';

const ServerSideRender = ( props ) => {
	const globalSSR = ( typeof wp !== 'undefined' && wp.serverSideRender ) || null;
	const Component = globalSSR && ( globalSSR.default || globalSSR );

	return Component ? createElement( Component, props ) : null;
};

export default ServerSideRender;
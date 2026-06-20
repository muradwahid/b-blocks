/**
 * Resilient ServerSideRender accessor.
 *
 * The bundled default-import interop resolves
 * `import X from '@wordpress/server-side-render'` to `wp.serverSideRender.default`.
 * In WordPress 7.0 the global `wp.serverSideRender` IS the component function and
 * has no `.default`, so that import yields `undefined` and the block crashes in
 * the editor with React error #130 ("Element type is invalid … got: undefined").
 *
 * We resolve the real component from the global at RENDER time (not module-eval
 * time, when the global may not be assigned yet) and forward all props. This
 * works on every shape:
 *  - WordPress ≤ 6.x: `wp.serverSideRender.default` is the component.
 *  - WordPress 7.0:   `wp.serverSideRender` itself is the component.
 *
 * The side-effect import keeps `wp-server-side-render` registered as a script
 * dependency in the generated *.asset.php so the global is enqueued.
 */
import '@wordpress/server-side-render';
import { createElement } from '@wordpress/element';

const ServerSideRender = ( props ) => {
	const globalSSR = ( typeof wp !== 'undefined' && wp.serverSideRender ) || null;
	const Component = globalSSR && ( globalSSR.default || globalSSR );

	return Component ? createElement( Component, props ) : null;
};

export default ServerSideRender;

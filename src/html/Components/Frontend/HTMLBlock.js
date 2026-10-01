import { useRunJs } from '../hooks/useRunJs';

/**
 * `htmlCode` arrives already filtered: render.php runs it through
 * Sanitize::userHtml(), which returns it untouched only when the post author
 * holds `unfiltered_html` and hands back a wp_kses_post() copy otherwise. So
 * the activation pass below finds scripts to run only for content an author
 * was entitled to publish, and finds none in anything else.
 */
const HTMLBlock = ({ attributes }) => {
	const { htmlCode } = attributes;
	const htmlRef = useRunJs(htmlCode, 10);
	return <div ref={htmlRef} dangerouslySetInnerHTML={{ __html: htmlCode }}>
	</div>;
}
export default HTMLBlock;

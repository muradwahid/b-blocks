/**
 * Key Takeaways Block — frontend entry point.
 *
 * No interactive JavaScript. The file exists so the build pipeline emits
 * style.scss as view.css (the file the block.json "style" field points to).
 *
 * The block renders as a static <section> with a heading bar and a
 * semantic <ul>/<ol>; all per-instance styling is delivered via CSS
 * custom properties written into the wrapper from render.php.
 */
import './style.scss';

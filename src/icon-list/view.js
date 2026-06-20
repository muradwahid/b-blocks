/**
 * Icon List Block — frontend entry point.
 *
 * No interactive JavaScript. The file exists so the build pipeline emits
 * style.scss as view.css (the file the block.json "style" field points to).
 *
 * The block renders as a static <ul> with semantic <li> rows; per-instance
 * CSS custom properties are written into the wrapper from render.php.
 */
import './style.scss';

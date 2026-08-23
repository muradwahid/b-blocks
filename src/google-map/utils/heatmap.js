/**
 * Canvas heatmap overlay.
 *
 * Google removed `google.maps.visualization.HeatmapLayer` in Maps JavaScript
 * API 3.65 and offers no in-API replacement — their guidance is deck.gl, which
 * is far too much weight for one toggle. This draws the heatmap directly onto a
 * canvas in the map's overlay pane instead, using the standard grayscale-then-
 * colorize approach: stamp a blurred radial dot per point so overlaps
 * accumulate alpha, then map that alpha through a gradient lookup table.
 *
 * Because it only relies on OverlayView (part of the core `maps` library) it
 * works on raster and vector maps alike, with or without a Map ID.
 */

// Hard ceiling on canvas edge length. getImageData allocates width*height*4
// bytes, so an unbounded canvas is an out-of-memory crash waiting to happen.
const MAX_DIMENSION = 4096;

// Marks our canvas so a rebuilt overlay can evict a stale one from the pane.
const HEAT_CLASS = 'b-blocks-google-map-heat';

const GRADIENT_STOPS = [
	[0.0, [0, 0, 255, 0]],
	[0.2, [0, 0, 255, 255]],
	[0.4, [0, 255, 255, 255]],
	[0.6, [0, 255, 0, 255]],
	[0.8, [255, 255, 0, 255]],
	[1.0, [255, 0, 0, 255]]
];

/** 256-entry RGB lookup table, built once per overlay. */
const buildGradient = () => {
	const canvas = document.createElement('canvas');
	canvas.width = 1;
	canvas.height = 256;

	const ctx = canvas.getContext('2d');
	const gradient = ctx.createLinearGradient(0, 0, 0, 256);

	GRADIENT_STOPS.forEach(([stop, [r, g, b, a]]) => {
		gradient.addColorStop(stop, `rgba(${r},${g},${b},${a / 255})`);
	});

	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, 1, 256);

	return ctx.getImageData(0, 0, 1, 256).data;
};

/** A single pre-rendered blurred dot, reused for every point. */
const buildStamp = (radius, blur) => {
	const size = radius + blur;
	const canvas = document.createElement('canvas');
	canvas.width = size * 2;
	canvas.height = size * 2;

	const ctx = canvas.getContext('2d');
	// Drawing the circle off-canvas and letting its shadow land on-canvas is
	// how you get a cheap gaussian-ish falloff without per-pixel maths.
	ctx.shadowOffsetX = size * 2;
	ctx.shadowOffsetY = size * 2;
	ctx.shadowBlur = blur;
	ctx.shadowColor = '#000';

	ctx.beginPath();
	ctx.arc(-size, -size, radius, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();

	return canvas;
};

/**
 * OverlayView has to be subclassed after the API has loaded, so the class is
 * produced by this factory rather than declared at module scope.
 */
export const createHeatmapOverlay = ({ OverlayView, LatLng }) => {
	class HeatmapOverlay extends OverlayView {
		constructor({ points = [], radius = 20, opacity = 0.6 } = {}) {
			super();

			// `Number(x) ?? fallback` does not catch NaN — ?? only tests null and
			// undefined — so a non-numeric radius or opacity would poison every
			// derived value from here down.
			const num = (value, fallback) => (Number.isFinite(Number(value)) ? Number(value) : fallback);

			this.points = points;
			this.radius = Math.max(4, num(radius, 20));
			this.opacity = Math.min(1, Math.max(0, num(opacity, 0.6)));
			this.blur = Math.max(4, this.radius * 0.65);

			this.canvas = null;
			this.ctx = null;
			this.stamp = null;
			this.stampRadius = null;
			this.gradient = null;
			this.idleListener = null;
		}

		/**
		 * Update in place. Rebuilding the overlay for a slider drag means a
		 * setMap(null)/setMap() pair, and Google defers onRemove/onAdd to its
		 * own render cycle — so the replacement can be appended before the old
		 * canvas leaves, and the new radius/opacity appear to do nothing.
		 * Mutating avoids that race completely.
		 */
		setOptions({ points, radius, opacity } = {}) {
			const num = (value, fallback) => (Number.isFinite(Number(value)) ? Number(value) : fallback);

			if (Array.isArray(points)) this.points = points;

			if (undefined !== radius) {
				this.radius = Math.max(4, num(radius, this.radius));
				this.blur = Math.max(4, this.radius * 0.65);
			}

			if (undefined !== opacity) this.opacity = Math.min(1, Math.max(0, num(opacity, this.opacity)));

			// draw() rebuilds the stamp when stampRadius no longer matches and
			// re-applies opacity every paint, so this is all that's needed.
			this.draw();
		}

		onAdd() {
			const canvas = document.createElement('canvas');
			canvas.className = HEAT_CLASS;
			canvas.style.position = 'absolute';
			canvas.style.left = '0';
			canvas.style.top = '0';
			canvas.style.zIndex = '1';
			canvas.style.pointerEvents = 'none';

			this.canvas = canvas;
			this.ctx = canvas.getContext('2d');
			this.gradient = buildGradient();

			// Deliberately NOT getPanes().overlayLayer. Map panes belong to the
			// raster renderer, and a Map ID switches the map to vector — where
			// the pane may be absent, so `pane?.appendChild()` silently no-ops
			// and the heatmap never appears. The map's own container element is
			// always there, on both renderers.
			const host = this.getMap()?.getDiv();

			// Changing radius or opacity rebuilds this overlay, and setMap(null)
			// does not always run onRemove before the replacement is appended.
			// A stale canvas underneath makes new settings look ignored.
			host?.querySelectorAll(`.${HEAT_CLASS}`).forEach((stale) => stale.remove());
			host?.appendChild(canvas);

			// draw() needs a projection, which does not exist on the very first
			// call. Nothing re-invokes draw() unless the viewport changes, so on
			// a map nobody touches the heatmap would never paint.
			this.idleListener = this.getMap()?.addListener('idle', () => this.draw());
		}

		draw() {
			const projection = this.getProjection();
			const host = this.getMap()?.getDiv();
			if (!projection || !host || !this.canvas || !this.ctx) return;

			// Container pixels are measured from the map element's top-left —
			// exactly the canvas origin — so there is no offset maths to get
			// wrong, and the canvas can never be larger than the map itself
			// (the old bounds-derived size could reach millions of pixels and
			// blow up getImageData).
			const width = Math.min(host.clientWidth || 0, MAX_DIMENSION);
			const height = Math.min(host.clientHeight || 0, MAX_DIMENSION);
			if (width <= 0 || height <= 0) return;

			if (this.canvas.width !== width) this.canvas.width = width;
			if (this.canvas.height !== height) this.canvas.height = height;
			this.canvas.style.width = `${width}px`;
			this.canvas.style.height = `${height}px`;

			// Re-applied per paint so the live value always wins, even if this
			// instance outlives an attribute change.
			this.canvas.style.opacity = String(this.opacity);

			if (!this.stamp || this.stampRadius !== this.radius) {
				this.stamp = buildStamp(this.radius, this.blur);
				this.stampRadius = this.radius;
			}

			const ctx = this.ctx;
			const size = this.radius + this.blur;
			ctx.clearRect(0, 0, width, height);

			// A constant per-point alpha means a lone point still reads
			// mid-gradient while clusters saturate towards red.
			ctx.globalAlpha = 0.55;
			let painted = 0;

			this.points.forEach((point) => {
				const pixel = projection.fromLatLngToContainerPixel(new LatLng(point.lat, point.lng));
				if (!pixel) return;

				// Points just off-screen still bleed in, so blobs don't pop at
				// the edges while panning.
				if (pixel.x < -size || pixel.y < -size || pixel.x > width + size || pixel.y > height + size) return;

				ctx.drawImage(this.stamp, pixel.x - size, pixel.y - size);
				painted++;
			});

			ctx.globalAlpha = 1;
			if (!painted) return;

			// Colorize: the accumulated alpha channel is the intensity.
			const image = ctx.getImageData(0, 0, width, height);
			const data = image.data;

			for (let i = 3; i < data.length; i += 4) {
				const intensity = data[i];
				if (!intensity) continue;

				const offset = intensity * 4;
				data[i - 3] = this.gradient[offset];
				data[i - 2] = this.gradient[offset + 1];
				data[i - 1] = this.gradient[offset + 2];
			}

			ctx.putImageData(image, 0, 0);
		}

		onRemove() {
			this.idleListener?.remove();
			this.idleListener = null;

			this.canvas?.parentNode?.removeChild(this.canvas);
			this.canvas = null;
			this.ctx = null;
			this.stamp = null;
			this.stampRadius = null;
			this.gradient = null;
		}
	}

	return HeatmapOverlay;
};

export default createHeatmapOverlay;

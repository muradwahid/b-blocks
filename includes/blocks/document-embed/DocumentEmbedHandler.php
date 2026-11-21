<?php
/**
 * Document Embed block — server side.
 *
 * render.php asks this class for the settings it may hand to the browser
 * (Pro values reset for free sites, the URL checked, access applied). The
 * download tracker and the secure-viewing token (admin-ajax) and the delivery
 * routes (REST) read the block's settings from saved content, never from the
 * request: the limit, roles and file URL a visitor sends are ignored.
 *
 * @package bBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'BBlocksDocumentEmbedHandler' ) ) {

	class BBlocksDocumentEmbedHandler {

		const BLOCK = 'b-blocks/document-embed';

		// Site-wide download counts, keyed by docKey(). An option rather than post meta so a
		// block on an archive or in a template (no post id) is counted too.
		const COUNT_OPTION = 'b_blocks_de_download_counts';

		// Settings a free site never gets, reset to their block.json defaults (viewer keeps its engine).
		const PRO_KEYS = [ 'viewer', 'lightbox', 'access', 'security', 'performance', 'overlays' ];

		const PRO_DOWNLOAD_KEYS = [ 'showCount', 'limitPerIp', 'access', 'roles', 'deniedMessage' ];

		const PRO_FLIPBOOK_KEYS = [ 'hardCover', 'sound', 'autoPlay', 'autoPlayDuration', 'pageMode', 'speed', 'edgeColor' ];

		// A download link delivers the file at most twice (a dropped transfer may be retried).
		const TOKEN_USES = 2;

		const TOKEN_TTL = 10 * MINUTE_IN_SECONDS;

		// A viewing link is fetched in many requests (PDF.js, dFlip), so it gets more uses.
		const STREAM_USES = 50;

		const STREAM_TTL = 30 * MINUTE_IN_SECONDS;

		public function __construct() {
			add_action( 'wp_ajax_bb_de_track_download', [ $this, 'trackDownload' ] );
			add_action( 'wp_ajax_nopriv_bb_de_track_download', [ $this, 'trackDownload' ] );
			add_action( 'wp_ajax_bb_de_stream_token', [ $this, 'streamToken' ] );
			add_action( 'wp_ajax_nopriv_bb_de_stream_token', [ $this, 'streamToken' ] );
			add_action( 'rest_api_init', [ $this, 'registerRoutes' ] );
		}

		/**
		 * Every visitor-facing text of the two blocks' frontends, translated here: the page bundles (view.js)
		 * load React only and make no translation calls. Keys are read as labels.<key> (utils/common.js);
		 * placeholders (%s, %d, %1$s) are filled in JS; plurals give { one, other } — languages with more
		 * plural forms get "other" for every count above one.
		 * Keep in step with the labels.<key> reads in the Frontend components.
		 */
		public static function labels() {
			return [
				'allCategories' => __( 'All Categories', 'b-blocks' ),
				'allHidden' => __( 'Every document is hidden on the page. Turn off Hide on Page for a document in the Documents panel.', 'b-blocks' ),
				'allTypes' => __( 'All Types', 'b-blocks' ),
				'clearSearch' => __( 'Clear search and filter', 'b-blocks' ),
				'close' => __( 'Close', 'b-blocks' ),
				'copied' => __( 'Copied', 'b-blocks' ),
				'copyLinks' => __( 'Copy links', 'b-blocks' ),
				'copyPageLink' => __( 'Copy link to this page', 'b-blocks' ),
				'copyThisLink' => __( 'Copy this link:', 'b-blocks' ),
				'copyThisList' => __( 'Copy this list:', 'b-blocks' ),
				'documentLoadError' => __( 'The document could not be loaded.', 'b-blocks' ),
				'documentPages' => __( 'Document pages', 'b-blocks' ),
				'documentViewer' => __( 'Document viewer', 'b-blocks' ),
				'download' => __( 'Download', 'b-blocks' ),
				'downloadFailed' => __( 'The download could not start. Please reload the page and try again.', 'b-blocks' ),
				'downloadUnavailable' => __( 'Download unavailable', 'b-blocks' ),
				'featured' => __( 'Featured', 'b-blocks' ),
				'filterByCategory' => __( 'Filter by category', 'b-blocks' ),
				'filterByType' => __( 'Filter by type', 'b-blocks' ),
				'flipbookFailed' => __( 'The flipbook viewer could not load.', 'b-blocks' ),
				'fullScreen' => __( 'Full screen', 'b-blocks' ),
				'limitReached' => __( 'Limit Reached', 'b-blocks' ),
				'limitTitle' => __( 'Download limit reached for your IP address.', 'b-blocks' ),
				'linkCopied' => __( 'Link copied', 'b-blocks' ),
				'linksCopied' => __( 'Links copied', 'b-blocks' ),
				'loadMore' => __( 'Load more', 'b-blocks' ),
				'loadingDocument' => __( 'Loading document', 'b-blocks' ),
				'newBadge' => __( 'New', 'b-blocks' ),
				'noDocuments' => __( 'No documents added yet.', 'b-blocks' ),
				'noDocumentsFound' => __( 'No documents found.', 'b-blocks' ),
				'openDocument' => __( 'Open the document', 'b-blocks' ),
				'openNewTab' => __( 'Open in new tab', 'b-blocks' ),
				'openViewerNewTab' => __( 'Open viewer in new tab', 'b-blocks' ),
				'pdfEmpty' => __( 'The PDF file is empty or corrupted (0 bytes).', 'b-blocks' ),
				'pdfError' => __( 'An error occurred while loading the PDF.', 'b-blocks' ),
				'pdfNotFound' => __( 'The PDF file could not be found or the server returned an error.', 'b-blocks' ),
				'previewUnavailable' => __( 'Preview temporarily unavailable.', 'b-blocks' ),
				'print' => __( 'Print', 'b-blocks' ),
				'privateSite' => __( 'This file can be previewed once the site is on the public internet: the online document viewer cannot reach this site.', 'b-blocks' ),
				'retry' => __( 'Retry', 'b-blocks' ),
				'searchDocuments' => __( 'Search documents', 'b-blocks' ),
				'searchPlaceholder' => __( 'Search documents…', 'b-blocks' ),
				'sortBy' => __( 'Sort By', 'b-blocks' ),
				'sortDateAsc' => __( 'Date (Oldest)', 'b-blocks' ),
				'sortDateDesc' => __( 'Date (Newest)', 'b-blocks' ),
				'sortDocuments' => __( 'Sort documents', 'b-blocks' ),
				'sortNameAsc' => __( 'Name (A → Z)', 'b-blocks' ),
				'sortNameDesc' => __( 'Name (Z → A)', 'b-blocks' ),
				'sortSizeAsc' => __( 'Size (Smallest)', 'b-blocks' ),
				'sortSizeDesc' => __( 'Size (Largest)', 'b-blocks' ),
				'typeArchives' => __( 'Archives', 'b-blocks' ),
				'typeAudio' => __( 'Audio', 'b-blocks' ),
				'typeDocuments' => __( 'Documents', 'b-blocks' ),
				'typeImages' => __( 'Images', 'b-blocks' ),
				'typeOthers' => __( 'Others', 'b-blocks' ),
				'typePdf' => __( 'PDF', 'b-blocks' ),
				'typeVideos' => __( 'Videos', 'b-blocks' ),
				'view' => __( 'View', 'b-blocks' ),
				'viewDocument' => __( 'View Document', 'b-blocks' ),
				// translators: 1: a button text such as View or Download, 2: the document title.
				'buttonFor'         => __( '%1$s: %2$s', 'b-blocks' ),
				// translators: %s: the words searched for.
				'noMatch'           => __( 'No documents match “%s”.', 'b-blocks' ),
				// translators: %d: page number.
				'pageNumber'        => __( 'Page %d', 'b-blocks' ),
				// translators: %s: file size, e.g. 2 MB.
				'sizeValue'         => __( 'Size: %s', 'b-blocks' ),
				// translators: %s: CSS selector, e.g. .open-brochure
				'selectorHint'      => __( 'Opens when an element matching %s is clicked.', 'b-blocks' ),
				'downloadCount'     => [
					// translators: %d: number of downloads.
					'one'   => _n( '(%d download)', '(%d downloads)', 1, 'b-blocks' ),
					// translators: %d: number of downloads.
					'other' => _n( '(%d download)', '(%d downloads)', 2, 'b-blocks' ),
				],
				'documentCount'     => [
					// translators: %d: number of documents.
					'one'   => _n( '%d document', '%d documents', 1, 'b-blocks' ),
					// translators: %d: number of documents.
					'other' => _n( '%d document', '%d documents', 2, 'b-blocks' ),
				],
			];
		}

		/**
		 * Prints the labels once per page, before the block's view script, as window.bBlocksDocumentLabels.
		 *
		 * @param string $handle The block's view script handle.
		 */
		public static function printLabels( $handle ) {
			// Once per page: both blocks read the same window variable, and the inline script runs as the page
			// is parsed, before either deferred view script.
			static $printed = false;
			if ( $printed ) {
				return;
			}
			$printed = true;

			wp_add_inline_script( $handle, 'window.bBlocksDocumentLabels = ' . wp_json_encode( self::labels(), JSON_HEX_TAG | JSON_UNESCAPED_UNICODE ) . ';', 'before' );
		}

		/**
		 * The URL, or '' when its scheme is not one WordPress allows (javascript:, data:, …).
		 * Read the way the browser will: entities decoded, leading controls/spaces skipped,
		 * tabs and newlines ignored.
		 */
		public static function safeUrl( $url ) {
			if ( ! is_string( $url ) || '' === $url ) {
				return '';
			}

			$probe = $url;
			for ( $i = 0; $i < 3; $i++ ) {
				$decoded = html_entity_decode( $probe, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
				if ( $decoded === $probe ) {
					break;
				}
				$probe = $decoded;
			}
			$probe = preg_replace( '/[\t\n\r]/', '', ltrim( $probe, "\x00..\x20" ) );

			if ( preg_match( '/^([a-z][a-z0-9+.\-]*):/i', $probe, $match ) && ! in_array( strtolower( $match[1] ), wp_allowed_protocols(), true ) ) {
				return '';
			}

			return $url;
		}

		/**
		 * Fills in each object attribute's missing keys from its block.json default. prepare_attributes_for_render()
		 * only applies top-level defaults: a saved object replaces its whole default, so keys added to block.json
		 * later would be missing. Used by both blocks.
		 *
		 * @param array         $attributes Attributes with block.json defaults applied.
		 * @param WP_Block_Type $type       The registered block type.
		 */
		public static function withDefaults( $attributes, $type ) {
			foreach ( $type->attributes as $key => $schema ) {
				$default = $schema['default'] ?? null;
				if ( is_array( $default ) && ! wp_is_numeric_array( $default ) ) {
					$attributes[ $key ] = array_merge( $default, is_array( $attributes[ $key ] ?? null ) ? $attributes[ $key ] : [] );
				}
			}

			return $attributes;
		}

		/**
		 * The attributes as they apply on this site: Pro settings back to their defaults
		 * on a free site, flipbook and overlay settings allowlisted, the document resolved
		 * from its attachment and every URL checked.
		 *
		 * @param array         $attributes Attributes with block.json defaults applied.
		 * @param WP_Block_Type $type       The registered block type.
		 */
		public static function settings( $attributes, $type ) {
			$defaults = array_map( function ( $schema ) {
				return $schema['default'] ?? null;
			}, $type->attributes );
			$attributes = self::withDefaults( $attributes, $type );

			$engine = $attributes['viewer']['engine'] ?? '';
			$engine = in_array( $engine, [ 'default', 'custom', 'flipbook', 'slider' ], true ) ? $engine : 'default';

			if ( ! BBlocks\Inc\Utils::isPro() ) {
				foreach ( self::PRO_KEYS as $key ) {
					$attributes[ $key ] = $defaults[ $key ];
				}
				foreach ( self::PRO_DOWNLOAD_KEYS as $key ) {
					$attributes['download'][ $key ] = $defaults['download'][ $key ];
				}
				foreach ( self::PRO_FLIPBOOK_KEYS as $key ) {
					$attributes['flipbook'][ $key ] = $defaults['flipbook'][ $key ];
				}
				if ( 'custom' === ( $attributes['toolbar']['theme'] ?? '' ) ) {
					$attributes['toolbar']['theme'] = $defaults['toolbar']['theme'];
				}
			}

			// The engine is free; only the viewer controls around it are Pro.
			$attributes['viewer']['engine'] = $engine;

			// The toolbar theme goes into a class name and the PDF viewer's address: one of the three themes only.
			if ( ! in_array( $attributes['toolbar']['theme'] ?? '', [ 'dark', 'light', 'custom' ], true ) ) {
				$attributes['toolbar']['theme'] = $defaults['toolbar']['theme'];
			}

			// A colour as the bpl-tools colour picker saves it (hex, rgb/rgba, hsl/hsla, a theme var() or a
			// colour name); anything else is dropped. sanitize_hex_color() alone would drop every rgba() pick.
			$color = static function ( $value ) {
				$value = is_string( $value ) ? trim( $value ) : '';
				return preg_match( '/^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([0-9\s.,%deg\/]+\)|var\(--[\w-]+\)|[a-z]+)$/i', $value ) ? $value : '';
			};

			// A bpl-tools Background value, solid or gradient. The gradient is a CSS gradient function with
			// no character that could end the declaration.
			$background = static function ( $value ) use ( $color ) {
				// A plain colour string (the toolbar background before it became a Background) stays a solid colour.
				$value    = is_array( $value ) ? $value : [ 'color' => $value ];
				$gradient = is_string( $value['gradient'] ?? null ) ? trim( $value['gradient'] ) : '';

				return [
					'type'     => 'gradient' === ( $value['type'] ?? '' ) ? 'gradient' : 'solid',
					'color'    => $color( $value['color'] ?? '' ),
					'gradient' => preg_match( '/^(repeating-)?(linear|radial|conic)-gradient\([^;{}<>"\'\\\\]*\)$/i', $gradient ) ? $gradient : '',
				];
			};

			$attributes['toolbar']['bg']    = $background( $attributes['toolbar']['bg'] ?? null );
			$attributes['toolbar']['color'] = $color( $attributes['toolbar']['color'] ?? '' );

			$flipbook = $attributes['flipbook'];
			$attributes['flipbook'] = [
				'style'            => in_array( $flipbook['style'] ?? '', [ '3d', 'soft', 'flat' ], true ) ? $flipbook['style'] : '',
				'mobileSoft'       => ! empty( $flipbook['mobileSoft'] ),
				'hardCover'        => ! empty( $flipbook['hardCover'] ),
				'sound'            => ! empty( $flipbook['sound'] ),
				'autoPlay'         => ! empty( $flipbook['autoPlay'] ),
				'autoPlayDuration' => max( 1000, absint( $flipbook['autoPlayDuration'] ?? 0 ) ),
				'pageMode'         => in_array( $flipbook['pageMode'] ?? '', [ 'auto', 'single', 'double' ], true ) ? $flipbook['pageMode'] : 'auto',
				'speed'            => min( 3000, max( 200, absint( $flipbook['speed'] ?? 0 ) ) ),
				'edgeColor'        => $color( $flipbook['edgeColor'] ?? '' ),
			];

			// Overlays: positions in percent, link URLs checked, text kept as plain text.
			$overlays = [];
			foreach ( is_array( $attributes['overlays'] ?? null ) ? $attributes['overlays'] : [] as $overlay ) {
				if ( ! is_array( $overlay ) ) {
					continue;
				}
				$overlays[] = [
					'page'    => max( 1, (int) ( $overlay['page'] ?? 1 ) ),
					'type'    => in_array( $overlay['type'] ?? '', [ 'note', 'highlight', 'link', 'cta' ], true ) ? $overlay['type'] : 'note',
					'x'       => min( 100, max( 0, (float) ( $overlay['x'] ?? 0 ) ) ),
					'y'       => min( 100, max( 0, (float) ( $overlay['y'] ?? 0 ) ) ),
					'w'       => min( 100, max( 1, (float) ( $overlay['w'] ?? 10 ) ) ),
					'h'       => min( 100, max( 1, (float) ( $overlay['h'] ?? 10 ) ) ),
					'url'     => esc_url_raw( self::safeUrl( (string) ( $overlay['url'] ?? '' ) ) ),
					// Plain text: the viewer puts it in as textContent, so nothing in it becomes markup. Kept as written.
					'content' => wp_check_invalid_utf8( (string) ( $overlay['content'] ?? '' ) ),
					'color'   => $color( $overlay['color'] ?? '' ),
					'bg'      => $background( $overlay['bg'] ?? [] ),
				];
			}
			$attributes['overlays'] = $overlays;

			$attributes['lightbox']['image']['url'] = esc_url_raw( self::safeUrl( (string) ( $attributes['lightbox']['image']['url'] ?? '' ) ) );

			// The Embed page shows no file size: the file system is not asked for one on every view.
			$attributes['document'] = self::document( is_array( $attributes['document'] ?? null ) ? $attributes['document'] : [], false );

			return $attributes;
		}

		/**
		 * Trust the attachment over client-saved values: URL, MIME type, name and (unless $withSize is false) size.
		 */
		public static function document( $document, $withSize = true ) {
			$id = absint( $document['id'] ?? 0 );

			if ( $id > 0 && 'attachment' === get_post_type( $id ) ) {
				$url = wp_get_attachment_url( $id );
				if ( is_string( $url ) && '' !== $url ) {
					$document['url'] = $url;
				}

				$mime = get_post_mime_type( $id );
				if ( is_string( $mime ) && '' !== $mime ) {
					$document['mime'] = $mime;
				}

				$path = get_attached_file( $id );
				if ( '' === trim( (string) ( $document['name'] ?? '' ) ) ) {
					$document['name'] = basename( (string) $path );
				}

				if ( $withSize && is_string( $path ) && '' !== $path && file_exists( $path ) ) {
					// The format the Media Library gives the editor (no decimals), so editor and page show the same size.
					$document['size'] = size_format( filesize( $path ) );
				}
			} elseif ( $id > 0 ) {
				// Deleted from the Media Library since the block was saved: its old address is a dead link,
				// so nothing is shown (the editor says so on the block).
				$document['url'] = '';
			}

			$document['url'] = esc_url_raw( self::safeUrl( (string) ( $document['url'] ?? '' ) ) );

			return $document;
		}

		/**
		 * Whether secure viewing applies: switched on, a Media Library PDF, and an engine that
		 * renders in the browser (Google and Office viewers fetch from their own servers, so a
		 * link bound to the visitor's IP would never load there).
		 */
		public static function isSecure( $attributes ) {
			return ! empty( $attributes['security']['secureDelivery'] )
				&& absint( $attributes['document']['id'] ?? 0 ) > 0
				&& 'application/pdf' === ( $attributes['document']['mime'] ?? '' )
				&& in_array( $attributes['viewer']['engine'] ?? '', [ 'custom', 'flipbook', 'slider' ], true );
		}

		/**
		 * Whether the current visitor passes an everyone / loggedin / roles rule.
		 */
		public static function allowed( $rule, $roles ) {
			if ( 'loggedin' === $rule ) {
				return is_user_logged_in();
			}

			if ( 'roles' === $rule ) {
				if ( ! is_user_logged_in() ) {
					return false;
				}
				$roles = is_array( $roles ) ? $roles : [];
				return ! empty( array_intersect( $roles, (array) wp_get_current_user()->roles ) );
			}

			return true;
		}

		/**
		 * One key per block instance on one page: a page can hold several embeds of the same
		 * file, and a template block shown on many pages counts per page.
		 */
		public static function docKey( $postId, $blockId ) {
			return md5( absint( $postId ) . '|' . (string) $blockId );
		}

		/**
		 * REMOTE_ADDR only. Forwarded-for headers are set by the client, so trusting them
		 * would let anyone reset their own download limit.
		 */
		public static function clientIp() {
			return isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		}

		public static function ipCount( $docKey ) {
			return (int) get_transient( self::ipKey( $docKey ) );
		}

		/**
		 * The per-IP download counter's name. wp_hash() (keyed with the site salts) rather than a plain md5():
		 * an md5 of a known key and an IPv4 address can be reversed by trying every address.
		 */
		private static function ipKey( $docKey ) {
			return 'bb_de_ip_' . wp_hash( $docKey . '|' . self::clientIp() );
		}

		public static function downloadCount( $docKey ) {
			$counts = get_option( self::COUNT_OPTION, [] );

			return is_array( $counts ) ? (int) ( $counts[ $docKey ] ?? 0 ) : 0;
		}

		/**
		 * The saved attributes of one Document Embed block, settings applied, or null.
		 *
		 * Looks in the post the block rendered for, then in the page being viewed (inside a Query
		 * Loop the first is the loop item, not the page holding the block), then in published
		 * synced patterns, templates and template parts.
		 */
		public static function findBlock( $postId, $blockId, $pageId = 0 ) {
			if ( '' === $blockId ) {
				return null;
			}

			$found = null;

			foreach ( array_unique( array_filter( [ absint( $postId ), absint( $pageId ) ] ) ) as $id ) {
				$post = get_post( $id );

				if ( $post && ! post_password_required( $post ) && ( is_post_publicly_viewable( $post ) || current_user_can( 'read_post', $post->ID ) ) ) {
					$found = self::search( parse_blocks( $post->post_content ), $blockId );
				}

				if ( null !== $found ) {
					break;
				}
			}

			if ( null === $found ) {
				global $wpdb;

				// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- rare lookup by a unique id, only when a download or viewing link is requested.
				$contents = $wpdb->get_col( $wpdb->prepare(
					"SELECT post_content FROM {$wpdb->posts} WHERE post_type IN ( 'wp_block', 'wp_template', 'wp_template_part' ) AND post_status = 'publish' AND post_content LIKE %s LIMIT 5",
					'%' . $wpdb->esc_like( '"blockId":"' . $blockId . '"' ) . '%'
				) );

				foreach ( $contents as $content ) {
					$found = self::search( parse_blocks( $content ), $blockId );
					if ( null !== $found ) {
						break;
					}
				}
			}

			if ( null === $found ) {
				return null;
			}

			$type = WP_Block_Type_Registry::get_instance()->get_registered( self::BLOCK );

			return $type ? self::settings( $type->prepare_attributes_for_render( $found ), $type ) : null;
		}

		private static function search( $blocks, $blockId ) {
			foreach ( $blocks as $block ) {
				if ( self::BLOCK === $block['blockName'] && ( $block['attrs']['blockId'] ?? '' ) === $blockId ) {
					return $block['attrs'];
				}

				if ( ! empty( $block['innerBlocks'] ) ) {
					$found = self::search( $block['innerBlocks'], $blockId );
					if ( null !== $found ) {
						return $found;
					}
				}
			}

			return null;
		}

		/**
		 * The block for an AJAX request, after the CSRF check. A nonce only means something for
		 * a signed-in visitor: an anonymous one has no session to forge, and on a cached page
		 * their nonce goes stale after a day while the page is still served.
		 */
		private function requestedBlock( $action ) {
			if ( is_user_logged_in() ) {
				check_ajax_referer( $action, 'nonce' );
			}

			$postId  = isset( $_POST['postId'] ) ? absint( $_POST['postId'] ) : 0; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- see above.
			$blockId = isset( $_POST['blockId'] ) ? sanitize_key( wp_unslash( $_POST['blockId'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- see above.
			$pageId  = isset( $_POST['pageId'] ) ? absint( $_POST['pageId'] ) : 0; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- see above.

			$attributes = self::findBlock( $postId, $blockId, $pageId );

			if ( null === $attributes || '' === $attributes['document']['url'] ) {
				wp_send_json_error( [ 'message' => __( 'Document not found.', 'b-blocks' ) ] );
			}

			if ( ! self::allowed( $attributes['access']['view'], $attributes['access']['roles'] ) ) {
				wp_send_json_error( [ 'message' => __( 'Access denied.', 'b-blocks' ), 'denied' => true ] );
			}

			return [ $postId, $blockId, $attributes, $pageId ];
		}

		private static function grant( $postId, $blockId, $kind, $ttl ) {
			$token = wp_generate_password( 32, false );

			set_transient( 'bb_de_dl_' . md5( $token ), [
				'post'  => $postId,
				'block' => $blockId,
				'kind'  => $kind,
				// Hashed with the site salt: the link stays bound to the visitor's address without storing it.
				'ip'    => wp_hash( self::clientIp() ),
				'uses'  => 0,
			], $ttl );

			return $token;
		}

		/**
		 * Records a download and hands back a short-lived link to the file.
		 */
		public function trackDownload() {
			[ $postId, $blockId, $attributes ] = $this->requestedBlock( 'bb_de_track_download' );

			$download = $attributes['download'];

			// A block whose Download button is off offers no download, even to a direct request.
			if ( empty( $attributes['toolbar']['showDownload'] ) ) {
				wp_send_json_error( [ 'message' => __( 'Access denied.', 'b-blocks' ), 'denied' => true ] );
			}

			if ( ! self::allowed( $download['access'], $download['roles'] ) ) {
				wp_send_json_error( [ 'message' => __( 'Access denied.', 'b-blocks' ), 'denied' => true ] );
			}

			$docKey = self::docKey( $postId, $blockId );
			$limit  = absint( $download['limitPerIp'] );
			$used   = $limit > 0 ? self::ipCount( $docKey ) : 0;

			// Refuse before recording: a refused download must not count against the visitor.
			if ( $limit > 0 && $used >= $limit ) {
				wp_send_json_error( [
					'message'       => __( 'Download limit reached.', 'b-blocks' ),
					'limit_reached' => true,
					'count'         => self::downloadCount( $docKey ),
				] );
			}

			// Per-IP records only where a limit needs them: each one is a row in wp_options.
			if ( $limit > 0 ) {
				set_transient( self::ipKey( $docKey ), $used + 1, YEAR_IN_SECONDS );
			}

			$counts = get_option( self::COUNT_OPTION, [] );
			$counts = is_array( $counts ) ? $counts : [];
			$counts[ $docKey ] = (int) ( $counts[ $docKey ] ?? 0 ) + 1;
			update_option( self::COUNT_OPTION, $counts, false );

			wp_send_json_success( [
				'count'         => $counts[ $docKey ],
				'limit_reached' => $limit > 0 && $used + 1 >= $limit,
				'nonce'         => self::grant( $postId, $blockId, 'download', self::TOKEN_TTL ),
			] );
		}

		/**
		 * Secure viewing: a viewing link bound to the visitor's IP, fetched when the viewer
		 * mounts, so a cached page never carries a link that only worked for someone else.
		 */
		public function streamToken() {
			// One nonce (trackNonce on the page) covers both requests a visitor's page makes: downloads and viewing links.
			[ $postId, $blockId, $attributes, $pageId ] = $this->requestedBlock( 'bb_de_track_download' );

			if ( ! self::isSecure( $attributes ) ) {
				wp_send_json_error( [ 'message' => __( 'Document not found.', 'b-blocks' ) ] );
			}

			$token = self::grant( $postId, $blockId, 'stream', self::STREAM_TTL );

			// A signed-in visitor needs the REST nonce, or the REST API treats them as logged out and a
			// logged-in / roles view rule refuses them (the download link carries it too).
			$args = [ 'token' => $token, 'page' => $pageId ];
			if ( is_user_logged_in() ) {
				$args['_wpnonce'] = wp_create_nonce( 'wp_rest' );
			}

			wp_send_json_success( [ 'url' => add_query_arg( $args, rest_url( "b-blocks/v1/document-stream/$postId/$blockId" ) ) ] );
		}

		public function registerRoutes() {
			foreach ( [ 'document-download' => 'deliver', 'document-stream' => 'stream' ] as $route => $callback ) {
				register_rest_route( 'b-blocks/v1', "/$route/(?P<post>\d+)/(?P<block>[a-z0-9-]+)", [
					'methods'             => 'GET',
					'callback'            => [ $this, $callback ],
					// The token checked in the callback is the permission: it is issued only after
					// the access (and limit) checks above.
					'permission_callback' => '__return_true',
					'args'                => [
						'token' => [ 'type' => 'string', 'required' => true ],
					],
				] );
			}
		}

		/**
		 * The block and the file for a delivery request, or a refusal. Spends one use of the token.
		 */
		private function checkGrant( WP_REST_Request $request, $kind, $uses, $ttl ) {
			$postId  = absint( $request['post'] );
			$blockId = sanitize_key( $request['block'] );

			// The token is the permission, checked first: the route is public, and a made-up token must not cost a
			// look through the site's content.
			$key   = 'bb_de_dl_' . md5( (string) $request->get_param( 'token' ) );
			$grant = get_transient( $key );

			if ( ! is_array( $grant ) || $grant['kind'] !== $kind || $grant['post'] !== $postId || $grant['block'] !== $blockId || ! hash_equals( (string) $grant['ip'], wp_hash( self::clientIp() ) ) || $grant['uses'] >= $uses ) {
				return new WP_REST_Response( __( 'This link has expired. Please reload the page and try again.', 'b-blocks' ), 403 );
			}

			// The block as saved now (the page id is only a hint where to look): its rules may have changed since.
			$attributes = self::findBlock( $postId, $blockId, absint( $request->get_param( 'page' ) ) );

			if ( null === $attributes || '' === $attributes['document']['url'] ) {
				return new WP_REST_Response( __( 'Document not found.', 'b-blocks' ), 404 );
			}

			if ( ! self::allowed( $attributes['access']['view'], $attributes['access']['roles'] ) || ( 'download' === $kind && ! self::allowed( $attributes['download']['access'], $attributes['download']['roles'] ) ) ) {
				return new WP_REST_Response( __( 'Access denied.', 'b-blocks' ), 403 );
			}

			// A HEAD request (a link checker, a browser probing the file) gets the headers only and
			// does not use up the link.
			if ( 'HEAD' !== $request->get_method() ) {
				$grant['uses']++;
				set_transient( $key, $grant, $ttl );
			}

			return $attributes;
		}

		/**
		 * The file's real path when it is a Media Library file inside uploads, or ''.
		 */
		private static function localPath( $document ) {
			$id   = absint( $document['id'] );
			$path = $id > 0 ? get_attached_file( $id ) : '';
			$real = is_string( $path ) && '' !== $path ? realpath( $path ) : false;
			$base = realpath( wp_upload_dir()['basedir'] );

			return $real && $base && 0 === strpos( $real, $base . DIRECTORY_SEPARATOR ) ? $real : '';
		}

		private static function sendFile( $path, $disposition, $filename ) {
			$mime = wp_check_filetype( $path );

			nocache_headers();
			header( 'Content-Type: ' . ( $mime['type'] ? $mime['type'] : 'application/octet-stream' ) );
			header( 'Content-Disposition: ' . $disposition . '; filename="' . $filename . '"' );
			header( 'Content-Length: ' . filesize( $path ) );
			header( 'X-Content-Type-Options: nosniff' );
			// Shown in the browser from this site's origin: no scripts (an SVG or HTML upload).
			// Not for PDFs: a sandboxed document cannot use the browser's own PDF viewer.
			if ( 'inline' === $disposition && 'application/pdf' !== $mime['type'] ) {
				header( 'Content-Security-Policy: sandbox' );
			}

			while ( ob_get_level() ) {
				ob_end_clean();
			}

			if ( 'HEAD' === strtoupper( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_METHOD'] ?? 'GET' ) ) ) ) {
				exit;
			}

			// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_readfile -- streaming a file has no WP_Filesystem equivalent.
			readfile( $path );
			exit;
		}

		/**
		 * Download: streams the file (media library) or redirects to it (external URL).
		 */
		public function deliver( WP_REST_Request $request ) {
			$attributes = $this->checkGrant( $request, 'download', self::TOKEN_USES, self::TOKEN_TTL );

			if ( $attributes instanceof WP_REST_Response ) {
				return $attributes;
			}

			$download = $attributes['download'];
			$path     = self::localPath( $attributes['document'] );

			if ( '' === $path ) {
				wp_redirect( esc_url_raw( $attributes['document']['url'] ) );
				exit;
			}

			// The custom name keeps the file's extension, so it still opens with the right app.
			$ext      = pathinfo( $path, PATHINFO_EXTENSION );
			$filename = sanitize_file_name( (string) $download['filename'] );
			$filename = '' === $filename ? basename( $path ) : ( '' !== $ext && strtolower( pathinfo( $filename, PATHINFO_EXTENSION ) ) !== strtolower( $ext ) ? "$filename.$ext" : $filename );

			self::sendFile( $path, 'newtab' === $download['behavior'] ? 'inline' : 'attachment', $filename );
		}

		/**
		 * Secure viewing: the PDF for the viewer, never a public URL.
		 */
		public function stream( WP_REST_Request $request ) {
			$attributes = $this->checkGrant( $request, 'stream', self::STREAM_USES, self::STREAM_TTL );

			if ( $attributes instanceof WP_REST_Response ) {
				return $attributes;
			}

			$path = self::isSecure( $attributes ) ? self::localPath( $attributes['document'] ) : '';

			if ( '' === $path ) {
				return new WP_REST_Response( __( 'Document not found.', 'b-blocks' ), 404 );
			}

			self::sendFile( $path, 'inline', basename( $path ) );
		}
	}

	new BBlocksDocumentEmbedHandler();
}

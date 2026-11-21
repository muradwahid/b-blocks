<?php

namespace BBlocks\Inc;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Sanitize
{

	private static $cache = [];

	public static function svg( $markup )
	{
		if ( ! is_string( $markup ) || '' === trim( $markup ) ) {
			return '';
		}

		$key = md5( $markup );
		if ( isset( self::$cache[ $key ] ) ) {
			return self::$cache[ $key ];
		}

		$sanitizer = self::sanitizer();
		if ( ! $sanitizer ) {
			return self::$cache[ $key ] = '';
		}

		try {
			$clean = $sanitizer->sanitize( $markup );
		} catch ( \Throwable $e ) {
			$clean = false;
		}

		if ( ! is_string( $clean ) || '' === trim( $clean ) || ! self::isSafe( $clean ) ) {
			return self::$cache[ $key ] = '';
		}

		return self::$cache[ $key ] = $clean;
	}

	public static function markup( $text )
	{
		if ( ! is_string( $text ) || false === strpos( $text, '<' ) ) {
			return $text;
		}

		if ( false !== stripos( $text, '<svg' ) ) {
			$text = preg_replace_callback(
				'#<svg\b[^>]*>.*?</svg\s*>#is',
				static function ( $matches ) {
					return self::svg( $matches[0] );
				},
				$text
			);

			if ( ! is_string( $text ) ) {
				return '';
			}
		}

		return self::html( $text );
	}

	const DROP_WITH_CONTENT = [ 'SCRIPT', 'STYLE', 'IFRAME', 'FRAME', 'FRAMESET', 'OBJECT', 'EMBED', 'APPLET', 'TEMPLATE', 'NOSCRIPT', 'NOEMBED', 'NOFRAMES', 'XMP', 'TEXTAREA', 'SELECT', 'TITLE', 'MATH', 'SVG', 'BASE', 'META', 'LINK' ];

	const URL_ATTRIBUTES = [ 'href', 'src', 'cite', 'action', 'formaction', 'poster', 'background', 'longdesc', 'usemap', 'xlink:href' ];

	public static function html( $html )
	{
		// Only markup: "a < b" in plain text is not a tag.
		if ( ! is_string( $html ) || ! preg_match( '#<[a-z!/?]#i', $html ) ) {
			return $html;
		}

		$key = 'html' . md5( $html );
		if ( isset( self::$cache[ $key ] ) ) {
			return self::$cache[ $key ];
		}

		$icons = [];
		$token = 'bblockssvg' . wp_generate_password( 12, false ) . 'x';
		$html  = preg_replace_callback(
			'#<svg\b[^>]*>.*?</svg\s*>#is',
			static function ( $matches ) use ( &$icons, $token ) {
				$icons[] = $matches[0];
				return $token . ( count( $icons ) - 1 ) . 'x';
			},
			$html
		);
		if ( ! is_string( $html ) ) {
			return self::$cache[ $key ] = '';
		}

		$allowed = array_merge( wp_kses_allowed_html( 'post' ), [ 'bdi' => [ 'dir' => true ], 'bdo' => [ 'dir' => true ] ] );

		$clean = self::domClean( $html, $allowed );
		if ( null === $clean ) {
			$clean = wp_kses( $html, $allowed );
		}

		foreach ( $icons as $i => $icon ) {
			$clean = str_replace( $token . $i . 'x', $icon, $clean );
		}

		return self::$cache[ $key ] = $clean;
	}

	private static function domClean( $html, $allowed )
	{
		if ( ! class_exists( '\WP_HTML_Processor' ) || ! method_exists( '\WP_HTML_Processor', 'next_token' ) ) {
			return null;
		}
		$tags = \WP_HTML_Processor::create_fragment( $html );
		if ( ! $tags ) {
			return null;
		}

		$void  = [ 'area', 'br', 'col', 'embed', 'hr', 'img', 'input', 'source', 'track', 'wbr' ];
		$clean = '';
		while ( $tags->next_token() ) {

			if ( array_intersect( $tags->get_breadcrumbs(), self::DROP_WITH_CONTENT ) || in_array( (string) $tags->get_tag(), self::DROP_WITH_CONTENT, true ) ) {
				continue;
			}

			$type = $tags->get_token_type();
			if ( '#text' === $type ) {
				$clean .= htmlspecialchars( $tags->get_modifiable_text(), ENT_NOQUOTES | ENT_SUBSTITUTE, 'UTF-8' );
				continue;
			}

			if ( '#tag' !== $type || 'html' !== $tags->get_namespace() ) {
				continue;
			}

			$tag = strtolower( $tags->get_tag() );
			if ( ! isset( $allowed[ $tag ] ) ) {
				continue;
			}
			if ( $tags->is_tag_closer() ) {
				$clean .= in_array( $tag, $void, true ) ? '' : "</{$tag}>";
				continue;
			}

			$clean .= "<{$tag}";
			$seen   = [];
			foreach ( (array) $tags->get_attribute_names_with_prefix( '' ) as $name ) {
				$name = strtolower( $name );
				if ( isset( $seen[ $name ] ) ) {
					continue;
				}
				$seen[ $name ] = true;

				$known = ! empty( $allowed[ $tag ][ $name ] )
					|| ( 0 === strpos( $name, 'data-' ) && ! empty( $allowed[ $tag ]['data-*'] ) && preg_match( '/^data-[a-z0-9_.:-]+$/', $name ) );
				if ( ! $known ) {
					continue;
				}

				$value = $tags->get_attribute( $name );
				if ( true === $value ) {
					$clean .= " {$name}";
					continue;
				}
				$value = (string) $value;

				if ( in_array( $name, self::URL_ATTRIBUTES, true ) ) {
					$url    = trim( $value );
					$image  = 'img' === $tag && 'src' === $name && preg_match( '#^data:image/(png|jpe?g|gif|webp|avif);#i', $url );
					if ( ! $image && wp_kses_bad_protocol( $url, wp_allowed_protocols() ) !== $url ) {
						continue;
					}
				} elseif ( 'style' === $name ) {
					$value = safecss_filter_attr( $value );
					if ( '' === $value ) {
						continue;
					}
				}

				$clean .= " {$name}=\"" . htmlspecialchars( $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ) . '"';
			}
			$clean .= '>';
		}

		return null === $tags->get_last_error() ? $clean : null;
	}

	public static function userHtml( $html, $authorId = null )
	{
		if ( ! is_string( $html ) || '' === trim( $html ) ) {
			return '';
		}

		return self::authorCanUnfilteredHtml( $authorId ) ? $html : wp_kses_post( $html );
	}
	public static function authorCanUnfilteredHtml( $authorId = null )
	{
		if ( null === $authorId ) {
			$postId   = get_the_ID();
			$authorId = $postId ? (int) get_post_field( 'post_author', $postId ) : 0;
		}

		$authorId = (int) $authorId;

		if ( $authorId <= 0 ) {
			return false;
		}

		return user_can( $authorId, 'unfiltered_html' );
	}

	public static function attributes( $attributes, $text = [] )
	{
		if ( is_string( $attributes ) ) {
			return self::markup( $attributes );
		}

		if ( is_array( $attributes ) ) {
			foreach ( $attributes as $key => $value ) {
				$attributes[ $key ] = in_array( $key, $text, true ) && is_string( $value ) ? $value : self::attributes( $value, $text );
			}
		}

		return $attributes;
	}

	public static function sanitizer()
	{
		static $sanitizer = null;
		static $resolved  = false;

		if ( $resolved ) {
			return $sanitizer;
		}

		$resolved = true;

		if ( ! class_exists( '\enshrined\svgSanitize\Sanitizer' ) ) {
			$autoload = B_BLOCKS_DIR_PATH . 'vendor/autoload.php';

			if ( file_exists( $autoload ) ) {
				require_once $autoload;
			}
		}

		if ( ! class_exists( '\enshrined\svgSanitize\Sanitizer' ) ) {
			return $sanitizer;
		}

		$instance = new \enshrined\svgSanitize\Sanitizer();
		$instance->removeRemoteReferences( true );
		$instance->removeXMLTag( true );
		$instance->useThreshold( 1000 );
		$instance->setUseNestingLimit( 5 );

		$filtered = apply_filters( 'b_blocks_svg_sanitizer', $instance );

		$sanitizer = $filtered instanceof \enshrined\svgSanitize\Sanitizer ? $filtered : $instance;

		return $sanitizer;
	}

	public static function isSafe( $clean )
	{
		$forbidden = [ 'script', 'foreignobject', 'handler', 'iframe', 'embed', 'object', 'base', 'meta' ];

		$previous = libxml_use_internal_errors( true );
		$dom      = new \DOMDocument();
		$loaded   = $dom->loadXML( $clean, LIBXML_NONET );
		libxml_clear_errors();
		libxml_use_internal_errors( $previous );

		if ( ! $loaded || ! $dom->documentElement ) {
			return false;
		}
		if ( 'svg' !== strtolower( $dom->documentElement->localName ) ) {
			return false;
		}

		foreach ( ( new \DOMXPath( $dom ) )->query( '//*' ) as $element ) {
			if ( in_array( strtolower( $element->localName ), $forbidden, true ) ) {
				return false;
			}

			if ( 'style' === strtolower( $element->localName ) ) {
				$css = preg_replace( '/[\s\x00-\x1f]+/', '', strtolower( (string) $element->textContent ) );

				foreach ( [ 'javascript:', 'vbscript:', 'expression(', '@import' ] as $needle ) {
					if ( false !== strpos( $css, $needle ) ) {
						return false;
					}
				}
			}

			if ( ! $element->hasAttributes() ) {
				continue;
			}

			foreach ( $element->attributes as $attribute ) {
				if ( 0 === stripos( $attribute->nodeName, 'on' ) || 0 === stripos( (string) $attribute->localName, 'on' ) ) {
					return false;
				}

				$value = strtolower( html_entity_decode( $attribute->nodeValue, ENT_QUOTES, 'UTF-8' ) );
				$value = preg_replace( '/[\s\x00-\x1f]+/', '', $value );

				foreach ( [ 'javascript:', 'vbscript:', 'data:text/html' ] as $needle ) {
					if ( false !== strpos( $value, $needle ) ) {
						return false;
					}
				}
			}
		}

		return true;
	}
}

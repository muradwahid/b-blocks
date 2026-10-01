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
		if ( ! is_string( $text ) || false === stripos( $text, '<svg' ) ) {
			return $text;
		}

		return preg_replace_callback(
			'#<svg\b[^>]*>.*?</svg\s*>#is',
			static function ( $matches ) {
				return self::svg( $matches[0] );
			},
			$text
		);
	}

	/**
	 * Author-supplied raw HTML, gated on the unfiltered_html capability.
	 *
	 * WordPress' answer to "may this person publish markup that executes" is
	 * the unfiltered_html capability: Administrators have it on single sites,
	 * Super Admins have it on multisite, and Editors and below never do. This
	 * applies that same rule to block attributes that are rendered as raw HTML
	 * - the HTML block's `htmlCode` in particular - which core's kses pass on
	 * post_content does not reliably reach, because the block serializer
	 * unicode-escapes `<` inside the attribute JSON and kses sees no tag.
	 *
	 * The capability is read from the POST AUTHOR, not the current viewer: the
	 * author is who put the markup there, and the check has to give the same
	 * answer for every visitor to the page.
	 *
	 * @param string   $html     Raw markup from a block attribute.
	 * @param int|null $authorId Post author to test; resolved from the current
	 *                           post when omitted.
	 * @return string The markup unchanged, or a wp_kses_post() copy of it.
	 */
	public static function userHtml( $html, $authorId = null )
	{
		if ( ! is_string( $html ) || '' === trim( $html ) ) {
			return '';
		}

		return self::authorCanUnfilteredHtml( $authorId ) ? $html : wp_kses_post( $html );
	}

	/**
	 * Whether the post author may publish unfiltered HTML.
	 *
	 * Fails closed: if the author cannot be resolved - a block rendered
	 * outside the loop, in a template part, or in a widget area - the answer
	 * is no, and the caller sanitizes.
	 */
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

	public static function attributes( $attributes )
	{
		if ( is_string( $attributes ) ) {
			return self::markup( $attributes );
		}

		if ( is_array( $attributes ) ) {
			foreach ( $attributes as $key => $value ) {
				$attributes[ $key ] = self::attributes( $value );
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

<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class BBlocksStyleGenerator
{
	public static $styles = [];
	public static function addStyle($selector, $styles)
	{
		if (array_key_exists($selector, self::$styles)) {
			self::$styles[$selector] = wp_parse_args(self::$styles[$selector], $styles);
		} else {
			self::$styles[$selector] = $styles;
		}
	}
	public static function renderStyle()
	{
		$output = '';
		foreach (self::$styles as $selector => $style) {
			$new = '';
			foreach ($style as $property => $value) {
				if ( '' === $value ) {
					$new .= "$property ;";
				} else {
					$new .= " $property: $value;";
				}
			}
			$output .= "$selector { $new }";
		}
		return $output;
	}
}

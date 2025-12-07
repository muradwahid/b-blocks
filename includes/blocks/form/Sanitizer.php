<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class BBlocksSanitizer {
	public static function sanitize( $schema, $data ) {
		$response_payload = array();
		foreach ( $schema as $key => $type ) {
			if ( isset( $data[ $key ] ) ) {
				switch ( $type ) {
					case 'integer':
						$response_payload[ $key ] = (int) absint( sanitize_text_field( $data[ $key ] ) );
						break;
					case 'string':
						$response_payload[ $key ] = (string) sanitize_text_field( $data[ $key ] );
						break;
					case 'url':
						$response_payload[ $key ] = esc_url_raw( $data[ $key ] );
						break;
					case 'email':
						$response_payload[ $key ] = sanitize_email( $data[ $key ] );
						break;
					case 'textarea':
						$response_payload[ $key ] = sanitize_textarea_field( $data[ $key ] );
						break;
					case 'boolean':
						$response_payload[ $key ] = self::checkbox( $data[ $key ] );
						break;
					default:
						$response_payload[ $key ] = sanitize_text_field( $data[ $key ] );
						break;
				}//end switch
			}//end if
		}//end foreach
		return $response_payload;
	}


	public static function sanitize_array( $array_data ) {
		$array_data = is_array( $array_data ) ? $array_data : json_decode( stripslashes( $array_data ) );
		$boolean = [ 'true', 'false', '1', '0' ];
		if ( is_array( $array_data ) ) {
			foreach ( $array_data as $key => &$value ) {
				if ( is_array( $value ) ) {
					$value = self::sanitize_array( $value );
				} else {
					$value = in_array( $value, $boolean, true ) || is_bool( $value ) ? self::checkbox( $value ) : sanitize_text_field( $value );
				}
			}
		}
		return $array_data;
	}


	public static function checkbox( $boolean ) {
		return (bool) filter_var( sanitize_text_field( $boolean ), FILTER_VALIDATE_BOOLEAN );
	}
}

<?php

class BBlocksFormHelper {

  	public static function get_form_data( $post_id, $block_id, $block_name ) {
		if(!is_numeric($post_id)){
			return [];
		}
		$post_id = intval($post_id);
		$post_content = get_post_field( 'post_content', $post_id );
		if ( ! is_null( $post_content ) ) {
			$blocks = parse_blocks( $post_content );
			if ( is_array( $blocks ) ) {
				return self::get_attributes( $block_id, $block_name, $blocks );
			}
			return [];
		}
		return [];
	}

	public static function get_attributes( $block_id, $block_name, $blocks ) {
		foreach ( $blocks as $block ) {

			if ( ( $block['attrs']['formId'] ?? '' ) === $block_id && ( $block['blockName'] ?? '' ) === $block_name ) {
				return [
					'attributes' => isset($block['attrs']) ? $block['attrs'] : [],
					'innerBlocks'      => isset($block['innerBlocks']) ? self::get_inner_blocks( $block['innerBlocks'] ) : [],
				];
			}

			if ( !isset( $block['innerBlocks'] ) ) {
				return [];
			}

			if (is_array( $block['innerBlocks'] ) && count( $block['innerBlocks'] ) > 0) {
				$data = self::get_attributes(
					$block_id,
					$block_name,
					$block['innerBlocks']
				);
				if ( ! empty( $data ) ) {
					return $data;
				}
			}

			if (isset( $block['blockName'] ) && $block['blockName'] === 'core/template-part' && ! empty( $block['attrs']['slug'] ) ) {
				$part_slug = $block['attrs']['theme'] . '//' . $block['attrs']['slug'];
				$data = self::get_form_data( $part_slug, $block_id, $block_name );
				if ( ! empty( $data ) ) {
					return $data;
				}
			}
		}
		return [];
	}

	public static function get_inner_blocks( $inner_blocks ) {
		return array_map(function ( $inner_block ) {
			$block_data = [
				'blockName' => $inner_block['blockName'],
				'attributes' => $inner_block['attrs'],
			];
			if ( isset($inner_block['innerBlocks']) && count($inner_block['innerBlocks']) > 0 ) {
				$block_data['innerBlocks'] = self::get_inner_blocks( $inner_block['innerBlocks'] );
			}
			return $block_data;
		}, $inner_blocks);
	}

	public static function sort_fields( $blocks, $custom_fields ) {
    
		$fields = [];
		foreach ( $blocks as $block ) {
			$name = $block['attributes']['inputField']['name'] ?? null;
			$inputType = $block['attributes']['inputField']['type'] ?? null;

			if ( $name && isset( $custom_fields[ $name ] ) ) {
				$fields[] = [
					'name' => $name,
					'inputType' => $inputType,
					'value' => $custom_fields[ $name ]
				];
			}
		}

		return $fields;
	}

  	public static function generate_schema( $fields ) {
		$schema = [];
      foreach ( $fields as $field ) {
        if ( isset( $field['name'] ) ) {
          $name = $field['name'];
          $input_type = $field['inputType'] ?? 'text';

          switch ( $input_type ) {
            case 'text':
              $schema[ $name ] = 'string';
              break;
            case 'email':
              $schema[ $name ] = 'email';
              break;
            case 'password':
              $schema[ $name ] = 'string';
              break;
            case 'number':
              $schema[ $name ] = 'number';
              break;
            case 'url':
              $schema[ $name ] = 'url';
              break;
            case 'boolean':
              $schema[ $name ] = 'boolean';
              break;
            case 'textarea':
              $schema[ $name ] = 'textarea';
              break;
            default:
              $schema[ $name ] = 'string';
              break;
          }
        }
      }

      return $schema;
	}

  	public static function get_password_requirements( $blocks ) {
		$requirements = [];

		foreach ( $blocks as $block ) {
			if ( $block['attributes']['inputField']['type'] ?? '' === 'password' ) {
				$requirements = $block['attributes']['password']['options'] ?? [];
				break;
			}
		}

		return $requirements;
	}
	
}
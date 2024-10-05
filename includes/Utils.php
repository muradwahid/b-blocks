<?php
namespace BBlocks\Inc;

class Utils{
	static function isPro(){
		return b_blocks_fs()->is__premium_only() && b_blocks_fs()->can_use_premium_code();
	}
}
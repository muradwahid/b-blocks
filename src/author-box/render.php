<?php
/**
 * Author Box block server-side render.
 *
 * Renders a structured author bio card by resolving the current post's
 * author (or an explicitly chosen WordPress user). When there's no post
 * context (e.g. archive widget or block-pattern preview) it shows a small
 * editor-friendly placeholder instead of fataling.
 *
 * Every URL gets esc_url(); every text node gets esc_html(); the bio is
 * sent through wp_kses_post() so authors can use inline <em>, <strong>,
 * and <a>. Social-network slugs are checked against an explicit
 * allowlist, so even if the saved object somehow contains a stray key it
 * will never reach the markup.
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would
 * cause a "Cannot redeclare function" fatal. All helpers below are
 * inlined as static closures (same pattern as google-map, business-hours).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksAuthorBox';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitizers --------------------------------------------------------

$sanitizeColor = static function ( $color, $fallback ) {
	$color = trim( (string) $color );
	if ( '' === $color ) {
		return $fallback;
	}
	if ( preg_match( '/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^(rgb|rgba|hsl|hsla)\s*\([0-9\s,%.\/]+\)$/i', $color ) ) {
		return $color;
	}
	// Fallback value restricted to safe chars only — no {}, \, <, > which could break CSS context.
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

// Trim by character count without breaking words mid-syllable. Returns
// the input unchanged when $limit <= 0 (callers use 0 to mean "no
// limit") or when the string is already short enough.
$trimByChars = static function ( $text, $limit ) {
	$text = (string) $text;
	if ( $limit <= 0 ) {
		return $text;
	}
	if ( function_exists( 'mb_strlen' ) ) {
		if ( mb_strlen( $text ) <= $limit ) {
			return $text;
		}
		$slice = mb_substr( $text, 0, $limit );
		$lastSpace = function_exists( 'mb_strrpos' ) ? mb_strrpos( $slice, ' ' ) : strrpos( $slice, ' ' );
		if ( false !== $lastSpace && $lastSpace > (int) ( $limit * 0.6 ) ) {
			$slice = mb_substr( $slice, 0, $lastSpace );
		}
		return rtrim( $slice ) . '…';
	}
	if ( strlen( $text ) <= $limit ) {
		return $text;
	}
	$slice = substr( $text, 0, $limit );
	$lastSpace = strrpos( $slice, ' ' );
	if ( false !== $lastSpace && $lastSpace > (int) ( $limit * 0.6 ) ) {
		$slice = substr( $slice, 0, $lastSpace );
	}
	return rtrim( $slice ) . '…';
};

// --- Pull and clamp attributes ----------------------------------------

$layoutRaw = isset( $attributes['layout'] ) ? sanitize_key( $attributes['layout'] ) : 'inline';
$layout    = in_array( $layoutRaw, [ 'inline', 'stacked' ], true ) ? $layoutRaw : 'inline';

$themeRaw  = isset( $attributes['theme'] ) ? sanitize_key( $attributes['theme'] ) : 'classic';
$theme     = in_array( $themeRaw, [ 'classic', 'midnight', 'gradient', 'magazine' ], true ) ? $themeRaw : 'classic';

$alignmentRaw = isset( $attributes['alignment'] ) ? sanitize_key( $attributes['alignment'] ) : 'left';
$alignment    = in_array( $alignmentRaw, [ 'left', 'center', 'right' ], true ) ? $alignmentRaw : 'left';

$nameTagRaw = isset( $attributes['nameTag'] ) ? sanitize_key( $attributes['nameTag'] ) : 'h3';
$nameTag    = in_array( $nameTagRaw, [ 'h2', 'h3', 'h4', 'h5', 'h6', 'p' ], true ) ? $nameTagRaw : 'h3';

$avatarShapeRaw = isset( $attributes['avatarShape'] ) ? sanitize_key( $attributes['avatarShape'] ) : 'circle';
$avatarShape    = in_array( $avatarShapeRaw, [ 'circle', 'rounded', 'square' ], true ) ? $avatarShapeRaw : 'circle';

$showAvatar      = isset( $attributes['showAvatar'] ) ? (bool) $attributes['showAvatar'] : true;
$showName        = isset( $attributes['showName'] ) ? (bool) $attributes['showName'] : true;
$showBio         = isset( $attributes['showBio'] ) ? (bool) $attributes['showBio'] : true;
$showPostCount   = isset( $attributes['showPostCount'] ) ? (bool) $attributes['showPostCount'] : false;
$showAllPostsLnk = isset( $attributes['showAllPostsLink'] ) ? (bool) $attributes['showAllPostsLink'] : true;
$showWebsite     = isset( $attributes['showWebsite'] ) ? (bool) $attributes['showWebsite'] : true;
$showSocial      = isset( $attributes['showSocial'] ) ? (bool) $attributes['showSocial'] : true;

$avatarSize = isset( $attributes['avatarSize'] ) ? (int) $attributes['avatarSize'] : 96;
$avatarSize = max( 32, min( 256, $avatarSize ) );

$bioCharLimit = isset( $attributes['bioCharLimit'] ) ? (int) $attributes['bioCharLimit'] : 240;
$bioCharLimit = max( 0, min( 1000, $bioCharLimit ) );

$socialIconSize = isset( $attributes['socialIconSize'] ) ? (int) $attributes['socialIconSize'] : 18;
$socialIconSize = max( 12, min( 40, $socialIconSize ) );

$gap = isset( $attributes['gap'] ) ? (int) $attributes['gap'] : 20;
$gap = max( 0, min( 80, $gap ) );

$borderWidth = isset( $attributes['borderWidth'] ) ? (int) $attributes['borderWidth'] : 1;
$borderWidth = max( 0, min( 12, $borderWidth ) );

$borderRadius = isset( $attributes['borderRadius'] ) ? (int) $attributes['borderRadius'] : 8;
$borderRadius = max( 0, min( 64, $borderRadius ) );

$paddingRaw = isset( $attributes['padding'] ) && is_array( $attributes['padding'] ) ? $attributes['padding'] : [];
$padTop     = isset( $paddingRaw['top'] ) ? max( 0, min( 96, (int) $paddingRaw['top'] ) ) : 24;
$padRight   = isset( $paddingRaw['right'] ) ? max( 0, min( 96, (int) $paddingRaw['right'] ) ) : 24;
$padBottom  = isset( $paddingRaw['bottom'] ) ? max( 0, min( 96, (int) $paddingRaw['bottom'] ) ) : 24;
$padLeft    = isset( $paddingRaw['left'] ) ? max( 0, min( 96, (int) $paddingRaw['left'] ) ) : 24;

$backgroundColor      = $sanitizeColor( $attributes['backgroundColor'] ?? '', '#f9fafb' );
$textColor            = $sanitizeColor( $attributes['textColor'] ?? '', '#111827' );
$nameColor            = $sanitizeColor( $attributes['nameColor'] ?? '', '' );
$bioColor             = $sanitizeColor( $attributes['bioColor'] ?? '', '' );
$linkColor            = $sanitizeColor( $attributes['linkColor'] ?? '', '#0073aa' );
$borderColor          = $sanitizeColor( $attributes['borderColor'] ?? '', '#e5e7eb' );
$socialIconColor      = $sanitizeColor( $attributes['socialIconColor'] ?? '', '#555555' );
$socialIconHoverColor = $sanitizeColor( $attributes['socialIconHoverColor'] ?? '', '#0073aa' );

// --- Resolve the author (always Auto mode) -----------------------------

$authorIdAttr = isset( $attributes['authorId'] ) ? (int) $attributes['authorId'] : 0;
$resolvedId   = 0;
$user         = null;

if ( $authorIdAttr > 0 ) {
	$resolvedId = $authorIdAttr;
} else {
	$postId = (int) get_the_ID();
	if ( $postId > 0 ) {
		$resolvedId = (int) get_post_field( 'post_author', $postId );
	}
}
if ( $resolvedId > 0 ) {
	$user = get_userdata( $resolvedId );
	if ( ! $user ) {
		$resolvedId = 0;
	}
}

// --- Compose the display data ------------------------------------------

if ( ! $user ) {
	// Out-of-post context: emit a friendly placeholder so the page doesn't
	// silently render an empty card.
	?>
	<div <?php echo get_block_wrapper_attributes( [ 'class' => 'bb-author-box bb-ab-placeholder' ] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<em><?php echo esc_html__( 'Author Box: no post author available in this context.', 'b-blocks' ); ?></em>
	</div>
	<?php
	return;
}

$displayName    = (string) $user->display_name;
$bioRaw         = (string) get_the_author_meta( 'description', $resolvedId );
$website        = (string) get_the_author_meta( 'user_url', $resolvedId );
$avatarUrl      = get_avatar_url( $resolvedId, [ 'size' => $avatarSize * 2 ] );
$authorPostsUrl = get_author_posts_url( $resolvedId );
$postCount      = (int) count_user_posts( $resolvedId, 'post', true );

// Bio: editor stores rich text. We pass through wp_kses_post (already
// applied for manual bio) and then trim by char count.
$bioRendered = wp_kses_post( (string) $bioRaw );
if ( $bioCharLimit > 0 ) {
	// Trim using the plain-text length so character count is meaningful.
	$plain = wp_strip_all_tags( $bioRendered );
	if ( function_exists( 'mb_strlen' ) ? mb_strlen( $plain ) > $bioCharLimit : strlen( $plain ) > $bioCharLimit ) {
		$bioRendered = esc_html( $trimByChars( $plain, $bioCharLimit ) );
	}
}

// --- Social links (allowlisted slugs only) -----------------------------

$socialDefs = [
	'twitter'   => [ 'icon' => 'fa-brands fa-x-twitter', 'label' => __( 'X (Twitter)', 'b-blocks' ) ],
	'facebook'  => [ 'icon' => 'fa-brands fa-facebook-f', 'label' => __( 'Facebook', 'b-blocks' ) ],
	'linkedin'  => [ 'icon' => 'fa-brands fa-linkedin-in', 'label' => __( 'LinkedIn', 'b-blocks' ) ],
	'instagram' => [ 'icon' => 'fa-brands fa-instagram', 'label' => __( 'Instagram', 'b-blocks' ) ],
	'youtube'   => [ 'icon' => 'fa-brands fa-youtube', 'label' => __( 'YouTube', 'b-blocks' ) ],
	'github'    => [ 'icon' => 'fa-brands fa-github', 'label' => __( 'GitHub', 'b-blocks' ) ],
	'mastodon'  => [ 'icon' => 'fa-brands fa-mastodon', 'label' => __( 'Mastodon', 'b-blocks' ) ],
	'website'   => [ 'icon' => 'fa-solid fa-globe', 'label' => __( 'Website', 'b-blocks' ) ],
];

$socialInput = isset( $attributes['socialLinks'] ) && is_array( $attributes['socialLinks'] ) ? $attributes['socialLinks'] : [];

$socialEntries = [];
foreach ( $socialDefs as $slug => $def ) {
	$url = isset( $socialInput[ $slug ] ) ? esc_url_raw( (string) $socialInput[ $slug ] ) : '';
	// For "website", fall back to the resolved author website when empty.
	if ( 'website' === $slug && '' === $url && '' !== $website ) {
		$url = esc_url_raw( $website );
	}
	if ( '' === $url ) {
		continue;
	}
	$socialEntries[] = [
		'slug'  => $slug,
		'url'   => $url,
		'icon'  => $def['icon'],
		'label' => $def['label'],
	];
}

// --- Build per-instance CSS -------------------------------------------

$css  = "#$id { display: block; --bb-ab-icon-hover: $socialIconHoverColor; }";
$css .= "#$id .bb-ab-card { background-color: $backgroundColor; color: $textColor; border: {$borderWidth}px solid $borderColor; border-radius: {$borderRadius}px; padding: {$padTop}px {$padRight}px {$padBottom}px {$padLeft}px; text-align: $alignment; }";
$css .= "#$id .bb-ab-row { display: flex; flex-wrap: wrap; align-items: flex-start; gap: {$gap}px; }";
$css .= "#$id.bb-ab-layout--stacked .bb-ab-row { flex-direction: column; align-items: " . ( 'center' === $alignment ? 'center' : ( 'right' === $alignment ? 'flex-end' : 'flex-start' ) ) . '; }';
$css .= "#$id .bb-ab-avatar { width: {$avatarSize}px; height: {$avatarSize}px; flex: 0 0 auto; overflow: hidden; }";
$css .= "#$id .bb-ab-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }";
if ( 'circle' === $avatarShape ) {
	$css .= "#$id .bb-ab-avatar, #$id .bb-ab-avatar img { border-radius: 50%; }";
} elseif ( 'rounded' === $avatarShape ) {
	$css .= "#$id .bb-ab-avatar, #$id .bb-ab-avatar img { border-radius: 12px; }";
}
$css .= "#$id .bb-ab-content { flex: 1 1 0; min-width: 0; }";
if ( '' !== $nameColor ) {
	$css .= "#$id .bb-ab-name { color: $nameColor; }";
}
if ( '' !== $bioColor ) {
	$css .= "#$id .bb-ab-bio { color: $bioColor; }";
}
$css .= "#$id .bb-ab-bio a, #$id .bb-ab-meta a, #$id .bb-ab-all-posts { color: $linkColor; }";
$css .= "#$id .bb-ab-social { display: inline-flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; padding: 0; list-style: none; }";
$css .= "#$id .bb-ab-social li { margin: 0; padding: 0; }";
$css .= "#$id .bb-ab-social a { display: inline-flex; align-items: center; justify-content: center; width: " . ( $socialIconSize + 14 ) . "px; height: " . ( $socialIconSize + 14 ) . "px; border-radius: 50%; color: $socialIconColor; text-decoration: none; transition: color .15s ease, background-color .15s ease; }";
$css .= "#$id .bb-ab-social a:hover, #$id .bb-ab-social a:focus { color: var(--bb-ab-icon-hover); }";
$css .= "#$id .bb-ab-social i, #$id .bb-ab-social svg { font-size: {$socialIconSize}px; line-height: 1; }";

// Wrapper classes (layout + theme + alignment).
$wrapperClasses = trim( $planClass . ' bb-author-box bb-ab-layout--' . $layout . ' bb-ab-theme--' . $theme . ' bb-ab-align--' . $alignment );

// Aside accessible label.
$asideLabel = sprintf(
	/* translators: %s: author display name */
	__( 'About the author: %s', 'b-blocks' ),
	$displayName
);

?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, stripped of any HTML tags. ?>
	</style>

	<aside class='bb-ab-card' role='complementary' aria-label='<?php echo esc_attr( $asideLabel ); ?>'>
		<div class='bb-ab-row'>
			<?php if ( $showAvatar && '' !== $avatarUrl ) : ?>
				<div class='bb-ab-avatar' aria-hidden='<?php echo esc_attr( $showName ? 'true' : 'false' ); ?>'>
					<img
						src='<?php echo esc_url( $avatarUrl ); ?>'
						alt='<?php echo esc_attr(
							sprintf(
								/* translators: %s: author display name */
								__( 'Avatar of %s', 'b-blocks' ),
								$displayName
							)
						); ?>'
						width='<?php echo esc_attr( (string) $avatarSize ); ?>'
						height='<?php echo esc_attr( (string) $avatarSize ); ?>'
						loading='lazy'
						decoding='async'
					/>
				</div>
			<?php endif; ?>

			<div class='bb-ab-content'>
				<?php if ( $showName && '' !== $displayName ) : ?>
					<?php
					printf(
						'<%1$s class="bb-ab-name">%2$s</%1$s>',
						tag_escape( $nameTag ),
						esc_html( $displayName )
					);
					?>
				<?php endif; ?>

				<?php if ( $showBio && '' !== trim( wp_strip_all_tags( $bioRendered ) ) ) : ?>
					<div class='bb-ab-bio'>
						<?php echo wp_kses_post( $bioRendered ); ?>
					</div>
				<?php endif; ?>

				<?php
				$metaParts = [];
				if ( $showPostCount && $postCount > 0 && '' !== $authorPostsUrl ) {
					$metaParts[] = sprintf(
						'<a href="%1$s" rel="author">%2$s</a>',
						esc_url( $authorPostsUrl ),
						esc_html(
							sprintf(
								/* translators: %d: post count */
								_n( '%d post', '%d posts', $postCount, 'b-blocks' ),
								$postCount
							)
						)
					);
				}
				if ( $showWebsite && '' !== $website ) {
					$metaParts[] = sprintf(
						'<a href="%1$s" target="_blank" rel="noopener noreferrer me">%2$s</a>',
						esc_url( $website ),
						esc_html__( 'Website', 'b-blocks' )
					);
				}
				if ( ! empty( $metaParts ) ) :
					?>
					<div class='bb-ab-meta'>
						<?php echo wp_kses(
							implode( ' · ', $metaParts ),
							[
								'a' => [
									'href'   => true,
									'target' => true,
									'rel'    => true,
								],
							]
						); ?>
					</div>
				<?php endif; ?>

				<?php if ( $showSocial && ! empty( $socialEntries ) ) : ?>
					<ul class='bb-ab-social' aria-label='<?php echo esc_attr__( 'Social profiles', 'b-blocks' ); ?>'>
						<?php foreach ( $socialEntries as $entry ) : ?>
							<li>
								<a
									href='<?php echo esc_url( $entry['url'] ); ?>'
									target='_blank'
									rel='noopener noreferrer me'
									aria-label='<?php echo esc_attr(
										sprintf(
											/* translators: 1: author name, 2: social network */
											__( "%1\$s on %2\$s", 'b-blocks' ),
											$displayName,
											$entry['label']
										)
									); ?>'
								>
									<i class='<?php echo esc_attr( $entry['icon'] ); ?>' aria-hidden='true'></i>
									<span class='screen-reader-text'><?php echo esc_html( $entry['label'] ); ?></span>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>

				<?php if ( $showAllPostsLnk && '' !== $authorPostsUrl && ! $showPostCount ) : ?>
					<p class='bb-ab-all-posts-wrap'>
						<a class='bb-ab-all-posts' href='<?php echo esc_url( $authorPostsUrl ); ?>' rel='author'>
							<?php echo esc_html( '' !== ( $attributes['allPostsLinkLabel'] ?? '' ) ? (string) $attributes['allPostsLinkLabel'] : __( 'View all posts', 'b-blocks' ) ); ?>
						</a>
					</p>
				<?php endif; ?>
			</div>
		</div>
	</aside>
</div>

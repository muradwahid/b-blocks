<?php

namespace BBlocks\Inc;

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! class_exists( __NAMESPACE__ . '\BBlocks_PromoBanner' ) ) {

    class BBlocks_PromoBanner {
        const DISMISSED_KEY   = 'bblocks_promo_banner_dismissed_permanent';
        const EXPIRATION_DATE = '2026-12-05 23:59:59';

        /** Target landing URL */
        const COUPON_URL      = 'https://bblockswp.com/pricing/?utm_source=admin&utm_medium=dashboard&utm_campaign=bfcm2026';

        /** Flag to prevent duplicate rendering */
        private $rendered = false;

        public function __construct() {
            add_action( 'admin_notices',                         [ $this, 'render' ], 5 );
            add_action( 'all_admin_notices',                     [ $this, 'render' ], 5 );
            add_action( 'admin_head',                            [ $this, 'enqueue_styles' ] );
            add_action( 'admin_footer',                          [ $this, 'enqueue_scripts' ] );
            add_action( 'wp_ajax_bblocks_dismiss_promo_banner',  [ $this, 'ajax_dismiss' ] );
        }

        /* ------------------------------------------------------------------ */
        /*  Screen, Expiration, Dismissal & Pro Helpers                       */
        /* ------------------------------------------------------------------ */

        /**
         * Check if the current admin screen belongs to bBlocks (admin.php?page=b-blocks*)
         */
        private function is_plugin_screen(): bool {
            // 1. Query string page (admin.php?page=b-blocks, b-blocks-pricing, b-blocks-account ...)
            if ( isset( $_GET['page'] ) && 0 === strpos( sanitize_key( wp_unslash( $_GET['page'] ) ), 'b-blocks' ) ) {
                return true;
            }

            // 2. Screen object id checking
            $screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
            if ( $screen && isset( $screen->id ) && false !== strpos( $screen->id, 'b-blocks' ) ) {
                return true;
            }

            return false;
        }

        /**
         * Check if current date is past December 5, 2026
         */
        private function is_expired(): bool {
            $expiry_timestamp = strtotime( self::EXPIRATION_DATE );
            $current_time     = time();
            return ( $current_time > $expiry_timestamp );
        }

        /**
         * Check if current user has permanently dismissed the banner
         */
        private function is_dismissed(): bool {
            return (bool) get_user_meta( get_current_user_id(), self::DISMISSED_KEY, true );
        }

        /**
         * Check if the plugin has active Premium / Pro features
         * Returns true if user is Premium (banner will NOT show)
         * Returns false if user is Free (banner WILL show)
         */
        private function is_premium(): bool {
            // Same checker the bBlocks dashboard uses (Freemius premium build + active license)
            return function_exists( 'b_blocks_fs' ) && class_exists( __NAMESPACE__ . '\Utils' ) && Utils::isPro();
        }

        /**
         * Determine if the banner should be omitted
         */
        private function should_skip(): bool {
            // 1. Only show inside bBlocks admin screens
            if ( ! $this->is_plugin_screen() ) {
                return true;
            }

            // 2. Automatically remove after Dec 5, 2026
            if ( $this->is_expired() ) {
                return true;
            }

            // 3. Never display again once dismissed by the user (bypass with ?show_promo=1 for testing)
            if ( ! isset( $_GET['show_promo'] ) && $this->is_dismissed() ) {
                return true;
            }

            // 4. If user is Premium -> do NOT show; If NOT Premium -> SHOW (bypass with ?show_promo=1 for testing)
            if ( ! isset( $_GET['show_promo'] ) && $this->is_premium() ) {
                return true;
            }

            return false;
        }

        /* ------------------------------------------------------------------ */
        /*  CSS Styles (bBlocks dashboard color convention)                   */
        /* ------------------------------------------------------------------ */

        public function enqueue_styles(): void {
            if ( $this->should_skip() ) { return; }
            ?>
            <style id="bblocks-promo-banner-css">
            /* Specificity override to prevent theme/dashboard suppression */
            body #wpbody-content #bblocks-promo-banner,
            body .bPlDashboard #bblocks-promo-banner,
            #bblocks-promo-banner {
                --bblocks-primary:        var(--bpl-dashboard-primary-color, #8c74fd);
                --bblocks-primary-rgb:    var(--bpl-dashboard-primary-color-rgb, 140, 116, 253);
                --bblocks-secondary:      var(--bpl-dashboard-secondary-color, #4017f2);
                --bblocks-secondary-rgb:  var(--bpl-dashboard-secondary-color-rgb, 64, 23, 242);
                --bblocks-dark:           var(--bpl-dashboard-title-color, #070127);
                --bblocks-text:           var(--bpl-dashboard-content-color, #1b2e4b);
                --bblocks-text-rgb:       var(--bpl-dashboard-content-color-rgb, 27, 46, 75);
                --bblocks-border:         #eef0f5;

                background: #ffffff !important;
                border: 1px solid var(--bblocks-border) !important;
                border-radius: 8px !important;
                box-shadow: 0 2px 10px rgba(var(--bblocks-secondary-rgb), 0.06) !important;
                display: flex !important;
                align-items: stretch !important;
                min-height: 84px !important;
                height: auto !important;
                width: auto !important;
                max-width: 100% !important;
                overflow: hidden !important;
                position: relative !important;
                left: auto !important;
                top: auto !important;
                visibility: visible !important;
                opacity: 1 !important;
                margin: 16px 20px 16px 0 !important;
                padding: 0 !important;
                font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
                box-sizing: border-box !important;
                animation: bblocksBannerSlide .3s ease both !important;
            }
            @keyframes bblocksBannerSlide {
                from { opacity: 0; transform: translateY(-6px); }
                to   { opacity: 1; transform: translateY(0); }
            }

            /* Left Brand Ribbon Block */
            #bblocks-promo-banner .bblocks-brand-ribbon {
                width: 140px;
                min-width: 140px;
                background: linear-gradient(135deg, var(--bblocks-primary) 0%, var(--bblocks-secondary) 100%);
                color: #ffffff;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 12px 10px;
                gap: 6px;
                flex-shrink: 0;
            }
            #bblocks-promo-banner .bblocks-brand-ribbon img {
                width: 38px;
                height: 38px;
                object-fit: contain;
                filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.25));
                border-radius: 4px;
            }
            #bblocks-promo-banner .bblocks-brand-ribbon .bblocks-ribbon-title {
                font-size: 10.5px;
                font-weight: 800;
                letter-spacing: .7px;
                text-transform: uppercase;
                color: #ffffff;
                text-align: center;
                line-height: 1.2;
            }

            /* Main Content Zone */
            #bblocks-promo-banner .bblocks-content-zone {
                flex: 1;
                padding: 14px 22px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                flex-wrap: wrap;
                padding-right: 38px;
            }

            /* Left Text Stack */
            #bblocks-promo-banner .bblocks-text-stack {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            #bblocks-promo-banner .bblocks-headline {
                font-size: 15px;
                font-weight: 700;
                color: var(--bblocks-dark);
                display: flex;
                align-items: center;
                gap: 8px;
                margin: 0;
                line-height: 1.3;
            }
            #bblocks-promo-banner .bblocks-discount-chip {
                background: rgba(var(--bblocks-primary-rgb), 0.1);
                color: var(--bblocks-secondary);
                border: 1px solid rgba(var(--bblocks-primary-rgb), 0.3);
                font-size: 11px;
                font-weight: 800;
                padding: 2.5px 9px;
                border-radius: 12px;
                letter-spacing: .3px;
                text-transform: uppercase;
                white-space: nowrap;
            }
            #bblocks-promo-banner .bblocks-description {
                font-size: 13px;
                color: var(--bblocks-text);
                line-height: 1.5;
                margin: 4px 0 8px 0;
                max-width: 780px;
                opacity: 0.9;
            }

            /* Feature Checklist */
            #bblocks-promo-banner .bblocks-feature-chips {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 12px;
                color: rgba(var(--bblocks-text-rgb), 0.72);
                flex-wrap: wrap;
            }
            #bblocks-promo-banner .bblocks-feature-chips span {
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }
            #bblocks-promo-banner .bblocks-feature-chips .check-icon {
                color: var(--bblocks-secondary);
                font-weight: 800;
            }

            /* CTA Action Button */
            #bblocks-promo-banner .bblocks-btn-cta {
                background: linear-gradient(135deg, var(--bblocks-primary) 0%, var(--bblocks-secondary) 100%);
                color: #ffffff !important;
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 12.5px;
                font-weight: 600;
                text-decoration: none !important;
                box-shadow: 0 3px 10px rgba(var(--bblocks-secondary-rgb), 0.28);
                transition: filter .15s ease, transform .15s ease, box-shadow .15s ease;
                white-space: nowrap;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            #bblocks-promo-banner .bblocks-btn-cta:hover {
                filter: brightness(0.92);
                transform: translateY(-1px);
                box-shadow: 0 5px 16px rgba(var(--bblocks-secondary-rgb), 0.4);
            }

            /* Dismiss Button (×) */
            #bblocks-promo-banner .bblocks-banner-dismiss-btn {
                position: absolute;
                top: 8px;
                right: 8px;
                background: none;
                border: none;
                cursor: pointer;
                color: rgba(var(--bblocks-text-rgb), 0.4);
                font-size: 20px;
                line-height: 1;
                padding: 6px;
                border-radius: 4px;
                transition: color .15s ease, background-color .15s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
            }
            #bblocks-promo-banner .bblocks-banner-dismiss-btn:hover {
                color: var(--bblocks-dark);
                background-color: rgba(var(--bblocks-text-rgb), 0.06);
            }

            /* Responsive */
            @media (max-width: 960px) {
                #bblocks-promo-banner .bblocks-brand-ribbon {
                    width: 110px;
                    min-width: 110px;
                }
            }
            @media (max-width: 782px) {
                body #wpbody-content #bblocks-promo-banner,
                #bblocks-promo-banner {
                    flex-direction: column !important;
                    align-items: stretch !important;
                    margin: 10px 10px 10px 0 !important;
                }
                #bblocks-promo-banner .bblocks-brand-ribbon {
                    width: 100%;
                    flex-direction: row;
                    justify-content: flex-start;
                    padding: 8px 16px;
                }
                #bblocks-promo-banner .bblocks-content-zone {
                    flex-direction: column;
                    align-items: flex-start;
                    padding: 14px 16px;
                }
            }
            </style>
            <?php
        }

        /* ------------------------------------------------------------------ */
        /*  Permanent Dismiss Script (AJAX + Animation)                       */
        /* ------------------------------------------------------------------ */

        public function enqueue_scripts(): void {
            if ( $this->should_skip() ) { return; }
            $dismiss_nonce = wp_create_nonce( 'bblocks_dismiss_promo' );
            $ajax_url      = admin_url( 'admin-ajax.php' );
            ?>
            <script id="bblocks-promo-banner-js">
            (function () {
                var btn = document.getElementById('bblocks-banner-close');
                if (!btn) return;
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    var banner = document.getElementById('bblocks-promo-banner');
                    if (banner) {
                        banner.style.transition = 'opacity .25s ease, transform .25s ease';
                        banner.style.opacity    = '0';
                        banner.style.transform  = 'translateY(-6px)';
                        setTimeout(function() { banner.remove(); }, 260);
                    }
                    var fd = new FormData();
                    fd.append('action', 'bblocks_dismiss_promo_banner');
                    fd.append('nonce',  '<?php echo esc_js( $dismiss_nonce ); ?>');
                    fetch('<?php echo esc_url( $ajax_url ); ?>', {
                        method: 'POST',
                        credentials: 'same-origin',
                        body: fd
                    });
                });
            })();
            </script>
            <?php
        }

        /* ------------------------------------------------------------------ */
        /*  Render Single Banner                                              */
        /* ------------------------------------------------------------------ */

        public function render(): void {
            if ( $this->rendered ) { return; }
            if ( $this->should_skip() ) { return; }
            $this->rendered = true;

            $coupon_url = esc_url( self::COUPON_URL );
            $icon_url   = esc_url( 'https://ps.w.org/b-blocks/assets/icon-128x128.png' );
            ?>
            <div id="bblocks-promo-banner" class="bblocks-promo-banner">

                <!-- Left Brand Ribbon -->
                <div class="bblocks-brand-ribbon">
                    <img src="<?php echo $icon_url; ?>" alt="bBlocks" />
                    <span class="bblocks-ribbon-title">bBlocks</span>
                </div>

                <!-- Main Content Zone -->
                <div class="bblocks-content-zone">
                    <div class="bblocks-text-stack">
                        <div class="bblocks-headline">
                            <span><?php esc_html_e( 'bBlocks Biggest Black Friday Sale is Live', 'b-blocks' ); ?></span>
                            <span class="bblocks-discount-chip"><?php esc_html_e( 'Flat 45% OFF!', 'b-blocks' ); ?></span>
                        </div>
                        <p class="bblocks-description">
                            <?php esc_html_e( 'Upgrade to Pro today at an exclusive Black Friday price and unlock premium blocks, premium templates, and pro features of every block.', 'b-blocks' ); ?>
                        </p>
                        <div class="bblocks-feature-chips">
                            <span><strong class="check-icon">✓</strong> <?php esc_html_e( 'Premium Blocks', 'b-blocks' ); ?></span>
                            <span><strong class="check-icon">✓</strong> <?php esc_html_e( 'Premium Templates', 'b-blocks' ); ?></span>
                            <span><strong class="check-icon">✓</strong> <?php esc_html_e( 'Pro Block Features', 'b-blocks' ); ?></span>
                            <span><strong class="check-icon">✓</strong> <?php esc_html_e( 'Priority Email Support', 'b-blocks' ); ?></span>
                            <span><strong class="check-icon">✓</strong> <?php esc_html_e( 'Regular New Pro Blocks', 'b-blocks' ); ?></span>
                        </div>
                    </div>

                    <!-- CTA Button -->
                    <a href="<?php echo $coupon_url; ?>" target="_blank" rel="noopener noreferrer" class="bblocks-btn-cta">
                        <?php esc_html_e( 'Unlock PRO Features →', 'b-blocks' ); ?>
                    </a>
                </div>

                <!-- Dismiss Button -->
                <button id="bblocks-banner-close"
                        class="bblocks-banner-dismiss-btn"
                        title="<?php esc_attr_e( 'Dismiss', 'b-blocks' ); ?>"
                        aria-label="<?php esc_attr_e( 'Dismiss banner', 'b-blocks' ); ?>">
                    &times;
                </button>

            </div>
            <?php
        }

        /* ------------------------------------------------------------------ */
        /*  AJAX Handler: Permanent Dismissal                                 */
        /* ------------------------------------------------------------------ */

        public function ajax_dismiss(): void {
            check_ajax_referer( 'bblocks_dismiss_promo', 'nonce' );
            update_user_meta( get_current_user_id(), self::DISMISSED_KEY, 1 );
            wp_send_json_success();
        }
    }

    new BBlocks_PromoBanner();
}

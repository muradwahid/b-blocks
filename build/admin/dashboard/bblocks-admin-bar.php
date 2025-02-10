<?php
/**
 * Plugin Name:       B Blocks Admin Bar
 * Plugin URI:        https://yourwebsite.com/plugin-uri
 * Description:       Adds custom admin bar functionality for B Blocks.
 * Version:           1.0.0
 * Author:            bPlugins
 * Author URI:        https://bplugins.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       bblocks-admin-bar
 * Domain Path:       /languages
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Load the plugin functionality.
if ( ! class_exists( 'BBLOCKS_ADMIN_BAR' ) ) {

    class BBLOCKS_ADMIN_BAR {

        public function __construct() {
            $this->define_constants();
            add_action( 'init', [ $this, 'register_assets' ] );
            add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_assets' ] );
            add_action( 'admin_menu', [ $this, 'register_admin_menu' ] );
            add_action('wp_ajax_bblocks_identify_disable_block', [$this, 'bblocks_identify_disable_block']);
            add_action('wp_ajax_activated_block', [$this, 'activated_block']);
            add_action('admin_notices', [$this, 'display_activation_notice']);
            add_action('wp_ajax_get_active_plugins', [$this, 'get_active_plugins']);
            add_action('wp_ajax_get_popular_plugins', [$this, 'get_popular_plugins']);
        }

        private function define_constants() {
            define( 'BBLOCKS_VERSION', '1.0.0' );
            define( 'BBLOCKS_FILE', __FILE__ );
            define( 'BBLOCKS_PATH', __DIR__ );
            define( 'BBLOCKS_URL', plugins_url( '', BBLOCKS_FILE ) );
            define( 'BBLOCKS_DIST_URL', BBLOCKS_URL . '/dist' );
        }

        public function get_popular_plugins () {

            if (!function_exists('plugins_api')) {
                require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
            }
            
            $cached_plugins = plugins_api('query_plugins', array(
                    'author' => 'bplugins',
                    'per_page' => 100
                ));

            wp_send_json_success($cached_plugins->plugins); 
        }

        public function get_active_plugins() {
            if (!isset($_GET['nonce']) || !wp_verify_nonce(sanitize_text_field($_GET['nonce']), 'wp_rest')) {
                wp_send_json_error(['message' => 'Invalid nonce or request.'], 400);
            }
        
            // Get the list of all installed plugins
            if (!function_exists('get_plugins')) {
                include_once ABSPATH . '/wp-admin/includes/plugin.php';
            }
        
            $installed_plugins = get_plugins();
        
            // Return the plugin basenames as an array
            $installed_plugin_slugs = array_keys($installed_plugins);
        
            wp_send_json_success($installed_plugin_slugs);
        }
        
        public function activated_block() {
            // Verify nonce
            if (!isset($_GET['nonce']) || !wp_verify_nonce(sanitize_text_field($_GET['nonce']), 'wp_rest')) {
                wp_send_json_error(['message' => 'Invalid nonce or request.'], 400);
            }

            $plugin_name = sanitize_text_field($_GET['plugin_name']) ?? false;
        
            include_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
            include_once ABSPATH . 'wp-admin/includes/plugin-install.php';
        
            try {
                // Fetch plugin information
                $api = plugins_api('plugin_information', ['slug' => $plugin_name, 'fields' => ['sections' => false]]);
                if (is_wp_error($api)) {
                    wp_send_json_error(['message' => 'Failed to fetch plugin information.']);
                }
        
                // Suppress unexpected output
                ob_start();
                $upgrader = new Plugin_Upgrader();
                $result = $upgrader->install($api->download_link);
                ob_end_clean();
            
                $plugin_slug = $plugin_name.'/'.$plugin_name.'.php';

                if ($result) {
                    // Set transient to show notice
                    set_transient('bblocks_show_activation_notice', $plugin_slug, 1000000); // Valid for 60 seconds
                    $redirect_url = admin_url('plugins.php?plugin_status=all');
                    wp_send_json_success(['message' => 'Plugin installed successfully.', 'redirectUrl' => $redirect_url]);

                } else {
                    wp_send_json_error(['message' => 'Plugin installation failed.']);
                }
            } catch (Exception $e) {
                wp_send_json_error(['message' => 'An unexpected error occurred: ' . $e->getMessage()]);
            }
        }

        public function display_activation_notice() {
            // Check if transient is set
            $plugin_slug = get_transient('bblocks_show_activation_notice');

            $first_part = explode("/", $plugin_slug)[0];
            $cleaned_string = str_replace("-", " ", $first_part);
            
            if ($plugin_slug) {
                // Remove transient after displaying the notice
                delete_transient('bblocks_show_activation_notice');
        
                // Generate activation URL
                $activation_url = wp_nonce_url(
                    admin_url('plugins.php?action=activate&plugin=' . $plugin_slug),
                    'activate-plugin_' . $plugin_slug
                );
        
                // Display notice with activation button
                ?>
                <div class="notice notice-success is-dismissible bblocks-notice">
                    <p><?php esc_html_e(" $cleaned_string plugin was successfully installed.", 'bblocks-admin-bar'); ?></p>
                    <p>
                        <a href="<?php echo esc_url($activation_url); ?>" class="button button-primary">
                            <?php esc_html_e('Activate Plugin', 'bblocks-admin-bar'); ?>
                        </a>
                    </p>
                </div>
                <?php
            }
        }

        public function bblocks_identify_disable_block(){
            
            // if(!wp_verify_nonce(sanitize_text_field($_POST['nonce']), 'wp_rest')){
            //     wp_send_json_error('invalid request');
            // }
    
            $data = json_decode(wp_kses_stripslashes(sanitize_text_field($_POST['data'])), true);


            $db_data = get_option('bblocks_identify_disable_block', []);
            if(!$data && $db_data){
                wp_send_json_success($db_data);
            }
    
            update_option('bblocks_identify_disable_block', $data);
    
            wp_send_json_success($data);
        }
        
        public function register_assets() {

            wp_enqueue_script('bblocks-admin-bar', BBLOCKS_PATH . '/admin-bar.js', [], BBLOCKS_VERSION, true);

            wp_register_script( 'adminScript', BBLOCKS_DIST_URL . '/admin-script.js', [ 'react', 'react-dom', 'wp-components', 'wp-i18n', 'wp-api', 'wp-util' , 'bblocks-admin-bar' ], BBLOCKS_VERSION, true);

            wp_register_style( 'adminStyle', BBLOCKS_DIST_URL . '/admin-style.css', [], BBLOCKS_VERSION, 'all');


            wp_localize_script('adminScript', 'pluginAction', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('wp_rest'),
            ]);
        }

        public function enqueue_admin_assets( $hook ) {
            // if ( $hook === 'toplevel_page_bblocks-dashboard' || $hook === 'bblocks-dashboard_page_bblocks-submenu' ) {
                wp_enqueue_script( 'adminScript' );
                wp_enqueue_style( 'adminStyle' );
            // }
        }

        public function register_admin_menu() {
            add_menu_page(
                __( 'Dashboard', 'bblocks-admin-bar' ),
                __( 'Dashboard', 'bblocks-admin-bar' ),
                'manage_options',
                'bblocks-dashboard',
                [ $this, 'render_dashboard_page' ],
                'dashicons-admin-generic',
                26
            );

        }

        public function render_dashboard_page() {
            echo '<div id="bplAdminHelpPage">';
            echo '</div>';
        } 
    }

    new BBLOCKS_ADMIN_BAR();
}
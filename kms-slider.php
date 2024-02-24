<?php
/**
 * Plugin Name: KMS Slider
 * 
 * Description: This plugin creates and styles KMS Slider.
 * Version: 1.0.0
 * Author: Beer City Bands
 * Author URI: https://beercitybands.com/
 * 
 * @link https://codex.wordpress.org/Plugin_API
 *
 * @since 1.0.0
 */

define( 'KMS_SLIDER_VERSION', '1.0.0' );
define( 'KMS_SLIDER_PATH', plugin_dir_path( __FILE__ ) );
define( 'KMS_SLIDER_URL', plugin_dir_url( __FILE__ ) );

if( ! function_exists( 'kms_slider_enqueues' ) ) {
	function kms_slider_enqueues() {
		wp_enqueue_script( 'kms-slider-scripts-js',
			KMS_SLIDER_URL . 'scripts.js',
			array('jquery'),
			KMS_SLIDER_VERSION,
			true
		);

		wp_enqueue_style( 'kms-slider-style-css',
			KMS_SLIDER_URL . 'style.css',
			array(),
			KMS_SLIDER_VERSION,
		);
	}
	add_action( 'wp_enqueue_scripts', 'kms_slider_enqueues', 12 );	
}

<?php

// call product review app scripts with validation
function include_react_product_review_app() {
	wp_enqueue_style( 'prefix-style', '/wp-content/product-review-app/static/css/main.0dd4bdf8.chunk.css' );
  
	// add the JS file to the footer - true as the last parameter
	wp_register_script( 'product-review-app-chunk', '/wp-content/product-review-app/static/js/2.7e8e0936.chunk.js' , array(),  '0.0.1', true );
	wp_register_script( 'product-review-app-main', '/wp-content/product-review-app/static/js/main.b42a544c.chunk.js' , array(),  '0.0.1', true );
	wp_register_script( 'product-review-app-runtime', '/wp-content/product-review-app/static/js/runtime-main.bea3a7aa.js' , array(),  '0.0.1', true );
	$data = array( 
		'api_nonce'   => wp_create_nonce( 'wp_rest' )
	);
	wp_localize_script( 'product-review-app-main', 'andy_app_nonce_validation', $data );
	wp_enqueue_script( 'product-review-app-runtime' );
	wp_enqueue_script( 'product-review-app-chunk' );
	wp_enqueue_script( 'product-review-app-main' );
  }
  
  add_action( 'wp_enqueue_scripts', 'include_react_product_review_app' );
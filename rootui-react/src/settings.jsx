/* eslint-disable */
/**
 * App Settings
 */
const settings = {
    night_mode: true,
    spotlight_mode: false,
    show_section_lines: true,
    sidebar_dark: false,
    sidebar_static: true,
    sidebar_small: false,
    sidebar_effect: 'shrink',
    nav: true,
    nav_dark: false,
    nav_logo_path: require( '../../common-assets/images/logo.png' ),
    nav_logo_white_path: require( '../../common-assets/images/logo.png' ),
    nav_logo_width: '80px',
    nav_logo_url: '/',
    nav_align: 'left',
    nav_expand: 'lg',
    nav_sticky: true,
    nav_autohide: true,
    nav_container_fluid: false,
    home_url: '/',
    navigation: {
    },
    navigation_sidebar: {
        "/": {
            label: 'Get Started',
            name: 'Explore',
            icon: "compass",
        },
        "/customimages": {
            name: "images",
            icon: "image",
        },     
        "/saved": {
            name: "Saved",
            icon: "heart",
        },
    },
};

/* Parse GET variables to change initial settings */
const $_GET = {};
window.location.href.replace( /[?&]+([^=&]+)=([^&]*)/gi, ( a, name, value ) => {
    $_GET[ name ] = value;
} );

Object.keys( $_GET ).forEach( ( name ) => {
    const isTrue = $_GET[ name ] === '1';

    switch ( name ) {
    case 'setting-night-mode':
        settings.night_mode = isTrue;
        break;
    case 'setting-show-section-lines':
        settings.show_section_lines = isTrue;
        break;
    case 'setting-sidebar-small':
        settings.sidebar_small = isTrue;
        break;
    case 'setting-sidebar-dark':
        settings.sidebar_dark = isTrue;
        break;
    case 'setting-nav-dark':
        settings.nav_dark = isTrue;
        break;
    // no default
    }
} );

export default settings;

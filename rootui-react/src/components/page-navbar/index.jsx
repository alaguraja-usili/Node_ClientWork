/**
 * External Dependencies
 */
import React, { Component } from 'react';
import classnames from 'classnames/dedupe';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Collapse } from 'reactstrap';

/**
 * Internal Dependencies
 */
import {
    updateAuth as actionUpdateAuth,
    updateSettings as actionUpdateSettings,
} from '../../actions';
import Dropdown from '../bs-dropdown';
import Icon from '../icon';
// import FancyBox from '../fancybox';
// import PagePopupSearch from '../page-popup-search';
// import Messenger from '../messenger';
import { initNavbar } from '../../../../common-assets/js/rootui-parts/initNavbar';
import TitleBar from './components/TitleBar';

const $ = window.jQuery;

window.RootUI.initNavbar = initNavbar;

/**
 * Component
 */
class PageNavbar extends Component {
    constructor( props ) {
        super( props );

        window.RootUI.initNavbar();

        this.state = {
            mobileMenuShow: false,
        };

        this.logOut = this.logOut.bind( this );
        this.renderSubmenus = this.renderSubmenus.bind( this );
        this.renderRightMenuItems = this.renderRightMenuItems.bind( this );
    }

    componentDidMount() {
        $( document ).on( 'keydown.rui-navbar', ( e ) => {
            const {
                mobileMenuShow,
            } = this.state;

            if ( mobileMenuShow && e.keyCode === 27 ) {
                this.setState( {
                    mobileMenuShow: ! mobileMenuShow,
                } );
            }
        } );
    }

    componentWillUnmount() {
        $( document ).off( 'keydown.rui-navbar' );
    }

    logOut() {
        const {
            updateAuth,
        } = this.props;

        updateAuth( {
            token: '',
        } );
    }

    renderSubmenus( nav, isMobile, level = 1 ) {
        return Object.keys( nav ).map( ( url ) => {
            const data = nav[ url ];

            const isActive = window.location.hash === `#${ url }`;

            const LinkContent = data.name ? (
                <>
                    { data.icon ? (
                        <>
                            <Icon name={ data.icon } />
                            <span>{ data.name }</span>
                            <span className={ data.sub ? 'rui-dropdown-circle' : 'rui-nav-circle' } />
                        </>
                    ) : (
                        data.name
                    ) }
                </>
            ) : '';

            return (
                <React.Fragment key={ `${ url }-${ data.name }` }>
                    { data.sub ? (
                        <Dropdown tag="li" className={ classnames( isActive ? 'active' : '' ) } direction={ level === 1 ? 'up' : 'right' } openOnHover={ ! isMobile } showTriangle>
                            <Dropdown.Toggle tag="a" href="#" className="dropdown-item">
                                { LinkContent }
                            </Dropdown.Toggle>
                            <Dropdown.Menu tag="ul" className="nav dropdown-menu">
                                { this.renderSubmenus( data.sub, isMobile, level + 1 ) }
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <li className={ classnames( 'nav-item', isActive ? 'active' : '' ) }>
                            <Link
                                to={ data.sub ? '#' : url }
                                className="nav-link"
                            >
                                { LinkContent }
                            </Link>
                        </li>
                    ) }
                </React.Fragment>
            );
        } );
    }

    renderRightMenuItems( ) {
        return <TitleBar />
    }

    render() {
        const {
            settings,
        } = this.props;

        const {
            mobileMenuShow,
        } = this.state;

        return (
            <>
                { /* Nav Menu */ }
                <nav className={
                    classnames(
                        'rui-navbar rui-navbar-top',
                        settings.nav_dark ? 'rui-navbar-dark' : '',
                        settings.nav_sticky ? 'rui-navbar-sticky' : '',
                        settings.nav_fixed ? 'rui-navbar-fixed' : '',
                        settings.nav_expand ? `rui-navbar-expand-${ settings.nav_expand }` : '',
                    )
                } style={ { WebkitAppRegion: "drag", margin: "3px", paddingRight: 0 } }>
                    <div className="rui-navbar-brand" >
                        { settings.nav_logo_path ? (
                            <Link to={ settings.nav_logo_url } className="rui-navbar-logo">
                                <img src={ settings.night_mode || settings.nav_dark ? settings.nav_logo_white_path : settings.nav_logo_path } alt="" width={ settings.nav_logo_width } />
                            </Link>
                        ) : '' }

                        <button className="yay-toggle rui-yaybar-toggle" type="button" style={ { 
                            WebkitAppRegion: "no-drag" } }>
                            <span />
                        </button>
                    </div>
                    <div style={ { marginRight: 0 } } className={ `container${ settings.nav_container_fluid ? '-fluid' : '' }` }>
                        <div className="rui-navbar-content" style={ { paddingTop: 0 } }>
                            <ul className="nav">
                                { this.renderSubmenus( settings.navigation ) }
                            </ul>
                            <ul className="nav rui-navbar-right">
                                { this.renderRightMenuItems() }
                            </ul>
                        </div>
                    </div>
                </nav>

                { /* Mobile Menu */ }
                <nav className={
                    classnames(
                        'rui-navbar rui-navbar-mobile',
                        settings.nav_dark ? 'rui-navbar-dark' : '',
                        settings.nav_expand ? `rui-navbar-expand-${ settings.nav_expand }` : '',
                        mobileMenuShow ? 'rui-navbar-show' : '',
                    )
                }
                >
                    <div className="rui-navbar-head">
                        { ! mobileMenuShow ? (
                            <button className="rui-yaybar-toggle rui-yaybar-toggle-inverse yay-toggle" type="button" aria-label="Toggle side navigation">
                                <span />
                            </button>
                        ) : '' }
                        { settings.nav_logo_path ? (
                            <Link to={ settings.nav_logo_url } className="rui-navbar-logo mr-auto">
                                <img src={ settings.night_mode || settings.nav_dark ? settings.nav_logo_white_path : settings.nav_logo_path } alt="" width={ settings.nav_logo_width } />
                            </Link>
                        ) : '' }
                    </div>
                    <Collapse isOpen={ mobileMenuShow } className="navbar-collapse rui-navbar-collapse">
                        <div className="rui-navbar-content">
                            <ul className="nav">
                                { this.renderSubmenus( settings.navigation, true ) }
                                { this.renderRightMenuItems( true ) }
                            </ul>
                        </div>
                    </Collapse>
                </nav>
                <div
                    className="rui-navbar-bg"
                    onClick={ () => {
                        this.setState( {
                            mobileMenuShow: ! mobileMenuShow,
                        } );
                    } }
                    onKeyUp={ () => {} }
                    role="button"
                    tabIndex={ 0 }
                />
            </>
        );
    }
}

export default connect( ( { settings } ) => (
    {
        settings,
    }
), {
    updateAuth: actionUpdateAuth,
    updateSettings: actionUpdateSettings,
} )( PageNavbar );

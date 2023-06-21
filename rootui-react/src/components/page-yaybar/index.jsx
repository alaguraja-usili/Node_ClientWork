/* eslint-disable */
/**
 * Styles
 */
import './style.scss';

/**
 * External Dependencies
 */
import React, { Component } from 'react';
import classnames from 'classnames/dedupe';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
// import { Row, Col } from 'reactstrap';
const { ipcRenderer } = window.require('electron'); 

/**
 * Internal Dependencies
 */
import '../../../../common-assets/js/yaybar/yaybar';
import { initPluginYaybar } from '../../../../common-assets/js/rootui-parts/initPluginYaybar';
// import Dropdown from '../bs-dropdown';
import Icon from '../icon';
import { Trans } from 'react-i18next';

import { updateAuth as actionUpdateAuth } from '../../actions';

window.RootUI.initPluginYaybar = initPluginYaybar;

/**
 * Component
 */
class PageYaybar extends Component {

    
    constructor( props ) {
        super( props );

        this.renderSubmenus = this.renderSubmenus.bind( this );
        this.logOut = this.logOut.bind( this );
    }

    componentDidMount() {
        window.RootUI.initPluginYaybar();
    }

    logOut() {
        const {
            updateAuth,
        } = this.props;

        updateAuth( {
            token: '',
        } );
    }

    renderSubmenus( nav, returnObject = false ) {
        let thereIsActive = false;

        const result = Object.keys( nav ).map( ( url ) => {
            const data = nav[ url ];
            const isActive = window.location.hash === `#${ url }`;
            let isOpened = false;

            if ( isActive ) {
                thereIsActive = true;
            }

            let sub = '';
            if ( data.sub ) {
                const subData = this.renderSubmenus( data.sub, true );

                sub = (
                    <ul className="yay-submenu dropdown-triangle">
                        { subData.content }
                    </ul>
                );

                if ( subData.thereIsActive ) {
                    isOpened = true;
                    thereIsActive = true;
                }
            }

            return (
                <React.Fragment key={ `${ url }-${ data.name }` }>
                    { data.label ? (
                        <li className="yay-label"><Trans>{ data.label }</Trans></li>
                    ) : '' }
                    <li className={ classnames( {
                        'yay-item-active': isActive,
                        'yay-submenu-open': isOpened,
                    } ) }>
                        { data.name ? (
                            <NavLink
                                to={ data.sub ? '#' : url }
                                className={ data.sub ? 'yay-sub-toggle' : '' }
                            >
                                { data.icon ? (
                                    <>
                                        <span className="yay-icon">
                                            <Icon name={ data.icon } />
                                        </span>
                                        <span><Trans>{ data.name }</Trans></span>
                                        <span className="rui-yaybar-circle" />
                                    </>
                                ) : (
                                    data.name
                                ) }
                                { data.sub ? (
                                    <span className="yay-icon-collapse">
                                        <Icon name="chevron-right" strokeWidth="1" className="rui-icon-collapse" />
                                    </span>
                                ) : '' }
                            </NavLink>
                        ) : '' }
                        { sub }
                    </li>
                </React.Fragment>
            );
        } );

        if ( returnObject ) {
            return {
                content: result,
                thereIsActive,
            };
        }

        return result;
    }

    render() {
        const {
            settings,
        } = this.props;

        return (
            <>
                <div className={
                    classnames(
                        'yaybar rui-yaybar yay-hide-to-small yay-gestures',
                        settings.sidebar_dark && ! settings.night_mode ? 'rui-yaybar-dark' : '',
                        settings.sidebar_static ? 'yay-static' : '',
                        settings.sidebar_effect ? `yay-${ settings.sidebar_effect }` : '',
                    )
                }
                >
                    <div className="yay-wrap-menu">
                        <div className="yaybar-wrap">
                            <ul>
                                { /* <li>
                                    <a href="../dashboard.html">
                                        <span
                                            className="yay-icon"
                                            dangerouslySetInnerHTML={ { __html: require( '!svg-inline-loader!../../../../common-assets/images/logo-html-inherit.svg' ) } }
                                        />
                                        <span>Switch to HTML</span>
                                        <span className="rui-yaybar-circle"></span>
                                    </a>
                                </li> */ }

                                { this.renderSubmenus( settings.navigation_sidebar ) }
                                {/* <li>
                                    <a target="_blank" onClick={ () => { 
                                        ipcRenderer.send('new-window', 'https://centerpointgaming.com/contact.html') 
                                    } }>
                                        <span className="yay-icon">
                                            <Icon name="help-circle" />
                                        </span>
                                        <span>Support</span>
                                        <span className="rui-yaybar-circle"></span>
                                    </a>
                                </li>  */}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="rui-yaybar-bg" />
            </>
        );
    }
}

export default connect( ( { settings } ) => (
    {
        settings,
    }
), { updateAuth: actionUpdateAuth } )( PageYaybar );

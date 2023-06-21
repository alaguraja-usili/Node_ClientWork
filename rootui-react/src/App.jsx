/* eslint-disable */
/**
 * External Dependencies
 */
import React, { Component } from 'react';
import { withRouter, HashRouter, Route, Link } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Button } from 'reactstrap';
import i18n from './i18n';
import { withTranslation, WithTranslation } from 'react-i18next';
import ExtensionUpdateModal from './components/extension-update-modal';

/**
 * Internal Dependencies
 */
import './components/animated-route';
import reducers from './reducers';
import Routes from './Routes';
import PageYaybar from './components/page-yaybar';
import PageNavbar from './components/page-navbar';
import PageToasts from './components/page-toasts';
import { composeWithDevTools } from 'redux-devtools-extension';
import { setCurrentActiveCrosshair, setUsingExclusiveFullscreenMode, setSavedCrosshairs, featuredApiSuccess,
    addToast,
    featuredApiFailure,
    setCrosshairHidden,
    communityPreviewApiSuccess,
    communityPreviewApiFailure,
    communityTop100ApiSuccess,
    communityTop100ApiFailure,
    communityNew100ApiSuccess,
    communityNew100ApiFailure 
} from './actions/index';

const createStoreWithMiddleware = composeWithDevTools(applyMiddleware())( createStore );
const $html = window.jQuery( 'html' );
const $body = window.jQuery( 'body' );
const { ipcRenderer } = window.require('electron'); 
import axios from 'axios';

/**
 * Component PageWrap
 */
class PageWrap extends Component {
    constructor( props ) {
        super( props );

        // this.maybeCheckAuth = this.maybeCheckAuth.bind( this );
        this.maybeUpdateGlobalSettings = this.maybeUpdateGlobalSettings.bind( this );
        this.maybeScrollPageToTop = this.maybeScrollPageToTop.bind( this );

        ipcRenderer.on('setUsingExclusiveFullscreen', (event, arg) => {console.log(arg); this.props.setUsingExclusiveFullscreenMode(arg); ipcRenderer.invoke('setStoreValue', 'isUsingExclusiveFullscreen', arg); ipcRenderer.invoke(arg ? 'hideCrosshairWindow' : 'showCrosshairWindow');});

        ipcRenderer.on('showReviewBox', (event, arg) => {console.log("Show review box"); this.props.addToast( {
            title: "Do you like Crosshair X?",
            color: 'info'
        } )});

        ipcRenderer.on('setCrosshairHidden', (event, arg) => {console.log(arg); this.props.setCrosshairHidden(arg);});

        ipcRenderer.on('change-language', (event, arg) => {console.log(arg); i18n.changeLanguage(arg); ipcRenderer.invoke('setStoreValue', 'languagePref', arg);});
        
        
        ipcRenderer.on('navigate-to-for-screenie', (event, arg) => {

            // if the page is not the designer, run the code below
            this.props.history.push({ pathname: arg});
        
    })

        ipcRenderer.on('navigateTo', (event, arg) => {
            console.log(JSON.parse(arg).name);
            // if the page is the designer, run the code below

            if (JSON.parse(arg).page == "designer") {
            ipcRenderer.invoke('getStoreValue', 'crosshairImage').then((currentActiveCrosshair) => {
                this.props.setCurrentActiveCrosshair(currentActiveCrosshair)
                this.props.history.push({ pathname: JSON.parse(arg).page, state: { name: JSON.parse(arg).name, currentActiveCrosshair: currentActiveCrosshair }});
            })
        } else {
            // if the page is not the designer, run the code below
            this.props.history.push({ pathname: JSON.parse(arg).page, state: { name: JSON.parse(arg).name }});
        }
    })
        console.log(this)
    }

    componentDidMount() {
        // this.maybeCheckAuth();
        this.maybeUpdateGlobalSettings();
        ipcRenderer.invoke('getStoreValue', 'crosshairImage').then((currentActiveCrosshair) => {
            ipcRenderer.invoke('getStoreValue', 'crosshairType').then((crosshairType) => {
            if (this.props.currentActiveCrosshair === undefined) {
                if (crosshairType != "customimages") {
                    console.log("Crosshair type is not custom images, setting crosshair to default")
                    console.log(currentActiveCrosshair)
                    // if currentActiveCrosshair is a string, parse it, if its an object, just use it
                    if (typeof currentActiveCrosshair === "string") {
                        this.props.setCurrentActiveCrosshair(JSON.parse(currentActiveCrosshair))
                    } else {

                    this.props.setCurrentActiveCrosshair(currentActiveCrosshair)
                    }
                    // this.props.setCurrentActiveCrosshair(JSON.parse(currentActiveCrosshair))
                } else {
                    // import the empty crosshair
                    console.log("IMPORTING EMPTY CROSSHAIR")
                    const { emptyCrosshair } = require('../main-process/CrosshairModel');
                    this.props.setCurrentActiveCrosshair(emptyCrosshair.drawing);
                }
            }
            });
        })

        ipcRenderer.invoke('getStoreValue', 'isUsingExclusiveFullscreen').then((isUsingExclusiveFullscreen) => {
            if (this.props.isUsingExclusiveFullscreen === undefined) {
                this.props.setUsingExclusiveFullscreenMode(isUsingExclusiveFullscreen)
            }
        })

        ipcRenderer.invoke('getStoreValue', 'languagePref').then((languagePref) => {
            i18n.changeLanguage(languagePref);
        })

        ipcRenderer.invoke('getStoreValue', 'savedCrosshairs').then((savedCrosshairs) => {
            this.props.setSavedCrosshairs(savedCrosshairs);
        })

        // Fetch Featured Crosshairs
        axios.get( 'https://hykc1luc00.execute-api.us-east-1.amazonaws.com/crosshair-x-fetch-featured-crosshairs' )
        .then(response => {
            console.log(response.data)
            this.props.featuredApiSuccess(response.data)
        })
        .catch(error => {
            console.log(error)
            this.props.featuredApiFailure(error);
        });

        // Fetch Community Crosshairs
        axios.get( 'https://aluyhu79fc.execute-api.us-east-1.amazonaws.com/crosshair-x-fetch-community-featured-crosshairs?sortBy=selects' )
        .then(response => {
            console.log(response.data)
            this.props.communityPreviewApiSuccess(response.data)
        })
        .catch(error => {
            console.log(error)
            this.props.communityPreviewApiFailure(error);
        });

        // Fetch top 100
        axios.get( `https://fqq3o587a6.execute-api.us-east-1.amazonaws.com/crosshair-x-community-fetch-daily-db?sortBy=selectCount` )
        .then(response => {
            this.props.communityTop100ApiSuccess(response.data);
        })
        .catch(error => {
            console.log(error)
            this.props.communityTop100ApiFailure(error);
        });

        console.log(this);
    }

    componentDidUpdate( prevProps ) {
        // this.maybeCheckAuth( prevProps );
        this.maybeUpdateGlobalSettings( prevProps );
        this.maybeScrollPageToTop( prevProps );
    }

    maybeUpdateGlobalSettings( prevProps ) {
        const { settings } = this.props;

        // night mode.
        if ( prevProps && prevProps.settings.night_mode !== settings.night_mode ) {
            if ( settings.night_mode ) {
                $html.addClass( 'rui-night-mode' );

                // eslint-disable-next-line no-unused-expressions
                import( './style-night.scss' );
            } else {
                $html.removeClass( 'rui-night-mode' );
            }
        }
        if ( ! prevProps && settings.night_mode ) {
            $html.addClass( 'rui-night-mode' );

            // eslint-disable-next-line no-unused-expressions
            import( './style-night.scss' );
        }

        // spitlight mode.
        if ( prevProps && prevProps.settings.spotlight_mode !== settings.spotlight_mode ) {
            if ( settings.spotlight_mode ) {
                $body.addClass( 'rui-spotlightmode' );
            } else {
                $body.removeClass( 'rui-spotlightmode' );
            }
        }
        if ( ! prevProps && settings.spotlight_mode ) {
            $body.addClass( 'rui-spotlightmode' );
        }

        // section lines.
        if ( prevProps && prevProps.settings.show_section_lines !== settings.show_section_lines ) {
            if ( settings.show_section_lines ) {
                $body.addClass( 'rui-section-lines' );
            } else {
                $body.removeClass( 'rui-section-lines' );
            }
        }
        if ( ! prevProps && settings.show_section_lines ) {
            $body.addClass( 'rui-section-lines' );
        }

        // sidebar small.
        if ( prevProps && prevProps.settings.sidebar_small !== settings.sidebar_small ) {
            if ( settings.sidebar_small ) {
                $body.addClass( 'yay-hide' );
            } else {
                $body.removeClass( 'yay-hide' );
            }
        }
        if ( ! prevProps && settings.sidebar_small ) {
            $body.addClass( 'yay-hide' );
        }
    }

    maybeScrollPageToTop( prevProps ) {
        if ( this.props.location.pathname !== prevProps.location.pathname ) {
            window.scrollTo( {
                top: 0,
                behavior: 'smooth',
            } );
        }
    }

    render() {
        const {
            location,
        } = this.props;

        return (
            <TransitionGroup>
                            <PageToasts></PageToasts>
                            <ExtensionUpdateModal></ExtensionUpdateModal>
                <Route>
                    <>
                        <Route component={ PageYaybar } />
                        <Route component={ PageNavbar } />
                    </>
                </Route>
                <CSSTransition
                    key={ location.pathname }
                    timeout={ 300 }
                    classNames="rui-router-transition"
                    unmountOnExit
                >
                    <Routes location={ location } />
                </CSSTransition>
            </TransitionGroup>
        );
    }
}

const PageWrapWithState = connect( ( { auth, settings, crosshair } ) => (
    {
        auth,
        settings,
        crosshair,
    }
), { setCurrentActiveCrosshair, setUsingExclusiveFullscreenMode, setSavedCrosshairs, featuredApiSuccess,
    addToast,
    featuredApiFailure,
    setCrosshairHidden,
    communityPreviewApiSuccess,
    communityPreviewApiFailure, 
    communityTop100ApiSuccess, 
    communityTop100ApiFailure,
    communityNew100ApiSuccess,
    communityNew100ApiFailure } )( withRouter( PageWrap ) );

/**
 * Component App
 */
class App extends Component {
    constructor( props ) {
        super( props );

        // create redux store.
        this.store = createStoreWithMiddleware( reducers );
    }

    render() {
        return (
            <Provider store={ this.store }>
                <HashRouter>
                    <PageWrapWithState />
                </HashRouter>
            </Provider>
        );
    }
}

export default withTranslation()(App);

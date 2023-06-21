/* eslint-disable */
/**
 * Styles
 */
import './style.scss';

/**
 * External Dependencies
 */
import classnames from 'classnames/dedupe';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Toast, ToastBody, Button, Badge } from 'reactstrap';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import { Trans, withTranslation } from 'react-i18next';

/**
 * Internal Dependencies
 */
import {
    addToast as actionAddToast,
    removeToast as actionRemoveToast,
} from '../../actions';
const { ipcRenderer } = window.require('electron');

import Icon from '../icon';
// import { Info } from 'react-feather';

/**
 * Component
 */
class PageToasts extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            hiddenToasts: {},
        };
        this.timerToasts = {};

        this.maybePrepareToastsTimeout = this.maybePrepareToastsTimeout.bind( this );
        this.hideToast = this.hideToast.bind( this );
        console.log("PageToast Props", props)
    }

    componentDidMount() {
        const {
            addToast,
            t,
        } = this.props;

        // Startup toast when already logged in
        setTimeout( () => {
            if ( ! this.props.viewingMode.isUsingExclusiveFullscreen && ! this.state.hasShownAlready) {                
                addToast( {
                    title: 'exclusive_fullscreen_popup_title'
                } );

                this.setState({
                    hasShownAlready: true,
                }); 
            }
        }, 1000 );
        // Startup toast when already logged in
        setTimeout( () => {
            
        }, 2000 );
        // setTimeout( () => {
        //     addToast( {
        //         title: 'Tip: Toggle Shortcut',
        //         color: 'info',
        //         content: (
        //             <div style={ { height: "45px" } }>
        //                 Use the <Badge>Alt</Badge> + <Badge>Shift</Badge> + <Badge>z</Badge> shortcut to Show/Hide the crosshair anytime.
        //             </div>
        //         ),
        //     } );
        // }, 2000 );
    }

    componentWillUpdate() {
        if (this.props.viewingMode.isUsingExclusiveFullscreen && this.state.hasShownAlready ) {
            this.setState({
                hasShownAlready: false,
            }); 
        }


        setTimeout( () => {
            const doesHaveFullscreenToast = Object.keys( this.props.toasts ).reverse().map( (uid ) => this.props.toasts[uid].title).filter((title) => title === "exclusive_fullscreen_popup_title").length > 0;

            if ( ! doesHaveFullscreenToast && ! this.state.hasShownAlready && ! this.props.viewingMode.isUsingExclusiveFullscreen) {
                this.props.addToast( {
                    title: "exclusive_fullscreen_popup_title"
                } );
                this.setState({
                    hasShownAlready: true,
                }); 
            }
        }, 2000 );
    }

    componentDidUpdate( prevProps ) {
        const {
            auth,
            addToast,
        } = this.props;
        console.log("Component did update toasts")

        if ( auth.token !== prevProps.auth.token ) {
            // logged in toast.
            if ( auth.token ) {
                addToast( {
                    title: 'Successfully Logged In',
                    content: (
                        <>
                            Welcome to
                            { ' ' }
                            <strong>RootUI React</strong>
                            { ' ' }
                            admin dashboard. Hope that things are going good for you :)
                        </>
                    ),
                    time: new Date(),
                    duration: 4000,
                } );

                // logged out toast.
            } else {
                addToast( {
                    title: 'Successfully Logged Out',
                    content: 'You can test Sign In and Sign Out forms with validation.',
                    time: new Date(),
                    duration: 4000,
                    color: 'danger',
                } );
            }
        }

        this.maybePrepareToastsTimeout();
    }

    maybePrepareToastsTimeout() {
        const {
            toasts,
        } = this.props;

        const {
            timerToasts,
            hideToast,
        } = this;

        Object.keys( toasts ).forEach( ( uid ) => {
            const toast = toasts[ uid ];

            if ( toast.duration && ! timerToasts[ uid ] ) {
                timerToasts[ uid ] = true;
                setTimeout( () => {
                    hideToast( uid );
                }, toast.duration );
            }
        } );
    }

    hideToast( uid ) {
        const {
            removeToast,
        } = this.props;

        // hide toast.
        this.setState( {
            hiddenToasts: {
                ...this.state.hiddenToasts,
                [ uid ]: true,
            },
        }, () => {
            // completely remove toast from store.
            setTimeout( () => {
                removeToast( uid );
            }, 600 );
        } );
    }

    render() {
        const {
            toasts,
        } = this.props;

        const {
            hiddenToasts,
        } = this.state;
        console.log(
            "Rerender"
        )
        return (
            <div className="rui-toast-container">
            

                { Object.keys( toasts ).reverse().map( ( uid ) => {
                    const toast = toasts[ uid ];
                    if (this.props.viewingMode.isUsingExclusiveFullscreen) {
                        if (! hiddenToasts[ uid ] && toast.title === "exclusive_fullscreen_popup_title" ) {
                            this.hideToast(uid);
                        }
                    }

                    let content = null;

                    if (toast.title && toast.title === "exclusive_fullscreen_popup_title") {
                        const str = this.props.t("exclusive_fullscreen_popup_subtitle");
                        const left = str.split("[[")[0];
                        const center = str.split("[[")[1].split("]]")[0];
                        const right = str.split("]]")[1];

                        content = (
                            <div style={ { height: "45px" } }>
                                <div style={ { float: "left", width: "80%" } }>
                                <>{left} { ' ' } <strong>{center}</strong> { ' ' } {right}</>
    
                                </div>
                                <div style={ { float: "right" } }>
                                    <Link to="/exclusive-fullscreen"><Button color="brand" outline >{this.props.t('GO')}</Button></Link>
                                </div>
                            </div>
                        )
                    } else if (toast.title && toast.title === "Do you like Crosshair X?") {
                        content = (
                            <div>
                                <div style={ { paddingBottom: "10px"} }>
                                    <Trans>we_appreciate_feedback</Trans>
                                </div>
                                <div style={ { float: "right", paddingBottom: "15px"} }>
                                    <Button onClick={() => {
                                        ipcRenderer.send('open-review');
                                        // https://store.steampowered.com/app/1366800/Crosshair_X/
                                    }} color="brand" outline ><Trans>Leave a Review</Trans></Button>
                                </div>
                            </div>
                        )
                    } else if (toast.content) {
                        content = toast.content;
                    }

                    return (
                        <Toast
                            key={ uid }
                            className={ classnames( 'rui-toast', `toast-${ toast.color }` ) }
                            isOpen={ ! hiddenToasts[ uid ] }
                        >
                            <div className="toast-header">
                                { toast.title ? (
                                    <h5 className="mr-auto mnb-2"><Trans>{ toast.title }</Trans></h5>
                                ) : '' }
                                { toast.time ? (
                                    <small className="toast-date">
                                        <TimeAgo date={ toast.time } />
                                    </small>
                                ) : '' }
                                { toast.closeButton ? (
                                    <button
                                        type="button"
                                        className="ml-15 mnt-4 mnr-4 toast-close close"
                                        aria-label="Close"
                                        onClick={ () => {
                                            if (toast.title && toast.title === "Do you like Crosshair X?") {
                                                ipcRenderer.send('dismissReviewBox');
                                            }
                                            this.hideToast( uid );
                                        } }
                                    >
                                        <Icon name="x" />
                                    </button>
                                ) : '' }
                            </div>
                            { content ? (
                                <ToastBody>
                                    { content }
                                </ToastBody>
                            ) : '' }
                        </Toast>
                    );
                } ) }
            </div>
        );
    }
}

export default connect( ( { auth, toasts, viewingMode } ) => (
    {
        auth,
        toasts,
        viewingMode,
    }
), {
    addToast: actionAddToast,
    removeToast: actionRemoveToast,
} )( withTranslation()(PageToasts) );

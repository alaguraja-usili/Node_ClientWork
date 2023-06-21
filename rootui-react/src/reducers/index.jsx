/* eslint-disable */
/**
 * External Dependencies
 */
import { combineReducers } from 'redux';
import Cookies from 'js-cookie';
import Omit from 'object.omit';
import axios from 'axios';

/**
 * Internal Dependencies
 */
import { getUID } from '../utils';
import defaultSettings from '../settings';
import {
    UPDATE_AUTH,
    UPDATE_SETTINGS,
    ADD_TOAST,
    REMOVE_TOAST,
    CALL_FEATURED_API_SUCCESS,
    CALL_FEATURED_API_FAILURE,
    CALL_COMMUNITY_PREVIEW_API,
    CALL_COMMUNITY_PREVIEW_API_SUCCESS,
    CALL_COMMUNITY_PREVIEW_API_FAILURE,
    SET_CURRENT_ACTIVE_CROSSHAIR,
    SET_CROSSHAIR_HIDDEN,
    SET_USING_EXCLUSIVE_FULLSCREEN_MODE,
    SET_SAVED_CROSSHAIRS,
    CALL_COMMUNITY_TOP_100_API_SUCCESS,
    CALL_COMMUNITY_TOP_100_API_FAILURE,
    CALL_COMMUNITY_NEW_100_API_SUCCESS,
    CALL_COMMUNITY_NEW_100_API_FAILURE,
} from '../actions';
import { toggleUnorderedList } from 'easymde';

// initial state.
const INITIAL_SETTINGS_STATE = {
    ...defaultSettings,
};
const INITIAL_AUTH_STATE = {
    token: Cookies.get( 'rui-auth-token' ),
};
const INITIAL_TOASTS_STATE = [];
const INITIAL_DASHBOARD_STATE = {
    featured: {
        isLoading: true,
        error: false,
        data: null,
    },
    communityPreview: {
        isLoading: true,
        error: false,
        data: null
    }, savedPreview: {
        isLoading: true,
        error: false,
        data: null
    }
}

const INITIAL_COMMUNITY_TABS_STATE = {
    top100: {
        isLoading: true,
        error: false,
        data: null,
    }
}
const INITIAL_VIEWING_MODE_STATE = {
    isUsingExclusiveFullscreen: false,
    crosshairHidden: false,
}

const INITIAL_CURRENT_ACTIVE_CROSSHAIR_STATE = {};

const INITIAL_SAVED_CROSSHAIRS = {};

/**
 * Reducer
 */
const rootReducer = combineReducers( {
    auth: ( state = INITIAL_AUTH_STATE, action ) => {
        switch ( action.type ) {
        case UPDATE_AUTH:
            // save token to cookies for 3 days.
            if ( typeof action.auth.token !== 'undefined' ) {
                Cookies.set( 'rui-auth-token', action.auth.token, { expires: 3 } );
            }

            return Object.assign( {}, state, action.auth );
        default:
            return state;
        }
    },
    settings: ( state = INITIAL_SETTINGS_STATE, action ) => {
        switch ( action.type ) {
        case UPDATE_SETTINGS:
            return Object.assign( {}, state, action.settings );
        default:
            return state;
        }
    },
    currentActiveCrosshair: ( state = INITIAL_CURRENT_ACTIVE_CROSSHAIR_STATE, action) => {
        switch ( action.type ) {
            case SET_CURRENT_ACTIVE_CROSSHAIR:
                return Object.assign( {}, state, action.currentActiveCrosshair );
            default:
                return state;
        }
    },
    dashboard: ( state = INITIAL_DASHBOARD_STATE, action) => {
        switch ( action.type ) {
            case CALL_FEATURED_API_SUCCESS:
                return Object.assign( {}, state, {featured: {
                    isLoading: false,
                    error: false,
                    data: action.data,
                }} );

            case CALL_FEATURED_API_FAILURE:
                return Object.assign( {}, state, {featured: {
                    isLoading: false,
                    error: true,
                    data:null,
                }} );
            
            case CALL_COMMUNITY_PREVIEW_API:
                return Object.assign( {}, state, {communityPreview: {
                    isLoading: true,
                    error: false,
                    data:null,
                }} );

            case CALL_COMMUNITY_PREVIEW_API_SUCCESS:
                return Object.assign( {}, state, {communityPreview: {
                    isLoading: false,
                    error: false,
                    data: action.data,
                }} );

            case CALL_COMMUNITY_PREVIEW_API_FAILURE:
                return Object.assign( {}, state, {communityPreview: {
                    isLoading: false,
                    error: true,
                    data:null,
                }} );
    
            default:
                return state;
            }
    },
    communityTabs: ( state = INITIAL_COMMUNITY_TABS_STATE, action) => {
        switch ( action.type ) {
            case CALL_COMMUNITY_TOP_100_API_SUCCESS: {
                return Object.assign( {}, state, {top100: {
                    isLoading: false,
                    error: false,
                    data: action.data,
                }} );
            }

            case CALL_COMMUNITY_TOP_100_API_FAILURE: {
                return Object.assign( {}, state, {top100: {
                    isLoading: false,
                    error: true,
                    data:null,
                }} );
            }

            case CALL_COMMUNITY_NEW_100_API_SUCCESS: {
                return Object.assign( {}, state, {new100: {
                    isLoading: false,
                    error: false,
                    data: action.data,
                }} );
            }

            case CALL_COMMUNITY_NEW_100_API_FAILURE: {
                return Object.assign( {}, state, {new100: {
                    isLoading: false,
                    error: true,
                    data:null,
                }} );
            }

            default:
                return state;
        }
    },
    viewingMode: ( state = INITIAL_VIEWING_MODE_STATE, action ) => {
        switch ( action.type ) {
            case SET_USING_EXCLUSIVE_FULLSCREEN_MODE:
                return Object.assign( {}, state, action.viewingMode );
            case SET_CROSSHAIR_HIDDEN:
                return Object.assign( {}, state, action.viewingMode );
            default:
                return state;
        }
    },
    savedCrosshairs: ( state = INITIAL_SAVED_CROSSHAIRS, action ) => {
        switch ( action.type ) {
            case SET_SAVED_CROSSHAIRS:
                return Object.assign( {}, state, action.savedCrosshairs );
            default:
                return state;
        }
    },
    toasts: ( state = INITIAL_TOASTS_STATE, action ) => {
        switch ( action.type ) {
        case ADD_TOAST:
            const newData = {
                ...{
                    title: '',
                    content: '',
                    color: 'brand',
                    time: false,
                    duration: 0,
                    closeButton: true,
                },
                ...action.data,
            };

            if ( newData.time === true ) {
                newData.time = new Date();
            }

            return {
                ...state,
                [ getUID() ]: newData,
            };
        case REMOVE_TOAST:
            if ( ! action.id || ! state[ action.id ] ) {
                return state;
            }
            return Omit( state, action.id );
        default:
            return state;
        }
    },
} );

export default rootReducer;

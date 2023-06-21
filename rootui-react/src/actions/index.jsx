export const UPDATE_AUTH = 'UPDATE_AUTH';
export const updateAuth = ( auth ) => ( {
    type: UPDATE_AUTH,
    auth,
} );

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const updateSettings = ( settings ) => ( {
    type: UPDATE_SETTINGS,
    settings,
} );

export const ADD_TOAST = 'ADD_TOAST';
export const addToast = ( data ) => ( {
    type: ADD_TOAST,
    data,
} );

export const REMOVE_TOAST = 'REMOVE_TOAST';
export const removeToast = ( id ) => ( {
    type: REMOVE_TOAST,
    id,
} );

export const CALL_FEATURED_API = 'CALL_FEATURED_API';
export const callFeaturedApi = ( ) => ( {
    type: CALL_FEATURED_API,
});

export const CALL_FEATURED_API_SUCCESS = 'CALL_FEATURED_API_SUCCESS';
export const featuredApiSuccess = (data) => ( {
    type: CALL_FEATURED_API_SUCCESS,
    data,
});
export const CALL_FEATURED_API_FAILURE = 'CALL_FEATURED_API_FAILURE';
export const featuredApiFailure = (error) => ( {
    type: CALL_FEATURED_API_FAILURE,
    error,
});

export const CALL_COMMUNITY_PREVIEW_API = 'CALL_COMMUNITY_PREVIEW_API';
export const callingCommunityPreviewApi = () => ( {
    type: CALL_COMMUNITY_PREVIEW_API,
});

export const CALL_COMMUNITY_PREVIEW_API_SUCCESS = 'CALL_COMMUNITY_PREVIEW_API_SUCCESS';
export const communityPreviewApiSuccess = (data) => ( {
    type: CALL_COMMUNITY_PREVIEW_API_SUCCESS,
    data,
});
export const CALL_COMMUNITY_PREVIEW_API_FAILURE = 'CALL_COMMUNITY_PREVIEW_API_FAILURE';
export const communityPreviewApiFailure = (error) => ( {
    type: CALL_COMMUNITY_PREVIEW_API_FAILURE,
    error,
});

export const CALL_COMMUNITY_TOP_100_API_SUCCESS = 'CALL_COMMUNITY_TOP_100_API_SUCCESS';
export const communityTop100ApiSuccess = (data) => ( {
    type: CALL_COMMUNITY_TOP_100_API_SUCCESS,
    data,
});
export const CALL_COMMUNITY_TOP_100_API_FAILURE = 'CALL_COMMUNITY_TOP_100_API_FAILURE';
export const communityTop100ApiFailure = (error) => ( {
    type: CALL_COMMUNITY_TOP_100_API_FAILURE,
    error,
});

export const CALL_COMMUNITY_NEW_100_API_SUCCESS = 'CALL_COMMUNITY_NEW_100_API_SUCCESS';
export const communityNew100ApiSuccess = (data) => ( {
    type: CALL_COMMUNITY_NEW_100_API_SUCCESS,
    data,
});
export const CALL_COMMUNITY_NEW_100_API_FAILURE = 'CALL_COMMUNITY_NEW_100_API_FAILURE';
export const communityNew100ApiFailure = (error) => ( {
    type: CALL_COMMUNITY_NEW_100_API_FAILURE,
    error,
});

export const SET_CURRENT_ACTIVE_CROSSHAIR = 'SET_CURRENT_ACTIVE_CROSSHAIR';
export const setCurrentActiveCrosshair = (crosshair) => { 
    if (crosshair) {
        if ((crosshair.firingOptions.duration === null || crosshair.firingOptions.duration === undefined) && (crosshair.firingOptions.tShapeWhenFiring || crosshair.firingOptions.firingOffset > 0)) {
            crosshair.firingOptions.duration = 0.3;
        }
    
        if ((crosshair.firingOptions.startDelay === null || crosshair.firingOptions.startDelay === undefined) && (crosshair.firingOptions.tShapeWhenFiring || crosshair.firingOptions.firingOffset > 0)) {
            crosshair.firingOptions.startDelay = 0.1;
        }
        
        // if crosshair.line.blur is not set, set it to 0 and same for outline and dot blur and same with line rotation
        if (crosshair.line.blur === null || crosshair.line.blur === undefined) {
            crosshair.line.blur = 0;
        }
        if (crosshair.outline.blur === null || crosshair.outline.blur === undefined) {
            crosshair.outline.blur = 0;
        }
        if (crosshair.dot.blur === null || crosshair.dot.blur === undefined) {
            crosshair.dot.blur = 0;
        }
        if (crosshair.line.rotation === null || crosshair.line.rotation === undefined) {
            crosshair.line.rotation = 0;
        }
    
        if (! crosshair.line.shape) {
            crosshair.line.shape = "rectangle";
        }
        
        if (! crosshair.dot.shape) {
            crosshair.dot.shape = "square";
        }
    }

    return {
        type: SET_CURRENT_ACTIVE_CROSSHAIR,
        currentActiveCrosshair: crosshair,
    } 
};
export const SET_USING_EXCLUSIVE_FULLSCREEN_MODE = 'SET_USING_EXCLUSIVE_FULLSCREEN_MODE';
export const setUsingExclusiveFullscreenMode = (isUsingExclusiveFullscreen) => {
    return {
        type: SET_USING_EXCLUSIVE_FULLSCREEN_MODE,
        viewingMode: { isUsingExclusiveFullscreen },
    }
};

export const SET_CROSSHAIR_HIDDEN = 'SET_CROSSHAIR_HIDDEN';
export const setCrosshairHidden = (crosshairHidden) => {
    return {
        type: SET_CROSSHAIR_HIDDEN,
        viewingMode: { crosshairHidden },
    }
};

export const SET_SAVED_CROSSHAIRS = 'SET_SAVED_CROSSHAIRS';
export const setSavedCrosshairs = (savedCrosshairs) => {
    return {
        type: SET_SAVED_CROSSHAIRS,
        savedCrosshairs: {
            savedCrosshairs,
        },
    }
};

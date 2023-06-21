/* eslint-disable */
/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
// import { Row, Col } from 'reactstrap';
import { Button, Input, Row } from 'reactstrap';

import SavedCard from './components/savedCard';
const { ipcRenderer } = window.require('electron'); 
import { setCurrentActiveCrosshair, setSavedCrosshairs } from '../../actions/index';
import { Spinner } from 'reactstrap';
import { Trans } from 'react-i18next';

/**
 * Internal Dependencies
 */
// import Snippet from '../../components/snippet';
import './style.scss';
import { render } from '../../utils/generateReactSvg';
import { emptyCrosshair } from '../../../main-process/CrosshairModel';

/**
 * Component
 */
class Content extends Component {

    constructor(props) {
        super(props);
        this.deleteFromSaved = this.deleteFromSaved.bind(this);
        this.replaceSaved = this.replaceSaved.bind(this);
        this.setCurrentActiveCrosshairImage = this.setCurrentActiveCrosshairImage.bind(this);
        this.state = {
            error: null,
            success: null,
            shareModalOpen: false,
            toggleShortcut: null,
        };


        this.openShareModal = this.openShareModal.bind(this);
        this.validateShortcut = this.validateShortcut.bind(this);
    }

    componentDidMount() {
                // validate against the toggleShortcut stored in the store
                ipcRenderer.invoke('getStoreValue', 'toggleShortcut').then((toggleShortcut) => {
                    this.setState({
                        toggleShortcut: toggleShortcut,
                    });
                })
            }

    openShareModal() {
        this.setState({
            shareModalOpen: true,
        });
    }

    closeShareModal() {
        this.setState({
            shareModalOpen: false,
        });
    }

    setCurrentActiveCrosshairImage(crosshairData) {
        ipcRenderer.send('setCurrentActiveCrosshair', JSON.stringify(crosshairData), 'customimages');
    }

    deleteFromSaved(index) {
        // delete the shortcut
        ipcRenderer.invoke('unregisterShortcut', JSON.stringify(this.props.savedCrosshairs[index])).then(() => {
            console.log('shortcut unregistered')
            const crosshairs = [].concat(this.props.savedCrosshairs);
            crosshairs.splice(index, 1);
            ipcRenderer.invoke('setStoreValue', 'savedCrosshairs', crosshairs);
            this.props.setSavedCrosshairs(crosshairs);
        });
    }

    replaceSaved(index, name, keyboardShortcut) {
        const crosshairs = [].concat(this.props.savedCrosshairs);
        crosshairs[index].name = name;
        // if the crosshair at the index has a keyboard shortcut, unregister it
        if (crosshairs[index].keyboardShortcut) {
            ipcRenderer.invoke('unregisterShortcut', JSON.stringify(crosshairs[index]));
        }

        if (keyboardShortcut.key) {
            keyboardShortcut.key = keyboardShortcut.key.toUpperCase();
            crosshairs[index].keyboardShortcut = keyboardShortcut;
            // register the shortcut
            ipcRenderer.invoke('registerShortcut', JSON.stringify(crosshairs[index]));
        }
        else {
            ipcRenderer.invoke('unregisterShortcut', JSON.stringify(crosshairs[index]));

            delete crosshairs[index].keyboardShortcut;
            // unregister the shortcut
        }


        

        ipcRenderer.invoke('setStoreValue', 'savedCrosshairs', crosshairs);
        this.props.setSavedCrosshairs(crosshairs);
    }

    validateShortcut(shortcut, index) {
        if (shortcut.key.length !== 1) {
            return {error: "enter-a-single-key-for-the-shortcut"};
        }

        if (shortcut.modifiers.length > 3 || shortcut.modifiers.length === 0) {
            return {error: "select-1-3-checkboxes-for-the-shortcut"};
        }

        // validate the regex match(/[a-z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\\\s]/i)
        if (!shortcut.key.match(/[a-z0-9!"#$%&'()*+,-./ :;<=>?@[\]^_`{|}~\\\s]/i)) {
            return {error: "enter-a-valid-key-for-the-shortcut"};
        }



        if (this.state.toggleShortcut.key.toUpperCase() === shortcut.key.toUpperCase()) {
            if (this.state.toggleShortcut.modifiers.length === shortcut.modifiers.length) {
                let same = true;
                for (let j = 0; j < shortcut.modifiers.length; j++) {
                    if (!this.state.toggleShortcut.modifiers.includes(shortcut.modifiers[j])) {
                        same = false;
                    }
                }
                if (same) {
                    return {error: "this-shortcut-is-already-taken-by-your-toggle-shortcut"};
                }
            }
        }


      

        // Cycle through each saved crosshair and check if the shortcut is already taken
        for (let i = 0; i < this.props.savedCrosshairs.length; i++) {
            console.log(this.props.savedCrosshairs[i].keyboardShortcut?.key.toUpperCase(), shortcut.key.toUpperCase())
            if (this.props.savedCrosshairs[i].keyboardShortcut?.key.toUpperCase() === shortcut.key.toUpperCase()) {
                if (index != i && this.props.savedCrosshairs[i].keyboardShortcut.modifiers.length === shortcut.modifiers.length) {
                    let same = true;
                    for (let j = 0; j < shortcut.modifiers.length; j++) {
                        if (!this.props.savedCrosshairs[i].keyboardShortcut.modifiers.includes(shortcut.modifiers[j])) {
                            same = false;
                        }
                    }
                    if (same) {
                        return {error: "this-shortcut-is-already-taken-by-another-saved-crosshair"};
                    }
                }
            }
        }

        return {error: false};
    }



      

    render() {
        const Separator = () => {
            const separatorStyle = {
              width: 'calc(100%)',
              height: '1px',
              backgroundColor: '#333333',
              margin: '20px 0 20px 0',
            };
          
            return <div style={separatorStyle} />;
          }

        let component;
        if (this.props === null || this.props.savedCrosshairs === undefined) {
            component = <Spinner> </ Spinner>
        } else if (this.props.savedCrosshairs.length === 0) {
            component = <div>
                <p className="display-4 mb-30"><Trans>saved_page_no_crosshairs_saved_title</Trans></p>
                <p><Trans>saved_page_no_crosshairs_saved_subtitle</Trans></p>
            </div>
        } else {
            let cards = [].concat(this.props.savedCrosshairs)
            .map((crosshairData, index) => <SavedCard key={index} validateShortcut={this.validateShortcut} crosshairData={crosshairData} index={index} deleteFromSaved={this.deleteFromSaved} replaceSaved={this.replaceSaved} setCurrentActiveCrosshair={crosshairData.model ? this.props.setCurrentActiveCrosshair : this.setCurrentActiveCrosshairImage} ></SavedCard>);

            let cardsWithShortcuts = cards.filter(card => card.props.crosshairData.keyboardShortcut);

            let cardsWithoutShortcuts = cards.filter(card => !card.props.crosshairData.keyboardShortcut);

            component = 
            <>
            {cardsWithShortcuts && cardsWithShortcuts.length > 0 && <><h1><Trans>saved-with-shortcut</Trans></h1></>}
            <Row className="vertical-gap">
                {cardsWithShortcuts}
            </Row>

            {cardsWithoutShortcuts && cardsWithoutShortcuts.length > 0 && cardsWithShortcuts && cardsWithShortcuts.length > 0 ? <Separator></Separator>: <div className='rui-gap-1'></div>}
            
            <Row className="vertical-gap">
                {cardsWithoutShortcuts}
            </Row>
            </>
        }

        return (
            <Fragment>
                <div style={{display: "none"}}>
                    {/* HACK BECAUSE SVGS WERENT RENDERING: Go through each object in this.props.savedCrosshairs and check if
                    it has a model property. If it does, check each child and see if it has a blur value 
                    and if it does, check that it has a blur value over 0 and if it does, render the first one*/}
{/* 
                    {this.props.savedCrosshairs.map((crosshairData, index) => {
                        if (crosshairData.model) {
                            Object.keys(crosshairData.model).forEach(child => {
                                if (crosshairData.model[child].blur) {
                                    if (crosshairData.model[child].blur > 0) {
                                        console.log("Rendering " + child + " with index" + index);
                                        indexOfSaved = index;
                                    }
                                }
                            });
                        }
                    }) && indexOfSaved !== -1 && render(this.props.savedCrosshairs[indexOfSaved].model)} */}
                </div>
                {component}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    settings: state.settings,
    savedCrosshairs: state.savedCrosshairs.savedCrosshairs,
})

const mapDispatchToProps = {
    setCurrentActiveCrosshair,
    setSavedCrosshairs,
}

export default connect( mapStateToProps, mapDispatchToProps )( Content );


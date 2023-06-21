/* eslint-disable */
import React, {useState} from 'react'
import { Button, Modal, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Icon from '../icon';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css'

import { withTranslation, Trans, Translation } from 'react-i18next';
const { ipcRenderer } = window.require("electron");
import { Provider, connect } from 'react-redux';
import { setUsingExclusiveFullscreenMode } from '../../actions/index';


function ExtensionUpdateModal(props) {
    const latestVersion = "1.0.26.0";

    // Name, Min,Max, featuretochange(ex firingOffset), unit(secs, px, etc)

    const [currentVersion,setCurrentVersion] = React.useState(false);
    const [pinMePressed, setPinMePressed] = React.useState(false);
    const [isIPCConnected, setIPCConnected] = React.useState(false);
    const [isAppServiceConnected, setAppServiceConnected] = React.useState(false);
  

    const [clickthroughEnabled, setClickthroughEnabled] = React.useState(false);
    const [extensionVisible, setExtensionVisible] = React.useState(false);

    // On component mount, get the current status of the extension
    useEffect(() => {
        ipcRenderer.invoke("gameBarStatus").then((result) => {
            setAppServiceConnected(result.isConnected);
            setClickthroughEnabled(result.isClickthrough);
            setExtensionVisible(result.isVisible);
            if (result.version != false) setCurrentVersion(result.version);
            setPinMePressed(result.isPinned);
        });
    }, []);


    ipcRenderer.on('gameBarStatus', (event, arg) => {
      if (currentVersion != arg.version) {
        setCurrentVersion(arg.version);
        ipcRenderer.invoke("setStoreValue", "extensionVersion", arg.version)
      }

      if (clickthroughEnabled != arg.isClickthrough) {
        setClickthroughEnabled(arg.isClickthrough);
      }

      if (extensionVisible != arg.isVisible) {
        setExtensionVisible(arg.isVisible);
      }

      if (pinMePressed != arg.isPinned) {
        setPinMePressed(arg.isPinned);
      }
      
      if (isAppServiceConnected != arg.isConnected) {
        setAppServiceConnected(arg.isConnected)
      }
    })

    ipcRenderer.on('isConnected', (event, arg) => {
      ipcRenderer.invoke("getStoreValue", "extensionVersion").then((val) => {
        if (currentVersion !=val) {
          setCurrentVersion(val);
        }
      })

      if (arg.source === "ipc") {
        setIPCConnected(arg.isConnected)
      } else if (arg.source === "appservice") {

        setAppServiceConnected(arg.isConnected)
      }
    })

    return (
    //     <Modal
    //     isOpen={(!pinMePressed || !(isIPCConnected || isAppServiceConnected) || !clickthroughEnabled || !extensionVisible || currentVersion != latestVersion) && props.viewingMode.isUsingExclusiveFullscreen} // replace with the version thing
    //     centered
    //   >
    <div>
        <div>
          {!props.titleRemoved && <h5 className="h2"><Trans>crosshair-x-extension-health-check</Trans> (<Trans>Exclusive Fullscreen</Trans>)</h5>}
        </div>
        <div style={{paddingBottom: "15px"}}>

          <ul className='extensionChecklist'>

              {(currentVersion && isAppServiceConnected) && <li className={currentVersion != latestVersion ? "incomplete" : "complete"}><Trans>update_crosshair_x_microsoft_store_button</Trans>             <span style={{fontWeight: 'bold'}}> ( {<Trans>current_version</Trans>}: </span>
              <span>{currentVersion}</span> &nbsp;
                   
              <span style={{fontWeight: 'bold'}}>{<Trans>latest_version</Trans>}: </span>
              <span>{latestVersion}</span> ) </li>}
              <li className={! (isIPCConnected || isAppServiceConnected) ? "incomplete" : "complete"}><Trans>connected-to-crosshair-x-extension</Trans></li>
              <li className={! clickthroughEnabled ? "incomplete" : "complete"}><Trans>enable-gamebar-click-through</Trans></li>
              <li className={! pinMePressed ? "incomplete" : "complete"}><Trans>press-pin-me</Trans></li>
              <li className={! extensionVisible ? "incomplete" : "complete"}><Trans>crosshair-x-extension-is-visible-press-win-g-twice</Trans></li>
          </ul>

          {/* <Translation>
          {t =>
          currentVersion == false || currentVersion == "" ? <>
           <p>{t("install_crosshair_x_extension_title")}</p>
          </>
          
          : <> 
            <p>{t("update_crosshair_x_extension_subtitle")}</p>

            <span style={{fontWeight: 'bold'}}>{t("current_version")}: </span>
            <span>{currentVersion}</span>
                 
            <br></br>
            <span style={{fontWeight: 'bold'}}>{t("latest_version")}: </span>
            <span>{latestVersion}</span>

            </>
          }
          </Translation> */}
        

        </div>
        </div>
    //   </Modal>
    );
  }

  export default withTranslation()(connect(( { auth, settings, crosshair, viewingMode } ) => (
    {
        auth,
        settings,
        crosshair,
        viewingMode,
    }
), { setUsingExclusiveFullscreenMode } )((ExtensionUpdateModal)));
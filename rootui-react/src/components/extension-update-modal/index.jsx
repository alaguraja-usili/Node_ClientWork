/* eslint-disable */
import React, {useState} from 'react'
import { Button, Modal, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText, CustomInput} from 'reactstrap';
import Icon from '../icon';
import { Link } from 'react-router-dom';

import { useEffect } from 'react';

import { withTranslation, Trans, Translation } from 'react-i18next';
const { ipcRenderer } = window.require("electron");
import { Provider, connect } from 'react-redux';
import { setUsingExclusiveFullscreenMode } from '../../actions/index';


function ExtensionUpdateModal(props) {
    const latestVersion = "1.0.26.0";

    // Name, Min,Max, featuretochange(ex firingOffset), unit(secs, px, etc)

    const [currentVersion,setCurrentVersion] = useState("");
    const [checked, setChecked] = React.useState(false);

    ipcRenderer.on('setCurrentVersion', (event, arg) => {
        if (currentVersion != arg) {
          setCurrentVersion(arg);
          ipcRenderer.invoke('setStoreValue', 'extensionVersion', arg);
        }     
    });


    useEffect(() => {
      ipcRenderer.invoke("getStoreValue", "extensionVersion").then((extensionVersion) => {
        setCurrentVersion(extensionVersion)
      });
    }, []);

    return (
        <Modal
        isOpen={currentVersion != latestVersion && props.viewingMode.isUsingExclusiveFullscreen} // replace with the version thing
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title h2"><Trans>crosshair-x-is-not-connected-to-the-crosshair-x-extension-on-xbox-game-bar</Trans></h5>
        </div>
        <ModalBody>
          <div className="rui-gap-1" />
           <p><Trans>in-order-to-use-exclusive-fullscreen-a-connection-must-be-established-between-the-crosshair-x-app-and-the-crosshair-x-extension</Trans><div className='rui-gap-1'></div><Trans>if-you-are-having-trouble-establishing-a-connection-please-visit-the-support-page-for-help</Trans></p>
          {/* <Translation>
          {t =>
          currentVersion == false || currentVersion == "" ? <>
          
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
          {/* <label style={{marginTop: "20px"}} >
      <input type="checkbox" style={{marginRight: "10px"}}
        defaultChecked={checked}
        onChange={() => setChecked(!checked)}
      />
      <Trans>update_crosshair_x_acknowledgement</Trans>
    </label> */}
        </ModalBody>
        <ModalFooter style={{display: "inline-block"}}>

          <Link to="/support"><Button color="brand" style={{color: "white"}} onClick={() => {
            props.setUsingExclusiveFullscreenMode(false);
            ipcRenderer.invoke("useExclusiveFullscreen", false);
            ipcRenderer.invoke("showCrosshairWindow")


            }}><Trans>go-to-support-page</Trans></Button></Link>
          <Translation>
          {t => <Button color="secondary" onClick={() => {
            props.setUsingExclusiveFullscreenMode(false);
            ipcRenderer.invoke("useExclusiveFullscreen", false);
            ipcRenderer.invoke("showCrosshairWindow")


            }}>
            {t("update_crosshair_x_switch_to_windowed")}
          </Button>}
          </Translation>
          {/* <p style={{paddingTop: "10px", marginBottom: "0px"}}><Trans>having-technical-issues-with-completing-these-steps</Trans> <Link to={"/support"} > <Trans>visit-the-support-page-for-help</Trans></Link> </p> */}

        </ModalFooter>
      </Modal>
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
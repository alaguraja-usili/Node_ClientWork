/* eslint-disable */
import React, {useState} from 'react'
import { Button, Modal, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Icon from '../icon';
import { useEffect } from 'react';

import { withTranslation, Trans, Translation } from 'react-i18next';
const { ipcRenderer } = window.require("electron");
import { Provider, connect } from 'react-redux';
import "./style.scss";

function ContentCreatorModal(props) {
    return (
        <Modal
        isOpen={true} // replace with the version thing
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title h2"><Trans>Crosshair X Creator Fund</Trans></h5>
        </div>
        <ModalBody>
          <div className="rui-gap-1" />
          <Translation>
          {t =>
          <>
           <p>{t("We're looking to sponsor talented content creators who use Crosshair X.")}</p>
           <p>{t("If you have a large following on any social media platform, are open to sponsorships, and use Crosshair X, we'd love to hear from you!")}</p>
           <div style={{marginTop: "30px"}}>
             Contact us at <a
                target="_blank"
                onClick={() => {
                  ipcRenderer.send(
                    "new-window",
                    "mailto://admin@centerpointgaming.com"
                  );
                }}
              >
              admin@centerpointgaming.com</a> for more information.
           </div>
          
          </>


         
          }
          </Translation>


        </ModalBody>
        <ModalFooter>
        </ModalFooter>
      </Modal>
    );
  }

  export default withTranslation()(connect(( {  } ) => (
    {

    }
), {  } )((ContentCreatorModal)));
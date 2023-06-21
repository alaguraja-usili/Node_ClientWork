/* eslint-disable */

import React, { Component } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Badge,
} from "reactstrap";
import KeyboardShortcut from "../../../pages/Toggle/keyboardshortcut";

import Icon from "../../../components/icon";
import TouchSpin from "../../../components/touch-spin";

import "./savedCard.scss";
import { render } from '../../../utils/generateReactSvg';
const { ipcRenderer } = window.require('electron'); 
import { Translation, Trans } from 'react-i18next';
import { valid } from "overlayscrollbars";


class SavedCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      inputValue: this.props.crosshairData.name || '',
      keyboardShortcut: this.props.crosshairData.keyboardShortcut || {key: '', modifiers: []},
      keyboardShortcutWanted: this.props.crosshairData.keyboardShortcut ? true : false,
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.deleteCrosshair = this.deleteCrosshair.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.downloadPng = this.downloadPng.bind(this);
    this.downloadSvg = this.downloadSvg.bind(this);
    this.downloadImage = this.downloadImage.bind(this);
  }

  downloadPng() {
    ipcRenderer.send('download-png', JSON.stringify(this.props.crosshairData), this.props.crosshairData.name);
  }

  downloadSvg() {
    ipcRenderer.send('download-svg', JSON.stringify(this.props.crosshairData), this.props.crosshairData.name);
  }

  downloadImage() {
    ipcRenderer.send('download-image', JSON.stringify(this.props.crosshairData), this.props.crosshairData.name);
  }

  open() {
    this.setState({
      modalOpen: true,
      keyboardShortcutError: false,
      keyboardShortcut: this.props.crosshairData.keyboardShortcut || {key: '', modifiers: []},
      keyboardShortcutWanted: this.props.crosshairData.keyboardShortcut ? true : false,
    });
  }

  close() {
    this.setState({
      modalOpen: false,
    });
  }

  saveChanges() {
    // check if keyboard shortcut is valid
    if (this.state.keyboardShortcutWanted) {
      // check if keyboard shortcut is already in use
      const validateShortcut = this.props.validateShortcut(this.state.keyboardShortcut, this.props.index);
      if (!validateShortcut.error) {
        this.props.replaceSaved(this.props.index, this.state.inputValue, this.state.keyboardShortcut);
        this.close();
      } else {
        this.setState({
          keyboardShortcutError: validateShortcut.error,
        });
      }
    } else {
      this.props.replaceSaved(this.props.index, this.state.inputValue, this.state.keyboardShortcut);
      this.close();
    }
  }

  deleteCrosshair() {
    this.props.deleteFromSaved(this.props.index);
    this.close();
  }

  updateInputValue(event) {
    this.setState({
      inputValue: event.target.value
    });
  }

  render() {
    console.log("Current", this.props.crosshairData);
    return (
      <Col xs={ 12 } sm={ 6 } md={ 4 } lg={ 3 } xl={ 2 }>
      <div className="demo-icons" onClick={() => {
        if (this.props.crosshairData.image) {
          // call getB64
          ipcRenderer.invoke('getB64', this.props.crosshairData.image.localPath).then((b64) => {
            this.props.crosshairData.image.b64 = b64;
            if (this.props.crosshairData.image == undefined) this.props.setCurrentActiveCrosshair(this.props.crosshairData.image == undefined ? this.props.crosshairData.model : this.props.crosshairData.image);
            ipcRenderer.send('setCurrentActiveCrosshair', JSON.stringify(this.props.crosshairData.image == undefined ? this.props.crosshairData.model : this.props.crosshairData.image), this.props.crosshairData.image == undefined ? 'saved page': 'customimages', this.props.crosshairData.name);
          });

        } else {
          if (this.props.crosshairData.image == undefined) this.props.setCurrentActiveCrosshair(this.props.crosshairData.image == undefined ? this.props.crosshairData.model : this.props.crosshairData.image);
          ipcRenderer.send('setCurrentActiveCrosshair', JSON.stringify(this.props.crosshairData.image == undefined ? this.props.crosshairData.model : this.props.crosshairData.image), this.props.crosshairData.image == undefined ? 'saved page': 'customimages', this.props.crosshairData.name);
        }
      
      } 
      }>
        <div className="position-top-left-icon">
          {/* I want a icon to indicate there is keyboard shortcut, us faRegular keyboard */}
          {this.props.crosshairData.keyboardShortcut ? <small className="cardName">

{this.props.crosshairData.keyboardShortcut.modifiers.map((modifier, i) => (
<><Badge key={i}>{modifier}</Badge> + </>
))} {this.props.crosshairData.keyboardShortcut.key}
</small> : null}
        </div>
        <div className="position-top-right-icon">
          <Button className="btn-custom-round" onClick={this.open}>
            <Icon name="edit" />
          </Button>
          <Modal
            isOpen={this.state.modalOpen}
            toggle={this.open}
            className={this.props.className}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title h2"><Trans>Edit</Trans></h5>
              <Button className="close" color="" onClick={this.close}>
                <Icon name="x" />
              </Button>
            </div>
            <ModalBody>
              <span className="rui-icon rui-icon-stroke-1_5">
                {this.props.crosshairData.image == undefined ? render(this.props.crosshairData.model) :  <img
                          style={{ maxHeight: "20px" }}
                          src={this.props.crosshairData.image.localPath}
                          className="icon-file"
                          type="file"
                          alt=""
                        />}
              </span>
                <div className="rui-gap-1" />
              <FormGroup>
                <Trans>Name</Trans>
                <div style={{height: "10px"}}></div>
                <Translation>
                  {t => <Input
                    type="email"
                    name="email"
                    id="emailInput1"
                    placeholder={t('Name')}
                    onChange={this.updateInputValue}
                    value={this.state.inputValue}
                    maxlength={16}
                  />}
                </Translation>
              </FormGroup>
              <Trans>keyboard-shortcut</Trans>
              <div style={{height:"10px"}}></div>
              {! this.state.keyboardShortcutWanted && <Button outline color="brand" onClick={() => this.setState({keyboardShortcutWanted: true})}>
                <Icon name="plus" />&nbsp;<Trans>create-a-shortcut</Trans>
              </Button>}
              {this.state.keyboardShortcutWanted && <div><Button outline color="secondary" onClick={() => this.setState({keyboardShortcutWanted: false, keyboardShortcut: false})}>
                <Icon name="minus" />&nbsp;<Trans>delete-shortcut</Trans>
              </Button><div style={{height:"10px"}}></div><KeyboardShortcut key={this.props.index} keyboardShortcut={this.state.keyboardShortcut} updateState={(vals) => this.setState({keyboardShortcut:vals})}></KeyboardShortcut></div>}
                {this.state.keyboardShortcutError && <p style={{color: "red"}}><Trans>{this.state.keyboardShortcutError}</Trans></p>}
                  
            </ModalBody>
            <ModalFooter>
                            {/* Add a button */}
              {this.props.crosshairData.image ? <>
                <Button color="secondary" onClick={this.downloadImage}>
                  <Icon name="download" />
                </Button>
              </> : 
              <>
              <Button color="secondary" onClick={this.downloadPng}>
               PNG &nbsp; <Icon name="download" />
                </Button>
                <Button color="secondary" onClick={this.downloadSvg}>
                 SVG &nbsp; <Icon name="download" />
                </Button>
              </>}



              <Button color="secondary" onClick={this.deleteCrosshair}>
                <span className="icon">
                  <Icon name="trash" />
                </span>
              </Button>{" "}
              <Button color="brand" onClick={this.saveChanges}>
                <Trans>Save Changes</Trans>
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        {/* <div className="position-top-left-icon">
            <Icon name={this.props.crosshairData.image ? "image" : "sliders" } />
            </div> */}
        <div className="cardStyle">
        
        <div className="cardDrawing">{this.props.crosshairData.image == undefined ? render(this.props.crosshairData.model) : <img
                          style={{ maxHeight: "20px" }}
                          src={this.props.crosshairData.image.localPath}
                          className="icon-file"
                          type="file"
                          alt=""
                        />}</div>


<div className="cardName">{this.props.crosshairData.name}</div>
        

        {/* If it has a keyboard shortcut, I want to display the shortcut with badges of the modifiers joined with plus signs and the key at the end */}



        </div>
      </div>
    </Col>);
  }
}

export default SavedCard;

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
} from "reactstrap";

import Icon from "../../../components/icon";

import { render } from '../../../utils/generateReactSvg';
const { ipcRenderer, clipboard } = window.require('electron'); 
import { Translation, Trans } from 'react-i18next';
import * as base64url from 'base64url';
import { Spinner } from 'reactstrap';
const axios = require('axios');


class ShareModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      crosshairObj: false,
      isLoading: false,
      error: false,
      shareId: false,
      name: false,
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open() {
    this.setState({
      modalOpen: true,
    });
  }

  close() { 
    this.props.modalClose();
  }

  componentWillReceiveProps(nextProps) {
    const deepCopyOfCrosshairObj = JSON.parse(JSON.stringify(nextProps.crosshairObj));
    delete deepCopyOfCrosshairObj.b64;
    const shareId = base64url(JSON.stringify(deepCopyOfCrosshairObj).replace(/\s+/g, ''));

    // Call API with b64 URL

    if (this.state.modalOpen != true && nextProps.modalOpen) {

      var self = this
      this.setState({modalOpen: nextProps.modalOpen, crosshairObj: nextProps.crosshairObj, name: nextProps.name, isLoading: true})

      axios.post(`https://8yy0fp6ycd.execute-api.us-east-1.amazonaws.com/Prod/createshare?cxid=${shareId}${nextProps.name ? `&name=${base64url(nextProps.name.trim())}` : ''}`)
      .then(function (response) {
        // console.log(response.data.message);
        self.setState({isLoading: false, shareId: `crosshairx.gg/s/${response.data.message}`});  
      })
      .catch(function (error) {
        // self.setState({isLoading: false, error: error});  
        console.log("Error with sending event", error);
      });
    } else {
      // console.log("Just set state")

      this.setState({ modalOpen: nextProps.modalOpen, crosshairObj: nextProps.crosshairObj})
    }

      // success: shareId: centerpoint.gg/s/{retUrl}
  }

  render() {
    let shareComponent = null;
    if (this.state.isLoading) {
      shareComponent = <Spinner color="brand">Loading...</Spinner>;
    } else if (this.state.error) {
      shareComponent = <Input style={{ resize: "none", outline: "none", marginRight: "0px"}} disabled={true} value={this.state.error}></Input>
    } else if (this.state.shareId) {
      shareComponent = <div>
          <Input style={{ resize: "none", outline: "none", width: "85%", marginRight: "15px", display: "inline",}} disabled={true} value={this.state.shareId}></Input>
          <Button color="brand" disabled={!this.state.shareId} onClick={() => {clipboard.writeText(this.state.shareId)}}>
                <span className="icon">
                  <Icon name="copy" />
                </span>
              </Button>
        </div>
    }

    return (
          <Modal
            isOpen={this.state.modalOpen}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title h2"><Trans>Share</Trans></h5>
              <Button className="close" color="" onClick={this.close}>
                <Icon name="x" />
              </Button>
            </div>
            <ModalBody>
              <span className="rui-icon rui-icon-stroke-1_5">
                {this.state.name && <p>{this.state.name}</p>}
                {this.state.crosshairObj && <img
                          style={{ maxHeight: "20px" }}
                          src={
                            this.state.crosshairObj.localPath
                          }
                          className="icon-file"
                          type="file"
                          alt=""
                        />}
              </span>
                <div className="rui-gap-1" />
                
                {shareComponent}
                
              <Row></Row>
            </ModalBody>
            <ModalFooter>

            </ModalFooter>
          </Modal>
    )}
}

export default ShareModal;

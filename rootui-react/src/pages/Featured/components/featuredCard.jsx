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
import TouchSpin from "../../../components/touch-spin";
import { render } from "../../../utils/generateReactSvg";
import { Trans } from "react-i18next";
import { Translation } from 'react-i18next';


const { ipcRenderer } = window.require("electron");

import "./featuredCard.scss";

class FeaturedCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
    };

    this.toggle = this.toggle.bind(this);
    this.saveCrosshair = this.saveCrosshair.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
  }

  toggle() {
    this.setState((prevState) => ({
      modalOpen: !prevState.modalOpen,
    }));
  }

  saveCrosshair() {
    let name = this.state.inputValue;
    if (name === undefined || name === "") {
      name = "New";
    }

    this.props.addNewCrosshair(this.props.crosshairData.crosshairId, name);

    this.setState({ inputValue: "" });
    this.toggle();
  }

  updateInputValue(event) {
    this.setState({
      inputValue: event.target.value,
    });
  }

  render() {
    console.log("Props:", this.props)
    let crosshairText;

    if (this.props.displayText === "Selects") {
      crosshairText = this.props.crosshairData.selectCount;
    } else if (this.props.displayText === "Saves") {
      crosshairText = this.props.crosshairData.saveCount;
    }
    console.log(this.props.displayText);

    return (
      <Col xs={12} sm={6} md={4} lg={3} xl={2}>
        <div
          className="demo-icons"
          onClick={() => {
            this.props.setCurrentActiveCrosshair(
              JSON.parse(this.props.crosshairData.crosshairId)
            );
            ipcRenderer.send(
              "setCurrentActiveCrosshair",
              this.props.crosshairData.crosshairId, 'featured page'
            );
          }}
        >
          <div className="position-top-right-icon">
            <Button className="btn-custom-round" onClick={this.toggle}>
              <Icon name="heart" />
            </Button>
            <Modal
              isOpen={this.state.modalOpen}
              toggle={this.toggle}
              className={this.props.className}
              centered
            >
              <div className="modal-header">
                <h5 className="modal-title h2"><Trans>Save</Trans></h5>
                <Button className="close" color="" onClick={this.toggle}>
                  <Icon name="x" />
                </Button>
              </div>
              <ModalBody>
                <span className="rui-icon rui-icon-stroke-1_5">
                  {render(JSON.parse(this.props.crosshairData.crosshairId))}
                </span>
                <div className="rui-gap-1" />
                <FormGroup>
                  <Label for="crosshairName"><Trans>Name</Trans></Label>
                  <Translation>
                  {t => <Input
                    type="text"
                    name="crosshairName"
                    id="crosshairName"
                    placeholder={t('Name')}
                    onChange={this.updateInputValue}
                    maxlength={16}
                  />}
                  </Translation>
                </FormGroup>
                <Row></Row>
              </ModalBody>
              <ModalFooter>
                <Button color="brand" onClick={this.saveCrosshair}>
                  <Trans>Save</Trans>
                </Button>
              </ModalFooter>
            </Modal>
          </div>




        <div className="cardStyle">
        
        <div className="cardDrawing">{render(JSON.parse(this.props.crosshairData.crosshairId))}</div>

        <div className="cardName">{this.props.crosshairData.name}</div>

        </div>
      </div>
      </Col>
    );
  }
}

export default FeaturedCard;

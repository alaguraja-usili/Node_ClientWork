/* eslint-disable */

import "./tutorial.scss";
import "../Featured/components/featuredCard.scss";
import { withTranslation } from 'react-i18next';
import React, { Component } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Badge,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const customStyles = {
  content: {
    width: "780px",
    height: "400px",
  },
};

import community from "../../../../common-assets/images/Tutorial/Community.png";
import designer from "../../../../common-assets/images/Tutorial/Designer.png";
import customimages from "../../../../common-assets/images/Tutorial/CustomImages.png";

import gamebar from "../../../../common-assets/images/Tutorial/GameBar-Animation.gif";

import Icon from "../../components/icon";
import TouchSpin from "../../components/touch-spin";
import data from "../../pages/Explore/backup-data/featured.json";
import LanguageSelector from "../../components/language-selector"

// import "./savedCard.scss";
import { render } from "../../utils/generateReactSvg";
import { Translation, Trans } from "react-i18next";
const { ipcRenderer } = window.require("electron");

class Tutorial extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasCompletedTutorial: true,
      pageNum: 0,
      demoPage: this.page1,
      hasSelectedInitialCrosshair: false,
    };
  }

  componentDidMount() {
    ipcRenderer.invoke("getStoreValue", "tutorial").then((tutorial) => {
      this.setState({
        hasCompletedTutorial: tutorial.hasCompletedTutorial,
      });
    });
  }

  render() {
    let demoPage;

    if (this.state.pageNum === 0)
      demoPage = (
        <>
          {/* <div style={{ width: "780px", height: "400px" }}> */}
          <div className="modal-header center-style">
            <Translation>
            {t => {
                            const str = t("tutorial_welcome_to_crosshair_x");
                            console.log(str);
                            const left = str.split("[[")[0];
                            const right = str.split("]]")[1];
              return <h1 className="h1" style={{ marginBottom: "0px" }}>


                
                {left} Crosshair <span className="text-brand">X</span> {right}
            </h1>}}
            </Translation>

            {/* <Button className="close" color="" onClick={this.close}>
                <Icon name="x" />
              </Button> */}
          </div>
          <ModalBody>
            <p class="text-center">
              <Translation>
                {t => t('select_a_language')}
              </Translation></p>
            <span className="rui-icon rui-icon-stroke-1_5">
              {/* {render(this.props.crosshairData.model)} */}
            </span>
            <div className="rui-gap-1" />
            {/* <Row></Row> */}
            <Row className="vertical-gap">
              <Col>
              <div style ={{maxHeight : "50px"}}>
              <LanguageSelector></LanguageSelector>
        </div>
        </Col>
        </Row>
            <div class="rui-gap-3"></div>
            <Row>
              <Col>
                <div style={{ height: "36px" }}>        
                    <Button
                      className="float-right"
                      color="brand"
                      onClick={() => {this.setState({ pageNum: 1 })}}
                    >
                      <span className="icon">
                        <Icon name="chevron-right" />
                      </span>
                    </Button>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </>
      );

    if (this.state.pageNum === 1)
      demoPage = (
        <>
          {/* <div style={{ width: "780px", height: "400px" }}> */}
          <div className="modal-header center-style">
            <h1 className="h1" style={{ marginBottom: "0px" }}>
              <Trans>select_a_crosshair</Trans>
            </h1>
            {/* <Button className="close" color="" onClick={this.close}>
                <Icon name="x" />
              </Button> */}
          </div>
          <ModalBody>
            <span className="rui-icon rui-icon-stroke-1_5">
              {/* {render(this.props.crosshairData.model)} */}
            </span>
            <div className="rui-gap-1" />
            {/* <Row></Row> */}
            <Row className="vertical-gap">
              <Col>
                <div
                  className="demo-icons"
                  onClick={() => {
                    this.props.setCurrentActiveCrosshair(
                      JSON.parse(data[0].crosshairId)
                    );
                    ipcRenderer.send(
                      "setCurrentActiveCrosshair",
                      data[0].crosshairId,
                      "tutorial"
                    );
                    this.setState({ hasSelectedInitialCrosshair: true });
                  }}
                >
                  <div
                    className="cardStyle"
                    style={{ marginBottom: "0px !important" }}
                  >
                    {render(JSON.parse(data[0].crosshairId))}
                  </div>
                  {/* {crosshairText} */}
                </div>
              </Col>
              <Col>
                <div
                  className="demo-icons"
                  onClick={() => {
                    this.props.setCurrentActiveCrosshair(
                      JSON.parse(data[1].crosshairId)
                    );
                    ipcRenderer.send(
                      "setCurrentActiveCrosshair",
                      data[1].crosshairId,
                      "tutorial"
                    );
                    this.setState({ hasSelectedInitialCrosshair: true });
                  }}
                >
                  <div
                    className="cardStyle"
                    style={{ marginBottom: "0px !important" }}
                  >
                    {render(JSON.parse(data[1].crosshairId))}
                  </div>
                  {/* {crosshairText} */}
                </div>
              </Col>
              <Col>
                <div
                  className="demo-icons"
                  onClick={() => {
                    this.props.setCurrentActiveCrosshair(
                      JSON.parse(data[2].crosshairId)
                    );
                    ipcRenderer.send(
                      "setCurrentActiveCrosshair",
                      data[2].crosshairId,
                      "tutorial"
                    );
                    this.setState({ hasSelectedInitialCrosshair: true }, () => {
                      this.setState({ demoPage: this.page1 });
                    });
                  }}
                >
                  <div
                    className="cardStyle"
                    style={{ marginBottom: "0px !important" }}
                  >
                    {render(JSON.parse(data[2].crosshairId))}
                  </div>
                  {/* {crosshairText} */}
                </div>
              </Col>
            </Row>
            <div class="rui-gap-3"></div>
            <Row>
              <Col>
                <Button
                  color="secondary"
                  className="float-left"
                  onClick={() => this.setState({ pageNum: 0 })}
                >
                  <span className="icon">
                    <Icon name="chevron-left" />
                  </span>
                </Button>
              </Col>
              <Col>
                <Button
                  className="float-right"
                  color="brand"
                  disabled={!this.state.hasSelectedInitialCrosshair}
                  onClick={() => this.setState({ pageNum: 2 })}
                >
                  <span className="icon">
                    <Icon name="chevron-right" />
                  </span>
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </>
      );

    if (this.state.pageNum === 2)
      demoPage = (
        <>
          {/* <div style={{ width: "780px", height: "400px" }}> */}
          <div className="modal-header center-style">
            <h1 className="h1" style={{ marginBottom: "0px" }}>
              <Trans>tutorial_introducing_community</Trans>
            </h1>
          </div>
          <ModalBody>
            <p class="text-center">
              <Trans>tutorial_introducing_community_subtitle</Trans>
            </p>
            <img
              style={{ width: "100%", height: "326px" }}
              src={community}
              alt="loading..."
            />
            <div class="rui-gap-3"></div>
            <Row>
              <Col>
                <Button
                  color="secondary"
                  className="float-left"
                  onClick={() => this.setState({ pageNum: 1 })}
                >
                  <span className="icon">
                    <Icon name="chevron-left" />
                  </span>
                </Button>
              </Col>
              <Col>
                <Button
                  className="float-right"
                  color="brand"
                  onClick={() => this.setState({ pageNum: 3 })}
                >
                  <span className="icon">
                    <Icon name="chevron-right" />
                  </span>
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </>
      );

    if (this.state.pageNum === 3)
      demoPage = (
        <>
          {/* <div style={{ width: "780px", height: "400px" }}> */}
          <div className="modal-header center-style">
            <h1 className="h1" style={{ marginBottom: "0px" }}>
              <Trans>Designer</Trans>
            </h1>
          </div>
          <ModalBody>
            <p class="text-center">
              <Trans>tutorial_designer_subtitle</Trans>
            </p>
            <img style={{ width: "100%" }} src={designer} alt="loading..." />
            <div class="rui-gap-3"></div>
            <Row>
              <Col>
                <Button
                  color="secondary"
                  className="float-left"
                  onClick={() => this.setState({ pageNum: 2 })}
                >
                  <span className="icon">
                    <Icon name="chevron-left" />
                  </span>
                </Button>
              </Col>
              <Col>
                <Button
                  className="float-right"
                  color="brand"
                  onClick={() => this.setState({ pageNum: 4 })}
                >
                  <span className="icon">
                    <Icon name="chevron-right" />
                  </span>
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </>
      );

    if (this.state.pageNum === 4)
      demoPage = (
        <>
        {/* <div style={{ width: "780px", height: "400px" }}> */}
        <div className="modal-header center-style">
          <h1 className="h1" style={{ marginBottom: "0px" }}>
            <Trans>images</Trans>
          </h1>
        </div>
        <ModalBody>
          <p class="text-center">
            <Trans>load-any-image-from-your-computer-and-use-it-as-your-crosshair</Trans>
          </p>
          <center>
          <img style={{ width: "70%" }} src={customimages} alt="loading..." />
          </center>
          <div class="rui-gap-3"></div>
          <Row>
            <Col>
              <Button
                color="secondary"
                className="float-left"
                onClick={() => this.setState({ pageNum: 3 })}
              >
                <span className="icon">
                  <Icon name="chevron-left" />
                </span>
              </Button>
            </Col>
            <Col>
              <Button
                className="float-right"
                color="brand"
                onClick={() => this.setState({ pageNum: 5 })}
              >
                <span className="icon">
                  <Icon name="chevron-right" />
                </span>
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </>
      );

      if (this.state.pageNum === 5)
      demoPage = (
        <>
          {/* <div style={{ width: "780px", height: "400px" }}> */}
          <div className="modal-header center-style">
            <h1 className="h1" style={{ marginBottom: "0px" }}>
              <Trans>tutorial_shortcuts_title</Trans>
            </h1>
          </div>
          <ModalBody>
            <Translation>
              {t => {
                
                return <p class="text-center">
                  {t('tutorial_shortcuts_toggle_shortcut').split("[[toggleShortcut]]").reduce((all, cur) => [
                                ...all,
                                <><Badge>Alt</Badge> + <Badge>Shift</Badge> +{" "}
                                <Badge>z</Badge></>,
                                cur
                              ])}
                </p>
              }}
            </Translation>

            <Translation>
            {t => {
                return <p class="text-center">
                  {t('tutorial_shortcuts_position_shortcut').split("[[positionShortcut]]").reduce((all, cur) => [
                                ...all,
                                <><Badge>Alt</Badge> + <Badge>Shift</Badge> +{" "}
                                <Icon name="arrow-left" /> <Icon name="arrow-up" />{" "}
                                <Icon name="arrow-down" /> <Icon name="arrow-right" /></>,
                                cur
                              ])}
                </p>
              }}
            </Translation>

            <Translation>
            {t => {
                return <p class="text-center"><b>
                  {t('visit-the-position-toggle-page-to-set-up-toggle-on-right-click-and-to-change-shortcuts')}
                  </b>
                </p>
              }}
            </Translation>
            <div class="rui-gap-3"></div>
            <Row>
              <Col>
                <Button
                  color="secondary"
                  className="float-left"
                  onClick={() => this.setState({ pageNum: 4 })}
                >
                  <span className="icon">
                    <Icon name="chevron-left" />
                  </span>
                </Button>
              </Col>
              <Col>
                <Button
                  className="float-right"
                  color="brand"
                  onClick={() => this.setState({ pageNum: 6 })}
                >
                  <span className="icon">
                    <Icon name="chevron-right" />
                  </span>
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </>
      );

    if (this.state.pageNum === 6)
      demoPage = (
        <>
          {/* <div style={{ width: "780px", height: "400px" }}> */}
          <div className="modal-header center-style">
            <h1 className="h1" style={{ marginBottom: "0px" }}>
              <Trans>tutorial_exclusive_fullscreen_title</Trans>
            </h1>
          </div>
          <ModalBody>
            {/* <p class="text-center">XBox Game Bar is a game overlay platform by Microsoft built for windows 10.</p> */}
            <p class="text-center">
                <Trans>tutorial_exclusive_fullscreen_subtitle</Trans>
               <br />
              <small class="text-secondary">
                <Trans>tutorial_exclusive_fullscreen_instructions_tip</Trans>
              </small>
            </p>

            <center>
              <img style={{ width: "200px" }} src={gamebar} alt="loading..." />
            </center>
            <div class="rui-gap-3"></div>
            <Row>
              <Col>
                <Button
                  color="secondary"
                  className="float-left"
                  onClick={() => this.setState({ pageNum: 5 })}
                >
                  <span className="icon">
                    <Icon name="chevron-left" />
                  </span>
                </Button>
              </Col>
              <Col>
                <Button
                  className="float-right"
                  color="brand"
                  onClick={() => {this.setState({ hasCompletedTutorial: true }); ipcRenderer.invoke('setStoreValue', 'tutorial', {hasCompletedTutorial: true}); ipcRenderer.invoke('setCrosshairPosition', 0, 0)}}
                >
                  <span className="icon">
                    <Trans>Finish</Trans>
                  </span>
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </>
      );

    console.log("Tutorial state:", this.state);
    return (
      <Modal
        modalTransition={{ timeout: 0 }}
        backdropTransition={{ timeout: 0 }}
        isOpen={!this.state.hasCompletedTutorial}
        // toggle={this.open}
        className="wide"
        // style={customStyles}
        centered
      >
        {demoPage}
        {/* </div> */}
      </Modal>
    );
  }
}

export default withTranslation()(Tutorial);
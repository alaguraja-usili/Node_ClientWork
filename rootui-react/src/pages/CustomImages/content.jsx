/* eslint-disable */
/**
 * External Dependencies
 */
// im tired of coding in general, so I'm going to use this library to make my life easier
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, ButtonGroup, Row, Col, Input, FormGroup } from "reactstrap";
import {
  setCurrentActiveCrosshair,
  setSavedCrosshairs,
} from "../../actions/index";

const { ipcRenderer } = window.require("electron");

import { Trans, Translation } from "react-i18next";

import Dropzone from "../../components/dropzone";

/**
 * Component
 */
class Content extends Component {
  constructor(props) {
    super(props);
  }



  componentWillReceiveProps(nextProps) {}

  // What should happen:
  // 1. User uploads image
  // 2. UI should show a spinner
  // 3. Fetch the b64 of the image
  // 4. Try to generate a unique id for the image
  // 5. Set to the current active crosshair
  // 6. Stop spinner and show the image

  // What is happening:
  // 1. User uploads image

  render() {
    return (
      <Fragment>
        <div Col style={{ maxWidth: "100%" }}></div>
        <Dropzone
          onChange={(files) => {

          }}
        ></Dropzone>
        <div style={{height: "1000px"}}>

        </div>
      </Fragment>
    );
  }
}

export default connect(
  ({ settings, currentActiveCrosshair, savedCrosshairs }) => ({
    settings,
    currentActiveCrosshair,
    savedCrosshairs: savedCrosshairs.savedCrosshairs,
  }),
  { setCurrentActiveCrosshair, setSavedCrosshairs }
)(withRouter(Content));

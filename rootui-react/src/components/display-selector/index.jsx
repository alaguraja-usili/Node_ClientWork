/* eslint-disable */
/**
 * External Dependencies
 */
// import React, { Component, Fragment } from "react";
import React from 'react';
import './index.css';
import { useEffect, useState } from 'react';
import { Trans, useTranslation, Translation } from "react-i18next";
import i18n from '../../i18n';

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
} from "reactstrap";

import Icon from "../icon";

const { ipcRenderer } = window.require("electron");

/**
 * Component
 */

function DisplaySelector(props) {
  const [data,setData] = useState();
  const [lastImage,setLastImage] = useState({});

  function moveTo(displayId) {
    console.log("Moved")
    ipcRenderer.send('move-to', displayId);
  }
  

  ipcRenderer.on('display-update', (event, data) => {
    if (! data) return;

    setData(data);
  });

  useEffect(() => {
    ipcRenderer.send("get-display");
  }, []);

  let screenDivs = [];

  if (data)
  for (let [index, screen] of data.entries()) {

    let imageOfScreenComponent;
    if (screen.thumbnail) {
      imageOfScreenComponent = screen.thumbnail;
      
      lastImage[screen.id] = screen.thumbnail;
    } else if (lastImage[screen.id]) {
      imageOfScreenComponent= [screen.id];
    }

    let aspectRatio = screen.size.height / screen.size.width
    console.log("Aspect ratio", screen)
    let width, height;
    if (aspectRatio > 1) {
      height = 200;
      width = 200 / aspectRatio;
    } else {
      width = 200;
      height = 200 * aspectRatio;
    }

    let formattedScreenComponent = 
    
    <div className="formattedContainer" onClick={() => moveTo(screen.id)} style={{backgroundImage: `url('${imageOfScreenComponent}')`, backgroundRepeat: "no-repeat", backgroundSize: "cover",         width: `${width}px`, height: `${height}px`}}>
    <div className="resolution">{screen.size.width + ' x ' + screen.size.height}</div>
    <div className="circle">{1 + index}</div>;
    </div>;

    screenDivs.push(formattedScreenComponent);
  }

    return (
      <div>
        {screenDivs}
        <hr style={{clear:"both"}}/>

      </div>
          
    );
}

export default DisplaySelector;

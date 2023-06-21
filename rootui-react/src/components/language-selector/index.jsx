/* eslint-disable */
/**
 * External Dependencies
 */
// import React, { Component, Fragment } from "react";
import React from 'react';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from "react-i18next";
import i18n from '../../i18n';

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
} from "reactstrap";

import Icon from "../../components/icon";

const { ipcRenderer } = window.require("electron");

/**
 * Component
 */
function LanguageSelector(props) {
    const [languagePref,setLanguagePref] = useState("en");



  useEffect(() => {
    ipcRenderer.invoke("getStoreValue", "languagePref").then((languagePref) => {
        setLanguagePref(languagePref)
    });
  }, []);

  const languageChangedHandler = (e) => {
    console.log("Language changed ", e);
    ipcRenderer.invoke("setStoreValue", "languagePref", e).then((languagePref) => {
        i18n.changeLanguage(e)
    });
    setLanguagePref(e)
    if (props.selectHandler) {
        props.selectHandler();
    }

  }



    return (
        <div>
        <FormGroup>
        <Input type="select" value={languagePref} onChange={(e) => languageChangedHandler(e.target.value)} name="languageSelector" id="languageSelector">
            <option value="en">English</option>
            <option value="ru">Русский</option>
            <option value="zhCN">简体中文</option>
            <option value="es">Español - España</option>
            <option value="es419">Español - Latinoamérica</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="pt">Português - Brasil</option>
            <option value="pl">Polski</option>
            <option value="it">Italiano</option>
            <option value="csCZ">Čeština</option>
            <option value="sv">Svenska</option>
            <option value="tr">Türkçe</option>
        </Input>
        </FormGroup>
        </div>
    );
}

export default LanguageSelector;

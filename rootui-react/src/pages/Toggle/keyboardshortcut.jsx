/* eslint-disable */
import React, { useState, useEffect, ipcRenderer } from "react";

import { withTranslation, WithTranslation, Trans } from "react-i18next";
import {
  Row,
  Col,
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
  Label,
  Input,
  CustomInput,
} from "reactstrap";
import i18n from "../../../src/i18n";
import "./style.scss";


function KeyboardShortcut(props) {
  // Name, Min,Max, featuretochange(ex firingOffset), unit(secs, px, etc)
  const [currentShortcut, setCurrentShortcut] = useState(props.keyboardShortcut || {
    key: "",
    modifiers: [],
  });

  const [inputValue, setInputValue] = useState(props.keyboardShortcut?.key || "");

  const [shortcutToSend, setShortcutToSend] = useState({key: "", modifiers: []});

  function isValid() {
    // If key is greater than 1 and there is atleast 1 modifier then it is valid
    if (currentShortcut.key.length > 0 && currentShortcut.modifiers.length > 0) {
      return shortcutToSend;
    }
    return false;
  }

//   // What happens when we're ready to save the shortcut
// function saveChanges() {
//   this.setState(
//     (prevState) => ({
//       shortcutToSend: {
//         key: inputValue.toUpperCase(),
//         modifiers: [currentShortcut.modifiers],
//       },
//     }),
//     () => {
//       ipcRenderer.invoke(
//         "setToggleShortcut",
//         JSON.stringify(shortcutToSend)
//       );
//     }
//   );
//   this.close();
// }

function handleShortcutCheckbox(event) {
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  const checkboxLength = checkboxes.length;
  let atleastOneChecked = false;

  for (let i = 0; i < checkboxLength; i++) {
    if (checkboxes[i].checked) atleastOneChecked = true;
  }

  const value = event.target.value;

  // Change the state of modifiers to include/exclude the modifier checked
  if (!event.target.checked) {
    // if we're removing it
    console.log("Attempt remove");
    const cloneModifiers = [...currentShortcut.modifiers];

    for (let i = cloneModifiers.length - 1; i >= 0; i--) {
      console.log("Test:", cloneModifiers[i], event.target.value);
      if (cloneModifiers[i] === event.target.value) {
        console.log("Yes remove", cloneModifiers.splice(i, 1));
        
        const obj = {
          key: currentShortcut.key,
          modifiers: cloneModifiers,
        }
        setCurrentShortcut(obj);
        props.updateState(obj);
      }
    }
  } else {
    // if we're adding it
    console.log("Yes add");
    const obj = {
      key: currentShortcut.key,
      modifiers: [...currentShortcut.modifiers, value],
    };
    setCurrentShortcut(obj);
    props.updateState(obj);
  }
  
}

  return (
    <div>
          <FormGroup check style={{paddingLeft: "0px", marginLeft: "0px"}} >
            <Label check>
              <CustomInput id="cb-1" label={<Badge>Alt</Badge>} type="checkbox" value="Alt" onChange={handleShortcutCheckbox} checked={currentShortcut && currentShortcut.modifiers.indexOf("Alt") > -1}/>{' '}
              
            </Label>
            <span style={{width: "20px", display: "inline-block"}}/>
            <Label check>
              <CustomInput id="cb-2" label={<Badge>Shift</Badge>} type="checkbox" value="Shift" onChange={handleShortcutCheckbox} checked={currentShortcut && currentShortcut.modifiers.indexOf("Shift") > -1}/>{' '}
              
            </Label>
            <span style={{width: "20px", display: "inline-block"}}/>

            <Label check>
              <CustomInput id="cb-3" label={<Badge>Ctrl</Badge>} type="checkbox" value="Ctrl" onChange={handleShortcutCheckbox} checked={currentShortcut && currentShortcut.modifiers.indexOf("Ctrl") > -1}/>{' '}
              
            </Label>
            <span style={{width: "20px", display: "inline-block"}}/>
          </FormGroup>

            <FormGroup style={{paddingTop: "10px"}}>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                  {currentShortcut && currentShortcut.modifiers.length > 0 ? currentShortcut.modifiers.map(
      (t,i) => <><Badge>{t}</Badge>&nbsp;+&nbsp;</>
    ) : <Trans>select-checkbox</Trans>}
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type="text"
                  name="toggleShortcut"
                  id="toggleShortcut"
                  placeholder={props.t('New Key') + ' (0-9, A-Z)'}
                  onChange={(e) => { 
                    setInputValue(e.target.value);
                    const obj
                    = { key: e.target.value, modifiers: currentShortcut.modifiers };
                    setCurrentShortcut(obj);
                    props.updateState(obj);

                  }}
                  value={inputValue}
                  maxlength={1}
                />
                {inputValue && inputValue.length == 1 && !inputValue.match(/[a-z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\\\s]/i) && <InputGroupAddon addonType="append">
                  <InputGroupText>
                  <p style={{color: "red", marginBottom: "0"}}><b>(0-9, A-Z)</b></p>
                  </InputGroupText>
                </InputGroupAddon>}
              </InputGroup>
              
            </FormGroup>

    </div>
  );
}

export default withTranslation()(KeyboardShortcut);

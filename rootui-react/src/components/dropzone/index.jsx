/* eslint-disable */

/**
 * Styles
 */
import "./style.scss";

/**
 * External Dependencies
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames/dedupe";
import Dropzone from "react-dropzone";
import fs from "fs";

/**
 * Internal Dependencies
 */
import Icon from "../icon";
import { fileSizeToHumanReadable } from "../../utils";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import { Link, withRouter } from "react-router-dom";
const { ipcRenderer } = window.require("electron");
import {
  setCurrentActiveCrosshair,
  setSavedCrosshairs,
} from "../../actions/index";
import AttributeSlider from "../../pages/Designer/components/AttributeSlider";
import ShareModal from "../../pages/CustomImages/components/ShareModal";
import { Trans, Translation } from "react-i18next";
import { contextIsolated } from "process";
import { render } from "../../utils/generateReactSvg";

/**
 * Component
 */
class ComponentDropzone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      imageSize: 1.0,
      imageTransparency: 1.0,
      imageSaveName: "",
      shareModalOpen: false,
      isLoadingImage: false,
      savedModalOpen: false,
    };

    this.onChange = this.onChange.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.saveToPresets = this.saveToPresets.bind(this);
    this.getImageType = this.getImageType.bind(this);
    this.openShareModal = this.openShareModal.bind(this);
    this.closeShareModal = this.closeShareModal.bind(this);
  }

  updateInputValue(event) {
    this.setState({
      imageSaveName: event.target.value,
    });
  }

  openShareModal(event) {
    this.setState({
      shareModalOpen: true,
    });
    console.log(this.state.shareModalOpen);
  }

  closeShareModal(event) {
    this.setState({
      shareModalOpen: false,
    });
    console.log(this.state.shareModalOpen);
  }

  saveToPresets() {
    let name = this.state.imageSaveName;
    if (name === undefined || name === "") {
      name = "New";
    }
    ipcRenderer.send(
      "saveNewCrosshair",
      JSON.stringify({
        name: this.state.files[0].name,
        size: this.state.files[0].size,
        localPath: this.state.files[0].localPath,
        imageType:
          this.state.files[0].imageType == null
            ? this.getImageType(this.state.files[0].localPath)
            : this.state.files[0].imageType,
        imageSize: this.state.imageSize,
        imageTransparency: this.state.imageTransparency,
      }),
      "customimages",
      name
    );

    this.setState({ imageSaveName: "" });

    const crosshairs = this.props.savedCrosshairs;

    const deepCopy = JSON.parse(
      JSON.stringify({
        name: this.state.files[0].name,
        localPath: this.state.files[0].localPath,
        size: this.state.files[0].size,
        imageType: this.getImageType(this.state.files[0].localPath),
        imageSize: this.state.imageSize,
        imageTransparency: this.state.imageTransparency,
      })
    );

    crosshairs.push({
      image: deepCopy,
      name: name,
      pos: {
        x: 0,
        y: 0,
      },
    });
    this.props.setSavedCrosshairs(crosshairs);
    this.state.savedModalOpen = true;
  }

  // create a function that generates an image type based on the file extension
  getImageType = (file) => {
    const extension = file.split(".").pop();
    switch (extension) {
      case "png":
        return "image/png";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "gif":
        return "image/gif";
      case "svg":
        return "image/svg+xml";
      default:
        return "unknown";
    }
  };

  componentWillReceiveProps(nextProps) {
    console.log("Next props:", nextProps);
    this.setState({ shareModalOpen: false }, () => {
      this.setState({ imageSaveName: nextProps.name });
    });
  }

  componentDidMount() {
    // fetch the current active crosshair from the main process data store
    console.log("Custom images component mounted");
    ipcRenderer.on("navigateTo", (event, arg) => {
      if (JSON.parse(arg).page != "customimages") {
        return;
      }
      console.log("Inside customimages");
      ipcRenderer.invoke("getStoreValue", "crosshairType").then((value) => {
        if (value === "customimages") {
          ipcRenderer
            .invoke("getStoreValue", "crosshairImage")
            .then((image) => {
              console.log(image);
              this.setState({
                files: [JSON.parse(image)],
                imageSize: JSON.parse(image).imageSize,
                imageTransparency: JSON.parse(image).imageTransparency,
                imageSaveName: JSON.parse(arg).name,
              });
            });
        }
      });
    });

    ipcRenderer.invoke("getStoreValue", "crosshairType").then((value) => {
      if (value === "customimages") {
        ipcRenderer.invoke("getStoreValue", "crosshairImage").then((image) => {
          console.log(image);
          this.setState({
            files: [JSON.parse(image)],
            imageSize: JSON.parse(image).imageSize,
            imageTransparency: JSON.parse(image).imageTransparency,
          });
        });
      }
    });
  }

  onChange() {
    const { onChange = () => {} } = this.props;

    onChange(this.state.files);
  }

  handleSliderChange(val, feature) {
    // this.state.currentActiveCrosshair is the crosshair as how it looks in the react state
    const obj = {};
    obj[feature] = val;
    this.setState(obj, () => {
      // console.log("Sending slider change to main process");
      // Uncomment the two lines below to update the crosshair and send it to the renderer
      ipcRenderer.send(
        "setCurrentActiveCrosshair",
        JSON.stringify({
          name: this.state.files[0].name,
          localPath: this.state.files[0].localPath,
          b64: this.state.files[0].b64,
          size: this.state.files[0].size,
          imageSize: this.state.imageSize,
          imageTransparency: this.state.imageTransparency,
          imageType:
            this.state.files[0].imageType == null
              ? this.getImageType(this.state.files[0].localPath)
              : this.state.files[0].imageType,
        }),
        "customimages"
      );
      // console.log("Sent slider change to main process");
    });
  }

  removeFile(file) {
    const newFiles = [...this.state.files];

    newFiles.splice(newFiles.indexOf(file), 1);

    this.setState(
      {
        files: newFiles,
      },
      this.onChange
    );
  }

  render() {
    const { settings } = this.props;

    return (
      <Dropzone
        accept="image/png, image/jpeg, image/gif, image/svg+xml"
        maxSize={1024 * 1024 * 20}
        maxFiles={1}
        onDropAccepted={(newFiles) => { 
          this.setState({
            uploadError: false,
          });
          try {
            this.setState({
              isLoadingImage: true,
            });

            // New image uploaded
            if (newFiles && newFiles.length > 0) {
              console.log("New image uploaded", newFiles[0]);

              // We need to copy the image to the app data folder and return the new path
              ipcRenderer
                .invoke("copyImageToAppData", newFiles[0].path)
                .then((newPath) => {
                  // Get the base64 encoded image
                  ipcRenderer.invoke("getB64", newPath)
                  .then((b64) => {
                    // Set the state to the new image
                    console.log(newFiles[0]);
                    newFiles[0].imageType = this.getImageType(newPath);
                    newFiles[0].localPath = newPath;
                    newFiles[0].b64 = b64;

                    // Figure out imageSize by looking at the dimensions of the image and making sure
                    // it fits within 200x200. If it fits then imageSize is 1, if its 400x400 then imageSize is 0.5
                    // if its 400x200 then imageSize is 0.5, if its 200x400 then imageSize is 0.5

                    ipcRenderer.invoke("getImageDimensions", newPath).then((size) => {
                      newFiles[0].width = size.width;
                      newFiles[0].height = size.height;

                    const imageSize = Math.min(Math.min(200 / size.width, 200 / size.height), 1.0);


                    const crosshairObj = {
                      b64: newFiles[0].b64,
                      size: newFiles[0].size,
                      imageType: newFiles[0].imageType,
                      imageSize: imageSize,
                      imageTransparency: 1.0,
                    };

                    ipcRenderer.invoke(
                      "uploadImage",
                      JSON.stringify(crosshairObj)
                    );

                    crosshairObj.localPath = newPath;
                    crosshairObj.name = newFiles[0].name;

                    this.setState(
                      {
                        files: [...this.state.files, ...newFiles],
                        imageSize: imageSize,
                        imageTransparency: 1.0,
                      },
                      () => {
                        console.log("Sending new image to main process");
                        ipcRenderer.send(
                          "setCurrentActiveCrosshair",
                          JSON.stringify(crosshairObj),
                          "customimages"
                        );
                      }
                    );
                  });
                });
                });
            }
          } catch (e) {
          } finally {
            this.setState({
              isLoadingImage: false,
            });
          }
        }
        }
        onDropRejected={(rejectedFiles) => {
          console.log("Rejected files", rejectedFiles);
          this.setState({
            uploadError: "File too large (20mb max) or not one of the expected file types (.png, .jpg, .gif, .svg)",
          });
        }}  
      >
        {(data) => {
          const rootProps = data.getRootProps();
          const inputProps = data.getInputProps();

          return (
            <div>
              <input {...inputProps} />
              {this.state.files && this.state.files.length ? (
                this.state.files.map((fileData) => {
                  const fileExt = fileData.name.split(".").pop();

                  return (
                    <div key={fileData.name} className="rui-dropzone-preview">
                      <Button
                        color="secondary"
                        className="btn-long"
                        onClick={(e) => {
                          e.stopPropagation();
                          this.removeFile(fileData);
                        }}
                      >
                        <ShareModal
                          crosshairObj={this.state.files[0]}
                          name={this.state.imageSaveName}
                          modalOpen={this.state.shareModalOpen}
                          modalClose={this.closeShareModal}
                        ></ShareModal>

                        <Modal isOpen={this.state.savedModalOpen}>
                          <ModalHeader><Trans>save-successful</Trans></ModalHeader>
                          <ModalBody>
                            <Trans>visit-the-saved-page-to-see-your-new-crosshair</Trans>
                            <div style={{ height: "30px" }} />
                            <img
                              style={{ maxHeight: "200px", maxWidth: "200px" }}
                              src={
                                // file path
                                fileData.localPath
                              }
                              className="icon-file"
                              type="file"
                              alt=""
                            />
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              color="brand"
                              onClick={() =>
                                this.setState({ savedModalOpen: false })
                              }
                            >
                              <Trans>Ok</Trans>
                            </Button>
                          </ModalFooter>
                        </Modal>

                        <Icon name="corner-up-left" />
                      </Button>

                      <div className="rui-gap-1"></div>
                      <div
                        style={{
                          float: "right",
                          minHeight: "50px",
                          marginLeft: "10px",
                        }}
                      >
                        <Button
                          color="brand"
                          className="btn-long"
                          onClick={this.saveToPresets}
                        >
                          <span className="text">
                            <Trans>Save</Trans>
                          </span>
                          <span className="icon">
                            <Icon name="heart" />
                          </span>
                        </Button>
                      </div>
                      <div
                        style={{
                          float: "right",
                          minHeight: "50px",
                          marginLeft: "10px",
                        }}
                      >
                        {/* <Button
                          color="brand"
                          className="btn-long"
                          onClick={this.openShareModal}
                        >
                          <span className="text"><Trans>Share</Trans></span>
                          <span className="icon">
                            <Icon name="share" />
                          </span>
                        </Button> */}
                      </div>
                      <div
                        style={{
                          overflow: "hidden",
                          minHeight: "50px",
                        }}
                      >
                        {" "}
                        <Translation>
                          {(t) => (
                            <Input
                              type="name"
                              name="name"
                              id="nameInput1"
                              placeholder={t("Name")}
                              style={{
                                display: "inline",
                                marginRight: "15px",
                              }}
                              onChange={this.updateInputValue}
                              value={this.state.imageSaveName}
                              maxlength={16}
                            />
                          )}
                        </Translation>
                      </div>
                      {/* red text saying Warning: Images larger in size will take longer to update */}
                      <p style={{ color: "grey" }}>
                        <Trans>
                          image-files-larger-in-size-will-take-longer-to-update
                        </Trans>
                      </p>
                      <div className="rui-dropzone-image">
                        {!this.state.isLoadingImage ? (
                          <img
                            style={{ maxHeight: "200px", maxWidth: "200px" }}
                            src={
                              // file path
                              fileData.localPath
                            }
                            className="icon-file"
                            type="file"
                            alt=""
                          />
                        ) : (
                          <Spinner></Spinner>
                        )}
                      </div>
                      <div className="rui-dropzone-details">
                        {/* <div className="rui-dropzone-size"><span>{ fileSizeToHumanReadable( fileData.size ) }</span></div> */}
                        {/* <div className="rui-dropzone-filename">
                          <span>{fileData.name}</span>
                        </div> */}
                      </div>
                      <div className="rui-gap-1"></div>

                      {/* <h1>
                        <Trans>Tools</Trans>{" "}
                      </h1>
                        <Button color="brand">Remove Background</Button>
                        <Button color="brand">Cutout</Button>
                        <Button color="brand">Paste Saved</Button>


                      <div className="rui-gap-1"></div> */}

                      <h1>
                        <Trans>Settings</Trans>{" "}
                      </h1>
                      <AttributeSlider
                        sliderOnChange={this.handleSliderChange}
                        name="size"
                        feature1="imageSize"
                        sliderValue={this.state.imageSize}
                        min={0.01}
                        max={3.0}
                        step={0.01}
                        unit=""
                      />
                      {/* create a gap */}
                      <div className="rui-gap"></div>
                      <AttributeSlider
                        sliderOnChange={this.handleSliderChange}
                        name="Opacity"
                        feature1="imageTransparency"
                        sliderValue={this.state.imageTransparency}
                        min={0.01}
                        max={1.0}
                        step={0.01}
                        unit=""
                      />
                    </div>
                  );
                })
              ) : (
                <div
                  className={classnames(
                    "rui-dropzone",
                    data.isDragActive ? "rui-dropzone-is-active" : ""
                  )}
                  {...rootProps}
                >

                  <div className="rui-dropzone-message">

                    <span className="rui-dropzone-icon">
                      <Icon name="upload-cloud" />
                    </span>
                    <span className="rui-dropzone-text">
                      <Trans>drop-image-here-or-click-to-upload</Trans>
                    </span>
                    <span>
                      <Trans>image-must-be-one-of-png-jpeg-jpg-gif-svg</Trans>
                    </span>
                  </div>

                </div>
                
              )}
              <br></br>
              {this.state.uploadError && <p style={{color: "red", fontWeight: "bold"}}>{this.state.uploadError}</p>}
              <Trans>note-this-feature-is-still-in-beta-if-you-encounter-any-bugs-please-report-them-to-us-in-our-discord-or-email</Trans>&nbsp;<Link to={"/support"}><Trans>visit-our-support-page</Trans></Link>

            </div>
          );
        }}
      </Dropzone>
    );
  }
}

export default connect(
  ({ settings, savedCrosshairs }) => ({
    settings,
    savedCrosshairs: savedCrosshairs.savedCrosshairs,
  }),
  { setSavedCrosshairs }
)(withRouter(ComponentDropzone));

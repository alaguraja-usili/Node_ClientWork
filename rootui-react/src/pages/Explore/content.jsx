/* eslint-disable */
/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trans, withTranslation } from 'react-i18next';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

// import { Chart } from 'react-chartjs-2';

import Icon from "../../components/icon";

/**
 * Internal Dependencies
 */
import Carousel from './components/carousel';
import { Spinner } from 'reactstrap';
import { setCurrentActiveCrosshair } from '../../actions/index';

import Tutorial from '../Tutorial/tutorial';

// Back up data incase of error
import featuredBackupData from './backup-data/featured.json';
import communityBackupData from './backup-data/community.json';
import ExtensionUpdateModal from '../../components/extension-update-modal';
// import ContentCreatorModal from '../../components/content-creator-modal';
const { ipcRenderer } = window.require('electron'); 


/**
 * Component
 */
class Content extends Component { 
    constructor(props) {
        super(props);
        this.setCurrentActiveCrosshairImage = this.setCurrentActiveCrosshairImage.bind(this);
    }
    
    setCurrentActiveCrosshairImage(crosshairData) {
        ipcRenderer.invoke('getB64', crosshairData.localPath).then((b64) => {
            console.log("Setting current active crosshair image", crosshairData)
            ipcRenderer.send('setCurrentActiveCrosshair', JSON.stringify({b64, ...crosshairData}), 'customimages');
        });
    }

    render() {
        let featuredComponent;
        if (this.props.dashboard.featured.isLoading) {
            featuredComponent = <Spinner color="brand">Loading...</Spinner>
        } else if (this.props.dashboard.featured.error) {
            featuredComponent = <Carousel source={"featured preview"} items={ featuredBackupData } setCurrentActiveCrosshair={this.props.setCurrentActiveCrosshair}></Carousel>
        } else if (this.props.dashboard.featured.data) {
            featuredComponent = <Carousel source={"featured preview"} items={ this.props.dashboard.featured.data.items } setCurrentActiveCrosshair={this.props.setCurrentActiveCrosshair}></Carousel>
        }

        let communityPreviewComponent;
        if (this.props.dashboard.communityPreview.isLoading) {
            communityPreviewComponent = <Spinner color="brand">Loading...</Spinner>
        } else if (this.props.dashboard.communityPreview.error) {
            communityPreviewComponent = <Carousel source={"community preview"} items={ communityBackupData.slice(0, 20) } setCurrentActiveCrosshair={this.props.setCurrentActiveCrosshair}></Carousel>
        } else if (this.props.dashboard.communityPreview.data) {
            communityPreviewComponent = <Carousel source={"community preview"} items={ this.props.dashboard.communityPreview.data.items.slice(0, 20) } setCurrentActiveCrosshair={this.props.setCurrentActiveCrosshair}></Carousel>
        }
        console.log("State:", this.state)
        let savedComponent;
        if (this.props === null || this.props.savedCrosshairs === undefined) {
            savedComponent = <></>
        } else if (this.props.savedCrosshairs.length > 0) {
            const carouselFormatted = this.props.savedCrosshairs.map((crosshair) => {
                const obj = {
                    name: crosshair.name,
                }
                // if its an image crosshair then we need to add the image to obj
                // if its a model crosshair then we need to add the model to obj
                if (crosshair.image) {
                    console.log("Image crosshair", crosshair.image)
                    obj.crosshairImage = JSON.stringify(crosshair.image)
                } else {
                    obj.crosshairId = JSON.stringify(crosshair.model)
                }

                return obj

            })

            savedComponent = <Carousel source={"saved preview"} items={carouselFormatted.slice(0,15)} setCurrentActiveCrosshair={this.props.setCurrentActiveCrosshair} setCurrentActiveCrosshairImage={this.setCurrentActiveCrosshairImage} />
        }

        return (
            <Fragment>
                <Tutorial setCurrentActiveCrosshair={this.props.setCurrentActiveCrosshair} />
                { /* Swiper */ }
                {/* <a style={{float: "right"}}>
                    Are you a content creator?
                </a>
                <ContentCreatorModal></ContentCreatorModal> */}


                <h2><Trans>Featured</Trans> &nbsp; <Link to="/featured"><Button color="brand" outline ><Trans>See all</Trans></Button></Link></h2>
                { featuredComponent }
                <div className="rui-gap-3" />
                <h2><Trans>Community</Trans> &nbsp; <Link to="/community"><Button color="brand" outline ><Trans>See all</Trans></Button></Link></h2>
                <p><Trans>explore_page_community_subtitle</Trans></p>
                { communityPreviewComponent }
                <div className="rui-gap-3" />
                <h2><Trans>Saved</Trans> &nbsp; <Link to="/saved"><Button color="brand" outline ><Trans>See all</Trans></Button></Link></h2>
                <p><Trans>explore_page_saved_subtitle</Trans></p>
                { savedComponent } 
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    settings: state.settings,
    dashboard: state.dashboard,
    savedCrosshairs: state.savedCrosshairs.savedCrosshairs,
})

const mapDispatchToProps = {
    setCurrentActiveCrosshair,
}

export default withTranslation()(connect( mapStateToProps, mapDispatchToProps )( Content ));

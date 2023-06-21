/* eslint-disable */
/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Button } from 'reactstrap';
import { Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';


/**
 * Internal Dependencies
 */
import { setSavedCrosshairs, setCurrentActiveCrosshair } from '../../actions/index';
import FeaturedCard from './components/featuredCard';
import axios from 'axios';
const { ipcRenderer } = window.require('electron'); 

/**
 * Component
 */
class Content extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sortBy: "Selects",
            community: {
                isLoading: true,
                error: false,
                data: null,
            }
        }

        this.addNewCrosshair = this.addNewCrosshair.bind(this);
    }

    addNewCrosshair(crosshairId, name) {
        ipcRenderer.send('saveNewCrosshair', crosshairId, 'featured page', name);
        const crosshairs = this.props.savedCrosshairs;
        crosshairs.push({
            model: JSON.parse(crosshairId),
            name: name,
            pos: {
                x: 0,
                y: 0,
            }
        });
        this.props.setSavedCrosshairs(crosshairs);
    }

    render() {
        let component;
        if (this.props === null || this.props.featured === undefined || this.props.featured.isLoading) {
            component = <Spinner> </ Spinner>
        } else if (this.props.featured.error || this.props.featured.data.items.length === 0) { 
            component =  <div style={ { margin: "auto" } }>
            <p className="display-4 mb-30"><Trans>something_went_wrong_featured_page</Trans></p>
            <p><Trans>Try</Trans>:</p>
            <ul>
                <li><Trans>Refreshing this page</Trans></li>
                <li><Trans>Rebooting Crosshair X</Trans></li>
                <li><Trans>reconnecting_to_internet</Trans></li>
                <li><a target="_blank" onClick={() => {ipcRenderer.send('new-window', 'https://centerpointgaming.com/contact.html')}}><Trans>let_us_know_having_an_issue</Trans></a></li>
            </ul>
            {this.state.community.errorMsg}

            <div class="rui-gap-1"></div>
            <Link to="/"><Button color="brand" ><Trans>Back Home</Trans></Button></Link>
        </div>
        } else {
            let cards = [].concat(this.props.featured.data.items)
            .map((crosshairData, index) => <FeaturedCard crosshairData={crosshairData} displayText={this.state.sortBy} setCurrentActiveCrosshair={this.props.setCurrentActiveCrosshair} addNewCrosshair={this.addNewCrosshair}></FeaturedCard>);

            component = <Row className="vertical-gap">
                {cards}
            </Row>
        }
        
        return (
            <Fragment>
                {/* This is the code for the select dropdown when we add that feature back in */}
                {/* <Input type="select" name="formSelect1" id="formSelect1" onChange={(e) => this.onSortDropdownChange(`${e.target.value}`)}>
                    <option>Sort by Selects</option>
                    <option>Sort by Saves</option>
                </Input> */}
                {/* <div className="rui-gap-3" /> */}
                {component}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    settings: state.settings,
    savedCrosshairs: state.savedCrosshairs.savedCrosshairs,
    featured: state.dashboard.featured,
})

const mapDispatchToProps = {
    setSavedCrosshairs,
    setCurrentActiveCrosshair,
}

export default connect( mapStateToProps, mapDispatchToProps )( Content );

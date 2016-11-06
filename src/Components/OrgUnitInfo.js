import React from 'react';
import {loadOrganisationUnits, loadUnitInfo} from '../api';

export default class OrgUnitInfo extends React.Component {
    constructor() {
        super();

        this.state = {
            isSaving: false,
            items: [],
            unitInfo: [],
        };
    }

    componentDidMount() {
        this.loadUnitInfo();
    }


    loadInfo() {
        console.log("loading");
        loadOrganisationUnits().then((organisationUnits) => {
            this.setState({
                items:organisationUnits,
            });
        });
    }

    // loads the information about an organisation unit
    //currently loads the same every time, should tak an id as parameter
    loadUnitInfo() {
        console.log("Loading unit info...");
        loadUnitInfo().then((organisationUnit) => {
            this.setState({
                unitInfo: organisationUnit,
            });
        });
    }


    render() {

        return (
            <div>
                <h1>OrgUnitInfo</h1>
                <h3>{this.state.unitInfo["displayName"]}</h3>
                <ul>
                    <li>Name: {this.state.unitInfo["displayName"]}</li>
                    <li>Opening date: {this.state.unitInfo["openingDate"]}</li>
                    <li>Coordinates: {this.state.unitInfo["coordinates"]}</li>
                    <li>ID: {this.state.unitInfo["id"]}</li>
                </ul>
            </div>
        )
    };

}
